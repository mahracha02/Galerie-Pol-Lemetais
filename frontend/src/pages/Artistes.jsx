import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";

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
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Nos Artistes</h1>

        <div className="mb-12 text-center max-w-3xl mx-auto">
          <p className="text-gray-600">
            La Galerie Pol Lemetais représente des artistes contemporains exceptionnels, 
            chacun apportant une vision unique et une approche distinctive à leur pratique artistique. 
            Découvrez notre sélection d&apos;artistes travaillant dans diverses disciplines.
          </p>
        </div>

        {/* Filtres en ligne */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-12">
          {/* Barre de recherche */}
          <input
            type="text"
            placeholder="Rechercher par nom ou pays..."
            className="px-4 py-2 border rounded-lg w-full md:max-w-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Filtre par pays */}
          <select
            className="px-4 py-2 border rounded-lg w-full md:max-w-xs"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
          >
            <option value="Tous">Tous les pays</option>
            {[...new Set(artists.map((artist) => artist.pays))]
              .filter(Boolean)
              .map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
          </select>

          {/* Filtre par nom d'artiste */}
          <select
            className="px-4 py-2 border rounded-lg w-full md:max-w-xs"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          >
            <option value="">Tous les artistes</option>
            {[...new Set(artists.map((artist) => artist.nom))]
              .filter(Boolean)
              .map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-xl text-gray-600">Chargement des artistes...</div>
          </div>
        ) : (
          <div className="space-y-16">
            {/* All Artists Grid */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
                Artistes
              </h2>

              {filteredArtists.length === 0 ? (
                <div className="text-center py-12 text-gray-600">
                  Aucun artiste trouvé.
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredArtists.map((artist) => (
                    <div key={artist.id} className="bg-white shadow-md rounded-lg overflow-hidden">
                      <div className="h-64 bg-gray-300">
                        <img 
                          src={artist.photo} 
                          alt={artist.nom} 
                          className="w-full h-full object-container"
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-bold text-gray-800">{artist.nom}</h3>
                          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                            {artist.pays}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-4 line-clamp-4">
                          {artist.bio}
                        </p>
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-gray-500 ">Date de naissance: <b>{artist.date_naissance}</b></p>
                          <motion.a
                            href={`/artistes/${artist.id}`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="text-red-600 hover:text-red-700 font-medium"
                          >
                            Voir le profil →
                          </motion.a>   
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Artistes;
