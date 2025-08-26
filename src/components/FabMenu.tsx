import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, DollarSign, CreditCard, Landmark } from 'lucide-react';

interface FabMenuProps {
  isOpen: boolean;
  onClose: () => void;
  actions: { label: string; onClick: () => void; }[];
}

const FabMenu: React.FC<FabMenuProps> = ({ isOpen, onClose, actions }) => {
  const actionIcons: Record<string, React.ElementType> = {
    'Gasto': Wallet,
    'Renda': DollarSign,
    'Cartão': CreditCard,
    'Dívida': Landmark,
  };

  const menuVariants = {
    closed: { opacity: 0, transition: { when: "afterChildren" } },
    open: { opacity: 1, transition: { when: "beforeChildren", staggerChildren: 0.07, delayChildren: 0.1 } }
  };

  const itemVariants = {
    closed: { y: 30, opacity: 0, scale: 0.9 },
    open: { y: 0, opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 20 } }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 dark:bg-black/60 z-20 md:hidden"
          onClick={onClose}
        >
          <div className="absolute bottom-24 left-0 right-0 flex justify-center">
            <motion.div 
              className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg p-4 w-full max-w-xs space-y-2"
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              {actions.map((action) => {
                const Icon = actionIcons[action.label] || Wallet;
                return (
                  <motion.button 
                    key={action.label} 
                    variants={itemVariants} 
                    onClick={action.onClick}
                    className="w-full flex items-center space-x-4 p-3 rounded-lg text-left text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                  >
                    <div className="bg-primary/10 dark:bg-primary/20 p-2 rounded-md">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-semibold">{`Adicionar ${action.label}`}</span>
                  </motion.button>
                );
              })}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FabMenu;
