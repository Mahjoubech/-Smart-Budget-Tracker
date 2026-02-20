import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../../core/services/transaction.service';
import { AuthService } from '../../core/services/auth.service';
import { Transaction } from '../../core/models/transaction.model';
import { TransactionFormComponent } from '../transactions/transaction-form/transaction-form.component';
import { TransactionListComponent } from '../transactions/transaction-list/transaction-list.component';
import { ExpenseChartComponent } from './expense-chart/expense-chart.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TransactionFormComponent, TransactionListComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  transactionService = inject(TransactionService);
  authService = inject(AuthService);
  
  // State using Signals
  transactions = signal<Transaction[]>([]);

  // Computed values
  totalIncome = computed(() => 
    this.transactions()
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0)
  );

  totalExpense = computed(() => 
    this.transactions()
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0)
  );

  balance = computed(() => this.totalIncome() - this.totalExpense());

  ngOnInit() {
    this.transactionService.getTransactions().subscribe(data => {
      this.transactions.set(data);
    });
  }

  logout() {
    this.authService.logout();
  }
}
