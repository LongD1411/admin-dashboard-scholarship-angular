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
  selector: 'app-login',
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
      userName: ['', [Validators.required, Validators.minLength(5)]],
      password: ['', [Validators.required, Validators.minLength(5)]],
    });
  }
  submitHandler() {
    if (this.loginForm.valid) {
      const loginData = {
        userName: this.loginForm.get('userName')?.value,
        password: this.loginForm.get('password')?.value,
      };
      this.authService.login(loginData).subscribe({
        next: (response) => {
          const token = response.result.token;
          this.authService.setToken(token);
          const payload = JSON.parse(atob(token.split('.')[1]));
          localStorage.setItem("userName",payload.sub);
          if (payload.scope && payload.scope.includes('ROLE_ADMIN')) {
            window.location.href = '/trang-chu';  
          }
          this.alert.showSuccess('Đăng nhập thành công');
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
  get userName() {
    return this.loginForm.get('userName')!;
  }
  get password() {
    return this.loginForm.get('password')!;
  }
  homeNavigate() {
    this.router.navigate(['/']);
  }
}
