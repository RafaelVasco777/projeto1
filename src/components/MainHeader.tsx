import React from 'react';
import { Plus } from 'lucide-react';

interface MainHeaderProps {
  activeTab: string;
  onAddExpenseClick: () => void;
}

const getTabTitle = (tabId: string): string => {
  const titles: Record<string, string> = {
    dashboard: 'Dashboard',
    income: 'Gestão de Renda',
    expenses: 'Histórico de Gastos',
    cards: 'Meus Cartões de Crédito',
    budgets: 'Orçamentos Mensais',
    debts: 'Gestão de Dívidas',
    backup: 'Backup e Exportação',
  };
  return titles[tabId] || 'Dashboard';
};

const MainHeader: React.FC<MainHeaderProps> = ({ activeTab, onAddExpenseClick }) => {
  const title = getTabTitle(activeTab);

  return (
    <div className="hidden md:flex items-center justify-between mb-6">
      <h1 className="text-2xl lg:text-3xl font-bold text-neutral-800 dark:text-neutral-100">
        {title}
      </h1>
      <button
        onClick={onAddExpenseClick}
        className="bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-hover transition-colors flex items-center justify-center space-x-2 font-semibold"
      >
        <Plus className="w-5 h-5" />
        <span>Adicionar Gasto</span>
      </button>
    </div>
  );
};

export default MainHeader;
