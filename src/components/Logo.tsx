import React from 'react';

export const MinifigureHead = ({ className = "w-10 h-10" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Stud on top */}
    <rect x="35" y="5" width="30" height="10" rx="2" fill="#FFD500" stroke="#000" strokeWidth="2" />
    {/* Main Head */}
    <rect x="20" y="15" width="60" height="70" rx="15" fill="#FFD500" stroke="#000" strokeWidth="2" />
    {/* Eyes */}
    <circle cx="40" cy="45" r="5" fill="#000" />
    <circle cx="60" cy="45" r="5" fill="#000" />
    {/* Smile */}
    <path d="M40 65C40 65 45 72 50 72C55 72 60 65 60 65" stroke="#000" strokeWidth="3" strokeLinecap="round" />
  </svg>
);
