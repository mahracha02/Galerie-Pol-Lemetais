import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const DetailsArtiste = () => {
  const { id } = useParams();

  const [artiste, setArtiste] = useState(null);
  const [oeuvres, setOeuvres] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchArtistDetails = async (artistId) => {
    try {
      const response = await fetch(`/artistes/api/${artistId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP! Status: ${response.status}`);
      }

      const data = await response.json();
      setArtiste(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des données de l'artiste :", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOeuvresArtiste = async (Id) => {
    try {
      const response = await fetch(`/oeuvres/api/artiste/${Id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      

      if (!response.ok) {
        throw new Error(`Erreur HTTP! Status: ${response.status}`);
      }
      const data = await response.json();
      setOeuvres(data); // Mettre à jour les œuvres de l'artiste
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
    return <div className="text-center text-xl text-gray-500">Chargement...</div>;
  }

  if (!artiste) {
    return <div className="text-center text-xl text-gray-500">Artiste non trouvé</div>;
  }

  return (
    <div className="max-w-screen-xl mx-auto p-8 bg-white rounded-lg shadow-xl mt-12 mb-12">
      <div className="flex flex-col items-center md:flex-row gap-6">
        {/* Photo de l'artiste */}
        <div className="w-48 h-48 md:w-64 md:h-64 mb-6 md:mb-0">
          <img
            src={artiste.photo ? artiste.photo.replace('https://', 'http://') : '/uploads/default-artist.jpg'}
            alt={artiste.nom}
            className="w-full h-full object-cover rounded-full shadow-2xl border-4 border-indigo-500"
          />
        </div>

        {/* Détails de l'artiste */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">{artiste.nom}</h1>
          <p className="text-lg text-gray-600 mb-4 max-w-3xl">{artiste.bio}</p>
          <div className="flex gap-4 justify-center md:justify-start flex-wrap">
            <span className="text-sm font-semibold text-indigo-600">Né(e) : {artiste.date_naissance}</span>
            <span className="text-sm font-semibold text-indigo-600">Pays : {artiste.pays}</span>
          </div>
        </div>
      </div>

      {/* Galerie d'œuvres */}
      <div className="mt-10">
        <h2 className="text-3xl font-semibold text-gray-900 mb-8 text-center">Œuvres de l&apos;artiste</h2>

        {/* Vérification si des œuvres sont disponibles */}
        {oeuvres.length === 0 ? (
          <div className="text-center text-lg text-gray-600 bg-gray-100 p-6 rounded-lg shadow-lg">
            <p>Aucune œuvre disponible pour cet artiste pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {oeuvres.map((oeuvre, index) => (
              <div key={index} className="relative group rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out">
                <img
                  src={oeuvre.image_principale || '/photos/default-artwork.jpg'}
                  alt={oeuvre.titre}
                  className="w-full h-60 object-cover group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out">
                  <h3 className="text-white text-lg font-semibold">{oeuvre.titre}</h3>
                </div>
                {/* Bouton "Se renseigner" */}
                <div className="absolute top-0 right-0 p-3">
                  <button 
                    onClick={() => window.location.href = `/oeuvres/${oeuvre.id}`} 
                    className="px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all duration-300 ease-in-out">
                    Se renseigner
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default DetailsArtiste;
