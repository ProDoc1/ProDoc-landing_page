import React from 'react';
import { Doctor } from '../types';

interface DoctorCardProps {
  doctor: Doctor;
  onViewProfile?: (id: string) => void;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onViewProfile }) => {
  const hospitals = (() => {
    try {
      const parsed = JSON.parse(doctor.associated_hospitals || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  })();

  return (
    <div className="doctor-card">
      <div className="doctor-ribbon">
        <p className="doctor-ribbon-text">Recommended Specialist</p>
      </div>
      <div className="doctor-main">
        <div className="doctor-profile">
          <div className="doctor-avatar">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="doctor-avatar-icon">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
          </div>
          <div className="doctor-meta">
            <h3 className="doctor-name">{doctor.full_name}</h3>
            <p className="doctor-specialty">{doctor.specialty}</p>
            <div className="doctor-stats">
              <span>{doctor.years_of_experience} Years Experience</span>
              <span>&middot;</span>
              <span>{doctor.gender}</span>
            </div>
          </div>
        </div>

        <div className="doctor-section">
          <h4 className="doctor-label">Primary Hospital</h4>
          <p className="doctor-detail">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="doctor-hospital-icon">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6.75h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
            </svg>
            {doctor.working_hospital}
          </p>
        </div>

        {hospitals.length > 0 && (
          <div className="doctor-section">
            <h4 className="doctor-label">Also Available At</h4>
            <div className="doctor-chips">
              {hospitals
                .map((hospital) => (typeof hospital?.name === 'string' ? hospital.name : ''))
                .filter(Boolean)
                .map((hospitalName, index) => (
                  <span key={`${hospitalName}-${index}`} className="doctor-chip">
                    {hospitalName}
                  </span>
                ))}
            </div>
          </div>
        )}

        <div className="doctor-section">
          <h4 className="doctor-label">About</h4>
          <p className="doctor-bio">"{doctor.bio}"</p>
        </div>

        <div className="doctor-footer">
          <p className="doctor-reg">
            <span className="doctor-label-inline">SLMC:</span> {doctor.slmc_number}
          </p>
          <button
            type="button"
            className="doctor-contact-btn text-sm font-semibold hover:bg-teal-500 hover:text-white transition-colors"
            onClick={() => {
              if (onViewProfile) {
                onViewProfile(doctor.doctor_id);
              } else {
                window.location.href = `mailto:${doctor.contact_email}`;
              }
            }}
          >
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;

