import { Component, OnInit } from '@angular/core';
import { VerificationService } from 'src/app/services/verificationService/verification.service';
import { UsersService } from 'src/app/services/users/users.service';
import { PomModelForAuthorization } from 'src/app/models/pomModelForAuth.model';
import { AccountService } from 'src/app/services/account/account.service';

@Component({
  selector: 'app-denied-user',
  templateUrl: './denied-user.component.html',
  styleUrls: ['./denied-user.component.css']
})

export class DeniedUserComponent implements OnInit {

  deniedUsers: any = [];
  user: any;
  denyAdmin: boolean = false;
  modelHelp: PomModelForAuthorization = new PomModelForAuthorization("");
  fd: FormData = new FormData();

  aktivan: boolean = false;
  odbijen: boolean = false;
  naCekanju: boolean = false;
  userPom:any;
  

  constructor(private verifyService: VerificationService, private userService: UsersService, private accountService: AccountService) {
    this.fd = new FormData();
    accountService.getUserData(localStorage.getItem('name')).subscribe(data=>{
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
      
      
      this.user = data;
      this.denyAdmin = this.user.Deny;

      verifyService.getDeniedUsers().subscribe(a=>{
        this.deniedUsers = a;
        console.log("Denied: ", this.deniedUsers);
      })
    })
    
   

   }

  ngOnInit() {
  }

  AuthorizeDeniedUser(id, i) {
    //this.modelHelp.Id = id;
    this.fd = new FormData();
    this.fd.append('id', id);
    this.verifyService.authorizeDeniedUser(this.fd).subscribe(resp => {
      //if(resp == "Ok")  {
        alert("Users has been authorized!");
        this.deniedUsers.splice(i,1);
     
    },
    err=>{
      window.alert(err.error.message);
      
    })
  }

  
  // loggedAdmin(): boolean{
  //   if(localStorage.getItem('role') == "Admin"){
  //     return true;
  //   }
  //   else{
  //     return false;
  //   }
  // }

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
