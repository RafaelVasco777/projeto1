import React, { useState } from 'react';
import { Plus, CreditCard } from 'lucide-react';
import { CreditCard as CreditCardType } from '../types';

interface CreditCardFormProps {
  onAddCard: (card: Omit<CreditCardType, 'id'>) => void;
}

const CreditCardForm: React.FC<CreditCardFormProps> = ({ onAddCard }) => {
  const [name, setName] = useState('');
  const [limit, setLimit] = useState('');
  const [color, setColor] = useState('#059669');

  const predefinedColors = [
    '#059669', '#dc2626', '#16a34a', '#f59e0b', 
    '#8b5cf6', '#ec4899', '#6b7280', '#14b8a6'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !limit) return;

    onAddCard({
      name,
      limit: parseFloat(limit),
      currentAmount: 0,
      color
    });
    
    setName('');
    setLimit('');
    setColor('#059669');
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm p-6 border border-neutral-200 dark:border-neutral-700">
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-lg">
          <CreditCard className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-100">Adicionar Cartão de Crédito</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-300 mb-2">Nome do Cartão</label>
          <input
            type="text" value={name} onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 bg-neutral-100 dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-neutral-800 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400"
            placeholder="Ex: Nubank, Itaú, Santander" required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-300 mb-2">Limite</label>
          <input
            type="number" step="0.01" value={limit} onChange={(e) => setLimit(e.target.value)}
            className="w-full px-3 py-2 bg-neutral-100 dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-neutral-800 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400"
            placeholder="Ex: 2000.00" required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-300 mb-2">Cor do Cartão</label>
          <div className="flex flex-wrap gap-3">
            {predefinedColors.map(colorOption => (
              <button
                key={colorOption} type="button" onClick={() => setColor(colorOption)}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  color === colorOption ? 'border-primary scale-110' : 'border-transparent hover:border-neutral-300 dark:hover:border-neutral-500'
                }`}
                style={{ backgroundColor: colorOption }}
              />
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary-hover transition-colors flex items-center justify-center space-x-2 font-semibold"
        >
          <Plus className="w-5 h-5" />
          <span>Adicionar Cartão</span>
        </button>
      </form>
    </div>
  );
};

export default CreditCardForm;
