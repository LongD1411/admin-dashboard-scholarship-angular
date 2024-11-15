import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FieldOfStudyService } from '../../service/field.of.study.service';
import { FieldOfStudyResponse } from '../../response/field.of.study.response';
import { SweetAlertService } from '../../service/sweet.alert.service';
import { FieldOfStudyDTO } from '../../dto/field.of.study.dto';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-field.of.study.edit',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './field.of.study.edit.component.html',
  styleUrl: './field.of.study.edit.component.css',
})
export class FieldOfStudyEditComponent implements OnInit {
  userName: string = localStorage.getItem('userName') || "Unknow";
  fieldOfStudy: FieldOfStudyResponse | undefined;
  id: string | undefined;
  fieldOfStudyForm: FormGroup;
  constructor(
    private route: ActivatedRoute,
    private service: FieldOfStudyService,
    private alert: SweetAlertService,
    private fb: FormBuilder,
    private authService:AuthService
  ) {
    this.fieldOfStudyForm = this.fb.group({
      name: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.id = params['id'];
    });
    if (this.id) {
      this.service.getFieldOfStudy(this.id).subscribe({
        next: (response) => {
          this.fieldOfStudy = response.result;
          this.fieldOfStudyForm.patchValue({
            name: this.fieldOfStudy.name,
          });
        },
      });
    }
  }
  onSubmit(check: boolean) {
    if (this.fieldOfStudyForm.valid) {
      if (!check) {
        const data: FieldOfStudyDTO = {
          name: this.fieldOfStudyForm.get('name')?.value,
        };
        this.service.createFieldOfStudy(data).subscribe({
          next: (response) => {
            this.alert.showSuccess('Tạo thành công').then(() => {
              window.location.href = `/chuyen-nganh/chinh-sua?id=${response.result.id}`;
            });
          },
        });
      } else {
        const data = {
          name: this.fieldOfStudyForm.get('name')?.value,
          id: this.id,
        };
        this.service.updateFieldOfStudy(data).subscribe({
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
