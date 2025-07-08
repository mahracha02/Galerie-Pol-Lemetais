// src/components/Admin/UtilisateursList.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaEnvelope, FaUserShield, FaSearch, FaFilter, FaSort, FaEdit, FaTrash, FaPlus, FaArrowLeft, FaUserPlus, FaUserEdit, FaUserMinus, FaKey, FaCrown } from 'react-icons/fa';
import DeleteModal from '../layout/DeleteModal';
import { APP_BASE_URL } from '../../hooks/config';

const UtilisateursList = ({ darkMode }) => {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortField, setSortField] = useState('prenom');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [formData, setFormData] = useState({
    id: '',
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    role: '',
    password: ''
  });
  const [formError, setFormError] = useState('');
  const [connectedAdmin, setConnectedAdmin] = useState(null);

  // Role mapping for display
  const ROLE_LABELS = {
    'ROLE_USER': {
      label: 'utilisateur',
      icon: <FaUser className="w-4 h-4 mr-1" />,
      color: 'bg-blue-100 text-blue-800 shadow-blue-200',
      dark: 'bg-blue-900 text-blue-200 shadow-blue-900',
    },
    'ROLE_ADMIN': {
      label: 'admin',
      icon: <FaUserShield className="w-4 h-4 mr-1" />,
      color: 'bg-amber-100 text-amber-800 shadow-amber-200',
      dark: 'bg-amber-900 text-amber-200 shadow-amber-900',
    },
    'ROLE_SUPER_ADMIN': {
      label: 'super admin',
      icon: <FaCrown className="w-5 h-5 mr-1" />,
      color: 'bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 text-white shadow-lg',
      dark: 'bg-gradient-to-r from-purple-700 via-pink-700 to-yellow-500 text-white shadow-lg',
      gradient: true,
    },
  };

  useEffect(() => {
    const fetchUtilisateurs = async () => {
      try {
        const response = await fetch(`${APP_BASE_URL}/admin/api/list `);
        if (!response.ok) throw new Error('Erreur lors de la récupération');
        const data = await response.json();
        setUtilisateurs(data);
      } catch (error) {
        setError('Impossible de charger les utilisateurs. Veuillez réessayer.');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUtilisateurs();
  }, []);

  useEffect(() => {
    try {
      const userStr = localStorage.getItem('user') || localStorage.getItem('admin');
      if (userStr) {
        const userObj = JSON.parse(userStr);
        setConnectedAdmin(userObj);
      }
    } catch (e) {
      setConnectedAdmin(null);
    }
  }, []);

  const handleDelete = (id) => {
    setDeleteTarget(id);
    setDeleteModalOpen(true);
  };

  const handleBulkDelete = () => {
    setDeleteTarget([...selectedUsers]);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    setIsSubmitting(true);
    if (Array.isArray(deleteTarget)) {
      try {
        await Promise.all(deleteTarget.map(id =>
          fetch(`${APP_BASE_URL}/admin/api/delete/${id}`, { method: 'DELETE' })
        ));
        setUtilisateurs(utilisateurs.filter(user => !deleteTarget.includes(user.id)));
        setSelectedUsers([]);
        setSuccessMessage(`${deleteTarget.length} utilisateurs supprimés avec succès!`);
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        setError('Erreur lors de la suppression des utilisateurs');
        setTimeout(() => setError(''), 5000);
      } finally {
        setIsSubmitting(false);
        setDeleteModalOpen(false);
        setDeleteTarget(null);
      }
    } else if (deleteTarget) {
      try {
        const response = await fetch(`${APP_BASE_URL}/admin/api/delete/${deleteTarget}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Erreur lors de la suppression');
        setUtilisateurs(utilisateurs.filter(user => user.id !== deleteTarget));
        setSelectedUsers(selectedUsers.filter(userId => userId !== deleteTarget));
        setSuccessMessage('Utilisateur supprimé avec succès!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        setError('Impossible de supprimer l\'utilisateur. Veuillez réessayer.');
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

  const filteredUsers = utilisateurs
    .filter(user => {
      const matchesSearch =
        (user.prenom && user.prenom.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.nom && user.nom.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.telephone && user.telephone.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.role && Array.isArray(user.role) && user.role.join(',').toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesRole = roleFilter === 'all' || (user.role && user.role.includes(roleFilter));
      return matchesSearch && matchesRole;
    })
    .sort((a, b) => {
      const direction = sortDirection === 'asc' ? 1 : -1;
      if (sortField === 'prenom') return direction * (a.prenom || '').localeCompare(b.prenom || '');
      if (sortField === 'nom') return direction * (a.nom || '').localeCompare(b.nom || '');
      if (sortField === 'email') return direction * (a.email || '').localeCompare(b.email || '');
      if (sortField === 'telephone') return direction * (a.telephone || '').localeCompare(b.telephone || '');
      if (sortField === 'role') return direction * ((a.role || []).join(',')).localeCompare((b.role || []).join(','));
      return 0;
    });

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUsers(filteredUsers.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const resetForm = () => {
    setFormData({
      id: '',
      prenom: '',
      nom: '',
      email: '',
      telephone: '',
      role: '',
      password: ''
    });
    setFormError('');
  };

  const handleAddClick = () => {
    resetForm();
    setModalMode('add');
    setShowFormModal(true);
  };

  const handleEditClick = (user) => {
    setFormData({
      id: user.id,
      prenom: user.prenom || '',
      nom: user.nom || '',
      email: user.email || '',
      telephone: user.telephone || '',
      role: Array.isArray(user.role) ? user.role[0] || '' : (user.role || ''),
      password: ''
    });
    setModalMode('edit');
    setShowFormModal(true);
    setFormError('');
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError('');
    // Basic validation
    if (!formData.prenom || !formData.nom || !formData.email || !formData.role || (modalMode === 'add' && !formData.password)) {
      setFormError('Veuillez remplir tous les champs obligatoires.');
      setIsSubmitting(false);
      return;
    }
    try {
      const url = modalMode === 'add' ? `${APP_BASE_URL}/admin/api/create` : `${APP_BASE_URL}/admin/api/update/${formData.id}`;
      const method = modalMode === 'add' ? 'POST' : 'PUT';
      const payload = { ...formData };
      if (modalMode === 'edit' && !formData.password) {
        delete payload.password;
      }
      if (payload.role) {
        payload.roles = [payload.role];
        delete payload.role;
      }
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.details || `HTTP ${response.status}: ${response.statusText}`);
      }
      if (modalMode === 'add') {
        const newUser = await response.json();
        setUtilisateurs(prev => [newUser, ...prev]);
      } else {
        const updatedUser = await response.json();
        setUtilisateurs(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
      }
      setShowFormModal(false);
      resetForm();
      setSuccessMessage(`Utilisateur ${modalMode === 'add' ? 'ajouté' : 'modifié'} avec succès!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setFormError(error.message || 'Une erreur est survenue lors de la soumission du formulaire');
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
              <div className="bg-amber-500 text-white px-4 py-2 rounded-md shadow-lg animate-fadeInOut">
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
            <h1 className="text-3xl font-bold mb-1" style={{ fontFamily: 'Kenyan Coffee, sans-serif' }}>Utilisateurs</h1>
            <p className={`text-base ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Gérez les utilisateurs de votre site</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/admin/"
              className={`px-4 py-2 ${darkMode ? 'bg-[#232326] border border-gray-700 text-white hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center`}
            >
              <FaArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Link>
            <button
              onClick={handleAddClick}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center"
            >
              <FaUserPlus className="w-4 h-4 mr-2" />
              Nouvel utilisateur
            </button>
          </div>
        </div>
        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Rechercher un utilisateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${darkMode ? 'border-gray-700 bg-[#232326] text-white' : 'border-gray-200 bg-white text-[#18181b]'} focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
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
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Rôle</label>
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className={`w-full rounded-lg border ${darkMode ? 'bg-[#18181b] border-gray-600' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
                  >
                    <option value="all">Tous les rôles</option>
                    <option value="admin">Administrateur</option>
                    <option value="user">Utilisateur</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </div>
        {/* Bulk Actions */}
        <AnimatePresence>
          {selectedUsers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mb-6 p-4 rounded-lg flex items-center justify-between ${darkMode ? 'bg-amber-900 border border-amber-700 text-amber-200' : 'bg-amber-50 border border-amber-200 text-amber-800'}`}
            >
              <span className="font-medium">
                {selectedUsers.length} utilisateur{selectedUsers.length > 1 ? 's' : ''} sélectionné{selectedUsers.length > 1 ? 's' : ''}
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
        {/* Connected Admin Card */}
        {connectedAdmin && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`mb-8 flex items-center gap-6 p-6 rounded-2xl shadow-lg border ${darkMode ? 'bg-[#232326] border-gray-700 text-white' : 'bg-white border-gray-200 text-[#18181b]'} relative overflow-hidden`}
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            <div className={`flex items-center justify-center w-16 h-16 rounded-full ${darkMode ? 'bg-amber-900' : 'bg-amber-100'} shadow-lg`}>
              <FaUser className="w-10 h-10 text-amber-600" />
            </div>
            <div className="flex-1">
              <div className="text-lg font-bold" style={{ fontFamily: 'Kenyan Coffee, sans-serif' }}>
                {connectedAdmin.prenom || ''} {connectedAdmin.nom || ''}
              </div>
              <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>{connectedAdmin.email}</div>
              <div className="mt-2">
                {(() => {
                  const roleKey = Array.isArray(connectedAdmin.role) ? connectedAdmin.role[0] : connectedAdmin.role;
                  const roleInfo = ROLE_LABELS[roleKey] || {
                    label: roleKey,
                    icon: <FaUser className="w-4 h-4 mr-1" />,
                    color: 'bg-gray-200 text-gray-600',
                    dark: 'bg-gray-700 text-gray-200',
                  };
                  return (
                    <span
                      className={`inline-flex items-center px-4 py-1 rounded-full font-semibold text-xs shadow transition-all duration-200 ${roleInfo.gradient ? (darkMode ? roleInfo.dark : roleInfo.color) : (darkMode ? roleInfo.dark : roleInfo.color)}`}
                      style={roleInfo.gradient ? { background: darkMode ? 'linear-gradient(90deg, #7c3aed, #db2777, #facc15)' : 'linear-gradient(90deg, #a78bfa, #f472b6, #fde68a)' } : {}}
                    >
                      {roleInfo.icon}
                      <span className="ml-1">{roleInfo.label}</span>
                    </span>
                  );
                })()}
              </div>
            </div>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.15 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-amber-400 blur-2xl opacity-20"
            />
          </motion.div>
        )}
        {/* Users Table */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`rounded-lg shadow animate-pulse ${darkMode ? 'bg-[#232326]' : 'bg-white'}`}>
                <div className={`h-4 rounded w-1/4 mb-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                <div className={`h-4 rounded w-3/4 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`rounded-xl shadow-md overflow-hidden ${darkMode ? 'bg-[#232326] text-white' : 'bg-white'}`}>
            <div className="overflow-x-auto">
              <table className={`min-w-full divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}> 
                <thead className={darkMode ? 'bg-[#18181b]' : 'bg-gray-50'}>
                  <tr>
                    <th className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.length === filteredUsers.length}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700" onClick={() => handleSort('prenom')}>
                      <div className="flex items-center">Prénom <FaSort className="ml-2 w-3 h-3" /></div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700" onClick={() => handleSort('nom')}>
                      <div className="flex items-center">Nom <FaSort className="ml-2 w-3 h-3" /></div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700" onClick={() => handleSort('email')}>
                      <div className="flex items-center">Email <FaSort className="ml-2 w-3 h-3" /></div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700" onClick={() => handleSort('telephone')}>
                      <div className="flex items-center">Téléphone <FaSort className="ml-2 w-3 h-3" /></div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700" onClick={() => handleSort('role')}>
                      <div className="flex items-center">Rôle <FaSort className="ml-2 w-3 h-3" /></div>
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className={darkMode ? 'bg-[#232326] divide-y divide-gray-700' : 'bg-white divide-y divide-gray-200'}>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className={`transition-colors duration-150 ${selectedUsers.includes(user.id) ? (darkMode ? 'bg-amber-900' : 'bg-amber-50') : ''} ${darkMode ? 'hover:bg-[#18181b]' : 'hover:bg-gray-50'} ${connectedAdmin && user.email === connectedAdmin.email ? 'ring-2 ring-amber-500 ring-offset-2' : ''}`}
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => handleSelectUser(user.id)}
                          className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-amber-100 rounded-full flex items-center justify-center">
                            <FaUser className="h-5 w-5 text-amber-600" />
                          </div>
                          <div className="ml-4">
                            <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{user.prenom}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{user.nom}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`flex items-center text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}> <FaEnvelope className="w-4 h-4 mr-2 text-gray-400" /> {user.email} </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>{user.telephone || <span className="italic text-gray-400">—</span>}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.role ? (
                          (() => {
                            const roleKey = Array.isArray(user.role) ? user.role[0] : user.role;
                            const roleInfo = ROLE_LABELS[roleKey] || {
                              label: roleKey,
                              icon: <FaUser className="w-4 h-4 mr-1" />,
                              color: 'bg-gray-200 text-gray-600',
                              dark: 'bg-gray-700 text-gray-200',
                            };
                            return (
                              <span
                                className={`inline-flex items-center px-4 py-1 rounded-full font-semibold text-xs shadow transition-all duration-200 ${roleInfo.gradient ? (darkMode ? roleInfo.dark : roleInfo.color) : (darkMode ? roleInfo.dark : roleInfo.color)}`}
                                style={roleInfo.gradient ? { background: darkMode ? 'linear-gradient(90deg, #7c3aed, #db2777, #facc15)' : 'linear-gradient(90deg, #a78bfa, #f472b6, #fde68a)' } : {}}
                              >
                                {roleInfo.icon}
                                <span className="ml-1">{roleInfo.label}</span>
                              </span>
                            );
                          })()
                        ) : (
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-200 text-gray-600">Aucun</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3">
                          <Link
                            to="#"
                            onClick={() => handleEditClick(user)}
                            className="text-amber-600 hover:text-amber-900 transition-colors duration-200 flex items-center"
                          >
                            <FaUserEdit className="w-4 h-4 mr-1" />
                            Éditer
                          </Link>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="text-red-600 hover:text-red-900 transition-colors duration-200 flex items-center"
                          >
                            <FaUserMinus className="w-4 h-4 mr-1" />
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center">
                        <div className="text-gray-400 flex flex-col items-center">
                          <FaUser className="w-12 h-12 mb-4" />
                          <p className="text-lg">Aucun utilisateur trouvé</p>
                          <p className="text-sm mt-1">
                            {searchTerm || roleFilter !== 'all'
                              ? 'Essayez de modifier vos critères de recherche'
                              : 'Ajoutez votre premier utilisateur'}
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
        <DeleteModal
          open={deleteModalOpen}
          onClose={() => { setDeleteModalOpen(false); setDeleteTarget(null); }}
          onConfirm={confirmDelete}
          count={Array.isArray(deleteTarget) ? deleteTarget.length : 1}
          darkMode={darkMode}
        />
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
                    <h3 className="text-xl font-bold" style={{ fontFamily: 'Kenyan Coffee, sans-serif' }}>{modalMode === 'add' ? 'Ajouter un utilisateur' : 'Modifier un utilisateur'}</h3>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="prenom" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Prénom *</label>
                        <input
                          type="text"
                          id="prenom"
                          name="prenom"
                          value={formData.prenom}
                          onChange={handleFormChange}
                          className={`mt-1 block w-full rounded-lg shadow-sm sm:text-sm p-3 border ${darkMode ? 'bg-[#0C0C0C] border-gray-700 text-white focus:border-amber-600 focus:ring-amber-600' : 'border-gray-300 bg-white text-black focus:border-amber-600 focus:ring-amber-600'}`}
                          required
                          maxLength={100}
                        />
                      </div>
                      <div>
                        <label htmlFor="nom" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Nom *</label>
                        <input
                          type="text"
                          id="nom"
                          name="nom"
                          value={formData.nom}
                          onChange={handleFormChange}
                          className={`mt-1 block w-full rounded-lg shadow-sm sm:text-sm p-3 border ${darkMode ? 'bg-[#0C0C0C] border-gray-700 text-white focus:border-amber-600 focus:ring-amber-600' : 'border-gray-300 bg-white text-black focus:border-amber-600 focus:ring-amber-600'}`}
                          required
                          maxLength={100}
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Email *</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleFormChange}
                          className={`mt-1 block w-full rounded-lg shadow-sm sm:text-sm p-3 border ${darkMode ? 'bg-[#0C0C0C] border-gray-700 text-white focus:border-amber-600 focus:ring-amber-600' : 'border-gray-300 bg-white text-black focus:border-amber-600 focus:ring-amber-600'}`}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="telephone" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Téléphone</label>
                        <input
                          type="text"
                          id="telephone"
                          name="telephone"
                          value={formData.telephone}
                          onChange={handleFormChange}
                          className={`mt-1 block w-full rounded-lg shadow-sm sm:text-sm p-3 border ${darkMode ? 'bg-[#0C0C0C] border-gray-700 text-white focus:border-amber-600 focus:ring-amber-600' : 'border-gray-300 bg-white text-black focus:border-amber-600 focus:ring-amber-600'}`}
                          maxLength={30}
                        />
                      </div>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Rôles *</label>
                      <div className="flex gap-4 mt-1">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="role"
                            value="ROLE_USER"
                            checked={formData.role === 'ROLE_USER'}
                            onChange={handleFormChange}
                            className="accent-blue-600"
                          />
                          <span className="inline-flex items-center">{ROLE_LABELS['ROLE_USER'].icon} utilisateur</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="role"
                            value="ROLE_ADMIN"
                            checked={formData.role === 'ROLE_ADMIN'}
                            onChange={handleFormChange}
                            className="accent-amber-600"
                          />
                          <span className="inline-flex items-center">{ROLE_LABELS['ROLE_ADMIN'].icon} admin</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="role"
                            value="ROLE_SUPER_ADMIN"
                            checked={formData.role === 'ROLE_SUPER_ADMIN'}
                            onChange={handleFormChange}
                            className="accent-purple-600"
                          />
                          <span className="inline-flex items-center">{ROLE_LABELS['ROLE_SUPER_ADMIN'].icon} super admin</span>
                        </label>
                      </div>
                    </div>
                    {(modalMode === 'add' || modalMode === 'edit') && (
                      <div>
                        <label htmlFor="password" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>{modalMode === 'add' ? 'Mot de passe *' : 'Nouveau mot de passe'}</label>
                        <div className="relative">
                          <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleFormChange}
                            className={`mt-1 block w-full rounded-lg shadow-sm sm:text-sm p-3 border pr-10 ${darkMode ? 'bg-[#0C0C0C] border-gray-700 text-white focus:border-amber-600 focus:ring-amber-600' : 'border-gray-300 bg-white text-black focus:border-amber-600 focus:ring-amber-600'}`}
                            placeholder={modalMode === 'add' ? 'Mot de passe...' : 'Laisser vide pour ne pas changer'}
                            required={modalMode === 'add'}
                          />
                          <FaKey className="absolute right-3 top-3 text-gray-400" />
                        </div>
                      </div>
                    )}
                    {formError && (
                      <div className={`p-3 rounded text-sm ${darkMode ? 'bg-red-900 text-red-200 border border-red-700' : 'bg-red-50 text-red-600 border border-red-200'}`}>{formError}</div>
                    )}
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
                      className={`px-4 py-2 text-sm font-medium text-white rounded-md shadow-sm bg-amber-600 hover:bg-amber-700 flex items-center`}
                    >
                      {isSubmitting ? 'Sauvegarde...' : (modalMode === 'add' ? 'Ajouter' : 'Mettre à jour')}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default UtilisateursList;