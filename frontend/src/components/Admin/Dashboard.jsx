import React from 'react';
import { Link } from 'react-router-dom';
import { FaNewspaper, FaUsers, FaCalendarAlt, FaChartLine, FaEye, FaComments, FaImage, FaSearch, FaBell, FaCog, FaChartBar, FaArrowUp, FaArrowDown, FaPaintBrush, FaEnvelope } from 'react-icons/fa';

const Dashboard = () => {
  const stats = [
    {
      title: "Vues totales",
      value: "12,345",
      change: "+12.5%",
      trend: "up",
      icon: <FaEye className="w-6 h-6" />,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Actualités",
      value: "24",
      change: "+3",
      trend: "up",
      icon: <FaNewspaper className="w-6 h-6" />,
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Expositions",
      value: "8",
      change: "-1",
      trend: "down",
      icon: <FaImage className="w-6 h-6" />,
      color: "from-green-500 to-green-600"
    },
    {
      title: "Événements",
      value: "15",
      change: "+2",
      trend: "up",
      icon: <FaCalendarAlt className="w-6 h-6" />,
      color: "from-red-500 to-red-600"
    }
  ];

  const analyticsData = {
    pageViews: [
      { month: 'Jan', views: 1200, trend: 'up' },
      { month: 'Fév', views: 1800, trend: 'up' },
      { month: 'Mar', views: 2400, trend: 'up' },
      { month: 'Avr', views: 2100, trend: 'down' },
      { month: 'Mai', views: 2800, trend: 'up' },
      { month: 'Juin', views: 3200, trend: 'up' }
    ],
    popularContent: [
      { title: "Rétrospective Pol Lemétais", views: 2450, type: "exposition", trend: "up" },
      { title: "Vernissage d'été", views: 1890, type: "evenement", trend: "up" },
      { title: "Nouvelle collection", views: 1560, type: "actualite", trend: "down" }
    ],
    userEngagement: {
      averageTime: "4m 32s",
      bounceRate: "32%",
      returningVisitors: "68%",
      newVisitors: "32%",
      pagesPerSession: "3.2",
      conversionRate: "2.4%"
    }
  };

  const notifications = [
    { id: 1, title: "Nouvelle exposition", message: "L'exposition d'été a été publiée", time: "5 min", type: "success" },
    { id: 2, title: "Mise à jour requise", message: "Mise à jour du système disponible", time: "1h", type: "warning" },
    { id: 3, title: "Nouveau commentaire", message: "Un visiteur a commenté l'exposition", time: "2h", type: "info" }
  ];

  const recentActivity = [
    {
      type: "actualite",
      title: "Nouvelle actualité publiée",
      description: "Exposition d'été 2024",
      time: "Il y a 2 heures",
      icon: <FaNewspaper className="w-5 h-5" />
    },
    {
      type: "exposition",
      title: "Exposition mise à jour",
      description: "Rétrospective Pol Lemétais",
      time: "Il y a 5 heures",
      icon: <FaImage className="w-5 h-5" />
    },
    {
      type: "evenement",
      title: "Nouvel événement créé",
      description: "Vernissage du 15 juin",
      time: "Il y a 1 jour",
      icon: <FaCalendarAlt className="w-5 h-5" />
    }
  ];
  

  

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Search and Notifications */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-600">Bienvenue sur le panneau d&apos;administration</p>
          </div>
          <div className="flex items-center space-x-4 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full md:w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
            <button className="relative p-2 text-gray-600 hover:text-gray-800">
              <FaBell className="w-6 h-6" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-800">
              <FaCog className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Stats Grid with Trends */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</h3>
                  <div className="flex items-center mt-1">
                    {stat.trend === 'up' ? (
                      <FaArrowUp className="w-3 h-3 text-green-500 mr-1" />
                    ) : (
                      <FaArrowDown className="w-3 h-3 text-red-500 mr-1" />
                    )}
                    <p className={`text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change}
                    </p>
                  </div>
                </div>
                <div className={`p-3 rounded-full bg-gradient-to-r ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Management Cards */}
        <div className="mt-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Gestion du contenu</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link to="/admin/actualites" className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-200 group">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-blue-100 mr-4 group-hover:bg-blue-200 transition-colors duration-200">
                  <FaNewspaper className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-800">Actualités</h3>
              </div>
              <p className="text-gray-600 text-sm">Gérer les articles et actualités</p>
            </Link>

            <Link to="/admin/expositions" className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-200 group">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-purple-100 mr-4 group-hover:bg-purple-200 transition-colors duration-200">
                  <FaImage className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-800">Expositions</h3>
              </div>
              <p className="text-gray-600 text-sm">Gérer les expositions</p>
            </Link>

            <Link to="/admin/evenements" className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-200 group">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-green-100 mr-4 group-hover:bg-green-200 transition-colors duration-200">
                  <FaCalendarAlt className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-800">Événements</h3>
              </div>
              <p className="text-gray-600 text-sm">Gérer les événements</p>
            </Link>

            <Link to="/admin/utilisateurs" className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-200 group">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-red-100 mr-4 group-hover:bg-red-200 transition-colors duration-200">
                  <FaUsers className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="font-semibold text-gray-800">Utilisateurs</h3>
              </div>
              <p className="text-gray-600 text-sm">Gérer les utilisateurs</p>
            </Link>

            <Link to="/admin/artistes" className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-200 group">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-yellow-100 mr-4 group-hover:bg-yellow-200 transition-colors duration-200">
                  <FaUsers className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="font-semibold text-gray-800">Artists</h3>
              </div>
              <p className="text-gray-600 text-sm">Gérer les artistes</p>
            </Link>

            <Link to="/admin/oeuvres" className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-200 group">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-pink-100 mr-4 group-hover:bg-pink-200 transition-colors duration-200">
                  <FaPaintBrush className="w-6 h-6 text-pink-600" />
                </div>  
                <h3 className="font-semibold text-gray-800">Oeuvres</h3>
              </div>
              <p className="text-gray-600 text-sm">Gérer les oeuvres</p>
            </Link>

            <Link to="/admin/contacts" className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-200 group">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-indigo-100 mr-4 group-hover:bg-indigo-200 transition-colors duration-200">
                  <FaEnvelope className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-gray-800">Contacts</h3>
              </div>
              <p className="text-gray-600 text-sm">Gérer les contacts</p>
            </Link>

          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Analytics & Insights */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Analytics & Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Page Views Chart */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-800">Vues mensuelles</h3>
                  <button className="text-sm text-blue-600 hover:text-blue-700">Voir détails</button>
                </div>
                <div className="h-48 relative">
                  {/* Grid lines */}
                  <div className="absolute inset-0 flex flex-col justify-between">
                    {[0, 25, 50, 75, 100].map((percent) => (
                      <div key={percent} className="w-full border-t border-gray-100" />
                    ))}
                  </div>
                  
                  {/* Bars */}
                  <div className="absolute inset-0 flex items-end space-x-2 px-2">
                    {analyticsData.pageViews.map((data, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center group">
                        <div 
                          className="w-full bg-blue-500 rounded-t-lg transition-all duration-300 hover:bg-blue-600 min-h-[20px] group-hover:bg-blue-600"
                          style={{ 
                            height: `${Math.max((data.views / 3200) * 100, 5)}%`,
                            minHeight: '20px'
                          }}
                        />
                        <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                          {data.views} vues
                        </div>
                        <span className="text-xs text-gray-500 mt-2">{data.month}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Scale */}
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>0</span>
                  <span>800</span>
                  <span>1600</span>
                  <span>2400</span>
                  <span>3200</span>
                </div>
              </div>

              {/* Popular Content */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-800">Contenu populaire</h3>
                  <button className="text-sm text-blue-600 hover:text-blue-700">Tout voir</button>
                </div>
                <div className="space-y-4">
                  {analyticsData.popularContent.map((content, index) => (
                    <div key={index} className="flex items-center justify-between group hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${
                          content.type === 'exposition' ? 'bg-purple-100' :
                          content.type === 'evenement' ? 'bg-green-100' :
                          'bg-blue-100'
                        }`}>
                          {content.type === 'exposition' ? <FaImage className="w-4 h-4 text-purple-600" /> :
                           content.type === 'evenement' ? <FaCalendarAlt className="w-4 h-4 text-green-600" /> :
                           <FaNewspaper className="w-4 h-4 text-blue-600" />}
                        </div>
                        <div>
                          <span className="text-sm text-gray-800">{content.title}</span>
                          <div className="flex items-center mt-1">
                            {content.trend === 'up' ? (
                              <FaArrowUp className="w-2 h-2 text-green-500 mr-1" />
                            ) : (
                              <FaArrowDown className="w-2 h-2 text-red-500 mr-1" />
                            )}
                            <span className="text-xs text-gray-500">{content.views} vues</span>
                          </div>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <FaChartBar className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* User Engagement */}
              <div className="bg-white rounded-xl shadow-sm p-6 md:col-span-2">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-800">Engagement utilisateur</h3>
                  <button className="text-sm text-blue-600 hover:text-blue-700">Exporter</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    <p className="text-sm text-gray-600">Temps moyen</p>
                    <p className="text-xl font-semibold text-gray-800">{analyticsData.userEngagement.averageTime}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    <p className="text-sm text-gray-600">Taux de rebond</p>
                    <p className="text-xl font-semibold text-gray-800">{analyticsData.userEngagement.bounceRate}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    <p className="text-sm text-gray-600">Visiteurs réguliers</p>
                    <p className="text-xl font-semibold text-gray-800">{analyticsData.userEngagement.returningVisitors}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    <p className="text-sm text-gray-600">Nouveaux visiteurs</p>
                    <p className="text-xl font-semibold text-gray-800">{analyticsData.userEngagement.newVisitors}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    <p className="text-sm text-gray-600">Pages par session</p>
                    <p className="text-xl font-semibold text-gray-800">{analyticsData.userEngagement.pagesPerSession}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    <p className="text-sm text-gray-600">Taux de conversion</p>
                    <p className="text-xl font-semibold text-gray-800">{analyticsData.userEngagement.conversionRate}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Notifications</h2>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                      <div className={`p-2 rounded-full ${
                        notification.type === 'success' ? 'bg-green-100' :
                        notification.type === 'warning' ? 'bg-yellow-100' :
                        'bg-blue-100'
                      }`}>
                        {notification.type === 'success' ? <FaNewspaper className="w-4 h-4 text-green-600" /> :
                         notification.type === 'warning' ? <FaCog className="w-4 h-4 text-yellow-600" /> :
                         <FaComments className="w-4 h-4 text-blue-600" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{notification.title}</p>
                        <p className="text-sm text-gray-600">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Activité récente</h2>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                      <div className="p-2 rounded-full bg-gray-100">
                        {activity.icon}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{activity.title}</p>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default Dashboard;
