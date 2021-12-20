import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  @ViewChild('drawer', { static: false }) drawer: MatDrawer;
  constructor(
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('dashboard here');
  }

  onToggleClick(): void {
    if (this.drawer) {
      this.drawer.toggle();
    }
  }

  goToMainPage(): void {
    this.router.navigate(['/']);
  }
}
