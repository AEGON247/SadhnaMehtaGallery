'use client';

import React, { useEffect, useState } from 'react';

type SectionType = 'entrance' | 'portraits' | 'landscapes' | 'abstracts' | 'contact';

interface NavbarProps {
  currentSection: SectionType;
  onNavigate: (section: SectionType) => void;
}

export default function Navbar({ currentSection, onNavigate }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sections: { id: SectionType; label: string }[] = [
    { id: 'entrance', label: 'Entrance' },
    { id: 'portraits', label: 'Portraits' },
    { id: 'landscapes', label: 'Landscapes' },
    { id: 'abstracts', label: 'Abstracts' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-logo">SADHNA MEHTA</div>
      <div className="nav-right-container" style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
        <ul className="nav-links">
          {sections.map((sec) => (
            <li key={sec.id} className="nav-item">
              <button
                className={currentSection === sec.id ? 'active' : ''}
                onClick={() => onNavigate(sec.id)}
              >
                {sec.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
