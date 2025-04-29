//import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">404 - Page non trouvée</h1>
      <p className="text-xl text-gray-600 mb-8">
        La page que vous recherchez n&apos;existe pas.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  );
};

export default NotFound;