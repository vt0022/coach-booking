import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ticket } from '../model/ticket';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  private basePath = environment.apiUrl + '/tickets';

  constructor(private httpClient: HttpClient) {}

  headers = new HttpHeaders({
    'Content-Type': 'application/json', // Thay đổi loại dữ liệu nếu cần
  });

  createTicket(ticket: Ticket): Observable<any> {
    return this.httpClient.post<any>(`${this.basePath}`, ticket, {
      headers: this.headers,
    });
  }
}
