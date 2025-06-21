import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import circle from '../assets/photos/icons/circle.png';
import loupe from '../assets/photos/icons/loupe.png';
import { Link } from 'react-router-dom';

const Artistes = () => {
  const [artists, setArtists] = useState([]);
  const [filteredArtists, setFilteredArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('Tous');
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    // Fetch artists and countries from the API
    const fetchData = async () => {
      try {
        const response = await fetch('/artistes/api');
        
        if (!response.ok) {
          throw new Error(`Erreur HTTP! Status: ${response.status}`);
        }
        const data = await response.json();

        setArtists(data);
        setFilteredArtists(data); 
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement des artistes:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Filter artists based on search, country, and name
    const filterArtists = () => {
      let result = artists;

      // Filter by search text (name, country, or other fields)
      if (search) {
        result = result.filter(artist =>
          artist.nom.toLowerCase().includes(search.toLowerCase()) ||
          artist.pays.toLowerCase().includes(search.toLowerCase())
        );
      }

      // Filter by country
      if (selectedCountry !== 'Tous') {
        result = result.filter(artist => artist.pays === selectedCountry);
      }

      setFilteredArtists(result);
    };

    filterArtists();
  }, [search, selectedCountry, artists]);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-12">
        <div className="flex items-center mb-8">
          <img src={circle} alt="circle icon" className="w-12 h-12 mr-2" />
          <h2 className="text-2xl md:text-[4rem] text-[#000000]" style={{ fontFamily: 'Kenyan Coffee, sans-serif' }}>
            ARTISTES
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
              placeholder="Rechercher par nom ou pays..."
              className="pl-16 pr-4 py-4 border-2 border-[#000000] w-full text-[1rem] focus:border-[#972924] focus:outline-none transition-colors duration-300"
              style={{ fontFamily: 'Poppins Regular, sans-serif' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filtre par pays */}
          <div className="relative w-full md:max-w-xs">
            <select
              className="px-4 pr-4 py-4 border-2 border-[#000000] w-full text-[1rem] appearance-none bg-white focus:border-[#972924] focus:outline-none transition-colors duration-300 cursor-pointer"
              style={{ 
                fontFamily: 'Poppins Regular, sans-serif',
                borderRadius: '0'
              }}
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
            >
              <option value="Tous" style={{ fontFamily: 'Poppins Regular, sans-serif', padding: '1rem' }}>Sélectionner un pays</option>
              {[...new Set(artists.map((artist) => artist.pays))]
                .filter(Boolean)
                .map((country) => (
                  <option 
                    key={country} 
                    value={country}
                    style={{ 
                      fontFamily: 'Poppins Regular, sans-serif',
                      padding: '1rem',
                      backgroundColor: 'white',
                      fontSize: '1rem'
                    }}
                  >
                    {country}
                  </option>
                ))}
            </select>
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-[#000000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Filtre par nom d'artiste */}
          <div className="relative w-full md:max-w-xs">
            <select
              className="px-4 py-4 border-2 border-[#000000] w-full text-[1rem] appearance-none bg-white focus:border-[#972924] focus:outline-none transition-colors duration-300 cursor-pointer"
              style={{ 
                fontFamily: 'Poppins Regular, sans-serif',
                borderRadius: '0'
              }}
              onChange={(e) => setSearch(e.target.value)}
              value={search}
            >
              <option value="" style={{ fontFamily: 'Poppins Regular, sans-serif', padding: '1rem' }}>Tous les artistes</option>
              {[...new Set(artists.map((artist) => artist.nom))]
                .filter(Boolean)
                .map((name) => (
                  <option 
                    key={name} 
                    value={name}
                    style={{ 
                      fontFamily: 'Poppins Regular, sans-serif',
                      padding: '1rem',
                      backgroundColor: 'white',
                      fontSize: '1rem'
                    }}
                  >
                    {name}
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

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-xl text-gray-600">Chargement des artistes...</div>
          </div>
        ) : (
          <div className="space-y-16">
            {/* All Artists Grid */}
            <div>
              {filteredArtists.length === 0 ? (
                <div className="text-center py-12 text-gray-600" style={{ fontFamily: 'Poppins Regular, sans-serif' }}>
                  Aucun artiste trouvé.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {filteredArtists.map((artist) => (
                    <motion.div 
                      key={artist.id} 
                      className="group relative bg-[#000000] overflow-hidden shadow-md h-[18rem] sm:h-[18rem] md:h-[20rem] lg:h-[25rem] flex flex-col"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Link to={`/artistes/${artist.id}`} className="absolute inset-0 z-10">
                        <div className="h-[12rem] sm:h-[12rem] md:h-[14rem] lg:h-[16rem] overflow-hidden flex items-center justify-center bg-[#000000] p-2">
                          <img 
                            src={artist.photo} 
                            alt={artist.nom} 
                            className="object-contain max-h-full max-w-full"
                            style={{ aspectRatio: 'auto' }}
                          />
                        </div>
                        <div className="p-2 md:p-3 text-left relative mt-1 ml-1">
                          <h3 className="text-[1.25rem] md:text-[1.5rem] lg:text-[1.75rem] text-[#FFFFFF] uppercase break-words max-w-[70%] flex flex-col" style={{ fontFamily: 'Kenyan Coffee, sans-serif' }}>
                            <span>{artist.nom.split(' ')[0]}</span>
                            <span className='text-[#972924]'>{artist.nom.split(' ').slice(1).join(' ')}</span>
                          </h3>
                          <p className="text-[#FFFFFF] text-xs sm:text-sm md:text-base border-2 border-[#FFFFFF] px-1 md:px-2 uppercase absolute top-2 right-2 md:top-3 md:right-3" style={{ fontFamily: 'Poppins Regular, sans-serif' }}>
                            <b>{artist.pays}</b>
                          </p>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Bouton Afficher plus */}
            <div className="mt-12 md:mt-20 mb-6 text-center px-4 sm:px-6 lg:px-8">
              <a 
                href="#" 
                className="inline-flex items-center gap-2 px-6 md:px-10 py-2 bg-[#FFFFFF] text-[#525252] border border-[#000000] shadow-md hover:bg-[#972924] hover:text-[#FFFFFF] hover:border-[#972924] transition-all duration-300"
                style={{ fontFamily: 'Poppins Regular, sans-serif' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                <span className='text-base md:text-lg lg:text-[1.5rem]'>Afficher plus</span>
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Artistes;
