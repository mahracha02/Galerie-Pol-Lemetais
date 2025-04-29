import React, { useState, useEffect } from 'react';

// Import d'icônes fictives (à remplacer par votre bibliothèque d'icônes préférée)
const IconUsers = () => <span className="text-blue-500">👥</span>;
const IconViews = () => <span className="text-green-500">👁️</span>;
const IconTime = () => <span className="text-purple-500">⏱️</span>;
const IconBounce = () => <span className="text-red-500">↩️</span>;

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [period, setPeriod] = useState('week');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [contentItems, setContentItems] = useState([]);

  useEffect(() => {
    // Simuler le chargement des données
    setLoading(true);
    
    setTimeout(() => {
      // Données fictives pour le tableau de bord
      setStats({
        visitors: {
          count: 1247,
          change: 12.5,
          positive: true
        },
        pageviews: {
          count: 3829,
          change: 8.2,
          positive: true
        },
        avgTime: {
          count: '2:34',
          change: 15.3,
          positive: true
        },
        bounceRate: {
          count: 42.3,
          change: 3.1,
          positive: false
        },
        topPages: [
          { name: 'Accueil', views: 1245, percentage: 32 },
          { name: 'Expositions', views: 842, percentage: 22 },
          { name: 'Artistes', views: 765, percentage: 20 },
          { name: 'Contact', views: 512, percentage: 13 },
          { name: 'Événements', views: 465, percentage: 12 }
        ],
        visitorChart: [120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210],
        deviceData: [
          { name: 'Desktop', value: 55 },
          { name: 'Mobile', value: 35 },
          { name: 'Tablet', value: 10 }
        ]
      });

      // Données fictives pour la section contenu
      setContentItems([
        { id: 1, type: 'Page', title: 'Accueil', lastUpdated: '15/02/2025', status: 'Publié' },
        { id: 2, type: 'Page', title: 'À propos', lastUpdated: '10/01/2025', status: 'Publié' },
        { id: 3, type: 'Exposition', title: 'Les Impressionnistes Contemporains', lastUpdated: '01/03/2025', status: 'Publié' },
        { id: 4, type: 'Événement', title: 'Vernissage: Pierre Dubois', lastUpdated: '05/03/2025', status: 'Brouillon' },
        { id: 5, type: 'Artiste', title: 'Sophie Durand', lastUpdated: '20/02/2025', status: 'Publié' },
        { id: 6, type: 'Page', title: 'Contact', lastUpdated: '12/02/2025', status: 'Publié' },
        { id: 7, type: 'Exposition', title: 'Abstractions', lastUpdated: '28/02/2025', status: 'Brouillon' }
      ]);

      setLoading(false);
    }, 1200);
  }, [period]);

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Administration</h1>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            <span className="text-sm text-gray-600">Connecté en tant que Admin</span>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 px-1 font-medium text-sm border-b-2 ${
                activeTab === 'dashboard'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Tableau de bord
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={`py-4 px-1 font-medium text-sm border-b-2 ${
                activeTab === 'content'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Gestion du contenu
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-4 px-1 font-medium text-sm border-b-2 ${
                activeTab === 'settings'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Paramètres
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-1 font-medium text-sm border-b-2 ${
                activeTab === 'users'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Utilisateurs
            </button>
          </nav>
        </div>
        
        {/* Dashboard Content */}
        {activeTab === 'dashboard' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Statistiques du site</h2>
              <div className="inline-flex bg-white rounded-md shadow-sm">
                <button
                  onClick={() => handlePeriodChange('day')}
                  className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                    period === 'day'
                      ? 'bg-red-50 text-red-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Jour
                </button>
                <button
                  onClick={() => handlePeriodChange('week')}
                  className={`px-4 py-2 text-sm font-medium ${
                    period === 'week'
                      ? 'bg-red-50 text-red-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Semaine
                </button>
                <button
                  onClick={() => handlePeriodChange('month')}
                  className={`px-4 py-2 text-sm font-medium ${
                    period === 'month'
                      ? 'bg-red-50 text-red-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Mois
                </button>
                <button
                  onClick={() => handlePeriodChange('year')}
                  className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                    period === 'year'
                      ? 'bg-red-50 text-red-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Année
                </button>
              </div>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-96">
                <div className="text-gray-600">Chargement des données...</div>
              </div>
            ) : (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {/* Visitors Card */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Visiteurs</p>
                        <h3 className="text-2xl font-bold text-gray-800">{stats.visitors.count}</h3>
                      </div>
                      <div className="p-2 bg-blue-50 rounded-md">
                        <IconUsers />
                      </div>
                    </div>
                    <div className={`flex items-center mt-4 ${
                      stats.visitors.positive ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <span className="text-sm font-medium">
                        {stats.visitors.positive ? '+' : '-'}{stats.visitors.change}%
                      </span>
                      <span className="ml-1 text-xs text-gray-500">vs période précédente</span>
                    </div>
                  </div>
                  
                  {/* Pageviews Card */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Pages vues</p>
                        <h3 className="text-2xl font-bold text-gray-800">{stats.pageviews.count}</h3>
                      </div>
                      <div className="p-2 bg-green-50 rounded-md">
                        <IconViews />
                      </div>
                    </div>
                    <div className={`flex items-center mt-4 ${
                      stats.pageviews.positive ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <span className="text-sm font-medium">
                        {stats.pageviews.positive ? '+' : '-'}{stats.pageviews.change}%
                      </span>
                      <span className="ml-1 text-xs text-gray-500">vs période précédente</span>
                    </div>
                  </div>
                  
                  {/* Avg Time Card */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Temps moyen</p>
                        <h3 className="text-2xl font-bold text-gray-800">{stats.avgTime.count}</h3>
                      </div>
                      <div className="p-2 bg-purple-50 rounded-md">
                        <IconTime />
                      </div>
                    </div>
                    <div className={`flex items-center mt-4 ${
                      stats.avgTime.positive ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <span className="text-sm font-medium">
                        {stats.avgTime.positive ? '+' : '-'}{stats.avgTime.change}%
                      </span>
                      <span className="ml-1 text-xs text-gray-500">vs période précédente</span>
                    </div>
                  </div>
                  
                  {/* Bounce Rate Card */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Taux de rebond</p>
                        <h3 className="text-2xl font-bold text-gray-800">{stats.bounceRate.count}%</h3>
                      </div>
                      <div className="p-2 bg-red-50 rounded-md">
                        <IconBounce />
                      </div>
                    </div>
                    <div className={`flex items-center mt-4 ${
                      !stats.bounceRate.positive ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <span className="text-sm font-medium">
                        {stats.bounceRate.positive ? '+' : '-'}{stats.bounceRate.change}%
                      </span>
                      <span className="ml-1 text-xs text-gray-500">vs période précédente</span>
                    </div>
                  </div>
                </div>
                
                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                  {/* Visitor Chart */}
                  <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Évolution des visiteurs</h3>
                    <div className="h-64 w-full">
                      {/* Simulate a chart with bars */}
                      <div className="h-52 flex items-end space-x-2">
                        {stats.visitorChart.map((value, index) => (
                          <div 
                            key={index} 
                            className="bg-red-500 rounded-t w-full"
                            style={{ height: `${(value / 230) * 100}%` }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Device Chart */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Appareils</h3>
                    <div className="h-64 flex flex-col justify-center">
                      {/* Simulate a donut chart */}
                      <div className="relative mx-auto w-40 h-40 rounded-full overflow-hidden">
                        <div className="absolute inset-0 bg-blue-500" style={{ clipPath: 'polygon(50% 50%, 0 0, 0 100%, 100% 100%, 100% 0)' }}></div>
                        <div className="absolute inset-0 bg-green-500" style={{ clipPath: 'polygon(50% 50%, 100% 0, 100% 40%)' }}></div>
                        <div className="absolute inset-0 bg-yellow-500" style={{ clipPath: 'polygon(50% 50%, 100% 40%, 100% 55%)' }}></div>
                        <div className="absolute inset-0 bg-white rounded-full" style={{ inset: '25%' }}></div>
                      </div>
                      <div className="mt-6 space-y-2">
                        {stats.deviceData.map((device) => (
                          <div key={device.name} className="flex items-center">
                            <div 
                              className={`w-3 h-3 rounded-full mr-2 ${
                                device.name === 'Desktop' ? 'bg-blue-500' :
                                device.name === 'Mobile' ? 'bg-green-500' : 'bg-yellow-500'
                              }`}
                            ></div>
                            <span className="text-sm text-gray-600">{device.name}: {device.value}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Top Pages */}
                <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">Pages les plus visitées</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Page
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Vues
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Pourcentage
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {stats.topPages.map((page) => (
                          <tr key={page.name}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{page.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{page.views}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                  <div className="bg-red-600 h-2.5 rounded-full" style={{ width: `${page.percentage}%` }}></div>
                                </div>
                                <span className="ml-2 text-sm text-gray-500">{page.percentage}%</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
        
        {/* Content Management */}
        {activeTab === 'content' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Gestion du contenu</h2>
              <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                Nouveau contenu
              </button>
            </div>
            
            {/* Content Filters */}
            <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-lg shadow mb-6">
              <div className="flex space-x-4 mb-4 md:mb-0">
                <div>
                  <label htmlFor="content-type" className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    id="content-type"
                    name="content-type"
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                  >
                    <option value="all">Tous les types</option>
                    <option value="page">Pages</option>
                    <option value="exhibition">Expositions</option>
                    <option value="event">Événements</option>
                    <option value="artist">Artistes</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="content-status" className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                  <select
                    id="content-status"
                    name="content-status"
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="published">Publié</option>
                    <option value="draft">Brouillon</option>
                  </select>
                </div>
              </div>
              <div className="w-full md:w-1/3">
                <label htmlFor="content-search" className="block text-sm font-medium text-gray-700 mb-1">Rechercher</label>
                <input
                  type="text"
                  name="content-search"
                  id="content-search"
                  className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Rechercher un contenu..."
                />
              </div>
            </div>
            
            {/* Content Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Titre
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dernière mise à jour
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                          <div className="text-sm text-gray-500">{item.type}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{item.lastUpdated}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            item.status === 'Publié' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-3">
                            <button className="text-indigo-600 hover:text-indigo-900">Éditer</button>
                            <button className="text-red-600 hover:text-red-900">Supprimer</button>
                            {item.status === 'Brouillon' && (
                              <button className="text-green-600 hover:text-green-900">Publier</button>
                            )}
                            {item.status === 'Publié' && (
                              <button className="text-yellow-600 hover:text-yellow-900">Dépublier</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Précédent
                  </button>
                  <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Suivant
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Affichage de <span className="font-medium">1</span> à <span className="font-medium">7</span> sur <span className="font-medium">12</span> résultats
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        Précédent
                      </button>
                      <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                        1
                      </button>
                      <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-red-50 text-sm font-medium text-red-600">
                        2
                      </button>
                      <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                        3
                      </button>
                      <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        Suivant
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Paramètres du site</h2>
            
            <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-800">Informations générales</h3>
              </div>
              <div className="px-6 py-4 space-y-6">
                <div>
                  <label htmlFor="site-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom du site
                  </label>
                  <input
                    type="text"
                    name="site-name"
                    id="site-name"
                    className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    defaultValue="Galerie Pol Lemetais"
                  />
                </div>
                <div>
                  <label htmlFor="site-description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="site-description"
                    name="site-description"
                    rows={3}
                    className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    defaultValue="Galerie d'art contemporain à Paris présentant des artistes émergents et établis."
                  />
                </div>
                <div>
                  <label htmlFor="site-logo" className="block text-sm font-medium text-gray-700 mb-1">
                    Logo du site
                  </label>
                  <div className="flex items-center">
                    <div className="w-20 h-20 bg-gray-200 mr-4 rounded overflow-hidden">
                      <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500">
                        Logo
                      </div>
                    </div>
                    <button type="button" className="bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                      Changer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;