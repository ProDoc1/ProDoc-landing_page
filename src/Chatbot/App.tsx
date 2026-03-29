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
  overview?: string;
  reason?: string;
  translated_name?: string;
}

interface ReportAnalysisPayload extends RecommendationPayload {
  status: ReportAnalysis['status'];
  overview: string;
}

const buildSymptomRecommendationMessage = ({
  overview,
  reason,
  doctorLabel
}: {
  overview: string;
  reason: string;
  doctorLabel?: string;
}): string => {
  const parts: string[] = [];

  if (overview) {
    parts.push(`Symptom/Disease Overview:\n${overview}`);
  }

  if (doctorLabel || reason) {
    const doctorLine = doctorLabel
      ? `Recommended Doctor: ${doctorLabel}`
      : 'Recommended Doctor: Please consult the specialist shown below.';
    const reasonLine = reason ? `Recommendation Reason: ${reason}` : '';
    parts.push([doctorLine, reasonLine].filter(Boolean).join('\n'));
  }

  return parts.join('\n\n').trim();
};

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

const App: React.FC<AppProps> = ({ onViewProfile }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [chat, setChat] = useState<Chat | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the bottom of the chat container when messages change
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
        .replace('{doctors}', JSON.stringify(doctorsList));
      
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

      // Create a placeholder for the bot's message
      setMessages((prev) => [...prev, { id: botMessageId, role: 'bot', text: '...' }]);

      for await (const chunk of stream) {
        const c = chunk as GenerateContentResponse;
        fullResponseText += c.text;
        
        // Update the bot's message in real-time
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
        const overviewText = (activePayload.overview || '').trim();
        const reasonText = (activePayload.reason || '').trim();
        const translatedName = (activePayload.translated_name || '').trim();

        if (foundDoctor) {
          doctor = {
            ...foundDoctor,
            reason:
              reasonText ||
              (currentAction === 'leave_review'
                ? `You can leave a review for ${foundDoctor.full_name}. Use the button below to open the review form.`
                : foundDoctor.reason || 'Please consult this specialist for further evaluation.'),
            translated_name: translatedName || foundDoctor.translated_name
          } as Doctor;
          doctorAction = currentAction;
          if (currentAction === 'view_profile') {
            const doctorDisplayName =
              translatedName || foundDoctor.translated_name || foundDoctor.full_name;
            const doctorLabel = `${doctorDisplayName} (${foundDoctor.specialty})`;
            finalText =
              buildSymptomRecommendationMessage({
                overview: overviewText,
                reason: reasonText || doctor.reason,
                doctorLabel
              }) || doctor.reason;
          } else {
            finalText = reasonText || doctor.reason;
          }
        } else if (currentAction === 'view_profile') {
          const fallbackDoctorLabel = translatedName
            ? translatedName
            : doctorId
              ? `Doctor ID ${doctorId}`
              : undefined;
          finalText =
            buildSymptomRecommendationMessage({
              overview: overviewText,
              reason: reasonText,
              doctorLabel: fallbackDoctorLabel
            }) || fullResponseText;
        } else if (reasonText) {
          finalText = reasonText;
        } else if (overviewText) {
          finalText = overviewText;
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
        // Check if the placeholder was already added to the screen
        const messageExists = prev.some(msg => msg.id === botMessageId);
        
        if (messageExists) {
          // If it exists (e.g., error happened mid-stream), update it
          return prev.map((msg) => 
            msg.id === botMessageId ? { ...msg, text: msg.text + '\n\n' + errorMessage } : msg
          );
        } else {
          // If it doesn't exist (e.g., immediate 429 error), add it as a new message
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
