/**
 * =========================================
 * THEME TOGGLE COMPONENT
 * Switch between different color themes
 * =========================================
 */

import React, { useState } from 'react';

const THEMES = [
  { name: 'dark', label: '🌙 Dark', icon: '🌙' },
  { name: 'light', label: '☀️ Light', icon: '☀️' },
  { name: 'orange', label: '🧡 Orange', icon: '🧡' },
  { name: 'cybersecurity', label: '🎮 Hacker', icon: '🎮' },
  { name: 'ocean', label: '🌊 Ocean', icon: '🌊' },
];

export default function ThemeToggle({ theme, onThemeChange }) {
  const [showMenu, setShowMenu] = useState(false);

  const currentTheme = THEMES.find(t => t.name === theme);

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition font-medium flex items-center gap-2"
      >
        <span>🎨</span>
        <span className="hidden sm:inline">{currentTheme?.label}</span>
      </button>

      {showMenu && (
        <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50">
          {THEMES.map((t) => (
            <button
              key={t.name}
              onClick={() => {
                onThemeChange(t.name);
                setShowMenu(false);
              }}
              className={`w-full text-left px-4 py-3 hover:bg-background-secondary transition ${
                theme === t.name ? 'bg-primary bg-opacity-10 border-l-4 border-primary' : ''
              }`}
            >
              <span className="text-lg mr-2">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
