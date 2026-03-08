
import React from 'react';
import { Message } from '../types';
import DoctorCard from './DoctorCard';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const isTyping = message.text === '...';

  const wrapperClasses = `message-row ${isUser ? 'message-row-user' : 'message-row-bot'}`;
  const bubbleClasses = `chat-bubble ${isUser ? 'chat-bubble-user' : 'chat-bubble-bot'}`;

  return (
    <div className={wrapperClasses}>
      {!isUser && (
        <div className="ai-avatar">
          AI
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
                <p>{message.text}</p>
            )}
        </div>
        {message.doctor && (
            <div className="doctor-card-wrap">
                <DoctorCard doctor={message.doctor} />
            </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
