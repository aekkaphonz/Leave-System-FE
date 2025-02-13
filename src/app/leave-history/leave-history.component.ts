import { Component, OnInit } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';

import axios from 'axios';
import { LeaveTypePipe } from '../pipes/leave-type.pipe';

@Component({
  selector: 'app-leave-history',
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
        LeaveTypePipe
  ],
  templateUrl: './leave-history.component.html',
  styleUrl: './leave-history.component.css'
})
export class LeaveHistoryComponent implements OnInit{

  leaveRequests: any[] = [];

  constructor() {}

  ngOnInit(): void {
    this.fetchLeaveRequests();
  }

  fetchLeaveRequests(): void {
    axios
      .get('http://localhost:8080/api/leave-requests')
      .then((response) => {
        console.log("ข้อมูลจาก API ก่อน merge:", response.data);
        this.leaveRequests = this.mergeLeaveRequests(response.data);
        console.log("ข้อมูลหลังจาก merge:", this.leaveRequests);
      })
      .catch((error) => {
        console.error('Error fetching leave requests:', error);
      });
  }
  
  
  mergeLeaveRequests(leaveRequests: any[]): any[] {
    return Array.from(
      leaveRequests.reduce((map, req) => {
        const { username, department } = req.user || {};
        const leaveType = req.leaveType?.leaveTypeName;
        const days = this.calculateDaysBetween(req.startDate, req.endDate);
  
        if (!username || !department || !leaveType) return map;
  
        const key = `${username}-${department}`;
  
        if (!map.has(key)) {
          map.set(key, { user: { username, department }, sickLeave: 0, annualLeave: 0, personalLeave: 0, totalLeave: 0 });
        }
  
        const entry = map.get(key);
        entry[leaveType === 'SICK_LEAVE' ? 'sickLeave' : leaveType === 'ANNUAL_LEAVE' ? 'annualLeave' : 'personalLeave'] += days;
        entry.totalLeave = entry.sickLeave + entry.annualLeave + entry.personalLeave;
  
        return map;
      }, new Map<string, any>())
      .values()
    );
  }
  
  

  getLeaveDays(leaveRequest: any, leaveType: string): number {
    if (leaveRequest.leaveType?.leaveTypeName !== leaveType) return 0;
    return this.calculateDaysBetween(leaveRequest.startDate, leaveRequest.endDate);
  }
  
  calculateDaysBetween(startDate: string, endDate: string): number {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    return Math.max(timeDiff / (1000 * 60 * 60 * 24) + 1, 0); 
  }
  
  
  getUniqueDepartments(): string[] {
    return Array.from(new Set(this.leaveRequests.map(l => l.user?.department).filter(Boolean)));
  }

  
  
}
