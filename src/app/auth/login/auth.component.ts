import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { authService } from '../auth.service';

@Component({
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent {
  isLoading = false;

  constructor(private authService: authService) {}

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.authService.loginUser(form.value.email, form.value.password);
  }
}
