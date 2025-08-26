import React from 'react';
import { motion } from 'framer-motion';
import { Target } from 'lucide-react';
import { Budget, Expense } from '../types';
import { getExpensesForCurrentMonth } from '../utils/calculations';
import { getCategoryLabel, formatCurrency } from '../utils/formatters';

interface BudgetStatusProps {
  budgets: Budget[];
  expenses: Expense[];
}

const BudgetStatus: React.FC<BudgetStatusProps> = ({ budgets, expenses }) => {
  const currentMonthExpenses = getExpensesForCurrentMonth(expenses);
  
  const expensesByCategory = currentMonthExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  if (budgets.length === 0) {
    return (
      <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-700 text-center shadow-sm">
        <div className="flex items-center justify-center space-x-2 mb-3">
          <Target className="w-5 h-5 text-warning-text dark:text-warning" />
          <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-100">Status do Orçamento</h3>
        </div>
        <p className="text-neutral-500 dark:text-neutral-400 text-sm">Nenhum orçamento definido para este mês.</p>
        <p className="text-neutral-400 dark:text-neutral-500 text-xs mt-2">Vá para a aba 'Orçamentos' para criar um.</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white dark:bg-neutral-800 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-700 shadow-sm"
    >
      <div className="flex items-center space-x-2 mb-6">
        <Target className="w-5 h-5 text-warning-text dark:text-warning" />
        <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-100">Status do Orçamento Mensal</h3>
      </div>
      <div className="space-y-5">
        {budgets.map((budget, index) => {
          const spent = expensesByCategory[budget.category] || 0;
          const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
          const remaining = budget.amount - spent;

          let progressBarColor = 'bg-success';
          if (percentage > 90) progressBarColor = 'bg-danger';
          else if (percentage > 70) progressBarColor = 'bg-warning';

          return (
            <motion.div 
              key={budget.category}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">{getCategoryLabel(budget.category)}</span>
                <span className="text-sm font-bold text-neutral-800 dark:text-neutral-100">{formatCurrency(spent)} / {formatCurrency(budget.amount)}</span>
              </div>
              <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2.5 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${progressBarColor}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(percentage, 100)}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
              <p className={`text-right text-xs mt-1 ${remaining >= 0 ? 'text-neutral-500 dark:text-neutral-400' : 'text-danger-text dark:text-danger font-medium'}`}>
                {remaining >= 0 ? `${formatCurrency(remaining)} restantes` : `${formatCurrency(Math.abs(remaining))} acima`}
              </p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default BudgetStatus;
