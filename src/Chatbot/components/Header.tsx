
import React from 'react';
import { UserRound } from 'lucide-react';

const Header: React.FC = () => {
  const handleDashboardRedirect = () => {
    window.location.assign('/dashboard');
  };

  return (
    <header className="top-header">
      <div className="brand-row">
        <button
          type="button"
          className="brand-icon"
          aria-label="Go to patient dashboard"
          onClick={handleDashboardRedirect}
        >
          <UserRound className="brand-icon-svg" />
        </button>
        <div>
          <h1 className="brand-title">ProDoc AI Agent</h1>
          <p className="brand-subtitle">Symptom guidance and specialist matching</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
