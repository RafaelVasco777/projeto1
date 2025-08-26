import { Salary, Expense, CreditCard, FinancialSummary } from '../types';
import { isThisMonth, parseISO } from 'date-fns';

export const calculateFinancialSummary = (
  salaries: Salary[],
  expenses: Expense[],
  creditCards: CreditCard[]
): FinancialSummary => {
  const totalSalary = salaries.reduce((sum, salary) => sum + salary.amount, 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remainingBalance = totalSalary - totalExpenses;
  const expensePercentage = totalSalary > 0 ? (totalExpenses / totalSalary) * 100 : 0;
  const creditCardUsage = creditCards.reduce((sum, card) => sum + card.currentAmount, 0);
  const totalCreditLimit = creditCards.reduce((sum, card) => sum + card.limit, 0);

  return {
    totalSalary,
    totalExpenses,
    remainingBalance,
    expensePercentage,
    creditCardUsage,
    totalCreditLimit
  };
};

export const getExpensesByCategory = (expenses: Expense[]) => {
  const categoryTotals: Record<string, number> = {};
  
  expenses.forEach(expense => {
    if (categoryTotals[expense.category]) {
      categoryTotals[expense.category] += expense.amount;
    } else {
      categoryTotals[expense.category] = expense.amount;
    }
  });

  return Object.entries(categoryTotals).map(([category, amount]) => ({
    category,
    amount
  }));
};

export const getExpensesForCurrentMonth = (expenses: Expense[]): Expense[] => {
  return expenses.filter(expense => isThisMonth(parseISO(expense.date)));
};
