import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { useGoogleTranslateScript, changeLanguage } from "../../hooks/useGoogleTranslate";
import logo from "../../assets/photos/logo.jpg";
import "../../assets/fonts/KenyanCoffeeRg.otf";

const Navbar = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);

  // Initialiser Google Translate
  useGoogleTranslateScript();

  const navLinks = [
    { path: "/", label: "Accueil" },
    { path: "/aPropos", label: "Galerie" },
    { path: "/artistes", label: "Artistes" },
    { path: "/expositions", label: "Expositions" },
    { path: "/evenements", label: "Evénements" },
    { path: "/shop", label: "Boutique" },
    { path: "/contact", label: "Contact" },
  ];

  const handleLanguageChange = (lang) => {
    changeLanguage(lang);
    setLanguageDropdownOpen(false);
  };

  return (
    <>
      <nav className="fixed w-full z-50 bg-white shadow-md">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-16">
          <div className="flex justify-between h-24 items-center">
            {/* Logo de la galerie et nom */}
            <div className="flex-shrink-0 flex items-center space-x-3">
              <Link to="/">
                <img src={logo} alt="Logo de la galerie" className="h-18 w-auto" />
              </Link>
              <Link to="/" className="gallery-name text-[#000000]">
                Galerie Pol Lemétais
              </Link>
            </div>

            {/* Liens de navigation (Desktop) */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map(({ path, label }) => (
                <Link
                  key={path}
                  to={path}
                  className={`text-[#000000] hover:text-[#972924] font-medium text-lg relative ${location.pathname === path ? 'text-[#8B2323] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:h-0.5 after:bg-[#972924] after:w-1/2' : ''}`}
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  {label}
                </Link>
              ))}

              {/* Sélecteur de langue simplifié (Desktop) */}
              <div className="relative">
                <button
                  onClick={() => setLanguageDropdownOpen((prev) => !prev)}
                  className="flex items-center px-2 py-1 border border-[#972924] border-[0.1rem] text-lg text-gray-700 hover:border-[#8B2323] transition-colors duration-200 ml-8 mr-6"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  <span className="mr-1">FR</span>
                  <ChevronDown className="h-6 w-6 text-[#972924]" />
                </button>

                {/* Dropdown des langues */}
                {languageDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg z-50">
                    <button
                      onClick={() => handleLanguageChange("fr")}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      🇫🇷 Français
                    </button>
                    <button
                      onClick={() => handleLanguageChange("en")}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      🇬🇧 English
                    </button>
                    <button
                      onClick={() => handleLanguageChange("es")}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      🇪🇸 Español
                    </button>
                    <button
                      onClick={() => handleLanguageChange("de")}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      🇩🇪 Deutsch
                    </button>
                    <button
                      onClick={() => handleLanguageChange("it")}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      🇮🇹 Italiano
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Menu Hamburger (Mobile) */}
            <div className="flex items-center md:hidden">
               {/* Sélecteur de langue simplifié (Mobile) */}
               <div className="relative mr-2">
                <button
                  onClick={() => setLanguageDropdownOpen((prev) => !prev)}
                  className="flex items-center px-2 py-1 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:border-[#8B2323] transition-colors duration-200"
                >
                  <span className="mr-1">FR</span>
                  <ChevronDown className="h-3 w-3 text-gray-500" />
                </button>

                {/* Dropdown des langues */}
                {languageDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg z-50">
                    <button
                      onClick={() => handleLanguageChange("fr")}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      🇫🇷 Français
                    </button>
                    <button
                      onClick={() => handleLanguageChange("en")}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      🇬🇧 English
                    </button>
                    <button
                      onClick={() => handleLanguageChange("es")}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      🇪🇸 Español
                    </button>
                    <button
                      onClick={() => handleLanguageChange("de")}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      🇩🇪 Deutsch
                    </button>
                    <button
                      onClick={() => handleLanguageChange("it")}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      🇮🇹 Italiano
                    </button>
                  </div>
                )}
              </div>
              <button
                className="p-2 text-gray-700 hover:text-[#8B2323]"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Menu Mobile (Animation) */}
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden bg-white border-t border-gray-200 py-4 px-4 sm:px-6 lg:px-8"
            >
              <div className="flex flex-col items-center space-y-4">
                {navLinks.map(({ path, label }) => (
                  <Link
                    key={path}
                    to={path}
                    onClick={() => setMenuOpen(false)}
                    className={`block text-base font-medium text-gray-700 hover:text-[#8B2323] font-poppins ${location.pathname === path ? 'text-[#8B2323]' : ''}`}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </nav>
      {/* Spacer div to prevent content from being hidden under navbar */}
      <div className="h-24"></div>
      {/* Élément Google Translate caché */}
      <div id="google_translate_element" style={{ display: "none" }}></div>
    </>
  );
};

export default Navbar;
