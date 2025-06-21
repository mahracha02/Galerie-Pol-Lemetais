import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import circle from '../assets/photos/icons/circle.png';
import imgDecorative from '../assets/photos/image_decorative_exposition_individuelles.png';
import Medias from '../components/layout/Medias';
const ExpoDetails = () => {
  const { id } = useParams();
  const [expo, setExpo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAllOeuvres, setShowAllOeuvres] = useState(false);
  const [showVirtualTour, setShowVirtualTour] = useState(false);
  const [selectedExpo, setSelectedExpo] = useState(null);

  useEffect(() => {
    const fetchExpo = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/expositions/api/${id}`);
        if (!response.ok) throw new Error('Erreur de chargement');
        const data = await response.json();
        setExpo(data);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpo();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#972924]"></div>
      </div>
    );
  }

  if (!expo) {
    return (
      <div className="text-center py-20 bg-white">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Exposition non trouvée</h2>
        <Link to="/expositions" className="text-[#972924] hover:underline">
          Retour aux expositions
        </Link>
      </div>
    );
  }
  
  const titleParts = expo.titre ? expo.titre.split(' ') : [];
  const lastWord = titleParts.length > 1 ? titleParts.pop() : '';
  const firstPart = titleParts.join(' ');

  const artistNameParts = expo.artiste_principal ? expo.artiste_principal.nom.split(' ') : [];
  const artistLastName = artistNameParts.length > 1 ? artistNameParts.pop() : '';
  const artistFirstName = artistNameParts.join(' ');

  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    let d;
    
    // Check if it's already a French formatted date (like "8 février 2025")
    if (typeof dateString === 'string' && dateString.includes(' ')) {
      // French month names mapping
      const frenchMonths = {
        'janvier': 0, 'février': 1, 'mars': 2, 'avril': 3, 'mai': 4, 'juin': 5,
        'juillet': 6, 'août': 7, 'septembre': 8, 'octobre': 9, 'novembre': 10, 'décembre': 11
      };
      
      // Parse French date format: "8 février 2025"
      const parts = dateString.split(' ');
      if (parts.length === 3) {
        const day = parseInt(parts[0]);
        const month = frenchMonths[parts[1].toLowerCase()];
        const year = parseInt(parts[2]);
        
        if (!isNaN(day) && month !== undefined && !isNaN(year)) {
          d = new Date(year, month, day);
        }
      }
    }
    
    // If French parsing didn't work, try standard Date constructor
    if (!d || isNaN(d.getTime())) {
      d = new Date(dateString);
    }
    
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
      });
    }
    return 'Date invalide';
  };
  
  const formatEndDate = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    }
    return 'Date invalide';
  }

  return (
    <div className="bg-white">
      {/* Header Section */}
      <header className="relative h-[20rem] md:h-[30rem] lg:h-[40rem] w-full text-white">
        <img 
          src={expo.image || '/placeholder-event.jpg'} 
          alt={expo.titre} 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 mt-[15rem]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <img src={circle} alt="circle icon" className="w-6 h-6 md:w-8 md:h-8 " />
              <span className="text-[1.5rem] md:text-[2rem] lg:text-[2rem]" style={{ fontFamily: 'Poppins Regular, sans-serif' }}>Exposition</span>
            </div>
            <h1 className="text-4xl md:text-6xl uppercase" style={{ fontFamily: 'Kenyan Coffee, sans-serif' }}>
              {firstPart} <span className="text-[#972924]">{lastWord}</span>
            </h1>
            <p className="mt-4 text-lg" style={{ fontFamily: 'Poppins Regular, sans-serif' }}>
              Du {formatDate(expo.date_debut)} au {formatEndDate(expo.date_fin)}
            </p>
          </motion.div>
        </div>
      </header>
      
      {/* A Propos Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="flex flex-col md:flex-row gap-12 lg:gap-16 items-center">
          {/* Left: Images */}
          <div className="w-2/5">
            <div className="relative h-[20rem] md:h-[25rem] lg:h-[30rem]">
                <motion.div 
                    className="absolute inset-0"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <img src={imgDecorative} alt="Art" className="w-[20rem] md:w-[25rem] lg:w-[30rem] h-[20rem] md:h-[25rem] lg:h-[30rem] object-contain" />
                </motion.div>
            </div>
          </div>
          {/* Right: Text */}
          <motion.div
            className="w-3/5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-[1.5rem] md:text-[2rem] lg:text-[2.5rem] text-[#000000] uppercase" style={{ fontFamily: 'Kenyan Coffee, sans-serif' }}>
              A Propos de <span className="text-[#972924]">l'Exposition</span>
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed line-clamp-6" style={{ fontFamily: 'Poppins Regular, sans-serif' }}>
              {expo.description}
            </p>
            {expo.artiste_principal && (
              <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <span className="text-sm text-gray-500" style={{ fontFamily: 'Poppins Regular, sans-serif' }}>Voir l'artiste</span>
                    <Link to={`/artistes/${expo.artiste_principal.id}`}>
                      <h3 className="text-xl md:text-2xl uppercase  hover:underline transition" style={{ fontFamily: 'Kenyan Coffee, sans-serif' }}>
                        {artistFirstName} <span className="text-[#972924] ">{artistLastName}</span>
                      </h3>
                    </Link>
                  </div>
                  <button
                      onClick={(e) => {
                              e.preventDefault();
                              setSelectedExpo(expo);
                              setShowVirtualTour(true);
                          }}
                      className="px-6 py-2 bg-[#972924] text-white hover:bg-[#b33c36] transition text-sm self-start md:self-center"
                      style={{ fontFamily: 'Poppins Regular, sans-serif' }}
                  >
                      Voir la visite virtuelle
                  </button>
                </div>
              </div>
            )}
            {/* Autres artistes */}
            {expo.artistes && expo.artistes.length > 0 && (
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
            )}
          </motion.div>
        </div>
      </section>

      {/* Oeuvres Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <img src={circle} alt="circle icon" className="w-8 h-8" />
            <h2 className="text-[1.5rem] md:text-[2rem] lg:text-[2.5rem] text-[#000000] uppercase" style={{ fontFamily: 'Kenyan Coffee, sans-serif' }}>
              Oeuvres a <span className="text-[#972924]">Decouvrir</span>
            </h2>
          </div>
          {expo.oeuvres && expo.oeuvres.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {(showAllOeuvres ? expo.oeuvres : expo.oeuvres.slice(0, 12)).map((oeuvre) => (
                  <Link to={`/oeuvres/${oeuvre.id}`} key={oeuvre.id}>
                    <motion.div 
                      className="h-[15rem] md:h-[20rem] lg:h-[25rem] bg-[#000000]"
                      whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)" }}
                      transition={{ duration: 0.3 }}
                    >
                      <img 
                        src={oeuvre.image_principale || '/placeholder-artwork.jpg'} 
                        alt={oeuvre.titre} 
                        className="w-full h-[10rem] md:h-[15rem] lg:h-[20rem] object-contain p-2"
                          style={{ aspectRatio: 'auto' }}
                      />
                      <h3 className="text-[1.5rem] md:text-[1.75rem] lg:text-[2rem] text-[#FFFFFF] uppercase break-words p-4" style={{ fontFamily: 'Kenyan Coffee, sans-serif' }}>
                        {oeuvre.titre.split(' ')[0]} 
                        <span className='text-[#972924] ml-2'>{oeuvre.titre.split(' ').slice(1).join(' ')}</span>
                      </h3>
                    </motion.div>
                  </Link>
                ))}
              </div>
              {expo.oeuvres.length > 12 && (
                <div className="text-center mt-12">
                  <button
                    onClick={() => setShowAllOeuvres(!showAllOeuvres)}
                    className="px-8 py-3 border border-gray-400 text-gray-700 hover:bg-gray-200 transition"
                    style={{ fontFamily: 'Poppins Regular, sans-serif' }}
                  >
                    <span className="flex items-center justify-center gap-2">
                      {showAllOeuvres ? 'Afficher moins' : 'Afficher plus'}
                    </span>
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-lg text-gray-600 bg-gray-100 p-6 rounded-lg shadow-lg">
              <p>Aucune œuvre disponible pour cette exposition pour le moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Medias Section */}
      <Medias medias={expo.medias || []} />

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

export default ExpoDetails;



      