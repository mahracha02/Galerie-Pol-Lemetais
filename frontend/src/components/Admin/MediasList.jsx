import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaFilter, FaSort, FaTrash, FaArrowLeft, FaPlus, FaEdit, FaImage, FaEye, FaEyeSlash, FaGripVertical, FaLink, FaExclamationTriangle } from 'react-icons/fa';
import DeleteModal from '../layout/DeleteModal';

const MediasList = ({ darkMode }) => {
  const [medias, setMedias] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('titre');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedMedias, setSelectedMedias] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [expositions, setExpositions] = useState([]);
  const [evenements, setEvenements] = useState([]);
  const [artistes, setArtistes] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    id: '',
    titre: '',
    image: null,
    link_url: '',
    exposition_id: '',
    evenement_id: '',
    artiste_id: '',
    published: false
  });

  useEffect(() => {
    fetchMedias();
    fetchExpositions();
    fetchEvenements();
    fetchArtistes();
  }, []);

  const fetchMedias = async () => {
    try {
      const response = await fetch('/medias/admin/api');
      if (!response.ok) throw new Error('Erreur lors de la récupération');
      const data = await response.json();
      setMedias(data);
    } catch (error) {
      setError('Impossible de charger les médias. Veuillez réessayer.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchExpositions = async () => {
    try {
      const response = await fetch('/expositions/admin/api');
      if (!response.ok) throw new Error('Erreur lors de la récupération des expositions');
      const data = await response.json();
      setExpositions(data);
    } catch (error) {
      setError('Impossible de charger la liste des expositions');
      console.error(error);
    }
  };

  const fetchEvenements = async () => {
    try {
      const response = await fetch('/evenements/admin/api');
      if (!response.ok) throw new Error('Erreur lors de la récupération des événements');
      const data = await response.json();
      setEvenements(data);
    } catch (error) {
      setError('Impossible de charger la liste des événements');
      console.error(error);
    }
  };

  const fetchArtistes = async () => {
    try {
      const response = await fetch('/artistes/admin/api');
      if (!response.ok) throw new Error('Erreur lors de la récupération des artistes');
      const data = await response.json();
      setArtistes(data);
    } catch (error) {
      setError('Impossible de charger la liste des artistes');
      console.error(error);
    }
  };

  const handleDelete = (id) => {
    setDeleteTarget(id);
    setDeleteModalOpen(true);
  };

  const handleBulkDelete = () => {
    setDeleteTarget([...selectedMedias]);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (Array.isArray(deleteTarget)) {
      setIsSubmitting(true);
      try {
        await Promise.all(deleteTarget.map(id =>
          fetch(`/medias/admin/api/${id}`, { method: 'DELETE' })
        ));
        setMedias(medias.filter(media => !deleteTarget.includes(media.id)));
        setSelectedMedias([]);
        setSuccessMessage(`${deleteTarget.length} médias supprimés avec succès!`);
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        setError('Erreur lors de la suppression des médias');
        setTimeout(() => setError(''), 5000);
      } finally {
        setIsSubmitting(false);
        setDeleteModalOpen(false);
        setDeleteTarget(null);
      }
    } else if (deleteTarget) {
      setIsSubmitting(true);
      try {
        const response = await fetch(`/medias/admin/api/${deleteTarget}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Erreur lors de la suppression');
        setMedias(medias.filter(media => media.id !== deleteTarget));
        setSelectedMedias(selectedMedias.filter(mediaId => mediaId !== deleteTarget));
        setSuccessMessage('Média supprimé avec succès!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        setError('Impossible de supprimer le média. Veuillez réessayer.');
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

  const handleTogglePublish = async (media) => {
    try {
      const response = await fetch(`/medias/admin/api/${media.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ published: !media.published }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      setMedias(prev => prev.map(m =>
        m.id === media.id ? { ...m, published: !m.published } : m
      ));
      setSuccessMessage(`Média ${!media.published ? 'publié' : 'dépublié'} avec succès!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setError(error.message || 'Erreur lors du changement de statut');
      setTimeout(() => setError(''), 5000);
    }
  };

  const filteredMedias = medias
    .filter(media => {
      const matchesSearch = media.titre.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' ||
        (statusFilter === 'published' && media.published) ||
        (statusFilter === 'unpublished' && !media.published);
      let matchesType = true;
      if (typeFilter === 'exposition') matchesType = !!media.exposition_id;
      else if (typeFilter === 'evenement') matchesType = !!media.evenement_id;
      else if (typeFilter === 'artiste') matchesType = !!media.artiste_id;
      return matchesSearch && matchesStatus && matchesType;
    })
    .sort((a, b) => {
      const direction = sortDirection === 'asc' ? 1 : -1;
      if (sortField === 'titre') return direction * a.titre.localeCompare(b.titre);
      return 0;
    });

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedMedias(filteredMedias.map(media => media.id));
    } else {
      setSelectedMedias([]);
    }
  };

  const handleSelectMedia = (mediaId) => {
    setSelectedMedias(prev =>
      prev.includes(mediaId) ? prev.filter(id => id !== mediaId) : [...prev, mediaId]
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'published' ? value === 'true' : value,
    }));
  };

  const resetForm = () => {
    setFormData({
      id: '',
      titre: '',
      image: null,
      link_url: '',
      exposition_id: '',
      evenement_id: '',
      artiste_id: '',
      published: false
    });
    setPreviewImage(null);
  };

  const handleAddClick = () => {
    resetForm();
    setSelectedType('');
    setModalMode('add');
    setShowFormModal(true);
  };

  const handleEditClick = (media) => {
    let type = '';
    if (media.exposition_id) type = 'exposition';
    else if (media.evenement_id) type = 'evenement';
    else if (media.artiste_id) type = 'artiste';
    setFormData({
      id: media.id,
      titre: media.titre,
      image: media.image,
      link_url: media.link_url,
      exposition_id: media.exposition_id || '',
      evenement_id: media.evenement_id || '',
      artiste_id: media.artiste_id || '',
      published: media.published || false
    });
    setSelectedType(type);
    setPreviewImage(media.image || null);
    setModalMode('edit');
    setShowFormModal(true);
  };

  const handleTypeChange = (type) => {
    setSelectedType(type);
    setFormData(prev => ({
      ...prev,
      exposition_id: type === 'exposition' ? prev.exposition_id : '',
      evenement_id: type === 'evenement' ? prev.evenement_id : '',
      artiste_id: type === 'artiste' ? prev.artiste_id : '',
    }));
  };

  // Handle image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setPreviewImage(null);
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
    } else if (previewImage && previewImage.startsWith('data:image')) {
      imageData = previewImage;
    } else {
      imageData = '';
    }
    const mediaData = {
      ...formData,
      image: imageData,
      exposition_id: selectedType === 'exposition' ? formData.exposition_id : '',
      evenement_id: selectedType === 'evenement' ? formData.evenement_id : '',
      artiste_id: selectedType === 'artiste' ? formData.artiste_id : '',
      published: formData.published,
    };
    try {
      const url = modalMode === 'add' ? '/medias/admin/api' : `/medias/admin/api/${formData.id}`;
      const method = modalMode === 'add' ? 'POST' : 'PUT';
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(mediaData),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.details || `HTTP ${response.status}: ${response.statusText}`);
      }
      setShowFormModal(false);
      setPreviewImage(null);
      fetchMedias();
      setSuccessMessage(`Média ${modalMode === 'add' ? 'ajouté' : 'modifié'} avec succès!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setError(error.message || 'Une erreur est survenue lors de la soumission du formulaire');
      setTimeout(() => setError(''), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen w-full flex justify-center items-start ${darkMode ? 'bg-[#18181b] text-white' : 'bg-[#f7f7f7] text-[#18181b]'} p-0`} style={{ fontFamily: 'Poppins, sans-serif' }}>
      <div className="w-[95vw] md:w-[90vw] lg:w-[85vw] xl:w-[80vw] mx-auto py-8 px-2 md:px-6">
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
        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-lg ${darkMode ? 'bg-red-900 text-red-200 border border-red-700' : 'bg-red-50 text-red-600 border border-red-200'}`}
          >
            {error}
          </motion.div>
        )}
        {/* Page header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1" style={{ fontFamily: 'Kenyan Coffee, sans-serif' }}>Médias</h1>
            <p className={`text-base ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Gérez les médias de votre site</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleAddClick}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center"
            >
              <FaPlus className="w-4 h-4 mr-2" />
              Nouveau média
            </button>
          </div>
        </div>
        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Rechercher un média..."
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
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Statut de publication</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className={`w-full rounded-lg border ${darkMode ? 'bg-[#18181b] border-gray-600' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="published">Publiés</option>
                    <option value="unpublished">Non publiés</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Type</label>
                  <select
                    value={typeFilter}
                    onChange={e => setTypeFilter(e.target.value)}
                    className={`w-full rounded-lg border ${darkMode ? 'bg-[#18181b] border-gray-600' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                  >
                    <option value="all">Tous les types</option>
                    <option value="exposition">Exposition</option>
                    <option value="evenement">Événement</option>
                    <option value="artiste">Artiste</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </div>
        {/* Bulk Actions */}
        <AnimatePresence>
          {selectedMedias.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mb-6 p-4 rounded-lg flex items-center justify-between ${darkMode ? 'bg-green-900 border border-green-700 text-green-200' : 'bg-green-50 border border-green-200 text-green-800'}`}
            >
              <span className="font-medium">
                {selectedMedias.length} média{selectedMedias.length > 1 ? 's' : ''} sélectionné{selectedMedias.length > 1 ? 's' : ''}
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
        {/* Medias Table */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white p-4 rounded-lg shadow animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`bg-white ${darkMode ? 'dark:bg-[#232326] dark:text-white' : ''} rounded-xl shadow-md overflow-hidden`}>
            <div className="overflow-x-auto">
              <table className={`min-w-full divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}> 
                <thead className={darkMode ? 'bg-[#18181b]' : 'bg-gray-50'}>
                  <tr>
                    <th className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedMedias.length === filteredMedias.length}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700" onClick={() => handleSort('titre')}>
                      <div className="flex items-center">Titre <FaSort className="ml-2 w-3 h-3" /></div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lien</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre lié</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className={darkMode ? 'bg-[#232326] divide-y divide-gray-700' : 'bg-white divide-y divide-gray-200'}>
                  {filteredMedias.map((media) => {
                    let type = '';
                    let titreLie = '';
                    if (media.exposition_id) {
                      type = 'Exposition';
                      titreLie = expositions.find(e => e.id === media.exposition_id)?.titre || '';
                    } else if (media.evenement_id) {
                      type = 'Événement';
                      titreLie = evenements.find(e => e.id === media.evenement_id)?.titre || '';
                    } else if (media.artiste_id) {
                      type = 'Artiste';
                      titreLie = artistes.find(a => a.id === media.artiste_id)?.nom || '';
                    }
                    return (
                      <tr key={media.id} className={`transition-colors duration-150 ${selectedMedias.includes(media.id) ? (darkMode ? 'bg-green-900' : 'bg-green-50') : ''} ${darkMode ? 'hover:bg-[#18181b]' : 'hover:bg-gray-50'}`}> 
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedMedias.includes(media.id)}
                            onChange={() => handleSelectMedia(media.id)}
                            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                              <FaImage className="h-5 w-5 text-green-600" />
                            </div>
                            <div className="ml-4">
                              <div className={`text-sm font-medium text-gray-900 ${darkMode ? 'text-white' : ''}`}>{media.titre}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {media.image ? (
                            <img src={media.image} alt={media.titre} className="h-10 w-10 rounded object-cover" />
                          ) : (
                            <div className="h-10 w-10 rounded bg-gray-200 flex items-center justify-center">
                              <FaImage className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {media.link_url ? (
                            <a href={media.link_url} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-500 hover:underline"><FaLink className="mr-1" />Lien</a>
                          ) : (
                            <span className="text-gray-400 text-sm">Aucun</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {type && (
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-bold
                                ${type === 'Exposition' ? (darkMode ? 'bg-blue-800 text-blue-200' : 'bg-blue-100 text-blue-800') : ''}
                                ${type === 'Événement' ? (darkMode ? 'bg-yellow-700 text-yellow-100' : 'bg-yellow-100 text-yellow-800') : ''}
                                ${type === 'Artiste' ? (darkMode ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-800') : ''}
                                shadow-sm transition-all duration-200`}
                            >
                              {type}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{titreLie}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button 
                              onClick={() => handleTogglePublish(media)} 
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300 hover:scale-110 ${media.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`} 
                              title={media.published ? 'Cliquer pour dépublier' : 'Cliquer pour publier'}>
                            <motion.div 
                              whileHover={{ scale: 1.1 }} 
                              whileTap={{ scale: 0.9 }} 
                              className="flex items-center">
                                {media.published ? (
                                  <FaEye className="w-3 h-3 mr-1" />
                                ) : (
                                  <FaEyeSlash className="w-3 h-3 mr-1" />
                                )}
                                {media.published ? 'Publié' : 'Non publié'}
                            </motion.div>
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-3">
                            <button
                              onClick={() => handleEditClick(media)}
                              className="text-green-600 hover:text-green-900 transition-colors duration-200 flex items-center"
                            >
                              <FaEdit className="w-4 h-4 mr-1" />
                              Éditer
                            </button>
                            <button
                              onClick={() => handleDelete(media.id)}
                              className="text-red-600 hover:text-red-900 transition-colors duration-200 flex items-center"
                            >
                              <FaTrash className="w-4 h-4 mr-1" />
                              Supprimer
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredMedias.length === 0 && (
                    <tr>
                      <td colSpan={9} className="px-6 py-12 text-center">
                        <div className="text-gray-400 flex flex-col items-center">
                          <FaImage className="w-12 h-12 mb-4" />
                          <p className="text-lg">Aucun média trouvé</p>
                          <p className="text-sm mt-1">
                            {searchTerm || statusFilter !== 'all'
                              ? 'Essayez de modifier vos critères de recherche'
                              : 'Ajoutez votre premier média'}
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
        {/* Add/Edit Form Modal */}
        {showFormModal && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center"
              onClick={() => setShowFormModal(false)}
            >
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className={`relative rounded-xl shadow-2xl w-full max-w-2xl ${darkMode ? 'bg-[#18181b] text-white' : 'bg-white'}`}
                onClick={e => e.stopPropagation()}
              >
                {/* Modal header */}
                <div className={`p-6 rounded-t-xl ${darkMode ? 'bg-[#0C0C0C]' : 'bg-gray-50'} border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}> 
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold" style={{ fontFamily: 'Kenyan Coffee, sans-serif' }}>{modalMode === 'add' ? 'Ajouter un média' : 'Modifier un média'}</h3>
                    <button
                      onClick={() => setShowFormModal(false)}
                      className={`rounded-full p-2 ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
                      disabled={isSubmitting}
                    >
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                {/* Modal form */}
                <form onSubmit={handleFormSubmit}>
                  <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                    <div>
                      <label htmlFor="titre" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Titre *</label>
                      <input
                        type="text"
                        id="titre"
                        name="titre"
                        value={formData.titre}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full rounded-lg shadow-sm sm:text-sm p-3 border ${darkMode ? 'bg-[#0C0C0C] border-gray-700 text-white focus:border-[#972924] focus:ring-[#972924]' : 'border-gray-300 bg-white text-black focus:border-[#972924] focus:ring-[#972924]'}`}
                        required
                        maxLength={100}
                      />
                    </div>
                    <div>
                      <label htmlFor="image" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Image (PNG ou JPG) *</label>
                      <input
                        type="file"
                        id="image"
                        name="image"
                        accept="image/png, image/jpeg"
                        onChange={handleImageChange}
                        className={`mt-1 block w-full text-sm rounded-lg border ${darkMode ? 'bg-[#0C0C0C] border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'} cursor-pointer focus:outline-none p-3`}
                        required={modalMode === 'add'}
                      />
                      {previewImage && (
                        <div className="mt-2 relative group w-full flex justify-center">
                          <img src={previewImage} alt="Aperçu" className="max-h-40 rounded-lg shadow object-contain" />
                          <button type="button" onClick={handleRemoveImage} className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100"><FaTrash className="w-4 h-4" /></button>
                        </div>
                      )}
                    </div>
                    <div>
                      <label htmlFor="link_url" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Lien URL</label>
                      <input
                        type="url"
                        id="link_url"
                        name="link_url"
                        value={formData.link_url}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full rounded-lg shadow-sm sm:text-sm p-3 border ${darkMode ? 'bg-[#0C0C0C] border-gray-700 text-white focus:border-[#972924] focus:ring-[#972924]' : 'border-gray-300 bg-white text-black focus:border-[#972924] focus:ring-[#972924]'}`}
                        placeholder="https://..."
                      />
                    </div>
                    <div className="mb-4">
                      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Type de média *</label>
                      <div className="flex gap-4">
                        <label className="flex items-center cursor-pointer">
                          <input type="checkbox" checked={selectedType === 'exposition'} onChange={() => handleTypeChange('exposition')} className="form-checkbox h-5 w-5 text-green-600" />
                          <span className="ml-2">Exposition</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                          <input type="checkbox" checked={selectedType === 'evenement'} onChange={() => handleTypeChange('evenement')} className="form-checkbox h-5 w-5 text-green-600" />
                          <span className="ml-2">Événement</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                          <input type="checkbox" checked={selectedType === 'artiste'} onChange={() => handleTypeChange('artiste')} className="form-checkbox h-5 w-5 text-green-600" />
                          <span className="ml-2">Artiste</span>
                        </label>
                      </div>
                    </div>
                    {selectedType === 'exposition' && (
                      <div>
                        <label htmlFor="exposition_id" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Exposition liée *</label>
                        <select
                          id="exposition_id"
                          name="exposition_id"
                          value={formData.exposition_id}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full rounded-lg shadow-sm sm:text-sm p-3 border ${darkMode ? 'bg-[#0C0C0C] border-gray-700 text-white focus:border-[#972924] focus:ring-[#972924]' : 'border-gray-300 bg-white text-black focus:border-[#972924] focus:ring-[#972924]'}`}
                          required
                        >
                          <option value="">Sélectionner une exposition</option>
                          {expositions.map(expo => (
                            <option key={expo.id} value={expo.id}>{expo.titre}</option>
                          ))}
                        </select>
                      </div>
                    )}
                    {selectedType === 'evenement' && (
                      <div>
                        <label htmlFor="evenement_id" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Événement lié *</label>
                        <select
                          id="evenement_id"
                          name="evenement_id"
                          value={formData.evenement_id}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full rounded-lg shadow-sm sm:text-sm p-3 border ${darkMode ? 'bg-[#0C0C0C] border-gray-700 text-white focus:border-[#972924] focus:ring-[#972924]' : 'border-gray-300 bg-white text-black focus:border-[#972924] focus:ring-[#972924]'}`}
                          required
                        >
                          <option value="">Sélectionner un événement</option>
                          {evenements.map(ev => (
                            <option key={ev.id} value={ev.id}>{ev.titre}</option>
                          ))}
                        </select>
                      </div>
                    )}
                    {selectedType === 'artiste' && (
                      <div>
                        <label htmlFor="artiste_id" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Artiste lié *</label>
                        <select
                          id="artiste_id"
                          name="artiste_id"
                          value={formData.artiste_id}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full rounded-lg shadow-sm sm:text-sm p-3 border ${darkMode ? 'bg-[#0C0C0C] border-gray-700 text-white focus:border-[#972924] focus:ring-[#972924]' : 'border-gray-300 bg-white text-black focus:border-[#972924] focus:ring-[#972924]'}`}
                          required
                        >
                          <option value="">Sélectionner un artiste</option>
                          {artistes.map(art => (
                            <option key={art.id} value={art.id}>{art.nom}</option>
                          ))}
                        </select>
                      </div>
                    )}
                    <div>
                      <label htmlFor="published" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Statut</label>
                      <select
                        id="published"
                        name="published"
                        value={formData.published ? 'true' : 'false'}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full rounded-lg shadow-sm sm:text-sm p-3 border ${darkMode ? 'bg-[#0C0C0C] border-gray-700 text-white focus:border-[#972924] focus:ring-[#972924]' : 'border-gray-300 bg-white text-black focus:border-[#972924] focus:ring-[#972924]'}`}
                      >
                        <option value="true">Publié</option>
                        <option value="false">Non publié</option>
                      </select>
                    </div>
                  </div>
                  <div className={`px-6 py-4 flex justify-end space-x-3 rounded-b-xl ${darkMode ? 'bg-[#0C0C0C] border-t border-gray-700' : 'bg-gray-50 border-t border-gray-200'}`}>
                    <button
                      type="button"
                      onClick={() => setShowFormModal(false)}
                      disabled={isSubmitting}
                      className={`px-4 py-2 text-sm font-medium rounded-md shadow-sm ${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'}`}
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`px-4 py-2 text-sm font-medium text-white rounded-md shadow-sm bg-[#972924] hover:bg-[#b33c36] flex items-center`}
                    >
                      {isSubmitting ? 'Sauvegarde...' : (modalMode === 'add' ? 'Ajouter' : 'Mettre à jour')}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}
        {/* Delete Modal */}
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

export default MediasList;
