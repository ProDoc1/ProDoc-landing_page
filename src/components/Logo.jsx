import React from 'react';
import LogoImg from '../assets/Logo_with_words_white.png';

export default function Logo({ className = '', alt = 'ProDoc' }) {
  return (
    <img src={LogoImg} alt={alt} className={className} />
  );
}
