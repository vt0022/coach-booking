import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PickUpTypeService {
  private basePath = 'http://localhost:8080/api/v1/pickuptypes';

  constructor(private httpClient: HttpClient) {}

  getPickUpTypeList(): Observable<any> {
    return this.httpClient.get<any>(`${this.basePath}`);
  }
}
