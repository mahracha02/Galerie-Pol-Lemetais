import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaFacebookF, FaInstagram } from 'react-icons/fa';
import logo from '../../assets/photos/logo.jpg'; 

const Footer = () => {
  return (
    <footer className="bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
      

      {/* Contenu du footer */}
      <div className="relative z-10 mx-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          {/* Left Section - Galerie Info */}
          <div className="flex flex-col space-y-4">
            <div className="w-20 h-20 mb-2">
              <img src={logo} alt="Logo" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-2xl font-bold">Galerie Pol Lemétais</h3>
            <div className="space-y-2">
              <p className="text-gray-400">24 rue du Rempart Saint Etienne 31000 Toulouse</p>
              <p className="text-gray-400">Ouvert du jeudi au samedi de 14h à 19h</p>
            </div>

            <div className="mt-6 text-sm text-gray-500 space-y-2">
              <p>CGU</p>
              <p>Mentions légales</p>
              <p>Politique de confidentialité</p>
            </div>
          </div>

          {/* Middle Section - Newsletter */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-full max-w-lg">
              <h3 className="text-xl font-semibold mb-6 uppercase tracking-wider text-left">Restez Informé</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="email" 
                  placeholder="VOTRE E-MAIL"
                  className="px-4 py-3 bg-black border border-withe text-white placeholder-gray-500 focus:outline-none focus:border-withe flex-grow"
                />
                <button className="px-6 py-3 bg-black text-white font-semibold border border-[#8B2323] hover:bg-[#1a0505] transition-colors duration-300 whitespace-nowrap">
                  SOUMETTRE
                </button>
              </div>
              <div className="flex justify-start mt-8 space-x-6">
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-xl">
                  <FaInstagram />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-xl">
                  <FaFacebookF />
                </a>
              </div>
            </div>
          </div>

          {/* Right Section - Navigation */}
          <div className="flex flex-col">
            <h3 className="text-xl font-semibold mb-6 uppercase tracking-wider">Galerie</h3>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors duration-300">Artistes</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Expositions</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Événements</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Catalogues</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Boutique</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Contact</a></li>
            </ul>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="border-t border-gray-800 mt-16 pt-8 text-center text-gray-600 text-lg">
          &copy; {new Date().getFullYear()} Galerie Pol Lemétais. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
