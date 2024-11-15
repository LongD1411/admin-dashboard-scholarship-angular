import { Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { ScholarshipComponent } from './component/scholarship/scholarship.component';
import { FieldOfStudyComponent } from './component/field.of.study/field.of.study.component';
import { CountryComponent } from './component/country/country.component';
import { SchoolComponent } from './component/school/school.component';
import { CountryEditComponent } from './component/country/country.edit.component';
import { FieldOfStudyEditComponent } from './component/field.of.study/field.of.study.edit.component';
import { SchoolEditComponent } from './component/school/school.edit.component';
import { ScholarshipEditComponent } from './component/scholarship/scholarship.edit.component';
import { LoginComponent } from './component/login/login.component';
import { AuthGuard } from './guard/auth.guard';

export const routes: Routes = [
  {
    path: 'dang-nhap',
    component: LoginComponent,
  },
  {
    path: 'trang-chu',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'hoc-bong',
    component: ScholarshipComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'hoc-bong/chinh-sua',
    component: ScholarshipEditComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'truong-hoc',
    component: SchoolComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'truong-hoc/chinh-sua',
    component: SchoolEditComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'quoc-gia',
    component: CountryComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'quoc-gia/chinh-sua',
    component: CountryEditComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'chuyen-nganh',
    component: FieldOfStudyComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'chuyen-nganh/chinh-sua',
    component: FieldOfStudyEditComponent,
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '/trang-chu', pathMatch: 'full' },
];
