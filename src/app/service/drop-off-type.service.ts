import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DropOffTypeService {
  private basePath = 'http://localhost:8080/api/v1/dropofftypes';

  constructor(private httpClient: HttpClient) {}

  getDropOffTypeList(): Observable<any> {
    return this.httpClient.get<any>(`${this.basePath}`);
  }
}
