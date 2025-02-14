import { Component } from '@angular/core';
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
    
  ],
  templateUrl: './leave-request-form.component.html',
  styleUrl: './leave-request-form.component.css',
})
export class LeaveRequestFormComponent {
  leaveRequest = {
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: ''
  };

  PostUrl = 'http://localhost:8080/api/leave-requests';

  async submitLeaveRequest() {
    const mockUser = { 
      id: 1, 
      username: 'เอกพล แก้วก้อนน้อย', 
      email: 'testuser@example.com', 
      department: 'Intern' 
    };

    const mockLeaveType = { 
      id: 1, 
      leaveTypeName: 'ANNUAL_LEAVE', 
      description: 'ไปเที่ยว', 
      maxDays: 15 
    };

    const request = {
      user: mockUser,
      leaveType: mockLeaveType,
      startDate: this.leaveRequest.startDate,
      endDate: this.leaveRequest.endDate,
      reason: this.leaveRequest.reason
    };

    try {
      
      const response = await axios.post(`${this.PostUrl}`, request);
      console.log('ส่งข้อมูลได้:', response.data);
    } catch (error) {
      console.error('ส่งข้อมูลไม่ได้:', error);
    }
  }
  
}
