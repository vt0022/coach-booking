import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class DestinationService {
  private basePath = 'http://localhost:8080/api/v1/destinations';

  constructor(private httpClient: HttpClient) {}

  getDestinationsByDeparture(slug: string): Observable<any> {
    return this.httpClient.get<any>(
      `${this.basePath}` + '/departures/' + encodeURIComponent(slug)
    );
  }

  getDestinationBySlug(slug: string): Observable<any> {
    return this.httpClient.get<any>(
      `${this.basePath}` + '/' + encodeURIComponent(slug)
    );
  }
}
