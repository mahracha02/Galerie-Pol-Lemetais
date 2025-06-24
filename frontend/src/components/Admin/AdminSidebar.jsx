import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaNewspaper, FaUsers, FaCalendarAlt, FaImage, FaPaintBrush, FaEnvelope, FaSignOutAlt, FaUserCircle, FaUserEdit, FaChartBar, FaShoppingCart, FaUser, FaUserShield, FaCrown } from 'react-icons/fa';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useAuth } from '../../contexts/useAuth';


const AdminSidebar = ({ darkMode, setDarkMode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Role badge/icon logic (reuse from UsersList if possible)
  const ROLE_LABELS = {
    'USER': { label: 'Utilisateur', icon: <FaUser className="w-4 h-4 mr-1" />, color: 'bg-blue-100 text-blue-800', dark: 'bg-blue-900 text-blue-200' },
    'ADMIN': { label: 'Admin', icon: <FaUserShield className="w-4 h-4 mr-1" />, color: 'bg-amber-100 text-amber-800', dark: 'bg-amber-900 text-amber-200' },
    'SUPER_ADMIN': { label: 'Super admin', icon: <FaCrown className="w-5 h-5 mr-1" />, color: 'bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 text-white shadow-lg', dark: 'bg-gradient-to-r from-purple-700 via-pink-700 to-yellow-500 text-white shadow-lg', gradient: true },
    // Fallback for any role names with ROLE_ prefix
    'ROLE_USER': { label: 'utilisateur', icon: <FaUser className="w-4 h-4 mr-1" />, color: 'bg-blue-100 text-blue-800', dark: 'bg-blue-900 text-blue-200' },
    'ROLE_ADMIN': { label: 'admin', icon: <FaUserShield className="w-4 h-4 mr-1" />, color: 'bg-amber-100 text-amber-800', dark: 'bg-amber-900 text-amber-200' },
    'ROLE_SUPER_ADMIN': { label: 'super admin', icon: <FaCrown className="w-5 h-5 mr-1" />, color: 'bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 text-white shadow-lg', dark: 'bg-gradient-to-r from-purple-700 via-pink-700 to-yellow-500 text-white shadow-lg', gradient: true },
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Filter admin links based on user role
  const getFilteredAdminLinks = () => {
    const baseLinks = [
      { path: '/admin/', label: 'Dashboard', icon: <FaChartBar /> },
      { path: '/admin/actualites', label: 'Actualités', icon: <FaNewspaper /> },
      { path: '/admin/expositions', label: 'Expositions', icon: <FaImage /> },
      { path: '/admin/evenements', label: 'Événements', icon: <FaCalendarAlt /> },
      { path: '/admin/artistes', label: 'Artistes', icon: <FaUsers /> },
      { path: '/admin/oeuvres', label: 'Œuvres', icon: <FaPaintBrush /> },
      { path: '/admin/medias', label: 'Médias', icon: <FaImage /> },
      { path: '/admin/catalogues', label: 'Catalogues', icon: <FaImage /> },
      { path: '/admin/boutique', label: 'Boutique', icon: <FaShoppingCart /> },
      { path: '/admin/contacts', label: 'Contacts', icon: <FaEnvelope /> },
    ];

    // Add Utilisateurs link only for super admin
    if (user && user.role) {
      const userRole = Array.isArray(user.role) ? user.role[0] : user.role;
      if (userRole === 'SUPER_ADMIN' || userRole === 'ROLE_SUPER_ADMIN') {
        baseLinks.splice(9, 0, { path: '/admin/utilisateurs', label: 'Utilisateurs', icon: <FaUsers /> });
      }
    }

    return baseLinks;
  };

  const filteredAdminLinks = getFilteredAdminLinks();

  return (
    <aside className={`fixed top-0 left-0 h-screen w-64 flex flex-col justify-between shadow-xl z-40 ${darkMode ? 'bg-[#0C0C0C] text-white' : 'bg-white text-[#18181b]'}`} style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Navigation Links */}
      <nav className="flex-1 py-8 px-4 flex flex-col gap-2">
        <div className="mb-8 flex items-center gap-3">
          <FaUserCircle className={`w-8 h-8 ${darkMode ? 'text-[#972924]' : 'text-[#972924]'}`} />
          <span className={`text-2xl font-bold tracking-wide ${darkMode ? 'text-white' : 'text-[#18181b]'}`} style={{ fontFamily: 'Kenyan Coffee, sans-serif' }}>Galerie Pol Lemétais</span>
        </div>
        {filteredAdminLinks.map(({ path, label, icon }) => (
          <Link
            key={path}
            to={path}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200 text-lg ${location.pathname === path ? 'bg-[#972924] text-white' : darkMode ? 'hover:bg-[#222] text-[#FFFFFF]' : 'hover:bg-[#f3f3f3] text-[#18181b]'}`}
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            <span className="text-xl">{icon}</span>
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      {/* Light/Dark Mode Toggle */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-[#222]">
        <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-[#18181b]'}`}>Mode {darkMode ? 'Sombre' : 'Clair'}</span>
        <button
          className={`p-2 rounded-full transition-colors duration-200 ${darkMode ? 'bg-[#232326] text-yellow-400' : 'bg-[#f3f3f3] text-[#972924]'}`}
          onClick={() => setDarkMode((v) => !v)}
          title="Basculer le mode clair/sombre"
        >
          {darkMode ? <FaSun className="w-5 h-5" /> : <FaMoon className="w-5 h-5" />}
        </button>
      </div>

      {/* Profile Card at Bottom */}
      {user ? (
        <div className={`p-4 border-t ${darkMode ? 'border-[#222] bg-[#0C0C0C]' : 'border-[#eee] bg-white'}`}>
          <div className="flex items-center gap-3">
            {user.photo ? (
              <img src={user.photo} alt="profile" className={`w-12 h-12 rounded-full object-cover border-2 ${darkMode ? 'border-[#972924]' : 'border-[#972924]'}`} />
            ) : (
              <FaUserCircle className={`w-12 h-12 ${darkMode ? 'text-[#972924]' : 'text-[#972924]'}`} />
            )}
            <div className="flex-1">
              <div className={`font-semibold text-base ${darkMode ? 'text-white' : 'text-[#18181b]'}`}>{user.prenom} {user.nom}</div>
              <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>{user.email}</div>
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{user.telephone}</div>
              <div className="mt-2">
                {(() => {
                  const roleKey = Array.isArray(user.role) ? user.role[0] : user.role;
                  const roleInfo = ROLE_LABELS[roleKey] || {
                    label: roleKey,
                    icon: <FaUser className="w-4 h-4 mr-1" />,
                    color: 'bg-gray-200 text-gray-600',
                    dark: 'bg-gray-700 text-gray-200',
                  };
                  return (
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full font-semibold text-xs shadow transition-all duration-200 ${roleInfo.gradient ? (darkMode ? roleInfo.dark : roleInfo.color) : (darkMode ? roleInfo.dark : roleInfo.color)}`}
                      style={roleInfo.gradient ? { background: darkMode ? 'linear-gradient(90deg, #7c3aed, #db2777, #facc15)' : 'linear-gradient(90deg, #a78bfa, #f472b6, #fde68a)' } : {}}
                    >
                      {roleInfo.icon}
                      <span className="ml-1">{roleInfo.label}</span>
                    </span>
                  );
                })()}
              </div>
            </div>
            {/* Modern Animated Logout Button */}
            <button
              onClick={handleLogout}
              className={`group relative p-3 rounded-full transition-all duration-300 ease-in-out transform hover:scale-110 hover:rotate-12 ${
                darkMode 
                  ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-lg hover:shadow-red-500/25' 
                  : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white shadow-lg hover:shadow-red-400/25'
              }`}
              title="Se déconnecter"
            >
              <FaSignOutAlt className="w-5 h-5 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              {/* Animated ring effect on hover */}
              <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-white/30 transition-all duration-300 group-hover:scale-125 opacity-0 group-hover:opacity-100"></div>
              {/* Pulse effect */}
              <div className="absolute inset-0 rounded-full bg-white/20 scale-0 group-hover:scale-100 transition-all duration-500 ease-out"></div>
            </button>
          </div>
        </div>
      ) :(
        <div className={`p-4 border-t ${darkMode ? 'border-[#222] bg-[#0C0C0C]' : 'border-[#eee] bg-white'}`}>
          <div className="flex items-center gap-3">
            <FaUserCircle className={`w-12 h-12 ${darkMode ? 'text-[#972924]' : 'text-[#972924]'}`} />
            <div className="flex-1">
              <div className={`font-semibold text-base ${darkMode ? 'text-white' : 'text-[#18181b]'}`}>Invité</div>
              <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Veuillez vous connecter</div>
              <Link to="/login" className={`text-xs ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'} underline`}>
                Se connecter
              </Link>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default AdminSidebar; 