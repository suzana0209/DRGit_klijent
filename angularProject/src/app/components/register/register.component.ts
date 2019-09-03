import { Component, OnInit } from '@angular/core';
import { RegistrationModel } from 'src/app/models/registration.model';
import { AuthenticationService } from 'src/app/services/authentication-service.service';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account/account.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [AuthenticationService]
})

export class RegisterComponent implements OnInit {

  types: any =[];
  selectedImage: any = null;
  userBytesImage: any;

  typeAppUser: string  = ""
  datePickerId: any;
  formd: FormData = new FormData();

  constructor(private authService: AuthenticationService, 
    private router: Router, private accountService: AccountService) { 

      this.accountService.getPassengerTypes().subscribe(data => {
        this.types = data;
      },
      err => {
        console.log(err.error.message); 
      });

    this.datePickerId = new Date().toISOString().split('T')[0];
  }

  ngOnInit() {
  }

  register(foormData : FormData) {
    this.authService.register(foormData).subscribe(() => {
      window.alert("You have successfully registered!")
      this.router.navigateByUrl('/logIn');
    }, 
    (err) => {
      window.alert(err.error.message);  
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

  isSelectedForImage(): boolean{
    if(this.selected == 'AppUser' && (this.typeAppUser == 'Student' || this.typeAppUser == 'Pensioner')){
      return true;
    }
  }

  getTypeAppUser(event:any){ 
    this.typeAppUser = event.target.value;
  }

  onSubmit(registrationData: RegistrationModel){
    this.formd = new FormData();
  this.formd.append("name", registrationData.Name);
  this.formd.append("surname",registrationData.LastName);
  this.formd.append('city',  registrationData.City);
  this.formd.append('number', registrationData.Number)
  this.formd.append('street', registrationData.Street)
  this.formd.append('email', registrationData.Email);
  this.formd.append('userType', registrationData.UserType);

  this.formd.append('birthday', registrationData.Birthaday.toString());
  this.formd.append('password', registrationData.Password);
  this.formd.append('confirmPassword', registrationData.ConfirmPassword);
  this.formd.append('passengerType', registrationData.PassangerType); 


   if(registrationData.UserType != 'AppUser'){ 
      this.formd.append('activated', "PENDING");  
      this.register(this.formd);
    }
    else if(registrationData.UserType == 'AppUser' && registrationData.PassangerType != 'Regular'){  //moze imati sliku
      if (this.selectedImage == undefined || this.selectedImage == null){
        this.formd.append('activated', "NOT ACTIVATED");
        //console.log("App user bez slike", this.formd);
        this.register(this.formd);
      }
      else{
        this.formd.append('file',this.selectedImage, this.selectedImage.name); 
        this.formd.append('activated', "PENDING"); 
        
        //console.log("korisnik kog saljem sa slikom: ", this.formd);
        this.register(this.formd);
      }
    }
    else{
      this.formd.append('activated', "ACTIVATED");
      this.register(this.formd);
    }
  }
  onFileSelected(event){
    this.selectedImage = event.target.files[0];
  }
}
