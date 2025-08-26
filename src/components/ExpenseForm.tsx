import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { ExpenseCategory, PaymentMethod, CreditCard } from '../types';
import { getCategoryLabel, getPaymentMethodLabel } from '../utils/formatters';

export interface NewExpenseData {
  amount: number;
  description: string;
  category: ExpenseCategory;
  paymentMethod: PaymentMethod;
  cardId?: string;
  isInstallment: boolean;
  installments: number;
}

interface ExpenseFormProps {
  onAddExpense: (data: NewExpenseData) => void;
  creditCards: CreditCard[];
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onAddExpense, creditCards }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('outros');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('dinheiro');
  const [cardId, setCardId] = useState('');
  const [isInstallment, setIsInstallment] = useState(false);
  const [installments, setInstallments] = useState('2');

  const categories: ExpenseCategory[] = [
    'alimentacao', 'transporte', 'moradia', 'saude', 'educacao', 
    'lazer', 'roupas', 'tecnologia', 'outros'
  ];

  const paymentMethods: PaymentMethod[] = ['dinheiro', 'debito', 'credito', 'pix'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;
    if (paymentMethod === 'credito' && !cardId) return;
    if (isInstallment && parseInt(installments) <= 1) return;

    onAddExpense({
      amount: parseFloat(amount),
      description,
      category,
      paymentMethod,
      cardId,
      isInstallment: paymentMethod === 'credito' && isInstallment,
      installments: parseInt(installments)
    });
    
    setAmount('');
    setDescription('');
    setCategory('outros');
    setPaymentMethod('dinheiro');
    setCardId('');
    setIsInstallment(false);
    setInstallments('2');
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg p-6 border border-neutral-200 dark:border-neutral-700">
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-danger/10 dark:bg-danger/20 rounded-lg">
          <Minus className="w-5 h-5 text-danger-text dark:text-danger" />
        </div>
        <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-100">Adicionar Gasto</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-300 mb-2">
              Valor {isInstallment && paymentMethod === 'credito' ? 'Total' : ''}
            </label>
            <input
              type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-100 dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-neutral-800 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400"
              placeholder="Ex: 150.00" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-300 mb-2">Categoria</label>
            <select
              value={category} onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
              className="w-full px-3 py-2 bg-neutral-100 dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-neutral-800 dark:text-neutral-100"
            >
              {categories.map(cat => <option key={cat} value={cat}>{getCategoryLabel(cat)}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-300 mb-2">Descrição</label>
          <input
            type="text" value={description} onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 bg-neutral-100 dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-neutral-800 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400"
            placeholder="Ex: Almoço, Gasolina, etc." required
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-300 mb-2">Forma de Pagamento</label>
            <select
              value={paymentMethod}
              onChange={(e) => {
                setPaymentMethod(e.target.value as PaymentMethod);
                if (e.target.value !== 'credito') setIsInstallment(false);
              }}
              className="w-full px-3 py-2 bg-neutral-100 dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-neutral-800 dark:text-neutral-100"
            >
              {paymentMethods.map(method => <option key={method} value={method}>{getPaymentMethodLabel(method)}</option>)}
            </select>
          </div>
          {paymentMethod === 'credito' && (
            <div>
              <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-300 mb-2">Cartão de Crédito</label>
              <select
                value={cardId} onChange={(e) => setCardId(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-100 dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-neutral-800 dark:text-neutral-100" required
              >
                <option value="">Selecione um cartão</option>
                {creditCards.map(card => <option key={card.id} value={card.id}>{card.name}</option>)}
              </select>
            </div>
          )}
        </div>
        {paymentMethod === 'credito' && (
          <div className="bg-neutral-100 dark:bg-neutral-700/50 p-3 rounded-lg border border-neutral-200 dark:border-neutral-600 space-y-3">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox" id="isInstallment" checked={isInstallment}
                onChange={(e) => setIsInstallment(e.target.checked)}
                className="h-4 w-4 rounded border-neutral-300 dark:border-neutral-500 text-primary focus:ring-primary bg-neutral-100 dark:bg-neutral-700"
              />
              <label htmlFor="isInstallment" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Compra Parcelada?</label>
            </div>
            {isInstallment && (
              <div>
                <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-300 mb-2">Número de Parcelas</label>
                <input
                  type="number" min="2" value={installments} onChange={(e) => setInstallments(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-neutral-600 border border-neutral-300 dark:border-neutral-500 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-neutral-800 dark:text-neutral-100" required
                />
              </div>
            )}
          </div>
        )}
        <button
          type="submit"
          className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary-hover transition-colors flex items-center justify-center space-x-2 font-semibold"
        >
          <Plus className="w-5 h-5" />
          <span>Adicionar Gasto</span>
        </button>
      </form>
    </div>
  );
};

export default ExpenseForm;
