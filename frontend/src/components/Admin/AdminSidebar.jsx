import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaNewspaper, FaUsers, FaCalendarAlt, FaImage, FaPaintBrush, FaEnvelope, FaSignOutAlt, FaUserCircle, FaUserEdit, FaChartBar, FaShoppingCart } from 'react-icons/fa';
import { FaSun, FaMoon } from 'react-icons/fa';

const adminLinks = [
  { path: '/admin/', label: 'Dashboard', icon: <FaChartBar /> },
  { path: '/admin/actualites', label: 'Actualités', icon: <FaNewspaper /> },
  { path: '/admin/expositions', label: 'Expositions', icon: <FaImage /> },
  { path: '/admin/evenements', label: 'Événements', icon: <FaCalendarAlt /> },
  { path: '/admin/artistes', label: 'Artistes', icon: <FaUsers /> },
  { path: '/admin/oeuvres', label: 'Œuvres', icon: <FaPaintBrush /> },
  { path: '/admin/medias', label: 'Médias', icon: <FaImage /> },
  { path: '/admin/catalogues', label: 'Catalogues', icon: <FaImage /> },
  { path: '/admin/boutique', label: 'Boutique', icon: <FaShoppingCart /> },
  { path: '/admin/utilisateurs', label: 'Utilisateurs', icon: <FaUsers /> },
  { path: '/admin/contacts', label: 'Contacts', icon: <FaEnvelope /> },
];

// Demo admin user (replace with real data from auth)
const demoAdmin = {
  photo: '', // or a URL
  nom: 'Lemétais',
  prenom: 'Pol',
  email: 'admin@galerie.com',
  telephone: '+33 6 12 34 56 78',
  role: 'Administrateur',
};

const AdminSidebar = ({ darkMode, setDarkMode }) => {
  const location = useLocation();
  const [showDetails, setShowDetails] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);
  const [profile, setProfile] = React.useState(demoAdmin);
  const [editProfile, setEditProfile] = React.useState(demoAdmin);

  React.useEffect(() => {
    localStorage.setItem('adminDarkMode', darkMode);
    if (darkMode) {
      document.body.classList.add('admin-dark');
      document.body.classList.remove('admin-light');
    } else {
      document.body.classList.add('admin-light');
      document.body.classList.remove('admin-dark');
    }
  }, [darkMode]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditProfile({ ...editProfile, [name]: value });
  };

  const handleSave = () => {
    setProfile(editProfile);
    setEditMode(false);
    setShowDetails(false);
  };

  return (
    <aside className={`fixed top-0 left-0 h-screen w-64 flex flex-col justify-between shadow-xl z-40 ${darkMode ? 'bg-[#0C0C0C] text-white' : 'bg-white text-[#18181b]'}`} style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Navigation Links */}
      <nav className="flex-1 py-8 px-4 flex flex-col gap-2">
        <div className="mb-8 flex items-center gap-3">
          <FaUserCircle className={`w-8 h-8 ${darkMode ? 'text-[#972924]' : 'text-[#972924]'}`} />
          <span className={`text-2xl font-bold tracking-wide ${darkMode ? 'text-white' : 'text-[#18181b]'}`} style={{ fontFamily: 'Kenyan Coffee, sans-serif' }}>Galerie Pol Lemétais</span>
        </div>
        {adminLinks.map(({ path, label, icon }) => (
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
      <div className={`p-4 border-t ${darkMode ? 'border-[#222] bg-[#0C0C0C]' : 'border-[#eee] bg-white'}`}>
        <div className="flex items-center gap-3">
          {profile.photo ? (
            <img src={profile.photo} alt="profile" className={`w-12 h-12 rounded-full object-cover border-2 ${darkMode ? 'border-[#972924]' : 'border-[#972924]'}`} />
          ) : (
            <FaUserCircle className={`w-12 h-12 ${darkMode ? 'text-[#972924]' : 'text-[#972924]'}`} />
          )}
          <div className="flex-1">
            <div className={`font-semibold text-base ${darkMode ? 'text-white' : 'text-[#18181b]'}`}>{profile.email}</div>
            <div className="text-[#972924] text-sm">{profile.role}</div>
          </div>
          <button
            className={`ml-2 ${darkMode ? 'text-[#972924] hover:text-[#b33c36]' : 'text-[#972924] hover:text-[#b33c36]'} transition`}
            onClick={() => setShowDetails((v) => !v)}
            title="Voir plus de détails"
          >
            <FaUserEdit className="w-6 h-6" />
          </button>
          <button className={`ml-2 ${darkMode ? 'text-gray-400 hover:text-red-600' : 'text-gray-400 hover:text-red-600'} transition`} title="Se déconnecter">
            <FaSignOutAlt className="w-6 h-6" />
          </button>
        </div>
        {/* Details Card */}
        {showDetails && (
          <div className="absolute left-72 bottom-8 w-80 bg-white text-black rounded-xl shadow-2xl p-6 z-50 flex flex-col gap-4 animate-fade-in" style={{ fontFamily: 'Poppins, sans-serif' }}>
            <div className="flex items-center gap-4 mb-2">
              {profile.photo ? (
                <img src={profile.photo} alt="profile" className="w-16 h-16 rounded-full object-cover border-2 border-[#972924]" />
              ) : (
                <FaUserCircle className="w-16 h-16 text-[#972924]" />
              )}
              <div>
                <div className="font-bold text-lg text-[#972924]">{editMode ? (
                  <input type="text" name="nom" value={editProfile.nom} onChange={handleEditChange} className="border-b border-[#972924] focus:outline-none px-1" />
                ) : profile.nom}</div>
                <div className="font-bold text-lg text-[#972924]">{editMode ? (
                  <input type="text" name="prenom" value={editProfile.prenom} onChange={handleEditChange} className="border-b border-[#972924] focus:outline-none px-1" />
                ) : profile.prenom}</div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div>Email : {editMode ? (
                <input type="email" name="email" value={editProfile.email} onChange={handleEditChange} className="border-b border-[#972924] focus:outline-none px-1 w-full" />
              ) : profile.email}</div>
              <div>Téléphone : {editMode ? (
                <input type="text" name="telephone" value={editProfile.telephone} onChange={handleEditChange} className="border-b border-[#972924] focus:outline-none px-1 w-full" />
              ) : profile.telephone}</div>
              <div>Rôle : {editMode ? (
                <input type="text" name="role" value={editProfile.role} onChange={handleEditChange} className="border-b border-[#972924] focus:outline-none px-1 w-full" />
              ) : profile.role}</div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                onClick={() => { setShowDetails(false); setEditMode(false); setEditProfile(profile); }}
              >
                Fermer
              </button>
              {editMode ? (
                <button
                  className="px-4 py-2 rounded bg-[#972924] text-white hover:bg-[#b33c36] transition"
                  onClick={handleSave}
                >
                  Enregistrer
                </button>
              ) : (
                <button
                  className="px-4 py-2 rounded bg-[#972924] text-white hover:bg-[#b33c36] transition"
                  onClick={() => setEditMode(true)}
                >
                  Modifier
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default AdminSidebar; 