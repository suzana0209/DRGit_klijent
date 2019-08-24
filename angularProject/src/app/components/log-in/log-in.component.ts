import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication-service.service';
import { RegistrationModel } from 'src/app/models/registration.model';
import { NgForm } from '@angular/forms';
import { LogInValidations } from 'src/app/models/modelsForValidation/validForLogin.model';
import { Router } from '@angular/router';
import { TokenPayload } from 'src/app/models/modelsForNode/tokenPayload';
import { Token } from '@angular/compiler/src/ml_parser/lexer';


@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css'],
  providers: [AuthenticationService]
})

export class LogInComponent implements OnInit {
  credentials: TokenPayload = {
    email: '',
    password: ''
  };

  validations: LogInValidations = new LogInValidations();
  pomocniUser: any;

  constructor(private authService: AuthenticationService, private router: Router) { }

  ngOnInit() {
  }


  onSubmit(loginData: RegistrationModel, form:NgForm){

   this.credentials.email = loginData.Email;
   this.credentials.password = loginData.Password;
   this.authService.logIn(this.credentials).subscribe(res=>{
     this.authService.profile().subscribe(data=>{
       this.pomocniUser = data;
       let user = data;
       localStorage.setItem('role', user.userType);
       localStorage.setItem('name', user.email);
       //console.log("Pomocni model: ", this.pomocniUser); 
     });
     
     this.router.navigateByUrl('/profile');
   },
   error=>{
     console.log(error)
     alert("Wrong username or password!");
   });
      
  }

  

}
