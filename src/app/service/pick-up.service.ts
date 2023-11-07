import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PickUpService {
  private basePath = 'http://localhost:8080/api/v1/pickups';

  constructor(private httpClient: HttpClient) {}

  getPickUpByDepartureAndPickUpType(
    departureId: string,
    pickUpTypeId: string
  ): Observable<any> {
    let params = new HttpParams();
    params = params.append('departureId', departureId);
    params = params.append('pickUpTypeId', pickUpTypeId);
    return this.httpClient.get<any>(`${this.basePath}`, {
      params: params,
    });
  }
}
