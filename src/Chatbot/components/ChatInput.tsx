import React, { useState, useRef } from 'react';
import { LoaderCircle, Paperclip, SendHorizontal, X } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (text: string, file?: File) => void | Promise<void>;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [text, setText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const submitMessage = () => {
    if ((text.trim() || selectedFile) && !isLoading) {
      onSendMessage(text, selectedFile || undefined);
      setText('');
      setSelectedFile(null);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="chat-input-form">
      {selectedFile && (
        <div className="chat-file-pill">
          <div className="chat-file-meta">
            <Paperclip className="chat-file-icon" />
            <span className="chat-file-name" title={selectedFile.name}>
              {selectedFile.name}
            </span>
          </div>
          <button
            type="button"
            className="chat-file-remove"
            aria-label="Remove selected file"
            onClick={() => {
              setSelectedFile(null);
              if (fileInputRef.current) fileInputRef.current.value = '';
            }}
          >
            <X className="chat-file-remove-icon" />
          </button>
        </div>
      )}

      <div className="chat-input-main">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,.jpg,.jpeg,.png,.webp"
          className="chat-file-input"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="attach-button"
          disabled={isLoading}
          aria-label="Upload medical report"
          title="Upload medical report (PDF or image)"
        >
          <Paperclip className="attach-button-icon" />
        </button>

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
          disabled={isLoading || (!text.trim() && !selectedFile)}
          className="send-button"
          aria-label={isLoading ? 'Sending message' : 'Send message'}
        >
          {isLoading ? (
            <LoaderCircle className="send-button-icon spin" />
          ) : (
            <SendHorizontal className="send-button-icon" />
          )}
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
