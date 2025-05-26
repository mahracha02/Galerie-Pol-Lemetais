import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ListBulletIcon, Squares2X2Icon } from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';
import expo100taur from '../assets/photos/expo100TAUR.jpg';
import expoBruno from '../assets/photos/expoBruno.jpg';
import expoPaulAmar from '../assets/photos/expo_paul_amar.jpg';

const Expositions = () => {
  const [expositions, setExpositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedExpo, setSelectedExpo] = useState(null);
  const [filterDate, setFilterDate] = useState('all');
  const navigate = useNavigate();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 100
      }
    }
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'grid' ? 'list' : 'grid');
  };

  useEffect(() => {
    fetch("/expositions/api/published", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then(response => response.json())
    .then(data => setExpositions(data))
    .then(() => setLoading(false))
    .catch(error => console.error("Erreur lors de la récupération des expositions :", error));
} 
, []);

  const expandExpo = (id) => {
    setSelectedExpo(selectedExpo === id ? null : id);
  };

  const mois = {
    janvier: '01',
    février: '02',
    fevrier: '02',
    mars: '03',
    avril: '04',
    mai: '05',
    juin: '06',
    juillet: '07',
    août: '08',
    aout: '08',
    septembre: '09',
    octobre: '10',
    novembre: '11',
    décembre: '12',
    decembre: '12',
  };
  
  const parseDateFr = (dateStr) => {
    const parts = dateStr.toLowerCase().split(' ');
    if (parts.length !== 3) return null;
    const jour = parts[0].padStart(2, '0');
    const moisNum = mois[parts[1]];
    const annee = parts[2];
    if (!moisNum) return null;
    return new Date(`${annee}-${moisNum}-${jour}T00:00:00`);
  };
   
  const filteredExpositions = expositions.filter(expo => {
    if (filterDate === 'all') return true;
  
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
  
    const startDate = parseDateFr(expo.date_debut);
    const endDate = parseDateFr(expo.date_fin);
  
    if (!startDate || !endDate) return false;
  
    if (filterDate === 'current') {
      return currentDate >= startDate && currentDate <= endDate;
    } else if (filterDate === 'upcoming') {
      return currentDate < startDate;
    } else if (filterDate === 'past') {
      return currentDate > endDate;
    }
  
    return true;
  });
  

  const scrollToExpositions = (e) => {
    e.preventDefault();
    const expositionsSection = document.getElementById('expositions');
    if (expositionsSection) {
      expositionsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <motion.div 
          className="text-2xl font-bold text-indigo-600"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        >
          Chargement des expositions...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      <section className="relative overflow-hidden bg-white mb-6">
        <div className="pt-16 pb-80 sm:pt-24 sm:pb-40 lg:pt-40 lg:pb-48">
          <div className="relative mx-auto max-w-7xl px-4 sm:static sm:px-6 lg:px-8">
            <div className="sm:max-w-lg">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">Nos expositions 2025</h1>
              <p className="mt-4 text-xl text-gray-500">Découvrez nos expositions en cours et prochaines.</p>
            </div>
            <div>
              <div className="mt-10">
                <div aria-hidden="true" className="pointer-events-none lg:absolute lg:inset-y-0 lg:mx-auto lg:w-full lg:max-w-7xl">
                  <div className="absolute transform sm:top-0 sm:left-1/2 sm:translate-x-8 lg:top-1/2 lg:left-1/2 lg:-translate-y-1/2 lg:translate-x-8">
                    <div className="flex items-center space-x-6 lg:space-x-8">
                      <div className="grid shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                        <div className="h-64 w-44 overflow-hidden rounded-lg sm:opacity-0 lg:opacity-100">
                          <img src={expo100taur} alt="" className="size-full object-cover" />
                        </div>
                        <div className="h-64 w-44 overflow-hidden rounded-lg">
                          <img src={expoBruno} alt="" className="size-full object-cover" />
                        </div>
                      </div>
                      <div className="grid shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                        <div className="h-64 w-44 overflow-hidden rounded-lg">
                          <img src={expo100taur} alt="" className="size-full object-cover" />
                        </div>
                        <div className="h-64 w-44 overflow-hidden rounded-lg">
                          <img src={expoPaulAmar} alt="" className="size-full object-cover" />
                        </div>
                        <div className="h-64 w-44 overflow-hidden rounded-lg">
                          <img src={expoBruno} alt="" className="size-full object-cover" />
                        </div>
                      </div>
                      <div className="grid shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                        <div className="h-64 w-44 overflow-hidden rounded-lg">
                          <img src={expo100taur} alt="" className="size-full object-cover" />
                        </div>
                        <div className="h-64 w-44 overflow-hidden rounded-lg">
                          <img src={expoBruno} alt="" className="size-full object-cover" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Link 
                  to="#expositions" 
                  onClick={scrollToExpositions}
                  className="inline-block rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-center font-medium text-white hover:bg-indigo-700"
                >
                  Voir toutes les expositions
                </Link>
              </div>
            </div>
          </div>
        </div>   
      </section>

      {/* Expositions Section */}
      <section id="expositions" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 md:mb-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            Nos Expositions
          </motion.h2>
          
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Filtre par date */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <select
                className="bg-white border border-gray-300 rounded-lg px-4 py-2 appearance-none w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              >
                <option value="all">Toutes les expositions</option>
                <option value="current">En cours</option>
                <option value="upcoming">À venir</option>
                <option value="past">Passées</option>
              </select>
            </motion.div>
            
            {/* Bouton changement de vue */}
            <motion.button
              onClick={toggleViewMode}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {viewMode === 'grid' ? (
                <>
                  <ListBulletIcon className="w-5 h-5" />
                  <span>Vue Liste</span>
                </>
              ) : (
                <>
                  <Squares2X2Icon className="w-5 h-5" />
                  <span>Vue Cartes</span>
                </>
              )}
            </motion.button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {viewMode === 'grid' ? (
              // Vue Cartes (Grid)
              <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredExpositions.map((expo) => (
                <Link 
                  key={expo.id}
                  to={`/expositions/${expo.id}`}
                  className="block" // Important for proper link behavior
                >
                  <motion.div
                    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
                    variants={itemVariants}
                    whileHover={{ 
                      y: -5,
                      scale: 1.03 
                    }}
                    style={{ height: "100%" }} // Ensures all cards have same height
                  >
                    <div className="relative h-64 overflow-hidden">
                      <motion.img
                        src={expo.image}
                        alt={expo.titre}
                        className="w-full h-full object-contain bg-gray-100"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                        style={{
                          objectPosition: 'center',
                          objectFit: 'contain',
                          padding: '0.5rem'
                        }}
                      />
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                      <div className="absolute bottom-0 left-0 p-4 text-white">
                        <span className="inline-block px-3 py-1 text-xs font-semibold bg-indigo-600 rounded-full mb-2">
                          {expo.artiste}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{expo.titre}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">{expo.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-indigo-600">
                          {expo.date_debut} - {expo.date_fin}
                        </span>
                      </div>
                      
                      {/* Always visible artist section */}
                      <div className="mt-4">
                        <div className="flex flex-wrap gap-2 mb-4">
                          {expo.tags?.map((tag, index) => (
                            <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                              #{tag}
                            </span>
                          ))}
                        </div>
            
                        {/* Artistes associés */}
                        <div className="mb-4">
                          <h4 className="text-lg font-semibold mb-2 text-indigo-700">Artistes participants</h4>
                          <div className="flex flex-wrap gap-4">
                            {/* Afficher l'artiste principal avec un badge */}
                            {expo.artiste_principal && (
                              <motion.div
                                key={expo.artiste_principal.id}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-32 p-2 rounded-xl shadow-md bg-white text-center hover:bg-indigo-50 transition-colors"
                              >
                                <Link to={`/artistes/${expo.artiste_principal.id}`}>
                                  <div className="relative w-20 h-20 mx-auto mb-2 group">
                                    <img
                                      src={expo.artiste_principal.photo || 'photos/logo.jpg'}
                                      alt={expo.artiste_principal.nom}
                                      className="w-full h-full object-cover rounded-full border-3 border-indigo-500 shadow-md group-hover:shadow-indigo-400 transition-shadow duration-300"
                                    />
                                    <div className="absolute inset-0 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                                    {/* Badge unique pour l'artiste principal */}
                                    <span className="absolute top-0 right-0 bg-indigo-600 text-white text-xs rounded-full py-1 px-2">Principal</span>
                                  </div>
                                  <p className="text-sm font-semibold text-gray-800">{expo.artiste_principal.nom}</p>
                                </Link>
                              </motion.div>
                            )}

                            {/* Afficher les autres artistes */}
                            {expo.artistes && expo.artistes.length > 0 && expo.artistes.map((artiste) => (
                              <motion.div
                                key={artiste.id}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-32 p-2 rounded-xl shadow-md bg-white text-center hover:bg-indigo-50 transition-colors"
                              >
                                <Link to={`/artistes/${artiste.id}`}>
                                  <div className="relative w-20 h-20 mx-auto mb-2">
                                    <img
                                      src={artiste.photo}
                                      alt={artiste.nom}
                                      className="w-full h-full object-cover rounded-full border-3 border-indigo-500 shadow-md hover:shadow-indigo-300 transition-shadow duration-300"
                                    />
                                    <div className="absolute inset-0 rounded-full bg-black/10 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                                  </div>
                                  <p className="text-sm font-semibold text-gray-800">{artiste.nom}</p>
                                </Link>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </motion.div>
            ) : (
              // Vue Liste
              <motion.div
                className="flex flex-col gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredExpositions.map((expo) => (
                  <motion.div
                    key={expo.id}
                    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
                    variants={itemVariants}
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="w-full md:w-1/3 h-110 md:h-110 relative">
                        <motion.img
                          src={expo.image}
                          alt={expo.titre}
                          className="w-full h-full object-contain bg-gray-100"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.5 }}
                          style={{
                            objectPosition: 'center',
                            objectFit: 'contain',
                            padding: '0.5rem'
                          }}
                        />
                      </div>
                      <div className="w-full md:w-2/3 p-6 md:p-8">
                        <div className="flex flex-col h-full">
                          <div>
                            <div className="flex flex-wrap gap-2 mb-3">
                              <span className="inline-block px-3 py-1 text-xs font-semibold bg-indigo-600 text-white rounded-full">
                                {expo.artiste}
                              </span>
                              {expo.tags?.slice(0, 2).map((tag, index) => (
                                <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">{expo.titre}</h3>
                            <p className="text-gray-600 mb-4">{expo.description}</p>
                          </div>
                          
                          <div className="mt-auto flex flex-wrap justify-between items-center">
                            <div className="text-sm font-medium text-indigo-600 mb-3 md:mb-0">
                              <span className="inline-flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {expo.date_debut} - {expo.date_fin}
                              </span>
                            </div>
                            
                            <Link
                              key={expo.id}
                              to={`/expositions/${expo.id}`}
                              className="inline-block w-full text-center px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors w-1/2 md:w-auto"
                              whileHover={{ scale: 1.05 }}
                            >
                              Voir les détails
                            </Link>
                          </div>

                          {/* Artistes associés */}
                          {(expo.artiste_principal || (expo.artistes && expo.artistes.length > 0)) && (
                            <div className="mt-6 border-t pt-4">
                              <h4 className="text-lg font-semibold mb-4 text-indigo-700">Artistes participants</h4>
                              <div className="flex flex-wrap gap-4">
                                
                                {/* Artiste principal */}
                                {expo.artiste_principal && (
                                  <motion.div
                                    key={expo.artiste_principal.id}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-32 p-2 rounded-xl shadow-md bg-white text-center hover:bg-indigo-50 transition-colors"
                                  >
                                    <Link to={`/artistes/${expo.artiste_principal.id}`}>
                                      <div className="relative w-20 h-20 mx-auto mb-2 group">
                                        <img
                                          src={expo.artiste_principal.photo || 'photos/logo.jpg'}
                                          alt={expo.artiste_principal.nom}
                                          className="w-full h-full object-cover rounded-full border-4 border-indigo-500 shadow-md group-hover:shadow-indigo-400 transition-shadow duration-300"
                                        />
                                        <div className="absolute inset-0 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                                        <span className="absolute top-0 right-0 bg-indigo-600 text-white text-xs rounded-full py-1 px-2">Principal</span>
                                      </div>
                                      <p className="text-sm font-semibold text-gray-800">{expo.artiste_principal.nom}</p>
                                    </Link>
                                  </motion.div>
                                )}

                                {/* Autres artistes */}
                                {expo.artistes?.map((artiste) => (
                                  <motion.div
                                    key={artiste.id}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-32 p-2 rounded-xl shadow-md bg-white text-center hover:bg-indigo-50 transition-colors"
                                  >
                                    <Link to={`/artistes/${artiste.id}`}>
                                      <div className="relative w-20 h-20 mx-auto mb-2 group">
                                        <img
                                          src={artiste.photo}
                                          alt={artiste.nom}
                                          className="w-full h-full object-cover rounded-full border-3 border-gray-300 shadow-md group-hover:shadow-gray-400 transition-shadow duration-300"
                                        />
                                        <div className="absolute inset-0 rounded-full bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                      </div>
                                      <p className="text-sm font-semibold text-gray-800">{artiste.nom}</p>
                                    </Link>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          )}
                          </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
        
        {filteredExpositions.length === 0 && (
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xl text-gray-600">Aucune exposition ne correspond à vos critères.</p>
          </motion.div>
        )}
      </section>
    </div>
  );
};

export default Expositions;


