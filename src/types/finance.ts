export interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: Date;
  description: string;
}

export interface Asset {
  id: string;
  name: string;
  value: number;
  type: 'cash' | 'investment' | 'property' | 'other';
  lastUpdated: Date;
}

export interface Debt {
  id: string;
  name: string;
  amount: number;
  interestRate: number;
  minimumPayment: number;
  type: 'student' | 'credit' | 'mortgage' | 'other';
  lastUpdated: Date;
}

export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: Date;
  type: 'savings' | 'debt';
}

export interface FinancialState {
  assets: Asset[];
  debts: Debt[];
  transactions: Transaction[];
  goals: FinancialGoal[];
}