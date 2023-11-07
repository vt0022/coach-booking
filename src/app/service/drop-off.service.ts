import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DropOffService {
  private basePath = 'http://localhost:8080/api/v1/dropoffs';

  constructor(private httpClient: HttpClient) {}

  getDropOffByDestinationAndDropOffType(
    destinationId: string,
    dropOffTypeId: string
  ): Observable<any> {
    let params = new HttpParams();
    params = params.append('destinationId', destinationId);
    params = params.append('dropOffTypeId', dropOffTypeId);
    return this.httpClient.get<any>(`${this.basePath}`, {
      params: params,
    });
  }
}
