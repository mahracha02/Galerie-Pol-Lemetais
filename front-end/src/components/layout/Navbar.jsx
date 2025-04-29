import  { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const [language, setLanguage] = useState('fr'); // Default language is French
  
  const navLinks = [
    { path: '/', label: 'Accueil' },
    { path: '/expositions', label: 'Expositions' },
    { path: '/evenements', label: 'Événements' },
    { path: '/artistes', label: 'Artistes' },
    { path: '/oeuvres', label: 'Œuvres' },
    { path: '/contact', label: 'Contact' }
  ];

  const toggleLanguage = () => {
    setLanguage((prevLang) => (prevLang === 'fr' ? 'en' : 'fr')); // Toggle between French and English
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-xl font-bold">
              Galerie Pol Lemétais
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-4">
              {navLinks.map(({ path, label }) => (
                <Link
                  key={path}
                  to={path}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === path
                      ? 'text-blue-600'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              {language === 'fr' ? 'FR' : 'EN'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
