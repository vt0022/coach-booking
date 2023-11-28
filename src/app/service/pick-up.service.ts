import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PickUpService {
  private basePath = environment.apiUrl + '/pickups';

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
