import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const isSuccess = type === 'success';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.5 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`fixed bottom-20 md:bottom-5 right-5 z-50 flex items-center p-4 rounded-lg shadow-lg border ${
        isSuccess 
          ? 'bg-success/90 text-white border-success' 
          : 'bg-danger/90 text-white border-danger'
      } backdrop-blur-sm`}
      onClick={onClose}
    >
      {isSuccess ? (
        <CheckCircle className="w-6 h-6 mr-3" />
      ) : (
        <AlertCircle className="w-6 h-6 mr-3" />
      )}
      <span className="font-medium">{message}</span>
    </motion.div>
  );
};

export default Toast;
