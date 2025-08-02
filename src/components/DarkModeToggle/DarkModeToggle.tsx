import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useDarkMode } from '../../contexts/DarkModeContext';

interface DarkModeToggleProps {
  className?: string;
}

const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ className = '' }) => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <button
      onClick={toggleDarkMode}
      className={`relative inline-flex h-10 w-20 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
        isDarkMode 
          ? 'bg-primary-600' 
          : 'bg-gray-200'
      } ${className}`}
      aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
    >
      <span className="sr-only">
        {isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      </span>
      
      {/* Toggle handle */}
      <span
        className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
          isDarkMode ? 'translate-x-12' : 'translate-x-1'
        }`}
      />
      
      {/* Icons */}
      <Sun className="absolute left-2 h-4 w-4 text-yellow-500 transition-opacity duration-300" />
      <Moon className="absolute right-2 h-4 w-4 text-blue-500 transition-opacity duration-300" />
    </button>
  );
};

export default DarkModeToggle; 