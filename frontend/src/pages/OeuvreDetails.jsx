import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import circle from '../assets/photos/icons/circle.png';
import Medias from '../components/layout/Medias';

const OeuvreDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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

  if (!oeuvre) return <div className="text-center mt-10 text-[#0C0C0C]">Chargement...</div>;

  // Gestion des images secondaires
  const baseUrl = "http://127.0.0.1:8000/uploads/";
  const secondaryImages = oeuvre.images_secondaires
    ? oeuvre.images_secondaires
        .split(/\r?\n|,/) // split par retour ligne ou virgule
        .map((img) => img.trim())
        .filter((img) => img && img !== oeuvre.image_principale)
        .map((img) =>
          img.startsWith('http://') || img.startsWith('https://')
            ? img.replace('https://', 'http://')
            : baseUrl + img
        )
    : [];

  // Split title for color styling
  const [titre1, ...titreRest] = oeuvre.titre ? oeuvre.titre.split(' ') : [''];
  const titre2 = titreRest.join(' ');

  return (
    <div className="min-h-screen text-[#FFFFFF]">
      {/* Header section with main image and overlay */}
      <div className="relative w-full h-[28rem] sm:h-[32rem] lg:h-[40rem] overflow-hidden shadow-md bg-[#000000] ">
        <img
          src={imagePrincipale || '/placeholder-artwork.jpg'}
          alt={oeuvre.titre}
          className="absolute inset-0 w-full h-full object-contain object-center"
          loading="eager"
        />
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 z-20 bg-[#FFFFFF] text-[#0C0C0C] p-2 rounded-full shadow-md hover:bg-[#FFFFFF] transition border border-[#0C0C0C]"
        >
          <svg width="20" height="20" fill="none" stroke="#0C0C0C" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </button>
        {/* Title overlay */}
        <div className="relative z-10 h-full flex flex-col justify-end px-6 sm:px-10 pb-10">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-[2.5rem] md:text-[3.5rem] lg:text-[4rem] uppercase mb-3 flex flex-wrap items-center gap-2 text-center" style={{ fontFamily: 'Kenyan Coffee, sans-serif', color: '#FFFFFF' }}>
              {titre1}
              <span className="" style={{ color: '#972924' }}>{titre2}</span>
            </h1>
          </motion.div>
        </div>
      </div>

      {/* Section: Galerie miniatures + Lightbox */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-10">
          {/* Lightbox avec animation */}
          <AnimatePresence>
            {zoomedImage && (
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center" style={{background: '#0C0C0Ccc'}}
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
                  className="max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl bg-[#FFFFFF]"
                  onClick={(e) => e.stopPropagation()}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main image and miniatures */}
          <div className="flex flex-col gap-4 md:w-1/2">
            <motion.div
              className="border-4 border-[#0C0C0C] overflow-hidden cursor-zoom-in bg-gray-100 "
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <img
                src={imagePrincipale || '/placeholder-artwork.jpg'}
                alt={oeuvre.titre}
                className="w-full h-[450px] object-contain hover:scale-105 transition-transform duration-300 ease-in-out bg-[#FFFFFF] p-4"
                onClick={() => setZoomedImage(imagePrincipale)}
              />
            </motion.div>
            {secondaryImages.length > 0 && (
              <div className="flex gap-3 mt-2 overflow-x-auto overflow-y-hidden">
                {[oeuvre.image_principale, ...secondaryImages].map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Miniature ${index}`}
                    onClick={() => setImagePrincipale(img)}
                    className={`w-20 h-20 object-container border-4 cursor-pointer transition-all duration-300 ${
                      imagePrincipale === img ? 'border-[#972924] scale-105' : 'border-[#0C0C0C] hover:scale-105'
                    } bg-[#FFFFFF]`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Infos section */}
          <motion.div
            className="flex-1 space-y-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {/* Section header */}
            <div className="flex items-center mb-4">
              <img src={circle} alt="circle icon" className="w-8 h-8 mr-2" />
              <h2 className="text-[1.5rem] md:text-[2rem] lg:text-[2.5rem] uppercase" style={{ fontFamily: 'Kenyan Coffee, sans-serif', color: '#0C0C0C' }}>
                Détails de l'œuvre
              </h2>
            </div>
            <p className="text-lg italic mb-2" style={{ color: '#0C0C0C' }}>{oeuvre.description}</p>
            <div className="grid grid-cols-2 gap-4 text-sm" style={{ color: '#0C0C0C' }}>
              <p><span className="font-semibold">Dimensions:</span> {oeuvre.dimensions}</p>
              <p><span className="font-semibold">Technique:</span> {oeuvre.technique}</p>
              <p><span className="font-semibold">Remarque:</span> {oeuvre.remarque}</p>
              <p>
                {oeuvre.stock > 0 ? (
                  <>
                    <span className="font-semibold">Stock:</span>
                    <span className="ml-2" style={{ color: '#972924' }}>{oeuvre.stock} disponible(s)</span>
                  </>
                ) : (
                  <span style={{ color: '#972924' }}>Indisponible</span>
                )}
              </p>
            </div>
            {/* Artiste et exposition */}
            <div className="mt-6 flex flex-col gap-2 text-[1.1rem] md:text-[1.25rem] lg:text-[1.5rem]">
              {oeuvre.artiste && (
                <div className="flex items-center gap-2">
                  <span style={{ color: '#0C0C0C' }}>Artiste :</span>
                  <Link to={`/artistes/${oeuvre.artiste.id}`} className=" hover:underline" style={{ color: '#972924' , fontFamily: 'Kenyan Coffee, sans-serif' }}>
                    {oeuvre.artiste.nom}
                  </Link>
                </div>
              )}
              {oeuvre.exposition && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold" style={{ color: '#972924' }}>Exposition :</span>
                  <Link to={`/expositions/${oeuvre.exposition.id}`} className="font-bold hover:underline" style={{ color: '#0C0C0C' }}>
                    {oeuvre.exposition.titre}
                  </Link>
                </div>
              )}
            </div>
            {/* Boutons */}
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => {
                  const formSection = document.getElementById("contact-form");
                  if (formSection) formSection.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-6 py-2  font-bold transition duration-300"
                style={{ background: '#972924', color: '#FFFFFF', border: '1px solid #0C0C0C', fontFamily: 'Poppins Regular, sans-serif' }}
              >
                Se renseigner
              </button>
              <button
                disabled={oeuvre.stock <= 0}
                className={`px-6 py-2 font-bold transition duration-300 ${
                  oeuvre.stock > 0
                    ? ''
                    : 'cursor-not-allowed opacity-60'
                }`}
                style={{ background: oeuvre.stock > 0 ? '#0C0C0C' : '#FFFFFF', color: oeuvre.stock > 0 ? '#FFFFFF' : '#972924', border: '1px solid #972924' , fontFamily: 'Poppins Regular, sans-serif' }}
              >
                Acheter
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Medias section (if available) */}
      {oeuvre.medias && oeuvre.medias.length > 0 && <Medias medias={oeuvre.medias} />}

      {/* Formulaire contact */}
      <motion.div
        id="contact-form"
        className="mt-20 p-10 border max-w-3xl mx-auto mb-12"
        style={{ background: '#000000', borderColor: '#972924' }}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-[1.25rem] md:text-[1.5rem] lg:text-[2rem] mb-6" style={{ color: '#972924', fontFamily: 'Kenyan Coffee, sans-serif'  }}>Formulaire de renseignement</h2>
        <form className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <input
            type="text"
            placeholder="Votre nom"
            className="p-3  focus:outline-none focus:ring-2"
            style={{ border: '1px solid #0C0C0C', color: '#FFFFFF', background: '#505050' }}
            required
          />
          <input
            type="email"
            placeholder="Votre email"
            className="p-3 focus:outline-none focus:ring-2"
            style={{ border: '1px solid #0C0C0C', color: '#FFFFFF', background: '#505050' }}
            required
          />
          <input
            type="tel"
            placeholder="Votre numéro de tel (facultatif)"
            className="p-3  focus:outline-none focus:ring-2"
            style={{ border: '1px solid #0C0C0C', color: '#FFFFFF', background: '#505050' }}
          />
          <textarea
            placeholder="Votre message"
            className="p-3  md:col-span-3 focus:outline-none focus:ring-2"
            rows="5"
            style={{ border: '1px solid #0C0C0C', color: '#FFFFFF', background: '#505050' }}
            required
          />
          <button
            type="submit"
            className="px-6 py-2 font-bold transition md:col-span-3"
            style={{ background: '#972924', color: '#FFFFFF', border: '1px solid #FFFFFF', fontFamily: 'Poppins Regular, sans-serif' }}
          >
            Envoyer ma demande
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default OeuvreDetails;

          