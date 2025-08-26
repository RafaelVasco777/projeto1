import React, { useState } from 'react';
import { Plus, DollarSign } from 'lucide-react';
import { Salary } from '../types';

interface SalaryFormProps {
  onAddSalary: (salary: Omit<Salary, 'id'>) => void;
  currentSalary: Salary | null;
}

const SalaryForm: React.FC<SalaryFormProps> = ({ onAddSalary, currentSalary }) => {
  const [amount, setAmount] = useState(currentSalary?.amount.toString() || '');
  const [description, setDescription] = useState(currentSalary?.description || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;

    onAddSalary({
      amount: parseFloat(amount),
      description,
      date: new Date().toISOString()
    });

    if (!currentSalary) {
      setAmount('');
      setDescription('');
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm p-6 border border-neutral-200 dark:border-neutral-700">
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-success/10 dark:bg-success/20 rounded-lg">
          <DollarSign className="w-5 h-5 text-success-text dark:text-success" />
        </div>
        <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-100">
          {currentSalary ? 'Atualizar Renda' : 'Adicionar Renda'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-300 mb-2">
            Valor
          </label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 bg-neutral-100 dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-neutral-800 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400"
            placeholder="Ex: 5000.00"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-300 mb-2">
            Descrição
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 bg-neutral-100 dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-neutral-800 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400"
            placeholder="Ex: Salário mensal, Freelance, etc."
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary-hover transition-colors flex items-center justify-center space-x-2 font-semibold"
        >
          <Plus className="w-5 h-5" />
          <span>{currentSalary ? 'Atualizar Renda' : 'Adicionar Renda'}</span>
        </button>
      </form>
    </div>
  );
};

export default SalaryForm;
