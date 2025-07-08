import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import circle from '../assets/photos/icons/circle.png';
import calendar from '../assets/photos/icons/calendar.png';
import Medias from '../components/layout/Medias';
import { APP_BASE_URL } from '../hooks/config'; 


const DetailsEvenement = () => {
  const { id } = useParams();
  const [evenement, setEvenement] = useState(null);
  const [loading, setLoading] = useState(true);

  const frenchMonths = [
    'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
    'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
  ];

  // Fetch event details
  const fetchEventDetails = async (eventId) => {
    try {
      const response = await fetch(`${APP_BASE_URL}/evenements/api/${eventId}`);
      if (!response.ok) throw new Error(`Erreur HTTP! Status: ${response.status}`);
      const data = await response.json();
      setEvenement(Array.isArray(data) ? data[0] : data); // handle array or object
    } catch (error) {
      console.error("Erreur lors de la récupération des données de l'événement :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchEventDetails(id);
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!evenement) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Événement non trouvé</h2>
        <Link to="/evenements" className="text-indigo-600 hover:underline">
          Retour aux événements
        </Link>
      </div>
    );
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    // Try ISO first
    let d = new Date(dateString);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
    // Try French long date
    const match = dateString.match(/^([0-9]{1,2}) ([^ ]+) ([0-9]{4})$/);
    if (match) {
      const day = parseInt(match[1], 10);
      const month = frenchMonths.indexOf(match[2].toLowerCase());
      const year = parseInt(match[3], 10);
      if (month !== -1) {
        d = new Date(year, month, day);
        if (!isNaN(d.getTime())) {
          return d.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });
        }
      }
    }
    return 'Date inconnue';
  };

  // Helper to ensure site_url is absolute
  const getValidUrl = (url) => {
    if (!url) return '#';
    if (/^https?:\/\//i.test(url)) return url;
    return 'https://' + url;
  };

  return (
    <div className="relative min-h-screen">
      {/* Header with event photo */}
      <div className="relative w-full h-[28rem] sm:h-[32rem] lg:h-[40rem] overflow-hidden shadow-md">
        <img
          src={evenement.image || '/placeholder-event.jpg'}
          alt={evenement.titre}
          className="absolute inset-0 w-full h-full object-cover object-center"
          loading="eager"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        {/* Back button */}
        <Link
          to="/evenements"
          className="absolute top-6 left-6 z-20 bg-white/90 text-gray-800 p-2 rounded-full shadow-md hover:bg-white transition"
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </Link>
        {/* Event info */}
        <div className="relative z-10 h-full flex flex-col justify-end px-6 sm:px-10 pb-10 text-white">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col items-center justify-center text-center w-full mb-4">
              <div className="flex items-center">
                <img src={circle} alt="circle icon" className="w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10" />
                <h2 className="text-[1.5rem] md:text-[1.75rem] lg:text-[2rem] mb-2 font-bold" style={{ fontFamily: 'Poppins Regular, sans-serif' }}>Événement</h2>
              </div>
              <h1 className="text-[3rem] md:text-[3.5rem] lg:text-[4rem] uppercase mb-3 flex flex-wrap justify-center items-center gap-2 text-center" style={{ fontFamily: 'Kenyan Coffee, sans-serif' }}>
                {evenement.titre.split(' ')[0]}
                <span className='text-[#972924] ml-2'>{evenement.titre.split(' ').slice(1).join(' ')}</span>
              </h1>
              
            </div>
          </motion.div>
        </div>
      </div>
      {/* Date and location section */}
      <motion.section
        className="bg-white rounded-xl shadow-xl py-4 md:py-6 lg:py-8 px-6 md:px-12 flex flex-wrap gap-8 items-center justify-center mt-12 md:mt-16 lg:mt-20 z-20 relative mx-auto max-w-3xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <div className="flex items-center gap-3 text-[#972924] text-xl md:text-2xl">
          <img src={calendar} alt="calendar icon" className="w-6 h-6" />
          <span className="text-black text-base md:text-lg lg:text-xl font-semibold" style={{ fontFamily: 'Poppins Regular, sans-serif' }}>
            {formatDate(evenement.date_debut)}
            {evenement.date_fin ? ` - ${formatDate(evenement.date_fin)}` : ''}
          </span>
        </div>
        <div className="flex items-center gap-3 text-[#972924] text-xl md:text-2xl">
          <span role="img" aria-label="location">📍</span>
          <span className="text-[#972924] text-base md:text-lg lg:text-xl " style={{ fontFamily: 'Poppins Regular, sans-serif' }}>
            {evenement.lieu || 'Inconnu'}
          </span>
        </div>
      </motion.section>

      {/* About section */}
      <section className="relative py-4 md:py-8 lg:py-12 px-2 md:px-6 lg:px-8 bg-white mx-4 md:mx-8 ">
        <div className="relative z-10 ">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="flex flex-col gap-8 md:gap-12 lg:flex-row p-6"
          >
            {/* Left: Event image */}
            <div className="lg:w-3/7 relative h-64 md:h-86 lg:h-auto mt-8 lg:mt-0 flex items-center justify-center">
              <motion.img
                src={evenement.image || '/placeholder-event.jpg'}
                alt="Event"
                className="h-full w-full object-contain"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
            {/* Right: Description */}
            <div className="lg:w-4/7 p-4 lg:pr-8 flex flex-col justify-center text-left">
              <h3 className="relative z-10 text-left text-[1.5rem] md:text-[2rem] lg:text-[2.5rem] text-[#000000] mb-4" style={{ fontFamily: 'Kenyan Coffee, sans-serif' }}>
                À PROPOS DE <span className="text-[#972924]">L'ÉVÉNEMENT</span>
              </h3>
              <p className="text-[#000000] text-[0.85rem] md:text-[1rem] lg:text-[1.25rem] leading-relaxed" style={{ fontFamily: 'Poppins Regular, sans-serif' }}>
                {evenement.description || 'Aucune description disponible pour cet événement.'}
              </p>
              <a href={getValidUrl(evenement.site_url)} target="_blank" rel="noopener noreferrer" className="bg-[#972924] text-[#FFFFFF] max-w-max px-4 py-2 text-[0.85rem] md:text-[1rem] lg:text-[1.25rem] mt-4" style={{ fontFamily: 'Poppins Regular, sans-serif' }}>
                En savoir plus
              </a>
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
              Oeuvres à découvrir
            </h2>
          </div>
          {evenement.oeuvres.length === 0 ? (
            <div className="text-center text-lg text-gray-600 bg-gray-100 p-6 rounded-lg shadow-lg">
              <p>Aucune œuvre disponible pour cet événement pour le moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {evenement.oeuvres.map((oeuvre) => {
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
                      className="w-full max-h-[20rem] object-contain py-4 object-center"
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

      {/* Artistes section */}
      <section className="relative py-8 md:py-16 px-4 sm:px-6 lg:px-8 bg-white mx-4 md:mx-8 mt-12 md:mt-16">
        <div className="relative z-10">
          <div className="flex items-center mb-8">
            <img src={circle} alt="circle icon" className="w-8 h-8 mr-2" />
            <h2 className="text-[1.5rem] md:text-[2rem] lg:text-[2.5rem] text-[#000000] uppercase" style={{ fontFamily: 'Kenyan Coffee, sans-serif' }}>
              Artistes à découvrir
            </h2>
          </div>
          {evenement.artistes && evenement.artistes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {evenement.artistes.map((artiste) => (
                <motion.div 
                  key={artiste.id} 
                  className="group relative bg-[#000000] overflow-hidden shadow-md h-[15rem] md:h-[18rem] lg:h-[20rem] flex flex-col"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link to={`/artistes/${artiste.id}`} className="absolute inset-0 z-10" />
                  {/* Image part */}
                  <div className="h-[10rem] sm:h-[12rem] md:h-[12rem] lg:h-[15rem] overflow-hidden flex items-center justify-center bg-[#000000] p-2">
                    <img 
                      src={artiste.photo} 
                      alt={artiste.nom} 
                      className="object-contain max-h-full max-w-full"
                      style={{ aspectRatio: 'auto' }}
                    />
                  </div>
                  {/* Name part */}
                  <div className="flex-1 flex items-center justify-center bg-white w-full">
                    <h3
                      className="text-[1.25rem] md:text-[1.5rem] lg:text-[1.75rem] text-center uppercase break-words flex flex-row gap-x-2"
                      style={{ fontFamily: 'Kenyan Coffee, sans-serif' }}
                    >
                      <span className="text-black">{artiste.nom.split(' ')[0]}</span>
                      {artiste.nom.split(' ').length > 1 && (
                        <span className="text-[#972924]">{artiste.nom.split(' ').slice(1).join(' ')}</span>
                      )}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center text-lg text-gray-600 bg-gray-100 p-6 rounded-lg shadow-lg">
              <p>Aucun artiste associé à cet événement pour le moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Medias section (optional) */}
     <Medias medias={evenement.medias} />
    </div>
  );
};

export default DetailsEvenement;
