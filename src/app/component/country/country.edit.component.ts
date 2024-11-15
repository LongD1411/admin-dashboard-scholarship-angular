import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CountryService } from '../../service/country.service';
import { CountryResponse } from '../../response/country.response';
import { CountryDTO } from '../../dto/country.dto';
import { SweetAlertService } from '../../service/sweet.alert.service';
import { AuthService } from '../../service/auth.service';
@Component({
  selector: 'app-country.edit',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './country.edit.component.html',
  styleUrl: './country.edit.component.css',
})
export class CountryEditComponent implements OnInit {
  userName: string = localStorage.getItem('userName') || "Unknow";
  country: CountryResponse | undefined;
  code: string | undefined;
  countryForm: FormGroup;
  check: boolean = true;
  constructor(
    private countryService: CountryService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private alert: SweetAlertService,
    private authService:AuthService,
  ) {
    this.countryForm = this.fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      continent: ['', Validators.required],
    });
  }
  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.code = params['code'];
    });
    if (this.code) {
      this.check = true;
      this.countryService.getCountry(this.code).subscribe({
        next: (response) => {
          this.country = response.result;
          this.countryForm.patchValue({
            name: this.country.name,
            code: this.country.code,
            continent: this.country.continent,
          });
        },
      });
    }
  }
  onSubmit(check: boolean) {
    if (this.countryForm.valid) {
      const countryDTO: CountryDTO = {
        name: this.countryForm.get('name')?.value,
        code: this.countryForm.get('code')?.value,
        continent: this.countryForm.get('continent')?.value,
      };
      if (!check) {
        this.countryService.createCountry(countryDTO).subscribe({
          next: (response) => {
            this.alert.showSuccess('Tạo thành công').then(() => {
              window.location.href = `/quoc-gia/chinh-sua?code=${response.result.code}`;
            });
          },
        });
      } else {
        this.countryService.updateCountry(countryDTO).subscribe({
          next: (response) => {
            this.alert.showSuccess('Cập nhật thành công').then(() => {
              window.location.reload();
            });
          },
          error: (error) => {
            this.alert.showError(error.error.message);
          },
        });
      }
    }
  }
  logout() {
    this.alert.showConfirm('Cảnh bảo', 'Xác nhận đăng xuất').then((result) => {
      if (result.isConfirmed) {
        this.authService.logout().subscribe({
          next: (response) => {
            this.authService.removeToken();
            window.location.href = '/dang-nhap';
          },
          error: (error) => {
            console.log(error);
          },
        });
      }
    });
  }
}
