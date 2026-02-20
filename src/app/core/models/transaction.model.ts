import { Timestamp } from '@angular/fire/firestore';

export interface Transaction {
  id?: string;
  userId: string;
  amount: number;
  type: 'income' | 'expense'; // 'income' or 'expense'
  category: string;
  date: Timestamp; // Firestore timestamp
  description: string;
}
