import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { Transaction } from '../../../core/models/transaction.model';

@Component({
  selector: 'app-expense-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './expense-chart.component.html',
})
export class ExpenseChartComponent implements OnChanges {
  @Input() transactions: Transaction[] = [];
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public chartData: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [{
      data: []
    }]
  };

  public chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    }
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['transactions']) {
      this.updateChart();
    }
  }

  updateChart() {
    const expenses = this.transactions.filter(t => t.type === 'expense');
    const categoryTotals: { [key: string]: number } = {};

    expenses.forEach(t => {
      const category = t.category || 'Uncategorized';
      categoryTotals[category] = (categoryTotals[category] || 0) + t.amount;
    });

    this.chartData = {
      labels: Object.keys(categoryTotals),
      datasets: [{
        data: Object.values(categoryTotals),
        backgroundColor: [
          '#6366f1', // Indigo
          '#ec4899', // Pink
          '#f59e0b', // Amber
          '#10b981', // Emerald
          '#3b82f6', // Blue
          '#ef4444', // Red
          '#8b5cf6', // Violet
        ]
      }]
    };
    
    this.chart?.update();
  }
}
