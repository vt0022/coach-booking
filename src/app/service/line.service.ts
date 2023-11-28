import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LineService {
  private basePath = environment.apiUrl + '/lines';

  constructor(private httpClient: HttpClient) {}

  getAvailableLinesByDesAndDep(
    departureId: string,
    destinationId: string
  ): Observable<any> {
    let params = new HttpParams();
    params = params.append('departureId', departureId);
    params = params.append('destinationId', destinationId);
    return this.httpClient.get<any>(`${this.basePath}`, {
      params: params,
    });
  }

  getAvailableLinesByDate(
    departureId: string,
    destinationId: string,
    departureDate: Date,
    coachTypeId: string
  ): Observable<any> {
    let params = new HttpParams();
    params = params.append('departureId', departureId);
    params = params.append('destinationId', destinationId);
    params = params.append('departureDate', departureDate.toString());
    params = params.append('coachTypeId', coachTypeId);
    return this.httpClient.get<any>(`${this.basePath}` + '/date', {
      params: params,
    });
  }
}
