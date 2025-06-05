import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaFacebookF, FaInstagram } from 'react-icons/fa';
import logo from '../../assets/photos/logo.png'; 

const Footer = () => {
  return (
    <footer className="bg-[#0C0C0C] text-white">
      

      {/* Contenu du footer */}
      <div className="relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-20 mx-20 py-8">
          {/* Left Section - Galerie Info */}
          <div className="flex flex-col space-y-8">
            <div className="w-20 h-20 mb-2">
              <img src={logo} alt="Logo" className="w-full h-full object-contain" />
            </div>
            
            <div className="space-y-1">
               <h1 className="text-5xl md:text-[2.25rem]  text-[#FFFFFF]" style={{ fontFamily: 'Kenyan Coffee, sans-serif' }}>Galerie Pol Lemétais</h1>
              <p className="text-[#FFFFFF] text-[0.85rem]" style={{ fontFamily: 'Poppins Regular, sans-serif' }}>24 rue du Rempart Saint Etienne 31000 Toulouse</p>
              <p className="text-gray-400 text-[0.75rem]" style={{ fontFamily: 'Poppins Regular, sans-serif' }}>Ouvert du jeudi au samedi de 14h à 19h</p>
            </div>

            <div className="mt-6 text-sm text-gray-500 space-y-2">
              <p>CGU</p>
              <p>Mentions légales</p>
              <p>Politique de confidentialité</p>
            </div>
          </div>

          {/* Middle Section - Newsletter */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-full max-w-lg pr-4">
              <h3 className="text-5xl md:text-[1.5rem]  text-[#FFFFFF] uppercase mb-3" style={{ fontFamily: 'Kenyan Coffee, sans-serif' }}>Restez Informé</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="email" 
                  placeholder="VOTRE E-MAIL"
                  className="px-4 py-3 bg-black border border-withe text-white placeholder-gray-500 focus:outline-none focus:border-withe flex-grow"
                />
                <button className="px-6 py-3 bg-black text-white  border border-[#972924] hover:bg-[#1a0505] transition-colors duration-300 whitespace-nowrap"
                style={{ fontFamily: 'Poppins Regular, sans-serif' }}>
                  SOUMETTRE
                </button>
              </div>
              <div className="flex justify-start mt-4 space-x-4">
                <a href="#" className="text-[#972924] hover:text-white transition-colors text-xl">
                  <FaInstagram />
                </a>
                <a href="#" className="bg-[#972924] text-[#000000] rounded-full text-[1.05rem] pt-1 px-[0.2rem]  hover:text-white transition-colors text-xl">
                  <FaFacebookF />
                </a>
              </div>
            </div>
          </div>

          {/* Right Section - Navigation */}
          <div className="flex flex-col items-center text-center mt-12">
            <h3 className="text-5xl md:text-[1.5rem] text-[#FFFFFF] mb-3" style={{ fontFamily: 'Kenyan Coffee, sans-serif' }}>Galerie</h3>
            <ul className="space-y-3 text-[#FFFFFF] text-md"
              style={{ fontFamily: 'Poppins Regular, sans-serif' }}
            >
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
        <div className="relative z-10 py-4 text-center text-[#7C7C7C] text-md bg-[#000000]"
          style={{ fontFamily: 'Poppins Regular, sans-serif' }}
        >
          &copy; {new Date().getFullYear()} Galerie Pol Lemétais. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
