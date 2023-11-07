import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CoachTypeService {
  private basePath = 'http://localhost:8080/api/v1/coachtypes';

  constructor(private httpClient: HttpClient) {}

  getCoachTypeList(): Observable<any> {
    return this.httpClient.get<any>(`${this.basePath}`);
  }
}
