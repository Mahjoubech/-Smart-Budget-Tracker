import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TransactionService } from '../../../core/services/transaction.service';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './transaction-form.component.html',
})
export class TransactionFormComponent {
  fb = inject(FormBuilder);
  transactionService = inject(TransactionService);

  transactionForm = this.fb.group({
    description: ['', Validators.required],
    amount: [0, [Validators.required, Validators.min(0.01)]],
    date: [new Date().toISOString().split('T')[0], Validators.required],
    type: ['expense', Validators.required],
    category: ['', Validators.required]
  });

  async onSubmit() {
    if (this.transactionForm.valid) {
      try {
        const formValue = this.transactionForm.value;
        await this.transactionService.addTransaction({
          description: formValue.description!,
          amount: Number(formValue.amount),
          type: formValue.type as 'income' | 'expense',
          category: formValue.category!,
          date: Timestamp.fromDate(new Date(formValue.date!))
        });
        this.transactionForm.reset({
          date: new Date().toISOString().split('T')[0],
          type: 'expense'
        });
      } catch (error) {
        console.error('Error adding transaction:', error);
      }
    }
  }
}
