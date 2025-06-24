import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaFilter, FaSort, FaTrash, FaArrowLeft, FaEnvelope, FaPhone, FaUser } from 'react-icons/fa';
import DeleteModal from '../layout/DeleteModal';

const ContactsList = ({ darkMode }) => {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('date_envoi');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [bulkDelete, setBulkDelete] = useState(false);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch('/contacts/api/');
        if (!response.ok) throw new Error('Erreur lors de la récupération');
        const data = await response.json();
        setContacts(data);
      } catch (error) {
        setError('Impossible de charger les contacts. Veuillez réessayer.');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContacts();
  }, []);

  
  const handleDelete = (id) => {
    setDeleteTarget(id);
    setBulkDelete(false);
    setDeleteModalOpen(true);
  };

  const handleBulkDelete = () => {
    setBulkDelete(true);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (bulkDelete) {
      try {
        await Promise.all(selectedContacts.map(id => fetch(`/contacts/api/${id}`, { method: 'DELETE' })));
        setContacts(contacts.filter(contact => !selectedContacts.includes(contact.id)));
        setSelectedContacts([]);
        setSuccessMessage(`${selectedContacts.length} contacts supprimés avec succès`);
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        setError('Impossible de supprimer les contacts. Veuillez réessayer.');
        console.error(error);
      }
    } else if (deleteTarget) {
      try {
        const response = await fetch(`/contacts/api/${deleteTarget}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Erreur lors de la suppression');
        setContacts(contacts.filter(contact => contact.id !== deleteTarget));
        setSelectedContacts(selectedContacts.filter(contactId => contactId !== deleteTarget));
        setSuccessMessage('Contact supprimé avec succès');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        setError('Impossible de supprimer le contact. Veuillez réessayer.');
        console.error(error);
      }
    }
    setDeleteModalOpen(false);
    setDeleteTarget(null);
    setBulkDelete(false);
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setDeleteTarget(null);
    setBulkDelete(false);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredContacts = contacts
    .filter(contact => {
      const searchLower = (searchTerm || '').toLowerCase();
      return (
        (contact.nom?.toLowerCase() || '').includes(searchLower) ||
        (contact.prenom?.toLowerCase() || '').includes(searchLower) ||
        (contact.email?.toLowerCase() || '').includes(searchLower) ||
        ((contact.telephone ?? '').toString().includes(searchTerm)) ||
        (contact.message?.toLowerCase() || '').includes(searchLower)
      );
    })
    .sort((a, b) => {
      const direction = sortDirection === 'asc' ? 1 : -1;
      if (sortField === 'nom') {
        return direction * (a.nom?.localeCompare(b.nom) || 0);
      }
      if (sortField === 'prenom') {
        return direction * (a.prenom?.localeCompare(b.prenom) || 0);
      }
      if (sortField === 'email') {
        return direction * (a.email?.localeCompare(b.email) || 0);
      }
      if (sortField === 'date_envoi') {
        return direction * (new Date(a.date_envoi) - new Date(b.date_envoi));
      }
      return 0;
    });

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedContacts(filteredContacts.map(contact => contact.id));
    } else {
      setSelectedContacts([]);
    }
  };

  const handleSelectContact = (contactId) => {
    setSelectedContacts(prev => 
      prev.includes(contactId) 
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const handleShowDetails = (contact) => {
    setSelectedContact(contact);
  };

  const handleCloseDetails = () => {
    setSelectedContact(null);
  };

  const handleSendEmail = (email) => {
    window.location.href = `mailto:${email}`;
  };

  const handleCall = (telephone) => {
    window.location.href = `tel:${telephone}`;
  };

  return (
    <div className={`min-h-screen w-full flex justify-center items-start ${darkMode ? 'bg-[#18181b] text-white' : 'bg-[#f7f7f7] text-[#18181b]'} p-0`} style={{ fontFamily: 'Poppins, sans-serif' }}>
      <div className="w-[95vw] md:w-[90vw] lg:w-[85vw] xl:w-[80vw]  mx-auto py-8 px-2 md:px-6">
        {/* Success Message */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-4 right-4 z-50"
            >
              <div className="bg-green-500 text-white px-4 py-2 rounded-md shadow-lg animate-fadeInOut">
                {successMessage}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
          <div>
            <h1 className="text-3xl font-bold mb-1" style={{ fontFamily: 'Kenyan Coffee, sans-serif' }}>Contacts</h1>
            <p className={`text-base ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Gérez les contacts de votre site</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/admin/"
              className={`px-3 py-1.5 ${darkMode ? 'bg-[#232326] text-white hover:bg-[#972924]' : 'bg-gray-100 text-gray-700 hover:bg-[#972924] hover:text-white'} rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center text-base`}
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              <FaArrowLeft className="w-4 h-4 mr-1" />
              Retour
            </Link>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Rechercher un contact..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-8 pr-3 py-2 rounded-lg border ${darkMode ? 'border-gray-700 bg-[#232326] text-white' : 'border-gray-200 bg-white text-[#18181b]'} focus:outline-none focus:ring-2 focus:ring-[#972924] focus:border-transparent text-base`}
              style={{ fontFamily: 'Poppins, sans-serif' }}
            />
            <FaSearch className={`absolute left-2.5 top-2.5 w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-4 p-3 rounded-lg text-base ${darkMode ? 'bg-red-900 text-red-200 border border-red-700' : 'bg-red-50 text-red-600 border border-red-200'}`}
          >
            {error}
          </motion.div>
        )}

        {/* Bulk Actions */}
        <AnimatePresence>
          {selectedContacts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mb-4 p-3 rounded-lg flex items-center justify-between text-base ${darkMode ? 'bg-green-900 border border-green-700 text-green-200' : 'bg-green-50 border border-green-200 text-green-800'}`}
            >
              <span>
                {selectedContacts.length} contact{selectedContacts.length > 1 ? 's' : ''} sélectionné{selectedContacts.length > 1 ? 's' : ''}
              </span>
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 flex items-center text-base"
              >
                <FaTrash className="w-4 h-4 mr-1" />
                Supprimer la sélection
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contacts Table */}
          <div className={`${selectedContact ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className={`${darkMode ? 'bg-[#232326]' : 'bg-white'} p-3 rounded-lg shadow animate-pulse`}>
                    <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-200'} h-4 rounded w-1/4 mb-2`}></div>
                    <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-200'} h-4 rounded w-3/4`}></div>
                  </div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${darkMode ? 'bg-[#232326]' : 'bg-white'} rounded-xl shadow-lg overflow-x-auto`}
              >
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className={darkMode ? 'bg-[#18181b]' : 'bg-gray-50'}>
                    <tr>
                      <th className="px-3 py-2">
                        <input
                          type="checkbox"
                          checked={selectedContacts.length === filteredContacts.length}
                          onChange={handleSelectAll}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500 w-4 h-4"
                        />
                      </th>
                      <th className={`px-3 py-2 text-left text-sm font-medium uppercase tracking-wider cursor-pointer ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-[#972924]'}`}
                        onClick={() => handleSort('date_envoi')}
                      >
                        <div className="flex items-center">
                          Date d'envoi
                          <FaSort className="ml-1 w-4 h-4" />
                        </div>
                      </th>
                      <th className={`px-3 py-2 text-left text-sm font-medium uppercase tracking-wider cursor-pointer ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-[#972924]'}`}
                        onClick={() => handleSort('nom')}
                      >
                        <div className="flex items-center">
                          Nom
                          <FaSort className="ml-1 w-4 h-4" />
                        </div>
                      </th>
                      <th className={`px-3 py-2 text-left text-sm font-medium uppercase tracking-wider cursor-pointer ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-[#972924]'}`}
                        onClick={() => handleSort('prenom')}
                      >
                        <div className="flex items-center">
                          Prénom
                          <FaSort className="ml-1 w-4 h-4" />
                        </div>
                      </th>
                      <th className={`px-3 py-2 text-left text-sm font-medium uppercase tracking-wider cursor-pointer ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-[#972924]'}`}
                        onClick={() => handleSort('email')}
                      >
                        <div className="flex items-center">
                          Email
                          <FaSort className="ml-1 w-4 h-4" />
                        </div>
                      </th>
                      <th className={`px-3 py-2 text-left text-sm font-medium uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Téléphone</th>
                      <th className={`px-3 py-2 text-left text-sm font-medium uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Message</th>
                      <th className={`px-3 py-2 text-right text-sm font-medium uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className={darkMode ? 'bg-[#232326] divide-y divide-gray-700' : 'bg-white divide-y divide-gray-200'}>
                    {filteredContacts.map((contact, idx) => (
                      <motion.tr
                        key={contact.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        className={`hover:${darkMode ? 'bg-[#18181b]' : 'bg-gray-50'} transition-colors duration-150 cursor-pointer ${
                          selectedContacts.includes(contact.id) ? (darkMode ? 'bg-green-900' : 'bg-green-50') : ''
                        } ${selectedContact?.id === contact.id ? (darkMode ? 'bg-blue-900' : 'bg-blue-50') : ''}`}
                        onClick={() => handleShowDetails(contact)}
                      >
                        <td className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={selectedContacts.includes(contact.id)}
                            onChange={() => handleSelectContact(contact.id)}
                            className="rounded border-gray-300 text-green-600 focus:ring-green-500 w-4 h-4"
                          />
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <div className="text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            {new Date(contact.createdDate.replace(' ', 'T')).toLocaleDateString('fr-FR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`flex-shrink-0 h-8 w-8 rounded-lg flex items-center justify-center ${darkMode ? 'bg-green-900' : 'bg-green-100'}`}>
                              <FaUser className={`h-4 w-4 ${darkMode ? 'text-green-300' : 'text-green-600'}`} />
                            </div>
                            <div className="ml-2">
                              <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{contact.nom}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <div className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{contact.prenom}</div>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <div className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{contact.email}</div>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <div className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{contact.telephone}</div>
                        </td>
                        <td className="px-3 py-2">
                          <div className={`text-sm max-w-xs truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} title={contact.message}>
                            {contact.message}
                          </div>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleSendEmail(contact.email)}
                              className={`transition-colors duration-200 flex items-center ${darkMode ? 'text-blue-400 hover:text-blue-200' : 'text-blue-600 hover:text-blue-900'}`}
                              title="Envoyer un email"
                            >
                              <FaEnvelope className="w-4 h-4 mr-1" />
                              Email
                            </button>
                            <button
                              onClick={() => handleCall(contact.telephone)}
                              className={`transition-colors duration-200 flex items-center ${darkMode ? 'text-green-400 hover:text-green-200' : 'text-green-600 hover:text-green-900'}`}
                              title="Appeler"
                            >
                              <FaPhone className="w-4 h-4 mr-1" />
                              Appeler
                            </button>
                            <button
                              onClick={() => handleDelete(contact.id)}
                              className={`transition-colors duration-200 flex items-center ${darkMode ? 'text-red-400 hover:text-red-200' : 'text-red-600 hover:text-red-900'}`}
                            >
                              <FaTrash className="w-4 h-4 mr-1" />
                              Supprimer
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                    {filteredContacts.length === 0 && (
                      <tr>
                        <td colSpan={8} className="px-3 py-6 text-center">
                          <div className={`flex flex-col items-center ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} style={{ fontFamily: 'Poppins, sans-serif' }}>
                            <FaUser className="w-8 h-8 mb-2" />
                            <p className="text-base">Aucun contact trouvé</p>
                            <p className="text-sm mt-1">
                              {searchTerm
                                ? 'Essayez de modifier vos critères de recherche'
                                : 'Aucun contact pour le moment'}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </motion.div>
            )}
          </div>

          {/* Contact Details Card */}
          <AnimatePresence>
            {selectedContact && (
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.3 }}
                className={`lg:col-span-1 ${darkMode ? 'bg-[#232326]' : 'bg-white'} rounded-xl shadow-lg p-6 sticky top-4`}
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold mb-1" style={{ fontFamily: 'Kenyan Coffee, sans-serif' }}>Détails du contact</h2>
                  <button
                    onClick={handleCloseDetails}
                    className={`transition-colors ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-[#972924]'}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className={`flex-shrink-0 h-12 w-12 rounded-lg flex items-center justify-center ${darkMode ? 'bg-green-900' : 'bg-green-100'}`}>
                      <FaUser className={`h-6 w-6 ${darkMode ? 'text-green-300' : 'text-green-600'}`} />
                    </div>
                    <div>
                      <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {selectedContact.prenom} {selectedContact.nom}
                      </h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {new Date(selectedContact.createdDate.replace(' ', 'T')).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Email</label>
                      <div className="mt-1 flex items-center">
                        <FaEnvelope className={`w-4 h-4 mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        <a 
                          href={`mailto:${selectedContact.email}`}
                          className={`text-base ${darkMode ? 'text-blue-400 hover:text-blue-200' : 'text-blue-600 hover:text-blue-800'}`}
                        >
                          {selectedContact.email}
                        </a>
                      </div>
                    </div>

                    <div>
                      <label className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Téléphone</label>
                      <div className="mt-1 flex items-center">
                        <FaPhone className={`w-4 h-4 mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        <a 
                          href={`tel:${selectedContact.telephone}`}
                          className={`text-base ${darkMode ? 'text-green-400 hover:text-green-200' : 'text-green-600 hover:text-green-800'}`}
                        >
                          {selectedContact.telephone}
                        </a>
                      </div>
                    </div>

                    <div>
                      <label className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Message</label>
                      <div className={`mt-1 p-3 rounded-lg ${darkMode ? 'bg-[#18181b]' : 'bg-gray-50'}`}>
                        <p className={`text-base ${darkMode ? 'text-white' : 'text-gray-700'} whitespace-pre-wrap`} style={{ fontFamily: 'Poppins, sans-serif' }}>
                          {selectedContact.message}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => handleSendEmail(selectedContact.email)}
                      className={`flex-1 px-4 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center ${darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                    >
                      <FaEnvelope className="w-4 h-4 mr-2" />
                      Envoyer un email
                    </button>
                    <button
                      onClick={() => handleCall(selectedContact.telephone)}
                      className={`flex-1 px-4 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center ${darkMode ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}`}
                    >
                      <FaPhone className="w-4 h-4 mr-2" />
                      Appeler
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {deleteModalOpen && (
        <DeleteModal
          open={deleteModalOpen}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          count={bulkDelete ? selectedContacts.length : 1}
          darkMode={darkMode}
        />
      )}
    </div>
  );
};

export default ContactsList;
