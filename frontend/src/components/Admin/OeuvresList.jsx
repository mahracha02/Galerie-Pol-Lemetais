import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaFilter, FaSort, FaTrash, FaArrowLeft, FaPlus, FaEdit, FaImage, FaEye, FaEyeSlash, FaPalette } from 'react-icons/fa';

const OeuvresList = () => {
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
    published: false
  });

  // Handle main image
  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('Main image selected:', file);
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
      console.log('Secondary images selected:', files);
      setFormData(prev => ({ ...prev, images_secondaires: files }));
      
      const previews = files.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(previews).then(results => {
        setPreviewSecondaryImages(results);
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

  useEffect(() => {
    const fetchOeuvres = async () => {
      try {
        const response = await fetch('/oeuvres/api/');
        if (!response.ok) throw new Error('Erreur lors de la récupération');
        const data = await response.json();
        setOeuvres(data);
      } catch (error) {
        setError('Impossible de charger les œuvres. Veuillez réessayer.');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOeuvres();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette œuvre ?')) {
      try {
        const response = await fetch(`/oeuvres/api/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Erreur lors de la suppression');
        setOeuvres(oeuvres.filter(oeuvre => oeuvre.id !== id));
        setSelectedOeuvres(selectedOeuvres.filter(oeuvreId => oeuvreId !== id));
      } catch (error) {
        setError('Impossible de supprimer l\'œuvre. Veuillez réessayer.');
        console.error(error);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedOeuvres.length} œuvres ?`)) {
      try {
        await Promise.all(selectedOeuvres.map(id => 
          fetch(`/oeuvres/api/${id}`, { method: 'DELETE' })
        ));
        setOeuvres(oeuvres.filter(oeuvre => !selectedOeuvres.includes(oeuvre.id)));
        setSelectedOeuvres([]);
      } catch (error) {
        setError('Impossible de supprimer les œuvres. Veuillez réessayer.');
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
      if (sortField === 'titre') {
        return direction * a.titre.localeCompare(b.titre);
      }
      if (sortField === 'annee') {
        return direction * (a.annee - b.annee);
      }
      if (sortField === 'prix') {
        return direction * (a.prix - b.prix);
      }
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
      prev.includes(oeuvreId) 
        ? prev.filter(id => id !== oeuvreId)
        : [...prev, oeuvreId]
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
      published: false
    });
    setPreviewImage(null);
    setPreviewSecondaryImages([]);
  };

  // Open add modal
  const handleAddClick = () => {
    resetForm();
    setModalMode('add');
    setShowFormModal(true);
  };

  // Open edit modal
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
      artiste_id: oeuvre.artiste_id,
      exposition_id: oeuvre.exposition_id,
      published: oeuvre.published || false
    });

    if (oeuvre.image_principale) {
      setPreviewImage(oeuvre.image_principale);
    } else {
      setPreviewImage(null);
    }

    if (oeuvre.images_secondaires && oeuvre.images_secondaires.length > 0) {
      setPreviewSecondaryImages(oeuvre.images_secondaires);
    } else {
      setPreviewSecondaryImages([]);
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
        ? '/oeuvres/api/add' 
        : `/oeuvres/api/edit/${formData.id}`;
      
      const method = modalMode === 'add' ? 'POST' : 'PUT';
      
      const formDataToSend = new FormData();
      
      // Append all regular fields
      formDataToSend.append('titre', formData.titre);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('dimensions', formData.dimensions);
      formDataToSend.append('technique', formData.technique);
      formDataToSend.append('annee', formData.annee);
      formDataToSend.append('prix', formData.prix);
      formDataToSend.append('artiste_id', formData.artiste_id);
      formDataToSend.append('exposition_id', formData.exposition_id);
      formDataToSend.append('published', formData.published);
  
      // Handle main image upload
      if (formData.image_principale instanceof File) {
        console.log('Uploading new main image:', formData.image_principale);
        formDataToSend.append('image_principale', formData.image_principale);
      } else if (modalMode === 'edit' && typeof formData.image_principale === 'string') {
        const imagePath = formData.image_principale.split('/').pop();
        console.log('Using existing main image:', imagePath);
        formDataToSend.append('existing_image_principale', imagePath);
      } else if (modalMode === 'add') {
        throw new Error('Veuillez sélectionner une image principale');
      }

      // Handle secondary images upload
      if (formData.images_secondaires.length > 0) {
        formData.images_secondaires.forEach((image, index) => {
          if (image instanceof File) {
            formDataToSend.append(`images_secondaires`, image);
          } else if (modalMode === 'edit' && typeof image === 'string') {
            const imagePath = image.split('/').pop();
            formDataToSend.append(`existing_images_secondaires`, imagePath);
          }
        });
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
      
      // Refresh the oeuvres list
      const updatedResponse = await fetch('/oeuvres/api/');
      if (!updatedResponse.ok) throw new Error('Erreur lors de la récupération');
      const updatedData = await updatedResponse.json();
      setOeuvres(updatedData);
      
      setShowFormModal(false);
      setSuccessMessage(`Œuvre ${modalMode === 'add' ? 'ajoutée' : 'modifiée'} avec succès!`);
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
    <div className="p-6 md:p-8 max-w-7xl mx-auto relative">
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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Œuvres</h1>
          <p className="text-gray-500 mt-1">Gérez les œuvres de votre site</p>
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
              placeholder="Rechercher une œuvre..."
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
                  <option value="published">Publiées</option>
                  <option value="unpublished">Non publiées</option>
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
      {selectedOeuvres.length > 0 && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
          <span className="text-green-800">
            {selectedOeuvres.length} œuvre{selectedOeuvres.length > 1 ? 's' : ''} sélectionnée{selectedOeuvres.length > 1 ? 's' : ''}
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
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
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
                    onClick={() => handleSort('annee')}
                  >
                    <div className="flex items-center">
                      Année
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
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOeuvres.map((oeuvre) => (
                  <tr 
                    key={oeuvre.id} 
                    className={`hover:bg-gray-50 transition-colors duration-150 ${
                      selectedOeuvres.includes(oeuvre.id) ? 'bg-green-50' : ''
                    }`}
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
                          <div className="text-sm font-medium text-gray-900">{oeuvre.titre}</div>
                          <div className="text-sm text-gray-500">{oeuvre.technique}</div>
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
                      <div className="text-sm text-gray-500">{oeuvre.annee}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{oeuvre.prix} €</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        oeuvre.published 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        <div className="flex items-center">
                          {oeuvre.published 
                            ? <FaEye className="w-3 h-3 mr-1" />
                            : <FaEyeSlash className="w-3 h-3 mr-1" />
                          }
                          {oeuvre.published ? 'Publiée' : 'Non publiée'}
                        </div>
                      </span>
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
                    <td colSpan={9} className="px-6 py-12 text-center">
                      <div className="text-gray-400 flex flex-col items-center">
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
                        {modalMode === 'add' ? 'Ajouter une œuvre' : 'Modifier une œuvre'}
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
                      <label htmlFor="dimensions" className="block text-sm font-medium text-gray-700 mb-1">Dimensions</label>
                      <input
                        type="text"
                        id="dimensions"
                        name="dimensions"
                        value={formData.dimensions}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        placeholder="ex: 100x100 cm"
                      />
                    </div>

                    <div>
                      <label htmlFor="technique" className="block text-sm font-medium text-gray-700 mb-1">Technique</label>
                      <input
                        type="text"
                        id="technique"
                        name="technique"
                        value={formData.technique}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        placeholder="ex: Huile sur toile"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="annee" className="block text-sm font-medium text-gray-700 mb-1">Année</label>
                      <input
                        type="number"
                        id="annee"
                        name="annee"
                        value={formData.annee}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        min="1900"
                        max={new Date().getFullYear()}
                      />
                    </div>

                    <div>
                      <label htmlFor="prix" className="block text-sm font-medium text-gray-700 mb-1">Prix (€)</label>
                      <input
                        type="number"
                        id="prix"
                        name="prix"
                        value={formData.prix}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="image_principale" className="block text-sm font-medium text-gray-700 mb-1">
                      Image principale (PNG ou JPG) *
                    </label>
                    <input
                      type="file"
                      id="image_principale"
                      name="image_principale"
                      accept="image/png, image/jpeg"
                      onChange={handleMainImageChange}
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
                          onClick={handleRemoveMainImage}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                          aria-label="Remove image"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="images_secondaires" className="block text-sm font-medium text-gray-700 mb-1">
                      Images secondaires (PNG ou JPG)
                    </label>
                    <input
                      type="file"
                      id="images_secondaires"
                      name="images_secondaires"
                      accept="image/png, image/jpeg"
                      onChange={handleSecondaryImagesChange}
                      multiple
                      className="mt-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-md cursor-pointer focus:outline-none p-2"
                    />

                    {previewSecondaryImages.length > 0 && (
                      <div className="mt-2 grid grid-cols-4 gap-2">
                        {previewSecondaryImages.map((image, index) => (
                          <div key={index} className="relative">
                            <img
                              src={image}
                              alt={`Aperçu ${index + 1}`}
                              className="h-20 w-20 object-cover rounded shadow"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveSecondaryImage(index)}
                              className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                              aria-label="Remove image"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
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
                      <option value="true">Publiée</option>
                      <option value="false">Non publiée</option>
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

export default OeuvresList;
