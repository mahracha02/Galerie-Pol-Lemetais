// src/pages/Home.jsx
//import React from 'react';

const Home = () => {
  // Données temporaires pour les actualités
  const actualites = [
    {
      id: 1,
      titre: "Exposition en cours",
      description: "Découvrez notre nouvelle exposition temporaire",
      image: "/placeholder-exposition.jpg"
    },
    {
      id: 2,
      titre: "Nouveau catalogue",
      description: "Le catalogue de la collection printemps est disponible",
      image: "/placeholder-catalogue.jpg"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* En-tête de la page d'accueil */}
      <section className="mb-12">
        <h1 className="text-4xl font-bold text-center mb-6">
          Bienvenue à la Galerie Pol Lemétais
        </h1>
        <p className="text-xl text-center text-gray-600 max-w-3xl mx-auto">
          Découvrez notre collection d&apos;art contemporain et nos expositions
        </p>
      </section>

      {/* Section Actualités */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">Actualités</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {actualites.map((actualite) => (
            <div 
              key={actualite.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="h-48 bg-gray-200">
                {/* Placeholder pour l'image */}
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{actualite.titre}</h3>
                <p className="text-gray-600">{actualite.description}</p>
                <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  En savoir plus
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section Exposition en cours */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">Exposition en cours</h2>
        <div className="bg-gray-100 p-6 rounded-lg">
          <h3 className="text-2xl font-semibold mb-4">
            Titre de l&apos;exposition actuelle
          </h3>
          <p className="text-gray-600 mb-4">
            Description de l&apos;exposition en cours. Lorem ipsum dolor sit amet,
            consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
            labore et dolore magna aliqua.
          </p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Voir l&apos;exposition
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;