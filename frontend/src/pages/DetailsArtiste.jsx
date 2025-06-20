import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import circle from '../assets/photos/icons/circle.png';
import photoDecorative from '../assets/photos/image_decorative_exposition_individuelles.png';
import Medias from '../components/layout/Medias';

const DetailsArtiste = () => {
  const { id } = useParams();
  const [artiste, setArtiste] = useState(null);
  const [oeuvres, setOeuvres] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch artist details
  const fetchArtistDetails = async (artistId) => {
    try {
      const response = await fetch(`/artistes/api/${artistId}`);
      if (!response.ok) throw new Error(`Erreur HTTP! Status: ${response.status}`);
      const data = await response.json();
      setArtiste(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des données de l'artiste :", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch artist's artworks
  const fetchOeuvresArtiste = async (Id) => {
    try {
      const response = await fetch(`/oeuvres/api/artiste/${Id}`);
      if (!response.ok) throw new Error(`Erreur HTTP! Status: ${response.status}`);
      const data = await response.json();
      setOeuvres(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des œuvres de l'artiste :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtistDetails(id);
    fetchOeuvresArtiste(id);
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!artiste) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Artiste non trouvé</h2>
        <Link to="/artistes" className="text-indigo-600 hover:underline">
          Retour aux artistes
        </Link>
      </div>
    );
  }

  // Split name for color styling
  const [prenom, ...nomRest] = artiste.nom ? artiste.nom.split(' ') : [''];
  const nom = nomRest.join(' ');

  return (
    <div className="relative min-h-screen">
      {/* Header with artist photo */}
      <div className="relative w-full h-[28rem] sm:h-[32rem] lg:h-[40rem] overflow-hidden shadow-md">
        <img
          src={artiste.photo ? artiste.photo.replace('https://', 'http://') : '/uploads/default-artist.jpg'}
          alt={artiste.nom}
          className="absolute inset-0 w-full h-full object-cover object-center"
          loading="eager"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        {/* Back button */}
        <Link
          to="/artistes"
          className="absolute top-6 left-6 z-20 bg-white/90 text-gray-800 p-2 rounded-full shadow-md hover:bg-white transition"
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </Link>
        {/* Artist info */}
        <div className="relative z-10 h-full flex flex-col justify-end px-6 sm:px-10 pb-10 text-white">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col items-center justify-center text-center w-full mb-16">
              <div className="flex items-center">
                <img src={circle} alt="circle icon" className="w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10" />
                <h2 className="text-[1.5rem] md:text-[1.75rem] lg:text-[2rem] mb-2 font-bold" style={{ fontFamily: 'Poppins Regular, sans-serif' }}>Artiste</h2>
              </div>
              <h1 className="text-[3rem] md:text-[3.5rem] lg:text-[4rem] uppercase mb-3 flex flex-wrap justify-center items-center gap-2 text-center" style={{ fontFamily: 'Kenyan Coffee, sans-serif' }}>
                {prenom}
                <span className="text-[#972924]">{nom}</span>
              </h1>
              <div className="flex flex-wrap gap-6 items-center justify-center text-[1rem] md:text-[1.25rem] lg:text-[1.5rem]">
                <span>Né(e) : {artiste.date_naissance || 'Date inconnue'}</span>
                <span>Pays : {artiste.pays || 'Inconnu'}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* About section */}
      <section className="relative py-8 md:py-16 px-4 sm:px-6 lg:px-8 bg-white mx-4 md:mx-8 mt-12 md:mt-16">
        <div className="relative z-10 ">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="flex flex-col gap-8 md:gap-12 lg:flex-row p-6"
          >
            {/* Left: Decorative image */}
            <div className="lg:w-3/7 relative h-64 md:h-86 lg:h-auto mt-8 lg:mt-0">
              <motion.img
                src={photoDecorative}
                alt="Décoratif"
                className="h-full w-full object-cover"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
            {/* Right: Bio and details */}
            <div className="lg:w-4/7 p-4 lg:pr-8 flex flex-col justify-center text-left">
              <h3 className="relative z-10 text-left text-[1.5rem] md:text-[2rem] lg:text-[2.5rem] text-[#000000] mb-6 md:mb-10" style={{ fontFamily: 'Kenyan Coffee, sans-serif' }}>
                A PROPOS DE <span className="text-[#972924]">L'ARTISTE</span>
              </h3>
              <p className="text-[#000000] text-[0.85rem] md:text-[1rem] lg:text-[1.25rem] leading-relaxed" style={{ fontFamily: 'Poppins Regular, sans-serif' }}>
                {artiste.bio || 'Aucune biographie disponible pour cet artiste.'}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Oeuvres section */}
      <section className="relative py-8 md:py-16 px-4 sm:px-6 lg:px-8 bg-white mx-4 md:mx-8 mt-12 md:mt-16">
        <div className="relative z-10">
          <div className="flex items-center mb-8">
            <img src={circle} alt="circle icon" className="w-8 h-8 mr-2" />
            <h2 className="text-[1.5rem] md:text-[2rem] lg:text-[2.5rem] text-[#000000] uppercase" style={{ fontFamily: 'Kenyan Coffee, sans-serif' }}>
              Œuvres à découvrir
            </h2>
          </div>
          {oeuvres.length === 0 ? (
            <div className="text-center text-lg text-gray-600 bg-gray-100 p-6 rounded-lg shadow-lg">
              <p>Aucune œuvre disponible pour cet artiste pour le moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {oeuvres.map((oeuvre) => {
                const [titre1, ...titreRest] = oeuvre.titre ? oeuvre.titre.split(' ') : [''];
                const titre2 = titreRest.join(' ');
                return (
                  <Link
                    key={oeuvre.id}
                    to={`/oeuvres/${oeuvre.id}`}
                    className="bg-[#000000] shadow-md overflow-hidden flex flex-col min-h-[15rem] md:min-h-[20rem] lg:min-h-[25rem] transition-transform hover:scale-105 hover:shadow-lg border border-gray-200"
                  >
                    <img
                      src={oeuvre.image_principale || '/placeholder-artwork.jpg'}
                      alt={oeuvre.titre}
                      className="w-full max-h-[20rem] object-contain object-center"
                    />
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <h4
                        className="text-[1.5rem] md:text-[1.75rem] lg:text-[2rem] font-bold mb-2 text-[#FFFFFF] hover:underline break-words"
                        style={{ fontFamily: 'Kenyan Coffee, sans-serif' }}
                      >
                        {titre1}
                        <span className='text-[#972924] block'>{titre2}</span>
                      </h4>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Medias section (if available in artiste.medias) */}
      {artiste.medias && artiste.medias.length > 0 && (
        <Medias medias={artiste.medias} />
      )}
    </div>
  );
};

export default DetailsArtiste;
