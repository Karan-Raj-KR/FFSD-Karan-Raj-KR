export type Category = 'Food' | 'Transport' | 'Bills' | 'Entertainment' | 'Shopping' | 'Other';
export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: Category;
  date: string;
}
