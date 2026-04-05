import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, Chat, GenerateContentResponse } from '@google/genai';
import { Language, Message, Doctor, DoctorAction, ReportAnalysis } from './types';
import { SYSTEM_PROMPT_TEMPLATE, INITIAL_GREETINGS } from './constants';
import { DOCTORS } from './doctors';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import Header from './components/Header';
import Disclaimer from './components/Disclaimer';
import './index.css';

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

interface AppProps {
  onViewProfile?: (
    id: string,
    options?: { section?: 'overview' | 'reviews' }
  ) => void;
}

interface RecommendationPayload {
  doctor_id: string | number;
  reason?: string;
  translated_name?: string;
}

interface ReportAnalysisPayload extends RecommendationPayload {
  status: ReportAnalysis['status'];
  overview: string;
}

const extractPayloadWithPrefix = <T extends object = RecommendationPayload>(
  responseText: string,
  prefix: string
): T | null => {
  const prefixIndex = responseText.indexOf(prefix);
  if (prefixIndex === -1) return null;

  const jsonStart = responseText.indexOf('{', prefixIndex + prefix.length);
  if (jsonStart === -1) return null;

  let bracketDepth = 0;
  let jsonEnd = -1;
  for (let i = jsonStart; i < responseText.length; i += 1) {
    if (responseText[i] === '{') bracketDepth += 1;
    if (responseText[i] === '}') {
      bracketDepth -= 1;
      if (bracketDepth === 0) {
        jsonEnd = i;
        break;
      }
    }
  }

  if (jsonEnd === -1) return null;

  const jsonString = responseText.slice(jsonStart, jsonEnd + 1);
  try {
    return JSON.parse(jsonString) as T;
  } catch {
    return null;
  }
};

type AuthenticatedRole = 'patient' | 'doctor';

const PROFILE_REQUEST_REGEX =
  /\b(my profile|view my profile|show my profile|open my profile|my dashboard|view dashboard|open dashboard|redirect me to dashboard|my account)\b/i;

const DASHBOARD_REFERENCE_REGEX =
  /(https?:\/\/www\.prodocweb\.com\/dashboard\b|https?:\/\/www\.prodocweb\.com\/doctor-dashboard\b|\/dashboard\b|\/doctor-dashboard\b|my dashboard|profile dashboard)/i;

const getAuthenticatedRole = (): AuthenticatedRole | null => {
  const authToken = localStorage.getItem('authToken');
  const userRole = localStorage.getItem('userRole');
  const storedUser = localStorage.getItem('prodoc_user');

  if (!authToken || !storedUser) return null;

  try {
    JSON.parse(storedUser);
  } catch {
    return null;
  }

  if (userRole === 'patient' || userRole === 'doctor') {
    return userRole;
  }

  return null;
};

const isProfileAccessRequest = (inputText: string): boolean =>
  PROFILE_REQUEST_REGEX.test(inputText.trim());

const buildProfileAccessMessage = (role: AuthenticatedRole | null): string => {
  if (!role) {
    return 'Please log in first to access your profile dashboard. Go to /login, sign in, and then ask me to view your profile.';
  }

  return role === 'doctor'
    ? 'You are logged in. Open your doctor dashboard here: /doctor-dashboard'
    : 'You are logged in. Open your patient dashboard here: /dashboard';
};

const enforceGuestProfileRestriction = (
  responseText: string,
  isAuthenticated: boolean
): string => {
  if (isAuthenticated || !DASHBOARD_REFERENCE_REGEX.test(responseText)) {
    return responseText;
  }

  return 'Please log in first to access your profile dashboard. Go to /login, sign in, and then ask me to view your profile.';
};

