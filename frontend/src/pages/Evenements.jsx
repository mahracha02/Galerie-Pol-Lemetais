import React, { useState, useEffect } from 'react';
import {  
  Loader2, 
} from 'lucide-react';
import { motion, useAnimation } from 'framer-motion';
import { Link } from 'react-router-dom';
import circle from '../assets/photos/icons/circle.png';
import loupe from '../assets/photos/icons/loupe.png';
import calendar from '../assets/photos/icons/calendar.png';

const Evenements = () => {
  const [evenements, setEvenements] = useState([]);
  const [filteredEvenements, setFilteredEvenements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');
  const [search, setSearch] = useState('');
  const [selectedYear, setSelectedYear] = useState('Tous');
  const [years, setYears] = useState([]);
  const [displayedYears, setDisplayedYears] = useState(2);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/evenements/api/published');
        if (!response.ok) {
          throw new Error(`Erreur HTTP! Status: ${response.status}`);
        }
        const data = await response.json();
        
        // Trier les événements par date (du plus récent au plus ancien)
        const sortedEvents = data.sort((a, b) => 
          new Date(b.date_debut) - new Date(a.date_debut)
        );
        
        setEvenements(sortedEvents);
        setFilteredEvenements(sortedEvents);
        setLoading(false);

        // Extraire les années uniques
        const uniqueYears = [...new Set(sortedEvents.map(event => extractYear(event.date_debut)))]
          .filter(year => year !== null)
          .sort((a, b) => b - a);
        setYears(uniqueYears);
      } catch (error) {
        console.error('Erreur lors du chargement des événements:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filterEvenements = () => {
      let result = evenements;

      if (search) {
        result = result.filter(event =>
          event.titre.toLowerCase().includes(search.toLowerCase())
        );
      }

      if (selectedYear !== 'Tous') {
        result = result.filter(event => 
          extractYear(event.date_debut)?.toString() === selectedYear
        );
      }

      setFilteredEvenements(result);
    };

    filterEvenements();
  }, [search, selectedYear, evenements]);

  const groupedEvents = filteredEvenements.reduce((acc, event) => {
    const year = extractYear(event.date_debut);
    if (!acc[year]) acc[year] = [];
    acc[year].push(event);
    return acc;
  }, {});
  
  const monthNames = {
    '01': 'Janvier', '02': 'Février', '03': 'Mars', '04': 'Avril',
    '05': 'Mai', '06': 'Juin', '07': 'Juillet', '08': 'Août',
    '09': 'Septembre', '10': 'Octobre', '11': 'Novembre', '12': 'Décembre',
    'all': 'Tous'
  };
  

  
  // Formatage de date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    // Try native Date first
    const d = new Date(dateString);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      });
    }
    // Fallback: regex for day, month (fr), year
    const match = dateString.match(/(\d{1,2})\s([a-zA-Zéûîôàèùç]+)\s(\d{4})/);
    if (match) {
      const [ , day, monthFr, year ] = match;
      const months = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
      const monthIndex = months.findIndex(m => m.toLowerCase() === monthFr.toLowerCase());
      if (monthIndex !== -1) {
        const dateObj = new Date(parseInt(year), monthIndex, parseInt(day));
        return dateObj.toLocaleDateString('fr-FR', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
        });
      }
    }
    return 'Date invalide';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ici vous pourriez ajouter la logique pour soumettre l'email
    alert(`Merci pour votre inscription! Un email a été envoyé à ${email}`);
    setEmail('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="flex items-center">
          <Loader2 className="animate-spin mr-2 text-red-600" size={24} />
          <div className="text-xl text-gray-600">Chargement des événements...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Erreur</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-12">
        <div className="flex items-center mb-8">
          <img src={circle} alt="circle icon" className="w-12 h-12 mr-2" />
          <h2 className="text-2xl md:text-[4rem] text-[#000000]" style={{ fontFamily: 'Kenyan Coffee, sans-serif' }}>
            EVENEMENTS
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
              style={{ 
                fontFamily: 'Poppins Regular, sans-serif',
                borderRadius: '0'
              }}
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="Tous" style={{ fontFamily: 'Poppins Regular, sans-serif', padding: '1rem' }}>Trier par année</option>
              {years.map((year) => (
                <option 
                  key={year} 
                  value={year}
                  style={{ 
                    fontFamily: 'Poppins Regular, sans-serif',
                    padding: '1rem',
                    backgroundColor: 'white',
                    fontSize: '1rem'
                  }}
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

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-xl text-gray-600">Chargement des événements...</div>
          </div>
        ) : (
          <div className="space-y-16">
            {Object.keys(groupedEvents)
              .sort((a, b) => b - a)
              .slice(0, displayedYears)
              .map((year) => (
                <div key={year} className="space-y-8 relative">
                  <div className="flex items-center">
                    <div className="flex flex-col items-center mr-8">
                      <div className="w-3 h-3 bg-[#000000] rounded-full"></div>
                      <div className="absolute top-[4.5rem] left-[0.375rem] w-0.5 bg-[#000000]" style={{ height: 'calc(100% - 4.5rem)' }}></div>
                    </div>
                    <h2 className="text-2xl md:text-4xl text-[#000000]" style={{ fontFamily: 'Poppins ExtraLight, sans-serif' }}>
                      {year}
                    </h2>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 px-2 sm:px-2 lg:px-4 ml-4">
                    {groupedEvents[year].slice(0, 4).map((event) => (
                      <motion.div 
                        key={event.id} 
                        className="group relative bg-[#000000] overflow-hidden shadow-md h-[28rem] md:h-[32rem] lg:h-[37rem] xl:h-[35rem]  flex flex-col"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Link to={`/evenements/${event.id}`} className="absolute inset-0 z-10">
                          <div className="h-[16rem] md:h-[20rem] lg:h-[20rem] overflow-hidden flex items-center justify-center bg-[#000000] p-2">
                            <img 
                              src={event.image || '/placeholder-event.jpg'} 
                              alt={event.titre} 
                              className="object-contain max-h-full max-w-full"
                              style={{ aspectRatio: 'auto' }}
                            />
                          </div>
                          <div className="p-2 text-left relative p-4 flex flex-row gap-x-2 justify-between h-full">
                            {/* Left: Title, Description, Lieu (2/3) */}
                            <div className="flex flex-col w-2/3 min-w-0 gap-2">
                              <h3 className="text-[1.5rem] md:text-[1.5rem] lg:text-[2rem] text-[#FFFFFF] uppercase break-words  mb-1" style={{ fontFamily: 'Kenyan Coffee, sans-serif' }}>
                                {event.titre}
                              </h3>
                              <p className="text-[#FFFFFF] text-[0.8rem] md:text-[0.9rem] lg:text-[0.9rem] mt-1 truncate" style={{ fontFamily: 'Poppins Regular, sans-serif', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {event.description}
                              </p>
                              <span className="text-[#B33C36] text-[0.8rem] md:text-[0.9rem] lg:text-[0.9rem] mt-1 flex items-center gap-1" style={{ fontFamily: 'Poppins Regular, sans-serif' }}>
                                {event.lieu || 'Lieu non spécifié'}
                              </span>
                            </div>
                            {/* Right: Date block (1/3) */}
                            <div className="flex flex-col items-center w-1/3 min-w-0">
                              <span className="text-xs text-[#FFFFFF]" style={{ fontFamily: 'Poppins Regular, sans-serif' }}>De</span>
                              <span
                                className="text-xs border border-[#FFFFFF] px-1.5 py-0.5 rounded bg-[#000000b0] text-[#FFFFFF] w-full text-center mt-1 break-words"
                                style={{ fontFamily: 'Poppins Regular, sans-serif', fontSize: '0.75rem' }}
                                title={formatDate(event.date_debut)}
                              >
                                {formatDate(event.date_debut)}
                              </span>
                              <span className="text-xs text-[#FFFFFF] mt-1" style={{ fontFamily: 'Poppins Regular, sans-serif' }}>à</span>
                              <span
                                className="text-xs border border-[#FFFFFF] px-1.5 py-0.5 rounded bg-[#000000b0] text-[#FFFFFF] w-full text-center mt-1 break-words"
                                style={{ fontFamily: 'Poppins Regular, sans-serif', fontSize: '0.75rem' }}
                                title={event.date_fin ? formatDate(event.date_fin) : '...'}
                              >
                                {event.date_fin ? formatDate(event.date_fin) : '...'}
                              </span>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                  {groupedEvents[year].length > 8 && (
                    <div className="text-center mt-8">
                      <button 
                        onClick={() => {/* Implement show more for this year */}}
                        className="inline-flex items-center gap-2 px-6 md:px-10 py-2 bg-[#FFFFFF] text-[#525252] border border-[#000000] shadow-md hover:bg-[#972924] hover:text-[#FFFFFF] hover:border-[#972924] transition-all duration-300"
                        style={{ fontFamily: 'Poppins Regular, sans-serif' }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                        <span className='text-base md:text-lg lg:text-[1.5rem]'>Afficher plus</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}

            {/* Bouton Afficher plus pour les années */}
            {years.length > displayedYears && (
              <div className="mt-12 md:mt-20 mb-6 text-center px-4 sm:px-6 lg:px-8">
                <button 
                  onClick={() => setDisplayedYears(prev => prev + 2)}
                  className="inline-flex items-center gap-2 px-6 md:px-10 py-2 bg-[#FFFFFF] text-[#525252] border border-[#000000] shadow-md hover:bg-[#972924] hover:text-[#FFFFFF] hover:border-[#972924] transition-all duration-300"
                  style={{ fontFamily: 'Poppins Regular, sans-serif' }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                  <span className='text-base md:text-lg lg:text-[1.5rem]' style={{ fontFamily: 'Poppins Regular, sans-serif' }}>Afficher plus</span>
                </button>
              </div>
            )}

            {/* Button Afficher moins pour revenir à l'affichage initial */}
            {displayedYears > 2 && (
              <div className="mt-12 md:mt-20 mb-6 text-center px-4 sm:px-6 lg:px-8">
                <button 
                  onClick={() => setDisplayedYears(2)}
                  className="inline-flex items-center gap-2 px-6 md:px-10 py-2 bg-[#FFFFFF] text-[#525252] border border-[#000000] shadow-md hover:bg-[#972924] hover:text-[#FFFFFF] hover:border-[#972924] transition-all duration-300"
                  style={{ fontFamily: 'Poppins Regular, sans-serif' }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  <span className='text-base md:text-lg lg:text-[1.5rem]' style={{ fontFamily: 'Poppins Regular, sans-serif' }}>Afficher moins</span>
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

// Helper to extract year from French-formatted date string
function extractYear(dateString) {
  if (!dateString) return null;
  // Try native Date first
  const d = new Date(dateString);
  if (!isNaN(d.getFullYear())) return d.getFullYear();
  // Fallback: regex for 4-digit year
  const match = dateString.match(/\b(19|20)\d{2}\b/);
  return match ? parseInt(match[0], 10) : null;
}

export default Evenements;