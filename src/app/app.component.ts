import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LeaveRequestFormComponent } from "./leave-request-form/leave-request-form.component";
import { LeaveApprovalPageComponent } from "./leave-approval-page/leave-approval-page.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { NavbarComponent } from './navbar/navbar.component';
import { CalendarComponent } from "./calendar/calendar.component";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CalendarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

}
