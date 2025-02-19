import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import axios from 'axios';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { StatusTranslatePipe } from '../pipes/status-translate.pipe';
import { ThaiMonthPipe } from '../pipes/ThaiMonthPipe';
import { LeaveTypePipe } from '../pipes/leave-type.pipe';
import { LeaveService } from '../services/leave.service';

interface User {
  id: number;
  username: string;
  email: string;
  department: string;
}

interface LeaveType {
  id: number;
  leaveTypeName: string;
  description: string;
  maxDays: number;
}

interface LeaveBalance {
  id: number;
  user: User;
  leaveType: LeaveType;
  leaveYear: number;
  remainingDays: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule,
    MatCardModule,
    MatNativeDateModule,
    FormsModule,
    CommonModule,
    MatIconModule,
    MatTabsModule,
    StatusTranslatePipe,
    ThaiMonthPipe,
    LeaveTypePipe,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  constructor(public leaveService: LeaveService) {}
  GetRequestUrl = 'http://localhost:8080/api/leave-requests';
  GetBalanceUrl = 'http://localhost:8080/api/leave-balance';
  leaveRequests: any[] = [];
  leaveBalances: LeaveBalance[] = [];
  totalLeaveTaken: number = 0;

  ngOnInit(): void {
    this.fetchLeaveRequests();
    this.fetchLeaveBalances();
  }

  async fetchLeaveRequests(): Promise<void> {
    try {
      const response = await axios.get(`${this.GetRequestUrl}`);
      this.leaveRequests = response.data;
      console.log('Requests API:', this.leaveRequests);
      this.calculateTotalLeaveTaken();
    } catch (error) {
      console.error('Error fetching leave requests:', error);
    }
  }

  async fetchLeaveBalances(): Promise<void> {
    try {
      const response = await axios.get(`${this.GetBalanceUrl}`);
      this.leaveBalances = response.data || []; 
      console.log('Balance API:', this.leaveBalances);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
    }
  }

  calculateTotalLeaveTaken(): void {
    this.totalLeaveTaken = 0;
  
    for (let i = 0; i < this.leaveRequests.length; i++) {
      const leaveRequest = this.leaveRequests[i];
  
      if (leaveRequest.status === 'APPROVED') {
        const days = this.leaveService.calculateDays(leaveRequest.startDate, leaveRequest.endDate);
        this.totalLeaveTaken += days;
      }
    }
  }
  
  getRemainingLeaveDays(): number {
    if (!this.leaveBalances || this.leaveBalances.length === 0) {
      return 0;
    }
    
    let totalRemainingDays = 0;
    if (this.leaveBalances) {
      for (const balance of this.leaveBalances) {
        totalRemainingDays += balance.remainingDays;
      }
    }
  
    return totalRemainingDays - this.totalLeaveTaken; 
  }


  getPendingLeaveCount(): number {
    return this.leaveRequests.filter(request => request.status === 'PENDING').length;
  }
  
}
