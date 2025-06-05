//import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import Home from './pages/Home';
import About from './pages/Apropos.jsx';
import Expositions from "./pages/Expositions";
import ExpoDetails from './pages/ExpoDetails.jsx';
import Evenements from "./pages/Evenements.jsx";
import Artistes from "./pages/Artistes";
import DetailsArtiste from './pages/DetailsArtiste.jsx';
import Contact from "./pages/Contact";
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

const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/aPropos" element={<About />} />
            <Route path="/expositions" element={<Expositions />} />
            <Route path="/expositions/:id" element={ <ExpoDetails />} />
            <Route path="/evenements" element={<Evenements />} />
            <Route path="/artistes" element={<Artistes />} />
            <Route path="/artistes/:id" element ={<DetailsArtiste />} />
            <Route path="/oeuvres/:id" element={<OeuvreDetails />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/actualites" element={<ActualitesPage />} />
            <Route path="/admin/evenements" element={<EvenementsPage />} />
            <Route path="/admin/expositions" element={<ExpositionsPage />} />
            <Route path="/admin/artistes" element={<ArtistesPage />} />
            <Route path="/admin/oeuvres" element={<OeuvresPage />} />
            <Route path="/admin/utilisateurs" element={<UsersPage />} />
            <Route path="/admin/contacts" element={<ContactsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;

