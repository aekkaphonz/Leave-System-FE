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
   GetUrl = 'http://localhost:8080/api/leave-requests';
  leaveRequests: any[] = [];

  ngOnInit(): void {
    this.fetchLeaveRequests();
  }

  async fetchLeaveRequests(): Promise<void> {
    try {
      const response = await axios.get(`${this.GetUrl}`);
      this.leaveRequests = response.data;
      console.log('API:', this.leaveRequests);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
    }
  }
}
