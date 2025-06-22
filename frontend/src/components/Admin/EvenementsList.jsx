// src/components/Admin/EvenementsList.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaUsers, FaSearch, FaFilter, FaSort, FaTrash, FaArrowLeft, FaPlus, FaEdit, FaCalendarDay, FaMapMarkerAlt, FaImage, FaEye, FaEyeSlash } from 'react-icons/fa';

const EvenementsList = () => {
  const [evenements, setEvenements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('date_debut');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedEvents, setSelectedEvents] = useState([]);
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

  // Ajouter l'état pour les artistes
  const [artistes, setArtistes] = useState([]);
  const [loadingArtistes, setLoadingArtistes] = useState(true);

  // Ajouter la fonction pour charger les artistes
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

  // Mettre à jour les fonctions de gestion du drag & drop
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

  useEffect(() => {
    const fetchEvenements = async () => {
      try {
        const response = await fetch('/evenements/api/');
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

    fetchEvenements();
    fetchArtistes();
  }, []);

  useEffect(() => {
    const handleMode = () => {
      setDarkMode(localStorage.getItem('adminDarkMode') === 'false' ? false : true);
    };
    window.addEventListener('storage', handleMode);
    handleMode();
    return () => window.removeEventListener('storage', handleMode);
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      try {
        const response = await fetch(`/evenements/api/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Erreur lors de la suppression');
        setEvenements(evenements.filter(event => event.id !== id));
        setSelectedEvents(selectedEvents.filter(eventId => eventId !== id));
      } catch (error) {
        setError('Impossible de supprimer l\'événement. Veuillez réessayer.');
        console.error(error);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedEvents.length} événements ?`)) {
      try {
        await Promise.all(selectedEvents.map(id => 
          fetch(`/evenements/api/${id}`, { method: 'DELETE' })
        ));
        setEvenements(evenements.filter(event => !selectedEvents.includes(event.id)));
        setSelectedEvents([]);
      } catch (error) {
        setError('Impossible de supprimer les événements. Veuillez réessayer.');
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

  const getEventStatus = (dateDebut, dateFin) => {
    const now = new Date();
    const debut = new Date(dateDebut);
    const fin = new Date(dateFin);
    
    if (now < debut) return 'upcoming';
    if (now > fin) return 'past';
    return 'ongoing';
  };

  const filteredEvents = evenements
    .filter(event => {
      const matchesSearch = event.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDate = dateFilter === 'all' || getEventStatus(event.date_debut, event.date_fin) === dateFilter;
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'published' && event.published) || 
        (statusFilter === 'unpublished' && !event.published);
      return matchesSearch && matchesDate && matchesStatus;
    })
    .sort((a, b) => {
      const direction = sortDirection === 'asc' ? 1 : -1;
      if (sortField === 'titre') {
        return direction * a.titre.localeCompare(b.titre);
      }
      if (sortField === 'date_debut') {
        return direction * (new Date(a.date_debut) - new Date(b.date_debut));
      }
      if (sortField === 'participants') {
        return direction * ((a.participants || 0) - (b.participants || 0));
      }
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
      prev.includes(eventId) 
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'artiste_principal') {
      // Si on change l'artiste principal, on le retire des artistes associés
      setFormData(prev => ({
        ...prev,
        artiste_principal: value,
        artistes: prev.artistes.filter(a => a.id !== parseInt(value))
      }));
    } else if (name === 'artistes') {
      // Gestion des artistes associés via les checkboxes
      const artisteId = parseInt(value);
      const isChecked = e.target.checked;
      
      setFormData(prev => ({
        ...prev,
        artistes: isChecked
          ? [...prev.artistes, { id: artisteId }]
          : prev.artistes.filter(a => a.id !== artisteId)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'published' ? value === 'true' : value
      }));
    }
  };

  // Reset form to default values
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

  // Open add modal
  const handleAddClick = () => {
    resetForm();
    setModalMode('add');
    setShowFormModal(true);
  };

  // Format date to YYYY-MM-DD
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    
    // Si la date est déjà au format YYYY-MM-DD, la retourner directement
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }

    try {
      // Essayer de parser la date en format français (ex: "27 février 2025")
      const [day, month, year] = dateString.split(' ');
      const monthMap = {
        'janvier': '01', 'février': '02', 'mars': '03', 'avril': '04',
        'mai': '05', 'juin': '06', 'juillet': '07', 'août': '08',
        'septembre': '09', 'octobre': '10', 'novembre': '11', 'décembre': '12'
      };
      
      if (day && month && year && monthMap[month.toLowerCase()]) {
        const formattedMonth = monthMap[month.toLowerCase()];
        const formattedDay = day.padStart(2, '0');
        return `${year}-${formattedMonth}-${formattedDay}`;
      }

      // Si le format français ne fonctionne pas, essayer de créer une nouvelle date
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }
    } catch (error) {
      console.error('Error formatting date:', error);
    }
    
    return ''; // Retourner une chaîne vide si la date est invalide
  };

  // Mettre à jour handleEditClick pour gérer correctement l'image
  const handleEditClick = (event) => {
    console.log('Editing event:', event);
    setFormData({
      id: event.id,
      titre: event.titre,
      description: event.description || '',
      date_debut: formatDateForInput(event.date_debut),
      date_fin: formatDateForInput(event.date_fin),
      lieu: event.lieu,
      image: event.image || null,
      site_url: event.site_url || '',
      artiste_principal: event.artiste_principal ? event.artiste_principal.id : '',
      artistes: event.artistes ? event.artistes.map(a => ({
        id: a.id,
        nom: a.nom
      })) : [],
      published: event.published || false
    });

    // Si l'image existe déjà, l'afficher directement
    if (event.image) {
      setPreviewImage(event.image);
    } else {
      setPreviewImage(null);
    }
    
    setModalMode('edit');
    setShowFormModal(true);
  };

  // Mettre à jour handleFileChange pour une meilleure compression
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0] || e.dataTransfer?.files?.[0];
    if (file) {
      try {
        console.log('Processing image:', {
          name: file.name,
          size: file.size,
          type: file.type
        });

        // Vérifier la taille maximale (2MB)
        const maxSize = 2 * 1024 * 1024; // 2MB
        if (file.size > maxSize) {
          throw new Error('L\'image est trop grande. Taille maximum: 2MB');
        }

        // Convertir et compresser l'image
        const compressedImage = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            try {
              const base64 = reader.result;
              const img = new Image();
              img.onload = () => {
                try {
                  const canvas = document.createElement('canvas');
                  const ctx = canvas.getContext('2d');

                  // Calculer les nouvelles dimensions
                  let width = img.width;
                  let height = img.height;
                  
                  // Dimensions maximales réduites
                  const maxWidth = 800;
                  const maxHeight = 600;
                  
                  // Calculer le ratio pour maintenir les proportions
                  const ratio = width / height;
                  
                  // Calculer les nouvelles dimensions en respectant le ratio
                  if (width > maxWidth) {
                    width = maxWidth;
                    height = Math.round(maxWidth / ratio);
                  }
                  if (height > maxHeight) {
                    height = maxHeight;
                    width = Math.round(maxHeight * ratio);
                  }

                  // S'assurer que les dimensions sont des nombres entiers
                  width = Math.round(width);
                  height = Math.round(height);

                  // Redimensionner l'image
                  canvas.width = width;
                  canvas.height = height;
                  ctx.drawImage(img, 0, 0, width, height);

                  // Compression plus agressive
                  let quality = 0.6; // Qualité par défaut réduite
                  if (file.size > 1.5 * 1024 * 1024) {
                    quality = 0.4;
                  } else if (file.size > 1024 * 1024) {
                    quality = 0.5;
                  }

                  // Convertir en base64 avec compression
                  const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
                  const compressedSize = Math.round(compressedBase64.length * 0.75);
                  
                  console.log('Image compressed:', {
                    originalSize: file.size,
                    compressedSize: compressedSize,
                    quality: quality,
                    dimensions: `${width}x${height}`,
                    ratio: ratio.toFixed(2)
                  });

                  // Vérifier si la taille compressée est acceptable
                  if (compressedSize > 200 * 1024) { // 200KB max
                    console.warn('Image still too large, trying more aggressive compression');
                    const moreCompressed = canvas.toDataURL('image/jpeg', quality * 0.7);
                    const newSize = Math.round(moreCompressed.length * 0.75);
                    console.log('Second compression attempt:', {
                      newSize: newSize,
                      newQuality: quality * 0.7
                    });
                    resolve(moreCompressed);
                  } else {
                    resolve(compressedBase64);
                  }
                } catch (error) {
                  console.error('Compression error:', error);
                  reject(new Error('Erreur lors de la compression de l\'image: ' + error.message));
                }
              };
              img.onerror = () => {
                console.error('Image load error');
                reject(new Error('Erreur lors du chargement de l\'image'));
              };
              img.src = base64;
            } catch (error) {
              console.error('Base64 conversion error:', error);
              reject(new Error('Erreur lors de la lecture de l\'image: ' + error.message));
            }
          };
          reader.onerror = () => {
            console.error('FileReader error');
            reject(new Error('Erreur lors de la lecture du fichier'));
          };
          reader.readAsDataURL(file);
        });

        setPreviewImage(compressedImage);
        setFormData(prev => ({ ...prev, image: compressedImage }));
      } catch (error) {
        console.error('Image processing error:', error);
        setError(error.message);
        setTimeout(() => setError(''), 5000);
      }
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setPreviewImage(null);
  };

  // Mettre à jour handleFormSubmit pour une meilleure gestion des données
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const url = modalMode === 'add' 
        ? '/evenements/api/add' 
        : `/evenements/api/edit/${formData.id}`;
      
      const method = modalMode === 'add' ? 'POST' : 'PUT';
      
      // Préparation des données
      const dataToSend = {
        ...formData,
        // Si c'est une édition et qu'il n'y a pas de nouvelle image, ne pas envoyer l'image
        image: modalMode === 'edit' && !(formData.image instanceof File) ? undefined : formData.image,
        // Nettoyer les données des artistes
        artistes: formData.artistes.map(artiste => ({
          id: artiste.id
        }))
      };

      // Nettoyer les données avant l'envoi
      Object.keys(dataToSend).forEach(key => {
        if (dataToSend[key] === null || dataToSend[key] === undefined || dataToSend[key] === '') {
          delete dataToSend[key];
        }
      });

      // Vérifier la taille des données
      const dataSize = JSON.stringify(dataToSend).length;
      console.log('Data size:', dataSize);
      
      if (dataSize > 500 * 1024) { // 500KB max
        throw new Error('Les données sont trop volumineuses. Veuillez réduire la taille de l\'image.');
      }

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
      console.log('Raw response:', responseText);

      if (!responseText) {
        throw new Error('Le serveur n\'a pas renvoyé de réponse. Veuillez réessayer.');
      }

      try {
        responseData = JSON.parse(responseText);
        console.log('Server response:', responseData);
      } catch (e) {
        console.error('Error parsing JSON response:', e);
        throw new Error('Erreur lors de la lecture de la réponse du serveur: ' + responseText);
      }

      if (!response.ok) {
        throw new Error(responseData.error || responseData.details || 'Erreur lors de la sauvegarde');
      }

      // Rafraîchir la liste des événements
      const updatedResponse = await fetch('/evenements/api/');
      if (!updatedResponse.ok) throw new Error('Erreur lors de la récupération des données');
      const updatedData = await updatedResponse.json();
      setEvenements(updatedData);
      
      setShowFormModal(false);
      setSuccessMessage(responseData.message || `Événement ${modalMode === 'add' ? 'ajouté' : 'modifié'} avec succès!`);
      setTimeout(() => setSuccessMessage(''), 3000);

    } catch (error) {
      console.error('Form submission error:', error);
      setError(error.message || 'Une erreur est survenue');
      setTimeout(() => setError(''), 5000);
    } finally {
      setIsSubmitting(false);
      setPreviewImage(null);
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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Événements</h1>
          <p className="text-gray-500 mt-1">Gérez les événements de votre site</p>
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
            Nouvel événement
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Rechercher un événement..."
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut de date</label>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="upcoming">À venir</option>
                  <option value="ongoing">En cours</option>
                  <option value="past">Passés</option>
                </select>
              </div>
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
      {selectedEvents.length > 0 && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
          <span className="text-green-800">
            {selectedEvents.length} événement{selectedEvents.length > 1 ? 's' : ''} sélectionné{selectedEvents.length > 1 ? 's' : ''}
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

      {/* Events Table */}
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
                      checked={selectedEvents.length === filteredEvents.length}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    onClick={() => handleSort('titre')}
                  >
                    <div className="flex items-center">
                      Événement
                      <FaSort className="ml-2 w-3 h-3" />
                    </div>
                  </th>
                    
                  <th 
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    
                  >
                    <div className="flex items-center">
                      Description
                    </div>
                  </th>

                  <th 
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    onClick={() => handleSort('date_debut')}
                  >
                    <div className="flex items-center">
                      Date debut
                      <FaSort className="ml-2 w-3 h-3" />
                    </div>
                  </th>

                  <th 
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    onClick={() => handleSort('date_fin')}
                  >
                    <div className="flex items-center">
                      Date fin
                      <FaSort className="ml-2 w-3 h-3" />
                    </div>
                  </th>

                  <th 
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    onClick={() => handleSort('lieu')}
                  >
                    <div className="flex items-center">
                      Lieu
                      <FaSort className="ml-2 w-3 h-3" />
                    </div>
                  </th>

                  <th 
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    
                  >
                    <div className="flex items-center">
                      Image
                    </div>
                  </th>
                  
                  <th 
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    
                  >
                    <div className="flex items-center">
                      Site url
                    </div>
                  </th>

                  <th 
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    
                  >
                    <div className="flex items-center">
                      Artiste principal
                    </div>
                  </th>

                  <th 
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    
                  >
                    <div className="flex items-center">
                      Autres artistes 
                    </div>
                  </th>

                  <th 
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
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
                {filteredEvents.map((event) => {
                  const status = getEventStatus(event.date_debut, event.date_fin);
                  return (
                    <tr 
                      key={event.id} 
                      className={`hover:bg-gray-50 transition-colors duration-150 ${
                        selectedEvents.includes(event.id) ? 'bg-green-50' : ''
                      }`}
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedEvents.includes(event.id)}
                          onChange={() => handleSelectEvent(event.id)}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <FaCalendarAlt className="h-5 w-5 text-green-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{event.titre}</div>
                            <div className="flex items-center text-sm text-gray-500">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                                status === 'ongoing' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {status === 'upcoming' ? 'À venir' :
                                 status === 'ongoing' ? 'En cours' :
                                 'Terminé'}
                              </span>
                              <span className="mx-2">•</span>
                              {event.type}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            {event.description ? (
                              <div className="max-w-xs truncate" title={event.description}>
                                {event.description.length > 50 
                                  ? `${event.description.substring(0, 50)}...` 
                                  : event.description}
                              </div>
                            ) : (
                              <span className="text-gray-400">Aucune description</span>
                            )}
                          </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <FaCalendarDay className="w-4 h-4 mr-2 text-gray-400" />
                           {event.date_debut}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <FaCalendarDay className="w-4 h-4 mr-2 text-gray-400" />
                           {event.date_fin}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <FaMapMarkerAlt className="w-4 h-4 mr-2 text-gray-400" />
                            {event.lieu}
                          </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            {event.image && (
                              <img 
                                src={event.image} 
                                alt={event.titre}
                                className="h-10 w-10 object-cover rounded"
                              />
                            )}
                          </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            {event.site_url}
                          </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            {event.artiste_principal ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {typeof event.artiste_principal === 'object' ? event.artiste_principal.nom : event.artiste_principal}
                              </span>
                            ) : (
                              <span className="text-gray-400">Non spécifié</span>
                            )}
                          </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap items-center gap-2 text-sm">
                          {event.artistes && event.artistes.length > 0 ? (
                            event.artistes.map((artiste, index) => (
                              <span
                                key={artiste.id || index}
                                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold"
                              >
                                {typeof artiste === 'object' ? artiste.nom : artiste}
                              </span>
                            ))
                          ) : (
                            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-semibold">
                              Aucun artiste
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          event.published 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          <div className="flex items-center">
                            {event.published 
                              ? <FaEye className="w-3 h-3 mr-1" />
                              : <FaEyeSlash className="w-3 h-3 mr-1" />
                            }
                            {event.published ? 'Publié' : 'Non publié'}
                          </div>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3">
                          <button
                              onClick={() => handleEditClick(event)}
                              className="text-green-600 hover:text-green-900 transition-colors duration-200 flex items-center"
                            >
                              <FaEdit className="w-4 h-4 mr-1" />
                               Éditer
                          </button>
                          <button
                            onClick={() => handleDelete(event.id)}
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
                {filteredEvents.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="text-gray-400 flex flex-col items-center">
                        <FaCalendarAlt className="w-12 h-12 mb-4" />
                        <p className="text-lg">Aucun événement trouvé</p>
                        <p className="text-sm mt-1">
                          {searchTerm || dateFilter !== 'all'
                            ? 'Essayez de modifier vos critères de recherche'
                            : 'Planifiez votre premier événement'}
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
                        {modalMode === 'add' ? 'Ajouter un événement' : 'Modifier un événement'}
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
                      <label htmlFor="date_debut" className="block text-sm font-medium text-gray-700 mb-1">Date de début *</label>
                      <input
                        type="date"
                        id="date_debut"
                        name="date_debut"
                        value={formData.date_debut}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="date_fin" className="block text-sm font-medium text-gray-700 mb-1">Date de fin *</label>
                      <input
                        type="date"
                        id="date_fin"
                        name="date_fin"
                        value={formData.date_fin}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="lieu" className="block text-sm font-medium text-gray-700 mb-1">Lieu *</label>
                    <input
                      type="text"
                      id="lieu"
                      name="lieu"
                      value={formData.lieu}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                      required
                    />
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
                    <label htmlFor="artiste_principal" className="block text-sm font-medium text-gray-700 mb-1">Artiste principal *</label>
                    <select
                      id="artiste_principal"
                      name="artiste_principal"
                      value={formData.artiste_principal}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                      required
                    >
                      <option value="">Sélectionner un artiste</option>
                      {loadingArtistes ? (
                        <option value="" disabled>Chargement des artistes...</option>
                      ) : (
                        artistes.map((artiste) => (
                          <option key={artiste.id} value={artiste.id}>
                            {artiste.nom}
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Artistes associés</label>
                    <div className="mt-2 max-h-48 overflow-y-auto border border-gray-200 rounded-md p-2">
                      {loadingArtistes ? (
                        <div className="text-sm text-gray-500">Chargement des artistes...</div>
                      ) : (
                        <div className="grid grid-cols-3 gap-2">
                          {artistes
                            .filter(artiste => artiste.id !== parseInt(formData.artiste_principal))
                            .map((artiste) => (
                              <div key={artiste.id} className="flex items-center space-x-2 p-1 hover:bg-gray-50 rounded">
                                <input
                                  type="checkbox"
                                  id={`artiste-${artiste.id}`}
                                  checked={formData.artistes.some(a => a.id === artiste.id)}
                                  onChange={(e) => {
                                    const newArtistes = e.target.checked
                                      ? [...formData.artistes, { id: artiste.id, nom: artiste.nom }]
                                      : formData.artistes.filter(a => a.id !== artiste.id);
                                    setFormData(prev => ({ ...prev, artistes: newArtistes }));
                                  }}
                                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label
                                  htmlFor={`artiste-${artiste.id}`}
                                  className="text-sm text-gray-700 truncate cursor-pointer"
                                  title={artiste.nom}
                                >
                                  {artiste.nom}
                                </label>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
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

export default EvenementsList;