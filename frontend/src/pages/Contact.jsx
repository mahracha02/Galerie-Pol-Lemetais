import { motion } from "framer-motion";
import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import serviceCall from "../assets/photos/serviceCall.png";
import adresse from "../assets/photos/address.png";

// Définir l'icône du marqueur pour Leaflet
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});



const Contact = () => {
  const position = [43.596089, 1.449292]; // adresse de la galerie

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted", formData);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="relative flex items-center justify-center h-[15vh] bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden mb-8">
        {/* Effets d'arrière-plan lumineux */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-1/4 w-72 h-72 bg-purple-500 opacity-30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-1/4 w-64 h-64 bg-blue-600 opacity-25 rounded-full blur-2xl"></div>
        </div>

        {/* Contenu animé */}
        <div className="relative text-center px-6">
          <motion.h1
            className="text-5xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400
                      flex items-center gap-3 transition-transform duration-500 hover:scale-105"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            Contactez-nous
            <img src={serviceCall} alt="Service Call" className="w-15 h-15" />
          </motion.h1>
          <motion.p
            className="mt-4 text-lg text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          >
            Une question ? Un projet ? Nous sommes à votre écoute !
          </motion.p>
        </div>
      </header>

      {/* Section formulaire contact */}
      <section className="relative py-16 px-6 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex justify-center" id="contact">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative max-w-2xl w-full bg-gray-900 p-8 rounded-lg shadow-2xl backdrop-blur-md">

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}>
              <label className="block text-sm font-medium">Nom complet</label>
              <input 
                type="text" 
                name="fullName" 
                value={formData.fullName} 
                onChange={handleChange}
                className="w-full mt-2 p-3 rounded-md bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none" 
                required 
              />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}>
              <label className="block text-sm font-medium">Email</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange}
                className="w-full mt-2 p-3 rounded-md bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none" 
                required 
              />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}>
              <label className="block text-sm font-medium">Téléphone</label>
              <input 
                type="tel" 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange}
                className="w-full mt-2 p-3 rounded-md bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none" 
              />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}>
              <label className="block text-sm font-medium">Message</label>
              <textarea 
                name="message" 
                value={formData.message} 
                onChange={handleChange}
                rows="4"
                className="w-full mt-2 p-3 rounded-md bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none" 
                required
              ></textarea>
            </motion.div>
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full bg-indigo-600 py-3 rounded-md text-white font-semibold hover:bg-indigo-700 transition">
              Envoyer
            </motion.button>
          </form>
        </motion.div>
      </section>

      {/* Section Contact */}
      <section className="relative py-16 px-6 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        {/* Effet d'arrière-plan artistique */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 opacity-20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-600 opacity-25 rounded-full blur-2xl"></div>
        </div>

        {/* Contenu coordonnées */}
        <div className="relative z-10 max-w-6xl mx-auto flex flex-col items-center">
          <h2 className="text-4xl font-bold text-white mb-12 flex items-center gap-3">
            Coordonnées
            <img src={adresse} alt="Adresse" className="w-10 h-10" />
          </h2>
        


          {/* Carte coupée en deux */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col lg:flex-row bg-white bg-opacity-90 backdrop-blur-md shadow-2xl rounded-xl overflow-hidden w-200"
          >
            {/* Partie Gauche - adresse - numéro de tелефone - Siret */}
            <div className="lg:w-1/2 p-6">
              <h3 className="text-2xl font-semibold mb-4">Galerie Pol Lemétais</h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                24 rue du Rempart Saint Etienne<br />
                31000 TOULOUSE<br />
                +33 (0)6 72 95 60 18<br />
                <b>siège social :</b>
                Moulin de Boudène, <br />
                12370 Saint Sever du Moustier<br />
                <b>SIRET :</b> 822 564 159 00017 <br/>
                Ouvert du <b>jeudi</b> au <b>samedi</b>,<br/>
                de <b>14h</b> à <b>19h</b>,et sur rendez-vous.
              </p>
              
             

              {/* Bouton Contact */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-6 self-start px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-500 transition duration-300"
              >
                <a href="#contact">Contactez-nous</a>
              </motion.button>
            </div>

            {/* Partie Droite - Carte Interactive */}
            <div className="lg:w-1/2 relative h-96">
              <MapContainer center={position} zoom={13} className="h-full w-full rounded-lg">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={position} icon={customIcon}>
                  <Popup>Galerie Pol Lemétais</Popup>
                </Marker>
              </MapContainer>
            </div>
          </motion.div>
        </div>

        
      </section>  
    </div>
  );
};

export default Contact;
