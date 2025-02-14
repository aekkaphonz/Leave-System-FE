import { Component } from '@angular/core';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatTabsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(private router: Router) {}

  onTabChange(event: MatTabChangeEvent) {
    const routes = ['/dashboard', '/request-leave', '/leave-history', '/leave-status'];
    this.router.navigate([routes[event.index]]);
  }
  
}
