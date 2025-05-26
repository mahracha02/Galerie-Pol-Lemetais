import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaFacebookF, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="relative bg-gray-900 text-white py-12 mt-auto">
      {/* Effets artistiques en arrière-plan */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-80 h-80 bg-purple-600 opacity-30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-blue-500 opacity-25 rounded-full blur-2xl"></div>
      </div>

      {/* Contenu du footer */}
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Informations légales */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-xl font-semibold mb-4 border-b-2 border-blue-500 inline-block pb-1">
              📜 Informations légales
            </h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link to="/mentions-legales" className="hover:text-blue-400 transition">Mentions légales</Link>
              </li>
              <li>
                <Link to="/cgu" className="hover:text-blue-400 transition">CGU</Link>
              </li>
              <li>
                <Link to="/confidentialite" className="hover:text-blue-400 transition">Politique de confidentialité</Link>
              </li>
            </ul>
          </motion.div>

          {/* Réseaux sociaux */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-xl font-semibold mb-4 border-b-2 border-pink-500 inline-block pb-1">
              🌍 Nous suivre
            </h3>
            <div className="flex space-x-4 mt-3">
              <a href="https://www.facebook.com/people/Galerie-Pol-Lemetais/pfbid02kdNLfrcnnFrA6V9ZGQLjgRXnoouq6EcGXpHsi37j8rAczAKqy7kRiDQHsw44r31fl/" className="flex items-center space-x-2 hover:text-blue-400 transition">
                <FaFacebookF className="text-xl" /> <span>Facebook</span>
              </a>
              <a href="https://www.instagram.com/galerielemetais/" className="flex items-center space-x-2 hover:text-pink-400 transition">
                <FaInstagram className="text-xl" /> <span>Instagram</span>
              </a>
            </div>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h3 className="text-xl font-semibold mb-4 border-b-2 border-yellow-500 inline-block pb-1">
              📩 Newsletter
            </h3>
            <form className="flex items-center space-x-2 mt-3">
              <input
                type="email"
                placeholder="Entrez votre email"
                className="px-5 py-3 w-64 bg-white bg-opacity-80 text-gray-800 
                          rounded-full shadow-md focus:ring-4 focus:ring-yellow-400 
                          outline-none transition duration-300 ease-in-out"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-yellow-500 text-white font-semibold 
                          rounded-full shadow-md hover:bg-yellow-600 
                          transition duration-300 ease-in-out"
              >
                S&apos;inscrire
              </button>
            </form>
          </motion.div>
        </div>

        {/* Ligne de séparation */}
        <div className="mt-12 border-t border-gray-700 pt-6 text-center text-gray-400">
          © {new Date().getFullYear()} Galerie Pol Lemétais. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
