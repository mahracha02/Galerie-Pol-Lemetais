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
import image1 from '../assets/photos/image1.png';
import image2 from '../assets/photos/image2.png';
import image3 from '../assets/photos/image3.png';
import laGalerie from "../assets/photos/image_decorative_accueil.png";
import catalogImage from "../assets/photos/catalogue_paul_amar.jpeg";
import galerieImage from "../assets/photos/galerie.png";
import Actualites from '../components/layout/Actualites';

const Home = () => {
  const [showMap, setShowMap] = React.useState(false);
  const [lastNews, setLastNews] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  

  const catalogues = [
    {
      id: 1,
      prenom: "Insérer un",
      nom: "artiste",
      image: image1,
    },
    {
      id: 2,
      prenom: "Evelyne",
      nom: "Postic",
      image: image2,
    },
    {
      id: 3,
      prenom: "Paul",
      nom: "Amar",
      image: image3,
    },
    {
      id: 4,
      prenom: "Bruno",
      nom: "Buissonnet",
      image: image1,
    }
  ];

  

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
      <section className="relative min-h-[40rem] md:min-h-[53rem] w-full flex items-end justify-start text-white">
        {/* Background image */}
        <img
          src={galerieImage}
          alt='Galerie Pol Lemétais'
          className="absolute h-full w-full object-cover"
        />

        {/* Contenu principal */}
        <div className="relative z-10 text-left px-4 md:px-26 pb-6">
          <h1 className="text-4xl md:text-5xl lg:text-[7rem] text-[#972924]" style={{ fontFamily: 'Kenyan Coffee, sans-serif' }}>Galerie Pol Lemétais</h1>
          <p className="text-lg md:text-xl lg:text-[2rem] text-[#FFFFFF] tracking-wider px-1" style={{ fontFamily: 'Poppins Light , sans-serif' }}>
            ART BRUT / OUTSIDER ART
          </p>
        </div>
      </section>

      {/* Section Actualités */}
      <Actualites />


      {/* Section La Galerie */}
      <section className="relative py-8 md:py-16 px-4 sm:px-6 lg:px-8 bg-white mx-4 md:mx-8 mt-12 md:mt-24">

        {/* Contenu */}
        <div className="relative z-10 ">

          {/* Layout for text and image */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col gap-8 md:gap-12 lg:flex-row"
          >
            {/* Partie Gauche - Présentation */}
            <div className="lg:w-4/7 p-0 lg:pr-8 flex flex-col justify-center text-left">
              <h3 className="relative z-10 text-left text-3xl md:text-4xl lg:text-[4.5rem] text-[#000000] mb-6 md:mb-10" style={{ fontFamily: 'Kenyan Coffee, sans-serif' }}>
                LA GALERIE
              </h3>
              <p className="text-[#000000] text-lg md:text-xl lg:text-[1.5rem] leading-relaxed"
                style={{ fontFamily: 'Poppins Regular, sans-serif' }}
              >
                La Galerie Pol Lemétais est un espace dédié à l'art contemporain,
                où la créativité rencontre l'émotion. Nous mettons en lumière des
                artistes émergents et confirmés à travers des expositions uniques.
              </p>

              {/* Bouton Découvrir */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-6 md:mt-8 self-start px-6 md:px-8 py-2 bg-[#972924] text-[#FFFFFF] shadow-md hover:bg-[#6b1a1a] transition duration-300"
                style={{ fontFamily: 'Poppins Regular, sans-serif' }}
              >
                <span className="text-base md:text-lg lg:text-[1.5rem]"> Découvrir </span>
              </motion.button>
            </div>

            {/* Partie Droite - Image */}
            <div className="lg:w-3/7 relative h-64 md:h-86 lg:h-auto mt-8 lg:mt-0">
              <motion.img
                src={laGalerie}
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
        <h2 className="relative z-10 text-left text-5xl md:text-[4.5rem]  text-[#000000] mb-16" style={{ fontFamily: 'Kenyan Coffee, sans-serif' }}>
          LES CATALOGUES
        </h2>

        {/* Swiper Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button 
            onClick={() => window.swiperInstance?.slidePrev()}
            className="absolute -left-4 md:-left-20 top-1/2 -translate-y-1/2 text-black p-1 transition-transform duration-300 hover:scale-125 z-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-10 h-10 md:w-20 md:h-20">
              <path d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button 
            onClick={() => window.swiperInstance?.slideNext()}
            className="absolute -right-4 md:-right-20 top-1/2 -translate-y-1/2 text-black p-1 transition-transform duration-300 hover:scale-125 z-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-10 h-10 md:w-20 md:h-20">
              <path d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>

          {/* Swiper */}
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            className="catalog-swiper"
            onSwiper={(swiper) => {
              window.swiperInstance = swiper;
            }}
          >
            {catalogues.map((catalogue) => (
              <SwiperSlide key={catalogue.id}>
                <motion.div 
                  className="group relative bg-[#000000] overflow-hidden shadow-md h-[20rem] md:h-[28rem] flex flex-col"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link to={`/catalogue/${catalogue.id}`} className="absolute inset-0 z-10">
                    <div className="h-[12rem] md:h-[18rem] overflow-hidden">
                      <img 
                        src={catalogue.image} 
                        alt={catalogue.titre} 
                        className="w-full h-full object-cover group-hover:opacity-80 transition duration-300"
                      />
                    </div>
                    <div className="p-4 text-left">
                      <h3 className="text-xl md:text-2xl lg:text-[2.5rem] text-[#FFFFFF] mb-2 uppercase" style={{ fontFamily: 'Kenyan Coffee, sans-serif' }}>
                        {catalogue.prenom} 
                        <span className='text-[#972924] ml-2'>{catalogue.nom}</span>
                      </h3>
                    </div>
                  </Link>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Bouton Voir la Boutique */}
        <div className="mt-12 md:mt-20 mb-6 text-center px-4 sm:px-6 lg:px-8">
          <a 
            href="#" 
            className="inline-block self-start px-6 md:px-10 py-2 bg-[#972924] text-[#FFFFFF] shadow-md hover:bg-[#6b1a1a] transition duration-300"
            style={{ fontFamily: 'Poppins Regular, sans-serif' }}
          >
            <span className='text-base md:text-lg lg:text-[1.5rem]'>Visiter la boutique</span>
          </a>
        </div>
      </section>
    </div>

  );
};

export default Home;