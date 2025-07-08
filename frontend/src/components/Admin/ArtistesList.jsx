import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaFilter, FaSort, FaTrash, FaArrowLeft, FaPlus, FaEdit, FaUser, FaImage, FaEye, FaEyeSlash } from 'react-icons/fa';
import DeleteModal from '../layout/DeleteModal';
import { APP_BASE_URL } from '../../hooks/config';

const ArtistesList = ({ darkMode }) => {
  const [artistes, setArtistes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('nom');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedArtistes, setSelectedArtistes] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  

  // Form data
  const [formData, setFormData] = useState({
    id: '',
    nom: '',
    bio: '',
    photo: null,
    date_naissance: '',
    date_deces: '',
    pays: '',
    published: false
  });

  

  // Handle image
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('File selected:', file);
      setFormData(prev => ({ ...prev, photo: file }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, photo: null }));
    setPreviewImage(null);
    if (document.getElementById('photo')) {
      document.getElementById('photo').value = '';
    }
  };

  useEffect(() => {
    const fetchArtistes = async () => {
      try {
        const response = await fetch(`${APP_BASE_URL}/artistes/admin/api/`);
        if (!response.ok) throw new Error('Erreur lors de la récupération');
        const data = await response.json();
        setArtistes(data);
      } catch (error) {
        setError('Impossible de charger les artistes. Veuillez réessayer.');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtistes();
  }, []);

  const handleDelete = (id) => {
    setDeleteTarget(id);
    setDeleteModalOpen(true);
  };

  const handleBulkDelete = () => {
    setDeleteTarget([...selectedArtistes]);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (Array.isArray(deleteTarget)) {
      try {
        await Promise.all(deleteTarget.map(id =>
          fetch(`${APP_BASE_URL}/artistes/api/${id}`, { method: 'DELETE' })
        ));
        setArtistes(artistes.filter(artiste => !deleteTarget.includes(artiste.id)));
        setSelectedArtistes([]);
        setSuccessMessage(`${deleteTarget.length} artistes supprimés avec succès!`);
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        setError('Impossible de supprimer les artistes. Veuillez réessayer.');
        setTimeout(() => setError(''), 5000);
      } finally {
        setDeleteModalOpen(false);
        setDeleteTarget(null);
      }
    } else if (deleteTarget) {
      try {
        const response = await fetch(`${APP_BASE_URL}/artistes/api/${deleteTarget}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Erreur lors de la suppression');
        setArtistes(artistes.filter(artiste => artiste.id !== deleteTarget));
        setSelectedArtistes(selectedArtistes.filter(artisteId => artisteId !== deleteTarget));
        setSuccessMessage('Artiste supprimé avec succès!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        setError('Impossible de supprimer l\'artiste. Veuillez réessayer.');
        setTimeout(() => setError(''), 5000);
      } finally {
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

  const filteredArtistes = artistes
    .filter(artiste => {
      const matchesSearch = artiste.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          artiste.biographie?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'published' && artiste.published) || 
        (statusFilter === 'unpublished' && !artiste.published);
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const direction = sortDirection === 'asc' ? 1 : -1;
      if (sortField === 'nom') {
        return direction * a.nom.localeCompare(b.nom);
      }
      return 0;
    });

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedArtistes(filteredArtistes.map(artiste => artiste.id));
    } else {
      setSelectedArtistes([]);
    }
  };

  const handleSelectArtiste = (artisteId) => {
    setSelectedArtistes(prev => 
      prev.includes(artisteId) 
        ? prev.filter(id => id !== artisteId)
        : [...prev, artisteId]
    );
  };

  // Toggle publish status
  const handleTogglePublish = async (artiste) => {
    try {
      const response = await fetch(`${APP_BASE_URL}/artistes/admin/api/${artiste.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          nom: artiste.nom,
          bio: artiste.bio,
          photo: artiste.photo,
          date_naissance: artiste.date_naissance,
          date_deces: artiste.date_deces,
          pays: artiste.pays,
          published: !artiste.published
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      // Update the local state
      setArtistes(prev => prev.map(a => 
        a.id === artiste.id ? { ...a, published: !a.published } : a
      ));

      setSuccessMessage(`Artiste ${!artiste.published ? 'publié' : 'dépublié'} avec succès!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error toggling publish status:', error);
      setError(error.message || 'Erreur lors du changement de statut');
      setTimeout(() => setError(''), 5000);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'published' ? value === 'true' : value,
    }));
  };

  // Reset form to default values
  const resetForm = () => {
    setFormData({
      id: '',
      nom: '',
      bio: '',
      photo: null,
      date_naissance: '',
      date_deces: '',
      pays: '',
      published: false
    });
    setPreviewImage(null);
  };

  // Open add modal
  const handleAddClick = () => {
    resetForm();
    setModalMode('add');
    setShowFormModal(true);
  };

  // Open edit modal
  const handleEditClick = (artiste) => {
    setFormData({
      id: artiste.id,
      nom: artiste.nom,
      bio: artiste.bio,
      photo: artiste.photo,
      date_naissance: artiste.date_naissance,
      date_deces: artiste.date_deces,
      pays: artiste.pays || '',
      published: artiste.published || false
    });

    if (artiste.photo) {
      setPreviewImage(artiste.photo);
    } else {
      setPreviewImage(null);
    }
    
    setModalMode('edit');
    setShowFormModal(true);
  };
  
  const handleCloseForm = () => {
    setShowFormModal(false);
    resetForm();
  };

  // Submit form (add/edit)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formDataObj = new FormData(e.currentTarget);
    
    // Handle photo data
    let photoData = '';
    if (formData.photo && formData.photo instanceof File) {
      // Convert file to base64
      const reader = new FileReader();
      photoData = await new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(formData.photo);
      });
    } else if (previewImage) {
      // Use preview image (already base64)
      photoData = previewImage;
    } else if (formDataObj.get('existing_photo')) {
      // Use existing photo URL
      photoData = formDataObj.get('existing_photo');
    }
    
    const artisteData = {
      nom: formDataObj.get('nom'),
      bio: formDataObj.get('bio'),
      photo: photoData,
      date_naissance: formDataObj.get('date_naissance') || null,
      date_deces: formDataObj.get('date_deces') || null,
      pays: formDataObj.get('pays') || '',
      published: formDataObj.get('published') === 'true'
    };

    try {
      if (modalMode === 'edit') {
        const response = await fetch(`${APP_BASE_URL}/artistes/admin/api/${formData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(artisteData),
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
        }
      } else {
        const response = await fetch(`${APP_BASE_URL}/artistes/admin/api/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(artisteData),
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
        }
      }
      
      setShowFormModal(false);
      setPreviewImage(null);
      
      // Refresh the artistes list
      const updatedResponse = await fetch(`${APP_BASE_URL}/artistes/admin/api/`);
      if (!updatedResponse.ok) throw new Error('Erreur lors de la récupération');
      const updatedData = await updatedResponse.json();
      setArtistes(updatedData);
      
      setSuccessMessage(`Artiste ${modalMode === 'add' ? 'ajouté' : 'modifié'} avec succès!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving artiste:', error);
      setError(error.message || 'Une erreur est survenue lors de la soumission du formulaire');
      setTimeout(() => setError(''), 5000);
    } finally {
      setIsSubmitting(false);
    }
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1" style={{ fontFamily: 'Kenyan Coffee, sans-serif' }}>Artistes</h1>
            <p className={`text-base ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Gérez les artistes de votre site</p>
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
              Nouvel artiste
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Rechercher un artiste..."
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
              </div>
            </motion.div>
          )}
        </div>

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

        {/* Bulk Actions */}
        <AnimatePresence>
          {selectedArtistes.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mb-6 p-4 rounded-lg flex items-center justify-between ${darkMode ? 'bg-green-900 border border-green-700 text-green-200' : 'bg-green-50 border border-green-200 text-green-800'}`}
            >
              <span className="font-medium">
                {selectedArtistes.length} artiste{selectedArtistes.length > 1 ? 's' : ''} sélectionné{selectedArtistes.length > 1 ? 's' : ''}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className={`${showFormModal ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
            {/* Artistes Table */}
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className={`${darkMode ? 'bg-[#232326]' : 'bg-white'} p-4 rounded-lg shadow animate-pulse`}>
                    <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-200'} h-4 rounded w-1/4 mb-2`}></div>
                    <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-200'} h-4 rounded w-3/4`}></div>
                  </div>
                ))}
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${darkMode ? 'bg-[#232326]' : 'bg-white'} rounded-xl shadow-lg overflow-hidden`}
              >
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className={darkMode ? 'bg-[#18181b]' : 'bg-gray-50'}>
                      <tr>
                        <th className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={filteredArtistes.length > 0 && selectedArtistes.length === filteredArtistes.length}
                            onChange={handleSelectAll}
                            className={`rounded border-gray-300 text-green-600 focus:ring-green-500 ${darkMode ? 'bg-gray-800 border-gray-600' : ''}`}
                          />
                        </th>
                        <th 
                          className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
                          onClick={() => handleSort('nom')}
                        >
                          <div className="flex items-center">
                            Artiste
                            <FaSort className="ml-2 w-3 h-3" />
                          </div>
                        </th>
                        <th 
                          className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                        >
                          Biographie
                        </th>
                        <th 
                          className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                        >
                          Photo
                        </th>
                        <th 
                          className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                        >
                          Date de naissance
                        </th>
                        <th 
                          className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                        >
                          Date de décès
                        </th>
                        <th 
                          className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                        >
                          Pays
                        </th>
                        <th 
                          className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                        >
                          Statut
                        </th>
                        <th className={`px-6 py-4 text-right text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className={darkMode ? 'bg-[#232326] divide-y divide-gray-700' : 'bg-white divide-y divide-gray-200'}>
                      {filteredArtistes.map((artiste, idx) => (
                        <motion.tr 
                          key={artiste.id} 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.03 }}
                          className={`hover:${darkMode ? 'bg-[#18181b]' : 'bg-gray-50'} transition-colors duration-150 ${
                            selectedArtistes.includes(artiste.id) ? (darkMode ? 'bg-green-900' : 'bg-green-50') : ''
                          }`}
                        >
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              checked={selectedArtistes.includes(artiste.id)}
                              onChange={() => handleSelectArtiste(artiste.id)}
                              className={`rounded border-gray-300 text-green-600 focus:ring-green-500 ${darkMode ? 'bg-gray-800 border-gray-600' : ''}`}
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className={`flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center ${darkMode ? 'bg-green-900' : 'bg-green-100'}`}>
                                <FaUser className={`h-5 w-5 ${darkMode ? 'text-green-300' : 'text-green-600'}`} />
                              </div>
                              <div className="ml-4">
                                <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{artiste.nom}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className={`text-sm max-w-xs truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} title={artiste.bio}>
                              {artiste.bio ? (
                                artiste.bio.length > 50 
                                  ? `${artiste.bio.substring(0, 50)}...` 
                                  : artiste.bio
                              ) : (
                                <span className="text-gray-400">Aucune biographie</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm">
                              {artiste.photo ? (
                                <div className="h-16 w-16 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                                  <img 
                                    src={artiste.photo} 
                                    alt={artiste.nom}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                              ) : (
                                <div className={`h-16 w-16 rounded-lg flex items-center justify-center ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                  <FaImage className={`h-8 w-8 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm">
                              {artiste.date_naissance ? (
                                <span className={`${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{artiste.date_naissance}</span>
                                
                              ) : (
                                <span className={`${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Non spécifié</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm">
                              {artiste.date_deces ? (
                                <span className={`${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{artiste.date_deces}</span>
                              ) : (
                                <span className={`${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Non spécifié</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm">
                              {artiste.pays ? (
                                <span className={`${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{artiste.pays}</span>
                              ) : (
                                <span className={`${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Non spécifié</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => handleTogglePublish(artiste)}
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300 hover:scale-110 cursor-pointer ${
                                artiste.published 
                                  ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                  : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                              }`}
                              title={artiste.published ? 'Cliquer pour dépublier' : 'Cliquer pour publier'}
                            >
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="flex items-center"
                              >
                                {artiste.published 
                                  ? <FaEye className="w-3 h-3 mr-1" />
                                  : <FaEyeSlash className="w-3 h-3 mr-1" />
                                }
                                {artiste.published ? 'Publié' : 'Non publié'}
                              </motion.div>
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-3">
                              <button
                                onClick={() => handleEditClick(artiste)}
                                className={`transition-colors duration-200 flex items-center ${darkMode ? 'text-green-400 hover:text-green-200' : 'text-green-600 hover:text-green-900'}`}
                              >
                                <FaEdit className="w-4 h-4 mr-1" />
                                Éditer
                              </button>
                              <button
                                onClick={() => handleDelete(artiste.id)}
                                className={`transition-colors duration-200 flex items-center ${darkMode ? 'text-red-400 hover:text-red-200' : 'text-red-600 hover:text-red-900'}`}
                              >
                                <FaTrash className="w-4 h-4 mr-1" />
                                Supprimer
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                      {filteredArtistes.length === 0 && (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-center">
                            <div className={`${darkMode ? 'text-gray-500' : 'text-gray-400'} flex flex-col items-center`}>
                              <FaUser className="w-12 h-12 mb-4" />
                              <p className="text-lg">Aucun artiste trouvé</p>
                              <p className="text-sm mt-1">
                                {searchTerm || statusFilter !== 'all'
                                  ? 'Essayez de modifier vos critères de recherche'
                                  : 'Ajoutez votre premier artiste'}
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </div>
          
          {/* Add/Edit Form Modal */}
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
                  {/* Modal header */}
                  <div className={`p-6 rounded-t-xl ${darkMode ? 'bg-[#0C0C0C]' : 'bg-gray-50'} border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${darkMode ? 'bg-[#972924]' : 'bg-[#972924]'}`}>
                          {modalMode === 'add' ? (
                            <FaPlus className="h-5 w-5 text-white" />
                          ) : (
                            <FaEdit className="h-5 w-5 text-white" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold" style={{ fontFamily: 'Kenyan Coffee, sans-serif' }}>
                            {modalMode === 'add' ? 'Ajouter un artiste' : 'Modifier un artiste'}
                          </h3>
                        </div>
                      </div>
                      <button 
                        type="button"
                        onClick={handleCloseForm}
                        className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-800'} transition-colors`}
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
                      {/* Hidden fields */}
                      <input type="hidden" name="id" value={formData.id} />
                      <input type="hidden" name="existing_photo" value={formData.photo} />
                      
                      <div>
                        <label htmlFor="nom" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Nom *</label>
                        <input
                          type="text"
                          id="nom"
                          name="nom"
                          value={formData.nom}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full rounded-lg shadow-sm sm:text-sm p-3 border ${darkMode ? 'bg-[#0C0C0C] border-gray-700 text-white focus:border-[#972924] focus:ring-[#972924]' : 'border-gray-300 bg-white text-black focus:border-[#972924] focus:ring-[#972924]'}`}
                          required
                          maxLength={100}
                        />
                      </div>

                      <div>
                        <label htmlFor="bio" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Biographie *</label>
                        <textarea
                          id="bio"
                          name="bio"
                          value={formData.bio}
                          onChange={handleInputChange}  
                          className={`mt-1 block w-full rounded-lg shadow-sm sm:text-sm p-3 border h-32 ${darkMode ? 'bg-[#0C0C0C] border-gray-700 text-white focus:border-[#972924] focus:ring-[#972924]' : 'border-gray-300 bg-white text-black focus:border-[#972924] focus:ring-[#972924]'}`}
                          required
                          maxLength={500}
                        />
                      </div>

                      <div>
                        <label htmlFor="photo" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                          Photo (PNG, JPG) *
                        </label>
                        <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${darkMode ? 'border-gray-600' : 'border-gray-300'} border-dashed rounded-md`}>
                          <div className="space-y-1 text-center">
                            <FaImage className={`mx-auto h-12 w-12 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                            <div className="flex text-sm text-gray-600">
                              <label
                                htmlFor="photo"
                                className={`relative cursor-pointer rounded-md font-medium ${darkMode ? 'text-[#972924] hover:text-[#b33c36]' : 'text-[#972924] hover:text-[#b33c36]'} focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#972924]`}
                              >
                                <span>Télécharger un fichier</span>
                                <input id="photo" name="photo" type="file" className="sr-only" onChange={handleFileChange} accept="image/png, image/jpeg" required={modalMode === 'add' && !previewImage}/>
                              </label>
                              <p className="pl-1">ou glisser-déposer</p>
                            </div>
                            <p className="text-xs text-gray-500">PNG, JPG jusqu'à 10MB</p>
                          </div>
                        </div>

                        {previewImage && (
                          <div className="mt-4 relative group">
                            <img
                              src={previewImage}
                              alt="Aperçu"
                              className="max-h-40 rounded-lg shadow-lg object-contain"
                            />
                            <button
                              type="button"
                              onClick={handleRemoveImage}
                              className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-lg leading-none opacity-0 group-hover:opacity-100 transition-opacity"
                              aria-label="Remove image"
                            >
                              <FaTrash className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>

                      <div>
                        <label htmlFor="date_naissance" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Date de naissance</label>
                        <input
                          type="date"
                          id="date_naissance"
                          name="date_naissance"
                          value={formData.date_naissance}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full rounded-lg shadow-sm sm:text-sm p-3 border ${darkMode ? 'bg-[#0C0C0C] border-gray-700 text-white focus:border-[#972924] focus:ring-[#972924]' : 'border-gray-300 bg-white text-black focus:border-[#972924] focus:ring-[#972924]'}`}
                        />
                      </div>

                      <div>
                        <label htmlFor="date_deces" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Date de décès</label>
                        <input
                          type="date"
                          id="date_deces"
                          name="date_deces"
                          value={formData.date_deces}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full rounded-lg shadow-sm sm:text-sm p-3 border ${darkMode ? 'bg-[#0C0C0C] border-gray-700 text-white focus:border-[#972924] focus:ring-[#972924]' : 'border-gray-300 bg-white text-black focus:border-[#972924] focus:ring-[#972924]'}`}
                        />
                      </div>

                      <div>
                        <label htmlFor="pays" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Pays</label>
                        <input
                          type="text"
                          id="pays"
                          name="pays"
                          value={formData.pays}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full rounded-lg shadow-sm sm:text-sm p-3 border ${darkMode ? 'bg-[#0C0C0C] border-gray-700 text-white focus:border-[#972924] focus:ring-[#972924]' : 'border-gray-300 bg-white text-black focus:border-[#972924] focus:ring-[#972924]'}`}
                        />
                      </div>

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
                    
                    {/* Modal footer */}
                    <div className={`px-6 py-4 flex justify-end space-x-3 rounded-b-xl ${darkMode ? 'bg-[#0C0C0C] border-t border-gray-700' : 'bg-gray-50 border-t border-gray-200'}`}>
                      <button
                        type="button"
                        onClick={handleCloseForm}
                        disabled={isSubmitting}
                        className={`px-4 py-2 text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600 focus:ring-gray-500 focus:ring-offset-[#0C0C0C]' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 focus:ring-[#972924]'}`}
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px] bg-[#972924] hover:bg-[#b33c36] focus:ring-[#972924] ${darkMode ? 'focus:ring-offset-[#0C0C0C]' : ''}`}
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>{modalMode === 'add' ? 'Ajout...' : 'Mise à jour...'}</span>
                          </>
                        ) : (
                          modalMode === 'add' ? 'Ajouter' : 'Mettre à jour'
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <DeleteModal
        open={deleteModalOpen}
        onClose={() => { setDeleteModalOpen(false); setDeleteTarget(null); }}
        onConfirm={confirmDelete}
        count={Array.isArray(deleteTarget) ? deleteTarget.length : 1}
        darkMode={darkMode}
      />
    </div>
  );
};

export default ArtistesList;
