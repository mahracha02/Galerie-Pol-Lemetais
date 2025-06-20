import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Expositions = () => {
  const [showVirtualTour, setShowVirtualTour] = useState(false);
  const [selectedExpo, setSelectedExpo] = useState(null);

  // ... existing code ...

  // Inside the details div of each exposition card, replace the button block with a flex row that puts the button at the right end
  <div className="flex flex-row items-center justify-between mt-4">
    <div className="flex flex-wrap gap-4 items-center">
      {/* Date display here, as before */}
      <span className="text-[#000000] text-[0.8rem] md:text-[0.9rem] lg:text-[1rem]" style={{ fontFamily: 'Poppins Regular, sans-serif' }}>
        Du{' '}
        {expo.date_debut ? parseDateFr(expo.date_debut).toLocaleDateString('fr-FR', { month: 'long', day: 'numeric' }) : 'Date inconnue'}{' '}
        au{' '}
        {expo.date_fin ? parseDateFr(expo.date_fin).toLocaleDateString('fr-FR', { month: 'long', day: 'numeric' }) : 'Date inconnue'}
      </span>
    </div>
    <div className="flex items-center justify-between my-4 w-full">
      <div className="flex gap-4">
        <Link 
          to={`/expositions/${expo.id}`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#972924] text-white border border-[#000000] shadow-md hover:bg-[#FFFFFF] hover:text-[#972924] hover:border-[#972924] transition-all duration-300"
          style={{ fontFamily: 'Poppins Regular, sans-serif' }}
        >
          <span className='text-[0.8rem] md:text-[0.9rem] lg:text-[1rem]'>En savoir plus</span>
        </Link>
      </div>
      <button
        onClick={() => { setSelectedExpo(expo); setShowVirtualTour(true); }}
        className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFFFFF] text-[#000000] border border-[#000000] shadow-md hover:bg-[#972924] hover:text-[#FFFFFF] hover:border-[#972924] transition-all duration-300"
        style={{ fontFamily: 'Poppins Regular, sans-serif' }}
      >
        <span className='text-[0.8rem] md:text-[0.9rem] lg:text-[1rem]'>Voir la liste virtuelle</span>
      </button>
    </div>
  </div>

  // ... existing code ...

  // After the expositions list, render the modal ONCE:
  {showVirtualTour && (
    selectedExpo && selectedExpo.visite_virtuelle_url ? (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
        <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full relative p-6">
          <button
            onClick={() => { setShowVirtualTour(false); setSelectedExpo(null); }}
            className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-2xl font-bold"
            aria-label="Fermer"
          >
            &times;
          </button>
          <h2 className="text-2xl font-bold mb-4 text-[#972924]" style={{ fontFamily: 'Kenyan Coffee, sans-serif' }}>
            Visite virtuelle de l'exposition
          </h2>
          <div className="w-full aspect-video mb-2">
            <iframe
              src={selectedExpo.visite_virtuelle_url}
              title="Visite virtuelle"
              className="w-full h-[400px] rounded-lg border-2 border-[#972924]"
              allowFullScreen
            />
          </div>
          <p className="text-center text-gray-600 mt-2">
            <a
              href={selectedExpo.visite_virtuelle_url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-[#972924] hover:text-[#b33c36]"
            >
              Ouvrir dans un nouvel onglet
            </a>
          </p>
        </div>
      </div>
    ) : (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
        <div className="bg-white rounded-lg shadow-2xl max-w-md w-full relative p-6 flex flex-col items-center">
          <button
            onClick={() => { setShowVirtualTour(false); setSelectedExpo(null); }}
            className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-2xl font-bold"
            aria-label="Fermer"
          >
            &times;
          </button>
          <h2 className="text-xl font-bold mb-4 text-[#972924] text-center" style={{ fontFamily: 'Kenyan Coffee, sans-serif' }}>
            La carte virtuelle n'est pas encore disponible
          </h2>
        </div>
      </div>
    )
  )}

  // ... existing code ...
};

export default Expositions;
