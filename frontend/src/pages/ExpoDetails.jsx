import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Users, 
  Info,
  ChevronRight,
  Book
} from 'lucide-react';

const ExpoDetails = () => {
  const { id } = useParams();
  const [expo, setExpo] = useState(null);
  const [showAllArtists, setShowAllArtists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');
  const [showAllOeuvres, setShowAllOeuvres] = useState(false);

  useEffect(() => {
    const fetchExpo = async () => {
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
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!expo) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Exposition non trouvée</h2>
        <Link to="/expositions" className="text-indigo-600 hover:underline">
          Retour aux expositions
        </Link>
      </div>
    );
  }

  // Filtrer les artistes pour exclure l'artiste principal
  const filteredArtists = expo.artistes?.filter(
    (artiste) => artiste.id !== expo.artiste_principal?.id
  ) || [];

  // Artistes à afficher (max 3 si showAllArtists est false)
  const displayedArtists = showAllArtists ? filteredArtists : filteredArtists.slice(0, 3);

  const totalArtistes = expo.artistes
    ? expo.artistes.filter(a => a.id !== expo.artiste_principal?.id).length + (expo.artiste_principal ? 1 : 0)
    : (expo.artiste_principal ? 1 : 0);

  return (
    <div className="bg-gray-50 relative min-h-screen p-12">
      {/* Header avec image de fond */}
      <div className="relative w-full h-[28rem] sm:h-[32rem] lg:h-[36rem] overflow-hidden rounded-b-3xl rounded-t-3xl shadow-md">
        <img
          src={expo.image && expo.image !== '' ? expo.image.replace('https://', 'http://') : '/uploads/logo.jpg'}
          alt={expo.titre}
          className="absolute inset-0 w-full h-full object-cover object-center"
          loading="eager"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

        {/* Bouton retour */}
        <Link
          to="/expositions"
          className="absolute top-6 left-6 z-20 bg-white/90 text-gray-800 p-2 rounded-full shadow-md hover:bg-white transition"
        >
          <ArrowLeft size={20} />
        </Link>

        {/* Infos de l'exposition */}
        <div className="relative z-10 h-full flex flex-col justify-end px-6 sm:px-10 pb-10 text-white">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">{expo.titre}</h1>
            <div className="flex flex-wrap gap-6 items-center text-sm sm:text-base">
              {/* Dates */}
              <div className="flex items-center">
                <Calendar className="mr-2" size={18} />
                <span>{expo.date_debut} - {expo.date_fin}</span>
              </div>
              {/* Catalogue */}
              {expo.catalogue_url && (
                <div className="flex items-center">
                  <Book className="mr-2" size={18} />
                  <a
                    href={expo.catalogue_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-400 hover:underline"
                  >
                    Lien vers le catalogue
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto px-4 py-12 flex-grow pb-200">
        {/* Navigation par onglets */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab('description')}
            className={`px-4 py-3 font-medium flex items-center ${activeTab === 'description' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Info className="mr-2" size={18} />
            Description
          </button>
          <button
            onClick={() => setActiveTab('artistes')}
            className={`px-4 py-3 font-medium flex items-center ${activeTab === 'artistes' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Users className="mr-2" size={18} />
            Artistes ( {totalArtistes} )
          </button>
        </div>

        {/* Contenu des onglets */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">À propos de l&apos;exposition</h3>
                <p className="text-gray-600 leading-relaxed mb-6">{expo.description}</p>
                
                {expo.horaires && (
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
                    <h4 className="flex items-center text-lg font-semibold mb-3">
                      <Clock className="mr-2 text-indigo-600" size={18} />
                      Horaires
                    </h4>
                    <p className="text-gray-700">{expo.horaires}</p>
                  </div>
                )}

                {expo.tarifs && (
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h4 className="text-lg font-semibold mb-3">Tarifs</h4>
                    <p className="text-gray-700">{expo.tarifs}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'artistes' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Artistes participants</h3>
                
                {/* Artiste principal */}
                {expo.artiste_principal && (
                  <div className="mb-10">
                    <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                      <span className="bg-indigo-100 text-indigo-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">
                        Principal
                      </span>
                      Artiste principal
                    </h4>
                    <div className="grid md:grid-cols-2 gap-6">
                      <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-xl shadow-md overflow-hidden"
                      >
                        <Link to={`/artistes/${expo.artiste_principal.id}`} className="block">
                          <div className="md:flex">
                            <div className="md:w-1/3 h-48 md:h-auto relative">
                              <img
                                src={expo.artiste_principal.photo || '/default-artist.jpg'}
                                alt={expo.artiste_principal.nom}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="p-6 md:w-2/3">
                              <h5 className="text-xl font-bold mb-2">{expo.artiste_principal.nom}</h5>
                              <p className="text-gray-600 line-clamp-3 mb-4">{expo.artiste_principal.bio}</p>
                              <div className="flex items-center text-indigo-600 font-medium">
                                Voir le profil <ChevronRight className="ml-1" size={16} />
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    </div>
                  </div>
                )}

                {/* Autres artistes */}
                {filteredArtists.length > 0 && (
                  <div className="mt-10">
                    <h4 className="text-lg font-semibold text-gray-700 mb-4">
                      {expo.artiste_principal ? 'Autres artistes' : 'Artistes'}
                    </h4>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {displayedArtists.map((artiste) => (
                        <motion.div
                          key={artiste.id}
                          whileHover={{ y: -5 }}
                          className="bg-white rounded-xl shadow-md overflow-hidden"
                        >
                          <Link to={`/artistes/${artiste.id}`} className="block">
                            <div className="h-40 w-full relative">
                              <img
                                src={artiste.photo || '/default-artist.jpg'}
                                alt={artiste.nom}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="p-4">
                              <h5 className="font-bold mb-1">{artiste.nom}</h5>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>

                    {/* Bouton Voir plus / Voir moins */}
                    {filteredArtists.length > 3 && (
                      <div className="text-center mt-6">
                        <button
                          onClick={() => setShowAllArtists(!showAllArtists)}
                          className="text-indigo-600 hover:underline font-medium"
                        >
                          {showAllArtists ? 'Voir moins' : 'Voir plus'}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {(!expo.artiste_principal && (!expo.artistes || expo.artistes.length === 0)) && (
                  <div className="text-center py-10 bg-white rounded-xl shadow-sm">
                    <p className="text-gray-500">Aucun artiste associé à cette exposition</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
        
      {/* Section CTA positionnée absolument */}
      <div className="absolute rounded-b-3xl p-12 w-full bottom-0 left-0 right-0  shadow-lg ">
        <div className="bg-indigo-50 py-12 rounded-t-lg shadow-md">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Intéressé par cette exposition ?</h3>
            <p className="text-gray-600 max-w-2xl mx-auto mb-6">
              Réservez vos places dès maintenant ou contactez-nous pour plus d&apos;informations.
            </p>
            <div className="flex justify-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg shadow-md"
              >
                Réserver
              </motion.button>
              <motion.a
                href="/contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white hover:bg-gray-50 text-indigo-600 font-medium py-3 px-6 rounded-lg border border-indigo-600 shadow-sm"
              >
                Contact
              </motion.a>
            </div>
          </div>
        </div>
      </div>
      {/* Section Oeuvres à découvrir */}
      <section className="relative py-8 md:py-16 px-4 sm:px-6 lg:px-8 bg-white mx-4 md:mx-8 mt-12 md:mt-16">
        <div className="relative z-10">
          <h3 className="relative z-10 text-left text-[1.5rem] md:text-[2rem] lg:text-[2.5rem] text-[#000000] mb-6 md:mb-10" style={{ fontFamily: 'Kenyan Coffee, sans-serif' }}>
            OEUVRES A <span className="text-[#972924]">DECOUVRIR</span>
          </h3>
          {expo.oeuvres && expo.oeuvres.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {(showAllOeuvres ? expo.oeuvres : expo.oeuvres.slice(0, 12)).map((oeuvre) => (
                  <div key={oeuvre.id} className="bg-gray-100 rounded-lg shadow-md overflow-hidden flex flex-col">
                    <img
                      src={oeuvre.image || '/placeholder-artwork.jpg'}
                      alt={oeuvre.titre}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <h4 className="text-lg font-bold mb-2" style={{ fontFamily: 'Kenyan Coffee, sans-serif' }}>{oeuvre.titre}</h4>
                    </div>
                  </div>
                ))}
              </div>
              {expo.oeuvres.length > 12 && !showAllOeuvres && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={() => setShowAllOeuvres(true)}
                    className="px-6 py-2 bg-[#972924] text-white rounded shadow hover:bg-[#b33c36] transition font-bold"
                    style={{ fontFamily: 'Poppins Regular, sans-serif' }}
                  >
                    Afficher plus
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-500">Aucune oeuvre à afficher pour cette exposition.</p>
          )}
        </div>
      </section>
    <div/>
  </div>
  );
};

export default ExpoDetails;



      