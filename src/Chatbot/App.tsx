import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, Chat, GenerateContentResponse } from '@google/genai';
import { Language, Message, Doctor } from './types';
import { SYSTEM_PROMPT_TEMPLATE, INITIAL_GREETINGS } from './constants';
import { DOCTORS } from './doctors';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import Header from './components/Header';
import Disclaimer from './components/Disclaimer';
import './index.css';

interface AppProps {
  onViewProfile?: (id: string) => void;
}

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY
});
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

  const handleSendMessage = async (inputText: string) => {
    if (!inputText.trim() || isLoading || !chat) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);

    let fullResponseText = '';
    const botMessageId = (Date.now() + 1).toString();

    try {
      const stream = await chat.sendMessageStream({ message: inputText });

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
      
      const recommendationPrefix = 'DOCTOR_RECOMMENDATION::';
      let doctor: Doctor | undefined;
      let finalText = fullResponseText;

      if (fullResponseText.startsWith(recommendationPrefix)) {
          const jsonString = fullResponseText.substring(recommendationPrefix.length);
          try {
              const recommendation: { doctor_id: string; reason: string; translated_name: string } = JSON.parse(jsonString);
              const foundDoctor = DOCTORS.find(d => d.doctor_id === recommendation.doctor_id);
              if (foundDoctor) {
                    doctor = { 
                    ...foundDoctor, 
                    reason: recommendation.reason,
                    translated_name: recommendation.translated_name 
                  } as Doctor;
              } else {
                  finalText = fullResponseText;
              }
          } catch (e) {
              console.error("Failed to parse doctor recommendation JSON:", e);
              finalText = fullResponseText; // Fallback to showing raw response
          }
      }

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMessageId ? { ...msg, text: finalText, doctor } : msg
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
    } finally {
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
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {isLoading && messages[messages.length - 1]?.role === 'user' && (
            <ChatMessage key="loading" message={{ id: 'loading', role: 'bot', text: '...' }} />
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
