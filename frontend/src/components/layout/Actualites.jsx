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
    <section className="relative py-4 px-4 sm:px-6 lg:px-8 bg-white mt-26 mx-4 sm:mx-8">
      <h2 className="relative z-10 text-left text-3xl sm:text-5xl md:text-[4.5rem] text-[#000000] mb-6" style={{ fontFamily: 'Kenyan Coffee, sans-serif' }}>
        ACTUALITÉ
      </h2>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {actualites.map((news) => (
          <div
            key={news.id}
            className="relative bg-black shadow-lg flex flex-col overflow-hidden transition-transform duration-200 hover:-translate-y-2 hover:shadow-2xl h-[27rem] sm:h-[30rem] lg:h-[40rem]"
          >
            <img
              src={news.image}
              alt={news.titre}
              className="w-full h-[15rem] sm:h-[25rem] object-cover"
            />
            <div className="relative z-10 text-left p-4 px-6 text-[#FFFFFF] flex flex-col h-full">
              <h3 className="text-2xl sm:text-[2.5rem] mb-2 mt-2 sm:mt-4 uppercase" style={{ fontFamily: 'Kenyan Coffee, sans-serif' }}>{news.title}</h3>
              <p className="text-sm sm:text-[1rem] flex-1 mb-4 line-clamp-2" style={{ fontFamily: 'Poppins Regular, sans-serif' }}>{news.description}</p>
              <div className="mt-auto mb-4 sm:mb-6">
                <a
                  href={news.link}
                  className="inline-block border border-red-600 px-2 py-1 font-semibold hover:bg-red-600 hover:text-white transition-colors duration-300 text-sm text-center mt-2 w-30 ml-auto"
                >
                  En savoir plus
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Actualites;