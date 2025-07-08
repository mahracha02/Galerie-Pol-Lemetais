import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import circle from '../assets/photos/icons/circle.png';
import photoDecorative from '../assets/photos/image_decorative_exposition_individuelles.png';
import Medias from '../components/layout/Medias';
import { APP_BASE_URL } from '../hooks/config'; 

const DetailsArtiste = () => {
  const { id } = useParams();
  const [artiste, setArtiste] = useState({
    id: null,
    nom: '',
    bio: '',
    photo: '',
    date_naissance: '',
    date_deces: null,
    pays: '',
    medias: [],
    exposition_principale: [],
    expositions: [],
    oeuvres: []
  });
  const [loading, setLoading] = useState(true);
  const [showVirtualTour, setShowVirtualTour] = useState(false);
  const [selectedExpo, setSelectedExpo] = useState(null);
  const [showAllOeuvres, setShowAllOeuvres] = useState(false);

  // Fetch artist details
  const fetchArtistDetails = async (artistId) => {
    try {
      const response = await fetch(`${APP_BASE_URL}/artistes/api/${artistId}`);
      if (!response.ok) throw new Error(`Erreur HTTP! Status: ${response.status}`);
      const data = await response.json();
      setArtiste(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des données de l'artiste :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([
        fetchArtistDetails(id),
      ]);
      setLoading(false);
    };
    fetchData();
  }, [id]);

  const allExpositions = useMemo(() => {
    if (!artiste) {
      return [];
    }
    
    const principalExpo = Array.isArray(artiste.exposition_principale) ? artiste.exposition_principale[0] : artiste.exposition_principale;
    const expositions = artiste.expositions || [];
    const expoIds = new Set(expositions.map(e => e.id));
    
    let combinedExpos = [...expositions];

    if (principalExpo && !expoIds.has(principalExpo.id)) {
      combinedExpos.unshift(principalExpo);
    }
    
    return combinedExpos.map(expo => ({
      ...expo,
      isPrincipal: principalExpo && expo.id === principalExpo.id,
    }));
  }, [artiste]);

  const formatDateShort = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
      });
    }
    return 'Date invalide';
  };

  // --- Principal and Other Expositions Logic ---
  const principalExpo = Array.isArray(artiste?.exposition_principale)
    ? artiste.exposition_principale[0]
    : artiste?.exposition_principale;

  const expositions = artiste?.expositions || [];
  const otherExpos = principalExpo && principalExpo.id
    ? expositions.filter(expo => expo.id !== principalExpo.id)
    : expositions;

  // Debug logs
  // console.log('principalExpo:', principalExpo);
  // console.log('otherExpos:', otherExpos);

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

  // Always use arrays for relations
  const oeuvresArray = Array.isArray(artiste.oeuvres) ? artiste.oeuvres : [];
  const expositionsArray = Array.isArray(artiste.expositions) ? artiste.expositions : [];
  const principalExpoArray = Array.isArray(artiste.exposition_principale) ? artiste.exposition_principale : [];
  const hasPrincipalExpo = principalExpoArray.length > 0 || (!!artiste.exposition_principale && typeof artiste.exposition_principale === 'object' && Object.keys(artiste.exposition_principale).length > 0);
  const displayedOeuvres = showAllOeuvres ? oeuvresArray : oeuvresArray.slice(0, 8);
  console.log('Displayed Oeuvres:', displayedOeuvres);

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
            <div className="flex flex-col items-center justify-center text-center w-full mb-8">
              <div className="flex items-center">
                <img src={circle} alt="circle icon" className="w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10" />
                <h2 className="text-[1.5rem] md:text-[1.75rem] lg:text-[2rem] mb-2 font-bold" style={{ fontFamily: 'Poppins Regular, sans-serif' }}>Artiste</h2>
              </div>
              <h1 className="text-[3rem] md:text-[3.5rem] lg:text-[4rem] uppercase mb-3 flex flex-wrap justify-center items-center gap-2 text-center" style={{ fontFamily: 'Kenyan Coffee, sans-serif' }}>
                {prenom}
                <span className="text-[#972924]">{nom}</span>
              </h1>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Naissance et Pays section - modern, animated, visible */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
        className="w-full flex justify-center mt-12"
      >
        <div className="bg-white rounded-xl shadow-lg px-6 py-4 flex flex-wrap gap-8 items-center justify-center text-[1rem] md:text-[1.25rem] lg:text-[1.5rem] font-semibold" style={{ fontFamily: 'Poppins Regular, sans-serif' }}>
          <span className="text-black">Né(e) : <span className="text-[#972924]">{artiste.date_naissance || 'Date inconnue'}</span></span>
          <span className="text-black">Pays : <span className="text-[#972924]">{artiste.pays || 'Inconnu'}</span></span>
        </div>
      </motion.section>

      {/* About section */}
      <section className="relative py-8 md:py-16 px-4 sm:px-6 lg:px-8 bg-white mx-4 md:mx-8 mt-12 md:mt-16">
        <div className="relative z-10 ">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="flex flex-col gap-8 md:gap-12 lg:flex-row p-6"
          >
            {/* Left: Artiste image */}
            <div className="lg:w-3/7 relative h-64 md:h-86 lg:h-auto mt-8 lg:mt-0">
              <motion.img
                src={artiste.photo}
                alt="Artiste"
                className="h-full w-full object-contain"
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
          {oeuvresArray.length === 0 ? (
            <div className="text-center text-lg text-gray-600 bg-gray-100 p-6 rounded-lg shadow-lg">
              <p>Aucune œuvre disponible pour cet artiste pour le moment.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {displayedOeuvres.map((oeuvre) => {
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
              {oeuvresArray.length > 8 && (
                <div className="flex justify-center mt-12">
                  <button
                    onClick={() => setShowAllOeuvres((v) => !v)}
                    className="bg-[#FFFFFF] border border-[#972924] text-[#972924]  text-[1rem] md:text-[1.25rem] lg:text-[1.5rem] px-6 py-2  hover:bg-[#b33c36] hover:text-[#FFFFFF] transition"
                    style={{ fontFamily: 'Poppins Regular, sans-serif' }}
                  >
                    {showAllOeuvres ? ' Afficher moins' : 'Afficher plus'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Expositions section */}
      <section className="relative py-8 md:py-16 px-4 sm:px-6 lg:px-8 bg-white mx-4 md:mx-8 mt-12 md:mt-16">
        <div className="relative z-10">
          <div className="flex items-center mb-8">
            <img src={circle} alt="circle icon" className="w-8 h-8 mr-2" />
            <h2 className="text-[1.5rem] md:text-[2rem] lg:text-[2.5rem] text-[#000000] uppercase" style={{ fontFamily: 'Kenyan Coffee, sans-serif' }}>
              Expositions à découvrir
            </h2>
          </div>

          {/* Principal Exposition Card */}
          {principalExpo && principalExpo.id && (
            <div className="mb-12 md:px-8">
              <div className="flex flex-col md:flex-row border-4 border-[#972924] overflow-hidden bg-white h-auto md:h-[24rem] lg:h-[26rem] shadow-lg relative">
                <div className="absolute top-2 right-2 z-10 bg-[#972924] text-white text-[0.75rem] md:text-[0.875rem] lg:text-[1rem] font-bold px-3 py-1 rounded shadow-lg">
                  EXPOSITION PRINCIPALE
                </div>
                {/* Image */}
                <div className="w-full md:w-2/5 h-48 md:h-full flex-shrink-0 flex items-center justify-center bg-gray-100 p-4">
                  <img
                    src={principalExpo.image || '/placeholder-event.jpg'}
                    alt={principalExpo.titre}
                    className="object-contain max-h-full max-w-full"
                    style={{ aspectRatio: 'auto' }}
                  />
                </div>
                {/* Info */}
                <div className="w-full md:w-3/5 flex flex-col justify-between p-3 md:p-6 lg:p-8 bg-white">
                  <div>
                    <img src={circle} alt="circle icon" className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 lg:mb-2" />
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                      <div className="w-full md:w-2/3">
                        <span className="uppercase text-[1.25rem] md:text-[1.5rem] lg:text-[2rem]" style={{ fontFamily: 'Kenyan Coffee, sans-serif' }}>
                          {principalExpo.titre?.split(' ').slice(0, -1).join(' ')}{' '}
                          <span className="text-[#972924]">{principalExpo.titre?.split(' ').slice(-1)}</span>
                        </span>
                        {principalExpo.artiste_principal && (
                          <div className="uppercase text-[1rem] md:text-[1.5rem] lg:text-[1.75rem] mt-1 block hover:underline" style={{ fontFamily: 'Kenyan Coffee, sans-serif' }}>
                            {principalExpo.artiste_principal.nom}
                          </div>
                        )}
                      </div>
                      <div className="w-full md:w-1/3 text-right text-black text-[0.6rem] md:text-[0.9rem] lg:text-[1rem] mt-2 md:mt-0" style={{ fontFamily: 'Poppins Regular, sans-serif' }}>
                        <div className="hidden md:block">Du {formatDateShort(principalExpo.date_debut)} au {formatDateShort(principalExpo.date_fin)}</div>
                        <div className="block md:hidden">
                          <div>Du {formatDateShort(principalExpo.date_debut)}</div>
                          <div>au {formatDateShort(principalExpo.date_fin)}</div>
                        </div>
                      </div>
                    </div>
                    <p className="line-clamp-2 text-[0.8rem] md:text-[1rem] lg:text-[1.1rem] text-black mt-2 md:mt-4" style={{ fontFamily: 'Poppins Regular, sans-serif' }}>
                      {principalExpo.description}
                    </p>
                    {/* Autres artistes */}
                    {principalExpo.artistes && principalExpo.artistes.length > 0 && (
                      <div className="mt-3 md:mt-4">
                        <h4 className="text-[0.75rem] md:text-[0.9rem] lg:text-[1rem] text-[#972924] font-semibold mb-2" style={{ fontFamily: 'Poppins Medium, sans-serif' }}>
                          Autres artistes :
                        </h4>
                        <div className="flex flex-wrap gap-1 md:gap-2">
                          {principalExpo.artistes.map((artist) => (
                            <Link
                              to={`/artistes/${artist.id}`}
                              key={artist.id}
                              className="inline-block px-2 py-1 md:px-3 md:py-1.5 bg-gray-100 hover:bg-[#972924] hover:text-white text-[#972924] rounded-full text-[0.65rem] md:text-[0.75rem] lg:text-[0.8rem] transition-all duration-300 border border-gray-200 hover:border-[#972924] shadow-sm hover:shadow-md"
                              style={{ fontFamily: 'Poppins Regular, sans-serif' }}
                            >
                              {artist.nom}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Bottom section: Buttons */}
                  <div className="flex flex-col sm:flex-row justify-between items-center mt-2 md:mt-4 lg:mt-6 gap-2">
                    <Link
                      to={`/expositions/${principalExpo.id}`}
                      className="w-full sm:w-auto mb-2 sm:mb-0 px-1 py-1 sm:px-2 md:px-4 md:py-2 bg-[#972924] text-white hover:bg-[#b33c36] transition text-[0.6rem] sm:text-[0.7rem] md:text-sm text-center"
                    >
                      En savoir plus
                    </Link>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedExpo(principalExpo);
                        setShowVirtualTour(true);
                      }}
                      className="w-full sm:w-auto px-1 py-1 sm:px-2 md:px-4 md:py-2 bg-[#972924] text-white hover:bg-[#b33c36] transition text-[0.6rem] sm:text-[0.7rem] md:text-sm text-center"
                    >
                      <span className="hidden md:inline">Voir la </span>Visite virtuelle
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other Expositions */}
          {otherExpos.length === 0 && !hasPrincipalExpo ? (
            <div className="text-center text-lg text-gray-600 bg-gray-100 p-6 rounded-lg shadow-lg">
              <p>Aucune exposition disponible pour cet artiste pour le moment.</p>
            </div>
          ) : (
            <div className="space-y-8 md:space-y-12 lg:space-y-16 md:px-12">
              {otherExpos.map((expo, idx) => (
                <motion.div
                  key={expo.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="flex flex-col md:flex-row border border-3 border-[#972924] overflow-hidden bg-white h-auto md:h-[24rem] lg:h-[26rem]"
                >
                  {/* Image */}
                  <div className="w-full md:w-2/5 h-48 md:h-full flex-shrink-0 flex items-center justify-center bg-gray-100 p-4">
                    <img
                      src={expo.image || '/placeholder-event.jpg'}
                      alt={expo.titre}
                      className="object-contain max-h-full max-w-full"
                      style={{ aspectRatio: 'auto' }}
                    />
                  </div>
                  {/* Info */}
                  <div className="w-full md:w-3/5 flex flex-col justify-between p-3 md:p-6 lg:p-8 bg-white">
                    <div>
                      <img src={circle} alt="circle icon" className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 lg:mb-2" />
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div className="w-full md:w-2/3">
                          <span className="uppercase text-[1.25rem] md:text-[1.5rem] lg:text-[2rem]" style={{ fontFamily: 'Kenyan Coffee, sans-serif' }}>
                            {expo.titre?.split(' ').slice(0, -1).join(' ')}{' '}
                            <span className="text-[#972924]">{expo.titre?.split(' ').slice(-1)}</span>
                          </span>
                          {expo.artiste_principal && (
                            <Link to={`/artistes/${expo.artiste_principal.id}`} className="uppercase text-[1rem] md:text-[1.5rem] lg:text-[1.75rem] mt-1 block hover:text-[#972924] hover:underline" style={{ fontFamily: 'Kenyan Coffee, sans-serif' }}>
                              {expo.artiste_principal.nom}
                            </Link>
                          )}
                        </div>
                        <div className="w-full md:w-1/3 text-right text-black text-[0.6rem] md:text-[0.9rem] lg:text-[1rem] mt-2 md:mt-0" style={{ fontFamily: 'Poppins Regular, sans-serif' }}>
                          <div className="hidden md:block">Du {formatDateShort(expo.date_debut)} au {formatDateShort(expo.date_fin)}</div>
                          <div className="block md:hidden">
                            <div>Du {formatDateShort(expo.date_debut)}</div>
                            <div>au {formatDateShort(expo.date_fin)}</div>
                          </div>
                        </div>
                      </div>
                      <p className="line-clamp-2 text-[0.8rem] md:text-[1rem] lg:text-[1.1rem] text-black mt-2 md:mt-4" style={{ fontFamily: 'Poppins Regular, sans-serif' }}>
                        {expo.description}
                      </p>
                      {/* Autres artistes */}
                      {expo.artistes && expo.artistes.length > 0 && (
                        <div className="mt-3 md:mt-4">
                          <h4 className="text-[0.75rem] md:text-[0.9rem] lg:text-[1rem] text-[#972924] font-semibold mb-2" style={{ fontFamily: 'Poppins Medium, sans-serif' }}>
                            Autres artistes :
                          </h4>
                          <div className="flex flex-wrap gap-1 md:gap-2">
                            {expo.artistes.map((artist) => (
                              <Link
                                to={`/artistes/${artist.id}`}
                                key={artist.id}
                                className="inline-block px-2 py-1 md:px-3 md:py-1.5 bg-gray-100 hover:bg-[#972924] hover:text-white text-[#972924] rounded-full text-[0.65rem] md:text-[0.75rem] lg:text-[0.8rem] transition-all duration-300 border border-gray-200 hover:border-[#972924] shadow-sm hover:shadow-md"
                                style={{ fontFamily: 'Poppins Regular, sans-serif' }}
                              >
                                {artist.nom}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    {/* Bottom section: Buttons */}
                    <div className="flex flex-col sm:flex-row justify-between items-center mt-2 md:mt-4 lg:mt-6 gap-2">
                      <Link
                        to={`/expositions/${expo.id}`}
                        className="w-full sm:w-auto mb-2 sm:mb-0 px-1 py-1 sm:px-2 md:px-4 md:py-2 bg-[#972924] text-white hover:bg-[#b33c36] transition text-[0.6rem] sm:text-[0.7rem] md:text-sm text-center"
                      >
                        En savoir plus
                      </Link>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedExpo(expo);
                          setShowVirtualTour(true);
                        }}
                        className="w-full sm:w-auto px-1 py-1 sm:px-2 md:px-4 md:py-2 bg-[#972924] text-white hover:bg-[#b33c36] transition text-[0.6rem] sm:text-[0.7rem] md:text-sm text-center"
                      >
                        <span className="hidden md:inline">Voir la </span>Visite virtuelle
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Medias section */}
      <Medias medias={artiste.medias} />
      
      {/* Modal for Virtual Tour */}
      {showVirtualTour && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={() => setShowVirtualTour(false)}>
          <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full relative p-6" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowVirtualTour(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-2xl font-bold"
              aria-label="Fermer"
            >
              &times;
            </button>
            {selectedExpo && selectedExpo.visite_virtuelle_url ? (
              <>
                <h2 className="text-[1.5rem] md:text-[1.75rem] lg:text-[2rem]  mb-4 text-black" style={{ fontFamily: 'Kenyan Coffee, sans-serif' }}>
                  Visite virtuelle: <span className="text-[#972924] uppercase">{selectedExpo.titre}</span> 
                </h2>
                <div className="w-full aspect-video mb-2">
                  <iframe
                    src={selectedExpo.visite_virtuelle_url}
                    title="Visite virtuelle"
                    className="w-full h-[400px] rounded-lg border-2 border-[#972924]"
                    allowFullScreen
                  />
                </div>
                <a
                  href={selectedExpo.visite_virtuelle_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#972924] text-white hover:bg-[#b33c36] transition text-xs md:text-sm text-center block mt-4"
                > 
                  Ouvrir dans une nouvelle fenêtre
                </a>
              </>
            ) : (
              <div className="text-center p-8">
                <h2 className="text-[1.5rem] md:text-[1.75rem] lg:text-[2rem] font-bold mb-4 text-[#972924]" style={{ fontFamily: 'Kenyan Coffee, sans-serif' }}>
                  Visite virtuelle non disponible
                </h2>
                <p className="text-gray-600 text-[0.9rem] md:text-[1rem] lg:text-[1.1rem]">La visite virtuelle pour cette exposition n'est pas encore disponible.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailsArtiste;
