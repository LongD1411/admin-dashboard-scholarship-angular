import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SweetAlertService } from '../../service/sweet.alert.service';
import { AuthService } from '../../service/auth.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: FormGroup;
  registrationMessage: string = '';
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private alert: SweetAlertService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }
  submitHandler() {
    if (this.loginForm.valid) {
      const loginData = {
        email: this.loginForm.get('email')?.value,
        password: this.loginForm.get('password')?.value,
      };
      this.authService.login(loginData).subscribe({
        next: (response) => {
          const token = response.result.token;
          this.authService.setToken(token);
          const payload = JSON.parse(atob(token.split('.')[1]));
          localStorage.setItem("email",payload.sub);
          if (payload.scope && payload.scope.includes('ROLE_ADMIN')) {
            window.location.href = '/trang-chu';  
            localStorage.setItem('successMessage', 'Đăng nhập thành công');
          }
        },
        error: (error) => {
          this.alert.showError(error.error.message);
        },
        complete: () => {},
      });
    } else {
      this.registrationMessage = 'Điền đúng định dạng các trường.';
    }
  }
  get email() {
    return this.loginForm.get('email')!;
  }
  get password() {
    return this.loginForm.get('password')!;
  }
  homeNavigate() {
    this.router.navigate(['/']);
  }
}
