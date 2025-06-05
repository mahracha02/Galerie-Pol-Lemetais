import React from 'react';
import { motion } from 'framer-motion';
import circle from '../assets/photos/icons/circle.png';
import Profile from '../assets/photos/profile.jpg';
import LaGalerie from '../assets/photos/image_decorative_a_propos_1.jpg';

// Import new images for the 'Ils en parlent' section (replace with actual paths)
import imageIlsParlent1 from '../assets/photos/media1.png'; 
import imageIlsParlent2 from '../assets/photos/media2.png';
import imageIlsParlent3 from '../assets/photos/media3.png';

const Apropos = () => {
  return (
    <div className="bg-white">
      {/* "LA GALERIE" Section */}
      <section className="relative py-8 md:py-16 bg-white mt-[-4rem]">
        {/* Contenu */}
        <div className="relative z-10">
          {/* Layout for text and image */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col gap-8 md:gap-12 md:flex-row"
          >
            {/* Partie Gauche - Image */}
            <div className="w-full md:w-1/2 relative h-64 md:h-auto">
              <motion.img
                src={LaGalerie}
                alt="Galerie d'art"
                className="h-full w-full object-cover"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>

            {/* Partie Droite - Text Content */}
            <div className="w-full md:w-1/2 text-left px-4 md:pr-24 lg:pr-48 flex items-center">
              <div className="flex flex-col">
                <div className="flex items-center mb-8">
                  <img src={circle} alt="circle icon" className="w-12 h-12 mr-2" />
                  <h2 className="text-2xl md:text-[4rem] text-[#000000]" style={{ fontFamily: 'Kenyan Coffee, sans-serif' }}>
                    LA <span className="text-[#972924]">GALERIE</span>
                  </h2>
                </div>
                <p className="text-[#000000] text-[1.5rem] leading-relaxed" style={{ fontFamily: 'Poppins Regular, sans-serif' }}>
                  <b>Bienvenue à la galerie Pol Lemétais !</b><br />
                  Lorem ipsum dolor sit amet, consectetur adipiscing
                  elit, sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua. Ut enim ad minim veniam,
                  quis nostrud exercitation ullamco laboris nisi ut
                  aliquip ex ea commodo consequat.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* "À PROPOS" Section */}
      <section className="relative py-8 md:py-16 bg-white mt-8 md:mt-4">
        {/* Contenu */}
        <div className="relative z-10">
          {/* Layout for text and image */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col gap-8 md:gap-12 md:flex-row"
          >
            {/* Partie Gauche - Text Content */}
            <div className="w-full md:w-1/2 text-left px-4 md:pl-20 lg:pl-28 flex items-center">
              <div className="flex flex-col">
                <div className="flex items-center mb-8">
                  <img src={circle} alt="circle icon" className="w-12 h-12 mr-2" />
                  <h2 className="text-2xl md:text-[4rem] text-[#000000]" style={{ fontFamily: 'Kenyan Coffee, sans-serif' }}>
                    À PROPOS
                  </h2>
                </div>
                <p className="text-[#000000] text-[1.5rem] leading-relaxed" style={{ fontFamily: 'Poppins Regular, sans-serif' }}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing
                  elit, sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua. Ut enim ad minim veniam,
                  quis nostrud exercitation ullamco laboris nisi ut
                  aliquip ex ea commodo consequat.
                </p>
              </div>
            </div>

            {/* Partie Droite - Image */}
            <div className="w-full md:w-1/2 relative h-64 md:h-auto">
              <motion.img
                src={Profile}
                alt="Profil de Pol Lemétais"
                className="h-full w-full object-cover"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* "ILS EN PARLENT" Section*/}
      <section className="relative py-8 md:py-16 bg-white px-4 sm:px-6 lg:px-24 mt-8 md:mt-4">
        <div className="flex items-center mb-8">
          <img src={circle} alt="circle icon" className="w-12 h-12 mr-2" />
          <h2 className="text-2xl md:text-[4rem] text-[#000000]" style={{ fontFamily: 'Kenyan Coffee, sans-serif' }}>
            ILS EN PARLENT
          </h2>
        </div>
        {/* Contenu */}
        <div className="relative z-10 flex flex-col md:flex-row">

          {/* Left Side - Divided into two images (w-1/2) */}
          <div className="w-full md:w-1/2 flex flex-col">
            {/* Top Image (h-1/2) */}
            <div className="w-full h-64 md:h-1/2 relative group">
                <img src={imageIlsParlent1} alt="Image 1" className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-50" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="bg-[#972924] text-[#FFFFFF] px-6 py-3 flex items-center gap-2 hover:bg-[#D52D25] transition-colors duration-300"
                            style={{ fontFamily: 'Poppins Regular, sans-serif' }}
                    >
                        <a href="#">En savoir plus</a>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                    </button>
                </div>
            </div>
            {/* Bottom Image (h-1/2) */}
            <div className="w-full h-64 md:h-1/2 relative group">
                <img src={imageIlsParlent2} alt="Image 2" className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-50" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="bg-[#972924] text-[#FFFFFF] px-6 py-3 flex items-center gap-2 hover:bg-[#D52D25] transition-colors duration-300"
                            style={{ fontFamily: 'Poppins Regular, sans-serif' }}
                    >
                        <a href="#">En savoir plus</a>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                    </button>
                </div>
            </div>
          </div>

          {/* Right Side - Divided into two images (w-1/2) */}
          <div className="w-full md:w-1/2 flex flex-col">
            {/* Image */}
            <div className="w-full h-full relative group">
                <img src={imageIlsParlent3} alt="Image 3" className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-50" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="bg-[#972924] text-[#FFFFFF] px-6 py-3  flex items-center gap-2 hover:bg-[#D52D25] transition-colors duration-300"
                            style={{ fontFamily: 'Poppins Regular, sans-serif' }}
                    >
                        <a href="#">En savoir plus</a>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                    </button>
                </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};

export default Apropos;
