import React, { useState } from 'react';
import { Landmark, Plus } from 'lucide-react';
import { Debt } from '../types';

interface DebtFormProps {
  onAddDebt: (debt: Omit<Debt, 'id'>) => void;
}

const DebtForm: React.FC<DebtFormProps> = ({ onAddDebt }) => {
  const [name, setName] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !totalAmount || !monthlyPayment || !dueDate) return;

    const total = parseFloat(totalAmount);
    const monthly = parseFloat(monthlyPayment);
    const totalInstallments = Math.ceil(total / monthly);

    onAddDebt({
      name,
      totalAmount: total,
      remainingAmount: total,
      monthlyPayment: monthly,
      dueDate: parseInt(dueDate),
      paidInstallments: 0,
      totalInstallments,
    });
    
    setName('');
    setTotalAmount('');
    setMonthlyPayment('');
    setDueDate('');
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-neutral-200">
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-yellow-500/10 rounded-lg">
          <Landmark className="w-5 h-5 text-yellow-600" />
        </div>
        <h2 className="text-lg font-bold text-neutral-800">Adicionar Dívida ou Empréstimo</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-600 mb-2">Nome da Dívida</label>
          <input
            type="text" value={name} onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 bg-neutral-100 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-neutral-800 placeholder-neutral-500"
            placeholder="Ex: Financiamento do carro" required
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-2">Valor Total</label>
            <input
              type="number" step="0.01" value={totalAmount} onChange={(e) => setTotalAmount(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-100 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-neutral-800 placeholder-neutral-500"
              placeholder="Ex: 30000.00" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-2">Parcela Mensal</label>
            <input
              type="number" step="0.01" value={monthlyPayment} onChange={(e) => setMonthlyPayment(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-100 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-neutral-800 placeholder-neutral-500"
              placeholder="Ex: 800.00" required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-600 mb-2">Dia do Vencimento</label>
          <input
            type="number" min="1" max="31" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-3 py-2 bg-neutral-100 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-neutral-800 placeholder-neutral-500"
            placeholder="Ex: 10" required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary-hover transition-colors flex items-center justify-center space-x-2 font-semibold"
        >
          <Plus className="w-5 h-5" />
          <span>Adicionar Dívida</span>
        </button>
      </form>
    </div>
  );
};

export default DebtForm;
