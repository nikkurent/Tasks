import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'


@Injectable({
  providedIn: 'root'
})
export class WebRequestsService {

  constructor(private http: HttpClient) { 
  }

  get(url: string) {
    return this.http.get(`${url}`)
  }
   
  post(url: string, payload: Object) {
    return this.http.post(`${url}`, payload, {observe: 'response'})
  }

  delete(url: string) {
    return this.http.delete(`${url}`)
  }

  patch(url: string, payload: Object) {
    return this.http.patch(`${url}`, payload)
  }

  signup(email: string, password: string) {
    return this.http.post(`user`, {email, password}, {observe: 'response'})
  }

  login(email: string, password: string) {
    return this.http.post(`user/login`, {email, password}, {observe: 'response'})
  }
}
