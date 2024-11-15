import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { enviroment } from '../enviroment/enviroment';
import { Observable } from 'rxjs';
import { CountryResponse } from '../response/country.response';
import { BaseResponse } from '../response/base.reponse';
import { ScholashipResponse } from '../response/scholarship.response';
import { FieldOfStudyResponse } from '../response/field.of.study.response';

@Injectable({
  providedIn: 'root',
})
export class FieldOfStudyService {
  private apiFeildOfStudy = `${enviroment.apiBaseUrl}/field-of-study`;
  constructor(private http: HttpClient) {}
  getFieldOfStudies(
    keyword: string,
    page: number,
    limit: number
  ): Observable<BaseResponse<FieldOfStudyResponse>> {
    const param = new HttpParams()
      .set('keyword', keyword)
      .set('page', page)
      .set('limit', limit);
    return this.http.get<BaseResponse<FieldOfStudyResponse>>(this.apiFeildOfStudy, {
      params: param,
    });
  }
  getFieldOfStudy(
    id: string,
  ): Observable<BaseResponse<FieldOfStudyResponse>> {
    const param = new HttpParams()
      .set('id', id)
    return this.http.get<BaseResponse<FieldOfStudyResponse>>(this.apiFeildOfStudy, {
      params: param,
    });
  }
  deleteFieldOfStudy(id: string): Observable<any> {
    const param = new HttpParams().set('id', id);
    return this.http.delete(this.apiFeildOfStudy,{params:param});
  }
  createFieldOfStudy(data: any):Observable<BaseResponse<FieldOfStudyResponse>>{
    return this.http.post<BaseResponse<FieldOfStudyResponse>>(this.apiFeildOfStudy,data)
  }
  updateFieldOfStudy(data: any):Observable<BaseResponse<FieldOfStudyResponse>>{
    return this.http.put<BaseResponse<FieldOfStudyResponse>>(this.apiFeildOfStudy,data)
  }
}
