import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaPaintBrush } from 'react-icons/fa';
import { useAuth } from '../contexts/useAuth';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const response = await fetch('/admin/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Identifiants invalides');
      }
      const data = await response.json();
      if (!data.token) {
        throw new Error('Token manquant dans la réponse');
      }
      if (!data.user) {
        throw new Error('Utilisateur manquant dans la réponse');
      }
      login(data.token, data.user);
      navigate('/admin');
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #972924 0%, #0C0C0C 100%)' }}>
      {/* Animated background art shapes */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.15, scale: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none"
      >
        <svg width="100%" height="100%" viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <motion.ellipse
            cx="300" cy="200" rx="220" ry="120"
            fill="#fff" fillOpacity="0.08"
            animate={{ x: [0, 40, 0], y: [0, 20, 0] }}
            transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
          />
          <motion.ellipse
            cx="1200" cy="700" rx="180" ry="90"
            fill="#FFD700" fillOpacity="0.07"
            animate={{ x: [0, -30, 0], y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut' }}
          />
          <motion.ellipse
            cx="900" cy="300" rx="140" ry="70"
            fill="#972924" fillOpacity="0.10"
            animate={{ x: [0, 20, 0], y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 12, ease: 'easeInOut' }}
          />
        </svg>
      </motion.div>
      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 flex flex-col items-center justify-center bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl px-10 py-12 mt-24 border border-[#972924]/10"
        style={{ boxShadow: '0 8px 32px 0 rgba(151,41,36,0.15)' }}
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
          className="mb-4"
        >
          <FaPaintBrush className="w-14 h-14 text-[#972924] drop-shadow-lg" />
        </motion.div>
        <h1
          className="text-[2.5rem] md:text-[3rem] lg:text-[3.5rem] font-bold uppercase text-[#0C0C0C] mb-4 text-center"
          style={{ fontFamily: 'Kenyan Coffee, sans-serif', letterSpacing: 1 }}
        >
          Connexion
        </h1>
        <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-4 mt-2">
          <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
            <FaUser className="text-[#972924] mr-2" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="flex-1 bg-transparent outline-none text-[#0C0C0C] font-semibold text-base"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            />
          </div>
          <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
            <FaLock className="text-[#972924] mr-2" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Mot de passe"
              value={formData.password}
              onChange={handleChange}
              required
              className="flex-1 bg-transparent outline-none text-[#0C0C0C] font-semibold text-base"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              className="ml-2 text-[#972924] focus:outline-none"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {error && (
            <div className="text-red-600 text-center text-sm font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>{error}</div>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 mt-2 rounded-lg bg-[#972924] text-white font-bold text-lg transition hover:bg-[#7a1e1c] focus:outline-none focus:ring-2 focus:ring-[#972924] focus:ring-opacity-50 shadow-md"
            style={{ fontFamily: 'Poppins, sans-serif', letterSpacing: 1 }}
          >
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
