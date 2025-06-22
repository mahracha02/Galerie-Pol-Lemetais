import React from 'react';
import { motion } from 'framer-motion';
import circle from '../../assets/photos/icons/circle.png';

const Boutique = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="flex flex-col items-center justify-center bg-white rounded-xl shadow-lg px-8 py-12 mt-24"
      >
        <img src={circle} alt="circle icon" className="w-10 h-10 mb-4" />
        <h1 className="text-[2.5rem] md:text-[3rem] lg:text-[3.5rem] font-bold uppercase text-[#0C0C0C] mb-4 text-center" style={{ fontFamily: 'Kenyan Coffee, sans-serif', letterSpacing: 1 }}>
          Boutique
        </h1>
        <p className="text-[#972924] text-[1.25rem] md:text-[1.5rem] lg:text-[1.75rem] font-semibold mb-2 text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Restez connectés, la boutique arrive bientôt !
        </p>
        <p className="text-gray-500 text-center max-w-xl mt-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Nous préparons une sélection d'œuvres et de produits exclusifs pour vous.
        </p>
      </motion.div>
    </div>
  );
};

export default Boutique;
