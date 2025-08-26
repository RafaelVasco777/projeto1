import React, { useState } from 'react';
import { Search, Trash2, Filter, UtensilsCrossed, Car, Home, HeartPulse, GraduationCap, PartyPopper, Shirt, Laptop, Landmark, MoreHorizontal } from 'lucide-react';
import { Expense, CreditCard, ExpenseCategory } from '../types';
import { formatCurrency, formatDate, getCategoryLabel, getPaymentMethodLabel } from '../utils/formatters';

const CategoryIcon: React.FC<{ category: ExpenseCategory, className?: string }> = ({ category, className = "w-5 h-5" }) => {
  const icons: Record<ExpenseCategory, React.ElementType> = {
    alimentacao: UtensilsCrossed,
    transporte: Car,
    moradia: Home,
    saude: HeartPulse,
    educacao: GraduationCap,
    lazer: PartyPopper,
    roupas: Shirt,
    tecnologia: Laptop,
    pagamento_divida: Landmark,
    outros: MoreHorizontal
  };
  const Icon = icons[category] || MoreHorizontal;
  return <Icon className={className} />;
};

interface ExpenseListProps {
  expenses: Expense[];
  creditCards: CreditCard[];
  onDeleteExpense: (id: string) => void;
  isCompact?: boolean;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ 
  expenses, 
  creditCards, 
  onDeleteExpense,
  isCompact = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');

  const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredExpenses = sortedExpenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || expense.category === categoryFilter;
    const matchesPayment = !paymentFilter || expense.paymentMethod === paymentFilter;
    return matchesSearch && matchesCategory && matchesPayment;
  });

  const getCreditCardName = (cardId: string) => {
    const card = creditCards.find(c => c.id === cardId);
    return card ? card.name : 'N/A';
  };

  const allCategories = [...new Set(expenses.map(e => e.category))];
  const allPaymentMethods = [...new Set(expenses.map(e => e.paymentMethod))];

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm p-4 sm:p-6 border border-neutral-200 dark:border-neutral-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-100">{isCompact ? 'Últimos Gastos' : 'Histórico de Gastos'}</h2>
        {!isCompact && <div className="text-sm text-neutral-500 dark:text-neutral-400">{filteredExpenses.length} de {expenses.length} gastos</div>}
      </div>

      {!isCompact && (
        <div className="space-y-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400 dark:text-neutral-500" />
            <input
              type="text" placeholder="Buscar por descrição..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-neutral-100 dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-neutral-800 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center space-x-2 flex-1">
              <Filter className="w-5 h-5 text-neutral-400 dark:text-neutral-500 flex-shrink-0" />
              <select
                value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-100 dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-neutral-800 dark:text-neutral-100"
              >
                <option value="">Todas as categorias</option>
                {allCategories.map(c => <option key={c} value={c}>{getCategoryLabel(c)}</option>)}
              </select>
            </div>
            <select
              value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 bg-neutral-100 dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-neutral-800 dark:text-neutral-100"
            >
              <option value="">Todas as formas</option>
              {allPaymentMethods.map(m => <option key={m} value={m}>{getPaymentMethodLabel(m)}</option>)}
            </select>
          </div>
        </div>
      )}

      <div className={`space-y-3 ${!isCompact && "max-h-96 overflow-y-auto pr-2"}`}>
        {filteredExpenses.length === 0 ? (
          <div className="text-center py-10 text-neutral-500 dark:text-neutral-400">
            <p className="font-semibold mb-1">{expenses.length === 0 ? 'Nenhum gasto cadastrado' : 'Nenhum gasto encontrado'}</p>
            <p className="text-sm">{expenses.length === 0 ? 'Adicione seu primeiro gasto para começar.' : 'Tente ajustar seus filtros.'}</p>
          </div>
        ) : (
          filteredExpenses.map(expense => (
            <div key={expense.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700/50 transition-colors">
              <div className="flex items-center space-x-4 flex-1 min-w-0">
                <div className="flex-shrink-0 bg-neutral-200 dark:bg-neutral-700 p-2 rounded-full">
                  <CategoryIcon category={expense.category} className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-neutral-800 dark:text-neutral-100 truncate">{expense.description}</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">{formatDate(expense.date)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="font-bold text-danger-text dark:text-danger">-{formatCurrency(expense.amount)}</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">{getPaymentMethodLabel(expense.paymentMethod)}</p>
                </div>
                <button
                  onClick={() => onDeleteExpense(expense.id)}
                  className="p-2 text-danger-text dark:text-danger hover:bg-danger/10 dark:hover:bg-danger/20 rounded-full transition-colors"
                  title="Excluir gasto"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExpenseList;
