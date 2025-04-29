import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";

const OeuvreDetails = () => {
  const { id } = useParams();
  const [oeuvre, setOeuvre] = useState(null);
  const [imagePrincipale, setImagePrincipale] = useState('');
  const [zoomedImage, setZoomedImage] = useState(null);

  useEffect(() => {
    fetch(`/oeuvres/api/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setOeuvre(data);
        setImagePrincipale(data.image_principale);
      })
      .catch((err) => console.error('Erreur:', err));
  }, [id]);

  if (!oeuvre) return <div className="text-center mt-10">Chargement...</div>;

  // Gestion des images secondaires (ex : "http://127.0.0.1:8000/photos/img1.jpg,img2.jpg,img3.jpg")
  const baseUrl = "http://127.0.0.1:8000/photos/";

  const secondaryImages = oeuvre.images_secondaires
    ? oeuvre.images_secondaires
        .split(/\r?\n|,/) // split par retour ligne ou virgule
        .map((img) => img.trim())
        .filter((img) => img && img !== oeuvre.image_principale)
        .map((img) =>
          img.startsWith('http://') || img.startsWith('https://')
            ? img
            : baseUrl + img
        )
    : [];


  return (
    <div className="container mx-auto px-4 py-16 font-serif text-gray-800">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* Lightbox avec animation */}
        <AnimatePresence>
          {zoomedImage && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/70"
              onClick={() => setZoomedImage(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.img
                src={zoomedImage}
                alt="Zoom"
                initial={{ scale: 0.7 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.7 }}
                transition={{ duration: 0.3 }}
                className="max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Galerie */}
        <motion.div
          className="border-4 border-gray-200 rounded-3xl overflow-hidden shadow-xl cursor-zoom-in"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <img
            src={imagePrincipale}
            alt={oeuvre.titre}
            className="w-full h-[450px] object-container hover:scale-105 transition-transform duration-300 ease-in-out"
            onClick={() => setZoomedImage(imagePrincipale)}
          />
        </motion.div>

        {/* Infos */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h1 className="text-4xl font-bold text-indigo-800">{oeuvre.titre}</h1>
          <p className="text-lg italic text-gray-600">{oeuvre.description}</p>

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
            <p><span className="font-semibold">Dimensions:</span> {oeuvre.dimensions}</p>
            <p><span className="font-semibold">Technique:</span> {oeuvre.technique}</p>
            <p><span className="font-semibold">Remarque:</span> {oeuvre.remarque}</p>
            <p>
              
              {oeuvre.stock > 0 ? (
                <>
                  <span className="font-semibold">Stock:</span>
                  <span className="text-green-700 ml-2">{oeuvre.stock} disponible(s)</span>
                </>      
              ) : (
                <span className="text-red-600 hidden">Indisponible</span>
              )}
            </p>
          </div>

          {/* Boutons */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={() => {
                const formSection = document.getElementById("contact-form");
                if (formSection) formSection.scrollIntoView({ behavior: "smooth" });
              }}
              className="bg-indigo-600 text-white px-6 py-2 rounded-full shadow hover:bg-indigo-700 transition duration-300"
            >
              Se renseigner
            </button>

            <button
              disabled={oeuvre.stock <= 0}
              className={`px-6 py-2 rounded-full shadow transition duration-300 ${
                oeuvre.stock > 0
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-gray-400 text-white cursor-not-allowed"
              }`}
            >
              Acheter
            </button>
          </div>
        </motion.div>
      </div>

      {/* Miniatures */}
      {secondaryImages.length > 0 && (
        <div className="flex gap-3 mt-5 overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-indigo-300">
          {[oeuvre.image_principale, ...secondaryImages].map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Miniature ${index}`}
              onClick={() => setImagePrincipale(img)}
              className={`w-20 h-20 object-container border-4 rounded-xl shadow-md cursor-pointer transition-all duration-300 ${
                imagePrincipale === img ? 'border-indigo-600 scale-105' : 'border-gray-300 hover:scale-105'
              }`}
            />
          ))}
        </div>
      )}

      {/* Formulaire contact */}
      <motion.div
        id="contact-form"
        className="mt-20 bg-white p-10 rounded-3xl shadow-2xl border border-indigo-100"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold mb-6 text-indigo-800">Formulaire de renseignement</h2>
        <form className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <input
            type="text"
            placeholder="Votre nom"
            className="p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300"
            required
          />
          <input
            type="email"
            placeholder="Votre email"
            className="p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300"
            required
          />
          <input
            type="tel"
            placeholder="Votre numéro de tel (facultatif)"
            className="p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <textarea
            placeholder="Votre message"
            className="p-3 border rounded-xl md:col-span-3 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            rows="5"
            required
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition md:col-span-3"
          >
            Envoyer ma demande
          </button>
        </form>
      </motion.div>
    </div>

  );
};

export default OeuvreDetails;

          