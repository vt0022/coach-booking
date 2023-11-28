import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DropOffService {
  private basePath = environment.apiUrl + '/dropoffs';

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
