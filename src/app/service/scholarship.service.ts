import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { enviroment } from '../enviroment/enviroment';
import { Observable } from 'rxjs';
import { CountryResponse } from '../response/country.response';
import { BaseResponse } from '../response/base.reponse';
import { ScholashipResponse } from '../response/scholarship.response';

@Injectable({
  providedIn: 'root',
})
export class ScholashipService {
  private apiScholarship = `${enviroment.apiBaseUrl}/scholarship`;
  private apiExpiringScholarship = `${enviroment.apiBaseUrl}/scholarship/expiring-scholarship`;
  private apiScholarshipsUpdatedLastWeek = `${enviroment.apiBaseUrl}/scholarship/scholarships-updated-last-week`;
  private apiCountByMonth = `${enviroment.apiBaseUrl}/scholarship/scholarships-by-month`;
  private apiCountByCountry = `${enviroment.apiBaseUrl}/scholarship/scholarships-top-countries`;
  private apiCountByFieldOfStudy = `${enviroment.apiBaseUrl}/scholarship/scholarships-top-field-of-study`;
  private apiCountByTopSearch = `${enviroment.apiBaseUrl}/scholarship/top-search`;
  constructor(private http: HttpClient) {}
  getScholarships(
    keyword: string,
    page: number,
    limit: number
  ): Observable<BaseResponse<ScholashipResponse>> {
    const param = new HttpParams()
      .set('keyword', keyword)
      .set('page', page)
      .set('limit', limit);
    return this.http.get<BaseResponse<ScholashipResponse>>(
      this.apiScholarship,
      {
        params: param,
      }
    );
  }
  getScholarship(id: string): Observable<BaseResponse<ScholashipResponse>> {
    const param = new HttpParams().set('id', id);
    return this.http.get<BaseResponse<ScholashipResponse>>(
      this.apiScholarship,
      {
        params: param,
      }
    );
  }
  getExpiringScholarship(): Observable<BaseResponse<number>> {
    return this.http.get<BaseResponse<number>>(this.apiExpiringScholarship);
  }
  getScholarshipsUpdatedLastWeek(): Observable<BaseResponse<number>> {
    return this.http.get<BaseResponse<number>>(this.apiScholarshipsUpdatedLastWeek);
  }
  getScholarshipsByMonth(): Observable<BaseResponse<any>> {
    return this.http.get<BaseResponse<any>>(this.apiCountByMonth);
  }
  getScholarshipsByCountry(): Observable<BaseResponse<any>> {
    return this.http.get<BaseResponse<any>>(this.apiCountByCountry);
  }
  getScholarshipsByFieldOfStudy(): Observable<BaseResponse<any>> {
    return this.http.get<BaseResponse<any>>(this.apiCountByFieldOfStudy);
  }
  getScholarshipsByTopSearch(): Observable<BaseResponse<any>> {
    return this.http.get<BaseResponse<any>>(this.apiCountByTopSearch);
  }
  deleteScholarship(id: string): Observable<any> {
    const param = new HttpParams().set('id', id);
    return this.http.delete(this.apiScholarship, { params: param });
  }
  createScholarship(data: any): Observable<BaseResponse<ScholashipResponse>> {
    return this.http.post<BaseResponse<ScholashipResponse>>(
      this.apiScholarship,
      data
    );
  }
  updateScholarship(data: any): Observable<BaseResponse<ScholashipResponse>> {
    return this.http.put<BaseResponse<ScholashipResponse>>(
      this.apiScholarship,
      data
    );
  }
}
