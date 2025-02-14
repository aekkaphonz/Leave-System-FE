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
import Chart from 'chart.js/auto';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import axios from 'axios';
import { LeaveService } from '../services/leave.service';

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
  ],
  templateUrl: './leave-history.component.html',
  styleUrl: './leave-history.component.css',
})
export class LeaveHistoryComponent implements OnInit {
  constructor(public leaveService: LeaveService) {}
  leaveRequests: any[] = [];
  leaveSum = {
    sickLeave: 0,
    annualLeave: 0,
    personalLeave: 0,
  };
  selectedMonth: Date | null = null;
  selectedDepartment: string = '';
  private GetUrl = 'http://localhost:8080/api/leave-requests';

  ngOnInit(): void {
    this.fetchLeaveRequests();
  }
  async fetchLeaveRequests(): Promise<void> {
    try {
      const response = await axios.get(`${this.GetUrl}`);
      this.leaveRequests = this.sumLeaveRequests(response.data);
      console.log(this.leaveRequests);
      this.calculateLeaveSum();
  
      setTimeout(() => {
        this.createLeaveChart();
      }, 500);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
    }
  }
  
  calculateLeaveSum(): void {
    this.leaveSum = {
      sickLeave: this.leaveRequests.reduce(
        (sum, req) => sum + req.sickLeave,
        0
      ),
      annualLeave: this.leaveRequests.reduce(
        (sum, req) => sum + req.annualLeave,
        0
      ),
      personalLeave: this.leaveRequests.reduce(
        (sum, req) => sum + req.personalLeave,
        0
      ),
    };
  }

  sumLeaveRequests(leaveRequests: any[]): any[] {
    return Array.from(
      leaveRequests
        .reduce((map, req) => {
          const { username, department } = req.user || {};
          const leaveType = req.leaveType?.leaveTypeName;
          const days = this.leaveService.calculateDays(
            req.startDate,
            req.endDate
          );

          if (!username || !department || !leaveType) return map;

          const key = `${username}-${department}`;

          if (!map.has(key)) {
            map.set(key, {
              user: { username, department },
              sickLeave: 0,
              annualLeave: 0,
              personalLeave: 0,
              totalLeave: 0,
            });
          }

          const entry = map.get(key);
          entry[
            leaveType === 'SICK_LEAVE'
              ? 'sickLeave'
              : leaveType === 'ANNUAL_LEAVE'
              ? 'annualLeave'
              : 'personalLeave'
          ] += days;
          entry.totalLeave =
            entry.sickLeave + entry.annualLeave + entry.personalLeave;

          return map;
        }, new Map<string, any>())
        .values()
    );
  }

  getLeaveDays(leaveRequest: any, leaveType: string): number {
    if (leaveRequest.leaveType?.leaveTypeName !== leaveType) return 0;
    return this.leaveService.calculateDays(
      leaveRequest.startDate,
      leaveRequest.endDate
    );
  }

  getUserDepartments(): string[] {
    return Array.from(
      new Set(this.leaveRequests.map((l) => l.user?.department).filter(Boolean))
    );
  }

  createLeaveChart(): void {
    const ctx = document.getElementById('leaveChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['ลาป่วย', 'ลาพักร้อน', 'ลากิจ'],
        datasets: [
          {
            label: '',
            data: [
              this.leaveSum.sickLeave,
              this.leaveSum.annualLeave,
              this.leaveSum.personalLeave,
            ],
            backgroundColor: ['#ff6384', '#36a2eb', '#ffce56'],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  }

  exportToExcel(): void {
    if (!this.leaveRequests.length) {
      return;
    }
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
      this.leaveRequests.map((leave) => ({
        'ชื่อ-นามสกุล': leave.user.username,
        แผนก: leave.user.department,
        ลาป่วย: leave.sickLeave,
        ลาพักร้อน: leave.annualLeave,
        ลากิจ: leave.personalLeave,
        รวม: leave.totalLeave,
      }))
    );

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Leave Report');

    const excelBuffer: any = XLSX.write(wb, {
      bookType: 'xlsx',
      type: 'array',
    });
    const data: Blob = new Blob([excelBuffer], {
      type: 'application/octet-stream',
    });
    saveAs(data, 'leave_report.xlsx');
  }

  setMonth(event: Date) {
    this.selectedMonth = event;
    console.log(
      'เลือกเดือน:',
      event.toLocaleString('th-TH', { month: 'long', year: 'numeric' })
    );
  }

  getDepartment(): any[] {
    if (!this.selectedDepartment) {
      return this.leaveRequests;
    }
    return this.leaveRequests.filter(
      (req) => req.user?.department === this.selectedDepartment
    );
  }
}
