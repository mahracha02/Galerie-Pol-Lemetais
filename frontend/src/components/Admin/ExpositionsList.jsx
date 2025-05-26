// src/components/Admin/ExpositionsList.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaImage, FaSearch, FaFilter, FaSort, FaTrash, FaArrowLeft, FaPlus, FaEdit, FaCalendarAlt, FaMapMarkerAlt, FaEye, FaEyeSlash } from 'react-icons/fa';

const ExpositionsList = () => {
  const [expositions, setExpositions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [sortField, setSortField] = useState('date_debut');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedExpos, setSelectedExpos] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [expoToDelete, setExpoToDelete] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [artistes, setArtistes] = useState([]);
  const [loadingArtistes, setLoadingArtistes] = useState(true);

  // Form data
  const [formData, setFormData] = useState({
    id: '',
    titre: '',
    description: '',
    date_debut: '',
    date_fin: '',
    annee: new Date().getFullYear(),
    image: null,
    catalogue_url: '',
    artiste_principal: '',
    artiste_principal_nom: '',
    artistes: [],
    published: false
  });

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

  const fetchExpositions = async () => {
    try {
      const response = await fetch('/expositions/api/');
      if (!response.ok) throw new Error('Erreur lors de la récupération');
      const data = await response.json();
      setExpositions(data);
    } catch (error) {
      setError('Impossible de charger les expositions. Veuillez réessayer.');
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
    fetchExpositions();
    fetchArtistes();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette exposition ?')) {
      try {
        const response = await fetch(`/expositions/api/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Erreur lors de la suppression');
        setExpositions(expositions.filter(item => item.id !== id));
        setSelectedExpos(selectedExpos.filter(expoId => expoId !== id));
      } catch (error) {
        setError('Impossible de supprimer l\'exposition. Veuillez réessayer.');
        console.error(error);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedExpos.length} expositions ?`)) {
      setIsSubmitting(true);
      try {
        await Promise.all(selectedExpos.map(id => 
          fetch(`/expositions/api/${id}`, { method: 'DELETE' })
        ));
        setExpositions(expositions.filter(expo => !selectedExpos.includes(expo.id)));
        setSelectedExpos([]);
        setSuccessMessage(`${selectedExpos.length} expositions supprimées avec succès!`);
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        console.error('Bulk delete error:', error);
        setError('Erreur lors de la suppression des expositions');
        setTimeout(() => setError(''), 5000);
      } finally {
        setIsSubmitting(false);
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

  const getExpoStatus = (dateDebutStr, dateFinStr) => {
    const mois = {
      janvier: '01',
      février: '02',
      fevrier: '02',
      mars: '03',
      avril: '04',
      mai: '05',
      juin: '06',
      juillet: '07',
      août: '08',
      aout: '08',
      septembre: '09',
      octobre: '10',
      novembre: '11',
      décembre: '12',
      decembre: '12',
    };
  
    const parseDate = (dateStr) => {
      if (!dateStr) return null;
      const parts = dateStr.toLowerCase().split(' ');
      if (parts.length !== 3) return null;
      const jour = parts[0].padStart(2, '0');
      const moisNum = mois[parts[1]];
      const annee = parts[2];
      if (!moisNum) return null;
      return new Date(`${annee}-${moisNum}-${jour}T00:00:00`);
    };
  
    const now = new Date();
    now.setHours(0, 0, 0, 0);
  
    const debut = parseDate(dateDebutStr);
    const fin = parseDate(dateFinStr);
  
    if (!debut || !fin) return 'date invalide';
  
    if (now < debut) return 'upcoming';
    if (now > fin) return 'past';
    return 'ongoing';
  };

  const filteredExpos = expositions
    .filter(expo => {
      const searchTermLower = searchTerm.toLowerCase();
      const artistePrincipal = expo.artiste_principal?.nom || '';
      const description = expo.description || '';
      
      const matchesSearch = expo.titre.toLowerCase().includes(searchTermLower) ||
                          artistePrincipal.toLowerCase().includes(searchTermLower) ||
                          description.toLowerCase().includes(searchTermLower);
      
      const matchesDate = dateFilter === 'all' || getExpoStatus(expo.date_debut, expo.date_fin) === dateFilter;
      const matchesYear = yearFilter === 'all' || expo.annee.toString() === yearFilter;
      
      return matchesSearch && matchesDate && matchesYear;
    })
    .sort((a, b) => {
      const direction = sortDirection === 'asc' ? 1 : -1;
      if (sortField === 'titre') {
        return direction * a.titre.localeCompare(b.titre);
      }
      if (sortField === 'date_debut') {
        return direction * (new Date(a.date_debut) - new Date(b.date_debut));
      }
      if (sortField === 'annee') {
        return direction * (a.annee - b.annee);
      }
      if (sortField === 'artiste_principal') {
        return direction * (a.artiste_principal?.nom || '').localeCompare(b.artiste_principal?.nom || '');
      }
      return 0;
    });

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedExpos(filteredExpos.map(expo => expo.id));
    } else {
      setSelectedExpos([]);
    }
  };

  const handleSelectExpo = (expoId) => {
    setSelectedExpos(prev => 
      prev.includes(expoId) 
        ? prev.filter(id => id !== expoId)
        : [...prev, expoId]
    );
  };

  const uniqueYears = [...new Set(expositions.map(expo => expo.annee))].sort((a, b) => b - a);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'artistes') {
      // Gestion des artistes comme une chaîne de noms séparés par des virgules
      const artistes = value.split(',')
        .map(nom => nom.trim())
        .filter(nom => nom !== '')
        .map(nom => ({ nom }));
      
      setFormData(prev => ({
        ...prev,
        artistes
      }));
    } else if (name === 'artiste_principal') {
      // Gestion de l'artiste principal
      setFormData(prev => ({
        ...prev,
        artiste_principal: value,
        artiste_principal_nom: value
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
      annee: new Date().getFullYear(),
      image: '',
      catalogue_url: '',
      artiste_principal: '',
      artiste_principal_nom: '',
      artistes: [],
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
  const handleEditClick = (expo) => {
    setFormData({
      id: expo.id,
      titre: expo.titre,
      description: expo.description,
      date_debut: formatDateForInput(expo.date_debut),
      date_fin: formatDateForInput(expo.date_fin),
      annee: expo.annee,
      image: expo.image,
      catalogue_url: expo.catalogue_url,
      artiste_principal: expo.artiste_principal?.id || '',
      artistes: expo.artistes?.map(a => ({ id: a.id, nom: a.nom })) || [],
      published: expo.published || false
    });

    if (expo.image) {
      setPreviewImage(expo.image);
    } else {
      setPreviewImage(null);
    }
    
    setModalMode('edit');
    setShowFormModal(true);
  };

  // Format French date to YYYY-MM-DD for input fields
  const formatDateForInput = (frenchDate) => {
    if (!frenchDate) return '';
    
    const mois = {
      janvier: '01',
      février: '02',
      fevrier: '02',
      mars: '03',
      avril: '04',
      mai: '05',
      juin: '06',
      juillet: '07',
      août: '08',
      aout: '08',
      septembre: '09',
      octobre: '10',
      novembre: '11',
      décembre: '12',
      decembre: '12',
    };
    
    const parts = frenchDate.toLowerCase().split(' ');
    if (parts.length !== 3) return '';
    
    const day = parts[0].padStart(2, '0');
    const month = mois[parts[1]];
    const year = parts[2];
    
    if (!month) return '';
    
    return `${year}-${month}-${day}`;
  };

  // Format date for display
  const formatDateForDisplay = (isoDate) => {
    if (!isoDate) return '';
    
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return '';
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${year}-${month}-${day}`;
  };

  // Submit form (add/edit)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const url = modalMode === 'add' 
        ? '/expositions/api/add' 
        : `/expositions/api/edit/${formData.id}`;
      
      const method = modalMode === 'add' ? 'POST' : 'PUT';
      
      // Préparation des données de base
      const dataToSend = {
        titre: formData.titre?.trim() || '',
        description: formData.description?.trim() || '',
        date_debut: formData.date_debut ? new Date(formData.date_debut).toISOString().split('T')[0] : '',
        date_fin: formData.date_fin ? new Date(formData.date_fin).toISOString().split('T')[0] : '',
        annee: parseInt(formData.annee, 10) || new Date().getFullYear(),
        catalogue_url: formData.catalogue_url?.trim() || '',
        artiste_principal: typeof formData.artiste_principal === 'string' 
          ? formData.artiste_principal.trim() 
          : formData.artiste_principal?.nom || '',
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

                    // Calculer les nouvelles dimensions
                    let width = img.width;
                    let height = img.height;
                    
                    // Dimensions fixes pour l'affichage (correspondant au cadre)
                    const targetWidth = 600; // Largeur du cadre
                    const targetHeight = 400; // Hauteur du cadre
                    
                    // Calculer le ratio pour maintenir les proportions
                    const ratio = width / height;
                    
                    // Calculer les nouvelles dimensions en respectant le ratio
                    if (ratio > targetWidth / targetHeight) {
                      // Image plus large que haute
                      width = targetWidth;
                      height = Math.round(targetWidth / ratio);
                    } else {
                      // Image plus haute que large
                      height = targetHeight;
                      width = Math.round(targetHeight * ratio);
                    }

                    // S'assurer que les dimensions sont des nombres entiers
                    width = Math.round(width);
                    height = Math.round(height);

                    // Redimensionner l'image
                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);

                    // Déterminer la qualité de compression
                    let quality = 0.7; // Qualité par défaut augmentée
                    if (formData.image.size > 2 * 1024 * 1024) {
                      quality = 0.5;
                    } else if (formData.image.size > 1024 * 1024) {
                      quality = 0.6;
                    }

                    // Convertir en base64 avec compression
                    const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
                    const compressedSize = Math.round(compressedBase64.length * 0.75);
                    
                    console.log('Image compressed:', {
                      originalSize: formData.image.size,
                      compressedSize: compressedSize,
                      quality: quality,
                      dimensions: `${width}x${height}`,
                      ratio: ratio.toFixed(2),
                      targetDimensions: `${targetWidth}x${targetHeight}`
                    });

                    // Vérifier si la taille compressée est acceptable
                    if (compressedSize > 300 * 1024) {
                      console.warn('Image still too large, trying more aggressive compression');
                      const moreCompressed = canvas.toDataURL('image/jpeg', quality * 0.8);
                      const newSize = Math.round(moreCompressed.length * 0.75);
                      console.log('Second compression attempt:', {
                        newSize: newSize,
                        newQuality: quality * 0.8,
                        dimensions: `${width}x${height}`
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
            reader.readAsDataURL(formData.image);
          });
        } catch (error) {
          console.error('Image processing error:', error);
          throw new Error('Erreur lors du traitement de l\'image: ' + error.message);
        }
      } else if (formData.image) {
        dataToSend.image = formData.image;
      }

      // Gestion des artistes
      if (Array.isArray(formData.artistes)) {
        dataToSend.artistes = formData.artistes
          .filter(artiste => artiste && (artiste.id || artiste.nom))
          .map(artiste => {
            if (typeof artiste === 'string') {
              return { nom: artiste.trim() };
            }
            return artiste.id || { nom: artiste.nom?.trim() };
          });
      }

      // Vérifier que les données sont valides avant l'envoi
      if (!dataToSend.titre || !dataToSend.date_debut || !dataToSend.date_fin) {
        throw new Error('Veuillez remplir tous les champs obligatoires');
      }

      // Nettoyer les données avant l'envoi
      Object.keys(dataToSend).forEach(key => {
        if (dataToSend[key] === null || dataToSend[key] === undefined) {
          delete dataToSend[key];
        }
      });

      console.log('Sending data to:', url);
      const dataSize = JSON.stringify(dataToSend).length;
      console.log('Data size:', dataSize);
      console.log('Data structure:', JSON.stringify(dataToSend, null, 2));

      if (dataSize > 1024 * 1024) {
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

      // Rafraîchir la liste des expositions
      const updatedResponse = await fetch('/expositions/api/');
      if (!updatedResponse.ok) throw new Error('Erreur lors de la récupération des données');
      const updatedData = await updatedResponse.json();
      setExpositions(updatedData);
      
      setShowFormModal(false);
      setSuccessMessage(responseData.message || `Exposition ${modalMode === 'add' ? 'ajoutée' : 'modifiée'} avec succès!`);
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

  // Render the component
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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Expositions</h1>
          <p className="text-gray-500 mt-1">Gérez les expositions de votre site</p>
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
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center"
          >
            <FaPlus className="w-4 h-4 mr-2" />
            Nouvelle exposition
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Rechercher une exposition..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="upcoming">À venir</option>
                  <option value="ongoing">En cours</option>
                  <option value="past">Passées</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Année</label>
                <select
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">Toutes les années</option>
                  {uniqueYears.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedExpos.length > 0 && (
        <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg flex items-center justify-between">
          <span className="text-purple-800">
            {selectedExpos.length} exposition{selectedExpos.length > 1 ? 's' : ''} sélectionnée{selectedExpos.length > 1 ? 's' : ''}
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
                      checked={selectedExpos.length === filteredExpos.length && filteredExpos.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    onClick={() => handleSort('titre')}
                  >
                    <div className="flex items-center">
                      Titre
                      <FaSort className="ml-2 w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
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
                    onClick={() => handleSort('date_debut')}
                  >
                    <div className="flex items-center">
                      Dates
                      <FaSort className="ml-2 w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Catalogue
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Artiste principal
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Autres artistes
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredExpos.map((expo) => {
                  const status = getExpoStatus(expo.date_debut, expo.date_fin);
                  return (
                    <tr 
                      key={expo.id} 
                      className={`hover:bg-gray-50 transition-colors duration-150 ${
                        selectedExpos.includes(expo.id) ? 'bg-purple-50' : ''
                      }`}
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedExpos.includes(expo.id)}
                          onChange={() => handleSelectExpo(expo.id)}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <FaImage className="h-5 w-5 text-purple-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{expo.titre}</div>
                            <div className="flex items-center text-sm text-gray-500">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                                status === 'ongoing' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {status === 'upcoming' ? 'À venir' :
                                 status === 'ongoing' ? 'En cours' :
                                 'Terminée'}
                              </span>
                              <span className="mx-2">•</span>
                              {expo.artiste_principal?.nom || 'Aucun artiste'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 line-clamp-2">
                          {expo.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {expo.annee}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <FaCalendarAlt className="w-4 h-4 mr-2 text-gray-400" />
                          {expo.date_debut}
                          <span className="mx-2">-</span>
                          {expo.date_fin}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <FaImage className="w-4 h-4 mr-2 text-gray-400" />
                          {expo.image ? (
                            <img
                              src={expo.image}
                              alt={expo.titre}
                              className="w-12 h-12 object-cover rounded-lg"
                            />  
                          ) : (
                            <span className="text-gray-400">Aucune image</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {expo.catalogue_url ? (
                            <a 
                              href={expo.catalogue_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline truncate max-w-xs block"
                            >
                              {expo.catalogue_url}
                            </a>
                          ) : (
                            <span className="text-gray-400">Aucun catalogue</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {expo.artiste_principal?.nom || 'Aucun artiste'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap items-center gap-2 text-sm">
                          {expo.artistes && expo.artistes.length > 0 ? (
                            expo.artistes.map((artiste, index) => (
                              <span
                                key={index}
                                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold"
                              >
                                {artiste.nom}
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
                          expo.published 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          <div className="flex items-center">
                            {expo.published 
                              ? <FaEye className="w-3 h-3 mr-1" />
                              : <FaEyeSlash className="w-3 h-3 mr-1" />
                            }
                            {expo.published ? 'Publié' : 'Non publié'}
                          </div>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={() => handleEditClick(expo)}
                            className="text-purple-600 hover:text-purple-900 transition-colors duration-200 flex items-center"
                          >
                            <FaEdit className="w-4 h-4 mr-1" />
                            Éditer
                          </button>
                          <button
                            onClick={() => handleDeleteClick(expo.id)}
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
                {filteredExpos.length === 0 && (
                  <tr>
                    <td colSpan={11} className="px-6 py-12 text-center">
                      <div className="text-gray-400 flex flex-col items-center">
                        <FaImage className="w-12 h-12 mb-4" />
                        <p className="text-lg">Aucune exposition trouvée</p>
                        <p className="text-sm mt-1">
                          {searchTerm || dateFilter !== 'all' || locationFilter !== 'all'
                            ? 'Essayez de modifier vos critères de recherche'
                            : 'Créez votre première exposition'}
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
                        {modalMode === 'add' ? 'Ajouter une exposition' : 'Modifier une exposition'}
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
                    <label htmlFor="annee" className="block text-sm font-medium text-gray-700 mb-1">Année *</label>
                    <input
                      type="number"
                      id="annee"
                      name="annee"
                      value={formData.annee}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                      required
                      min="1900"
                      max="2100"
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
                    <label htmlFor="catalogue_url" className="block text-sm font-medium text-gray-700 mb-1">URL du catalogue</label>
                    <input
                      type="text"
                      id="catalogue_url"
                      name="catalogue_url"
                      value={formData.catalogue_url}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                      placeholder="https://example.com/catalogue.pdf"
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
                    Êtes-vous sûr de vouloir supprimer cette exposition ?
                  </p>
                  <p className="text-sm text-gray-500">
                    Cette action est irréversible et supprimera définitivement l&apos;exposition.
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

export default ExpositionsList;