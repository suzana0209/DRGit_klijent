import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users/users.service';
import { RegistrationModel } from 'src/app/models/registration.model';
import { NgForm } from '@angular/forms';
import { PomModelForPassword } from 'src/app/models/PomModelForPassword.model';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account/account.service';
import { AuthenticationService } from 'src/app/services/authentication-service.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [UsersService]
})
 
export class ProfileComponent implements OnInit {
  selected: string = "";
  user: any;
  user1: RegistrationModel = new RegistrationModel("","","","","","","","",new Date(),"","","","");
  userForEdit: RegistrationModel = new RegistrationModel("","","","","","","","",new Date(),"","","","");

  studentOrPensioner = false;
  ClickedButtonEdit: boolean = false;

  showImageBool: boolean = false;
  selectedImage: any;

  showApplyButton: boolean = false;

  listOfImage: any = [];
  imagesLoaded: boolean = false;
  userBytesImage:any ;
  rodjendan: string = ""
  mejlZaShow: string = ""
  pendingUser: boolean = false;
  nonActivatedUser: boolean = false;

  typePassanger: string = ""
  kk: string = ""
  idKorisnika: string = ""
  fdd: FormData = new FormData();

  constructor(private usersService: UsersService, private router:Router, private accountService:AccountService,
    private authenticationService: AuthenticationService) {
      this.fdd = new FormData();
      this.mejlZaShow = localStorage.getItem('name').toString();
    this.accountService.getUserData(localStorage.getItem('name')).subscribe(data=>{
      this.user = data;
      
      this.user.forEach(element => {
        if(element){
          this.user1.Id = element._id;
          this.idKorisnika = element._id.toString();
          this.fdd.append('Id', element._id.toString());
          this.user1.Birthaday = element.birthday;
          this.rodjendan = element.birthday.toString().split('T')[0];
          this.user1.Name = element.name;
          this.user1.LastName = element.lastName;
          this.user1.City = element.city;
          this.user1.Number = element.number;
          this.user1.Street = element.street;
          this.user1.Email = element.email;
          
          if(element.userType != "AppUser"){
            this.typePassanger = element.userType;
          }else{
            this.pendingUser = (element.activated == "PENDING") ? true : false;
            this.nonActivatedUser = (element.activated == "NOT ACTIVATED") ? true : false;
            this.accountService.getPassengerTypes().subscribe(pt=>{
              pt.forEach(element1 => {
                if(element1._id == element.passengerType){
                  this.typePassanger = element1.name;
                }
              });
              if((this.typePassanger == "Student" || this.typePassanger == "Pensioner")){
                this.studentOrPensioner = true;
                if(element.image == undefined || element.image == null){
                  this.showImageBool = true;
                  
                }else{
                  this.showImageBool = false;
                }
              } 
            })
          }
          this.user1.UserType = element.userType;

          if(element.image != null && element.image != undefined){
            var c = "data:image/png;base64," +  this.arrayBufferToBase64(element.image.data.data);
              this.listOfImage.push(c);
              this.studentOrPensioner = true;
          }
        }
      });
      this.userForEdit  = this.user1;
    })
  }

  ngOnInit() {
  }

  arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = [].slice.call(new Uint8Array(buffer));
    bytes.forEach((b) => binary += String.fromCharCode(b));
    return window.btoa(binary);
};

  getRole(): string { 
    return localStorage.role;
  }


  onSubmit(userForEdit: RegistrationModel, form: NgForm){
      //let fdd1 = new FormData();
      this.fdd = new FormData();
      this.fdd.append('Name', userForEdit.Name);
      this.fdd.append('LastName', userForEdit.LastName);
      this.fdd.append('City', userForEdit.City);
      this.fdd.append('Number', userForEdit.Number);
      this.fdd.append('Street', userForEdit.Street);
      this.fdd.append('Email', userForEdit.Email);
      this.fdd.append('Birthaday', userForEdit.Birthaday.toString());
      this.fdd.append('OldEmail', localStorage.getItem('name').toString());
      this.fdd.append('Id', this.idKorisnika); 
    
    
      this.authenticationService.edit(this.fdd).subscribe(d=>{
        alert(d.message);
        localStorage.setItem('name', userForEdit.Email);
        this.refresh();
      },err=>{
        window.alert(err.error.message);
        //this.refresh();
      })
  }

  onSubmitPassword(pomModelForPassword: PomModelForPassword, form:NgForm){
      this.fdd = new FormData();
      this.fdd.append('id', this.idKorisnika);
      this.fdd.append('oldPassword', pomModelForPassword.OldPassword);
      this.fdd.append('newPassword', pomModelForPassword.NewPassword);
      this.fdd.append('confirmPassword', pomModelForPassword.ConfirmPassword);

     // let errorss = [];

      this.authenticationService.editPassword(this.fdd).subscribe(x=>{
        alert(x.message);
        this.refresh();
      }, 
      err=> {
        window.alert(err.error.message);
      });
  }

  isSelectedPassword(): boolean{
    if(this.selected == 'Password'){
      return true;
    }
  }

  isSelectedEdit(): boolean{
    if(this.selected == 'Edit'){
      return true;
    }
  }

  showEdit(){
    console.log("User:", this.user)
    this.selected = "Edit";
    this.ClickedButtonEdit = true;

    this.userForEdit = this.user1;
    this.kk = this.user1.Birthaday.toString().split('Z')[0];
    this.userForEdit.BirthdayForEdit = new Date(this.kk).toISOString().split('T')[0];
  }

  showPassword(){
    this.selected = "Password";
  }

  showImage(event){
    this.selectedImage = event.target.files;
    this.showApplyButton = true;
  }

  ApplyImage(){
    // this.fdd = new FormData();
    this.fdd.append('Name', this.userForEdit.Name);
    this.fdd.append('LastName', this.userForEdit.LastName);
    this.fdd.append('City', this.userForEdit.City);
    this.fdd.append('Number', this.userForEdit.Number);
    this.fdd.append('Street', this.userForEdit.Street);
    this.fdd.append('Email', this.userForEdit.Email);
    this.fdd.append('Birthaday', this.userForEdit.Birthaday.toString());
    this.fdd.append('Id', this.idKorisnika);
    this.fdd.append('OldEmail', localStorage.getItem('name').toString());
     

    if(this.selectedImage != undefined && this.selectedImage != null){
      this.fdd.append('file', this.selectedImage);
    }
  
      this.authenticationService.edit(this.fdd).subscribe(d=>{
        alert(d.message);
        localStorage.setItem('name', this.userForEdit.Email);
        //window.location.reload();
        this.refresh();
      },err=>{
        window.alert(err.error.message); 
        //this.refresh();
      })
    
  }

  onFileSelected(event){
    this.selectedImage = event.target.files[0];
    
      this.showApplyButton = true;
  }

  refresh(){
    this.selected = "";
    this.showApplyButton = false;
        this.fdd = new FormData();
        this.mejlZaShow = localStorage.getItem('name').toString();
           this.accountService.getUserData(localStorage.getItem('name')).subscribe(data=>{
            this.user = data;
            
            this.user.forEach(element => {
              if(element){
                this.user1.Id = element._id;
                this.idKorisnika = element._id.toString();
                this.fdd.append('Id', element._id.toString());
                this.user1.Birthaday = element.birthday;
                this.rodjendan = element.birthday.toString().split('T')[0];
                this.user1.Name = element.name;
                this.user1.LastName = element.lastName;
                this.user1.City = element.city;
                this.user1.Number = element.number;
                this.user1.Street = element.street;
                this.user1.Email = element.email;
      
                if(element.userType != "AppUser"){
                  this.typePassanger = element.userType;
                }else{
                  this.accountService.getPassengerTypes().subscribe(pt=>{
                    pt.forEach(element1 => {
                      if(element1._id == element.passengerType){
                        this.typePassanger = element1.name;
                      }
                    });
                    if((this.typePassanger == "Student" || this.typePassanger == "Pensioner")){
                      this.studentOrPensioner = true;
                      if(element.image == undefined || element.image == null){
                        this.showImageBool = true;
                        
                      }else{
                        this.showImageBool = false;
                      }
                    } 
                  })
                }
                this.user1.UserType = element.userType;
      
                if(element.image != null && element.image != undefined){
                  this.listOfImage = [];
                  var c = "data:image/png;base64," +  this.arrayBufferToBase64(element.image.data.data);
                    this.listOfImage.push(c);
                    this.studentOrPensioner = true;
                }
              }
            });
            this.userForEdit  = this.user1;
            //console.log("KOnacnooo: ", this.userForEdit);
      
          })
  
  }
}
