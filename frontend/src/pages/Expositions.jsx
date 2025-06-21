import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import loupe from '../assets/photos/icons/loupe.png';
import calendar from '../assets/photos/icons/calendar.png';
import circle from '../assets/photos/icons/circle.png';

const Expositions = () => {
  const [expositions, setExpositions] = useState([]);
  const [filteredExpositions, setFilteredExpositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedYear, setSelectedYear] = useState('Tous');
  const [years, setYears] = useState([]);
  const [displayedYears, setDisplayedYears] = useState(2);
  const [showVirtualTour, setShowVirtualTour] = useState(false);
  const [selectedExpo, setSelectedExpo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/expositions/api/published');
        if (!response.ok) throw new Error('Erreur HTTP!');
        const data = await response.json();
        const sortedExpos = data.sort((a, b) => new Date(b.date_debut) - new Date(a.date_debut));
        setExpositions(sortedExpos);
        setFilteredExpositions(sortedExpos);
        const uniqueYears = [...new Set(sortedExpos.map(expo => extractYear(expo.date_debut)))]
          .filter(year => year !== null)
          .sort((a, b) => b - a);
        setYears(uniqueYears);
        setDisplayedYears(uniqueYears.length);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let result = expositions;
    if (search) {
      result = result.filter(expo =>
        expo.titre.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (selectedYear !== 'Tous') {
      result = result.filter(expo =>
        extractYear(expo.date_debut)?.toString() === selectedYear
      );
    }
    setFilteredExpositions(result);
  }, [search, selectedYear, expositions]);

  const groupedExpos = filteredExpositions.reduce((acc, expo) => {
    const year = extractYear(expo.date_debut);
    if (!acc[year]) acc[year] = [];
    acc[year].push(expo);
    return acc;
  }, {});

  function extractYear(dateString) {
    if (!dateString) return null;
    const d = new Date(dateString);
    if (!isNaN(d.getFullYear())) return d.getFullYear();
    const match = dateString.match(/\b(19|20)\d{2}\b/);
    return match ? parseInt(match[0], 10) : null;
  }

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

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xl">Chargement des expositions...</div>;
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-xl text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-12">
        <div className="flex items-center mb-8">
          <img src={circle} alt="circle icon" className="w-12 h-12 mr-2" />
          <h2 className="text-2xl md:text-[4rem] text-[#000000] uppercase" style={{ fontFamily: 'Kenyan Coffee, sans-serif' }}>
            Nos Expositions
          </h2>
        </div>
        {/* Filtres en ligne */}
        <div className="flex flex-col md:flex-row gap-12 mb-12 text-left">
          {/* Barre de recherche */}
          <div className="relative w-full md:max-w-md">
            <img 
              src={loupe} 
              alt="loupe icon" 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 ml-6" 
            />
            <input
              type="text"
              placeholder="Rechercher par nom..."
              className="pl-16 pr-4 py-4 border-2 border-[#000000] w-full text-[1rem] focus:border-[#972924] focus:outline-none transition-colors duration-300"
              style={{ fontFamily: 'Poppins Regular, sans-serif' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {/* Filtre par année */}
          <div className="relative w-full md:max-w-xs">
            <img 
              src={calendar} 
              alt="calendar icon" 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 ml-6" 
            />
            <select
              className="pl-16 pr-4 py-4 border-2 border-[#000000] w-full text-[1rem] appearance-none bg-white focus:border-[#972924] focus:outline-none transition-colors duration-300 cursor-pointer"
              style={{ fontFamily: 'Poppins Regular, sans-serif', borderRadius: '0' }}
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="Tous" style={{ fontFamily: 'Poppins Regular, sans-serif', padding: '1rem' }}>Trier par année</option>
              {years.map((year) => (
                <option 
                  key={year} 
                  value={year}
                  style={{ fontFamily: 'Poppins Regular, sans-serif', padding: '1rem', backgroundColor: 'white', fontSize: '1rem' }}
                >
                  {year}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-[#000000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
        <div className="space-y-12  md:px-4 lg:px-8">
          {Object.keys(groupedExpos)
            .sort((a, b) => b - a)
            .slice(0, displayedYears)
            .map((year) => (
              <div key={year} className="space-y-8 relative ">
                <div className="flex items-center">
                  <div className="flex flex-col items-center mr-8">
                    <div className="w-3 h-3 bg-[#000000] rounded-full"></div>
                    <div className="absolute top-[4.5rem] left-[0.375rem] w-0.5 bg-[#000000]" style={{ height: 'calc(100% - 4.5rem)' }}></div>
                  </div>
                  <h2 className="text-2xl md:text-4xl text-[#000000]" style={{ fontFamily: 'Poppins ExtraLight, sans-serif' }}>
                    {year}
                  </h2>
                </div>
                <div className=" md:px-2 lg:px-8 ml-4 space-y-8 md:space-y-12 lg:space-y-16">
                  {groupedExpos[year].map((expo, idx) => (
                    <motion.div
                      key={expo.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="flex flex-row border border-3 border-[#972924] overflow-hidden bg-white h-[18rem] md:h-[24rem] lg:h-[26rem] "
                    >
                      {/* Image */}
                      <div className="w-2/5  h-full flex-shrink-0">
                        <img
                          src={expo.image || '/placeholder-event.jpg'}
                          alt={expo.titre}
                          className="object-container w-full h-full"
                        />
                      </div>
                      {/* Info */}
                      <div className="w-3/5 flex flex-col justify-between p-1 md:p-6 lg:p-8 bg-white">
                        <div>
                          <img src={circle} alt="circle icon" className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 lg:mb-2" />
                          {/* Top part: Title/Artist and Dates */}
                          <div className="flex justify-between items-start">
                            {/* Left: title, artist */}
                            <div className="w-2/3">
                              <span className="uppercase text-[1.25rem] md:text-[1.5rem] lg:text-[2rem]" style={{ fontFamily: 'Kenyan Coffee, sans-serif' }}>
                                {expo.titre.split(' ').slice(0, -1).join(' ')}{' '}
                                <span className="text-[#972924]">{expo.titre.split(' ').slice(-1)}</span>
                              </span>
                              <Link to={`/artistes/${expo.artiste_principal.id}`} className="uppercase text-[1rem] md:text-[1.5rem] lg:text-[1.75rem] mt-1 block hover:text-[#972924] hover:underline" style={{ fontFamily: 'Kenyan Coffee, sans-serif' }}>
                                {expo.artiste_principal.nom}
                              </Link>
                            </div>
                            {/* Right: Dates */}
                            <div className="w-1/3 text-right text-black text-[0.6rem] md:text-[0.9rem] lg:text-[1rem]" style={{ fontFamily: 'Poppins Regular, sans-serif' }}>
                              <div className="hidden md:block">Du {formatDateShort(expo.date_debut)} au {formatDateShort(expo.date_fin)}</div>
                              <div className="block md:hidden">
                                <div>Du {formatDateShort(expo.date_debut)}</div>
                                <div>au {formatDateShort(expo.date_fin)}</div>
                              </div>
                            </div>
                          </div>
                          {/* Description */}
                          <p className="line-clamp-2 text-[0.8rem] md:text-[1rem] lg:text-[1.1rem] text-black mt-2 md:mt-4" style={{ fontFamily: 'Poppins Regular, sans-serif' }}>
                            {expo.description}
                          </p>
                          {/* Autres artistes */}
                          {expo.artistes && expo.artistes.length > 0 && (
                            <>
                              {/* Mobile: Only heading */}
                              <motion.div 
                                className="block md:hidden mt-3"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                              >
                                
                                <div className="flex flex-wrap gap-1">
                                  {expo.artistes.map((artist, index) => (
                                    <motion.div
                                      key={artist.id}
                                      initial={{ opacity: 0, scale: 0.8 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      transition={{ duration: 0.3, delay: index * 0.1 }}
                                      whileHover={{ scale: 1.05, y: -2 }}
                                      className="inline-block"
                                    >
                                      <Link 
                                        to={`/artistes/${artist.id}`} 
                                        className="inline-block px-2 py-1 bg-gray-100 hover:bg-[#972924] hover:text-white text-[#972924] rounded-full text-[0.65rem] transition-all duration-300 border border-gray-200 hover:border-[#972924] shadow-sm hover:shadow-md"
                                        style={{ fontFamily: 'Poppins Regular, sans-serif' }}
                                      >
                                        {artist.nom}
                                      </Link>
                                    </motion.div>
                                  ))}
                                </div>
                              </motion.div>
                              {/* Desktop: Full section with pills */}
                              <div className="hidden md:block mt-3 md:mt-4">
                                <h4 className="text-[0.75rem] md:text-[0.9rem] lg:text-[1rem] text-[#972924] font-semibold mb-2" style={{ fontFamily: 'Poppins Medium, sans-serif' }}>
                                  Autres artistes :
                                </h4>
                                <div className="flex flex-wrap gap-1 md:gap-2">
                                  {expo.artistes.map((artist, index) => (
                                    <motion.div
                                      key={artist.id}
                                      initial={{ opacity: 0, scale: 0.8 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      transition={{ duration: 0.3, delay: index * 0.1 }}
                                      whileHover={{ scale: 1.05, y: -2 }}
                                      className="inline-block"
                                    >
                                      <Link 
                                        to={`/artistes/${artist.id}`} 
                                        className="inline-block px-2 py-1 md:px-3 md:py-1.5 bg-gray-100 hover:bg-[#972924] hover:text-white text-[#972924] rounded-full text-[0.65rem] md:text-[0.75rem] lg:text-[0.8rem] transition-all duration-300 border border-gray-200 hover:border-[#972924] shadow-sm hover:shadow-md"
                                        style={{ fontFamily: 'Poppins Regular, sans-serif' }}
                                      >
                                        {artist.nom}
                                      </Link>
                                    </motion.div>
                                  ))}
                                </div>
                              </div>
                            </>
                          )}
                        </div>

                        {/* Bottom section: Buttons */}
                        <div className="flex justify-between items-center mt-2 md:mt-4 lg:mt-6 gap-1 sm:gap-2">
                          <Link
                            to={`/expositions/${expo.id}`}
                            className="px-1 py-1 sm:px-2 md:px-4 md:py-2 bg-[#972924] text-white hover:bg-[#b33c36] transition text-[0.6rem] sm:text-[0.7rem] md:text-sm flex-1 sm:flex-none text-center"
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
                            className="px-1 py-1 sm:px-2 md:px-4 md:py-2 bg-[#972924] text-white hover:bg-[#b33c36] transition text-[0.6rem] sm:text-[0.7rem] md:text-sm flex-1 sm:flex-none text-center"
                          >
                            <span className="hidden md:inline">Voir la </span>Visite virtuelle
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
        </div>
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
        {/* "Afficher plus" and "Afficher moins" buttons */}
        {years.length > 2 && (
          <div className="mt-12 md:mt-20 mb-6 text-center px-4 sm:px-6 lg:px-8">
            {displayedYears < years.length ? (
              <button
                onClick={() => setDisplayedYears(years.length)}
                className="inline-flex items-center gap-2 px-6 md:px-10 py-2 bg-[#FFFFFF] text-[#525252] border border-[#000000] shadow-md hover:bg-[#972924] hover:text-[#FFFFFF] hover:border-[#972924] transition-all duration-300"
                style={{ fontFamily: 'Poppins Regular, sans-serif' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                <span className='text-[0.9rem] md:text-[1rem] lg:text-[1.5rem]' style={{ fontFamily: 'Poppins Regular, sans-serif' }}>Afficher plus</span>
              </button>
            ) : (
              <button
                onClick={() => setDisplayedYears(2)}
                className="inline-flex items-center gap-2 px-6 md:px-10 py-2 bg-[#FFFFFF] text-[#525252] border border-[#000000] shadow-md hover:bg-[#972924] hover:text-[#FFFFFF] hover:border-[#972924] transition-all duration-300"
                style={{ fontFamily: 'Poppins Regular, sans-serif' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span className='text-[0.9rem] md:text-[1rem] lg:text-[1.5rem]' style={{ fontFamily: 'Poppins Regular, sans-serif' }}>Afficher moins</span>
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Expositions;
