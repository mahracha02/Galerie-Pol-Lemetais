import React from 'react';
import { motion } from 'framer-motion';
import { FaStore } from 'react-icons/fa';

const BoutiqueList = ({ darkMode }) => {
  return (
    <div
      className={`fixed inset-0 min-h-screen min-w-full flex items-center justify-center z-0 ${darkMode ? 'bg-[#18181b] text-white' : 'bg-[#f7f7f7] text-[#18181b]'}`}
      style={{ fontFamily: 'Poppins, sans-serif' }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className={`flex flex-col items-center justify-center p-8 rounded-2xl shadow-lg ${darkMode ? 'bg-[#232326]' : 'bg-white'}`}
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="mb-4"
        >
          <FaStore className="w-16 h-16 text-[#972924]" />
        </motion.div>
        <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Kenyan Coffee, sans-serif' }}>
          La boutique arrive bientôt !
        </h2>
        <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-2 text-center`}>
          Cette section sera disponible prochainement.<br />Restez à l'écoute !
        </p>
      </motion.div>
    </div>
  );
};

export default BoutiqueList;
