import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users/users.service';
import { RegistrationModel } from 'src/app/models/registration.model';
import { PomAppUserModel } from 'src/app/models/pomAppUser.model';
import { NgForm } from '@angular/forms';
import { PomModelForPassword } from 'src/app/models/PomModelForPassword.model';
import { Router } from '@angular/router';
import { PomModelForAuthorization } from 'src/app/models/pomModelForAuth.model';
import { ValidForProfileModel, ValidForChangePassModel } from 'src/app/models/modelsForValidation/validForProfile.model';
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
  //userForEdit: PomAppUserModel;
  userForEdit: RegistrationModel = new RegistrationModel("","","","","","","","",new Date(),"","","","");
  
  
  pp = new PomModelForAuthorization("");

  studentOrPensioner = false;

  ClickedButtonEdit: boolean = false;
  addressFromDb: any = []

  idAdressFromDb: number;
  dateForEdit: any = []

  modell: any;

  showImageBool: boolean = false;
  selectedImage: any;

  showApplyButton: boolean = false;

  wtfList: any = [];
  imagesLoaded: boolean = false;
  userBytesImage:any ;
  rodjendan: string = ""

  validations: ValidForProfileModel = new ValidForProfileModel();
  validationsForPass: ValidForChangePassModel = new ValidForChangePassModel();

  typePassanger: string = ""
  kk: string = ""
  idKorisnika: string = ""
  fdd: FormData = new FormData();

  constructor(private usersService: UsersService, private router:Router, private accountService:AccountService,
    private authenticationService: AuthenticationService) {
      this.fdd = new FormData();
    this.accountService.getUserData(localStorage.getItem('name')).subscribe(data=>{
      this.user = data;
      console.log("Kor za izmjenu: ", this.user);
      //this.modell = data;

     // console.log("User: ", this.user);

     // this.usersService.getAdressInfo(this.user.AddressId).subscribe(d=>{
        //this.addressFromDb = d;
        // this.user.City = this.user.city;
        // this.user.Street = this.user.street;
        // this.user.Number = this.user.number;

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
            //this.user1.PassangerType = element.passengerType;

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
              var c = "data:image/png;base64," +  this.arrayBufferToBase64(element.image.data.data);
                this.wtfList.push(c);
                this.studentOrPensioner = true;
            }

          }

         

        });

        
        

     

      this.userForEdit  = this.user1;
      console.log("KOnacnooo: ", this.userForEdit);

    })

    
    //this.userForEdit = new PomAppUserModel("", "", "", "", "", "", "", "", -1);
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
    console.log("Korisnik za izmjenu: ", this.userForEdit);

      let fdd1 = new FormData();
     // this.fdd.append('Id', userForEdit.Id);
      this.fdd.append('Name', userForEdit.Name);
      this.fdd.append('LastName', userForEdit.LastName);
      this.fdd.append('City', userForEdit.City);
      this.fdd.append('Number', userForEdit.Number);
      this.fdd.append('Street', userForEdit.Street);
      this.fdd.append('Email', userForEdit.Email);
      this.fdd.append('Birthaday', userForEdit.Birthaday.toString());
    
        this.authenticationService.edit(this.fdd).subscribe(d=>{
    
          alert("User profile successful changed!");
          localStorage.setItem('name', userForEdit.Email);
          window.location.reload();
          //form.reset();
          //this.selected = "";
        },err=>{
          window.alert(err.error.message);
        })
  }


  // onSubmit(userForEdit: PomAppUserModel, form: NgForm){
  //   console.log("Korisnik za izmjenu: ", this.userForEdit);

  //   // this.usersService.getAdressInfo(this.user.AddressId).subscribe(s => {

  //   // })

  //   // console.log("Atresaaa: ", this.addressFromDb)
  //   // userForEdit.AddressId = this.user.AddressId
  //   // userForEdit.Id = this.user.Id

  //   // // if(this.validations.validate(userForEdit)){
  //   // //   return;
  //   // // }
    
  //   // this.usersService.EmailExistForProfile(userForEdit).subscribe(a=>{
  //   //   if(a == "Yes"){
  //   //     alert("New email:"+userForEdit.Email+" alredy exist!");
  //   //     return;
  //   //   }
  //   //   else if (a == "No"){
  //       this.usersService.editAppUser(userForEdit).subscribe(d=>{
    
  //         alert("User profile successful edit!");
  //         localStorage.setItem('name', userForEdit.Email);
  //         window.location.reload();
  //         //form.reset();
  //         //this.selected = "";
  //       })
  //   //   }
  //   // })

  //   // this.usersService.editAppUser(userForEdit).subscribe(d=>{
    
  //   //   alert("Successful edit user!");
  //   //   localStorage.setItem('name', userForEdit.Email);
  //   //   window.location.reload();
  //   // })
  // }

 
  // onSubmit(userForEdit: PomAppUserModel, form: NgForm){
  //   console.log("Korisnik za izmjenu: ", this.userForEdit);

  //   this.usersService.getAdressInfo(this.user.AddressId).subscribe(s => {

  //   })

  //   console.log("Atresaaa: ", this.addressFromDb)
  //   userForEdit.AddressId = this.user.AddressId
  //   userForEdit.Id = this.user.Id

  //   // if(this.validations.validate(userForEdit)){
  //   //   return;
  //   // }
    
  //   this.usersService.EmailExistForProfile(userForEdit).subscribe(a=>{
  //     if(a == "Yes"){
  //       alert("New email:"+userForEdit.Email+" alredy exist!");
  //       return;
  //     }
  //     else if (a == "No"){
  //       this.usersService.editAppUser(userForEdit).subscribe(d=>{
    
  //         alert("User profile successful edit!");
  //         localStorage.setItem('name', userForEdit.Email);
  //         window.location.reload();
  //         //form.reset();
  //         //this.selected = "";
  //       })
  //     }
  //   })

  //   // this.usersService.editAppUser(userForEdit).subscribe(d=>{
    
  //   //   alert("Successful edit user!");
  //   //   localStorage.setItem('name', userForEdit.Email);
  //   //   window.location.reload();
  //   // })
  // }

  

  onSubmitPassword(pomModelForPassword: PomModelForPassword, form:NgForm){
      // if(this.validationsForPass.validations(pomModelForPassword)){
      //   return;
      // }

      this.fdd = new FormData();
      this.fdd.append('id', this.idKorisnika);
      this.fdd.append('oldPassword', pomModelForPassword.OldPassword);
      this.fdd.append('newPassword', pomModelForPassword.NewPassword);
      this.fdd.append('confirmPassword', pomModelForPassword.ConfirmPassword);

      let errorss = [];



      this.authenticationService.editPassword(this.fdd).subscribe(x=>{
        alert("Password successfull changed!");
        window.location.reload();
      }, 
      err=> {
        for(var key in err.error.ModelState){
          for(var i = 0; i < err.error.ModelState[key].length; i++){
            errorss.push(err.error.ModelState[key][i]);
          }
        }
        console.log("ERRRORR: ", errorss);
        window.alert(errorss);
        
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
    this.userForEdit.BirthdayForEdit = new Date(this.kk).toISOString().split('T')[0]
    //this.kk = this.user1.Birthaday.toString().split('T')[0];

    //this.userForEdit.Id = this.user.Id;
    // this.userForEdit.Name = this.user.Name;
    // this.userForEdit.LastName = this.user.LastName;
    // //let newDate = new Date(dateString);
    // this.userForEdit.Birthaday = this.user.Birthaday.split('T')[0];

    // //this.userForEdit.Image = this.user.Image;
    // //this.userForEdit.AddressId = this.user.AddressId;
    // this.userForEdit.Email = this.user.Email;
    // //password se ne podesava

    // this.usersService.getAdressInfo(this.user.AddressId).subscribe(s=>{
    // this.addressFromDb = s;
    // this.userForEdit.City = this.addressFromDb.City;
    // this.userForEdit.Number = this.addressFromDb.Number;
    // this.userForEdit.Street = this.addressFromDb.Street;

    // console.log("Adresaaaa: ", this.addressFromDb);
    // });   
  }

  showPassword(){
    this.selected = "Password";
  }

  showImage(event){
    this.selectedImage = event.target.files;
    
      this.showApplyButton = true;
    
  }

  ApplyImage(){
    this.fdd = new FormData();
    this.fdd.append('Name', this.userForEdit.Name);
    this.fdd.append('LastName', this.userForEdit.LastName);
    this.fdd.append('City', this.userForEdit.City);
    this.fdd.append('Number', this.userForEdit.Number);
    this.fdd.append('Street', this.userForEdit.Street);
    this.fdd.append('Email', this.userForEdit.Email);
    this.fdd.append('Birthaday', this.userForEdit.Birthaday.toString());
    this.fdd.append('Id', this.idKorisnika);

    if(this.selectedImage != undefined && this.selectedImage != null){
      this.fdd.append('file', this.selectedImage);
    }
  
      this.authenticationService.edit(this.fdd).subscribe(d=>{
  
        alert("User document successful changed!");
        localStorage.setItem('name', this.userForEdit.Email);
        window.location.reload();
      },err=>{
        window.alert(err.error.message); 
      })







        // this.userForEdit.Number = this.addressFromDb.Number;
        // this.userForEdit.Street = this.addressFromDb.Street;
    
    //     // console.log("Adresaaaa: ", this.addressFromDb);
    //     if(this.selectedImage == undefined)
    //   alert("No image selected! ");
    // else{
    //   this.usersService.uploadFile(this.selectedImage).subscribe(d=>{
    //     alert("Image upload successful!");
    //     console.log("d", d)
    //     //this.router.navigate(['/busLines']);
    //     window.location.reload();
    //     this.usersService.editAppUser(this.userForEdit).subscribe(dd=>{
    //       //alert("Image upload successful! ");        
    //       // console.log("DDDDDDDDD", d)

    //     })
    //   });
    // }
       // }); 

    
  }

  onFileSelected(event){
    this.selectedImage = event.target.files[0];
    
      this.showApplyButton = true;

    //this.selectedImage = event.target.files;
  }

  getPassType(){

  }
}