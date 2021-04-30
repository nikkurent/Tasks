import { Injectable } from '@angular/core';
import { WebRequestsService } from './web-requests.service';
import { shareReplay, tap } from 'rxjs/operators'
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthServicesService {


  /**
  *   adds userId, accessToken and refreshToken to localStorage
  */
  private setSession(userId: string, accessToken: string | null, refreshToken: string | null) {
    localStorage.setItem('user-id', userId)
    localStorage.setItem('x-access-token', accessToken!)
    localStorage.setItem('x-refresh-token', refreshToken!)
  }

  /**
  *   removes userId, accessToken and refreshToken to localStorage
  */
  private removeSession() {
    localStorage.removeItem('x-access-token');
    localStorage.removeItem('x-refresh-token');
    localStorage.removeItem('user-id');
  }

  constructor(private webRequestService: WebRequestsService, private http: HttpClient, private router: Router) { }

  getRefreshToken() {
    return localStorage.getItem('x-refresh-token');
  }

  getAccessToken() {
    return localStorage.getItem('x-access-token');
  }

  getUserId() {
    return localStorage.getItem('user-id');
  }

  setAccessToken(accessToken: string) {
    localStorage.setItem('x-access-token', accessToken)
  }

  logout() {
    this.removeSession();
    this.router.navigateByUrl('/login');
  }

  signIn(email: string, password: string) {
    return this.webRequestService.signup(email, password).pipe(
      shareReplay(),
      tap((res: any) => {
        this.setSession(res.body._id, res.headers.get('x-access-token'), res.headers.get('x-refresh-token'));
        console.log('Succesfuly sign up');
      })
    )
  }

  login(email: string, password: string) {
    return this.webRequestService.login(email, password).pipe(
      shareReplay(),
      tap((res: any) => {
        this.setSession(res.body._id, res.headers.get('x-access-token'), res.headers.get('x-refresh-token'));
        console.log('Succesfuly loged in');
      })
    )
  }

  getNewAccessToken() {
    return this.http.get(`user/access-token`, {
      headers: {
        'x-refresh-token': this.getRefreshToken()!,
        '_id': this.getUserId()!
      },
      observe: "response", responseType: 'text'
    }).pipe(
      tap((res: HttpResponse<any>) => {
        this.setAccessToken(res.headers.get('x-access-token')!)
      })
    )
  }
}
