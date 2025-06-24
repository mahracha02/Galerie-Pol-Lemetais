import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExclamationTriangle } from 'react-icons/fa';

const DeleteModal = ({ open, onClose, onConfirm, count = 1, darkMode }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, y: 30, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 30, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className={`relative w-full max-w-md rounded-xl shadow-2xl p-8 ${darkMode ? 'bg-[#18181b] text-white' : 'bg-white text-[#18181b]'}`}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex flex-col items-center text-center">
            <FaExclamationTriangle className={`w-12 h-12 mb-4 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
            <h2 className="text-xl font-bold mb-2">Confirmer la suppression</h2>
            <p className="mb-6 text-base">
              {count === 1
                ? 'Êtes-vous sûr de vouloir supprimer ce élément ? Cette action est irréversible.'
                : `Êtes-vous sûr de vouloir supprimer ${count} éléments ? Cette action est irréversible.`}
            </p>
            <div className="flex gap-4 w-full justify-center">
              <button
                onClick={onClose}
                className={`px-4 py-2 rounded-lg font-medium border ${darkMode ? 'bg-gray-700 text-white border-gray-600 hover:bg-gray-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
              >
                Annuler
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 rounded-lg font-medium bg-red-600 text-white hover:bg-red-700 shadow"
              >
                Supprimer
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default DeleteModal; 