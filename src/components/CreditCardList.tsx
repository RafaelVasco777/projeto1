import React from 'react';
import { CreditCard, Trash2 } from 'lucide-react';
import { CreditCard as CreditCardType } from '../types';
import { formatCurrency, formatPercentage } from '../utils/formatters';

interface CreditCardListProps {
  creditCards: CreditCardType[];
  onDeleteCard: (id: string) => void;
}

const CreditCardList: React.FC<CreditCardListProps> = ({ creditCards, onDeleteCard }) => {
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm p-4 sm:p-6 border border-neutral-200 dark:border-neutral-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-100">Cartões de Crédito</h2>
        <div className="text-sm text-neutral-500 dark:text-neutral-400">{creditCards.length} cartão(ões)</div>
      </div>

      <div className="space-y-4">
        {creditCards.length === 0 ? (
          <div className="text-center py-10 text-neutral-500 dark:text-neutral-400">
            <p className="font-semibold mb-1">Nenhum cartão de crédito cadastrado</p>
            <p className="text-sm">Adicione um cartão para começar a registrar gastos.</p>
          </div>
        ) : (
          creditCards.map(card => {
            const usagePercentage = (card.currentAmount / card.limit) * 100;
            
            return (
              <div key={card.id} className="border border-neutral-200 dark:border-neutral-700 rounded-xl p-4 hover:bg-neutral-100/50 dark:hover:bg-neutral-700/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div 
                      className="flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0"
                      style={{ backgroundColor: `${card.color}1A` }}
                    >
                      <CreditCard className="w-5 h-5" style={{ color: card.color }} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-neutral-800 dark:text-neutral-100 truncate">{card.name}</h3>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">Limite: {formatCurrency(card.limit)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 flex-shrink-0">
                    <div className="text-right">
                      <p className="font-bold text-neutral-800 dark:text-neutral-100">{formatCurrency(card.currentAmount)}</p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">{formatPercentage(usagePercentage)} usado</p>
                    </div>
                    <button
                      onClick={() => onDeleteCard(card.id)}
                      className="p-2 text-danger-text dark:text-danger hover:bg-danger/10 dark:hover:bg-danger/20 rounded-full transition-colors"
                      title="Excluir cartão"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1 text-sm">
                    <span className="text-neutral-500 dark:text-neutral-400">Limite usado</span>
                    <span className="font-medium text-neutral-600 dark:text-neutral-300">{formatCurrency(card.limit - card.currentAmount)} disponível</span>
                  </div>
                  <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2.5">
                    <div 
                      className="h-2.5 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min(usagePercentage, 100)}%`,
                        backgroundColor: card.color
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CreditCardList;
