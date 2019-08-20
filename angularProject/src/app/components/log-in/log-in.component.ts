import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication-service.service';
import { RegistrationModel } from 'src/app/models/registration.model';
import { NgForm } from '@angular/forms';
import { LogInValidations } from 'src/app/models/modelsForValidation/validForLogin.model';
import { Router } from '@angular/router';
import { TokenPayload } from 'src/app/models/modelsForNode/tokenPayload';


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

  constructor(private authService: AuthenticationService, private router: Router) { }

  ngOnInit() {
  }


  onSubmit(loginData: RegistrationModel, form:NgForm){
    // console.log(loginData);
    // if(this.validations.validate(loginData)) return;
    // //prije bilo
    // let p =  this.authService.logIn(loginData); 

   this.credentials.email = loginData.Email;
   this.credentials.password = loginData.Password;
   this.authService.logIn(this.credentials).subscribe(res=>{
     this.authService.profile().subscribe(data=>{
       let user = data;
       localStorage.setItem('role', user.role);
       localStorage.setItem('name', user.email);
     });
     this.router.navigateByUrl('/profile');
   },
   error=>{
     console.log(error)
     alert("Wrong username or password");
   });    
  }

  

}
