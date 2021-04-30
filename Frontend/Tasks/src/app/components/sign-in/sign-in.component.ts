import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServicesService } from 'src/app/shared/auth-services.service';


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  constructor(private authService: AuthServicesService, private router: Router) { }

  ngOnInit(): void {
  }

  /** 
  *   Submits Sign-in Form for Authentication and redirects to main page if user authenticated.
  * 
  *   Params: {form} --> email, password
  */
  onSubmit(form: NgForm) {
    const email = form.value['email'];
    const password = form.value['password'];
    this.authService.signIn(email, password).subscribe((res) => {
      if (res) {
        this.router.navigate(['/'])
      }
    });
  }

}
