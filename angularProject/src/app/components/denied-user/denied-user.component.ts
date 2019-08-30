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
  

  constructor(private verifyService: VerificationService, private userService: UsersService, private accountService: AccountService) {
    this.fd = new FormData();
    accountService.getUserData(localStorage.getItem('name')).subscribe(data=>{
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

  
  loggedAdmin(): boolean{
    if(localStorage.getItem('role') == "Admin"){
      return true;
    }
    else{
      return false;
    }
  }

}
