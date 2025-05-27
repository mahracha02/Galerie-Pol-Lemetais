import React from 'react';
import {useEffect, useState} from 'react';
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';
// Import Swiper components and styles
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import expoImage from "../assets/photos/expo_paul_amar.jpg";
import eventImage from "../assets/photos/img1.jpg";
import catalogImage from "../assets/photos/catalogue_paul_amar.jpeg";
import galerieImage from "../assets/photos/galerie.png";
import Actualites from '../components/layout/Actualites';

const Home = () => {
  const [showMap, setShowMap] = React.useState(false);
  const [lastNews, setLastNews] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
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

  const nextSlide = () => {
    setCurrentSlide((prev) => {
      const next = prev + 1;
      return next >= catalogues.length - 2 ? prev : next;
    });
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => {
      const next = prev - 1;
      return next < 0 ? prev : next;
    });
  };

  return (
    <div className="w-full relative z-10 text-center">
      {/* En-tête de la page d'accueil */}
      <section className="relative min-h-[800px] w-full flex items-center justify-center text-white">
        {/* Background image */}
        <iframe
          src="https://tourmkr.com/F1yJJLVwyx/44695806p&123.95h&89.96t"
          className="absolute inset-0 w-full h-full"
          allowFullScreen
        ></iframe>

        {/* Overlay pour lisibilité */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Contenu principal */}
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Bienvenue à la Galerie Pol Lemétais</h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            Découvrez notre collection d&apos;art contemporain et nos expositions.
          </p>

          {/* Boutons */}
          <div className="mt-8 flex justify-center gap-4">
            <button 
              className="px-8 py-3 bg-[#8B2323] text-white text-lg font-semibold rounded-lg hover:bg-[#6b1a1a] transition-colors duration-300"
            >
              Découvrir
            </button>
            <button 
              className="px-8 py-3 bg-gray-200 text-gray-800 text-lg font-semibold rounded-lg hover:bg-gray-300 transition-colors duration-300"
              onClick={() => setShowMap(true)}
            >
              Visite Virtuelle
            </button>
          </div>
        </div>

        {/* Carte virtuelle en plein écran */}
        {showMap && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
            {/* Bouton de fermeture */}
            <button 
              className="absolute top-6 right-6 bg-white text-black px-4 py-2 rounded-lg font-bold hover:bg-gray-200 transition z-50"
              onClick={() => setShowMap(false)}
            >
              ✖ Fermer
            </button>

            {/* Iframe pour la carte virtuelle */}
            <iframe 
              src="https://tourmkr.com/F1yJJLVwyx/44695806p&123.95h&89.96t"
              className="w-full h-full max-w-screen-xl max-h-[90vh] rounded-lg shadow-lg"
              allowFullScreen
            ></iframe>
          </div>
        )}
      </section>



      {/* Section Actualités */}
      <Actualites />
        
      

      {/* Section La Galerie */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 bg-white mx-8">

        {/* Contenu */}
        <div className="relative z-10 ">
          <h2 className="text-4xl font-black text-gray-900 text-center mb-12 uppercase relative after:absolute after:bottom-[-8px] after:left-1/2 after:-translate-x-1/2 after:w-16 after:h-1 after:bg-[#8B2323]">
             La Galerie
          </h2>

          {/* Layout for text and image */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col gap-12 lg:flex-row"
          >
            {/* Partie Gauche - Présentation */}
            <div className="lg:w-1/2 p-0 lg:pr-8 flex flex-col justify-center text-left">
              <h3 className="text-3xl font-semibold text-gray-900 mb-4">
                Galerie Pol Lemétais
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                La Galerie Pol Lemétais est un espace dédié à l'art contemporain,
                où la créativité rencontre l'émotion. Nous mettons en lumière des
                artistes émergents et confirmés à travers des expositions uniques.
              </p>

              {/* Bouton Découvrir */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-8 self-start px-8 py-3 bg-[#8B2323] text-white font-semibold  shadow-md hover:bg-[#6b1a1a] transition duration-300"
              >
                Découvrir
              </motion.button>
            </div>

            {/* Partie Droite - Image */}
            <div className="lg:w-1/2 relative h-96 lg:h-auto mt-8 lg:mt-0">
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

      {/* Section Catalogues */}  
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 bg-white mx-8">  
        <div className="px-4 sm:px-6 lg:px-8">
           <h2 className="text-4xl font-black tracking-tight text-gray-900 text-center mb-10 uppercase relative after:absolute after:bottom-[-8px] after:left-1/2 after:-translate-x-1/2 after:w-16 after:h-1 after:bg-[#8B2323]">
            Les Catalogues
          </h2>
        </div>

        {/* Swiper Container */}
        <div className="relative ">
          {/* Navigation Buttons */}
          <button 
            onClick={() => window.swiperInstance?.slidePrev()}
            className="absolute -left-20 top-1/2 -translate-y-1/2 text-black p-4 transition-transform duration-300 hover:scale-125 z-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={4} stroke="currentColor" className="w-14 h-14">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button 
            onClick={() => window.swiperInstance?.slideNext()}
            className="absolute -right-20 top-1/2 -translate-y-1/2 text-black p-4 transition-transform duration-300 hover:scale-125 z-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={4} stroke="currentColor" className="w-14 h-14">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>

          {/* Swiper */}
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={32}
            slidesPerView={3}
            className="catalog-swiper"
            onSwiper={(swiper) => {
              window.swiperInstance = swiper;
            }}
          >
            {catalogues.map((catalogue) => (
              <SwiperSlide key={catalogue.id}>
                <motion.div 
                  className="group relative bg-black overflow-hidden shadow-md h-[500px] flex flex-col"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link to={`/catalogue/${catalogue.id}`} className="absolute inset-0 z-10">
                    <div className="h-[350px] overflow-hidden">
                      <img 
                        src={catalogue.image} 
                        alt={catalogue.titre} 
                        className="w-full h-90 object-container group-hover:opacity-80 transition duration-300"
                      />
                    </div>
                    <div className="p-6 text-left">
                      <h3 className="text-xl font-semibold text-white line-clamp-1 uppercase tracking-wider mt-2 mb-6">{catalogue.titre}</h3>
                      <span className="text-[#8B2323] text-md font-medium uppercase tracking-wider">Artiste</span>
                    </div>
                  </Link>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Bouton Voir la Boutique */}
        <div className="mt-16 text-center px-4 sm:px-6 lg:px-8">
          <a 
            href="#" 
            className="inline-block px-12 py-4 bg-[#8B2323] text-white font-semibold shadow-md hover:bg-[#6b1a1a] transition duration-300 tracking-wider text-lg"
          >
            Visiter la boutique
          </a>
        </div>
      </section>
    </div>

  );
};

export default Home;