import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { enviroment } from '../enviroment/enviroment';
import { Observable } from 'rxjs';
import { CountryResponse } from '../response/country.response';
import { BaseResponse } from '../response/base.reponse';
import { ScholashipResponse } from '../response/scholarship.response';
import { SchoolResponse } from '../response/school.response';

@Injectable({
  providedIn: 'root',
})
export class SchoolService {
  private apiSchool = `${enviroment.apiBaseUrl}/school`;
  constructor(private http: HttpClient) {}
  getSchools(
    keyword: string,
    page: number,
    limit: number
  ): Observable<BaseResponse<SchoolResponse>> {
    const param = new HttpParams()
      .set('keyword', keyword)
      .set('page', page)
      .set('limit', limit);
    return this.http.get<BaseResponse<SchoolResponse>>(this.apiSchool, {
      params: param,
    });
  }
  getSchool(id: string): Observable<BaseResponse<SchoolResponse>> {
    const param = new HttpParams().set('id', id);
    return this.http.get<BaseResponse<SchoolResponse>>(this.apiSchool, {
      params: param,
    });
  }
  deleteSchool(id: string): Observable<any> {
    const param = new HttpParams().set('id', id);
    return this.http.delete(this.apiSchool, { params: param });
  }
  createSchool(data: any): Observable<BaseResponse<SchoolResponse>> {
    return this.http.post<BaseResponse<SchoolResponse>>(this.apiSchool, data);
  }
  updateSchool(data: any): Observable<BaseResponse<SchoolResponse>> {
    return this.http.put<BaseResponse<SchoolResponse>>(this.apiSchool, data);
  }
}
