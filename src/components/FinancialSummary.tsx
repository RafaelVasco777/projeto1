import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, CreditCard, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FinancialSummary as FinancialSummaryType } from '../types';
import { formatCurrency } from '../utils/formatters';

interface FinancialSummaryProps {
  summary: FinancialSummaryType;
}

const FinancialSummary: React.FC<FinancialSummaryProps> = ({ summary }) => {
  const {
    totalSalary,
    totalExpenses,
    remainingBalance,
  } = summary;

  const isPositiveBalance = remainingBalance >= 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        variants={cardVariants}
        className={`relative overflow-hidden rounded-2xl p-6 border transition-all duration-300 shadow-lg ${
          isPositiveBalance 
            ? 'bg-success/5 border-success/20 dark:bg-success/10 dark:border-success/30' 
            : 'bg-danger/5 border-danger/20 dark:bg-danger/10 dark:border-danger/30'
        }`}
      >
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-14 h-14 rounded-xl border ${
              isPositiveBalance ? 'bg-success/10 border-success/20' : 'bg-danger/10 border-danger/20'
            }`}>
              {isPositiveBalance ? (
                <CheckCircle className="w-8 h-8 text-success" />
              ) : (
                <AlertTriangle className="w-8 h-8 text-danger" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-100 mb-1">
                {isPositiveBalance ? 'Situação Saudável' : 'Atenção Necessária'}
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {isPositiveBalance ? 'Suas finanças estão no verde!' : 'Você está gastando mais do que ganha.'}
              </p>
            </div>
          </div>
          <div className="text-left sm:text-right w-full sm:w-auto">
            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">Saldo Atual</p>
            <AnimatePresence mode="wait">
              <motion.p
                key={remainingBalance}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className={`text-4xl font-extrabold ${isPositiveBalance ? 'text-success-text dark:text-success' : 'text-danger-text dark:text-danger'}`}
              >
                {formatCurrency(remainingBalance)}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {[
          { title: 'Receita Total do Mês', value: formatCurrency(totalSalary), icon: TrendingUp, colorClass: 'text-success-text dark:text-success' },
          { title: 'Gastos Totais do Mês', value: formatCurrency(totalExpenses), icon: TrendingDown, colorClass: 'text-danger-text dark:text-danger' },
        ].map((card, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            className="bg-white dark:bg-neutral-800 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-700 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{card.title}</p>
                <p className={`text-2xl font-bold ${card.colorClass}`}>{card.value}</p>
              </div>
              <div className={`p-3 rounded-full bg-neutral-100 dark:bg-neutral-700 ${card.colorClass}`}>
                <card.icon className="w-6 h-6" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default FinancialSummary;
