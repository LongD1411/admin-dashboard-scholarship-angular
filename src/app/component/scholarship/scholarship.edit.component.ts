import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  NgModel,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ScholarshipDTO } from '../../dto/scholarship.dto';
import { SchoolService } from '../../service/school.service';
import { FieldOfStudyService } from '../../service/field.of.study.service';
import { HttpClient } from '@angular/common/http';
import { enviroment } from '../../enviroment/enviroment';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  forkJoin,
  Subject,
  switchMap,
} from 'rxjs';
import { BaseResponse } from '../../response/base.reponse';
import { SchoolResponse } from '../../response/school.response';
import { FieldOfStudyResponse } from '../../response/field.of.study.response';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ScholashipResponse } from '../../response/scholarship.response';
import { ActivatedRoute } from '@angular/router';
import { ScholashipService } from '../../service/scholarship.service';
import { SweetAlertService } from '../../service/sweet.alert.service';
import { AuthService } from '../../service/auth.service';
// import { ClassicEditor, Bold, Essentials, Italic, Mention, Paragraph, Undo } from 'ckeditor5';

@Component({
  selector: 'app-scholarship.edit',
  standalone: true,
  imports: [
    CommonModule,
    NgSelectModule,
    FormsModule,
    CKEditorModule,
    ReactiveFormsModule,
  ],
  templateUrl: './scholarship.edit.component.html',
  styleUrl: './scholarship.edit.component.css',
})
export class ScholarshipEditComponent implements OnInit {
  userName: string = localStorage.getItem('userName') || 'Unknow';
  scholarshipForm: FormGroup;
  searchTerms: Subject<string> = new Subject<string>();
  searchTerms2: Subject<string> = new Subject<string>();

  schoolOptions: any[] = [];
  fieldOfStudyOptions: any[] = [];
  scholarshipResponse: ScholashipResponse | undefined;
  Editor = ClassicEditor;
  id: string | undefined;
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
    private http: HttpClient,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private scholarshipService: ScholashipService,
    private alert: SweetAlertService,
    private authService: AuthService
  ) {
    this.scholarshipForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      grantAmount: [''],
      quantity: [0],
      gpa: [''],
      eligibility: [''],
      schoolId: [0, Validators.required],
      fieldOfStudyId: [0, Validators.required],
      startDate: [''],
      endDate: [''],
    });
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.id = params['id'];
    });
    if (this.id) {
      this.scholarshipService.getScholarship(this.id).subscribe({
        next: (response) => {
          this.scholarshipResponse = response.result;
          this.schoolOptions.push({
            id: response.result.schoolId,
            name: response.result.schoolName,
          });
          this.fieldOfStudyOptions.push({
            id: response.result.fieldOfStudyId,
            name: response.result.fieldOfStudyName,
          });
          this.scholarshipForm.patchValue({
            name: this.scholarshipResponse?.name,
            description: this.scholarshipResponse?.description,
            schoolId: this.scholarshipResponse?.schoolId,
            gpa: this.scholarshipResponse?.gpa,
            fieldOfStudyId: this.scholarshipResponse?.fieldOfStudyId,
            grantAmount: this.scholarshipResponse?.grantAmount,
            quantity: this.scholarshipResponse?.quantity,
            eligibility: this.scholarshipResponse?.eligibility,
            startDate: this.scholarshipResponse?.startDate,
            endDate: this.scholarshipResponse?.endDate,
          });
        },
      });
    }
    this.searchTerms
      .pipe(
        debounceTime(700),
        distinctUntilChanged(),
        switchMap((term) => this.searchSchools(term))
      )
      .subscribe(
        (data: any) => {
          this.schoolOptions = data.results;
        },
        (error: any) => {
          console.error('Error fetching schools:', error);
        }
      );
    this.searchTerms2
      .pipe(
        debounceTime(700),
        distinctUntilChanged(),
        switchMap((term) => this.searchFieldsOfStudy(term))
      )
      .subscribe(
        (data: any) => {
          this.fieldOfStudyOptions = data.results;
        },
        (error: any) => {
          console.error('Error fetching schools:', error);
        }
      );
  }
  onSubmit(check: boolean) {
    if (this.scholarshipForm.valid) {
      const data: ScholarshipDTO = {
        name: this.scholarshipForm.get('name')?.value,
        description: this.scholarshipForm.get('description')?.value,
        grantAmount: this.scholarshipForm.get('grantAmount')?.value,
        quantity: this.scholarshipForm.get('quantity')?.value,
        gpa: this.scholarshipForm.get('gpa')?.value,
        eligibility: this.scholarshipForm.get('eligibility')?.value,
        fieldOfStudyId: this.scholarshipForm.get('fieldOfStudyId')?.value,
        schoolId: this.scholarshipForm.get('schoolId')?.value,
        startDate: this.scholarshipForm.get('startDate')?.value,
        endDate: this.scholarshipForm.get('endDate')?.value,
      };
      if (!check) {
        this.scholarshipService.createScholarship(data).subscribe({
          next: (response) => {
            this.alert.showSuccess('Tạo thành công').then(() => {
              window.location.href = `/hoc-bong/chinh-sua?id=${response.result.id}`;
            });
          },
        });
      } else {
        const data2 = {
          id: this.id,
          ...data,
        };
        this.scholarshipService.updateScholarship(data2).subscribe({
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
  onSchoolChange(data: any) {
    this.scholarshipForm.patchValue({
      schoolId: data.id,
    });
  }

  onFieldOfStudyChange(data: any) {
    this.scholarshipForm.patchValue({
      fieldOfStudyId: data.id,
    });
  }
  searchSchools(term: any) {
    if (term) {
      return this.http
        .get<BaseResponse<SchoolResponse>>(
          `${enviroment.apiBaseUrl}/school?keyword=${term.term}`
        )
        .pipe(
          catchError((error) => {
            throw error;
          })
        );
    }
    return [];
  }
  searchFieldsOfStudy(term: any) {
    if (term) {
      return this.http
        .get<BaseResponse<FieldOfStudyResponse>>(
          `${enviroment.apiBaseUrl}/field-of-study?keyword=${term.term}`
        )
        .pipe(
          catchError((error) => {
            throw error;
          })
        );
    }
    return [];
  }

  onSchoolInput(term: any): void {
    this.searchTerms.next(term);
  }
  onFieldOfStudyInput(term: any) {
    this.searchTerms2.next(term);
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
