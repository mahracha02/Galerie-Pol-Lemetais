import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaNewspaper, FaUsers, FaCalendarAlt, FaChartLine, FaEye, FaComments, FaImage, FaSearch, FaBell, FaCog, FaChartBar, FaArrowUp, FaArrowDown, FaPaintBrush, FaEnvelope } from 'react-icons/fa';

const Dashboard = ( { darkMode } ) => {
  // Detect dark mode from localStorage or body class
  

  const stats = [
    {
      title: "Vues totales",
      value: "12,345",
      change: "+12.5%",
      trend: "up",
      icon: <FaEye className="w-6 h-6" />,
      color: darkMode ? "from-blue-500 to-blue-600" : "from-blue-200 to-blue-300"
    },
    {
      title: "Actualités",
      value: "24",
      change: "+3",
      trend: "up",
      icon: <FaNewspaper className="w-6 h-6" />,
      color: darkMode ? "from-purple-500 to-purple-600" : "from-purple-200 to-purple-300"
    },
    {
      title: "Expositions",
      value: "8",
      change: "-1",
      trend: "down",
      icon: <FaImage className="w-6 h-6" />,
      color: darkMode ? "from-green-500 to-green-600" : "from-green-200 to-green-300"
    },
    {
      title: "Événements",
      value: "15",
      change: "+2",
      trend: "up",
      icon: <FaCalendarAlt className="w-6 h-6" />,
      color: darkMode ? "from-red-500 to-red-600" : "from-red-200 to-red-300"
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

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, type: 'spring' } })
  };

  return (
    <div className={`min-h-screen w-full ${darkMode ? 'bg-[#18181b] text-white' : 'bg-[#f7f7f7] text-[#18181b]'} p-0`} style={{ fontFamily: 'Poppins, sans-serif' }}>
      <div className="w-full px-0">
        {/* Header with Search and Notifications */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 px-6 pt-6 w-full">
          <div>
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-[#18181b]'}`} style={{ fontFamily: 'Kenyan Coffee, sans-serif' }}>Dashboard</h1>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Bienvenue sur le panneau d&apos;administration</p>
          </div>
          <div className="flex items-center space-x-4 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <input
                type="text"
                placeholder="Rechercher..."
                className={`w-full md:w-64 pl-10 pr-4 py-2 rounded-lg border ${darkMode ? 'border-gray-700 bg-[#232326] text-white' : 'border-gray-300 bg-white text-[#18181b]'} focus:outline-none focus:ring-2 focus:ring-[#972924] focus:border-transparent`}
              />
              <FaSearch className={`absolute left-3 top-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
            <button className={`relative p-2 ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-[#972924]'}`}> 
              <FaBell className="w-6 h-6" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className={`p-2 ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-[#972924]'}`}> 
              <FaCog className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Stats Grid with Trends */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 px-6 w-full">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className={`${darkMode ? 'bg-[#232326] text-white' : 'bg-white text-[#18181b]'} rounded-xl shadow-lg p-6 hover:scale-105 hover:shadow-2xl transition-transform duration-300 cursor-pointer w-full`}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              whileHover={{ scale: 1.07 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{stat.title}</p>
                  <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                  <div className="flex items-center mt-1">
                    {stat.trend === 'up' ? (
                      <FaArrowUp className="w-3 h-3 text-green-400 mr-1" />
                    ) : (
                      <FaArrowDown className="w-3 h-3 text-red-400 mr-1" />
                    )}
                    <p className={`text-sm ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>{stat.change}</p>
                  </div>
                </div>
                <div className={`p-3 rounded-full bg-gradient-to-r ${stat.color} shadow-md`}>{stat.icon}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Management Cards */}
        <div className="mt-8 mb-8 px-6 w-full">
          <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-[#18181b]'}`} style={{ fontFamily: 'Kenyan Coffee, sans-serif' }}>Gestion du contenu</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {[{
              to: "/admin/actualites", icon: <FaNewspaper className="w-6 h-6 text-blue-400" />, label: "Actualités", desc: "Gérer les articles et actualités"
            }, {
              to: "/admin/expositions", icon: <FaImage className="w-6 h-6 text-purple-400" />, label: "Expositions", desc: "Gérer les expositions"
            }, {
              to: "/admin/evenements", icon: <FaCalendarAlt className="w-6 h-6 text-green-400" />, label: "Événements", desc: "Gérer les événements"
            }, {
              to: "/admin/utilisateurs", icon: <FaUsers className="w-6 h-6 text-red-400" />, label: "Utilisateurs", desc: "Gérer les utilisateurs"
            }, {
              to: "/admin/artistes", icon: <FaUsers className="w-6 h-6 text-yellow-400" />, label: "Artistes", desc: "Gérer les artistes"
            }, {
              to: "/admin/oeuvres", icon: <FaPaintBrush className="w-6 h-6 text-pink-400" />, label: "Œuvres", desc: "Gérer les oeuvres"
            }, {
              to: "/admin/contacts", icon: <FaEnvelope className="w-6 h-6 text-indigo-400" />, label: "Contacts", desc: "Gérer les contacts"
            }].map((item, idx) => (
              <motion.div
                key={item.to}
                className={`${darkMode ? 'bg-[#232326] text-white' : 'bg-white text-[#18181b]'} rounded-xl shadow-lg p-6 hover:scale-105 hover:shadow-2xl transition-transform duration-300 cursor-pointer w-full`}
                custom={idx}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                whileHover={{ scale: 1.07 }}
              >
                <Link to={item.to} className="flex items-center mb-4 gap-4">
                  <div className={`${darkMode ? 'bg-[#18181b]' : 'bg-[#f3f3f3]'} p-3 rounded-full`}>{item.icon}</div>
                  <h3 className="font-semibold text-lg">{item.label}</h3>
                </Link>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Analytics & Insights, Notifications, Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-6 w-full">
          {/* Analytics & Insights */}
          <div className="lg:col-span-2">
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-[#18181b]'}`} style={{ fontFamily: 'Kenyan Coffee, sans-serif' }}>Analytics & Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              {/* Page Views Chart */}
              <motion.div
                className={`${darkMode ? 'bg-[#232326] text-white' : 'bg-white text-[#18181b]'} rounded-xl shadow-lg p-6 w-full`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.7, type: 'spring' }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Vues mensuelles</h3>
                  <button className="text-sm text-blue-400 hover:text-blue-300">Voir détails</button>
                </div>
                <div className="h-48 relative">
                  {/* Grid lines */}
                  <div className="absolute inset-0 flex flex-col justify-between">
                    {[0, 25, 50, 75, 100].map((percent) => (
                      <div key={percent} className={`w-full border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`} />
                    ))}
                  </div>
                  {/* Bars */}
                  <div className="absolute inset-0 flex items-end space-x-2 px-2">
                    {analyticsData.pageViews.map((data, index) => (
                      <motion.div
                        key={index}
                        className="flex-1 flex flex-col items-center group"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + index * 0.07, duration: 0.5, type: 'spring' }}
                      >
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
                        <span className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{data.month}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
                {/* Scale */}
                <div className={`flex justify-between mt-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <span>0</span>
                  <span>800</span>
                  <span>1600</span>
                  <span>2400</span>
                  <span>3200</span>
                </div>
              </motion.div>

              {/* Popular Content */}
              <motion.div
                className={`${darkMode ? 'bg-[#232326] text-white' : 'bg-white text-[#18181b]'} rounded-xl shadow-lg p-6 w-full`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.7, type: 'spring' }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Contenu populaire</h3>
                  <button className="text-sm text-blue-400 hover:text-blue-300">Tout voir</button>
                </div>
                <div className="space-y-4">
                  {analyticsData.popularContent.map((content, index) => (
                    <div key={index} className={`flex items-center justify-between group hover:${darkMode ? 'bg-gray-800' : 'bg-gray-100'} p-2 rounded-lg transition-colors duration-200`}>
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${
                          content.type === 'exposition' ? (darkMode ? 'bg-purple-900' : 'bg-purple-100') :
                          content.type === 'evenement' ? (darkMode ? 'bg-green-900' : 'bg-green-100') :
                          (darkMode ? 'bg-blue-900' : 'bg-blue-100')
                        }`}>
                          {content.type === 'exposition' ? <FaImage className="w-4 h-4 text-purple-400" /> :
                           content.type === 'evenement' ? <FaCalendarAlt className="w-4 h-4 text-green-400" /> :
                           <FaNewspaper className="w-4 h-4 text-blue-400" />}
                        </div>
                        <div>
                          <span className="text-sm">{content.title}</span>
                          <div className="flex items-center mt-1">
                            {content.trend === 'up' ? (
                              <FaArrowUp className="w-2 h-2 text-green-400 mr-1" />
                            ) : (
                              <FaArrowDown className="w-2 h-2 text-red-400 mr-1" />
                            )}
                            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{content.views} vues</span>
                          </div>
                        </div>
                      </div>
                      <button className={`text-gray-400 hover:${darkMode ? 'text-white' : 'text-[#972924]'} opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
                        <FaChartBar className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* User Engagement */}
              <motion.div
                className={`${darkMode ? 'bg-[#232326] text-white' : 'bg-white text-[#18181b]'} rounded-xl shadow-lg p-6 md:col-span-2 w-full`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.7, type: 'spring' }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Engagement utilisateur</h3>
                  <button className="text-sm text-blue-400 hover:text-blue-300">Exporter</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                  <div className={`${darkMode ? 'bg-[#18181b]' : 'bg-[#f3f3f3]'} p-4 rounded-lg hover:${darkMode ? 'bg-[#232326]' : 'bg-white'} transition-colors duration-200`}>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Temps moyen</p>
                    <p className="text-xl font-semibold">{analyticsData.userEngagement.averageTime}</p>
                  </div>
                  <div className={`${darkMode ? 'bg-[#18181b]' : 'bg-[#f3f3f3]'} p-4 rounded-lg hover:${darkMode ? 'bg-[#232326]' : 'bg-white'} transition-colors duration-200`}>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Taux de rebond</p>
                    <p className="text-xl font-semibold">{analyticsData.userEngagement.bounceRate}</p>
                  </div>
                  <div className={`${darkMode ? 'bg-[#18181b]' : 'bg-[#f3f3f3]'} p-4 rounded-lg hover:${darkMode ? 'bg-[#232326]' : 'bg-white'} transition-colors duration-200`}>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Visiteurs réguliers</p>
                    <p className="text-xl font-semibold">{analyticsData.userEngagement.returningVisitors}</p>
                  </div>
                  <div className={`${darkMode ? 'bg-[#18181b]' : 'bg-[#f3f3f3]'} p-4 rounded-lg hover:${darkMode ? 'bg-[#232326]' : 'bg-white'} transition-colors duration-200`}>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Nouveaux visiteurs</p>
                    <p className="text-xl font-semibold">{analyticsData.userEngagement.newVisitors}</p>
                  </div>
                  <div className={`${darkMode ? 'bg-[#18181b]' : 'bg-[#f3f3f3]'} p-4 rounded-lg hover:${darkMode ? 'bg-[#232326]' : 'bg-white'} transition-colors duration-200`}>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Pages par session</p>
                    <p className="text-xl font-semibold">{analyticsData.userEngagement.pagesPerSession}</p>
                  </div>
                  <div className={`${darkMode ? 'bg-[#18181b]' : 'bg-[#f3f3f3]'} p-4 rounded-lg hover:${darkMode ? 'bg-[#232326]' : 'bg-white'} transition-colors duration-200`}>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Taux de conversion</p>
                    <p className="text-xl font-semibold">{analyticsData.userEngagement.conversionRate}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Notifications */}
          <div className="space-y-6 w-full">
            <motion.div
              className={`${darkMode ? 'bg-[#232326] text-white' : 'bg-white text-[#18181b]'} rounded-xl shadow-lg p-6 w-full`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7, type: 'spring' }}
            >
              <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-[#18181b]'}`} style={{ fontFamily: 'Kenyan Coffee, sans-serif' }}>Notifications</h2>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div key={notification.id} className={`flex items-start space-x-4 p-3 rounded-lg hover:${darkMode ? 'bg-gray-800' : 'bg-gray-100'} transition-colors duration-200`}>
                    <div className={`p-2 rounded-full ${
                      notification.type === 'success' ? (darkMode ? 'bg-green-900' : 'bg-green-100') :
                      notification.type === 'warning' ? (darkMode ? 'bg-yellow-900' : 'bg-yellow-100') :
                      (darkMode ? 'bg-blue-900' : 'bg-blue-100')
                    }`}>
                      {notification.type === 'success' ? <FaNewspaper className="w-4 h-4 text-green-400" /> :
                       notification.type === 'warning' ? <FaCog className="w-4 h-4 text-yellow-400" /> :
                       <FaComments className="w-4 h-4 text-blue-400" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{notification.title}</p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              className={`${darkMode ? 'bg-[#232326] text-white' : 'bg-white text-[#18181b]'} rounded-xl shadow-lg p-6 w-full`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7, type: 'spring' }}
            >
              <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-[#18181b]'}`} style={{ fontFamily: 'Kenyan Coffee, sans-serif' }}>Activité récente</h2>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className={`flex items-start space-x-4 p-3 rounded-lg hover:${darkMode ? 'bg-gray-800' : 'bg-gray-100'} transition-colors duration-200`}>
                    <div className={`${darkMode ? 'bg-gray-900' : 'bg-gray-200'} p-2 rounded-full`}>
                      {activity.icon}
                    </div>
                    <div>
                      <p className="font-medium">{activity.title}</p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
