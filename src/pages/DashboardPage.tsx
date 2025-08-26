import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { addMonths } from 'date-fns';
import Header from '../components/Header';
import SalaryForm from '../components/SalaryForm';
import ExpenseForm, { NewExpenseData } from '../components/ExpenseForm';
import CreditCardForm from '../components/CreditCardForm';
import FinancialSummary from '../components/FinancialSummary';
import ExpenseList from '../components/ExpenseList';
import CreditCardList from '../components/CreditCardList';
import ExpenseChart from '../components/ExpenseChart';
import BudgetForm from '../components/BudgetForm';
import BudgetStatus from '../components/BudgetStatus';
import DebtForm from '../components/DebtForm';
import DebtList from '../components/DebtList';
import DataManagement from '../components/DataManagement';
import Toast from '../components/Toast';
import BottomNav from '../components/BottomNav';
import Sidebar from '../components/Sidebar';
import MainHeader from '../components/MainHeader';
import LoadingSpinner from '../components/LoadingSpinner';
import FabMenu from '../components/FabMenu';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Salary, Expense, CreditCard, Budget, Debt, ExpenseCategory } from '../types';
import { calculateFinancialSummary } from '../utils/calculations';

function DashboardPage() {
  const [salaries, setSalaries] = useState<Salary[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [creditCards, setCreditCards] = useState<CreditCard[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isExpenseModalOpen, setExpenseModalOpen] = useState(false);
  const [isSalaryModalOpen, setSalaryModalOpen] = useState(false);
  const [isCardModalOpen, setCardModalOpen] = useState(false);
  const [isDebtModalOpen, setDebtModalOpen] = useState(false);
  const [isFabMenuOpen, setFabMenuOpen] = useState(false);
  const [theme, setTheme] = useTheme();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  };

  const fetchData = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const [
        { data: salariesData, error: salariesError },
        { data: expensesData, error: expensesError },
        { data: creditCardsData, error: creditCardsError },
        { data: budgetsData, error: budgetsError },
        { data: debtsData, error: debtsError },
      ] = await Promise.all([
        supabase.from('salaries').select('*').order('date', { ascending: false }),
        supabase.from('expenses').select('*').order('date', { ascending: false }),
        supabase.from('credit_cards').select('*'),
        supabase.from('budgets').select('*'),
        supabase.from('debts').select('*'),
      ]);

      if (salariesError) throw salariesError;
      if (expensesError) throw expensesError;
      if (creditCardsError) throw creditCardsError;
      if (budgetsError) throw budgetsError;
      if (debtsError) throw debtsError;

      setSalaries(salariesData || []);
      setExpenses(expensesData || []);
      setCreditCards(creditCardsData || []);
      setBudgets(budgetsData || []);
      setDebts(debtsData || []);

    } catch (error: any) {
      showToast(`Erro ao carregar dados: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const currentSalary = salaries.length > 0 ? salaries[0] : null;

  const handleAddSalary = async (newSalary: Omit<Salary, 'id' | 'user_id'>) => {
    if (!user) return;
    const salaryToInsert = { ...newSalary, user_id: user.id };
    const { data, error } = await supabase.from('salaries').insert(salaryToInsert).select().single();
    if (error) return showToast(error.message, 'error');
    setSalaries(prev => [data, ...prev]);
    showToast('Renda adicionada com sucesso!');
    setSalaryModalOpen(false);
  };

  const handleAddExpense = async (data: NewExpenseData) => {
    if (!user) return;
    const { amount, description, category, paymentMethod, cardId, isInstallment, installments } = data;

    if (isInstallment && paymentMethod === 'credito' && cardId && installments > 1) {
      const totalAmount = amount;
      const installmentAmount = parseFloat((totalAmount / installments).toFixed(2));
      const groupId = Date.now().toString();
      const startDate = new Date();
      const newExpensesToInsert = [];

      for (let i = 0; i < installments; i++) {
        const expenseDate = addMonths(startDate, i);
        newExpensesToInsert.push({
          user_id: user.id,
          amount: installmentAmount,
          description: `${description} (${i + 1}/${installments})`,
          category,
          payment_method: paymentMethod,
          card_id: cardId,
          date: expenseDate.toISOString(),
          installment_group_id: groupId,
          total_installment_amount: totalAmount,
        });
      }
      
      const totalCalculated = installmentAmount * installments;
      if (totalCalculated !== totalAmount) {
        const difference = totalAmount - totalCalculated;
        newExpensesToInsert[installments - 1].amount += difference;
      }

      const { data: insertedExpenses, error } = await supabase.from('expenses').insert(newExpensesToInsert).select();
      if (error) return showToast(error.message, 'error');
      
      setExpenses(prev => [...insertedExpenses, ...prev]);

      const card = creditCards.find(c => c.id === cardId);
      if (card) {
        const newAmount = card.currentAmount + totalAmount;
        const { error: cardError } = await supabase.from('credit_cards').update({ current_amount: newAmount }).eq('id', cardId);
        if (cardError) return showToast(cardError.message, 'error');
        setCreditCards(cards => cards.map(c => c.id === cardId ? { ...c, currentAmount: newAmount } : c));
      }
    } else {
      const newExpense = {
        user_id: user.id,
        amount,
        description,
        category,
        payment_method: paymentMethod,
        card_id: paymentMethod === 'credito' ? cardId : undefined,
        date: new Date().toISOString(),
      };

      const { data: insertedExpense, error } = await supabase.from('expenses').insert(newExpense).select().single();
      if (error) return showToast(error.message, 'error');

      setExpenses(prev => [insertedExpense, ...prev]);

      if (insertedExpense.payment_method === 'credito' && insertedExpense.card_id) {
        const card = creditCards.find(c => c.id === insertedExpense.card_id);
        if (card) {
          const newAmount = card.currentAmount + insertedExpense.amount;
          const { error: cardError } = await supabase.from('credit_cards').update({ current_amount: newAmount }).eq('id', insertedExpense.card_id);
          if (cardError) return showToast(cardError.message, 'error');
          setCreditCards(cards => cards.map(c => c.id === insertedExpense.card_id ? { ...c, currentAmount: newAmount } : c));
        }
      }
    }
    
    showToast('Gasto adicionado com sucesso!');
    setExpenseModalOpen(false);
  };

  const handleDeleteExpense = async (expenseId: string) => {
    const expenseToDelete = expenses.find(e => e.id === expenseId);
    if (!expenseToDelete) return;

    if (expenseToDelete.installmentGroupId) {
        const groupId = expenseToDelete.installmentGroupId;
        const { error } = await supabase.from('expenses').delete().eq('installment_group_id', groupId);
        if (error) return showToast(error.message, 'error');

        setExpenses(prev => prev.filter(e => e.installmentGroupId !== groupId));

        if (expenseToDelete.cardId && expenseToDelete.totalInstallmentAmount) {
            const card = creditCards.find(c => c.id === expenseToDelete.cardId);
            if (card) {
                const newAmount = Math.max(0, card.currentAmount - expenseToDelete.totalInstallmentAmount);
                const { error: cardError } = await supabase.from('credit_cards').update({ current_amount: newAmount }).eq('id', expenseToDelete.cardId);
                if (cardError) return showToast(cardError.message, 'error');
                setCreditCards(cards => cards.map(c => c.id === expenseToDelete.cardId ? { ...c, currentAmount: newAmount } : c));
            }
        }
        showToast('Gasto parcelado excluído.');
    } else {
        const { error } = await supabase.from('expenses').delete().eq('id', expenseId);
        if (error) return showToast(error.message, 'error');

        setExpenses(prev => prev.filter(e => e.id !== expenseId));
        
        if (expenseToDelete.paymentMethod === 'credito' && expenseToDelete.cardId) {
            const card = creditCards.find(c => c.id === expenseToDelete.cardId);
            if(card) {
                const newAmount = Math.max(0, card.currentAmount - expenseToDelete.amount);
                const {error: cardError} = await supabase.from('credit_cards').update({ current_amount: newAmount }).eq('id', expenseToDelete.cardId);
                if(cardError) return showToast(cardError.message, 'error');
                setCreditCards(cards => cards.map(c => c.id === expenseToDelete.cardId ? { ...c, currentAmount: newAmount } : c));
            }
        }
        showToast('Gasto excluído.');
    }
  };

  const handleAddCreditCard = async (newCard: Omit<CreditCard, 'id' | 'user_id'>) => {
    if (!user) return;
    const cardToInsert = { ...newCard, user_id: user.id };
    const { data, error } = await supabase.from('credit_cards').insert(cardToInsert).select().single();
    if (error) return showToast(error.message, 'error');
    setCreditCards(prev => [...prev, data]);
    showToast('Cartão de crédito adicionado!');
    setCardModalOpen(false);
  };

  const handleDeleteCreditCard = async (cardId: string) => {
    const { error } = await supabase.from('credit_cards').delete().eq('id', cardId);
    if (error) return showToast(error.message, 'error');
    setCreditCards(prev => prev.filter(c => c.id !== cardId));
    showToast('Cartão de crédito excluído.');
  };

  const handleSetBudget = async (budget: Omit<Budget, 'id' | 'user_id'>) => {
    if(!user) return;
    const budgetToUpsert = { ...budget, user_id: user.id };
    const { data, error } = await supabase.from('budgets').upsert(budgetToUpsert, { onConflict: 'user_id,category' }).select().single();
    if(error) return showToast(error.message, 'error');
    setBudgets(prev => {
        const existing = prev.find(b => b.category === data.category);
        if(existing) return prev.map(b => b.category === data.category ? data : b);
        return [...prev, data];
    });
    showToast('Orçamento salvo!');
  };

  const handleDeleteBudget = async (category: ExpenseCategory) => {
    if(!user) return;
    const { error } = await supabase.from('budgets').delete().match({ user_id: user.id, category: category });
    if(error) return showToast(error.message, 'error');
    setBudgets(prev => prev.filter(b => b.category !== category));
    showToast('Orçamento excluído.');
  };

  const handleAddDebt = async (debt: Omit<Debt, 'id' | 'user_id'>) => {
    if(!user) return;
    const debtToInsert = { ...debt, user_id: user.id };
    const { data, error } = await supabase.from('debts').insert(debtToInsert).select().single();
    if(error) return showToast(error.message, 'error');
    setDebts(prev => [...prev, data]);
    showToast('Dívida adicionada.');
    setDebtModalOpen(false);
  };

  const handleDeleteDebt = async (debtId: string) => {
    const { error } = await supabase.from('debts').delete().eq('id', debtId);
    if(error) return showToast(error.message, 'error');
    setDebts(prev => prev.filter(d => d.id !== debtId));
    showToast('Dívida excluída.');
  };

  const handlePayDebt = async (debtToPay: Debt) => {
    if(!user) return;
    const paymentAmount = Math.min(debtToPay.monthlyPayment, debtToPay.remainingAmount);
    
    const newExpense = {
      user_id: user.id, amount: paymentAmount,
      description: `Pagamento: ${debtToPay.name}`, category: 'pagamento_divida' as ExpenseCategory,
      payment_method: 'debito' as const, date: new Date().toISOString(),
    };

    const { data: expenseData, error: expenseError } = await supabase.from('expenses').insert(newExpense).select().single();
    if(expenseError) return showToast(expenseError.message, 'error');
    setExpenses(prev => [expenseData, ...prev]);

    const updatedDebt = {
        remaining_amount: debtToPay.remainingAmount - paymentAmount,
        paid_installments: debtToPay.paidInstallments + 1
    };
    const { data: debtData, error: debtError } = await supabase.from('debts').update(updatedDebt).eq('id', debtToPay.id).select().single();
    if(debtError) return showToast(debtError.message, 'error');
    setDebts(prev => prev.map(d => d.id === debtToPay.id ? debtData : d));

    showToast('Parcela da dívida paga!');
  };

  const financialSummary = calculateFinancialSummary(salaries, expenses, creditCards);

  const renderContent = () => {
    if (isLoading) return <LoadingSpinner />;
    return (
      <motion.div
        key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
      >
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-3 space-y-6">
              <FinancialSummary summary={financialSummary} />
            </div>
            <div className="lg:col-span-2">
              <ExpenseChart expenses={expenses} />
            </div>
            <div className="space-y-6">
              <BudgetStatus budgets={budgets} expenses={expenses} />
              <ExpenseList expenses={expenses.slice(0, 5)} creditCards={creditCards} onDeleteExpense={handleDeleteExpense} isCompact={true} />
            </div>
          </div>
        )}
        {activeTab === 'income' && <div className="max-w-2xl mx-auto"><SalaryForm onAddSalary={handleAddSalary} currentSalary={currentSalary} /></div>}
        {activeTab === 'expenses' && <ExpenseList expenses={expenses} creditCards={creditCards} onDeleteExpense={handleDeleteExpense} />}
        {activeTab === 'cards' && (
          <div className="space-y-6">
            <div className="max-w-2xl mx-auto"><CreditCardForm onAddCard={handleAddCreditCard} /></div>
            <CreditCardList creditCards={creditCards} onDeleteCard={handleDeleteCreditCard} />
          </div>
        )}
        {activeTab === 'budgets' && (
          <div className="space-y-6">
            <div className="max-w-2xl mx-auto"><BudgetForm budgets={budgets} onSetBudget={handleSetBudget} onDeleteBudget={handleDeleteBudget} /></div>
            <BudgetStatus budgets={budgets} expenses={expenses} />
          </div>
        )}
        {activeTab === 'debts' && (
          <div className="space-y-6">
            <div className="max-w-2xl mx-auto"><DebtForm onAddDebt={handleAddDebt} /></div>
            <DebtList debts={debts} onDeleteDebt={handleDeleteDebt} onPayDebt={handlePayDebt} />
          </div>
        )}
        {activeTab === 'backup' && (
          <div className="max-w-2xl mx-auto">
            <DataManagement allData={{ salaries, expenses, creditCards, budgets, debts }} />
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100 font-sans text-neutral-800 dark:bg-neutral-900 dark:text-neutral-200">
      <Header theme={theme} setTheme={setTheme} />
      
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>

      <div className="flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} theme={theme} setTheme={setTheme} />

        <main className="flex-1 p-4 md:p-6 lg:p-8 md:ml-64 mb-20 md:mb-0">
          <MainHeader activeTab={activeTab} onAddExpenseClick={() => setExpenseModalOpen(true)} />
          {renderContent()}
        </main>
      </div>

      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isFabMenuOpen={isFabMenuOpen}
        onFabClick={() => setFabMenuOpen(!isFabMenuOpen)}
      />

      <FabMenu
        isOpen={isFabMenuOpen}
        onClose={() => setFabMenuOpen(false)}
        actions={[
          { label: 'Gasto', onClick: () => { setFabMenuOpen(false); setExpenseModalOpen(true); } },
          { label: 'Renda', onClick: () => { setFabMenuOpen(false); setSalaryModalOpen(true); } },
          { label: 'Cartão', onClick: () => { setFabMenuOpen(false); setCardModalOpen(true); } },
          { label: 'Dívida', onClick: () => { setFabMenuOpen(false); setDebtModalOpen(true); } },
        ]}
      />

      <AnimatePresence>
        {isExpenseModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 dark:bg-black/70 z-40 flex items-center justify-center p-4"
            onClick={() => setExpenseModalOpen(false)}
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <ExpenseForm onAddExpense={handleAddExpense} creditCards={creditCards} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSalaryModalOpen && (
          <motion.div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-40 flex items-center justify-center p-4" onClick={() => setSalaryModalOpen(false)}>
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
              <SalaryForm onAddSalary={handleAddSalary} currentSalary={currentSalary} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCardModalOpen && (
          <motion.div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-40 flex items-center justify-center p-4" onClick={() => setCardModalOpen(false)}>
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
              <CreditCardForm onAddCard={handleAddCreditCard} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDebtModalOpen && (
          <motion.div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-40 flex items-center justify-center p-4" onClick={() => setDebtModalOpen(false)}>
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
              <DebtForm onAddDebt={handleAddDebt} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default DashboardPage;
