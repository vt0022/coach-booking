import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PickUpTypeService {
  private basePath = environment.apiUrl + '/pickuptypes';

  constructor(private httpClient: HttpClient) {}

  getPickUpTypeList(): Observable<any> {
    return this.httpClient.get<any>(`${this.basePath}`);
  }
}