const App: React.FC<AppProps> = ({ onViewProfile }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [chat, setChat] = useState<Chat | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  
  const initializeChat = useCallback(() => {
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("Gemini API key not found");
}

const ai = new GoogleGenAI({ apiKey });
const doctorsList = DOCTORS.map(d => ({
        id: d.doctor_id,
        name: d.full_name,
        specialty: d.specialty,
        bio: d.bio,
        hospital: d.working_hospital,
        experience: d.years_of_experience
      }));
      const systemInstruction = SYSTEM_PROMPT_TEMPLATE
        .replace('{doctors}', JSON.stringify(doctorsList))
        .replace('{profile_access}', getAuthenticatedRole() ? 'ALLOWED' : 'BLOCKED');
      
      const newChat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: systemInstruction,
        },
      });
      setChat(newChat);

      const greeting = `${INITIAL_GREETINGS[Language.EN]}\n\n${INITIAL_GREETINGS[Language.SI]}\n\n${INITIAL_GREETINGS[Language.TA]}`;

      setMessages([
        {
          id: 'initial-greeting',
          role: 'bot',
          text: greeting,
        }
      ]);
    } catch (error) {
       console.error("Failed to initialize chat:", error);
       setMessages([{ id: 'error-init', role: 'bot', text: 'Error: Could not initialize AI chat. Please check the API key and refresh.' }]);
    }
  }, []);
  
  useEffect(() => {
    initializeChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initializeChat]);

  const handleSendMessage = async (inputText: string, file?: File) => {
    if ((!inputText.trim() && !file) || isLoading || !chat) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      attachment: file ? { url: URL.createObjectURL(file), mimeType: file.type, name: file.name } : undefined
    
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    if (!file && isProfileAccessRequest(inputText)) {
      const role = getAuthenticatedRole();
      const profileAccessReply: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        text: buildProfileAccessMessage(role)
      };
      setMessages((prevMessages) => [...prevMessages, profileAccessReply]);
      return;
    }

    setIsLoading(true);

    let fullResponseText = '';
    const botMessageId = (Date.now() + 1).toString();

    try {
      let messageContent: any = inputText;
      if (file) {
        const base64 = await fileToBase64(file);
        const base64Data = base64.split(',')[1];
        messageContent = [
          { text: inputText || "Please analyze this medical report." },
          { inlineData: { data: base64Data, mimeType: file.type } }
        ];
      }
      const stream = await chat.sendMessageStream({ message: messageContent });

      setMessages((prev) => [...prev, { id: botMessageId, role: 'bot', text: '...' }]);

      for await (const chunk of stream) {
        const c = chunk as GenerateContentResponse;
        fullResponseText += c.text;
        
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessageId ? { ...msg, text: fullResponseText } : msg
          )
        );
      }


      const reportPrefix = 'REPORT_ANALYSIS::';
      let reportAnalysis: ReportAnalysis | undefined;
      
      let doctor: Doctor | undefined;
      let doctorAction: DoctorAction | undefined;
      let finalText = fullResponseText;

      const reviewRedirect = extractPayloadWithPrefix<RecommendationPayload>(fullResponseText, 'DOCTOR_REVIEW_REDIRECT::');
      const recommendation = extractPayloadWithPrefix<RecommendationPayload>(fullResponseText, 'DOCTOR_RECOMMENDATION::');
      const reportPayload = extractPayloadWithPrefix<ReportAnalysisPayload>(fullResponseText, reportPrefix);
      const activePayload = reviewRedirect || recommendation;

      if (activePayload) {
        const currentAction: DoctorAction = reviewRedirect ? 'leave_review' : 'view_profile';
        const doctorId = String(activePayload.doctor_id).trim();
        const foundDoctor = DOCTORS.find((d) => d.doctor_id === doctorId);
        const reasonText = (activePayload.reason || '').trim();

        if (foundDoctor) {
          doctor = {
            ...foundDoctor,
            reason:
              reasonText ||
              (currentAction === 'leave_review'
                ? `You can leave a review for ${foundDoctor.full_name}. Use the button below to open the review form.`
                : foundDoctor.reason || 'Please consult this specialist for further evaluation.'),
            translated_name: activePayload.translated_name || foundDoctor.translated_name
          } as Doctor;
          doctorAction = currentAction;
          finalText = doctor.reason;
        } else if (reasonText) {
          finalText = reasonText;
        }
      } else if (reportPayload) {
        try {
          const rawStatus = String(reportPayload.status || '').toLowerCase();
          const normalizedStatus: ReportAnalysis['status'] =
            rawStatus === 'red' || rawStatus === 'yellow' || rawStatus === 'green'
              ? rawStatus
              : 'green';

          const analysis: ReportAnalysisPayload = {
            ...reportPayload,
            status: normalizedStatus
          };

          reportAnalysis = {
            status: analysis.status,
            overview: analysis.overview
          };

          if (analysis.doctor_id) {
            const foundDoctor = DOCTORS.find((d) => d.doctor_id === String(analysis.doctor_id));
            if (foundDoctor) {
              doctor = {
                ...foundDoctor,
                reason: analysis.reason || foundDoctor.reason,
                translated_name: analysis.translated_name || foundDoctor.translated_name
              } as Doctor;
            }
          }

          finalText = 'Here is the analysis of your medical report:';
        } catch (e) {
          console.error('Failed to parse report analysis JSON:', e);
          finalText = fullResponseText;
        }
      }

      finalText = enforceGuestProfileRestriction(finalText, Boolean(getAuthenticatedRole()));

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMessageId
            ? { ...msg, text: finalText, doctor, doctorAction, reportAnalysis }
            : msg
        )
      );

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = 'Sorry, I hit a rate limit or encountered an error. Please wait 60 seconds and try again.';
      
      setMessages((prev) => {
        const messageExists = prev.some(msg => msg.id === botMessageId);

        if (messageExists) {
          // Mid-stream error: append error text to the partial response
          return prev.map((msg) =>
            msg.id === botMessageId ? { ...msg, text: msg.text + '\n\n' + errorMessage } : msg
          );
        } else {
          // Immediate error (e.g. 429 before first token): insert a new error message
          return [...prev, { id: botMessageId, role: 'bot', text: errorMessage, doctor: undefined }];
        }
      });
    } 
    
    finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <div className="app-frame">
        <Header />
        
        <Disclaimer />
        <div
          ref={chatContainerRef}
          className="chat-scroll"
        >
          
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} onViewProfile={onViewProfile} />
          ))}
          {isLoading && messages[messages.length - 1]?.role === 'user' && (
            <ChatMessage
              key="loading"
              message={{ id: 'loading', role: 'bot', text: '...' }}
              onViewProfile={onViewProfile}
            />
          )}
        </div>
        <div className="chat-input-wrap">
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default App;
