import { Component, OnDestroy, OnInit } from '@angular/core';
import { authService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit, OnDestroy {
  isUserAuthenticated = false;
  private authStatusSubscription: Subscription;

  constructor(private authService: authService) {}
  ngOnDestroy(): void {
    this.authStatusSubscription.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
  }
  ngOnInit(): void {
    this.isUserAuthenticated = this.authService.getAuthStatus();
    this.authStatusSubscription = this.authService
      .getAuthStatusListener()
      .subscribe((result) => {
        this.isUserAuthenticated = result;
      });
  }
}
