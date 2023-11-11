import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DepartureService {
  private basePath = 'http://localhost:8080/api/v1/departures';

  constructor(private httpClient: HttpClient) {}

  getDepartureList(): Observable<any> {
    return this.httpClient.get<any>(`${this.basePath}`);
  }

  getDepartureBySlug(slug: string): Observable<any> {
    return this.httpClient.get<any>(
      `${this.basePath}` + '/' + encodeURIComponent(slug)
    );
  }
}
