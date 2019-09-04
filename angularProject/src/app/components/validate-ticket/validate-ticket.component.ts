import { Component, OnInit } from '@angular/core';
import { ValidateTicketService } from 'src/app/services/validateTicketService/validate-ticket.service';
import { VerificationService } from 'src/app/services/verificationService/verification.service';
import { PomModelForAuthorization } from 'src/app/models/pomModelForAuth.model';
import { UsersService } from 'src/app/services/users/users.service';

import { BuyTicketService } from 'src/app/services/buyTicketService/buy-ticket.service';
import { ValidForValidateTicketModel } from 'src/app/models/modelsForValidation/validForValidateTicket.model';
import { AccountService } from 'src/app/services/account/account.service';


@Component({
  selector: 'app-validate-ticket',
  templateUrl: './validate-ticket.component.html',
  styleUrls: ['./validate-ticket.component.css']
})
export class ValidateTicketComponent implements OnInit {

  ticketForV : any;
  ticketExists: string = "";
  ticketMessage: string = "";
  allTT: any ;

  awaitingAppUsers:any = [];
  modelHelp: PomModelForAuthorization = new PomModelForAuthorization("");
  user: any; 

  //wtfList:any = []
  userBytesImages:any = [];
  imagesLoaded:boolean = false

  pomBool: boolean = false;
  nameOfCustomer: string = "";

  nameOfCustomerMessage: string = "";
  denyController: boolean = false;
  validations: ValidForValidateTicketModel = new ValidForValidateTicketModel();
  fd: FormData = new FormData();
  allTicket: any = []
  userPom: any;
  odbijen: boolean = false;
  aktivan: boolean = false;
  naCekanju: boolean = false;

  constructor(private ticketServ: ValidateTicketService, 
    private verifyService: VerificationService,
    private userService: UsersService, private buyTicketService: BuyTicketService, private accountService:AccountService) { 
      this.ticketMessage = "";
      this.nameOfCustomerMessage = "";  
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
  

        this.user = data;    
        this.pomBool = this.user.Activated;
        this.denyController = this.user.Deny;

        //this.emailOfLoggedUser = this.user.Email;
       console.log("Serrrr:", this.user);    
   
    this.ticketServ.getAllTypeOfTicket().subscribe(data => {
      this.allTT = data;
      console.log("ALLLL TTTT: ", this.allTT);
    })
  })
  }

  ngOnInit() {
  }




  CheckTicket(idTicket: any){
    this.ticketMessage = "";
    this.nameOfCustomerMessage = "";
        //let idTicke = idTicket.toString();
    
    if(idTicket == undefined){
      idTicket = "";
    }

    
    var boool;
    var count = 0;
    this.buyTicketService.getAllTicket().subscribe(tt=>{
        this.allTicket = tt;
        console.log("Allll", this.allTicket)
        //boool= false;
        this.allTicket.forEach(element => {
          if(element._id == idTicket){
            boool = true;
            this.buyTicketService.validateTicket(idTicket.toString()).subscribe(data=>{
              // console.log("Poruka: ", data); 
               alert(data.message);
               this.func(idTicket, data.message);
               
             },
             err=>{
               window.alert(err.error.message);
              // window.location.reload();
               this.func(idTicket,"");
               
             })
          }
          else{
            count++;
          }
        });
        if(count == this.allTicket.length){
          window.alert("Ticket doesn't exists!")
        }
    })
 
    

    
  }

  func(idTicket, dateM){
    this.fd = new FormData();
    this.fd.append('idTickett', idTicket);
    this.buyTicketService.getNameOfCustomer(this.fd).subscribe(dd=>{
      this.nameOfCustomer = dd.message;
      console.log("Nameeee", this.nameOfCustomer); 

      //this.nameOfCustomerMessage = this.nameOfCustomer.toString() + " bought the ticket!";
      this.nameOfCustomerMessage = (this.nameOfCustomer.toString() != "unregister") ? this.nameOfCustomer.toString() +  " bought the ticket!" : "Unregister user bought the ticket!" ;
        //((this.nameOfCustomer.toString() == "Nobody") ?  ("")   : " bought the ticket!");
    
        let pom = (dateM.includes("is valid") !== -1);
        this.ticketMessage = "Ticket is ";
        this.ticketMessage =  this.ticketMessage + (((dateM.includes("is valid")) == true) ? "valid" : "not valid. Time is up!");
      //this.ticketMessage = data.toString() + ".";
    })
  } 

  LoggedController(): boolean{
    if(localStorage.getItem('role') == "Controller" && this.aktivan){
      return true;
    }
    return false;
  }

  NonActiveController(){
    if(localStorage.getItem('role') == "Controller" && this.naCekanju){
      return true;
    }
    return false;
  }

  DeniedController(){
    if(localStorage.getItem('role') == "Controller" && this.odbijen){
      return true;
    }
  }

}
