import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Users, BookOpen, Award, ChevronRight } from 'lucide-react';
import DarkModeToggle from '../DarkModeToggle/DarkModeToggle';

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleGetStarted = () => {
    navigate('/register');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-dark-bg dark:via-dark-bg-secondary dark:to-dark-bg flex items-center justify-center p-4 relative">
      {/* Dark Mode Toggle */}
      <div className="absolute top-6 right-6">
        <DarkModeToggle />
      </div>
      <div className={`max-w-4xl w-full text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Header */}
        <div className="mb-12">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-primary-600 rounded-full blur-lg opacity-20 animate-bounce-gentle"></div>
              <GraduationCap className="h-20 w-20 text-primary-600 relative z-10" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4 animate-slide-up">
            University Student
            <span className="block text-primary-600 dark:text-primary-300">Registration System</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-200 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
            A comprehensive platform for managing student registrations, profiles, and academic information with modern technology and intuitive design.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="card animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <Users className="h-12 w-12 text-secondary-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Student Management</h3>
            <p className="text-gray-600 dark:text-gray-200">Complete CRUD operations for student records with advanced search and filtering capabilities.</p>
          </div>
          
          <div className="card animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <BookOpen className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Academic Tracking</h3>
            <p className="text-gray-600 dark:text-gray-200">Track academic years, departments, and student progress with comprehensive reporting tools.</p>
          </div>
          
          <div className="card animate-slide-up" style={{ animationDelay: '0.8s' }}>
            <Award className="h-12 w-12 text-orange-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Modern Interface</h3>
            <p className="text-gray-600 dark:text-gray-200">Clean, responsive design with accessibility features and intuitive user experience.</p>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="text-center animate-slide-up" style={{ animationDelay: '1s' }}>
            <div className="text-3xl font-bold text-primary-600 dark:text-primary-300 mb-1">100%</div>
            <div className="text-sm text-gray-600 dark:text-white">TypeScript</div>
          </div>
          <div className="text-center animate-slide-up" style={{ animationDelay: '1.1s' }}>
            <div className="text-3xl font-bold text-secondary-600 dark:text-secondary-300 mb-1">24/7</div>
            <div className="text-sm text-gray-600 dark:text-white">Available</div>
          </div>
          <div className="text-center animate-slide-up" style={{ animationDelay: '1.2s' }}>
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-300 mb-1">WCAG</div>
            <div className="text-sm text-gray-600 dark:text-white">Compliant</div>
          </div>
          <div className="text-center animate-slide-up" style={{ animationDelay: '1.3s' }}>
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-300 mb-1">Mobile</div>
            <div className="text-sm text-gray-600 dark:text-white">Responsive</div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="animate-slide-up" style={{ animationDelay: '1.4s' }}>
          <button
            onClick={handleGetStarted}
            className="group inline-flex items-center px-8 py-4 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 shadow-lg hover:shadow-xl"
            aria-label="Start student registration process"
          >
            Get Started
            <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="text-sm text-gray-500 dark:text-gray-300 mt-4">
            Begin your journey with our comprehensive student management system
          </p>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;