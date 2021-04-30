import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { empty, Observable, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { AuthServicesService } from './auth-services.service';

/** Pass untouched request through to the next request handler. */
@Injectable({
    providedIn: 'root',
  })
export class _HttpInterceptor implements HttpInterceptor {

    constructor(private authRequestService: AuthServicesService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
        req = this.addAuthHeader(req);
        
        return next.handle(req).pipe(
            catchError((err: HttpErrorResponse) => {
                if (err.status === 401) {
                    console.log(err);
                    return this.refreshAccessToken().pipe(
                        switchMap(() => {
                            req = this.addAuthHeader(req);
                            return next.handle(req);
                        }),
                        catchError((err: HttpErrorResponse) => {
                            console.log(err);
                            this.authRequestService.logout();
                            return empty();
                        })
                    )
                }
                return throwError(err);
            })
        )
    }
 

    addAuthHeader(req: HttpRequest<any>) {
        const token = this.authRequestService.getAccessToken();
        if (token) return req.clone({
            headers: req.headers.set('x-access-token', token)
        })
        return req;
    }

    refreshAccessToken() {
        return this.authRequestService.getNewAccessToken().pipe(
            tap(() => {
                console.log('Access Token Refreshed')
            })
        )
    }
}