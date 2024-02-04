import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { authService } from '../auth.service';

@Component({
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  isLoading = false;

  constructor(public authService: authService) {}
  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.authService.createUser(form.value.email, form.value.password);
  }
}
