import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { RegistrationModel } from 'src/app/models/registration.model';
import { AuthenticationService } from 'src/app/services/authentication-service.service';
import { TypesService } from 'src/app/services/types.service';
import { UsersService } from 'src/app/services/users/users.service';
// import { RequestsService } from 'src/app/services/requestsService/requests.service';
import { ValidForRegistrationModel } from 'src/app/models/modelsForValidation/validForRegistration.model';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { TokenPayload } from 'src/app/models/modelsForNode/tokenPayload';
import { AccountService } from 'src/app/services/account/account.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [AuthenticationService]
})

// export class RegisterComponent implements OnInit {
export class RegisterComponent {

  types: any =[];
  validations: ValidForRegistrationModel = new ValidForRegistrationModel();

  selectedImage: any;
  userBytesImage: any;

  typeAppUser: string  = ""
  datePickerId: any;

  credentials: TokenPayload = {
    email: '',
    name: '',
    password: '',
    lastName: '',
    street: '',
    number: '',
    city: '',
    birthday: new Date(),
    image: '',
    activated: '',
    //role: 'AppUser',
    passengerType: '',
    userType: ''
  }

  constructor(private authService: AuthenticationService, 
    private typesService: TypesService,
    private userService: UsersService,
    //private notificationServ: RequestsService, 
    private router: Router, private accountService: AccountService) { 

      //node
      this.accountService.getPassengerTypes().subscribe(data => {
        this.types = data;
        console.log("Tipovi putnika: ", this.types);
      },
      err => {
        console.log(err);
      });

    this.datePickerId = new Date().toISOString().split('T')[0];
  }

  ngOnInit() {
  }


  //node
  register() {
    this.authService.register(this.credentials).subscribe(() => {
      this.router.navigateByUrl('/logIn');
    }, (err) => {
      console.error(err);
    });
  }


  selected: string = '';

  showPT(event: any){
      this.selected = event.target.value;
  }

  isSelected(): boolean{
    if(this.selected == 'AppUser'){
      return true;
    }
  }

  //Samo studenti i penzioneri mogu dostavljati dokumenta
  isSelectedForImage(): boolean{
    if(this.selected == 'AppUser' && (this.typeAppUser == 'Student' || this.typeAppUser == 'Pensioner')){
      return true;
    }
  }



  getTypeAppUser(event:any){
    this.typeAppUser = event.target.value;
  }

  //node
  onSubmit(registrationData: RegistrationModel){

    
     if(this.validations.validate(registrationData)){
       //alert("Register - ERROR! ");
      console.log(registrationData);
      return;
     } 

     if(this.confirmPassword(registrationData.Password, registrationData.ConfirmPassword) === false) {
      alert("Passwords do not match!");
      return;
    }

  //   this.userService.EmailAlreadyExists(registrationData).subscribe(a=>{},
  //   err=>{
  //    window.alert(err.error);
     
  //  })

    this.credentials.name = registrationData.Name;
    this.credentials.lastName = registrationData.LastName;
    this.credentials.email = registrationData.Email;
    this.credentials.password = registrationData.Password;
    this.credentials.street = registrationData.Street;
    this.credentials.number = registrationData.Number;
    this.credentials.city = registrationData.City;
    
    this.credentials.birthday = registrationData.Birthaday;
    this.credentials.passengerType = registrationData.PassangerType;
    this.credentials.userType = registrationData.UserType;

    if(this.credentials.userType == 'AppUser' && this.credentials.passengerType != 'Default'){
      if (this.selectedImage == undefined || this.selectedImage == null){
        this.credentials.activated  = "NOT ACTIVATED";
        console.log("App user bez slike", this.credentials);
        this.register();
      }
      else{
        this.credentials.activated  = "PENDING";
        console.log("korisnik kog saljem: ", this.credentials);
        // this.register(); 
      }
    }
    else if(this.credentials.userType != 'AppUser'){
      this.credentials.activated = "NOT ACTIVATED";
      // this.register();
    }
    else{}

    


    this.register();

  //   if ((this.selectedImage == undefined || this.selectedImage == null) && (this.credentials.userType == 'AppUser')){
  //     this.credentials.activated  = "NOT ACTIVATED";
  //     console.log("korisnik kog saljemo: ", this.credentials);
    
  //     this.register();  
  //   }
  //   else{
  //     this.credentials.activated  = "PENDING";
  //     console.log("korisnik kog saljem: ", this.credentials);
  //     this.register();
  // }

  // onSubmit(registrationData: RegistrationModel, form: NgForm) {
  //    console.log(registrationData);

  //    if(this.validations.validate(registrationData)){
  //      //alert("Register - ERROR! ");
  //     console.log(registrationData);
  //     return;
  //    } 

  //    if(this.confirmPassword(registrationData.Password, registrationData.ConfirmPassword) === false) {
  //     alert("Passwords do not match!");
  //     return;
  //   }

  //   this.userService.EmailAlreadyExists(registrationData).subscribe(a=>{},
  //   err=>{
  //    window.alert(err.error);
     
  //  })

    

  //  let errorss = [];

  //   if (this.selectedImage == undefined){
  //     //alert("No image selected!");
  //     this.authService.register(registrationData).subscribe(d1=>{
  //       if(registrationData.UserType == 'AppUser'){
  //         this.notificationServ.sendNotification();
  //       }
  //       alert("Registration succesfull!");
  //       this.router.navigate(['/logIn']);
  //     },
  //     err=> {
        
        
  //     });
  //    //return; 
  //  }
    
  //  else{
  //    this.userService.uploadFile(this.selectedImage).subscribe(d2=>{
  //      this.authService.register(registrationData).subscribe(d3=>{
  //        if(registrationData.UserType != 'Admin'){
  //          this.notificationServ.sendNotification();
  //        }
  //        alert("Rregistration successful!");
  //        this.router.navigate(['/logIn']);
  //      })
  //   });
  //  }

  // }
  }
  onFileSelected(event){
    this.selectedImage = event.target.files;
  }

  confirmPassword(password1: string, password2: string) {
    if(password1 !== password2) return false;
    else return true;
  }
}
