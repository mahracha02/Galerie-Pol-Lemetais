import { useEffect, useState } from 'react';

const Actualites = () => {
  const [actualites, setActualites] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/actualites/api');
        if (!response.ok) throw new Error('Failed to fetch actualites');
        const data = await response.json();
        setActualites(data);
      } catch (error) {
        console.error("Erreur lors du chargement des actualités :", error);
        // Optionally set an error state to display a message to the user
      }
    };
    fetchData();
  }, []);

  return (
    <section className="relative py-4 px-4 sm:px-6 lg:px-8 bg-white mt-8 mx-8">
      <h2 className="text-4xl font-black text-gray-900 text-center mb-12 uppercase relative after:absolute after:bottom-[-8px] after:left-1/2 after:-translate-x-1/2 after:w-16 after:h-1 after:bg-[#8B2323]">
        Actualités
      </h2>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {actualites.map((news) => (
          <div
            key={news.id}
            className="relative bg-black shadow-lg flex flex-col overflow-hidden transition-transform duration-200 hover:-translate-y-2 hover:shadow-2xl"
          >
            <img
              src={news.image}
              alt={news.titre}
              className="w-full h-94 object-container"
            />
            <div className="p-4 flex flex-col flex-1 text-white">
              <h3 className="text-xl font-bold mb-2 uppercase">{news.title}</h3>
              <p className="text-gray-300 flex-1 mb-4 line-clamp-3">{news.description}</p>
              <a
                href={news.link}
                className="inline-block border border-red-600 text-white px-2 py-1 font-semibold hover:bg-red-600 hover:text-white transition-colors duration-300 text-sm text-center mt-2 w-30 ml-auto"
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