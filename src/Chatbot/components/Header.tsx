
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="top-header">
      <div className="brand-row">
        <div className="brand-icon">
          <svg xmlns="http://www.w3.org/2000/svg" className="brand-icon-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h1 className="brand-title">ProDoc AI Agent</h1>
          <p className="brand-subtitle">Symptom guidance and specialist matching</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
