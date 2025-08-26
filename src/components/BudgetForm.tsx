import React, { useState } from 'react';
import { Target, Plus, Trash2 } from 'lucide-react';
import { Budget, ExpenseCategory } from '../types';
import { getCategoryLabel } from '../utils/formatters';

interface BudgetFormProps {
  budgets: Budget[];
  onSetBudget: (budget: Budget) => void;
  onDeleteBudget: (category: ExpenseCategory) => void;
}

const BudgetForm: React.FC<BudgetFormProps> = ({ budgets, onSetBudget, onDeleteBudget }) => {
  const [category, setCategory] = useState<ExpenseCategory>('alimentacao');
  const [amount, setAmount] = useState('');

  const categories: ExpenseCategory[] = [
    'alimentacao', 'transporte', 'moradia', 'saude', 'educacao', 
    'lazer', 'roupas', 'tecnologia', 'outros'
  ];

  const existingBudget = budgets.find(b => b.category === category);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !amount) return;

    onSetBudget({
      category,
      amount: parseFloat(amount)
    });

    setAmount('');
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-neutral-200">
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-warning/10 rounded-lg">
          <Target className="w-5 h-5 text-warning-text" />
        </div>
        <h2 className="text-lg font-bold text-neutral-800">Definir Orçamento Mensal</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-2">Categoria</label>
            <select
              value={category}
              onChange={(e) => {
                const newCategory = e.target.value as ExpenseCategory;
                setCategory(newCategory);
                const budget = budgets.find(b => b.category === newCategory);
                setAmount(budget ? budget.amount.toString() : '');
              }}
              className="w-full px-3 py-2 bg-neutral-100 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-neutral-800"
            >
              {categories.map(cat => <option key={cat} value={cat}>{getCategoryLabel(cat)}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-2">Valor do Orçamento</label>
            <input
              type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-100 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-neutral-800 placeholder-neutral-500"
              placeholder="Ex: 500.00" required
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary-hover transition-colors flex items-center justify-center space-x-2 font-semibold"
          >
            <Plus className="w-5 h-5" />
            <span>{existingBudget ? 'Atualizar Orçamento' : 'Definir Orçamento'}</span>
          </button>
          {existingBudget && (
            <button
              type="button" onClick={() => onDeleteBudget(category)}
              className="w-full sm:w-auto bg-danger text-white py-3 px-4 rounded-lg hover:bg-danger-hover transition-colors flex items-center justify-center space-x-2 font-semibold"
            >
              <Trash2 className="w-5 h-5" />
              <span className="hidden sm:inline">Excluir</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default BudgetForm;
