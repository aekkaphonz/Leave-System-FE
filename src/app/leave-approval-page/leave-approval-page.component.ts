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
    MatGridTile,
    StatusTranslatePipe,
    LeaveTypePipe,
  ],
  providers: [DatePipe],
  templateUrl: './leave-approval-page.component.html',
  styleUrl: './leave-approval-page.component.css',
})
export class LeaveApprovalPageComponent implements OnInit {
  leaveRequests: any[] = [];
  constructor() {}

  private UpdateUrl = 'http://localhost:8080/api/leave-requests';
  private GetUrl = 'http://localhost:8080/api/leave-requests';
  ngOnInit(): void {
    this.fetchLeaveRequests();
  }

  fetchLeaveRequests(): void {
    axios
      .get(`${this.GetUrl}`)
      .then((response) => {
        this.leaveRequests = response.data;
        console.log(' ข้อมูลจาก API:', this.leaveRequests);
      })
      .catch((error) => {
        console.error('Error fetching leave requests:', error);
      });
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


  calculateDaysBetween(startDate: string, endDate: string): number {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    return Math.max(timeDiff / (1000 * 60 * 60 * 24) + 1, 0);
  }
}
