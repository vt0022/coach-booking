import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root',
})
export class InterceptorService implements HttpInterceptor {
  constructor(private spinner: NgxSpinnerService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const method = req.method;
    if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
      this.spinner.show();

      return next.handle(req).pipe(
        finalize(() => {
          this.spinner.hide();
        })
      );
    }

    return next.handle(req);
  }
}
