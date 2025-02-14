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
import { MatGridListModule, MatGridTile } from '@angular/material/grid-list';
import { StatusTranslatePipe } from '../pipes/status-translate.pipe';
import { LeaveTypePipe } from '../pipes/leave-type.pipe';
import { LeaveService } from '../services/leave.service';
@Component({
  selector: 'app-leave-approval-page',
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
    MatGridListModule,
    StatusTranslatePipe,
    LeaveTypePipe,
  ],
  providers: [DatePipe],
  templateUrl: './leave-approval-page.component.html',
  styleUrl: './leave-approval-page.component.css',
})
export class LeaveApprovalPageComponent implements OnInit {
  constructor(public leaveService: LeaveService) {}
 
  leaveRequests: any[] = [];
   UpdateUrl = 'http://localhost:8080/api/leave-requests';
   GetUrl = 'http://localhost:8080/api/leave-requests';
  
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

  async updateStatus(requestId: number, newStatus: string) {
    try {
      const response = await axios.put(`${this.UpdateUrl}/${requestId}`, {
        status: newStatus,
      });
      console.log('Status updated:', response.data);
    } catch (error) {
      console.error('Error updating status:', error);
    }
    this.fetchLeaveRequests();
  }


  
}
