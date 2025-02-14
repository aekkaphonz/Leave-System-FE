import { Routes } from '@angular/router';
import { LeaveRequestFormComponent } from './leave-request-form/leave-request-form.component';
import { LeaveApprovalPageComponent } from './leave-approval-page/leave-approval-page.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LeaveHistoryComponent } from './leave-history/leave-history.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
    {
        path:"dashboard",
        component:DashboardComponent
    },
    {
        path:"request-leave",
        component:LeaveRequestFormComponent
    },
    {
        path:"leave-status",
        component:LeaveApprovalPageComponent
    },
    {
        path:"leave-history",
        component:LeaveHistoryComponent
    }
    
];
