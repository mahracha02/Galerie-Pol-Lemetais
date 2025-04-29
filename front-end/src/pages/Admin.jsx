import React, { useState, useEffect } from 'react';
import { Footer } from '../components/layout/Footer';
import { Navbar } from '../components/layout/Navbar';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [analytics, setAnalytics] = useState(null);
  const [contentItems, setContentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContentType, setSelectedContentType] = useState('exhibitions');

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Simulate API fetch
        setTimeout(() => {
          setAnalytics({
            visitors: {
              total: 12457,
              thisWeek: 843,
              lastWeek: 792,
              change: 6.4
            },
            pageViews: {
              total: 36842,
              thisWeek: 2456,
              lastWeek: 2210,
              change: 11.1
            },
            topPages: [
              { name: 'Accueil', views: 8762, percentage: 23.8 },
              { name: 'Expositions', views: 6540, percentage: 17.7 },
              { name: 'Artistes', views: 5928, percentage: 16.1 },
              { name: 'Événements', views: 4217, percentage: 11.4 },
              { name: 'Contact', views: 2840, percentage: 7.7 }
            ],
            deviceStats: {
              mobile: 52,
              desktop: 41,
              tablet: 7
            },
            trafficSources: {
              direct: 35,
              organic: 28,
              referral: 22,
              social: 15
            }
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Erreur lors du chargement des analyses:", error);
        setLoading(false);
      }
    };

    if (activeTab === 'dashboard') {
      fetchAnalytics();
    }
  }, [activeTab]);

  // Fetch content items based on content type
  useEffect(() => {
    const fetchContentItems = async () => {
      setLoading(true);
      try {
        // Simulate API fetch
        setTimeout(() => {
          let items = [];
          
          if (selectedContentType === 'exhibitions') {
            items = [
              { id: 1, title: "Les Impressionnistes Contemporains", status: "active", startDate: "2025-04-20", endDate: "2025-06-15" },
              { id: 2, title: "Abstractions", status: "scheduled", startDate: "2025-06-20", endDate: "2025-08-10" },
              { id: 3, title: "Rétrospective Jean Dubuffet", status: "draft", startDate: "", endDate: "" },
              { id: 4, title: "Art Numérique: Perspectives", status: "ended", startDate: "2025-01-10", endDate: "2025-03-15" }
            ];
          } else if (selectedContentType === 'artists') {
            items = [
              { id: 1, name: "Sophie Durand", category: "Peinture", featured: true, works: 24 },
              { id: 2, name: "Jean Moreau", category: "Sculpture", featured: true, works: 12 },
              { id: 3, name: "Claire Leroy", category: "Photographie", featured: false, works: 36 },
              { id: 4, name: "Pierre Dubois", category: "Sculpture", featured: false, works: 8 },
              { id: 5, name: "Marie Lefèvre", category: "Peinture", featured: false, works: 18 }
            ];
          } else if (selectedContentType === 'events') {
            items = [
              { id: 1, title: "Vernissage Pierre Dubois", date: "2025-05-03", time: "18:00", rsvps: 45 },
              { id: 2, title: "Atelier de peinture à l'huile", date: "2025-05-10", time: "10:00", rsvps: 12 },
              { id: 3, title: "Conférence sur l'art moderne", date: "2025-05-25", time: "14:30", rsvps: 28 }
            ];
          } else if (selectedContentType === 'pages') {
            items = [
              { id: 1, title: "Accueil", lastUpdated: "2025-03-01", author: "Admin" },
              { id: 2, title: "À propos", lastUpdated: "2025-02-15", author: "Admin" },
              { id: 3, title: "Services", lastUpdated: "2025-01-20", author: "Admin" },
              { id: 4, title: "Contact", lastUpdated: "2025-02-28", author: "Admin" }
            ];
          }
          
          setContentItems(items);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error("Erreur lors du chargement du contenu:", error);
        setLoading(false);
      }
    };

    if (activeTab === 'content') {
      fetchContentItems();
    }
  }, [activeTab, selectedContentType]);

  // Format number with thousands separator
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {/* Admin Header */}
          <div className="bg-gray-800 text-white p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              <div>
                <h1 className="text-2xl font-bold">Administration</h1>
                <p className="text-gray-300 mt-1">Galerie Pol Lemetais</p>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="bg-blue-500 text-white px-4 py-2 rounded-md inline-flex items-center cursor-pointer hover:bg-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Éditer le site
                </div>
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'dashboard'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Tableau de bord
              </button>
              <button
                onClick={() => setActiveTab('content')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'content'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Contenu du site
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'settings'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Paramètres
              </button>
            </nav>
          </div>
          
          {/* Tab Content */}
          <div className="p-6">
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-6">Statistiques du site</h2>
                
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="text-xl text-gray-600">Chargement des statistiques...</div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {/* Visitors Card */}
                      <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center justify-between">
                          <h3 className="text-gray-500 text-sm font-medium">Visiteurs</h3>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            analytics.visitors.change >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {analytics.visitors.change >= 0 ? '+' : ''}{analytics.visitors.change}%
                          </span>
                        </div>
                        <p className="mt-2 text-3xl font-bold text-gray-900">
                          {formatNumber(analytics.visitors.total)}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          Cette semaine: {formatNumber(analytics.visitors.thisWeek)}
                        </p>
                      </div>
                      
                      {/* Page Views Card */}
                      <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center justify-between">
                          <h3 className="text-gray-500 text-sm font-medium">Pages vues</h3>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            analytics.pageViews.change >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {analytics.pageViews.change >= 0 ? '+' : ''}{analytics.pageViews.change}%
                          </span>
                        </div>
                        <p className="mt-2 text-3xl font-bold text-gray-900">
                          {formatNumber(analytics.pageViews.total)}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          Cette semaine: {formatNumber(analytics.pageViews.thisWeek)}
                        </p>
                      </div>
                      
                      {/* Traffic Sources Card */}
                      <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-gray-500 text-sm font-medium mb-2">Sources de trafic</h3>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <span className="text-sm text-gray-600 w-24">Direct</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${analytics.trafficSources.direct}%` }}></div>
                            </div>
                            <span className="ml-2 text-sm text-gray-600">{analytics.trafficSources.direct}%</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-sm text-gray-600 w-24">Organic</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div className="bg-green-500 h-2 rounded-full" style={{ width: `${analytics.trafficSources.organic}%` }}></div>
                            </div>
                            <span className="ml-2 text-sm text-gray-600">{analytics.trafficSources.organic}%</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-sm text-gray-600 w-24">Référents</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${analytics.trafficSources.referral}%` }}></div>
                            </div>
                            <span className="ml-2 text-sm text-gray-600">{analytics.trafficSources.referral}%</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-sm text-gray-600 w-24">Social</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${analytics.trafficSources.social}%` }}></div>
                            </div>
                            <span className="ml-2 text-sm text-gray-600">{analytics.trafficSources.social}%</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Device Stats Card */}
                      <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-gray-500 text-sm font-medium mb-2">Appareils</h3>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <span className="text-sm text-gray-600 w-24">Mobile</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${analytics.deviceStats.mobile}%` }}></div>
                            </div>
                            <span className="ml-2 text-sm text-gray-600">{analytics.deviceStats.mobile}%</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-sm text-gray-600 w-24">Desktop</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div className="bg-pink-500 h-2 rounded-full" style={{ width: `${analytics.deviceStats.desktop}%` }}></div>
                            </div>
                            <span className="ml-2 text-sm text-gray-600">{analytics.deviceStats.desktop}%</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-sm text-gray-600 w-24">Tablette</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${analytics.deviceStats.tablet}%` }}></div>
                            </div>
                            <span className="ml-2 text-sm text-gray-600">{analytics.deviceStats.tablet}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Top Pages */}
                    <div className="mt-8">
                      <h3 className="text-lg font-medium text-gray-800 mb-4">Pages les plus visitées</h3>
                      <div className="bg-white shadow overflow-hidden rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Page
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Vues
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                % du total
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tendance
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {analytics.topPages.map((page, index) => (
                              <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">{page.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-500">{formatNumber(page.views)}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-500">{page.percentage}%</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="h-4 bg-gray-200 rounded-full w-32">
                                    <div className="bg-blue-500 h-4 rounded-full" style={{ width: `${page.percentage}%` }}></div>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    {/* Date Range Selector */}
                    <div className="mt-8 flex justify-end">
                      <div className="inline-flex rounded-md shadow-sm">
                        <button type="button" className="inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">
                          7 jours
                        </button>
                        <button type="button" className="inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-700 hover:bg-blue-100 focus:outline-none">
                          30 jours
                        </button>
                        <button type="button" className="inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">
                          90 jours
                        </button>
                        <button type="button" className="inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">
                          Personnalisé
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Content Tab */}
            {activeTab === 'content' && (
              <m>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-2 sm:mb-0">Gestion du contenu</h2>
                  
                  <div className="flex gap-3">
                    <select
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                      value={selectedContentType}
                      onChange={(e) => setSelectedContentType(e.target.value)}
                    >
                      <option value="exhibitions">Expositions</option>
                      <option value="artists">Artistes</option>
                      <option value="events">Événements</option>
                      <option value="pages">Pages</option>
                    </select>
                    
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Ajouter nouveau
                    </button>
                  </div>
                </div>
                
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="text-xl text-gray-600">Chargement du contenu...</div>
                  </div>
                ) : (
                  <div className="bg-white shadow overflow-hidden rounded-lg">
                    {/* Exhibitions Table */}
                    {selectedContentType === 'exhibitions' && (
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Titre
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Statut
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date de début
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date de fin
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {contentItems.map((item) => (
                            <tr key={item.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{item.title}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                  ${item.status === 'active' ? 'bg-green-100 text-green-800' : 
                                    item.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : 
                                    item.status === 'draft' ? 'bg-gray-100 text-gray-800' : 
                                    'bg-red-100 text-red-800'}`}>
                                  {item.status === 'active' ? 'Active' : 
                                    item.status === 'scheduled' ? 'Programmée' : 
                                    item.status === 'draft' ? 'Brouillon' : 'Terminée'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(item.startDate)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(item.endDate)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <a href="#" className="text-blue-600 hover:text-blue-900 mr-3">Éditer</a>
                                <a href="#" className="text-red-600 hover:text-red-900">Supprimer</a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                    
                    {/* Artists Table */}
                    {selectedContentType === 'artists' && (
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Nom
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Catégorie
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Mise en avant
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Œuvres
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {contentItems.map((item) => (
                            <tr key={item.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{item.name}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">{item.category}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  item.featured ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {item.featured ? 'Oui' : 'Non'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {item.works}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <a href="#" className="text-blue-600 hover:text-blue-900 mr-3">Éditer</a>
                                <a href="#" className="text-red-600 hover:text-red-900">Supprimer</a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                    
                    {/* Events Table */}
                    {selectedContentType === 'events' && (
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Titre
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Heure
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              RSVPs
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {contentItems.map((item) => (
                            <tr key={item.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{item.title}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(item.date)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {item.time}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {item.rsvps}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <a href="#" className="text-blue-600 hover:text-blue-900 mr-3">Éditer</a>
                                <a href="#" className="text-red-600 hover:text-red-900">Supprimer</a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </main>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};