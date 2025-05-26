import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaFilter, FaSort, FaTrash, FaArrowLeft, FaEnvelope, FaPhone, FaUser } from 'react-icons/fa';

const ContactsList = () => {
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

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce contact ?')) {
      try {
        const response = await fetch(`/contacts/api/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Erreur lors de la suppression');
        setContacts(contacts.filter(contact => contact.id !== id));
        setSelectedContacts(selectedContacts.filter(contactId => contactId !== id));
        setSuccessMessage('Contact supprimé avec succès');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        setError('Impossible de supprimer le contact. Veuillez réessayer.');
        console.error(error);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedContacts.length} contacts ?`)) {
      try {
        await Promise.all(selectedContacts.map(id => 
          fetch(`/contacts/api/${id}`, { method: 'DELETE' })
        ));
        setContacts(contacts.filter(contact => !selectedContacts.includes(contact.id)));
        setSelectedContacts([]);
        setSuccessMessage(`${selectedContacts.length} contacts supprimés avec succès`);
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        setError('Impossible de supprimer les contacts. Veuillez réessayer.');
        console.error(error);
      }
    }
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
      const searchLower = searchTerm.toLowerCase();
      return (
        contact.nom.toLowerCase().includes(searchLower) ||
        contact.prenom.toLowerCase().includes(searchLower) ||
        contact.email.toLowerCase().includes(searchLower) ||
        contact.telephone.includes(searchTerm) ||
        contact.message.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      const direction = sortDirection === 'asc' ? 1 : -1;
      if (sortField === 'nom') {
        return direction * a.nom.localeCompare(b.nom);
      }
      if (sortField === 'prenom') {
        return direction * a.prenom.localeCompare(b.prenom);
      }
      if (sortField === 'email') {
        return direction * a.email.localeCompare(b.email);
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
    <div className="p-4 max-w-7xl mx-auto relative">
      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-green-500 text-white px-4 py-2 rounded-md shadow-lg animate-fadeInOut">
            {successMessage}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Contacts</h1>
          <p className="text-base text-gray-500">Gérez les contacts de votre site</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            to="/admin/"
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center text-base"
          >
            <FaArrowLeft className="w-4 h-4 mr-1" />
            Retour
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Rechercher un contact..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
          />
          <FaSearch className="absolute left-2.5 top-2.5 text-gray-400 w-4 h-4" />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-base">
          {error}
        </div>
      )}

      {/* Bulk Actions */}
      {selectedContacts.length > 0 && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between text-base">
          <span className="text-green-800">
            {selectedContacts.length} contact{selectedContacts.length > 1 ? 's' : ''} sélectionné{selectedContacts.length > 1 ? 's' : ''}
          </span>
          <button
            onClick={handleBulkDelete}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 flex items-center text-base"
          >
            <FaTrash className="w-4 h-4 mr-1" />
            Supprimer la sélection
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Contacts Table */}
        <div className={`${selectedContact ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white p-3 rounded-lg shadow animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2">
                        <input
                          type="checkbox"
                          checked={selectedContacts.length === filteredContacts.length}
                          onChange={handleSelectAll}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500 w-4 h-4"
                        />
                      </th>
                      <th 
                        className="px-3 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                        onClick={() => handleSort('date_envoi')}
                      >
                        <div className="flex items-center">
                          Date d'envoi
                          <FaSort className="ml-1 w-4 h-4" />
                        </div>
                      </th>
                      <th 
                        className="px-3 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                        onClick={() => handleSort('nom')}
                      >
                        <div className="flex items-center">
                          Nom
                          <FaSort className="ml-1 w-4 h-4" />
                        </div>
                      </th>
                      <th 
                        className="px-3 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                        onClick={() => handleSort('prenom')}
                      >
                        <div className="flex items-center">
                          Prénom
                          <FaSort className="ml-1 w-4 h-4" />
                        </div>
                      </th>
                      <th 
                        className="px-3 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                        onClick={() => handleSort('email')}
                      >
                        <div className="flex items-center">
                          Email
                          <FaSort className="ml-1 w-4 h-4" />
                        </div>
                      </th>
                      <th className="px-3 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                        Téléphone
                      </th>
                      <th className="px-3 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                        Message
                      </th>
                      <th className="px-3 py-2 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredContacts.map((contact) => (
                      <tr 
                        key={contact.id} 
                        className={`hover:bg-gray-50 transition-colors duration-150 cursor-pointer ${
                          selectedContacts.includes(contact.id) ? 'bg-green-50' : ''
                        } ${selectedContact?.id === contact.id ? 'bg-blue-50' : ''}`}
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
                          <div className="text-sm text-gray-900">
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
                            <div className="flex-shrink-0 h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                              <FaUser className="h-4 w-4 text-green-600" />
                            </div>
                            <div className="ml-2">
                              <div className="text-sm font-medium text-gray-900">{contact.nom}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{contact.prenom}</div>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{contact.email}</div>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{contact.telephone}</div>
                        </td>
                        <td className="px-3 py-2">
                          <div className="text-sm text-gray-500 max-w-xs truncate" title={contact.message}>
                            {contact.message}
                          </div>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleSendEmail(contact.email)}
                              className="text-blue-600 hover:text-blue-900 transition-colors duration-200 flex items-center"
                              title="Envoyer un email"
                            >
                              <FaEnvelope className="w-4 h-4 mr-1" />
                              Email
                            </button>
                            <button
                              onClick={() => handleCall(contact.telephone)}
                              className="text-green-600 hover:text-green-900 transition-colors duration-200 flex items-center"
                              title="Appeler"
                            >
                              <FaPhone className="w-4 h-4 mr-1" />
                              Appeler
                            </button>
                            <button
                              onClick={() => handleDelete(contact.id)}
                              className="text-red-600 hover:text-red-900 transition-colors duration-200 flex items-center"
                            >
                              <FaTrash className="w-4 h-4 mr-1" />
                              Supprimer
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredContacts.length === 0 && (
                      <tr>
                        <td colSpan={8} className="px-3 py-6 text-center">
                          <div className="text-gray-400 flex flex-col items-center">
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
              </div>
            </div>
          )}
        </div>

        {/* Contact Details Card */}
        {selectedContact && (
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 sticky top-4">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-800">Détails du contact</h2>
                <button
                  onClick={handleCloseDetails}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <FaUser className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {selectedContact.prenom} {selectedContact.nom}
                    </h3>
                    <p className="text-sm text-gray-500">
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
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <div className="mt-1 flex items-center">
                      <FaEnvelope className="w-4 h-4 text-gray-400 mr-2" />
                      <a 
                        href={`mailto:${selectedContact.email}`}
                        className="text-base text-blue-600 hover:text-blue-800"
                      >
                        {selectedContact.email}
                      </a>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Téléphone</label>
                    <div className="mt-1 flex items-center">
                      <FaPhone className="w-4 h-4 text-gray-400 mr-2" />
                      <a 
                        href={`tel:${selectedContact.telephone}`}
                        className="text-base text-green-600 hover:text-green-800"
                      >
                        {selectedContact.telephone}
                      </a>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Message</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                      <p className="text-base text-gray-700 whitespace-pre-wrap">
                        {selectedContact.message}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2 pt-4 border-t">
                  <button
                    onClick={() => handleSendEmail(selectedContact.email)}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center justify-center"
                  >
                    <FaEnvelope className="w-4 h-4 mr-2" />
                    Envoyer un email
                  </button>
                  <button
                    onClick={() => handleCall(selectedContact.telephone)}
                    className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 flex items-center justify-center"
                  >
                    <FaPhone className="w-4 h-4 mr-2" />
                    Appeler
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactsList;
