import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServicesService } from 'src/app/shared/auth-services.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthServicesService, private router: Router) { }

  ngOnInit(): void {
  }

  /** 
  *   Submits Login Form for Authentication and redirects to main page if user authenticated.
  * 
  *   Params: {form} --> email, password
  */
  onSubmit(form: NgForm) {
    const email = form.value['email'];
    const password = form.value['password'];
    this.authService.login(email, password).subscribe((res: HttpResponse<any>) => {
      if (res.status === 200) {
        this.router.navigate(['/'])
      }
    })
  }

}
