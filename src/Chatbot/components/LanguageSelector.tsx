
import React from 'react';
import { Language } from '../types';

interface LanguageSelectorProps {
  selectedLanguage: Language;
  onLanguageChange: (language: Language) => void;
  languages: { value: Language; label: string; shortLabel: string }[];
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ selectedLanguage, onLanguageChange, languages }) => {
  return (
    <div className="language-bar">
      <div className="language-switcher">
        {languages.map(({ value, label, shortLabel }) => (
          <button
            key={value}
            onClick={() => onLanguageChange(value)}
            className={`language-pill ${selectedLanguage === value ? 'active' : ''}`}
            aria-pressed={selectedLanguage === value}
            title={`Switch to ${label}`}
          >
           <span className="language-short">{shortLabel}</span>
           <span className="language-full">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;
