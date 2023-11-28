import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DestinationService {
  private basePath = environment.apiUrl + '/destinations';

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
