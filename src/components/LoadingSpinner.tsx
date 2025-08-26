import React from 'react';
import { motion } from 'framer-motion';
import { Wallet } from 'lucide-react';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-neutral-100 dark:bg-neutral-900 z-50">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Wallet className="w-16 h-16 text-primary" />
        </motion.div>
        <p className="mt-4 text-lg font-semibold text-neutral-600 dark:text-neutral-300">Carregando seus dados...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center p-10">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full"
      />
    </div>
  );
};

export default LoadingSpinner;
