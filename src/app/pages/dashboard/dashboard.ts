import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    // This will automatically redirect to the appropriate dashboard based on user role
    this.dashboardService.navigateToDashboard();
  }
}
