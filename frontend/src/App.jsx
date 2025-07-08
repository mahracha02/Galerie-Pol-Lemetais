//import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import Home from './pages/Home';
import About from './pages/Apropos.jsx';
import Expositions from "./pages/Expositions";
import ExpoDetails from './pages/ExpoDetails.jsx';
import Evenements from "./pages/Evenements.jsx";
import EvenementDetails from './pages/DetailsEvenement.jsx';
import Artistes from "./pages/Artistes";
import DetailsArtiste from './pages/DetailsArtiste.jsx';
import Boutique from './pages/Boutique/Boutique.jsx';
import DetailsCatalogue from './pages/Boutique/DetailsCatalogue.jsx';
import Catalogues from './pages/Boutique/Catalogues.jsx';
import DetailsOeuvre from './pages/Boutique/DetailsOeuvre.jsx';
import Contact from "./pages/Contact";
import Login from './pages/Login';
import AdminDashboardPage from './components/Admin/Dashboard.jsx';
import ActualitesPage from './components/Admin/ActualitesList.jsx';
import EvenementsPage from './components/Admin/EvenementsList.jsx';
import ExpositionsPage from './components/Admin/ExpositionsList.jsx';
import ArtistesPage from './components/Admin/ArtistesList.jsx';
import OeuvresPage from './components/Admin/OeuvresList.jsx';
import MediasPage from './components/Admin/MediasList.jsx';
import CataloguesPage from './components/Admin/CataloguesList.jsx';
import BoutiquePage from './components/Admin/Boutique/BoutiqueList.jsx';
import UsersPage from './components/Admin/UsersList.jsx';
import ContactsPage from './components/Admin/ContactsList.jsx';
import NotFound from './pages/NotFound';
import OeuvreDetails from './pages/OeuvreDetails.jsx';
import ScrollToTop from './components/layout/ScrollToTop';
import AdminSidebar from './components/Admin/AdminSidebar.jsx';
import { useState, useEffect } from 'react';
import { AuthProvider } from './contexts/useAuth.jsx';

// Composant de protection des routes admin
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('adminDarkMode') === 'false' ? false : true;
    }
    return true;
  });

  useEffect(() => {
    const handleMode = () => {
      setDarkMode(localStorage.getItem('adminDarkMode') === 'false' ? false : true);
    };
    window.addEventListener('storage', handleMode);
    handleMode();
    return () => window.removeEventListener('storage', handleMode);
  }, []);

  return (
    <>
    <AuthProvider>
      <Router basename="/test">
        <ScrollToTop />
        <Routes>
          {/* Admin routes: sidebar layout */}
          <Route path="/admin/*" element={
            <div className="min-h-screen flex bg-gray-50">
              <AdminSidebar darkMode={darkMode} setDarkMode={setDarkMode} />
              <main className="flex-1 ml-64">
                <Routes>
                  <Route path="" element={<ProtectedRoute><AdminDashboardPage darkMode={darkMode} /></ProtectedRoute>} />
                  <Route path="actualites" element={<ProtectedRoute><ActualitesPage darkMode={darkMode} /></ProtectedRoute>} />
                  <Route path="evenements" element={<ProtectedRoute><EvenementsPage darkMode={darkMode} /></ProtectedRoute>} />
                  <Route path="expositions" element={<ProtectedRoute><ExpositionsPage darkMode={darkMode} /></ProtectedRoute>} />
                  <Route path="artistes" element={<ProtectedRoute><ArtistesPage darkMode={darkMode} /></ProtectedRoute>} />
                  <Route path="oeuvres" element={<ProtectedRoute><OeuvresPage darkMode={darkMode} /></ProtectedRoute>} />
                  <Route path="medias" element={<ProtectedRoute><MediasPage darkMode={darkMode} /></ProtectedRoute>} />
                  <Route path="catalogues" element={<ProtectedRoute><CataloguesPage darkMode={darkMode} /></ProtectedRoute>} />
                  <Route path="boutique" element={<ProtectedRoute><BoutiquePage darkMode={darkMode} /></ProtectedRoute>} />
                  <Route path="utilisateurs" element={<ProtectedRoute><UsersPage darkMode={darkMode} /></ProtectedRoute>} />
                  <Route path="contacts" element={<ProtectedRoute><ContactsPage darkMode={darkMode} /></ProtectedRoute>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          } />

          
          <Route path="/login" element={<Login />} />
          <Route path="*" element={
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/aPropos" element={<About />} />
                  <Route path="/expositions" element={<Expositions />} />
                  <Route path="/expositions/:id" element={<ExpoDetails />} />
                  <Route path="/evenements" element={<Evenements />} />
                  <Route path="/evenements/:id" element={<EvenementDetails />} />
                  <Route path="/artistes" element={<Artistes />} />
                  <Route path="/artistes/:id" element={<DetailsArtiste />} />
                  <Route path="/oeuvres/:id" element={<OeuvreDetails />} />
                  <Route path="/boutique" element={<Boutique />} />
                  <Route path="/boutique/catalogues" element={<Catalogues />} />
                  <Route path="/boutique/catalogues/:id" element={<DetailsCatalogue />} />
                  <Route path="/boutique/oeuvres/:id" element={<DetailsOeuvre />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          } />
        </Routes>
      </Router>
    </AuthProvider>
    </>
  );
};

export default App;

