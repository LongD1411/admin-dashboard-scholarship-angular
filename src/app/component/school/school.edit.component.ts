import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  NgSelectOption,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CountryService } from '../../service/country.service';
import { CountryResponse } from '../../response/country.response';
import { NgSelectModule } from '@ng-select/ng-select';
import { ActivatedRoute } from '@angular/router';
import { SchoolService } from '../../service/school.service';
import { SweetAlertService } from '../../service/sweet.alert.service';
import { SchoolResponse } from '../../response/school.response';
import { SchoolDTO } from '../../dto/school.dto';
import { AuthService } from '../../service/auth.service';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-school.edit',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule, ReactiveFormsModule,CKEditorModule],
  templateUrl: './school.edit.component.html',
  styleUrl: './school.edit.component.css',
})
export class SchoolEditComponent implements OnInit {
  email: string = localStorage.getItem('email') || "Unknow";
  schoolResponse: SchoolResponse | undefined;
  countries: CountryResponse[] = [];
  selectedCountry: string = '';
  id: string | undefined;
  schoolForm: FormGroup;
  Editor = ClassicEditor;
  public editorConfig = {
    toolbar: [
      'bold',
      'italic',
      'link',
      'undo',
      'redo',
      'bulletedList',
      'numberedList',
      'blockQuote',
      'insertTable',
      'alignment',
      'fontSize',
      'fontFamily',
    ],
  };
  constructor(
    private countryService: CountryService,
    private route: ActivatedRoute,
    private schoolService: SchoolService,
    private alert: SweetAlertService,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.schoolForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      logo: [''],
      provider: [''],
      countryCode: ['', Validators.required],
      rankValue: [0],
      url:[''],
      students : 0,
      fieldOfStudy:0,
      type: [''],
      topReason:['']
    });
  }

  ngOnInit(): void {
    this.countryService.getAllCoutries().subscribe({
      next: (response) => {
        this.countries = response.results;
        this.route.queryParams.subscribe((params) => {
          this.id = params['id'];
        });
        if (this.id) {
          this.schoolService.getSchool(this.id).subscribe({
            next: (response) => {
              this.schoolResponse = response.result;
              this.schoolForm.patchValue({
                name: this.schoolResponse.name,
                description: this.schoolResponse.description,
                logo: this.schoolResponse.logo,
                provider: this.schoolResponse.provider,
                countryCode: this.schoolResponse.countryCode,
                rankValue: this.schoolResponse.rankValue,
                url: this.schoolResponse.url,
                students: this.schoolResponse.students,
                fieldOfStudy: this.schoolResponse.fieldOfStudy,
                type: this.schoolResponse.type,
                topReason: this.schoolResponse.topReason
              });
            },
          });
        }
      },
    });
  }

  onSubmit(check: boolean) {
    if (this.schoolForm.valid) {
      const data: SchoolDTO = {
        name: this.schoolForm.get('name')?.value,
        description: this.schoolForm.get('description')?.value,
        provider: this.schoolForm.get('provider')?.value,
        countryCode: this.schoolForm.get('countryCode')?.value,
        rankValue: this.schoolForm.get('rankValue')?.value,
        logo: this.schoolForm.get('logo')?.value,
        url: this.schoolForm.get('url')?.value,
        students: this.schoolForm.get('students')?.value,
        fieldOfStudy: this.schoolForm.get('fieldOfStudy')?.value,
        type: this.schoolForm.get('type')?.value,
        topReason: this.schoolForm.get('topReason')?.value,
      };
      if (!check) {
        this.schoolService.createSchool(data).subscribe({
          next: (response) => {
            this.alert.showSuccess('Tạo thành công').then(() => {
              window.location.href = `/truong-hoc/chinh-sua?id=${response.result.id}`;
            });
          },
        });
      } else {
        const data2 = {
          id: this.id,
          ...data,
        };
        debugger;
        this.schoolService.updateSchool(data2).subscribe({
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

  onCountryChange(event: CountryResponse) {
    this.selectedCountry = event.code;
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
