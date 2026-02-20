import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, deleteDoc, updateDoc, query, where, orderBy, Timestamp } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Observable, switchMap, of } from 'rxjs';
import { Transaction } from '../models/transaction.model';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  firestore = inject(Firestore);
  authService = inject(AuthService);

  getTransactions(): Observable<Transaction[]> {
    return this.authService.user$.pipe(
      switchMap(user => {
        if (!user) return of([]);
        const colRef = collection(this.firestore, `users/${user.uid}/transactions`);
        const q = query(colRef, orderBy('date', 'desc'));
        return collectionData(q, { idField: 'id' }) as Observable<Transaction[]>;
      })
    );
  }

  addTransaction(transaction: Partial<Transaction>): Promise<any> {
    const user = this.authService.currentUserSig();
    if (!user) throw new Error('User not logged in');
    const colRef = collection(this.firestore, `users/${user.uid}/transactions`);
    return addDoc(colRef, { ...transaction, userId: user.uid, date: Timestamp.now() });
  }

  deleteTransaction(id: string): Promise<void> {
    const user = this.authService.currentUserSig();
    if (!user) throw new Error('User not logged in');
    const docRef = doc(this.firestore, `users/${user.uid}/transactions/${id}`);
    return deleteDoc(docRef);
  }
}
