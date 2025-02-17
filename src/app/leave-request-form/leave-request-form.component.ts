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
import { LeaveTypePipe } from '../pipes/leave-type.pipe';
import axios from 'axios';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-leave-request-form',
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
    LeaveTypePipe,
  ],
  templateUrl: './leave-request-form.component.html',
  styleUrl: './leave-request-form.component.css',
})
export class LeaveRequestFormComponent implements OnInit{
  
  leaveRequest = {
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: '',
  };

  leaveTypes: any[] = [];

  ngOnInit(): void {
    this.fetchLeaveTypes();
   
  }

  

  PostUrl = 'http://localhost:8080/api/leave-requests';
  GetLeaveTypes = 'http://localhost:8080/api/leave-type'


  async fetchLeaveTypes(): Promise<void> {
    try {
      const response = await axios.get(`${this.GetLeaveTypes}`);
      this.leaveTypes = response.data;
      console.log('leaveTypes:', this.leaveTypes);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
    }
  }

  async submitLeaveRequest() {
    const leaveRequest = {
      user: { id: 1 },
      leaveType: { id: this.leaveRequest.leaveType },
      startDate: this.formatDate(this.leaveRequest.startDate),
      endDate: this.formatDate(this.leaveRequest.endDate),
      reason: this.leaveRequest.reason,
    };

    console.log('Debug Request:', leaveRequest);

    try {
      const response = await axios.post(`${this.PostUrl}`, leaveRequest, {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log(' ส่งข้อมูลสำเร็จ:', response.data);
      Swal.fire({
        title: 'ส่งฟอร์มลาสำเร็จ!',
        text: 'คำขอลาของคุณถูกส่งแล้ว โปรดรอการอนุมัติ',
        icon: 'success',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#77bfa3',
      });
    } catch (error) {
      console.error(' เกิดข้อผิดพลาด:', error);
      Swal.fire({
        title: 'เกิดข้อผิดพลาด!',
        text: 'ไม่สามารถส่งคำขอลาได้ กรุณาลองใหม่',
        icon: 'error',
        confirmButtonText: 'ลองอีกครั้ง',
        confirmButtonColor: '#d33',
      });
    }
  }
  formatDate(date: any): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('sv-SE');
  }
}
