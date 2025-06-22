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
import UsersPage from './components/Admin/UsersList.jsx';
import ContactsPage from './components/Admin/ContactsList.jsx';
import NotFound from './pages/NotFound';
import OeuvreDetails from './pages/OeuvreDetails.jsx';
import ScrollToTop from './components/layout/ScrollToTop';

// Composant de protection des routes admin
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  return (
    <> 
      <Router>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Routes publiques */}
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
              <Route path="/login" element={<Login />} />

              {/* Routes protégées */}
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminDashboardPage />
                </ProtectedRoute>
              } />
              <Route path="/admin/actualites" element={
                <ProtectedRoute>
                  <ActualitesPage />
                </ProtectedRoute>
              } />
              <Route path="/admin/evenements" element={
                <ProtectedRoute>
                  <EvenementsPage />
                </ProtectedRoute>
              } />
              <Route path="/admin/expositions" element={
                <ProtectedRoute>
                  <ExpositionsPage />
                </ProtectedRoute>
              } />
              <Route path="/admin/artistes" element={
                <ProtectedRoute>
                  <ArtistesPage />
                </ProtectedRoute>
              } />
              <Route path="/admin/oeuvres" element={
                <ProtectedRoute>
                  <OeuvresPage />
                </ProtectedRoute>
              } />
              <Route path="/admin/utilisateurs" element={
                <ProtectedRoute>
                  <UsersPage />
                </ProtectedRoute>
              } />
              <Route path="/admin/contacts" element={
                <ProtectedRoute>
                  <ContactsPage />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </>
  );
};

export default App;

