//import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Informations légales</h3>
            <ul className="space-y-2">
              <li><Link to="/mentions-legales">Mentions légales</Link></li>
              <li><Link to="/cgu">CGU</Link></li>
              <li><Link to="/confidentialite">Politique de confidentialité</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Nous suivre</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-400">Facebook</a>
              <a href="#" className="hover:text-pink-400">Instagram</a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <form className="flex">
              <input
                type="email"
                placeholder="Votre email"
                className="px-4 py-2 rounded-l text-gray-800"
              />
              <button
                type="submit"
                className="bg-blue-600 px-4 py-2 rounded-r hover:bg-blue-700"
              >
                S&apos;inscrire
              </button>
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;