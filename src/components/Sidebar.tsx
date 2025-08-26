import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Wallet, BarChart, Settings, CreditCard, Landmark, DollarSign, LogOut } from 'lucide-react';
import ThemeSwitcher from './ThemeSwitcher';
import { Theme } from '../hooks/useTheme';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'income', label: 'Renda', icon: DollarSign },
  { id: 'expenses', label: 'Gastos', icon: Wallet },
  { id: 'cards', label: 'Cartões', icon: CreditCard },
  { id: 'budgets', label: 'Orçamentos', icon: BarChart },
  { id: 'debts', label: 'Dívidas', icon: Landmark },
  { id: 'backup', label: 'Exportar', icon: Settings },
];

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, theme, setTheme }) => {
  const { logout, user } = useAuth();

  return (
    <aside className="hidden md:flex flex-col w-64 fixed top-0 left-0 h-full bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700 p-4">
      <div className="flex items-center space-x-3 mb-8">
        <div className="bg-primary/10 dark:bg-primary/20 p-2 rounded-lg">
          <Wallet className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-xl font-bold text-neutral-800 dark:text-neutral-100">Meu Controle</h1>
      </div>
      <nav className="flex-1">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <li key={item.id}>
                <motion.button
                  onClick={() => setActiveTab(item.id)}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors duration-200 relative ${
                    isActive ? 'text-white' : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active-indicator"
                      className="absolute inset-0 bg-primary rounded-lg z-0"
                    />
                  )}
                  <item.icon className="w-5 h-5 relative z-10" />
                  <span className="font-semibold relative z-10">{item.label}</span>
                </motion.button>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="space-y-2">
        <div className="text-xs text-neutral-500 dark:text-neutral-400 px-3 truncate" title={user?.email}>
          Logado como: {user?.email}
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 p-3 rounded-lg text-left text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-semibold">Sair</span>
        </button>
        <ThemeSwitcher theme={theme} setTheme={setTheme} isSidebar={true} />
      </div>
    </aside>
  );
};

export default Sidebar;
