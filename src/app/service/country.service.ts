import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { enviroment } from '../enviroment/enviroment';
import { Observable } from 'rxjs';
import { CountryResponse } from '../response/country.response';
import { BaseResponse } from '../response/base.reponse';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private apiCountry = `${enviroment.apiBaseUrl}/country`;
  private apiGetAllCountries = `${enviroment.apiBaseUrl}/country/all`;
  constructor(private http: HttpClient) {}
  getCountries(
    keyword: string,
    page: number,
    limit: number
  ): Observable<BaseResponse<CountryResponse>> {
    const param = new HttpParams()
      .set('keyword', keyword)
      .set('page', page)
      .set('limit', limit);
    return this.http.get<BaseResponse<CountryResponse>>(this.apiCountry, {
      params: param,
    });
  }

  getCountry(code: string): Observable<BaseResponse<CountryResponse>> {
    const param = new HttpParams().set('code', code);
    return this.http.get<BaseResponse<CountryResponse>>(this.apiCountry, {
      params: param,
    });
  }
  getAllCoutries(): Observable<BaseResponse<CountryResponse>> {
    return this.http.get<BaseResponse<CountryResponse>>(
      this.apiGetAllCountries
    );
  }
  deleteCountry(code: string): Observable<any> {
    const param = new HttpParams().set('code', code);
    return this.http.delete(this.apiCountry,{params:param});
  }
  createCountry(data: any):Observable<BaseResponse<CountryResponse>>{
    return this.http.post<BaseResponse<CountryResponse>>(this.apiCountry,data)
  }
  updateCountry(data: any):Observable<BaseResponse<CountryResponse>>{
    return this.http.put<BaseResponse<CountryResponse>>(this.apiCountry,data)
  }
}
