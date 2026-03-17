// import React, { useState, useRef } from 'react';

// interface ChatInputProps {
//   onSendMessage: (message: string) => void;
//   isLoading: boolean;
// }

// const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
//   const [text, setText] = useState('');
//   const textareaRef = useRef<HTMLTextAreaElement>(null);

//   const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     setText(e.target.value);
//     // Auto-resize textarea
//     if (textareaRef.current) {
//         textareaRef.current.style.height = 'auto';
//         textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
//     }
//   };

//   const submitMessage = () => {
//     if (text.trim() && !isLoading) {
//       onSendMessage(text);
//       setText('');
//       // Reset the textarea height after sending
//       if (textareaRef.current) {
//         textareaRef.current.style.height = 'auto';
//       }
//     }
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     submitMessage();
//   };

//   const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       submitMessage();
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="chat-input-form">
//       <textarea
//         ref={textareaRef}
//         value={text}
//         onChange={handleInputChange}
//         onKeyDown={handleKeyPress}
//         placeholder="Type your symptoms here..."
//         className="chat-textarea"
//         rows={1}
//         disabled={isLoading}
//       />
//       <button
//         type="submit"
//         disabled={isLoading || !text.trim()}
//         className="send-button"
//         aria-label={isLoading ? 'Sending message' : 'Send message'}
//       >
//         {isLoading ? (
//           <svg className="send-button-icon spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//             <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//             <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//           </svg>
//         ) : (
//           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="send-button-icon">
//             <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
//           </svg>
//         )}
//       </button>
//     </form>
//   );
// };

// export default ChatInput;
import React, { useState, useRef } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    // Auto-resize textarea
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const submitMessage = () => {
    if (text.trim() && !isLoading) {
      onSendMessage(text);
      setText('');
      // Reset the textarea height after sending
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMessage();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitMessage();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="chat-input-form">
      <textarea
        ref={textareaRef}
        value={text}
        onChange={handleInputChange}
        onKeyDown={handleKeyPress}
        placeholder="Type your symptoms here..."
        className="chat-textarea"
        rows={1}
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading || !text.trim()}
        className="send-button"
        aria-label={isLoading ? 'Sending message' : 'Send message'}
      >
        {isLoading ? (
          <svg className="send-button-icon spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="send-button-icon">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
          </svg>
        )}
      </button>
    </form>
  );
};

export default ChatInput;

