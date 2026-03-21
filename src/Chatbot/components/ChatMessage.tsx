
import React from 'react';
import { Message } from '../types';
import DoctorCard from './DoctorCard';
import Logo from '../assets/Logo_white.png';
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
  const reportStatusMeta = message.reportAnalysis
    ? message.reportAnalysis.status === 'red'
      ? {
          panelClass: 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800',
          dotClass: 'bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]',
          headingClass: 'text-red-800 dark:text-red-300',
          colorName: 'Red',
          colorHex: '#dc2626',
          colorSoft: 'rgba(220, 38, 38, 0.16)',
          title: 'RED - High Risk: Immediate Attention Required',
          meaning:
            'Red means your report may include urgent warning signs that need prompt medical review.',
          action:
            'Please seek care immediately from the recommended specialist or nearest emergency service if symptoms worsen.'
        }
      : message.reportAnalysis.status === 'yellow'
        ? {
            panelClass: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800',
            dotClass: 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.8)]',
            headingClass: 'text-yellow-800 dark:text-yellow-300',
            colorName: 'Yellow',
            colorHex: '#ca8a04',
            colorSoft: 'rgba(202, 138, 4, 0.16)',
            title: 'YELLOW - Moderate Risk: Consultation Advised',
            meaning:
              'Yellow means there may be concerning findings that are not immediately critical but should be assessed soon.',
            action:
              'Please book a consultation with the recommended specialist and monitor your symptoms closely.'
          }
        : {
            panelClass: 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800',
            dotClass: 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]',
            headingClass: 'text-green-800 dark:text-green-300',
            colorName: 'Green',
            colorHex: '#16a34a',
            colorSoft: 'rgba(22, 163, 74, 0.16)',
            title: 'GREEN - Safe: No Immediate Risk Detected',
            meaning:
              'Green means no urgent risk was detected from the uploaded report at this time.',
            action:
              'Continue healthy habits and routine follow-up. Consult a doctor if new symptoms appear.'
          }
    : null;

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
            {message.reportAnalysis && reportStatusMeta && (
              <div className={`mt-4 p-4 rounded-xl border ${reportStatusMeta.panelClass}`}>
                <div className="report-color-row" aria-label={`Risk color: ${reportStatusMeta.colorName}`}>
                  <div
                    className="report-color-swatch"
                    style={{
                      background: `linear-gradient(90deg, ${reportStatusMeta.colorHex} 0%, ${reportStatusMeta.colorSoft} 100%)`
                    }}
                  />
                  <span
                    className="report-color-pill"
                    style={{
                      color: reportStatusMeta.colorHex,
                      borderColor: reportStatusMeta.colorHex,
                      backgroundColor: reportStatusMeta.colorSoft
                    }}
                  >
                    {reportStatusMeta.colorName}
                  </span>
                </div>
                <div className="flex items-center space-x-2 mb-3">
                  <div className={`w-4 h-4 rounded-full ${reportStatusMeta.dotClass}`} />
                  <h4 className={`font-bold text-sm uppercase tracking-wider ${reportStatusMeta.headingClass}`} style={{ color: reportStatusMeta.colorHex }}>
                    {reportStatusMeta.title}
                  </h4>
                </div>
                <div className="mb-3 rounded-lg border border-black/10 bg-white/70 px-3 py-2">
                  <p className={`text-[11px] font-extrabold uppercase tracking-wider ${reportStatusMeta.headingClass}`} style={{ color: reportStatusMeta.colorHex }}>
                    What This Color Means
                  </p>
                  <p className="mt-1 text-sm text-gray-800 dark:text-gray-200">{reportStatusMeta.meaning}</p>
                  <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">{reportStatusMeta.action}</p>
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
