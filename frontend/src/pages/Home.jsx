import React from 'react';
import {useEffect, useState} from 'react';
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import expoImage from "../assets/photos/expo_paul_amar.jpg";
import eventImage from "../assets/photos/img1.jpg";
import catalogImage from "../assets/photos/catalogue_paul_amar.jpeg";
import galerieImage from "../assets/photos/galerie.png";
import Actualites from '../components/layout/Actualites';

const Home = () => {
  const [showMap, setShowMap] = React.useState(false);
  const [lastNews, setLastNews] = useState([]);
  // Données des actualités
  const actualites = [
    {
      id: 1,
      titre: "Exposition Actuelle",
      description: "Découvrez notre exposition en cours avec des œuvres inédites.",
      image: expoImage,
      date: "11/11/2025"
    },
    {
      id: 2,
      titre: "Outsider Art Fair - New York",
      description: "Notre galerie participe à l'événement Outsider Art Fair de New York.",
      image: eventImage,
      date: "du 27 février au 2 mars 2025"
    },
    {
      id: 3,
      titre: 'Catalogue "La folie des coquillages"',
      description: "Consultez notre dernier catalogue d'expositions Paul Amar.",
      image: catalogImage,
      date: "10/01/2025"
    },
    {
      id: 4,
      titre: "Galerie Pol Lemétais",
      description: "Découvrez notre galerie et nos expositions.",
      image: eventImage,
      date: "18/01/2025"
    }
  ];

  const catalogues = [
    {
      id: 1,
      titre: "Catalogue 2024",
      description: "Découvrez notre sélection d'œuvres et d'expositions de l'année 2024.",
      image: catalogImage,
    },
    {
      id: 2,
      titre: "Catalogue Art Moderne",
      description: "Un aperçu des œuvres modernes disponibles dans notre galerie.",
      image: catalogImage,
    },
    {
      id: 3,
      titre: "Catalogue Peinture",
      description: "Une collection exclusive de peintures de nos artistes.",
      image: catalogImage,
    },
    {
      id: 4,
      titre: "Catalogue Sculpture",
      description: "Découvrez nos sculptures uniques exposées cette année.",
      image: catalogImage,
    }
  ];

  useEffect(() => {
    setLastNews(actualites.slice(0, 3));
  }, [ ]);

  return (
    <div className="w-full px-4 py-8 relative z-10 text-center">
      {/* En-tête de la page d'accueil */}
      <section className="relative min-h-[800px] w-full flex items-center justify-center text-white">
        {/* Background image */}
        <iframe
          src="https://tourmkr.com/F1yJJLVwyx/44695806p&123.95h&89.96t"
          className="absolute inset-0 w-full h-full"
          allowFullScreen
        ></iframe>

        {/* Overlay pour lisibilité */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Contenu principal */}
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl font-bold mb-6">Bienvenue à la Galerie Pol Lemétais</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Découvrez notre collection d&apos;art contemporain et nos expositions.
          </p>

          {/* Boutons */}
          <div className="mt-6 flex justify-center gap-4">
            <button 
              className="px-6 py-3 bg-red-600 text-white text-lg font-semibold rounded-lg hover:bg-red-700 transition"
            >
              Découvrir
            </button>
            <button 
              className="px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition"
              onClick={() => setShowMap(true)}
            >
              Visite Virtuelle
            </button>
          </div>
        </div>

        {/* Carte virtuelle en plein écran */}
        {showMap && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
            {/* Bouton de fermeture */}
            <button 
              className="absolute top-4 right-4 bg-white text-black px-4 py-2 rounded-lg font-bold hover:bg-gray-200 transition"
              onClick={() => setShowMap(false)}
            >
              ✖ Fermer
            </button>

            {/* Iframe pour la carte virtuelle */}
            <iframe 
              src="https://tourmkr.com/F1yJJLVwyx/44695806p&123.95h&89.96t"
              className="w-[90%] h-[90%] rounded-lg shadow-lg"
              allowFullScreen
            ></iframe>
          </div>
        )}
      </section>



      {/* Section Actualités */}
      <Actualites />
        
      

      {/* Section a propos de nous */}
      <section className="relative py-16 px-6 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        {/* Effet d'arrière-plan artistique */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 opacity-20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-600 opacity-25 rounded-full blur-2xl"></div>
        </div>

        {/* Contenu  */}
        <div className="relative z-10 max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-12">
            🖼️ À propos de nous
          </h2>

          {/* Carte coupée en deux */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col lg:flex-row bg-white bg-opacity-90 backdrop-blur-md shadow-2xl rounded-xl overflow-hidden"
          >
            {/* Partie Gauche - Présentation */}
            <div className="lg:w-1/2 p-8 flex flex-col justify-center">
              <h3 className="text-3xl font-semibold text-gray-900 mb-4">
                Galerie Pol Lemétais
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                La Galerie Pol Lemétais est un espace dédié à l’art contemporain,
                où la créativité rencontre l’émotion. Nous mettons en lumière des
                artistes émergents et confirmés à travers des expositions uniques.
              </p>

              {/* Bouton Découvrir */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-6 self-start px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-500 transition duration-300"
              >
                Découvrir
              </motion.button>
            </div>

            {/* Partie Droite - Image */}
            <div className="lg:w-1/2 relative">
              <motion.img
                src={galerieImage}
                alt="Galerie d'art"
                className="h-full w-full object-cover"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative py-16 px-6 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="bg-white max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 text-center mb-10">Nos catalogues</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {catalogues.map((catalogue) => (
              <div key={catalogue.id} className="group relative bg-gray-100 rounded-lg overflow-hidden shadow-md">
                <img 
                  src={catalogue.image} 
                  alt={catalogue.titre} 
                  className="w-full h-64 object-cover group-hover:opacity-80 transition duration-300"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">{catalogue.titre}</h3>
                  <p className="text-sm text-gray-600 mt-2">{catalogue.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bouton Voir la Boutique */}
          <div className="mt-10 text-center">
            <a 
              href="#" 
              className="inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-300"
            >
              Voir la boutique
            </a>
          </div>
        </div>
      </section>
    </div>

  );
};

export default Home;