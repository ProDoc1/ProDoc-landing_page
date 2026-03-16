
import React from 'react';
import { Message } from '../types';
import DoctorCard from './DoctorCard';
import Logo from '../assets/Logo_white.png';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatMessageProps {
  message: Message;
  onViewProfile?: (id: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onViewProfile }) => {
  const isUser = message.role === 'user';
  const isTyping = message.text === '...';

  const wrapperClasses = `message-row ${isUser ? 'message-row-user' : 'message-row-bot'}`;
  const bubbleClasses = `chat-bubble ${isUser ? 'chat-bubble-user' : 'chat-bubble-bot'}`;

  return (
    <div className={wrapperClasses}>
      {!isUser && (
        <div className="ai-avatar">
          <img src={Logo} alt="AI Avatar" className="ai-avatar-image" />
        </div>
      )}
      <div className="message-content">
        <div className={bubbleClasses}>
            {isTyping ? (
                 <div className="typing-indicator" aria-label="AI is typing">
                    <span className="typing-dot" style={{ animationDelay: '0.1s' }}></span>
                    <span className="typing-dot" style={{ animationDelay: '0.2s' }}></span>
                    <span className="typing-dot" style={{ animationDelay: '0.3s' }}></span>
                 </div>
            ) : (
                <div className="markdown-content text-[15px] leading-relaxed">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message.text}
                    </ReactMarkdown>
                </div>
            )}
        </div>
        {message.doctor && (
            <div className="doctor-card-wrap">
                <DoctorCard doctor={message.doctor} onViewProfile={onViewProfile} />
            </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
