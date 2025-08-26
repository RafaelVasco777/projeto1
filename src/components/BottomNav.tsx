import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Wallet, BarChart, Settings, Plus } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isFabMenuOpen: boolean;
  onFabClick: () => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'expenses', label: 'Gastos', icon: Wallet },
  { id: 'add', label: 'Adicionar', icon: Plus, isCentral: true },
  { id: 'budgets', label: 'Orçamentos', icon: BarChart },
  { id: 'backup', label: 'Exportar', icon: Settings },
];

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, isFabMenuOpen, onFabClick }) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700 shadow-top z-30">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          if (item.isCentral) {
            return (
              <motion.button
                key={item.id}
                onClick={onFabClick}
                whileTap={{ scale: 0.9 }}
                className="bg-primary text-white rounded-full w-14 h-14 flex items-center justify-center -mt-6 shadow-lg"
              >
                <motion.div
                  animate={{ rotate: isFabMenuOpen ? 135 : 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <Plus className="w-6 h-6" />
                </motion.div>
              </motion.button>
            );
          }
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center space-y-1 w-full transition-colors duration-200 ${
                isActive ? 'text-primary' : 'text-neutral-500 dark:text-neutral-400 hover:text-primary'
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
