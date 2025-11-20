import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import LoginForm from "../components/LoginForm";
import logo from '../assets/LOGO-ADES_HD.png';

const Logo = () => (
  <div className="flex justify-center mb-1">
    {/* Image du logo */}
    <img
      src={logo}
      alt="Logo ADES"
      className="w-50 h-50 object-container"
    />
  </div>
);

const ADESLogin = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-custom min-h-screen bg-gray-100 flex items-center justify-center relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 3, ease: "easeInOut" }}
        className="w-[800px] h-[400px] bg-white backdrop-blur-md border border-transparent rounded-lg shadow-lg relative z-10 flex"
      >
        <button
          onClick={() => navigate('/controls')}
          className="absolute top-4 left-4 p-2 text-gray-400 hover:text-gray-600 transition-colors z-20"
          title="Retour aux contrôles"
        >
          <ArrowLeft className="h-7 w-7" />
        </button>
        <div className="w-1/2 p-20 flex flex-col justify-between">
          <div>
            <Logo />
          </div>
        </div>
        <div className="w-1/2 p-8 flex items-center">
          <LoginForm />
        </div>
      </motion.div>
    </div>
  );
};

export default ADESLogin;