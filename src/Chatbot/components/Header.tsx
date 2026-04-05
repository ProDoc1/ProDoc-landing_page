
import React from 'react';
import { UserRound } from 'lucide-react';

const Header: React.FC = () => {
  const isLoggedIn = (): boolean => {
    const authToken = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');
    const userData = localStorage.getItem('prodoc_user');

    if (!authToken || !userData) return false;
    return userRole === 'patient' || userRole === 'doctor';
  };

  const handleDashboardRedirect = () => {
    if (!isLoggedIn()) {
      window.location.assign('/login');
      return;
    }

    const userRole = localStorage.getItem('userRole');
    window.location.assign(userRole === 'doctor' ? '/doctor-dashboard' : '/dashboard');
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
