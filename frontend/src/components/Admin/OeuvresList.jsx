import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaFilter, FaSort, FaTrash, FaArrowLeft, FaPlus, FaEdit, FaImage, FaEye, FaEyeSlash, FaPalette } from 'react-icons/fa';
import DeleteModal from '../layout/DeleteModal';

const OeuvresList = ({ darkMode }) => {
  const [oeuvres, setOeuvres] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('titre');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedOeuvres, setSelectedOeuvres] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [previewSecondaryImages, setPreviewSecondaryImages] = useState([]);
  const [artistes, setArtistes] = useState([]);
  const [expositions, setExpositions] = useState([]);
  const [evenements, setEvenements] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    id: '',
    titre: '',
    description: '',
    dimensions: '',
    technique: '',
    annee: '',
    prix: '',
    image_principale: null,
    images_secondaires: [],
    artiste_id: '',
    exposition_id: '',
    published: false,
    evenements: []
  });

  useEffect(() => {
    fetchOeuvres();
    fetchArtistes();
    fetchExpositions();
    fetchEvenements();
  }, []);

  const fetchOeuvres = async () => {
    try {
      const response = await fetch('/oeuvres/admin/api/');
      if (!response.ok) throw new Error('Erreur lors de la récupération');
      const data = await response.json();
      // Normalize images_secondaires to always be an array
      const normalized = data.map(oeuvre => ({
        ...oeuvre,
        images_secondaires: Array.isArray(oeuvre.images_secondaires)
          ? oeuvre.images_secondaires
          : (oeuvre.images_secondaires
              ? oeuvre.images_secondaires.split(',').map(img => img.trim()).filter(Boolean)
              : [])
      }));
      setOeuvres(normalized);
    } catch (error) {
      setError('Impossible de charger les œuvres. Veuillez réessayer.');
      console.error(error);
    } finally {
      setIsLoading(false);
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

  const handleDelete = (id) => {
    setDeleteTarget(id);
    setDeleteModalOpen(true);
  };

  const handleBulkDelete = () => {
    setDeleteTarget([...selectedOeuvres]);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (Array.isArray(deleteTarget)) {
      setIsSubmitting(true);
      try {
        await Promise.all(deleteTarget.map(id =>
          fetch(`/oeuvres/api/${id}`, { method: 'DELETE' })
        ));
        setOeuvres(oeuvres.filter(oeuvre => !deleteTarget.includes(oeuvre.id)));
        setSelectedOeuvres([]);
        setSuccessMessage(`${deleteTarget.length} œuvres supprimées avec succès!`);
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        setError('Erreur lors de la suppression des œuvres');
        setTimeout(() => setError(''), 5000);
      } finally {
        setIsSubmitting(false);
        setDeleteModalOpen(false);
        setDeleteTarget(null);
      }
    } else if (deleteTarget) {
      setIsSubmitting(true);
      try {
        const response = await fetch(`/oeuvres/api/${deleteTarget}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Erreur lors de la suppression');
        setOeuvres(oeuvres.filter(oeuvre => oeuvre.id !== deleteTarget));
        setSelectedOeuvres(selectedOeuvres.filter(oeuvreId => oeuvreId !== deleteTarget));
        setSuccessMessage('Œuvre supprimée avec succès!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        setError('Impossible de supprimer l\'œuvre. Veuillez réessayer.');
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

  const handleTogglePublish = async (oeuvre) => {
    try {
      const response = await fetch(`/oeuvres/admin/api/${oeuvre.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          id: oeuvre.id,
          published: !oeuvre.published
          // Optionally, add other fields you want to update, but NOT image_principale or images_secondaires
        }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      setOeuvres(prev => prev.map(o =>
        o.id === oeuvre.id ? { ...o, published: !o.published } : o
      ));
      setSuccessMessage(`Œuvre ${!oeuvre.published ? 'publiée' : 'dépubliée'} avec succès!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setError(error.message || 'Erreur lors du changement de statut');
      setTimeout(() => setError(''), 5000);
    }
  };

  const filteredOeuvres = oeuvres
    .filter(oeuvre => {
      const matchesSearch = oeuvre.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        oeuvre.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' ||
        (statusFilter === 'published' && oeuvre.published) ||
        (statusFilter === 'unpublished' && !oeuvre.published);
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const direction = sortDirection === 'asc' ? 1 : -1;
      if (sortField === 'titre') return direction * a.titre.localeCompare(b.titre);
      if (sortField === 'annee') return direction * (a.annee - b.annee);
      if (sortField === 'prix') return direction * (a.prix - b.prix);
      return 0;
    });

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedOeuvres(filteredOeuvres.map(oeuvre => oeuvre.id));
    } else {
      setSelectedOeuvres([]);
    }
  };

  const handleSelectOeuvre = (oeuvreId) => {
    setSelectedOeuvres(prev =>
      prev.includes(oeuvreId) ? prev.filter(id => id !== oeuvreId) : [...prev, oeuvreId]
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
      description: '',
      dimensions: '',
      technique: '',
      annee: '',
      prix: '',
      image_principale: null,
      images_secondaires: [],
      artiste_id: '',
      exposition_id: '',
      published: false,
      evenements: []
    });
    setPreviewImage(null);
    setPreviewSecondaryImages([]);
  };

  const handleAddClick = () => {
    resetForm();
    setModalMode('add');
    setShowFormModal(true);
  };

  const handleEditClick = (oeuvre) => {
    setFormData({
      id: oeuvre.id,
      titre: oeuvre.titre,
      description: oeuvre.description,
      dimensions: oeuvre.dimensions,
      technique: oeuvre.technique,
      annee: oeuvre.annee,
      prix: oeuvre.prix,
      image_principale: oeuvre.image_principale,
      images_secondaires: oeuvre.images_secondaires || [],
      artiste_id: oeuvre.artiste?.id || oeuvre.artiste_id?.id || oeuvre.artiste_id || '',
      exposition_id: oeuvre.expositions?.id || oeuvre.exposition_id?.id || oeuvre.exposition_id || '',
      published: oeuvre.published || false,
      evenements: Array.isArray(oeuvre.evenements)
        ? oeuvre.evenements.map(ev => (ev.id ? String(ev.id) : String(ev)))
        : []
    });
    setPreviewImage(oeuvre.image_principale || null);
    setPreviewSecondaryImages(oeuvre.images_secondaires || []);
    setModalMode('edit');
    setShowFormModal(true);
  };

  // Handle main image
  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image_principale: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle secondary images
  const handleSecondaryImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // Append new files to the existing images_secondaires
      setFormData(prev => ({
        ...prev,
        images_secondaires: [...prev.images_secondaires, ...files]
      }));
      // Generate previews for new files and append to existing previews
      const previews = files.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
      });
      Promise.all(previews).then(results => {
        setPreviewSecondaryImages(prev => [...prev, ...results]);
      });
    }
  };

  const handleRemoveMainImage = () => {
    setFormData(prev => ({ ...prev, image_principale: null }));
    setPreviewImage(null);
  };

  const handleRemoveSecondaryImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images_secondaires: prev.images_secondaires.filter((_, i) => i !== index)
    }));
    setPreviewSecondaryImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Handle image_principale
    let imagePrincipaleData = '';
    if (formData.image_principale && formData.image_principale instanceof File) {
      imagePrincipaleData = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result); // always includes data:image/...;base64,
        reader.readAsDataURL(formData.image_principale);
      });
    } else if (previewImage && previewImage.startsWith('data:image')) {
      imagePrincipaleData = previewImage;
    } else {
      imagePrincipaleData = '';
    }

    // Handle images_secondaires
    let imagesSecondairesData = [];
    if (formData.images_secondaires && formData.images_secondaires.length > 0) {
      imagesSecondairesData = await Promise.all(
        formData.images_secondaires.map(async (img) => {
          if (img instanceof File) {
            return await new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result); // always includes data:image/...;base64,
              reader.readAsDataURL(img);
            });
          } else if (typeof img === 'string' && img.startsWith('data:image')) {
            return img;
          } else {
            return '';
          }
        })
      );
      // Remove empty strings (for unchanged images)
      imagesSecondairesData = imagesSecondairesData.filter(Boolean);
    }

    const oeuvreData = {
      ...formData,
      image_principale: imagePrincipaleData,
      images_secondaires: imagesSecondairesData,
      artiste_id: formData.artiste_id,
      exposition_id: formData.exposition_id,
      published: formData.published,
      evenements: formData.evenements
    };

    try {
      const url = modalMode === 'add' ? '/oeuvres/admin/api' : `/oeuvres/admin/api/${formData.id}`;
      const method = modalMode === 'add' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(oeuvreData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.details || `HTTP ${response.status}: ${response.statusText}`);
      }

      setShowFormModal(false);
      setPreviewImage(null);
      fetchOeuvres(); // Refresh list
      setSuccessMessage(`Œuvre ${modalMode === 'add' ? 'ajoutée' : 'modifiée'} avec succès!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving oeuvre:', error);
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
            <h1 className="text-3xl font-bold mb-1" style={{ fontFamily: 'Kenyan Coffee, sans-serif' }}>Œuvres</h1>
            <p className={`text-base ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Gérez les œuvres de votre site</p>
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
              Nouvelle œuvre
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

        <AnimatePresence>
          {selectedOeuvres.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mb-6 p-4 rounded-lg flex items-center justify-between ${darkMode ? 'bg-green-900 border border-green-700 text-green-200' : 'bg-green-50 border border-green-200 text-green-800'}`}
            >
              <span className="font-medium">
                {selectedOeuvres.length} œuvre{selectedOeuvres.length > 1 ? 's' : ''} sélectionnée{selectedOeuvres.length > 1 ? 's' : ''}
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

        {/* Oeuvres Table */}
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
                        checked={selectedOeuvres.length === filteredOeuvres.length}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                      onClick={() => handleSort('titre')}
                    >
                      <div className="flex items-center">
                        Œuvre
                        <FaSort className="ml-2 w-3 h-3" />
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <div className="flex items-center">
                        Description
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <div className="flex items-center">
                        Image principale
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <div className="flex items-center">
                        Images secondaires
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    >
                      <div className="flex items-center">
                        Dimensions
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                      onClick={() => handleSort('annee')}
                    >
                      <div className="flex items-center">
                        Année
                        <FaSort className="ml-2 w-3 h-3" />
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    >
                      <div className="flex items-center">
                        Technique
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    >
                      <div className="flex items-center">
                        Remarque
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    >
                      <div className="flex items-center">
                        Artiste
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    >
                      <div className="flex items-center">
                        Exposition
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    >
                      <div className="flex items-center">
                        Événements
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                      onClick={() => handleSort('stock')}
                    >
                      <div className="flex items-center">
                        Stock
                        <FaSort className="ml-2 w-3 h-3" />
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                      onClick={() => handleSort('prix')}
                    >
                      <div className="flex items-center">
                        Prix
                        <FaSort className="ml-2 w-3 h-3" />
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <div className="flex items-center">
                        Statut
                      </div>
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className={darkMode ? 'bg-[#232326] divide-y divide-gray-700' : 'bg-white divide-y divide-gray-200' } >
                  {filteredOeuvres.map((oeuvre) => (
                    <tr
                      key={oeuvre.id}
                      className={`transition-colors duration-150 ${selectedOeuvres.includes(oeuvre.id) ? (darkMode ? 'bg-green-900' : 'bg-green-50') : ''} ${darkMode ? 'hover:bg-[#18181b]' : 'hover:bg-gray-50'} `}
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedOeuvres.includes(oeuvre.id)}
                          onChange={() => handleSelectOeuvre(oeuvre.id)}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <FaPalette className="h-5 w-5 text-green-600" />
                          </div>
                          <div className="ml-4">
                            <div className={`text-sm font-medium text-gray-900 ${darkMode ? 'text-white' : ''}`}>{oeuvre.titre}</div>
                            <div className={`text-sm text-gray-500 ${darkMode ? 'text-gray-400' : ''}`}>{oeuvre.technique}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          {oeuvre.description ? (
                            <div className="max-w-xs truncate" title={oeuvre.description}>
                              {oeuvre.description.length > 50 
                                ? `${oeuvre.description.substring(0, 50)}...` 
                                : oeuvre.description}
                            </div>
                          ) : (
                            <span className="text-gray-400">Aucune description</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          {oeuvre.image_principale ? (
                            <img 
                              src={oeuvre.image_principale} 
                              alt={oeuvre.titre}
                              className="h-10 w-10 rounded object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded bg-gray-200 flex items-center justify-center">
                              <FaImage className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex -space-x-2">
                          {oeuvre.images_secondaires && oeuvre.images_secondaires.length > 0 ? (
                            oeuvre.images_secondaires.map((image, index) => (
                              <img
                                key={index}
                                src={image}
                                alt={`${oeuvre.titre} - Image ${index + 1}`}
                                className="h-8 w-8 rounded-full border-2 border-white object-cover"
                              />
                            ))
                          ) : (
                            <span className="text-gray-400 text-sm">Aucune</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{oeuvre.dimensions}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{oeuvre.annee}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{oeuvre.technique}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{oeuvre.remarque}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 rounded-full px-2 py-1 bg-blue-200">{oeuvre.artiste?.nom}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 rounded-full px-2 py-1 bg-yellow-200">{oeuvre.expositions?.titre || 'Aucune'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap items-center gap-2 text-sm">
                          {oeuvre.evenements && oeuvre.evenements.length > 0 ? (
                            oeuvre.evenements.map((evenement, index) => (
                              <span
                                key={evenement.id || index}
                                className="bg-[#972924] text-white px-3 py-1 rounded-full text-xs font-semibold"
                              >
                                {typeof evenement === 'object' ? evenement.titre : evenement}
                              </span>
                            ))
                          ) : (
                            <span className="bg-[#972924] text-white px-3 py-1 rounded-full text-xs font-semibold">
                              Aucun événement
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{oeuvre.stock}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{oeuvre.prix} €</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button 
                            onClick={() => handleTogglePublish(oeuvre)} 
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300 hover:scale-110 ${oeuvre.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`} 
                            title={oeuvre.published ? 'Cliquer pour dépublier' : 'Cliquer pour publier'}>
                          <motion.div 
                            whileHover={{ scale: 1.1 }} 
                            whileTap={{ scale: 0.9 }} 
                            className="flex items-center">
                              {oeuvre.published ? (
                                <FaEye className="w-3 h-3 mr-1" />
                              ) : (
                                <FaEyeSlash className="w-3 h-3 mr-1" />
                              )}
                              {oeuvre.published ? 'Publié' : 'Non publié'}
                          </motion.div>
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={() => handleEditClick(oeuvre)}
                            className="text-green-600 hover:text-green-900 transition-colors duration-200 flex items-center"
                          >
                            <FaEdit className="w-4 h-4 mr-1" />
                            Éditer
                          </button>
                          <button
                            onClick={() => handleDelete(oeuvre.id)}
                            className="text-red-600 hover:text-red-900 transition-colors duration-200 flex items-center"
                          >
                            <FaTrash className="w-4 h-4 mr-1" />
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredOeuvres.length === 0 && (
                    <tr>
                      <td colSpan={9} className={`px-6 py-12 text-center ${darkMode ? 'bg-[#232326] text-gray-500' : ''}`}>
                        <div className={`${darkMode ? 'text-gray-500' : 'text-gray-400'} flex flex-col items-center`}>
                          <FaPalette className="w-12 h-12 mb-4" />
                          <p className="text-lg">Aucune œuvre trouvée</p>
                          <p className="text-sm mt-1">
                            {searchTerm || statusFilter !== 'all'
                              ? 'Essayez de modifier vos critères de recherche'
                              : 'Ajoutez votre première œuvre'}
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
                  <div className="flex items-center gap-3">
                    <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${darkMode ? 'bg-[#972924]' : 'bg-[#972924]'}`}> 
                      <FaPalette className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold" style={{ fontFamily: 'Kenyan Coffee, sans-serif' }}>{modalMode === 'add' ? 'Ajouter une œuvre' : 'Modifier une œuvre'}</h3>
                    </div>
                    <button
                      onClick={() => setShowFormModal(false)}
                      className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-800'} transition-colors ml-auto`}
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
                      <label htmlFor="description" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Description *</label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full rounded-lg shadow-sm sm:text-sm p-3 border h-24 ${darkMode ? 'bg-[#0C0C0C] border-gray-700 text-white focus:border-[#972924] focus:ring-[#972924]' : 'border-gray-300 bg-white text-black focus:border-[#972924] focus:ring-[#972924]'}`}
                        required
                        maxLength={500}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="dimensions" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Dimensions</label>
                        <input
                          type="text"
                          id="dimensions"
                          name="dimensions"
                          value={formData.dimensions}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full rounded-lg shadow-sm sm:text-sm p-3 border ${darkMode ? 'bg-[#0C0C0C] border-gray-700 text-white focus:border-[#972924] focus:ring-[#972924]' : 'border-gray-300 bg-white text-black focus:border-[#972924] focus:ring-[#972924]'}`}
                          placeholder="ex: 100x100 cm"
                        />
                      </div>
                      <div>
                        <label htmlFor="technique" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Technique</label>
                        <input
                          type="text"
                          id="technique"
                          name="technique"
                          value={formData.technique}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full rounded-lg shadow-sm sm:text-sm p-3 border ${darkMode ? 'bg-[#0C0C0C] border-gray-700 text-white focus:border-[#972924] focus:ring-[#972924]' : 'border-gray-300 bg-white text-black focus:border-[#972924] focus:ring-[#972924]'}`}
                          placeholder="ex: Huile sur toile"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="annee" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Année</label>
                        <input
                          type="number"
                          id="annee"
                          name="annee"
                          value={formData.annee}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full rounded-lg shadow-sm sm:text-sm p-3 border ${darkMode ? 'bg-[#0C0C0C] border-gray-700 text-white focus:border-[#972924] focus:ring-[#972924]' : 'border-gray-300 bg-white text-black focus:border-[#972924] focus:ring-[#972924]'}`}
                          min="1900"
                          max={new Date().getFullYear()}
                        />
                      </div>
                      <div>
                        <label htmlFor="prix" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Prix (€)</label>
                        <input
                          type="number"
                          id="prix"
                          name="prix"
                          value={formData.prix}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full rounded-lg shadow-sm sm:text-sm p-3 border ${darkMode ? 'bg-[#0C0C0C] border-gray-700 text-white focus:border-[#972924] focus:ring-[#972924]' : 'border-gray-300 bg-white text-black focus:border-[#972924] focus:ring-[#972924]'}`}
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="image_principale" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Image principale (PNG ou JPG) *</label>
                      <div
                        className={`mt-1 flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200 ${darkMode ? 'border-gray-700 bg-[#18181b] hover:border-[#972924]' : 'border-gray-300 bg-white hover:border-[#972924]'}`}
                        style={{ minHeight: '120px', position: 'relative' }}
                        onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
                        onDrop={e => {
                          e.preventDefault();
                          e.stopPropagation();
                          const file = e.dataTransfer.files[0];
                          console.log('Main image drop event', e.dataTransfer.files);
                          if (file) handleMainImageChange({ target: { files: [file] } });
                        }}
                      >
                        <span className="text-xs mb-2">Glissez-déposez ou cliquez pour sélectionner une image principale</span>
                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            document.getElementById('main-image-input').click();
                          }}
                          className={`px-3 py-1 rounded bg-[#972924] text-white text-xs mt-2`}
                        >Choisir un fichier</button>
                      </div>
                      <input
                        type="file"
                        id="main-image-input"
                        name="image_principale"
                        accept="image/png, image/jpeg"
                        onChange={handleMainImageChange}
                        className="hidden"
                        required={modalMode === 'add'}
                      />
                      {previewImage && (
                        <div className="mt-2 relative group w-full flex justify-center">
                          <img src={previewImage} alt="Aperçu" className="max-h-40 rounded-lg shadow object-contain" />
                          <button type="button" onClick={handleRemoveMainImage} className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100"><FaTrash className="w-4 h-4" /></button>
                        </div>
                      )}
                    </div>
                    <div>
                      <label htmlFor="images_secondaires" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Images secondaires (PNG ou JPG)</label>
                      <div
                        className={`mt-1 flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200 ${darkMode ? 'border-gray-700 bg-[#18181b] hover:border-[#972924]' : 'border-gray-300 bg-white hover:border-[#972924]'}`}
                        style={{ minHeight: '120px', position: 'relative' }}
                        onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
                        onDrop={e => {
                          e.preventDefault();
                          e.stopPropagation();
                          const files = Array.from(e.dataTransfer.files);
                          console.log('Secondary images drop event', e.dataTransfer.files);
                          if (files.length > 0) handleSecondaryImagesChange({ target: { files } });
                        }}
                      >
                        <span className="text-xs mb-2">Glissez-déposez ou cliquez pour sélectionner des images secondaires</span>
                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            document.getElementById('secondary-images-input').click();
                          }}
                          className={`px-3 py-1 rounded bg-[#972924] text-white text-xs mt-2`}
                        >Choisir des fichiers</button>
                      </div>
                      <input
                        type="file"
                        id="secondary-images-input"
                        name="images_secondaires"
                        accept="image/png, image/jpeg"
                        onChange={handleSecondaryImagesChange}
                        multiple
                        className="hidden"
                      />
                      {previewSecondaryImages.length > 0 && (
                        <div className="mt-2 grid grid-cols-4 gap-2 w-full">
                          {previewSecondaryImages.map((image, index) => (
                            <div key={index} className="relative group">
                              <img src={image} alt={`Aperçu ${index + 1}`} className="h-20 w-20 object-cover rounded shadow" />
                              <button type="button" onClick={() => handleRemoveSecondaryImage(index)} className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100"><FaTrash className="w-3 h-3" /></button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className={`rounded-lg p-4 mb-6 ${darkMode ? 'bg-[#232326] border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}> 
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="artiste_id" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Artiste *</label>
                          <select
                            id="artiste_id"
                            name="artiste_id"
                            value={formData.artiste_id}
                            onChange={handleInputChange}
                            className={`mt-1 block w-full rounded-lg shadow-sm sm:text-sm p-3 border ${darkMode ? 'bg-[#0C0C0C] border-gray-700 text-white focus:border-[#972924] focus:ring-[#972924]' : 'border-gray-300 bg-white text-black focus:border-[#972924] focus:ring-[#972924]'}`}
                            required
                          >
                            <option value="">Sélectionner un artiste</option>
                            {artistes.map(artiste => (
                              <option key={artiste.id} value={artiste.id}>{artiste.nom}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label htmlFor="exposition_id" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Exposition</label>
                          <select
                            id="exposition_id"
                            name="exposition_id"
                            value={formData.exposition_id}
                            onChange={handleInputChange}
                            className={`mt-1 block w-full rounded-lg shadow-sm sm:text-sm p-3 border ${darkMode ? 'bg-[#0C0C0C] border-gray-700 text-white focus:border-[#972924] focus:ring-[#972924]' : 'border-gray-300 bg-white text-black focus:border-[#972924] focus:ring-[#972924]'}`}
                          >
                            <option value="">Aucune</option>
                            {expositions.map(expo => (
                              <option key={expo.id} value={expo.id}>{expo.titre}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Événements associés</label>
                        <div className={`max-h-32 overflow-y-auto p-2 border rounded-lg ${darkMode ? 'border-gray-600 bg-[#0C0C0C]' : 'border-gray-300 bg-white'}`}> 
                          {evenements.length > 0 ? (
                            evenements.map(evenement => (
                              <div key={evenement.id} className="flex items-center">
                                <input
                                  id={`evenement-${evenement.id}`}
                                  name="evenements"
                                  type="checkbox"
                                  value={evenement.id}
                                  checked={formData.evenements && formData.evenements.includes(String(evenement.id))}
                                  onChange={e => {
                                    const checked = e.target.checked;
                                    setFormData(prev => {
                                      const prevEvs = prev.evenements || [];
                                      return {
                                        ...prev,
                                        evenements: checked
                                          ? [...prevEvs, String(evenement.id)]
                                          : prevEvs.filter(id => id !== String(evenement.id))
                                      };
                                    });
                                  }}
                                  className={`h-4 w-4 rounded ${darkMode ? 'bg-[#18181b] border-gray-600' : 'bg-white border-gray-300'}`}
                                />
                                <label htmlFor={`evenement-${evenement.id}`} className={`ml-2 text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{evenement.titre}</label>
                              </div>
                            ))
                          ) : (
                            <span className="text-gray-400 text-sm">Aucun événement</span>
                          )}
                        </div>
                      </div>
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
                        <option value="true">Publiée</option>
                        <option value="false">Non publiée</option>
                      </select>
                    </div>
                  </div>
                  <div className={`px-6 py-4 flex justify-end space-x-3 rounded-b-xl ${darkMode ? 'bg-[#0C0C0C] border-t border-gray-700' : 'bg-gray-50 border-t border-gray-200'}`}>
                    <button
                      type="button"
                      onClick={() => setShowFormModal(false)}
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
          </AnimatePresence>
        )}

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

export default OeuvresList;
