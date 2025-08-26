export interface Salary {
  id: string;
  amount: number;
  description: string;
  date: string;
}

export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: ExpenseCategory;
  date: string;
  paymentMethod: PaymentMethod;
  cardId?: string;
  installmentGroupId?: string;
  totalInstallmentAmount?: number;
}

export interface CreditCard {
  id:string;
  name: string;
  limit: number;
  currentAmount: number;
  color: string;
}

export interface Budget {
  id: string;
  category: ExpenseCategory;
  amount: number;
}

export interface Debt {
  id: string;
  name: string;
  totalAmount: number;
  remainingAmount: number;
  monthlyPayment: number;
  dueDate: number; // Day of the month
  paidInstallments: number;
  totalInstallments: number;
}

export type ExpenseCategory = 
  | 'alimentacao'
  | 'transporte'
  | 'moradia'
  | 'saude'
  | 'educacao'
  | 'lazer'
  | 'roupas'
  | 'tecnologia'
  | 'pagamento_divida'
  | 'outros';

export type PaymentMethod = 'dinheiro' | 'debito' | 'credito' | 'pix';

export interface FinancialSummary {
  totalSalary: number;
  totalExpenses: number;
  remainingBalance: number;
  expensePercentage: number;
  creditCardUsage: number;
  totalCreditLimit: number;
}
