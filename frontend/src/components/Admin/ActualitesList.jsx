import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaNewspaper, FaSearch, FaFilter, FaSort, FaTrash, FaArrowLeft, FaPlus, FaEdit, FaCalendarAlt, FaImage, FaEye, FaEyeSlash } from 'react-icons/fa';
import DeleteModal from '../layout/DeleteModal';

const ActualitesList = ({ darkMode }) => {
  // State management
  const [actualites, setActualites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedNews, setSelectedNews] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [bulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    id: '',
    titre: '',
    description: '',
    image: '',
    date: new Date().toISOString().split('T')[0],
    link: '',
    published: false
  });

  // Fetch actualités
  useEffect(() => {
    const fetchActualites = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch('/actualites/admin/api');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setActualites(data);
      } catch (error) {
        setError('Erreur lors de la récupération des actualités');
      } finally {
        setIsLoading(false);
      }
    };
    fetchActualites();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Reset form to default values
  const resetForm = () => {
    setFormData({
      id: '',
      titre: '',
      description: '',
      image: '',
      date: new Date().toISOString().split('T')[0],
      link: '',
      published: false
    });
  };

  // Open add modal
  const handleAddClick = () => {
    resetForm();
    setModalMode('add');
    setShowFormModal(true);
  };

  // Open edit modal
  const handleEditClick = (actualite) => {
    setFormData({
      id: actualite.id,
      titre: actualite.titre || actualite.title,
      description: actualite.description || actualite.desc,
      image: actualite.image || '',
      date: actualite.date ? actualite.date.split('T')[0] : new Date().toISOString().split('T')[0],
      link: actualite.link || actualite.url,
      published: actualite.published || actualite.isPublished || false,
    });
    if (actualite.image) {
      setPreviewImage(actualite.image);
    } else {
      setPreviewImage(null);
    }
    setModalMode('edit');
    setShowFormModal(true);
  };

  // Handle image
  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || e.dataTransfer?.files?.[0];
    if (file) {
      console.log('File selected:', file);
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

  // Submit form (add/edit)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const url = modalMode === 'add'
        ? '/actualites/admin/api'
        : `/actualites/admin/api/${formData.id}`;
      const method = modalMode === 'add' ? 'POST' : 'PUT';
      // Préparation des données de base
      const dataToSend = {
        titre: formData.titre?.trim() || '',
        description: formData.description?.trim() || '',
        date: formData.date ? new Date(formData.date).toISOString().split('T')[0] : '',
        link: formData.link?.trim() || '',
        published: Boolean(formData.published)
      };
      // Gestion de l'image
      if (formData.image instanceof File) {
        try {
          console.log('Processing image:', {
            name: formData.image.name,
            size: formData.image.size,
            type: formData.image.type
          });

          // Vérifier la taille maximale (3MB)
          const maxSize = 3 * 1024 * 1024; // 3MB
          if (formData.image.size > maxSize) {
            throw new Error('L\'image est trop grande. Taille maximum: 3MB');
          }

          // Convertir et compresser l'image
          dataToSend.image = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              try {
                const base64 = reader.result;
                const img = new Image();
                img.onload = () => {
                  try {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    // Calculer les dimensions pour réduire la taille
                    let width = img.width;
                    let height = img.height;
                    const maxDimension = 600; // Réduit encore plus pour garantir une petite taille

                    if (width > height && width > maxDimension) {
                      height = Math.round((height * maxDimension) / width);
                      width = maxDimension;
                    } else if (height > maxDimension) {
                      width = Math.round((width * maxDimension) / height);
                      height = maxDimension;
                    }

                    // Appliquer les dimensions
                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);

                    // Déterminer le format et la qualité
                    let mimeType = formData.image.type;
                    let quality = 0.7; // Qualité par défaut

                    // Si c'est un PNG, on le convertit en JPG pour une meilleure compression
                    if (mimeType === 'image/png') {
                      mimeType = 'image/jpeg';
                      quality = 0.6; // Qualité plus basse pour JPG
                    }

                    // Convertir en base64 avec compression
                    const base64Result = canvas.toDataURL(mimeType, quality);
                    
                    // Vérifier la taille des données
                    const dataSize = Math.round(base64Result.length * 0.75);
                    console.log('Image compressed:', {
                      originalSize: formData.image.size,
                      compressedSize: dataSize,
                      quality: quality,
                      dimensions: `${width}x${height}`,
                      format: mimeType
                    });

                    // Vérifier que la compression a bien réduit la taille
                    if (dataSize > 200 * 1024) { // Réduit à 200KB
                      // Réessayer avec une qualité plus basse
                      quality = 0.5;
                      const retryResult = canvas.toDataURL(mimeType, quality);
                      const retrySize = Math.round(retryResult.length * 0.75);
                      
                      console.log('Retry compression:', {
                        originalSize: formData.image.size,
                        compressedSize: retrySize,
                        quality: quality,
                        dimensions: `${width}x${height}`,
                        format: mimeType
                      });

                      if (retrySize > 200 * 1024) { // Si toujours trop grand
                        // Dernier essai avec une qualité très basse
                        quality = 0.4;
                        const finalResult = canvas.toDataURL(mimeType, quality);
                        const finalSize = Math.round(finalResult.length * 0.75);
                        
                        console.log('Final compression attempt:', {
                          originalSize: formData.image.size,
                          compressedSize: finalSize,
                          quality: quality,
                          dimensions: `${width}x${height}`,
                          format: mimeType
                        });

                        if (finalSize > 200 * 1024) {
                          // Si toujours trop grand, réduire encore les dimensions
                          width = Math.round(width * 0.8);
                          height = Math.round(height * 0.8);
                          canvas.width = width;
                          canvas.height = height;
                          ctx.drawImage(img, 0, 0, width, height);
                          
                          const lastResult = canvas.toDataURL(mimeType, 0.4);
                          const lastSize = Math.round(lastResult.length * 0.75);
                          
                          console.log('Last resort compression:', {
                            originalSize: formData.image.size,
                            compressedSize: lastSize,
                            quality: 0.4,
                            dimensions: `${width}x${height}`,
                            format: mimeType
                          });

                          resolve(lastResult);
                        } else {
                          resolve(finalResult);
                        }
                      } else {
                        resolve(retryResult);
                      }
                    } else {
                      resolve(base64Result);
                    }
                  } catch (error) {
                    console.error('Canvas error:', error);
                    // En cas d'erreur, utiliser l'image originale
                    resolve(base64);
                  }
                };
                img.onerror = () => {
                  console.error('Image load error');
                  resolve(base64);
                };
                img.src = base64;
              } catch (error) {
                console.error('Base64 conversion error:', error);
                reject(new Error('Erreur lors de la lecture de l\'image: ' + error.message));
              }
            };
            reader.onerror = () => {
              reject(new Error('Erreur lors de la lecture du fichier'));
            };
            reader.readAsDataURL(formData.image);
          });

          // Vérifier que la taille des données n'est pas trop grande
          const dataSize = JSON.stringify(dataToSend).length;
          console.log('Data size:', dataSize);
          if (dataSize > 200 * 1024) { // Réduit à 200KB
            throw new Error('Les données sont trop volumineuses après compression. Veuillez choisir une image plus petite ou réduire sa taille.');
          }
        } catch (error) {
          console.error('Image processing error:', error);
          throw new Error('Erreur lors du traitement de l\'image: ' + error.message);
        }
      } else if (formData.image) {
        dataToSend.image = formData.image;
      }
      // Vérifier que les données sont valides avant l'envoi
      if (!dataToSend.titre || !dataToSend.date) {
        throw new Error('Veuillez remplir tous les champs obligatoires');
      }
      // Nettoyer les données avant l'envoi
      Object.keys(dataToSend).forEach(key => {
        if (dataToSend[key] === null || dataToSend[key] === undefined) {
          delete dataToSend[key];
        }
      });
      const dataSize = JSON.stringify(dataToSend).length;
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(dataToSend)
      });
      let responseData;
      const responseText = await response.text();
      if (!responseText) {
        throw new Error('Le serveur n\'a pas renvoyé de réponse. Veuillez réessayer.');
      }
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        throw new Error('Erreur lors de la lecture de la réponse du serveur: ' + responseText);
      }
      if (!response.ok) {
        throw new Error(responseData.error || responseData.details || 'Erreur lors de la sauvegarde');
      }
      // Rafraîchir la liste des actualités
      const updatedResponse = await fetch('/actualites/admin/api');
      if (!updatedResponse.ok) throw new Error('Erreur lors de la récupération des données');
      const updatedData = await updatedResponse.json();
      setActualites(updatedData);
      setShowFormModal(false);
      setSuccessMessage(responseData.message || `Actualité ${modalMode === 'add' ? 'ajoutée' : 'modifiée'} avec succès!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setError(error.message || 'Une erreur est survenue');
      setTimeout(() => setError(''), 5000);
    } finally {
      setIsSubmitting(false);
      setPreviewImage(null);
    }
  };

  // Delete functions
  const handleDeleteClick = (id) => {
    setDeleteTarget(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/actualites/admin/api/${deleteTarget}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }
      setActualites(prev => prev.filter(item => item.id !== deleteTarget));
      setDeleteModalOpen(false);
      setSuccessMessage('Actualité supprimée avec succès!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setError(error.message || 'Erreur lors de la suppression');
      setTimeout(() => setError(''), 5000);
    } finally {
      setIsSubmitting(false);
      setDeleteTarget(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setDeleteTarget(null);
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    setBulkDeleteModalOpen(true);
  };

  const handleBulkDeleteConfirm = async () => {
    setIsSubmitting(true);
    try {
      await Promise.all(selectedNews.map(id =>
        fetch(`/actualites/admin/api/${id}`, { method: 'DELETE' })
      ));
      setActualites(actualites.filter(item => !selectedNews.includes(item.id)));
      setSelectedNews([]);
      setSuccessMessage(`${selectedNews.length} actualités supprimées avec succès!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setError('Erreur lors de la suppression des actualités');
      setTimeout(() => setError(''), 5000);
    } finally {
      setIsSubmitting(false);
      setBulkDeleteModalOpen(false);
    }
  };

  const handleBulkDeleteCancel = () => {
    setBulkDeleteModalOpen(false);
  };

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handle select all
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedNews(filteredNews.map(item => item.id));
    } else {
      setSelectedNews([]);
    }
  };

  // Handle select single
  const handleSelectNews = (id) => {
    setSelectedNews(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Filter and sort news
  const filteredNews = actualites
    .filter(item => {
      const matchesSearch = (item.titre || item.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description || item.desc || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' ||
        (statusFilter === 'published' && (item.published || item.isPublished)) ||
        (statusFilter === 'unpublished' && !(item.published || item.isPublished));
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const direction = sortDirection === 'asc' ? 1 : -1;
      if (sortField === 'titre') {
        return direction * (a.titre || a.title || '').localeCompare(b.titre || b.title || '');
      }
      if (sortField === 'date') {
        return direction * (new Date(a.date) - new Date(b.date));
      }
      return 0;
    });

  // Toggle published status
  const handleTogglePublished = async (actualite) => {
    const updatedPublished = !(actualite.published || actualite.isPublished);
    // Optimistic UI update
    setActualites(prev => prev.map(item =>
      item.id === actualite.id ? { ...item, published: updatedPublished } : item
    ));
    try {
      const response = await fetch(`/actualites/admin/api/${actualite.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ published: updatedPublished })
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du statut');
      }
      setSuccessMessage(`Actualité ${updatedPublished ? 'publiée' : 'dépubliée'} avec succès!`);
      setTimeout(() => setSuccessMessage(''), 2000);
    } catch (error) {
      setError(error.message || 'Erreur lors de la mise à jour du statut');
      setTimeout(() => setError(''), 4000);
      // Revert UI
      setActualites(prev => prev.map(item =>
        item.id === actualite.id ? { ...item, published: !updatedPublished } : item
      ));
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

        {/* Header and Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1" style={{ fontFamily: 'Kenyan Coffee, sans-serif' }}>Actualités</h1>
            <p className={`text-base ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Gérez les actualités de votre site</p>
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
              onClick={() => { setModalMode('add'); setShowFormModal(true); setFormData({ id: '', titre: '', description: '', image: '', date: new Date().toISOString().split('T')[0], link: '', published: false }); setPreviewImage(null); }}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center"
            >
              <FaPlus className="w-4 h-4 mr-2" />
              Nouvelle actualité
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Rechercher une actualité..."
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
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className={`w-full rounded-lg border ${darkMode ? 'bg-[#18181b] border-gray-600' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="published">Publiées</option>
                    <option value="unpublished">Non publiées</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Table and Bulk Actions */}
        <AnimatePresence>
          {selectedNews.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mb-6 p-4 rounded-lg flex items-center justify-between ${darkMode ? 'bg-green-900 border border-green-700 text-green-200' : 'bg-green-50 border border-green-200 text-green-800'}`}
            >
              <span className="font-medium">
                {selectedNews.length} actualité{selectedNews.length > 1 ? 's' : ''} sélectionnée{selectedNews.length > 1 ? 's' : ''}
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
            <table className={`min-w-full divide-y divide-gray-200 dark:divide-gray-700 ${darkMode ? 'text-white' : ''}`}>
              <thead className={darkMode ? 'bg-[#18181b]' : 'bg-gray-50'}>
                <tr>
                  <th className="px-6 py-4">
                    <input type="checkbox" onChange={handleSelectAll} checked={filteredNews.length > 0 && selectedNews.length === filteredNews.length} className={`rounded border-gray-300 text-green-600 focus:ring-green-500 ${darkMode ? 'bg-gray-800 border-gray-600' : ''}`} />
                  </th>
                  <th onClick={() => handleSort('titre')} className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}>Titre</th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Description</th>
                  <th onClick={() => handleSort('date')} className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}>Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Image</th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className={darkMode ? 'bg-[#232326] divide-y divide-gray-700 text-white' : 'bg-white divide-y divide-gray-200'}>
                {filteredNews.map((actualite) => (
                  <tr 
                    key={actualite.id}
                    className={`hover:${darkMode ? 'bg-[#18181b] text-white' : 'bg-gray-50'} transition-colors duration-150 ${selectedNews.includes(actualite.id) ? (darkMode ? 'bg-green-900 text-white' : 'bg-green-50') : ''}`}
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedNews.includes(actualite.id)}
                        onChange={() => handleSelectNews(actualite.id)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <FaNewspaper className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div className="ml-4">
                          <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {actualite.titre || actualite.title || 'Sans titre'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'} line-clamp-2 max-w-xs`}>
                        {actualite.description || actualite.desc || 'Aucune description'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <FaCalendarAlt className="w-4 h-4 mr-2 text-gray-400" />
                        {formatDate(actualite.date)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <FaImage className="w-4 h-4 mr-2 text-gray-400" />
                        {actualite.image ? (
                          <img
                            src={actualite.image}
                            alt={actualite.titre}
                            className="w-12 h-12 object-cover rounded-lg"
                          />  
                        ) : (
                          <span className="text-gray-400">Aucune image</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleTogglePublished(actualite)}
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full focus:outline-none transition-colors duration-150 ${
                          (actualite.published || actualite.isPublished)
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                        }`}
                        title="Cliquer pour changer le statut"
                        disabled={isSubmitting}
                      >
                        <div className="flex items-center">
                          {(actualite.published || actualite.isPublished)
                            ? <FaEye className="w-3 h-3 mr-1" />
                            : <FaEyeSlash className="w-3 h-3 mr-1" />
                          }
                          {(actualite.published || actualite.isPublished) ? 'Publié' : 'Non publié'}
                        </div>
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => handleEditClick(actualite)}
                          className="text-indigo-600 hover:text-indigo-900 transition-colors duration-200 flex items-center"
                          title="Modifier"
                        >
                          <FaEdit className="w-4 h-4 mr-1" />
                          <span className="sr-only sm:not-sr-only">Éditer</span>
                        </button>
                        <button
                          onClick={() => handleDeleteClick(actualite.id)}
                          className="text-red-600 hover:text-red-900 transition-colors duration-200 flex items-center"
                          title="Supprimer"
                        >
                          <FaTrash className="w-4 h-4 mr-1" />
                          <span className="sr-only sm:not-sr-only">Supprimer</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Modal */}
        <AnimatePresence>
          {showFormModal && (
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
                className={`relative rounded-xl shadow-2xl w-full max-w-2xl ${darkMode ? 'bg-[#18181b]' : 'bg-white'}`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className={`p-6 rounded-t-xl ${modalMode === 'add' ? 'bg-green-600' : 'bg-blue-600'} border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-white/20 rounded-full flex items-center justify-center">
                        {modalMode === 'add' ? (
                          <FaPlus className="h-5 w-5 text-white" />
                        ) : (
                          <FaEdit className="h-5 w-5 text-white" />
                        )}
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-white">
                          {modalMode === 'add' ? 'Ajouter une actualité' : 'Modifier une actualité'}
                        </h3>
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowFormModal(false)}
                      className="text-white/80 hover:text-white transition-colors"
                      disabled={isSubmitting}
                    >
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {/* Modal form */}
                <form onSubmit={handleFormSubmit} className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="titre" className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
                      <input
                        type="text"
                        id="titre"
                        name="titre"
                        value={formData.titre}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        required
                        maxLength={100}
                      />
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}  
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border h-32"
                        required
                        maxLength={500}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                        <input
                          type="date"
                          id="date"
                          name="date"
                          value={formData.date}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-1">Lien * </label>
                        <input
                          type="text"
                          id="link"
                          name="link"
                          value={formData.link}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                          placeholder="https://example.com"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                        Sélectionner une image (PNG ou JPG) *
                      </label>
                      <div 
                        className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-500 transition-all duration-300"
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onDragEnter={(e) => e.preventDefault()}
                        onDragLeave={(e) => e.preventDefault()}
                      >
                        <div className="space-y-1 text-center">
                          {previewImage ? (
                            <div className="relative group">
                              <div className="relative w-72 h-48 overflow-hidden rounded-lg shadow-lg">
                                <img
                                  src={previewImage}
                                  alt="Aperçu"
                                  className="w-full h-full object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={handleRemoveImage}
                                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-all duration-300"
                                  aria-label="Remove image"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 48 48"
                                aria-hidden="true"
                              >
                                <path
                                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                  strokeWidth={2}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              <div className="flex text-sm text-gray-600 justify-center">
                                <label
                                  htmlFor="image"
                                  className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                >
                                  <span>Télécharger une image</span>
                                  <input
                                    id="image"
                                    name="image"
                                    type="file"
                                    accept="image/png, image/jpeg"
                                    onChange={handleFileChange}
                                    className="sr-only"
                                    required={modalMode === 'add'}
                                  />
                                </label>
                                <p className="pl-1">ou glisser-déposer</p>
                              </div>
                              <p className="text-xs text-gray-500">
                                PNG, JPG jusqu'à 3MB
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center mt-4">
                      <input
                        id="published"
                        name="published"
                        type="checkbox"
                        checked={formData.published}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="published" className="ml-2 block text-sm text-gray-900">
                        Publier cette actualité
                      </label>
                    </div>
                  </div>
                  
                  {/* Modal footer */}
                  <div className="mt-6 bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowFormModal(false)}
                      disabled={isSubmitting}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`px-4 py-2 text-sm font-medium text-white ${modalMode === 'add' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-24`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {modalMode === 'add' ? 'Ajout...' : 'Mise à jour...'}
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

        {/* Delete Confirmation Modal */}
        {deleteModalOpen && !bulkDeleteModalOpen && (
          <DeleteModal
            open={deleteModalOpen}
            onClose={handleDeleteCancel}
            onConfirm={handleDeleteConfirm}
            count={1}
            darkMode={darkMode}
          />
        )}
        {bulkDeleteModalOpen && (
          <DeleteModal
            open={bulkDeleteModalOpen}
            onClose={handleBulkDeleteCancel}
            onConfirm={handleBulkDeleteConfirm}
            count={selectedNews.length}
            darkMode={darkMode}
          />
        )}
      </div>
    </div>
  );
};

export default ActualitesList;