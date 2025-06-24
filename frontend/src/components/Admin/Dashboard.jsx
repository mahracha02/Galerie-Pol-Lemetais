import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaNewspaper, FaUsers, FaCalendarAlt, FaChartLine, FaEye, FaComments, FaImage, FaSearch, FaBell, FaCog, FaChartBar, FaArrowUp, FaArrowDown, FaPaintBrush, FaEnvelope, FaUserShield } from 'react-icons/fa';

const Dashboard = ({ darkMode }) => {
  const [stats, setStats] = useState({
    actualites: 0,
    expositions: 0,
    evenements: 0,
    artistes: 0,
    oeuvres: 0,
    contacts: 0,
    utilisateurs: 0,
    catalogues: 0,
    medias: 0
  });

  const [visitorsData, setVisitorsData] = useState([
    { month: 'Jan', visitors: 1200 },
    { month: 'Fév', visitors: 1800 },
    { month: 'Mar', visitors: 2400 },
    { month: 'Avr', visitors: 2100 },
    { month: 'Mai', visitors: 2800 },
    { month: 'Juin', visitors: 3200 },
    { month: 'Juil', visitors: 3000 },
    { month: 'Août', visitors: 2700 },
    { month: 'Sep', visitors: 4200 },
    { month: 'Oct', visitors: 4300 },
    { month: 'Nov', visitors: 4500 },
    { month: 'Déc', visitors: 5200 }
  ]);

  const [notifications, setNotifications] = useState([
    { id: 1, title: "Nouvelle exposition", message: "L'exposition d'été a été publiée", time: "5 min", type: "success" },
    { id: 2, title: "Mise à jour requise", message: "Mise à jour du système disponible", time: "1h", type: "warning" },
    { id: 3, title: "Nouveau commentaire", message: "Un visiteur a commenté l'exposition", time: "2h", type: "info" },
    { id: 4, title: "Nouvel artiste", message: "Un nouvel artiste a été ajouté", time: "3h", type: "success" },
    { id: 5, title: "Contact reçu", message: "Nouveau message de contact", time: "4h", type: "info" }
  ]);

  const [userEngagement, setUserEngagement] = useState({
    averageTime: "4m 32s",
    bounceRate: "32%",
    returningVisitors: "68%",
    newVisitors: "32%",
    pagesPerSession: "3.2",
    conversionRate: "2.4%"
  });

  // Fetch real stats from API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch actualites count
        const actualitesResponse = await fetch('/actualites/admin/api/');
        const actualitesCount = await actualitesResponse.json();
        
        // Fetch expositions count
        const expositionsResponse = await fetch('/expositions/admin/api/');
        const expositionsCount = await expositionsResponse.json();
        
        // Fetch evenements count
        const evenementsResponse = await fetch('/evenement/admin/api/');
        const evenementsCount = await evenementsResponse.json();
        
        // Fetch artistes count
        const artistesResponse = await fetch('/artistes/admin/api/');
        const artistesCount = await artistesResponse.json();
        
        // Fetch oeuvres count
        const oeuvresResponse = await fetch('/oeuvres/admin/api/');
        const oeuvresCount = await oeuvresResponse.json();
        
        // Fetch contacts count
        const contactsResponse = await fetch('/contacts/admin/api/');
        const contactsCount = await contactsResponse.json();
        
        // Fetch utilisateurs count (only for super admin)
        let utilisateursCount = 0;
        try {
          const utilisateursResponse = await fetch('admin/admin/api/');
          utilisateursCount = await utilisateursResponse.json();
        } catch (error) {
          // User doesn't have permission to access utilisateurs
        }
        
        // Fetch catalogues count
        const cataloguesResponse = await fetch('/catalogues/admin/api/');
        const cataloguesCount = await cataloguesResponse.json();
        
        // Fetch medias count
        const mediasResponse = await fetch('/medias/admin/api/');
        const mediasCount = await mediasResponse.json();

        setStats({
          actualites: actualitesCount || 0,
          expositions: expositionsCount || 0,
          evenements: evenementsCount || 0,
          artistes: artistesCount || 0,
          oeuvres: oeuvresCount || 0,
          contacts: contactsCount || 0,
          utilisateurs: utilisateursCount || 0,
          catalogues: cataloguesCount || 0,
          medias: mediasCount || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Use fallback data if API calls fail
        setStats({
          actualites: 24,
          expositions: 8,
          evenements: 15,
          artistes: 12,
          oeuvres: 45,
          contacts: 8,
          utilisateurs: 3,
          catalogues: 5,
          medias: 18
        });
      }
    };

    fetchStats();
  }, []);

  const statsCards = [
    {
      title: "Actualités",
      value: stats.actualites,
      icon: <FaNewspaper className="w-6 h-6" />,
      color: darkMode ? "from-blue-500 to-blue-600" : "from-blue-200 to-blue-300",
      link: "/admin/actualites"
    },
    {
      title: "Expositions",
      value: stats.expositions,
      icon: <FaImage className="w-6 h-6" />,
      color: darkMode ? "from-purple-500 to-purple-600" : "from-purple-200 to-purple-300",
      link: "/admin/expositions"
    },
    {
      title: "Événements",
      value: stats.evenements,
      icon: <FaCalendarAlt className="w-6 h-6" />,
      color: darkMode ? "from-green-500 to-green-600" : "from-green-200 to-green-300",
      link: "/admin/evenements"
    },
    {
      title: "Artistes",
      value: stats.artistes,
      icon: <FaUsers className="w-6 h-6" />,
      color: darkMode ? "from-yellow-500 to-yellow-600" : "from-yellow-200 to-yellow-300",
      link: "/admin/artistes"
    },
    {
      title: "Œuvres",
      value: stats.oeuvres,
      icon: <FaPaintBrush className="w-6 h-6" />,
      color: darkMode ? "from-pink-500 to-pink-600" : "from-pink-200 to-pink-300",
      link: "/admin/oeuvres"
    },
    {
      title: "Contacts",
      value: stats.contacts,
      icon: <FaEnvelope className="w-6 h-6" />,
      color: darkMode ? "from-indigo-500 to-indigo-600" : "from-indigo-200 to-indigo-300",
      link: "/admin/contacts"
    },
    {
      title: "Utilisateurs",
      value: stats.utilisateurs,
      icon: <FaUserShield className="w-6 h-6" />,
      color: darkMode ? "from-red-500 to-red-600" : "from-red-200 to-red-300",
      link: "/admin/utilisateurs"
    },
    {
      title: "Catalogues",
      value: stats.catalogues,
      icon: <FaImage className="w-6 h-6" />,
      color: darkMode ? "from-teal-500 to-teal-600" : "from-teal-200 to-teal-300",
      link: "/admin/catalogues"
    },
    {
      title: "Médias",
      value: stats.medias,
      icon: <FaImage className="w-6 h-6" />,
      color: darkMode ? "from-orange-500 to-orange-600" : "from-orange-200 to-orange-300",
      link: "/admin/medias"
    }
  ];

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, type: 'spring' } })
  };

  const maxVisitors = Math.max(...visitorsData.map(d => d.visitors));

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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8 px-6 w-full">
          {statsCards.map((stat, index) => (
            <motion.div
              key={index}
              className={`${darkMode ? 'bg-[#232326] text-white' : 'bg-white text-[#18181b]'} rounded-xl shadow-lg p-6 hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer w-full`}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              whileHover={{ scale: 1.05 }}
            >
              <Link to={stat.link} className="block">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{stat.title}</p>
                    <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                  </div>
                  <div className={`p-3 rounded-full bg-gradient-to-r ${stat.color} shadow-md`}>{stat.icon}</div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Charts and Notifications Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-6 w-full mb-8">
          {/* Visitors Chart - Takes 2/3 width */}
          <div className="lg:col-span-2">
            <motion.div
              className={`${darkMode ? 'bg-[#232326] text-white' : 'bg-white text-[#18181b]'} rounded-xl shadow-lg p-6 w-full`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.7, type: 'spring' }}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Visiteurs mensuels</h3>
                <div className="flex items-center space-x-4">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Total: {visitorsData.reduce((sum, d) => sum + d.visitors, 0).toLocaleString()}
                  </span>
                  <button className="text-sm text-blue-400 hover:text-blue-300">Voir détails</button>
                </div>
              </div>
              
              {/* Modern Chart */}
              <div className="h-64 relative">
                {/* Grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between">
                  {[0, 25, 50, 75, 100].map((percent) => (
                    <div key={percent} className={`w-full border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`} />
                  ))}
                </div>
                
                {/* Chart bars */}
                <div className="absolute inset-0 flex items-end space-x-1 px-2 h-52" style={{maxheight: '200px'}}>
                  {visitorsData.map((data, index) => (
                    <motion.div
                      key={index}
                      className="flex-1 flex flex-col items-center group relative"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.05, duration: 0.5, type: 'spring' }}
                    >
                      <div
                        className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all duration-300 hover:from-blue-500 hover:to-blue-300 group-hover:shadow-lg"
                        style={{
                          height: maxVisitors > 0 ? `${(data.visitors / maxVisitors) * 200}px` : '5px'
                        }}
                      />
                      {/* Tooltip */}
                      <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg z-10">
                        {data.visitors.toLocaleString()} visiteurs
                      </div>
                      <span className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{data.month}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              {/* Scale */}
              <div className={`flex justify-between mt-4 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <span>0</span>
                <span>{(maxVisitors * 0.25).toLocaleString()}</span>
                <span>{(maxVisitors * 0.5).toLocaleString()}</span>
                <span>{(maxVisitors * 0.75).toLocaleString()}</span>
                <span>{maxVisitors.toLocaleString()}</span>
              </div>
            </motion.div>
          </div>

          {/* Notifications - Takes 1/3 width */}
          <div className="lg:col-span-1">
            <motion.div
              className={`${darkMode ? 'bg-[#232326] text-white' : 'bg-white text-[#18181b]'} rounded-xl shadow-lg p-6 w-full h-full`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7, type: 'spring' }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Notifications</h3>
                <button className="text-sm text-blue-400 hover:text-blue-300">Tout voir</button>
              </div>
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {notifications.map((notification) => (
                  <motion.div 
                    key={notification.id} 
                    className={`flex items-start space-x-3 p-3 rounded-lg hover:${darkMode ? 'bg-gray-800' : 'bg-gray-100'} transition-colors duration-200 cursor-pointer`}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className={`p-2 rounded-full ${
                      notification.type === 'success' ? (darkMode ? 'bg-green-900' : 'bg-green-100') :
                      notification.type === 'warning' ? (darkMode ? 'bg-yellow-900' : 'bg-yellow-100') :
                      (darkMode ? 'bg-blue-900' : 'bg-blue-100')
                    }`}>
                      {notification.type === 'success' ? <FaNewspaper className="w-4 h-4 text-green-400" /> :
                       notification.type === 'warning' ? <FaCog className="w-4 h-4 text-yellow-400" /> :
                       <FaComments className="w-4 h-4 text-blue-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{notification.title}</p>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} truncate`}>{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* User Engagement - Full width at bottom */}
        <div className="px-6 w-full mb-8">
          <motion.div
            className={`${darkMode ? 'bg-[#232326] text-white' : 'bg-white text-[#18181b]'} rounded-xl shadow-lg p-6 w-full`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7, type: 'spring' }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Engagement utilisateur</h3>
              <button className="text-sm text-blue-400 hover:text-blue-300">Exporter les données</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 w-full">
              <div className={`${darkMode ? 'bg-[#18181b]' : 'bg-[#f3f3f3]'} p-4 rounded-lg hover:${darkMode ? 'bg-[#232326]' : 'bg-white'} transition-all duration-200 hover:scale-105`}>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Temps moyen</p>
                <p className="text-xl font-semibold">{userEngagement.averageTime}</p>
              </div>
              <div className={`${darkMode ? 'bg-[#18181b]' : 'bg-[#f3f3f3]'} p-4 rounded-lg hover:${darkMode ? 'bg-[#232326]' : 'bg-white'} transition-all duration-200 hover:scale-105`}>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Taux de rebond</p>
                <p className="text-xl font-semibold">{userEngagement.bounceRate}</p>
              </div>
              <div className={`${darkMode ? 'bg-[#18181b]' : 'bg-[#f3f3f3]'} p-4 rounded-lg hover:${darkMode ? 'bg-[#232326]' : 'bg-white'} transition-all duration-200 hover:scale-105`}>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Visiteurs réguliers</p>
                <p className="text-xl font-semibold">{userEngagement.returningVisitors}</p>
              </div>
              <div className={`${darkMode ? 'bg-[#18181b]' : 'bg-[#f3f3f3]'} p-4 rounded-lg hover:${darkMode ? 'bg-[#232326]' : 'bg-white'} transition-all duration-200 hover:scale-105`}>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Nouveaux visiteurs</p>
                <p className="text-xl font-semibold">{userEngagement.newVisitors}</p>
              </div>
              <div className={`${darkMode ? 'bg-[#18181b]' : 'bg-[#f3f3f3]'} p-4 rounded-lg hover:${darkMode ? 'bg-[#232326]' : 'bg-white'} transition-all duration-200 hover:scale-105`}>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Pages par session</p>
                <p className="text-xl font-semibold">{userEngagement.pagesPerSession}</p>
              </div>
              <div className={`${darkMode ? 'bg-[#18181b]' : 'bg-[#f3f3f3]'} p-4 rounded-lg hover:${darkMode ? 'bg-[#232326]' : 'bg-white'} transition-all duration-200 hover:scale-105`}>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Taux de conversion</p>
                <p className="text-xl font-semibold">{userEngagement.conversionRate}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 