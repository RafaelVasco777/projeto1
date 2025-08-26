import React from 'react';
import { Landmark, Trash2, HandCoins, AlertTriangle } from 'lucide-react';
import { Debt } from '../types';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import { isAfter, subDays, getDate } from 'date-fns';

interface DebtListProps {
  debts: Debt[];
  onDeleteDebt: (id: string) => void;
  onPayDebt: (debt: Debt) => void;
}

const DebtList: React.FC<DebtListProps> = ({ debts, onDeleteDebt, onPayDebt }) => {
  const today = new Date();

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm p-4 sm:p-6 border border-neutral-200 dark:border-neutral-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-100">Dívidas e Empréstimos</h2>
        <div className="text-sm text-neutral-500 dark:text-neutral-400">{debts.length} dívida(s)</div>
      </div>

      <div className="space-y-4">
        {debts.length === 0 ? (
          <div className="text-center py-10 text-neutral-500 dark:text-neutral-400">
            <p className="font-semibold mb-1">Nenhuma dívida cadastrada</p>
            <p className="text-sm">Adicione suas dívidas para começar a gerenciá-las.</p>
          </div>
        ) : (
          debts.map(debt => {
            const progressPercentage = (1 - debt.remainingAmount / debt.totalAmount) * 100;
            const isDueSoon = isAfter(today, subDays(new Date(today.getFullYear(), today.getMonth(), debt.dueDate), 5)) && getDate(today) <= debt.dueDate;

            return (
              <div key={debt.id} className="border border-neutral-200 dark:border-neutral-700 rounded-xl p-4 hover:bg-neutral-100/50 dark:hover:bg-neutral-700/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="flex items-center justify-center w-10 h-10 bg-yellow-500/10 rounded-lg flex-shrink-0">
                      <Landmark className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-neutral-800 dark:text-neutral-100 truncate">{debt.name}</h3>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">Total: {formatCurrency(debt.totalAmount)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 flex-shrink-0">
                    <div className="text-right">
                      <p className="font-bold text-neutral-800 dark:text-neutral-100">{formatCurrency(debt.remainingAmount)}</p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">restante</p>
                    </div>
                    <button
                      onClick={() => onDeleteDebt(debt.id)}
                      className="p-2 text-danger-text dark:text-danger hover:bg-danger/10 dark:hover:bg-danger/20 rounded-full transition-colors"
                      title="Excluir dívida"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1 text-sm">
                    <span className="text-neutral-500 dark:text-neutral-400">Progresso</span>
                    <span className="font-medium text-neutral-600 dark:text-neutral-300">{formatPercentage(progressPercentage)}</span>
                  </div>
                  <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2.5">
                    <div 
                      className="h-2.5 rounded-full transition-all duration-300 bg-yellow-500"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                    <span>Parcela: {debt.paidInstallments}/{debt.totalInstallments}</span>
                    <div className="flex items-center space-x-1">
                      {isDueSoon && <AlertTriangle className="w-4 h-4 text-danger" />}
                      <span>Vencimento: dia {debt.dueDate}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => onPayDebt(debt)}
                    disabled={debt.remainingAmount <= 0}
                    className="w-full bg-success text-white py-2.5 px-4 rounded-lg hover:bg-success-hover transition-colors flex items-center justify-center space-x-2 font-semibold text-sm disabled:bg-neutral-400 dark:disabled:bg-neutral-600 disabled:cursor-not-allowed"
                  >
                    <HandCoins className="w-5 h-5" />
                    <span>Pagar Parcela ({formatCurrency(debt.monthlyPayment)})</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default DebtList;
