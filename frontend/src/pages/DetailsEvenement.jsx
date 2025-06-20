  {/* Oeuvres section */}
  <section className="relative py-8 md:py-16 px-4 sm:px-6 lg:px-8 bg-white mx-4 md:mx-8 mt-12 md:mt-16">
    <div className="relative z-10">
      <div className="flex items-center mb-8">
        <img src={circle} alt="circle icon" className="w-8 h-8 mr-2" />
        <h2 className="text-[1.5rem] md:text-[2rem] lg:text-[2.5rem] text-[#000000] uppercase" style={{ fontFamily: 'Kenyan Coffee, sans-serif' }}>
          Œuvres à découvrir
        </h2>
      </div>

      {/* Exposition principale banner */}
      {event.exposition_principale && (
        <div className="w-full mb-10 rounded-2xl bg-gradient-to-r from-[#972924] to-[#b33c36] shadow-lg flex flex-col md:flex-row items-center justify-between px-8 py-8 gap-6">
          <div className="flex-1 flex flex-col items-center md:items-start">
            <span className="uppercase text-white text-[1.1rem] md:text-[1.3rem] font-bold tracking-widest mb-2" style={{ fontFamily: 'Poppins Regular, sans-serif' }}>Exposition principale</span>
            <h3 className="text-[2rem] md:text-[2.5rem] lg:text-[3rem] font-bold flex flex-wrap items-center gap-2 text-white" style={{ fontFamily: 'Kenyan Coffee, sans-serif' }}>
              {event.exposition_principale.titre.split(' ')[0]}
              <span className="text-[#ffe3e3]">{event.exposition_principale.titre.split(' ').slice(1).join(' ')}</span>
            </h3>
            <div className="text-white text-[1.1rem] md:text-[1.3rem] mt-2 mb-4" style={{ fontFamily: 'Poppins Regular, sans-serif' }}>
              Du {event.exposition_principale.date_debut ? event.exposition_principale.date_debut : 'Date inconnue'}
              {" "} au {event.exposition_principale.date_fin ? event.exposition_principale.date_fin : 'Date inconnue'}
            </div>
            <Link
              to={`/expositions/${event.exposition_principale.id}`}
              className="inline-block mt-2 px-6 py-2 bg-white text-[#972924] font-bold rounded shadow hover:bg-[#ffe3e3] transition text-[1rem] md:text-[1.1rem]"
              style={{ fontFamily: 'Poppins Regular, sans-serif' }}
            >
              Voir l'exposition
            </Link>
          </div>
          {event.exposition_principale.image && (
            <img
              src={event.exposition_principale.image}
              alt={event.exposition_principale.titre}
              className="w-40 h-40 md:w-56 md:h-56 object-contain rounded-xl shadow-lg bg-white"
            />
          )}
        </div>
      )}

      {event.oeuvres.length === 0 ? (
        <div className="text-center text-lg text-gray-600 bg-gray-100 p-6 rounded-lg shadow-lg">
          <p>Aucune œuvre disponible pour cet artiste pour le moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {(showAllOeuvres ? event.oeuvres : event.oeuvres.slice(0, 12)).map((oeuvre) => {
            const [titre1, ...titreRest] = oeuvre.titre ? oeuvre.titre.split(' ') : [''];
            const titre2 = titreRest.join(' ');
            return (
              <Link
                key={oeuvre.id}
                to={`/oeuvres/${oeuvre.id}`}
                className="bg-[#000000] shadow-md overflow-hidden flex flex-col min-h-[15rem] md:min-h-[20rem] lg:min-h-[25rem] transition-transform hover:scale-105 hover:shadow-lg border border-gray-200"
              >
                <img
                  src={oeuvre.image_principale || '/placeholder-artwork.jpg'}
                  alt={oeuvre.titre}
                  className="w-full max-h-[20rem] object-contain object-center"
                />
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <h4
                    className="text-[1.5rem] md:text-[1.75rem] lg:text-[2rem] font-bold mb-2 text-[#FFFFFF] hover:underline break-words"
                    style={{ fontFamily: 'Kenyan Coffee, sans-serif' }}
                  >
                    {titre1}
                    <span className='text-[#972924] block'>{titre2}</span>
                  </h4>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
    {event.oeuvres.length > 12 && !showAllOeuvres && (
      <div className="flex justify-center mt-8">
        <button
          onClick={() => setShowAllOeuvres(true)}
          className="px-6 py-2 bg-[#972924] text-white hover:bg-[#b33c36] transition"
          style={{ fontFamily: 'Poppins Regular, sans-serif' }}
        >
          Afficher plus
        </button>
      </div>
    )}
  </section>
