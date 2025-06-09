import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SweetAlertService } from '../../service/sweet.alert.service';
import { AuthService } from '../../service/auth.service';
import { RegisterDTO } from '../../dto/register.dto';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  profileForm: FormGroup;
  registrationMessage: string = '';
  isError: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.profileForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(5)]],
        retypePassword: ['', [Validators.required, Validators.minLength(5)]],
        full_name: ['', [Validators.required]],
        address: ['', [Validators.required]],
        isAccepted: [false, [Validators.requiredTrue]],
        dateOfBirth: ['', [Validators.required, this.ageValidator]],
      },
      { validator: this.passwordMatchValidator }
    );
  }
  onPhoneChange() {}
  submitHandler() {
    if (this.profileForm.valid) {
      const registerDTO: RegisterDTO = {
        full_name: this.profileForm.get('full_name')?.value,
        email: this.profileForm.get('email')?.value,
        address: this.profileForm.get('address')?.value,
        password: this.profileForm.get('password')?.value,
        date_of_birth: this.profileForm.get('dateOfBirth')?.value,
      };

      this.authService.register(registerDTO).subscribe({
        next: (response: any) => {
          this.registrationMessage = 'Đăng ký thành công!';
          this.isError = false;
        },
        error: (error) => {
          const errorResponseMessage = error.error.message ;
          this.registrationMessage =
            errorResponseMessage || 'An error occurred during registration';
          console.log(error);
          this.isError = true;
        },
        complete: () => {},
      });
    } else {
      this.registrationMessage = 'Vui lòng nhập đủ thông tin.';
      this.isError = true;
    }
  }

  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password');
    const retypePassword = control.get('retypePassword')!;
    if (password && retypePassword && password.value !== retypePassword.value) {
      retypePassword.setErrors({ passwordMismatch: true });
    }
    return null;
  }
  ageValidator(control: AbstractControl): ValidationErrors | null {
    const dateOfBirth = control.value;
    if (!dateOfBirth) {
      return null;
    }
    const today = new Date();
    const dob = new Date(dateOfBirth);
    if (isNaN(dob.getTime())) {
      return { invalidDate: true };
    }
    let age = today.getFullYear() - dob.getFullYear();
    const monthDifference = today.getMonth() - dob.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < dob.getDate())
    ) {
      age--;
    }
    return age < 16 ? { ageUnder16: true } : null;
  }

  get phone() {
    return this.profileForm.get('phone')!;
  }
  get password() {
    return this.profileForm.get('password')!;
  }
  get retypePassword() {
    return this.profileForm.get('retypePassword')!;
  }
  get fullName() {
    return this.profileForm.get('fullName')!;
  }
  get address() {
    return this.profileForm.get('address')!;
  }
  get dateOfBirth() {
    return this.profileForm.get('dateOfBirth')!;
  }
  get isAccepted() {
    return this.profileForm.get('isAccepted')!;
  }
  homeNavigate() {
    this.router.navigate(['/']);
  }
}
