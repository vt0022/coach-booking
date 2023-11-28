import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DropOffTypeService {
  private basePath = environment.apiUrl + '/dropofftypes';

  constructor(private httpClient: HttpClient) {}

  getDropOffTypeList(): Observable<any> {
    return this.httpClient.get<any>(`${this.basePath}`);
  }
}
