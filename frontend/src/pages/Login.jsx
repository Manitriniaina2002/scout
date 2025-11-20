import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import LoginForm from "../components/LoginForm";
import logo from '../assets/LOGO-ADES_HD.png';

const Logo = () => (
  <div className="flex justify-center mb-4 lg:mb-1">
    {/* Image du logo */}
    <img
      src={logo}
      alt="Logo ADES"
      className="w-32 h-32 sm:w-40 sm:h-40 lg:w-64 lg:h-64 object-contain"
    />
  </div>
);

const ADESLogin = () => {
  const navigate = useNavigate();

  return (
    <div className="white-bg-green-animation min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="green-wave"></div>
      <div className="green-wave-2"></div>
      <div className="yellow-wave"></div>
      <div className="yellow-circle-1"></div>
      <div className="yellow-circle-2"></div>
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full bg-white backdrop-blur-md border border-transparent rounded-lg shadow-lg relative z-10 flex flex-col lg:flex-row"
        >
        <button
          onClick={() => navigate('/controls')}
          className="absolute top-4 left-4 z-20 p-2 text-gray-400 hover:text-gray-600 transition-colors"
          title="Retour aux contrôles"
        >
          <ArrowLeft className="h-6 w-6 sm:h-7 sm:w-7" />
        </button>
        <div className="w-full lg:w-1/2 p-6 lg:p-20 flex flex-col justify-center items-center">
          <div className="w-full flex justify-center">
            <Logo />
          </div>
        </div>
        <div className="w-full lg:w-1/2 p-6 lg:p-8 flex items-center justify-center">
          <LoginForm />
        </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ADESLogin;