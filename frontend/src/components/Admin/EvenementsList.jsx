// src/components/Admin/EvenementsList.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaImage, FaSearch, FaFilter, FaSort, FaTrash, FaArrowLeft, FaPlus, FaEdit, FaCalendarAlt, FaMapMarkerAlt, FaEye, FaEyeSlash } from 'react-icons/fa';
import DeleteModal from '../layout/DeleteModal';

const EvenementsList = ({ darkMode }) => {
  const [evenements, setEvenements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortField, setSortField] = useState('date_debut');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [artistes, setArtistes] = useState([]);
  const [loadingArtistes, setLoadingArtistes] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    id: '',
    titre: '',
    description: '',
    date_debut: '',
    date_fin: '',
    lieu: '',
    image: null,
    site_url: '',
    artiste_principal: '',
    artistes: [],
    published: false
  });

  // Handle image
  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || e.dataTransfer?.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImage(event.target.result);
        setFormData(prev => ({ ...prev, image: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setPreviewImage(null);
  };

  const handleCloseForm = () => {
    setShowFormModal(false);
    resetForm();
  };

  const fetchEvenements = async () => {
    try {
      // Assuming an admin-specific endpoint similar to other entities
      const response = await fetch('/evenements/admin/api/');
      if (!response.ok) throw new Error('Erreur lors de la récupération');
      const data = await response.json();
      setEvenements(data);
    } catch (error) {
      setError('Impossible de charger les événements. Veuillez réessayer.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchArtistes = async () => {
    try {
      const response = await fetch('/artistes/api');
      if (!response.ok) throw new Error('Erreur lors de la récupération des artistes');
      const data = await response.json();
      setArtistes(data);
    } catch (error) {
      console.error('Erreur lors du chargement des artistes:', error);
      setError('Impossible de charger la liste des artistes');
    } finally {
      setLoadingArtistes(false);
    }
  };

  useEffect(() => {
    fetchEvenements();
    fetchArtistes();
  }, []);

  const handleDelete = (id) => {
    setDeleteTarget(id);
    setDeleteModalOpen(true);
  };

  const handleBulkDelete = () => {
    setDeleteTarget([...selectedEvents]);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (Array.isArray(deleteTarget)) {
      setIsSubmitting(true);
      try {
        await Promise.all(deleteTarget.map(id =>
          fetch(`/evenements/admin/api/${id}`, { method: 'DELETE' })
        ));
        setEvenements(evenements.filter(event => !deleteTarget.includes(event.id)));
        setSelectedEvents([]);
        setSuccessMessage(`${deleteTarget.length} événements supprimés avec succès!`);
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        setError('Erreur lors de la suppression des événements');
        setTimeout(() => setError(''), 5000);
      } finally {
        setIsSubmitting(false);
        setDeleteModalOpen(false);
        setDeleteTarget(null);
      }
    } else if (deleteTarget) {
      setIsSubmitting(true);
      try {
        const response = await fetch(`/evenements/admin/api/${deleteTarget}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Erreur lors de la suppression');
        setEvenements(evenements.filter(event => event.id !== deleteTarget));
        setSelectedEvents(selectedEvents.filter(eventId => eventId !== deleteTarget));
        setSuccessMessage('Événement supprimé avec succès!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        setError('Impossible de supprimer l\'événement. Veuillez réessayer.');
        setTimeout(() => setError(''), 5000);
      } finally {
        setIsSubmitting(false);
        setDeleteModalOpen(false);
        setDeleteTarget(null);
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

  const handleTogglePublish = async (event) => {
    try {
      const response = await fetch(`/evenements/admin/api/${event.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          ...event,
          date_debut: formatDateForInput(event.date_debut),
          date_fin: formatDateForInput(event.date_fin),
          artiste_principal: event.artiste_principal?.id || null,
          artistes: event.artistes?.map(a => a.id) || [],
          published: !event.published
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      setEvenements(prev => prev.map(e =>
        e.id === event.id ? { ...e, published: !e.published } : e
      ));

      setSuccessMessage(`Événement ${!event.published ? 'publié' : 'dépublié'} avec succès!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error toggling publish status:', error);
      setError(error.message || 'Erreur lors du changement de statut');
      setTimeout(() => setError(''), 5000);
    }
  };

  const getEventStatus = (dateDebutStr, dateFinStr) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const debut = new Date(formatDateForInput(dateDebutStr));
    const fin = new Date(formatDateForInput(dateFinStr));

    if (isNaN(debut.getTime()) || isNaN(fin.getTime())) return 'date invalide';
    if (now < debut) return 'upcoming';
    if (now > fin) return 'past';
    return 'ongoing';
  };

  const filteredEvents = evenements
    .filter(event => {
      const searchTermLower = searchTerm.toLowerCase();
      const artistePrincipal = event.artiste_principal?.nom || '';
      const description = event.description || '';

      const matchesSearch = event.titre.toLowerCase().includes(searchTermLower) ||
        artistePrincipal.toLowerCase().includes(searchTermLower) ||
        description.toLowerCase().includes(searchTermLower);

      const matchesDate = dateFilter === 'all' || getEventStatus(event.date_debut, event.date_fin) === dateFilter;

      return matchesSearch && matchesDate;
    })
    .sort((a, b) => {
      const direction = sortDirection === 'asc' ? 1 : -1;
      if (sortField === 'titre') return direction * a.titre.localeCompare(b.titre);
      if (sortField === 'date_debut') return direction * (new Date(a.date_debut) - new Date(b.date_debut));
      if (sortField === 'lieu') return direction * (a.lieu || '').localeCompare(b.lieu || '');
      return 0;
    });

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedEvents(filteredEvents.map(event => event.id));
    } else {
      setSelectedEvents([]);
    }
  };

  const handleSelectEvent = (eventId) => {
    setSelectedEvents(prev =>
      prev.includes(eventId) ? prev.filter(id => id !== eventId) : [...prev, eventId]
    );
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'artistes') {
        const artisteId = parseInt(value);
        setFormData(prev => ({
            ...prev,
            artistes: checked 
                ? [...prev.artistes, artistes.find(a => a.id === artisteId)]
                : prev.artistes.filter(a => a.id !== artisteId)
        }));
    } else {
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      titre: '',
      description: '',
      date_debut: '',
      date_fin: '',
      lieu: '',
      image: null,
      site_url: '',
      artiste_principal: '',
      artistes: [],
      published: false
    });
    setPreviewImage(null);
  };

  const handleAddClick = () => {
    resetForm();
    setModalMode('add');
    setShowFormModal(true);
  };

  const handleEditClick = (event) => {
    setFormData({
      id: event.id,
      titre: event.titre,
      description: event.description,
      date_debut: formatDateForInput(event.date_debut),
      date_fin: formatDateForInput(event.date_fin),
      lieu: event.lieu,
      image: event.image,
      site_url: event.site_url,
      artiste_principal: event.artiste_principal?.id || '',
      artistes: event.artistes || [],
      published: event.published || false
    });

    if (event.image) {
      setPreviewImage(event.image);
    } else {
      setPreviewImage(null);
    }
    setModalMode('edit');
    setShowFormModal(true);
  };

  const formatDateForInput = (dateStr) => {
    if (!dateStr) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];

    const mois = {
      janvier: '01', février: '02', mars: '03', avril: '04', mai: '05', juin: '06',
      juillet: '07', août: '08', septembre: '09', octobre: '10', novembre: '11', décembre: '12'
    };
    const parts = dateStr.toLowerCase().split(' ');
    if (parts.length === 3 && mois[parts[1]]) {
        return `${parts[2]}-${mois[parts[1]]}-${parts[0].padStart(2, '0')}`;
    }
    return '';
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    let imageData = '';
    if (formData.image && formData.image instanceof File) {
      imageData = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(formData.image);
      });
    } else if (previewImage) {
      imageData = previewImage;
    }

    const eventData = {
      ...formData,
      image: imageData,
      artiste_principal: formData.artiste_principal,
      artistes: formData.artistes.map(a => a.id),
    };

    try {
      const url = modalMode === 'add' ? '/evenements/admin/api/' : `/evenements/admin/api/${formData.id}`;
      const method = modalMode === 'add' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.details || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      setShowFormModal(false);
      setPreviewImage(null);
      fetchEvenements();
      
      setSuccessMessage(`Événement ${modalMode === 'add' ? 'ajouté' : 'modifié'} avec succès!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving event:', error);
      setError(error.message || 'Une erreur est survenue lors de la soumission du formulaire');
      setTimeout(() => setError(''), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen w-full flex justify-center items-start ${darkMode ? 'bg-[#18181b] text-white' : 'bg-[#f7f7f7] text-[#18181b]'} p-0`} style={{ fontFamily: 'Poppins, sans-serif' }}>
      <div className="w-[95vw] md:w-[90vw] lg:w-[85vw] xl:w-[80vw] mx-auto py-8 px-2 md:px-6">
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-4 right-4 z-50"
            >
              <div className="bg-green-500 text-white px-4 py-2 rounded-md shadow-lg">
                {successMessage}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1" style={{ fontFamily: 'Kenyan Coffee, sans-serif' }}>Événements</h1>
            <p className={`text-base ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Gérez les événements de votre site</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/admin/"
              className={`px-3 py-1.5 ${darkMode ? 'bg-[#232326] text-white hover:bg-[#972924]' : 'bg-gray-100 text-gray-700 hover:bg-[#972924] hover:text-white'} rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center text-base`}
            >
              <FaArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Link>
            <button
              onClick={handleAddClick}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center"
            >
              <FaPlus className="w-4 h-4 mr-2" />
              Nouvel événement
            </button>
          </div>
        </div>

        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Rechercher un événement..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${darkMode ? 'border-gray-700 bg-[#232326] text-white' : 'border-gray-200 bg-white text-[#18181b]'} focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
              />
              <FaSearch className={`absolute left-3 top-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 border rounded-lg transition-colors duration-200 flex items-center ${darkMode ? 'bg-[#232326] border-gray-700 hover:bg-gray-700' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
            >
              <FaFilter className="w-4 h-4 mr-2" />
              Filtres
            </button>
          </div>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg shadow-sm border mt-4 ${darkMode ? 'bg-[#232326] border-gray-700' : 'bg-white border-gray-200'}`}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Statut</label>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className={`w-full rounded-lg border ${darkMode ? 'bg-[#18181b] border-gray-600' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="upcoming">À venir</option>
                    <option value="ongoing">En cours</option>
                    <option value="past">Passés</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-lg ${darkMode ? 'bg-red-900 text-red-200 border border-red-700' : 'bg-red-50 text-red-600 border border-red-200'}`}
          >
            {error}
          </motion.div>
        )}

        <AnimatePresence>
          {selectedEvents.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mb-6 p-4 rounded-lg flex items-center justify-between ${darkMode ? 'bg-green-900 border border-green-700 text-green-200' : 'bg-green-50 border border-green-200 text-green-800'}`}
            >
              <span className="font-medium">
                {selectedEvents.length} événement{selectedEvents.length > 1 ? 's' : ''} sélectionné{selectedEvents.length > 1 ? 's' : ''}
              </span>
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 flex items-center"
              >
                <FaTrash className="w-4 h-4 mr-2" />
                Supprimer la sélection
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={`${darkMode ? 'bg-[#232326]' : 'bg-white'} rounded-xl shadow-lg overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className={darkMode ? 'bg-[#18181b]' : 'bg-gray-50'}>
                <tr>
                  <th className="px-6 py-4">
                    <input type="checkbox" onChange={handleSelectAll} checked={filteredEvents.length > 0 && selectedEvents.length === filteredEvents.length} className={`rounded border-gray-300 text-green-600 focus:ring-green-500 ${darkMode ? 'bg-gray-800 border-gray-600' : ''}`} />
                  </th>
                  <th onClick={() => handleSort('titre')} className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}>Titre</th>
                  <th onClick={() => handleSort('lieu')} className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}>Lieu</th>
                  <th onClick={() => handleSort('date_debut')} className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}>Dates</th>
                  <th className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Artiste Principal</th>
                  <th className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Statut</th>
                  <th className={`px-6 py-4 text-right text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Actions</th>
                </tr>
              </thead>
              <tbody className={darkMode ? 'bg-[#232326] divide-y divide-gray-700' : 'bg-white divide-y divide-gray-200'}>
                {isLoading ? ([...Array(5)].map((_, i) => (
                  <tr key={i}><td colSpan="7" className="p-4"><div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-200'} h-12 rounded animate-pulse`}></div></td></tr>
                ))) : filteredEvents.length === 0 ? (
                  <tr><td colSpan="7" className="px-6 py-12 text-center"><div className={`${darkMode ? 'text-gray-500' : 'text-gray-400'} flex flex-col items-center`}><FaImage className="w-12 h-12 mb-4" /><p className="text-lg">Aucun événement trouvé</p></div></td></tr>
                ) : (filteredEvents.map((event, idx) => (
                  <motion.tr key={event.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }} className={`hover:${darkMode ? 'bg-[#18181b]' : 'bg-gray-50'} transition-colors duration-150 ${selectedEvents.includes(event.id) ? (darkMode ? 'bg-green-900' : 'bg-green-50') : ''}`}>
                    <td className="px-6 py-4"><input type="checkbox" checked={selectedEvents.includes(event.id)} onChange={() => handleSelectEvent(event.id)} className={`rounded border-gray-300 text-green-600 focus:ring-green-500 ${darkMode ? 'bg-gray-800 border-gray-600' : ''}`} /></td>
                    <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center">
                      <div className="h-12 w-12 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
                        {event.image ? <img src={event.image} alt={event.titre} className="h-full w-full object-cover" /> : <div className="h-full w-full flex items-center justify-center"><FaCalendarAlt className='text-gray-400'/></div>}
                      </div>
                      <div className="ml-4"><div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{event.titre}</div></div>
                    </div></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{event.lieu}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{formatDateForInput(event.date_debut)} au {formatDateForInput(event.date_fin)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{event.artiste_principal?.nom || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap"><button onClick={() => handleTogglePublish(event)} className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300 hover:scale-110 ${event.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`} title={event.published ? 'Cliquer pour dépublier' : 'Cliquer pour publier'}>
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="flex items-center">{event.published ? <FaEye className="w-3 h-3 mr-1" /> : <FaEyeSlash className="w-3 h-3 mr-1" />}{event.published ? 'Publié' : 'Non publié'}</motion.div>
                    </button></td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"><div className="flex justify-end space-x-3">
                      <button onClick={() => handleEditClick(event)} className={`transition-colors duration-200 flex items-center ${darkMode ? 'text-green-400 hover:text-green-200' : 'text-green-600 hover:text-green-900'}`}><FaEdit className="w-4 h-4 mr-1" />Éditer</button>
                      <button onClick={() => handleDelete(event.id)} className={`transition-colors duration-200 flex items-center ${darkMode ? 'text-red-400 hover:text-red-200' : 'text-red-600 hover:text-red-900'}`}><FaTrash className="w-4 h-4 mr-1" />Supprimer</button>
                    </div></td>
                  </motion.tr>
                )))}
              </tbody>
            </table>
          </div>
        </div>

        <AnimatePresence>
          {showFormModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center"
              onClick={handleCloseForm}
            >
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className={`relative rounded-xl shadow-2xl w-full max-w-2xl ${darkMode ? 'bg-[#18181b]' : 'bg-white'}`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className={`p-6 rounded-t-xl ${darkMode ? 'bg-[#0C0C0C]' : 'bg-gray-50'} border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <h3 className="text-xl font-bold" style={{ fontFamily: 'Kenyan Coffee, sans-serif' }}>{modalMode === 'add' ? 'Ajouter un événement' : 'Modifier un événement'}</h3>
                </div>
                <form onSubmit={handleFormSubmit}>
                  <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                    <div><label htmlFor="titre" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Titre *</label><input type="text" id="titre" name="titre" value={formData.titre} onChange={handleInputChange} className={`mt-1 block w-full rounded-lg shadow-sm sm:text-sm p-3 border ${darkMode ? 'bg-[#0C0C0C] border-gray-700 text-white focus:border-[#972924] focus:ring-[#972924]' : 'border-gray-300 bg-white text-black focus:border-[#972924] focus:ring-[#972924]'}`} required /></div>
                    <div><label htmlFor="description" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Description *</label><textarea id="description" name="description" value={formData.description} onChange={handleInputChange} className={`mt-1 block w-full rounded-lg shadow-sm sm:text-sm p-3 border h-24 ${darkMode ? 'bg-[#0C0C0C] border-gray-700 text-white focus:border-[#972924] focus:ring-[#972924]' : 'border-gray-300 bg-white text-black focus:border-[#972924] focus:ring-[#972924]'}`} required /></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label htmlFor="date_debut" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Date de début *</label><input type="date" id="date_debut" name="date_debut" value={formData.date_debut} onChange={handleInputChange} className={`mt-1 block w-full rounded-lg shadow-sm sm:text-sm p-3 border ${darkMode ? 'bg-[#0C0C0C] border-gray-700 text-white focus:border-[#972924] focus:ring-[#972924]' : 'border-gray-300 bg-white text-black focus:border-[#972924] focus:ring-[#972924]'}`} required /></div>
                        <div><label htmlFor="date_fin" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Date de fin *</label><input type="date" id="date_fin" name="date_fin" value={formData.date_fin} onChange={handleInputChange} className={`mt-1 block w-full rounded-lg shadow-sm sm:text-sm p-3 border ${darkMode ? 'bg-[#0C0C0C] border-gray-700 text-white focus:border-[#972924] focus:ring-[#972924]' : 'border-gray-300 bg-white text-black focus:border-[#972924] focus:ring-[#972924]'}`} required /></div>
                    </div>
                    <div><label htmlFor="lieu" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Lieu *</label><input type="text" id="lieu" name="lieu" value={formData.lieu} onChange={handleInputChange} className={`mt-1 block w-full rounded-lg shadow-sm sm:text-sm p-3 border ${darkMode ? 'bg-[#0C0C0C] border-gray-700 text-white focus:border-[#972924] focus:ring-[#972924]' : 'border-gray-300 bg-white text-black focus:border-[#972924] focus:ring-[#972924]'}`} required /></div>
                    <div><label htmlFor="site_url" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>URL du site</label><input type="text" id="site_url" name="site_url" value={formData.site_url} onChange={handleInputChange} placeholder="https://example.com" className={`mt-1 block w-full rounded-lg shadow-sm sm:text-sm p-3 border ${darkMode ? 'bg-[#0C0C0C] border-gray-700 text-white focus:border-[#972924] focus:ring-[#972924]' : 'border-gray-300 bg-white text-black focus:border-[#972924] focus:ring-[#972924]'}`} /></div>
                    
                    <div>
                        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Image</label>
                        <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${darkMode ? 'border-gray-600' : 'border-gray-300'} border-dashed rounded-md`} onDrop={handleDrop} onDragOver={handleDragOver}>
                            <div className="space-y-1 text-center">
                                <FaImage className={`mx-auto h-12 w-12 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                                <div className="flex text-sm text-gray-600"><label htmlFor="image" className={`relative cursor-pointer rounded-md font-medium ${darkMode ? 'text-[#972924] hover:text-[#b33c36]' : 'text-[#972924] hover:text-[#b33c36]'} focus-within:outline-none`}><input id="image" name="image" type="file" className="sr-only" onChange={handleFileChange} accept="image/png, image/jpeg" /><span>Télécharger un fichier</span></label><p className="pl-1">ou glisser-déposer</p></div>
                            </div>
                        </div>
                        {previewImage && (<div className="mt-4 relative group"><img src={previewImage} alt="Aperçu" className="max-h-40 rounded-lg shadow-lg object-contain" /><button type="button" onClick={handleRemoveImage} className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100"><FaTrash className="w-4 h-4" /></button></div>)}
                    </div>
                    
                    <div>
                      <label htmlFor="artiste_principal" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Artiste Principal </label>
                      <select id="artiste_principal" name="artiste_principal" value={formData.artiste_principal} onChange={handleInputChange} 
                        className={`mt-1 block w-full rounded-lg shadow-sm sm:text-sm p-3 border 
                        ${darkMode ? 'bg-[#0C0C0C] border-gray-700 text-white focus:border-[#972924] focus:ring-[#972924]' : 'border-gray-300 bg-white text-black focus:border-[#972924] focus:ring-[#972924]'}`} >
                          <option value="">Sélectionner un artiste</option>
                          {artistes.map(a => <option key={a.id} value={a.id}>{a.nom}</option>)}
                      </select>
                    </div>

                    <div>
                        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Artistes Associés</label>
                        <div className={`max-h-32 overflow-y-auto p-2 border rounded-lg ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                            {artistes.filter(a => a.id != formData.artiste_principal).map(artiste => (
                                <div key={artiste.id} className="flex items-center"><input id={`artiste-${artiste.id}`} name="artistes" type="checkbox" value={artiste.id} checked={formData.artistes.some(a => a.id === artiste.id)} onChange={handleInputChange} className="h-4 w-4 rounded" /><label htmlFor={`artiste-${artiste.id}`} className="ml-2 text-sm">{artiste.nom}</label></div>
                            ))}
                        </div>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Status</label>
                      <select id="published" name="published" value={formData.published} onChange={handleInputChange} 
                        className={`mt-1 block w-full rounded-lg shadow-sm sm:text-sm p-3 border 
                        ${darkMode ? 'bg-[#0C0C0C] border-gray-700 text-white focus:border-[#972924] focus:ring-[#972924]' : 'border-gray-300 bg-white text-black focus:border-[#972924] focus:ring-[#972924]'}`} required>
                          <option value={true}>Publié</option>
                          <option value={false}>Non publié</option>
                      </select>
                    </div>
                  </div>
                  <div className={`px-6 py-4 flex justify-end space-x-3 rounded-b-xl ${darkMode ? 'bg-[#0C0C0C] border-t border-gray-700' : 'bg-gray-50 border-t border-gray-200'}`}>
                    <button type="button" onClick={handleCloseForm} disabled={isSubmitting} className={`px-4 py-2 text-sm font-medium rounded-md shadow-sm ${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'}`}>Annuler</button>
                    <button type="submit" disabled={isSubmitting} className={`px-4 py-2 text-sm font-medium text-white rounded-md shadow-sm bg-[#972924] hover:bg-[#b33c36] flex items-center`}>{isSubmitting ? 'Sauvegarde...' : 'Sauvegarder'}</button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <DeleteModal
          open={deleteModalOpen}
          onClose={() => { setDeleteModalOpen(false); setDeleteTarget(null); }}
          onConfirm={confirmDelete}
          count={Array.isArray(deleteTarget) ? deleteTarget.length : 1}
          darkMode={darkMode}
        />
      </div>
    </div>
  );
};

export default EvenementsList;