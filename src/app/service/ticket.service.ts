import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ticket } from '../model/ticket';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  private basePath = 'http://localhost:8080/api/v1/tickets';

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
