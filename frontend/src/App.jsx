//import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Expositions from "./pages/Expositions";
import ExpoDetails from './pages/ExpoDetails.jsx';
import Evenements from "./pages/Evenements.jsx";
import Artistes from "./pages/Artistes";
import DetailsArtiste from './pages/DetailsArtiste.jsx';
import Contact from "./pages/Contact";
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';
import OeuvreDetails from './pages/OeuvreDetails.jsx';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/expositions" element={<Expositions />} />
        <Route path="/expositions/:id" element={ <ExpoDetails />} />
        <Route path="/evenements" element={<Evenements />} />
        <Route path="/artistes" element={<Artistes />} />
        <Route path="/artistes/:id" element ={<DetailsArtiste />} />
        <Route path="/oeuvres/:id" element={<OeuvreDetails />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;

