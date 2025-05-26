import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaNewspaper, FaSearch, FaFilter, FaSort, FaTrash, FaArrowLeft, FaPlus, FaEdit, FaCalendarAlt, FaImage, FaEye, FaEyeSlash } from 'react-icons/fa';

const ActualitesList = () => {
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
  
  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  
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
  
  const [actualiteToDelete, setActualiteToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch actualités
  useEffect(() => {
    const fetchActualites = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch('/actualites/api/admin');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setActualites(data);
      } catch (error) {
        console.error('Fetch error:', error);
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
    setModalMode('edit');
    setShowFormModal(true);
  };

  // Submit form (add/edit)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const url = modalMode === 'add' 
        ? '/actualites/new' 
        : `/actualites/edit/${formData.id}`;
      
      const method = modalMode === 'add' ? 'POST' : 'PUT';
      
      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Erreur lors de la sauvegarde');
      }
      
      if (modalMode === 'add') {
        setActualites(prev => [{
          ...formData,
          id: Date.now()
        }, ...prev]);
      } else {
        setActualites(prev => prev.map(item => 
          item.id === formData.id ? {...item, ...formData} : item
        ));
      }
      
      setShowFormModal(false);
      setSuccessMessage(`Actualité ${modalMode === 'add' ? 'ajoutée' : 'modifiée'} avec succès!`);
      setTimeout(() => setSuccessMessage(''), 3000);

    } catch (error) {
      console.error('Form submission error:', error);
      setError(error.message || 'Une erreur est survenue');
      setTimeout(() => setError(''), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete functions
  const handleDeleteClick = (id) => {
    setActualiteToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/actualites/supprimer/${actualiteToDelete}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }
      
      setActualites(prev => prev.filter(item => item.id !== actualiteToDelete));
      setShowDeleteModal(false);
      setSuccessMessage('Actualité supprimée avec succès!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Delete error:', error);
      setError(error.message || 'Erreur lors de la suppression');
      setTimeout(() => setError(''), 5000);
    } finally {
      setIsSubmitting(false);
      setActualiteToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setActualiteToDelete(null);
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedNews.length} actualités ?`)) {
      setIsSubmitting(true);
      try {
        await Promise.all(selectedNews.map(id => 
          fetch(`/actualites/supprimer/${id}`, { method: 'DELETE' })
        ));
        setActualites(actualites.filter(item => !selectedNews.includes(item.id)));
        setSelectedNews([]);
        setSuccessMessage(`${selectedNews.length} actualités supprimées avec succès!`);
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        console.error('Bulk delete error:', error);
        setError('Erreur lors de la suppression des actualités');
        setTimeout(() => setError(''), 5000);
      } finally {
        setIsSubmitting(false);
      }
    }
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

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto relative">
      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-green-500 text-white px-4 py-2 rounded-md shadow-lg animate-fadeInOut">
            {successMessage}
          </div>
        </div>
      )}
      
      {/* Error Message */}
      {error && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-red-500 text-white px-4 py-2 rounded-md shadow-lg animate-fadeInOut">
            {error}
          </div>
        </div>
      )}

      {/* Page header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Gestion des actualités</h1>
          <p className="text-gray-500 mt-1">Créez et gérez les actualités de votre site</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Link
            to="/admin/"
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg shadow hover:shadow-md transition-all duration-200 flex items-center justify-center text-sm sm:text-base"
          >
            <FaArrowLeft className="w-4 h-4 mr-2" />
            Retour au dashboard
          </Link>

          <button
            onClick={handleAddClick}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow hover:shadow-md transition-all duration-200 flex items-center justify-center text-sm sm:text-base"
          >
            <FaPlus className="w-4 h-4 mr-2" />
            Ajouter une actualité
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
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="published">Publiées</option>
                  <option value="unpublished">Non publiées</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedNews.length > 0 && (
        <div className="mb-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg flex items-center justify-between">
          <span className="text-indigo-800">
            {selectedNews.length} actualité{selectedNews.length > 1 ? 's' : ''} sélectionnée{selectedNews.length > 1 ? 's' : ''}
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

      {/* Content */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div 
              key={`skeleton-${i}`} 
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden"
            >
              <div className="animate-pulse flex space-x-4">
                <div className="flex-1 space-y-4 py-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="text-red-500 flex flex-col items-center">
            <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-lg font-medium">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Réessayer
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {filteredNews.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 flex flex-col items-center">
                <FaNewspaper className="w-12 h-12 mb-4" />
                <p className="text-lg font-medium">Aucune actualité trouvée</p>
                <p className="text-sm mt-2">
                  {searchTerm || statusFilter !== 'all'
                    ? 'Essayez de modifier vos critères de recherche'
                    : 'Commencez par ajouter une nouvelle actualité'}
                </p>
                <button
                  onClick={handleAddClick}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center"
                >
                  <FaPlus className="w-4 h-4 mr-2" />
                  Ajouter une actualité
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3">
                      <input
                        type="checkbox"
                        checked={selectedNews.length === filteredNews.length}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                      onClick={() => handleSort('titre')}
                    >
                      <div className="flex items-center">
                        Titre
                        <FaSort className="ml-2 w-3 h-3" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                      onClick={() => handleSort('date')}
                    >
                      <div className="flex items-center">
                        Date
                        <FaSort className="ml-2 w-3 h-3" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredNews.map((actualite) => (
                    <tr 
                      key={actualite.id}
                      className={`hover:bg-gray-50 transition-colors ${
                        selectedNews.includes(actualite.id) ? 'bg-indigo-50' : ''
                      }`}
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
                            <div className="text-sm font-medium text-gray-900">
                              {actualite.titre || actualite.title || 'Sans titre'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 line-clamp-2 max-w-xs">
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
                        {actualite.image ? (
                          <img 
                            src={actualite.image}
                            alt="Actualité"
                            className="h-10 w-10 rounded-lg object-cover"
                            
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                            <FaImage className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          (actualite.published || actualite.isPublished) 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          <div className="flex items-center">
                            {(actualite.published || actualite.isPublished) 
                              ? <FaEye className="w-3 h-3 mr-1" />
                              : <FaEyeSlash className="w-3 h-3 mr-1" />
                            }
                            {(actualite.published || actualite.isPublished) ? 'Publié' : 'Non publié'}
                          </div>
                        </span>
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
          )}
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
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">URL de l&apos;image *</label>
                    <input
                      type="text"
                      id="image"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                      required
                      placeholder="https://example.com/image.jpg"
                    />
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
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300">
            <div className="absolute inset-0 border-8 border-white/10 rounded-lg pointer-events-none"></div>
          </div>
          
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="relative bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-md transform transition-all animate-fadeInUp">
              <div className="bg-gradient-to-r from-red-500 to-pink-600 p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-white/20 rounded-full flex items-center justify-center">
                    <FaTrash className="h-5 w-5 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-white">Confirmer la suppression</h3>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="text-center">
                  <p className="text-gray-700 mb-4">
                    Êtes-vous sûr de vouloir supprimer cette actualité ?
                  </p>
                  <p className="text-sm text-gray-500">
                    Cette action est irréversible et supprimera définitivement l&apos;actualité.
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                <button
                  onClick={handleDeleteCancel}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-24"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Suppression...
                    </>
                  ) : 'Supprimer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActualitesList;