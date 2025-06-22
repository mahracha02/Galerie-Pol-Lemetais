import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaFilter, FaSort, FaTrash, FaArrowLeft, FaPlus, FaEdit, FaUser, FaImage, FaEye, FaEyeSlash } from 'react-icons/fa';

const ArtistesList = () => {
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
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('adminDarkMode') === 'false' ? false : true;
    }
    return true;
  });

  // Form data
  const [formData, setFormData] = useState({
    id: '',
    nom: '',
    biographie: '',
    photo: null,
    site_url: '',
    published: false
  });

  useEffect(() => {
    const handleMode = () => {
      setDarkMode(localStorage.getItem('adminDarkMode') === 'false' ? false : true);
    };
    window.addEventListener('storage', handleMode);
    handleMode();
    return () => window.removeEventListener('storage', handleMode);
  }, []);

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
  };

  useEffect(() => {
    const fetchArtistes = async () => {
      try {
        const response = await fetch('/artistes/api/');
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

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet artiste ?')) {
      try {
        const response = await fetch(`/artistes/api/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Erreur lors de la suppression');
        setArtistes(artistes.filter(artiste => artiste.id !== id));
        setSelectedArtistes(selectedArtistes.filter(artisteId => artisteId !== id));
      } catch (error) {
        setError('Impossible de supprimer l\'artiste. Veuillez réessayer.');
        console.error(error);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedArtistes.length} artistes ?`)) {
      try {
        await Promise.all(selectedArtistes.map(id => 
          fetch(`/artistes/api/${id}`, { method: 'DELETE' })
        ));
        setArtistes(artistes.filter(artiste => !selectedArtistes.includes(artiste.id)));
        setSelectedArtistes([]);
      } catch (error) {
        setError('Impossible de supprimer les artistes. Veuillez réessayer.');
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
      biographie: '',
      photo: null,
      site_url: '',
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
      biographie: artiste.biographie,
      photo: artiste.photo,
      site_url: artiste.site_url,
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

  // Submit form (add/edit)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const url = modalMode === 'add' 
        ? '/artistes/api/add' 
        : `/artistes/api/edit/${formData.id}`;
      
      const method = modalMode === 'add' ? 'POST' : 'PUT';
      
      const formDataToSend = new FormData();
      
      // Append all regular fields
      formDataToSend.append('nom', formData.nom);
      formDataToSend.append('biographie', formData.biographie);
      formDataToSend.append('site_url', formData.site_url);
      formDataToSend.append('published', formData.published);
  
      // Handle image upload
      if (formData.photo instanceof File) {
        console.log('Uploading new file:', formData.photo);
        formDataToSend.append('photo', formData.photo);
      } else if (modalMode === 'edit' && typeof formData.photo === 'string') {
        const imagePath = formData.photo.split('/').pop();
        console.log('Using existing image:', imagePath);
        formDataToSend.append('existing_photo', imagePath);
      } else if (modalMode === 'add') {
        throw new Error('Veuillez sélectionner une photo');
      }
  
      console.log('Sending form data:', {
        url,
        method,
        formData: Object.fromEntries(formDataToSend.entries())
      });

      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Server error response:', errorData);
        throw new Error(errorData.message || errorData.detail || `Erreur ${response.status}: ${response.statusText}`);
      }
      
      const responseData = await response.json();
      console.log('Server response:', responseData);
      
      // Refresh the artistes list
      const updatedResponse = await fetch('/artistes/api/');
      if (!updatedResponse.ok) throw new Error('Erreur lors de la récupération');
      const updatedData = await updatedResponse.json();
      setArtistes(updatedData);
      
      setShowFormModal(false);
      setSuccessMessage(`Artiste ${modalMode === 'add' ? 'ajouté' : 'modifié'} avec succès!`);
      setTimeout(() => setSuccessMessage(''), 3000);
  
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Une erreur est survenue lors de la soumission du formulaire');
      setTimeout(() => setError(''), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen w-full ${darkMode ? 'bg-[#18181b] text-white' : 'bg-[#f7f7f7] text-[#18181b]'} p-0`} style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-green-500 text-white px-4 py-2 rounded-md shadow-lg animate-fadeInOut">
            {successMessage}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Artistes</h1>
          <p className="text-gray-500 mt-1">Gérez les artistes de votre site</p>
        </div>

        <div className="flex flex-wrap gap-4">
          <Link
            to="/admin/"
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center"
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
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center"
          >
            <FaFilter className="w-4 h-4 mr-2" />
            Filtres
          </button>
        </div>

        {showFilters && (
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut de publication</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="published">Publiés</option>
                  <option value="unpublished">Non publiés</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      {/* Bulk Actions */}
      {selectedArtistes.length > 0 && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
          <span className="text-green-800">
            {selectedArtistes.length} artiste{selectedArtistes.length > 1 ? 's' : ''} sélectionné{selectedArtistes.length > 1 ? 's' : ''}
          </span>
          <button
            onClick={handleBulkDelete}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 flex items-center"
          >
            <FaTrash className="w-4 h-4 mr-2" />
            Supprimer la sélection
          </button>
        </div>
      )}

      {/* Artistes Table */}
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
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedArtistes.length === filteredArtistes.length}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    onClick={() => handleSort('nom')}
                  >
                    <div className="flex items-center">
                      Artiste
                      <FaSort className="ml-2 w-3 h-3" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex items-center">
                      Biographie
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex items-center">
                      Photo
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex items-center">
                      Site web
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
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredArtistes.map((artiste) => (
                  <tr 
                    key={artiste.id} 
                    className={`hover:bg-gray-50 transition-colors duration-150 ${
                      selectedArtistes.includes(artiste.id) ? 'bg-green-50' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedArtistes.includes(artiste.id)}
                        onChange={() => handleSelectArtiste(artiste.id)}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <FaUser className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{artiste.nom}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        {artiste.biographie ? (
                          <div className="max-w-xs truncate" title={artiste.biographie}>
                            {artiste.biographie.length > 50 
                              ? `${artiste.biographie.substring(0, 50)}...` 
                              : artiste.biographie}
                          </div>
                        ) : (
                          <span className="text-gray-400">Aucune biographie</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        {artiste.photo ? (
                          <img 
                            src={artiste.photo} 
                            alt={artiste.nom}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <FaImage className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        {artiste.site_url ? (
                          <a 
                            href={artiste.site_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            {artiste.site_url}
                          </a>
                        ) : (
                          <span className="text-gray-400">Non spécifié</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        artiste.published 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        <div className="flex items-center">
                          {artiste.published 
                            ? <FaEye className="w-3 h-3 mr-1" />
                            : <FaEyeSlash className="w-3 h-3 mr-1" />
                          }
                          {artiste.published ? 'Publié' : 'Non publié'}
                        </div>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => handleEditClick(artiste)}
                          className="text-green-600 hover:text-green-900 transition-colors duration-200 flex items-center"
                        >
                          <FaEdit className="w-4 h-4 mr-1" />
                          Éditer
                        </button>
                        <button
                          onClick={() => handleDelete(artiste.id)}
                          className="text-red-600 hover:text-red-900 transition-colors duration-200 flex items-center"
                        >
                          <FaTrash className="w-4 h-4 mr-1" />
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredArtistes.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="text-gray-400 flex flex-col items-center">
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
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300">
            <div className="absolute inset-0 border-8 border-white/10 rounded-lg pointer-events-none"></div>
          </div>
          
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="relative bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-2xl transform transition-all animate-fadeInUp">
              {/* Modal header */}
              <div className={`bg-gradient-to-r ${modalMode === 'add' ? 'from-green-500 to-emerald-600' : 'from-blue-500 to-indigo-600'} p-4`}>
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
                        {modalMode === 'add' ? 'Ajouter un artiste' : 'Modifier un artiste'}
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
                    <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                    <input
                      type="text"
                      id="nom"
                      name="nom"
                      value={formData.nom}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                      required
                      maxLength={100}
                    />
                  </div>

                  <div>
                    <label htmlFor="biographie" className="block text-sm font-medium text-gray-700 mb-1">Biographie *</label>
                    <textarea
                      id="biographie"
                      name="biographie"
                      value={formData.biographie}
                      onChange={handleInputChange}  
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border h-32"
                      required
                      maxLength={500}
                    />
                  </div>

                  <div>
                    <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-1">
                      Sélectionner une photo (PNG ou JPG) *
                    </label>
                    <input
                      type="file"
                      id="photo"
                      name="photo"
                      accept="image/png, image/jpeg"
                      onChange={handleFileChange}
                      className="mt-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-md cursor-pointer focus:outline-none p-2"
                      required={modalMode === 'add'}
                    />

                    {previewImage && (
                      <div className="mt-2 relative">
                        <img
                          src={previewImage}
                          alt="Aperçu"
                          className="max-h-40 rounded shadow"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                          aria-label="Remove image"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="site_url" className="block text-sm font-medium text-gray-700 mb-1">URL du site</label>
                    <input
                      type="text"
                      id="site_url"
                      name="site_url"
                      value={formData.site_url}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                      placeholder="https://example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="published" className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                    <select
                      id="published"
                      name="published"
                      value={formData.published ? 'true' : 'false'}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    >
                      <option value="true">Publié</option>
                      <option value="false">Non publié</option>
                    </select>
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtistesList;
