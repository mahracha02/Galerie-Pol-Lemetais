import {  useEffect, useState } from 'react';


// Animated SVG background as a React component
const AnimatedArtBg = () => (
  <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
    {/* Purple blob, top left */}
    <svg className="absolute left-[-10%] top-[-10%] w-[60vw] h-[60vw] animate-pulse opacity-40" viewBox="0 0 600 600">
      <g transform="translate(300,300)">
        <path d="M120,-150C160,-120,200,-80,210,-30C220,20,200,80,160,120C120,160,60,180,10,180C-40,180,-80,160,-120,120C-160,80,-200,20,-200,-40C-200,-100,-160,-160,-100,-180C-40,-200,40,-180,120,-150Z" fill="#a21caf" />
      </g>
    </svg>
    {/* Red blob, bottom right */}
    <svg className="absolute right-[-10%] bottom-[-10%] w-[50vw] h-[50vw] animate-spin-slow opacity-30" viewBox="0 0 600 600">
      <g transform="translate(300,300)">
        <path d="M120,-150C160,-120,200,-80,210,-30C220,20,200,80,160,120C120,160,60,180,10,180C-40,180,-80,160,-120,120C-160,80,-200,20,-200,-40C-200,-100,-160,-160,-100,-180C-40,-200,40,-180,120,-150Z" fill="#f43f5e" />
      </g>
    </svg>
  </div>
);

const Actualites = () => {
  const [actualites, setActualites] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/actualites/api');
      const data = await response.json();
      setActualites(data);
    };
    fetchData().catch((error) => {
      console.error("Erreur lors du chargement des actualités :", error);
    });
  }, []);



  return (
    <section className="relative py-16 mt-12 px-6 bg-gradient-to-br from-gray-900 via-gray-800 to-black mb-12 overflow-hidden">
      <AnimatedArtBg />
      <h2 className="text-4xl font-bold text-center text-white mb-8 drop-shadow-lg">📰 Actualités</h2>
      <div className="grid gap-8 max-w-6xl mx-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {actualites.map((news) => (
          <div
            key={news.id}
            className="relative bg-white rounded-2xl shadow-lg flex flex-col overflow-hidden transition-transform duration-200 hover:-translate-y-2 hover:shadow-2xl"
          >
            {/* "Nouveau" Banner */}
            {news.nouveau && (
              <div className="absolute left-0 top-0 z-10">
                <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-br-2xl shadow-lg animate-bounce">
                  Nouveau
                </span>
              </div>
            )}
            <img
              src={news.image}
              alt={news.titre}
              className="w-full h-48 object-cover"
            />
            <div className="p-6 flex flex-col flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{news.title}</h3>
              <span className="text-sm text-purple-400 mb-4">
                {new Date(news.date).toLocaleDateString('fr-FR')}
              </span>
              <p className="text-gray-600 flex-1 mb-6">{news.description}</p>
              <a
                href={news.link}
                className="inline-block bg-gradient-to-r from-purple-400 to-indigo-500 text-white px-5 py-2 rounded-full font-semibold shadow hover:from-indigo-500 hover:to-purple-400 transition"
              >
                En savoir plus
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Actualites;