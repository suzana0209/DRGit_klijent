import { Component, OnInit } from '@angular/core';
import { PomModelForAuthorization } from 'src/app/models/pomModelForAuth.model';
import { VerificationService } from 'src/app/services/verificationService/verification.service';
import { UsersService } from 'src/app/services/users/users.service';
import { AccountService } from 'src/app/services/account/account.service';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})

export class RequestsComponent implements OnInit {
   user: any;
  awaitingAdmins:any = [];
  awaitingControllers:any = [];
  awaitingAppUsers:any = [];

  modelHelp: PomModelForAuthorization = new PomModelForAuthorization("");
  
  userBytesImages:any = [];
  imagesLoaded:boolean = false
  wtfList:any = []

  pomBool: boolean = false;
  denyAdmin: boolean = false;
  fd: FormData = new FormData();
  userPom: any;
  aktivan: boolean = false;
  naCekanju: boolean = false;
  odbijen: boolean = false;

  constructor(private verifyService: VerificationService,private usersService: UsersService, 
    private accountService: AccountService){
      this.accountService.getUserData(localStorage.getItem('name')).subscribe(data => {

        this.userPom = data;
      this.userPom.forEach(element => {
        if(element.activated == "DENIED"){
          this.odbijen = true;
        }
        else if(element.activated == "PENDING"){
          this.naCekanju = true;
        }
        else if(element.activated == "ACTIVATED"){
          this.aktivan = true;
        }
      });

        this.fd = new FormData();
        this.user = data;    
        console.log("Adminnnn: ", this.user);
        //this.denyAdmin = this.user.Deny;    

        verifyService.getAwaitingAdmins().subscribe(data => {
        this.awaitingAdmins = data;
        console.log("Aw admin: ", this.awaitingAdmins);
        
        verifyService.getAwaitingControllers().subscribe(data => {
          this.awaitingControllers = data;

        verifyService.getAwaitingAppUsers().subscribe(data=>{
          this.awaitingAppUsers = data;

          if(this.awaitingAppUsers){
            this.imagesLoaded = true;
          }

          this.awaitingAppUsers.forEach(element => {
            var c = "data:image/png;base64," +  this.arrayBufferToBase64(element.image.data.data);
            this.wtfList.push(c)
          });

            })  
          });
        })

        

    });
  }
      
    ngOnInit() {}

    arrayBufferToBase64(buffer) {
      var binary = '';
      var bytes = [].slice.call(new Uint8Array(buffer));
      bytes.forEach((b) => binary += String.fromCharCode(b));
      return window.btoa(binary);
  };
  
      
    AuthorizeAdmins(id, i) {
      //this.modelHelp.Id = id;
      this.fd.append('id', id);
      this.verifyService.authorizeAdmin(this.fd).subscribe(resp => {
          alert("Admin has been authorized!");
          this.awaitingAdmins.splice(i,1);
      }, 
      err=>{
        window.alert(err.error.message);
      })
    }
    AuthorizeControllers(id, i) { 
      //this.modelHelp.Id = id;
      this.fd.append('id', id);
      this.verifyService.authorizeController(this.fd).subscribe(resp => {
          alert("Controller has been authorized!");
          this.awaitingControllers.splice(i,1);
      },
      err=>{
        window.alert(err.error.message);
      })
    }
  
    AuthorizeAppUsers(id, i){
      //this.modelHelp.Id = id;
      this.fd.append('id', id);
      this.verifyService.authorizeAppUser(this.fd).subscribe(resp => {
          alert("AppUser has been authorized!");
          this.awaitingAppUsers.splice(i,1);
      },
      err=>{
        window.alert(err.error.message);
      })
    } 
  
    DenyAppUsers(id, i){
      //this.modelHelp.Id = id;
      this.fd.append('id', id);
      this.fd = new FormData();
      this.fd.append('id', id);
      this.verifyService.denyAppUser(this.fd).subscribe(resp => {
        //if(resp == "Ok")  {
          alert("AppUser has been denied!");
          this.awaitingAppUsers.splice(i,1);
        // }
        //   else alert("Something went wrong");
      },
      err=>{
        window.alert(err.error.message);
      })
    }
  
    DenyAdmin(id, i){
     // this.modelHelp.Id = id;
     this.fd = new FormData();
     this.fd.append('id', id);
      this.verifyService.denyAdmin(this.fd).subscribe(resp => {
          alert("Admin has been denied!");
          this.awaitingAdmins.splice(i,1);
        
      },
      err=>{
        window.alert(err.error.message);
      })
    }
  
    DenyControllers(id, i){
      //this.modelHelp.Id = id;
      this.fd.append('id', id);
      this.verifyService.denyController(this.fd).subscribe(resp => {
        alert("Controller has been denied!");
          this.awaitingControllers.splice(i,1);
      },
      err=>{
        window.alert(err.error.message);
      })
    }
        
  LoggedAdmin(): boolean{
    if(localStorage.getItem('role') == "Admin" && this.aktivan){
      return true;
    }
    return false;
  }

  NonActiveAdmin(){
    if(localStorage.getItem('role') == "Admin" && this.naCekanju){
      return true;
    }
    return false;
  }

  DeniedAdmin(){
    if(localStorage.getItem('role') == "Admin" && this.odbijen){
      return true;
    }
  }
      
}
      
