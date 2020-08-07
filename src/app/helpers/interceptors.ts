import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable()
export class I1 implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const modified = req.clone({
      setHeaders: {
        Authorization: window.localStorage.getItem('_start_token'),
      },
    });
    return next.handle(modified);
  }
}

// @Injectable()
// export class I2 implements HttpInterceptor {
//   intercept(
//     req: HttpRequest<any>,
//     next: HttpHandler
//   ): Observable<HttpEvent<any>> {
//     const modified = req.clone({ setHeaders: { 'Custom-Header-2': '2' } });
//     return next.handle(modified);
//   }
// }
