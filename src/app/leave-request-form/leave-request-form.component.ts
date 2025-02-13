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
// import { LeaveRequestService } from './leave-request.service';
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
    LeaveTypePipe
  ],
  templateUrl: './leave-request-form.component.html',
  styleUrl: './leave-request-form.component.css',
})
export class LeaveRequestFormComponent {

  
}
