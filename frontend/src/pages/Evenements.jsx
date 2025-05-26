import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  ChevronRight, 
  Mail, 
  Star, 
  Loader2, 
  List, 
  Grid, 
  AlertCircle,
  CheckCircle,
  History
} from 'lucide-react';
import { motion, useAnimation } from 'framer-motion';
import Countdown from 'react-countdown';
import PropTypes from 'prop-types';



const Evenements = () => {
  const [evenements, setEvenements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const controls = useAnimation();

  useEffect(() => {
    const fetchEvenements = async () => {
      try {
        const response = await fetch("/evenements/api/published");
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des événements');
        }
        const data = await response.json();
        
        // Trier les événements par date (du plus récent au plus ancien)
        const sortedEvents = data.sort((a, b) => 
          new Date(b.date_debut) - new Date(a.date_debut)
        );
        
        setEvenements(sortedEvents);
        controls.start("visible");
      } catch (err) {
        console.error("Erreur:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvenements();
  }, [controls]);

  const groupedEvents = evenements.reduce((acc, event) => {
    const month = getMonthFromDate(event.date_debut);
    if (!acc[month]) acc[month] = [];
    acc[month].push(event);
    return acc;
  }, {});
  
  const monthNames = {
    '01': 'Janvier', '02': 'Février', '03': 'Mars', '04': 'Avril',
    '05': 'Mai', '06': 'Juin', '07': 'Juillet', '08': 'Août',
    '09': 'Septembre', '10': 'Octobre', '11': 'Novembre', '12': 'Décembre',
    'all': 'Tous'
  };
  
  function getMonthFromDate(dateString) {
    const date = new Date(dateString);  
    return date.getMonth() + 1; // Les mois sont indexés de 0 à 11, donc on ajoute 1
  } 

  // Classer les événements
  const classifyEvents = () => {
    const now = new Date();
    let upcomingEvent = null;
    let currentEvent = null;
    let pastEvent = null;

    for (const event of evenements) {
      try {
        const startDate = new Date(event.date_debut);
        const endDate = event.date_fin ? new Date(event.date_fin) : startDate;

        if (!upcomingEvent && startDate > now) {
          upcomingEvent = event;
        } else if (!currentEvent && startDate <= now && endDate >= now) {
          currentEvent = event;
        } else if (!pastEvent && endDate < now) {
          pastEvent = event;
        }

        // Si on a trouvé un événement dans chaque catégorie, on peut arrêter
        if (upcomingEvent && currentEvent && pastEvent) break;
      } catch (e) {
        console.error("Date invalide:", event.date_debut);
      }
    }

    return { upcomingEvent, currentEvent, pastEvent };
  };

  const { upcomingEvent, currentEvent, pastEvent } = classifyEvents();
  const featuredEvent = evenements[1] || null;
  const otherEvents = evenements.filter(event => event !== upcomingEvent);

  
  
  const CountdownRenderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return <span className="text-xl font-bold">Événement en cours!</span>;
    } else {
      return (
        <div className="flex justify-center space-x-4 md:space-x-6">
          {[
            { value: days, label: 'jours' },
            { value: hours, label: 'heures' },
            { value: minutes, label: 'minutes' },
            { value: seconds, label: 'secondes' }
          ].map((item, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-white text-red-600 rounded-lg px-4 py-2 shadow-md">
                {item.value}
              </div>
              <div className="text-sm mt-1 text-white">{item.label}</div>
            </div>
          ))}
        </div>
      );
    }
  };
  CountdownRenderer.propTypes = {
    days: PropTypes.number.isRequired,
    hours: PropTypes.number.isRequired,
    minutes: PropTypes.number.isRequired,
    seconds: PropTypes.number.isRequired,
    completed: PropTypes.bool.isRequired,
  };
  // Formatage de date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
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
      {/* Bandeau d'état de l'événement */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={controls}
        variants={{
          visible: { y: 0, opacity: 1, transition: { duration: 0.8 } }
        }}
        className={`py-4 shadow-lg text-white ${
          currentEvent ? 'bg-gradient-to-r from-green-600 to-green-700' :
          upcomingEvent ? 'bg-gradient-to-r from-red-600 to-red-700' :
          'bg-gradient-to-r from-gray-600 to-gray-700'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0 text-center md:text-left">
              <h2 className="text-xl md:text-2xl font-bold flex items-center justify-center md:justify-start">
                {currentEvent ? (
                  <>
                    <CheckCircle className="mr-2" /> Événement en cours: {currentEvent.titre}
                  </>
                ) : upcomingEvent ? (
                  <>
                    <Calendar className="mr-2" /> Prochain événement: {upcomingEvent.titre}
                  </>
                ) : (
                  <>
                    <History className="mr-2" /> Dernier événement: {pastEvent?.titre || 'Aucun événement'}
                  </>
                )}
              </h2>
              <p className="flex items-center justify-center md:justify-start mt-1">
                <Clock className="mr-2" size={16} />
                {currentEvent ? (
                  `Jusqu'au ${formatDate(currentEvent.date_fin)}`
                ) : upcomingEvent ? (
                  formatDate(upcomingEvent.date_debut)
                ) : pastEvent ? (
                  `Terminé le ${formatDate(pastEvent.date_fin || pastEvent.date_debut)}`
                ) : 'Aucun événement programmé'}
              </p>
            </div>
            
            
          </div>
        </div>
      </motion.div>
      
      <main className="container mx-auto px-2 py-12 max-w-7xl">
        {/* Section À la une - Événement à venir */}
        {upcomingEvent && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white shadow-xl rounded-xl overflow-hidden md:flex mb-12"
          >
            <div className="md:w-1/2 h-96 md:h-auto">
              <div className="h-full w-full relative overflow-hidden">
                <motion.div
                  initial={{ x: -100 }}
                  animate={{ x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute top-4 left-0 bg-gradient-to-r from-red-600 to-red-500 text-white px-4 py-2 flex items-center shadow-md z-10"
                >
                  <Star className="mr-2" size={16} /> Prochain événement
                </motion.div>
                <div className="relative w-full h-full">
                  <img
                    src={upcomingEvent.image || '/placeholder-event.jpg'}
                    alt={upcomingEvent.titre}
                    className="w-full h-full object-contain bg-gray-100"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
            <div className="md:w-1/2 p-8 flex flex-col">
              <div className="flex-grow">
                <h2 className="text-3xl font-bold text-gray-800 mb-3">
                  {upcomingEvent.titre}
                </h2>
                <p className="text-red-600 font-semibold mb-4 flex items-center">
                  <Clock className="mr-2" size={18} />
                  {new Date(upcomingEvent.date_debut).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {upcomingEvent.description}
                </p>

                {/* Artistes associés */}
                <div className="mt-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Artistes participants :</h3>
                  {upcomingEvent.artistes?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {upcomingEvent.artistes.map(artiste => (
                        <motion.a
                          key={artiste.id}
                          href={`/artistes/${artiste.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                          whileHover={{ scale: 1.05 }}
                        >
                          {artiste.nom}
                        </motion.a>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">Aucun artiste associé</p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <a
                  href={upcomingEvent.site_url?.startsWith('http') ? 
                    upcomingEvent.site_url : 
                    `https://${upcomingEvent.site_url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-bold py-3 px-8 rounded-lg flex items-center shadow-md"
                  >
                    En savoir plus <ChevronRight className="ml-2" size={18} />
                  </motion.button>
                </a>
              </div>
            </div>
          </motion.div>
        )}

        {/* Section Tous les autres événements */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            {upcomingEvent ? 'Autres événements' : 'Tous les événements'}
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-red-100 text-red-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-red-100 text-red-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
            >
              <List size={20} />
            </button>
          </div>
        </div>

        {otherEvents.length > 0 ? (
          <motion.div
            className={viewMode === 'grid' ? "grid md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-6"}
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { 
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }
            }}
          >
            {otherEvents.map(event => (
              <motion.div
                key={event.id}
                className={viewMode === 'grid' ? 
                  "bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300" : 
                  "bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300 flex"}
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: { y: 0, opacity: 1 }
                }}
                whileHover={{ y: -5 }}
              >
                {/* Contenu de la carte d'événement */}
                <div className={viewMode === 'grid' ? "relative h-64 bg-gray-100" : "relative w-1/3 h-48 bg-gray-100"}>
                  <img
                    src={event.image || '/logo.jpg'}
                    alt={event.titre}
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                </div>
                <div className={viewMode === 'grid' ? "p-6" : "p-6 flex-grow"}>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{event.titre}</h3>
                  <p className="text-red-600 font-semibold mb-3 flex items-center">
                    <Clock className="mr-2" size={16} />
                    {new Date(event.date_debut).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                  <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>
                  
                  {/* Bouton et artistes */}
                  <div className="mt-4 flex justify-between items-end">
                    <a
                      href={event.site_url?.startsWith('http') ? 
                        event.site_url : 
                        `https://${event.site_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group"
                    >
                      <motion.button
                        className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg flex items-center text-sm transition-all duration-300"
                        whileHover={{ x: 5 }}
                      >
                        Détails <ChevronRight className="ml-1 group-hover:translate-x-1 transition-transform duration-300" size={16} />
                      </motion.button>
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600">
              {upcomingEvent ? 'Aucun autre événement prévu' : 'Aucun événement disponible'}
            </p>
          </div>
        )}

        {/* Ligne de séparation */}
        <hr className="my-8 border-t border-gray-200" />

        
        {/* Section État des événements */}
        <motion.div 
          className="grid md:grid-cols-3 gap-6 mt-12"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2
              }
            }
          }}
        >
          {/* Carte Dernier événement */}
          <motion.div
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: { y: 0, opacity: 1 }
            }}
            className="bg-white rounded-xl shadow-lg overflow-hidden border-t-4 border-gray-500"
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <History className="text-gray-500 mr-2" size={24} />
                <h3 className="text-xl font-bold text-gray-800">Passé</h3>
              </div>
              {pastEvent ? (
                <>
                  <h4 className="font-semibold text-lg">{pastEvent.titre}</h4>
                  <p className="text-gray-600 mt-2">
                    <Clock className="inline mr-2" size={16} />
                    Terminé le {formatDate(pastEvent.date_fin || pastEvent.date_debut)}
                  </p>
                  <p className="text-gray-500 text-sm mt-3 line-clamp-2">
                    {pastEvent.description}
                  </p>
                  <button className="mt-4 text-gray-500 hover:text-gray-700 font-medium flex items-center">
                    <motion.a 
                      href={featuredEvent.site_url?.startsWith('http') ? 
                      featuredEvent.site_url : 
                      `https://${featuredEvent.site_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center"
                    >
                      Voir détails <ChevronRight className="ml-1" size={16} />
                    </motion.a>
                  </button>
                </>
              ) : (
                <div className="text-gray-500 py-4 flex items-center">
                  <AlertCircle className="mr-2" size={18} />
                  Aucun événement passé
                </div>
              )}
            </div>
          </motion.div>

          {/* Carte Événement en cours */}
          <motion.div
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: { y: 0, opacity: 1 }
            }}
            className="bg-white rounded-xl shadow-lg overflow-hidden border-t-4 border-green-500"
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <CheckCircle className="text-green-500 mr-2" size={24} />
                <h3 className="text-xl font-bold text-gray-800">En cours</h3>
              </div>
              {currentEvent ? (
                <>
                  <h4 className="font-semibold text-lg">{currentEvent.titre}</h4>
                  <p className="text-gray-600 mt-2">
                    <Clock className="inline mr-2" size={16} />
                    Jusqu&apos;au {formatDate(currentEvent.date_fin)}
                  </p>
                  <p className="text-gray-500 text-sm mt-3 line-clamp-2">
                    {currentEvent.description}
                  </p>
                  <button className="mt-4 text-green-500 hover:text-green-700 font-medium flex items-center">
                  <motion.a 
                      href={featuredEvent.site_url?.startsWith('http') ? 
                      featuredEvent.site_url : 
                      `https://${featuredEvent.site_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center"
                    >
                      Voir détails <ChevronRight className="ml-1" size={16} />
                    </motion.a>
                  </button>
                </>
              ) : (
                <div className="text-gray-500 py-4 flex items-center">
                  <AlertCircle className="mr-2" size={18} />
                  Aucun événement en cours
                </div>
              )}
            </div>
          </motion.div>

          {/* Carte Événement à venir */}
          <motion.div
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: { y: 0, opacity: 1 }
            }}
            className="bg-white rounded-xl shadow-lg overflow-hidden border-t-4 border-red-500"
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <Calendar className="text-red-500 mr-2" size={24} />
                <h3 className="text-xl font-bold text-gray-800">À venir</h3>
              </div>
              {upcomingEvent ? (
                <>
                  <h4 className="font-semibold text-lg">{upcomingEvent.titre}</h4>
                  <p className="text-gray-600 mt-2">
                    <Clock className="inline mr-2" size={16} />
                    {formatDate(upcomingEvent.date_debut)}
                  </p>
                  <p className="text-gray-500 text-sm mt-3 line-clamp-2">
                    {upcomingEvent.description}
                  </p>
                  <button className="mt-4 text-red-500 hover:text-red-700 font-medium flex items-center">
                  <motion.a 
                      href={featuredEvent.site_url?.startsWith('http') ? 
                      featuredEvent.site_url : 
                      `https://${featuredEvent.site_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center"
                    >
                      Voir détails <ChevronRight className="ml-1" size={16} />
                    </motion.a>
                  </button>
                </>
              ) : (
                <div className="text-gray-500 py-4 flex items-center">
                  <AlertCircle className="mr-2" size={18} />
                  Aucun événement à venir
                </div>
              )}
            </div>
          </motion.div>

        </motion.div>
        
        
        {/* Calendar Section */}
        <motion.div 
            className="mt-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center">
              <Calendar className="mr-2" /> Calendrier des Événements
            </h2>
            
            {/* Month Selector */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
                <button 
                  onClick={() => setSelectedMonth('all')}
                  className={`px-4 py-2 font-medium ${selectedMonth === 'all' ? 
                    'bg-red-600 text-white' : 
                    'hover:bg-gray-100 text-gray-700'}`}
                >
                  Tous
                </button>
                {Object.keys(groupedEvents).sort().map(month => (
                  <button 
                    key={month}
                    onClick={() => setSelectedMonth(month)}
                    className={`px-4 py-2 font-medium ${selectedMonth === month ? 
                      'bg-red-600 text-white' : 
                      'hover:bg-gray-100 text-gray-700'}`}
                  >
                    {monthNames[month]}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="bg-white shadow-lg rounded-xl overflow-hidden">
              <div className="space-y-4 p-6">
                {selectedMonth === 'all' ? (
                  Object.keys(groupedEvents).sort().map(month => (
                    <div key={month} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                      <h3 className="font-bold text-gray-800 mb-3 flex items-center text-lg">
                        <Calendar className="mr-2 text-red-600" size={18} /> 
                        {monthNames[month]} {groupedEvents[month]?.[0]?.date_debut?.split('-')[0]}
                      </h3>
                      <ul className="space-y-3">
                        {groupedEvents[month].map(event => (
                          <motion.li 
                            key={event.id}
                            className="text-gray-600 hover:bg-gray-50 rounded-lg p-3 transition-colors duration-200"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            whileHover={{ x: 5 }}
                          >
                            <a 
                              href={event.site_url?.startsWith('http') ? 
                                event.site_url : 
                                `https://${event.site_url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center">
                                <span className="text-red-600 font-semibold w-12 flex-shrink-0">
                                  {event.date_debut?.split('-')[0]}
                                </span>
                                <span className="font-medium flex-grow">{event.titre}</span>
                              </div>
                              <ChevronRight className="text-red-600 ml-2" size={16} />
                            </a>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  ))
                ) : (
                  groupedEvents[selectedMonth] ? (
                    <div className="pb-2">
                      <h3 className="font-bold text-gray-800 mb-3 flex items-center text-lg">
                        <Calendar className="mr-2 text-red-600" size={18} /> 
                        {monthNames[selectedMonth]} {groupedEvents[selectedMonth]?.[0]?.date_debut?.split('-')[0]}
                      </h3>
                      <ul className="space-y-3">
                        {groupedEvents[selectedMonth].map(event => (
                          <motion.li 
                            key={event.id}
                            className="text-gray-600 hover:bg-gray-50 rounded-lg p-3 transition-colors duration-200"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            whileHover={{ x: 5 }}
                          >
                            <a 
                              href={event.site_url?.startsWith('http') ? 
                                event.site_url : 
                                `https://${event.site_url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center">
                                <span className="text-red-600 font-semibold w-12 flex-shrink-0">
                                  {event.date_debut?.split('-')[0]}
                                </span>
                                <span className="font-medium flex-grow">{event.titre}</span>
                              </div>
                              <ChevronRight className="text-red-600 ml-2" size={16} />
                            </a>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Aucun événement prévu pour ce mois</p>
                    </div>
                  )
                )}
              </div>
            </div>
          </motion.div>
          
          {/* Newsletter Signup */}
          <motion.div 
            className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl p-8 mt-16 shadow-xl"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="max-w-3xl mx-auto text-center">
              <Mail className="mx-auto mb-4 text-red-400" size={40} />
              <h3 className="text-2xl font-bold mb-4">
                Restez informé de nos événements
              </h3>
              <p className="mb-6 text-gray-300">
                Inscrivez-vous à notre newsletter pour recevoir les invitations et les informations sur nos prochains événements.
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="Votre adresse email" 
                  required
                  className="flex-grow px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <motion.button 
                  type="submit"
                  className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 px-6 py-3 rounded-lg font-medium flex items-center justify-center shadow-md"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Mail className="mr-2" size={18} /> S'inscrire
                </motion.button>
              </form>
              <p className="text-xs text-gray-400 mt-4">
                Nous ne partagerons jamais votre email avec des tiers.
              </p>
            </div>
          </motion.div>
      </main>
    </div>
  );
};

export default Evenements;