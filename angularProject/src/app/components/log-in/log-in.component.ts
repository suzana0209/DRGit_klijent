import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication-service.service';
import { RegistrationModel } from 'src/app/models/registration.model';
import { NgForm } from '@angular/forms';
import { LogInValidations } from 'src/app/models/modelsForValidation/validForLogin.model';
import { Router } from '@angular/router';
//import { TokenPayload } from 'src/app/models/modelsForNode/tokenPayload';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css'],
  providers: [AuthenticationService]
})

export class LogInComponent implements OnInit {
  // credentials: TokenPayload = {
  //   email: '',
  //   password: ''
  // };

  validations: LogInValidations = new LogInValidations();
  pomocniUser: any;

  constructor(private authService: AuthenticationService, private router: Router) { }

  ngOnInit() {
  }


  onSubmit(loginData: RegistrationModel, form:NgForm){
    let fd  = new FormData();
    fd.append('email', loginData.Email);
    fd.append('password', loginData.Password);
    this.authService.logIn(fd).subscribe(res=>{
    this.authService.profile().subscribe(data=>{
       this.pomocniUser = data;
       let user = data;
       localStorage.setItem('role', user.userType);
       localStorage.setItem('name', user.email);
     });
     
     this.router.navigateByUrl('/busLines');
   },
   err=>{
     window.alert(err.error.message);
   });
      
  }
}
