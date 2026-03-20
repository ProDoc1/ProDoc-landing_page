
import React from 'react';
import { Message } from '../types';
import DoctorCard from './DoctorCard';
import Logo from '../assets/Logo.png';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatMessageProps {
  message: Message;
  onViewProfile?: (
    id: string,
    options?: { section?: 'overview' | 'reviews' }
  ) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onViewProfile }) => {
  const isUser = message.role === 'user';
  const isTyping = message.text === '...';

  // const wrapperClasses = `message-row ${isUser ? 'message-row-user' : 'message-row-bot'}`;
  const wrapperClasses = `flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'} mb-4`
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
                      {message.attachment && (
              <div className="mb-3 flex items-center space-x-2 text-sm bg-blue-700/50 p-2 rounded-lg border border-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-200">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                </svg>
                <span className="text-blue-100 truncate">{message.attachment.name}</span>
              </div>
            )}
           
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
            {message.reportAnalysis && (
              <div className={`mt-4 p-4 rounded-xl border ${
                message.reportAnalysis.status === 'red' ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' :
                message.reportAnalysis.status === 'yellow' ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800' :
                'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
              }`}>
                <div className="flex items-center space-x-2 mb-3">
                  <div className={`w-4 h-4 rounded-full ${
                    message.reportAnalysis.status === 'red' ? 'bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]' :
                    message.reportAnalysis.status === 'yellow' ? 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.8)]' :
                    'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]'
                  }`} />
                  <h4 className={`font-bold text-sm uppercase tracking-wider ${
                    message.reportAnalysis.status === 'red' ? 'text-red-800 dark:text-red-300' :
                    message.reportAnalysis.status === 'yellow' ? 'text-yellow-800 dark:text-yellow-300' :
                    'text-green-800 dark:text-green-300'
                  }`}>
                    {message.reportAnalysis.status === 'red' ? 'High Risk - Immediate Attention Required' :
                     message.reportAnalysis.status === 'yellow' ? 'Moderate Risk - Consultation Advised' :
                     'Safe - No Immediate Risk Detected'}
                  </h4>
                </div>
                <p className="text-sm text-gray-800 dark:text-gray-200 mb-4">
                  {message.reportAnalysis.overview}
                </p>
                <div className="text-xs text-gray-500 dark:text-gray-400 italic border-t border-gray-200 dark:border-gray-700 pt-3">
                  <span className="font-bold text-gray-700 dark:text-gray-300">Disclaimer:</span> The results given by AI are not completely accurate and can make mistakes. This overview is not a substitute for professional medical advice. Always consult a doctor for a definitive diagnosis.
                </div>
              </div>
            )}
        </div>
        {message.doctor && (
            <div className="doctor-card-wrap">
                <DoctorCard
                  doctor={message.doctor}
                  actionType={message.doctorAction}
                  onViewProfile={onViewProfile}
                />
            </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
