import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authen/authentication-service.service';
import { UsersService } from 'src/app/services/users/users.service';
import { BuyTicketService } from 'src/app/services/buyTicketService/buy-ticket.service';
import { PomModelForBuyTicket, PomModelForAddTicketPayPal } from 'src/app/models/pomModelForBuyTicket.model';
import { Router } from '@angular/router';
import { PricelistService } from 'src/app/services/pricelistService/pricelist.service';
import { PomModelForAuthorization } from 'src/app/models/pomModelForAuth.model';
import { ValidForBuyTicketModel } from 'src/app/models/modelsForValidation/validForBuyTicket.model';
import { IPayPalConfig, ICreateOrderRequest  } from 'ngx-paypal';
import { PayPalModel } from 'src/app/models/payPal.model';
import { PayPalModelService } from 'src/app/services/payPalService/pay-pal-model.service';
import { AccountService } from 'src/app/services/account/account.service';


@Component({
  selector: 'app-buy-ticket',
  templateUrl: './buy-ticket.component.html',
  styleUrls: ['./buy-ticket.component.css']
})
export class BuyTicketComponent implements OnInit {
  public payPalConfig?: IPayPalConfig;
  loggedUser: any;
  emailLoggedUser: string = ""
  price: number = 0;
  bool: boolean = false;
  denyOfLoggedUser: boolean = false;
  listOfBuyingTicket: any = []
  pomModelForPrintTicket: PomModelForAuthorization = new PomModelForAuthorization("");
  idLoggUser: string = "";
  ticketForPrintOnHtml: any = []
  tipKarte: string[] = []
  validations: ValidForBuyTicketModel = new ValidForBuyTicketModel();
  priceWDiscount: number;
  roleForPayPal: string = "";
  mailForPayPal: string = "";
  buyTicketForm1: PomModelForBuyTicket = new PomModelForBuyTicket("", "");
  buyTicketForm1ForPrice: PomModelForBuyTicket = new PomModelForBuyTicket("", "");
  doublee: string = "3.14";
  nekiTest: number = 0;
  showButtonComplete: boolean = false;
  fd: FormData = new FormData();

  mailPayPalUnregisterUser: string = "";
  payPalModel1: PayPalModel = new PayPalModel("", "", "", "", "", "", "", 0);
  dataFromPaypalService: any;
  povratnaVrijednostPayPal: number = 0;
  pomZaKupovinuKarte: PomModelForAddTicketPayPal = new PomModelForAddTicketPayPal(new PomModelForBuyTicket("",""), 0);

  loggedUser1: any;
  dateOfPurchase: Date;
  typeOfTicketForDb: string = ""
  idOfPricelist = "";
  listaVaznosti: string[] = []
  userPom: any;
  aktivan: boolean = false;
  naCekanju: boolean = false;
  odbijen: boolean = false;
  dugmeComplete: boolean = true;
  dugmePayPal: boolean = false;
  neAktivan: boolean = false;

  constructor(private authService: AuthenticationService, private usersService: UsersService,
    private buyTicketService: BuyTicketService,
    private router: Router,
    private priceServie: PricelistService, private payPalModelService: PayPalModelService, private accountService: AccountService) { 
      accountService.getUserData(localStorage.getItem('name')).subscribe(dd=>{
        this.userPom = dd;
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
          else if(element.activated == "NOT ACTIVATED"){
            this.neAktivan = true;
          }
        });
      })
      this.showButtonComplete = true;
       this.roleForPayPal =  localStorage.getItem('role');
       this.mailForPayPal = localStorage.getItem('name');
      console.log("cc", localStorage.getItem('name'));

      this.priceServie.getPricelist().subscribe(dataa=>{
        //dataa.forEach(element => { 
          this.idOfPricelist = dataa._id;
          console.log("IDDD", this.idOfPricelist) 
        //}); 
      })
 
    if(localStorage.getItem('name') != null){
    this.accountService.getUserData(localStorage.getItem('name')).subscribe(d=>{
      this.loggedUser1 = d;
      // this.denyOfLoggedUser = this.loggedUser.Deny;

      // console.log("Deny of loggedUser: ", this.denyOfLoggedUser);
      this.loggedUser1.forEach(element => {
        this.emailLoggedUser = element.email;
        this.idLoggUser = element._id;
        this.loggedUser = element;
      });

      this.fd = new FormData();
      this.fd.append('idd', this.idLoggUser);
      this.buyTicketService.getTicketWithCurrentAppUser(this.fd).subscribe(d=>{
        this.listOfBuyingTicket = d;
        this.listOfBuyingTicket.forEach(element => {
          //this.validateTicket(element._id)
          // element.purchaseTime = new Date(element.purchaseTime);
        });
        console.log("Buying ticket: ", this.listOfBuyingTicket); 
      })  

      //this.emailLoggedUser = this.loggedUser.Email
      //this.idLoggUser = this.loggedUser.Id;
      console.log("Ulogovani korisnik: ", this.loggedUser) 
      console.log("IDD log", this.idLoggUser)

      this.priceServie.getPricelist().subscribe(dataa=>{
        //dataa.forEach(element => { 
          this.idOfPricelist = dataa._id;
          console.log("IDDD", this.idOfPricelist)
        //});
      })

    //  this.priceServie.getPricelist().subscribe(dataa=>{
    //    //dataa.forEach(element => {
    //      this.idOfPricelist = dataa._id;
    //      console.log("IDDD", this.idOfPricelist)
    //    //});
    //  })

      //TREBAAA!!!
      
      //   this.tipKarte.push("");
      //   this.tipKarte.push("Hourly");
      //   this.tipKarte.push("Daily");
      //   this.tipKarte.push("Monthly");
      //   this.tipKarte.push("Yearly");
        
      //   this.ticketForPrint();
      
      // })
      if(localStorage.getItem('role') == "AppUser"){
        if(this.loggedUser.activated == "ACTIVATED"){      
          this.bool =  true;
        } 
      }
    })
  }
  }
  ngOnInit() {
    
  }

 
  onSubmit(buyTicketForm: PomModelForBuyTicket, form: NgForm){
    //this.showButtonComplete = false;  //za dugme Complete shopping
    console.log("Karta: ", buyTicketForm);

    this.mailPayPalUnregisterUser = buyTicketForm.Email;  //potrebno za neregistrovanog korisnika pri upisu u bazu
    this.typeOfTicketForDb = buyTicketForm.TypeOfTicket;
    this.dateOfPurchase = new Date();
    console.log("Email from Local storage: ", this.emailLoggedUser);
    let rola =  localStorage.getItem('role');
    let mail = localStorage.getItem('name');
    this.buyTicketForm1 = buyTicketForm;
    if(rola == "AppUser"){
      // if(this.validations.validateForTypeTicket(buyTicketForm.TypeOfTicket)){
      //   return;
      // } 
      this.dugmeComplete = false;
      this.buyTicketForm1 = buyTicketForm;
      console.log("1111", this.buyTicketForm1);

      this.buyTicketForm1.Email = localStorage.getItem('name')
      this.buyTicketForm1.PurchaseDate = new Date();
      this.dateOfPurchase = new Date();
      //console.log("Trenutno vreme", this.buyTicketForm1.PurchaseDate)
      
      console.log("Trenutno vreme", this.dateOfPurchase)
   
    }
    this.initConfig();
  }

  nonRegister(){
    if(localStorage.getItem('name') == null)
      return true;
    else {
      return false;
    }
      
  }
  nonActivated(): boolean{
    //console.log("Logged user in nonActivated: ", this.loggedUser);
      return this.bool;    
  }
 
  ticketForPrint(){
    this.listOfBuyingTicket.forEach(element => {
      let pomString = element.PurchaseDate.toString().split('T');
      element.PurchaseDate = pomString[0] + " " + pomString[1];
      element.TypeOfTicket = element.TypeOfTicket;
    });
  }

  private initConfig(): void {
    this.dugmePayPal = true;
    this.showButtonComplete = false;
    this.dugmeComplete = false;
    
    var diffDays;
    var mejl = "";
    var tipKarte = "";
    var tipKor = "";

    let rr = localStorage.getItem('name');
    if(rr){
      this.fd.append('typeOfTicket',this.buyTicketForm1.TypeOfTicket);
      this.fd.append('email',this.buyTicketForm1.Email);
      this.fd.append('date',this.dateOfPurchase.toString());
      mejl = this.buyTicketForm1.Email;
      tipKarte = this.buyTicketForm1.TypeOfTicket;
    }
    else{
      this.fd.append('typeOfTicket',"Hourly");
      this.fd.append('email',this.mailPayPalUnregisterUser);
      this.fd.append('date',this.dateOfPurchase.toString());

      mejl = this.mailPayPalUnregisterUser;
      tipKarte = "Hourly";
      tipKor = "NEREGISTROVANI";
    
    }
    
    //this.buyTicketForm1ForPrice.TypeOfTicket, this.buyTicketForm1ForPrice.Email
    this.buyTicketService.priceForPaypal(tipKarte, mejl, "NEREGISTROVANI").subscribe(s=>{
      console.log("SSSSSS", s);
      if(s == "null"){
        
        alert("There is not active pricelist!");
        this.showButtonComplete = true;
        //this.dugmeComplete = false;
        window.location.reload(); 
      }
      else{
        diffDays = parseFloat(s.toString());
        console.log("Diffday", diffDays)
      }
       
    diffDays = diffDays/118;
    var str = diffDays.toFixed(2);
    console.log("Str: ", str);
    this.payPalConfig = {
      currency: 'EUR',
      clientId: 'sb',
      createOrderOnClient: (data) => <ICreateOrderRequest> {
          intent: 'CAPTURE',
          purchase_units: [{
              amount: {
                  currency_code: 'EUR',
                  value: str,
                  breakdown: {
                      item_total: {
                          currency_code: 'EUR',
                          value: str
                      }
                  }
              },
              items: [{
                  name: 'Enterprise Subscription',
                  quantity: '1',
                  category: 'DIGITAL_GOODS',
                  unit_amount: {
                      currency_code: 'EUR',
                      value: str,
                  },
              }]
          }]
      },
      advanced: {
          commit: 'true'
      },
      style: {
          label: 'paypal',
          layout: 'horizontal',
          size:  'medium',
          shape: 'pill',
          color:  'gold' 
      },
      onApprove: (data, actions) => {
          console.log('onApprove - transaction was approved, but not authorized', data, actions);
      },
      onClientAuthorization: (data) => {
          console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);

          this.dataFromPaypalService = data;
          //this.dugmeComplete = (this.dataFromPaypalService != null) ? false : true;       
         

          this.fd = new FormData();

          this.fd.append('pricelistId', this.idOfPricelist);
          this.fd.append('payerEmail', this.dataFromPaypalService.payer.email_address);
          this.fd.append('payerName',this.dataFromPaypalService.payer.name.given_name);
          this.fd.append('payerSurname', this.dataFromPaypalService.payer.name.surname);
          this.fd.append('status', this.dataFromPaypalService.status);
          this.fd.append('createTime', this.dataFromPaypalService.create_time);
          this.fd.append('paymentId', this.dataFromPaypalService.id);
          this.fd.append('value', this.dataFromPaypalService.purchase_units[0].amount.value);
          this.fd.append('currencyCode', this.dataFromPaypalService.purchase_units[0].amount.currency_code);

          this.fd.append('dateOfPurchase', this.dateOfPurchase.toString());
          this.povratnaVrijednostPayPal = this.dataFromPaypalService.id;

          let ppp = localStorage.getItem('name');
          if(ppp != null && ppp != ""){
            this.fd.append('email', ppp);
            this.fd.append('typeOfTicket', this.typeOfTicketForDb);
            this.fd.append('nereg', "");
          }
          else{
            this.fd.append('email', this.mailPayPalUnregisterUser);
            this.fd.append('typeOfTicket', "Hourly");
            this.fd.append('nereg', "NEREGISTROVANI");
            //this.fd.append('dateOfPurchase', this.dateOfPurchase.toString()); 
         
          }
    
          
          this.buyTicketService.postPayPalModel(this.fd).subscribe(ddd=>{
            window.alert(ddd.message);
            window.location.reload();
            this.refreshPage();
         
         }, 
         err=>{
           window.alert(err.error.message);
         })
           
      },
      onCancel: (data, actions) => {
          console.log('OnCancel', data, actions);
         // this.showCancel = true;
      },
      onError: err => {
        window.alert("Something went wrong!");
          console.log('OnError', err);
          //this.showError = true;
      },
      onClick: (data, actions) => {
          console.log('onClick', data, actions);
      },
  };
},
err=>{
  window.alert(err.error.message);
}) 
}
 

validateTicket(idTicket){
  this.buyTicketService.validateTicket(idTicket).subscribe(aa=>{
    if(aa.message.toString().includes("is valid")){
      this.listaVaznosti.push("Yes");
    }
    else{
      this.listaVaznosti.push("No");
    }
  })
}

showDate(datum){
  let datum1 = new Date(datum);
  //datum1.setHours(datum1.getHours()+2);
  //Tue Sep 03 2019 01:09:52
  let ret = datum1.toString().split('GMT')[0].split(' ');
  let pomm = ret[2]+"-"+ret[1]+"-"+ret[3]+" "+ret[4];

  return pomm;
}

LoggedUser(): boolean{
  if(localStorage.getItem('role') == "AppUser" && this.aktivan){
    return true;
  }
  return false;
}

NonActiveUser(){
  if(localStorage.getItem('role') == "AppUser" && (this.naCekanju || this.neAktivan)){
    return true;
  }
  return false;
}

DeniedUser(){
  if(localStorage.getItem('role') == "AppUser" && this.odbijen){
    return true;
  }
}


refreshPage(){
  this.dugmeComplete = true;
  this.dugmePayPal = false;
  this.accountService.getUserData(localStorage.getItem('name')).subscribe(dd=>{
    this.userPom = dd;
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
  })

  this.roleForPayPal =  localStorage.getItem('role');
  this.mailForPayPal = localStorage.getItem('name');

  this.mailPayPalUnregisterUser = "";

    this.typeOfTicketForDb = "";
    this.dateOfPurchase = null;
    this.dataFromPaypalService = null;
    this.buyTicketForm1 = null;
   
    this.fd = new FormData();
    this.fd.append('idd', this.idLoggUser);
    this.buyTicketService.getTicketWithCurrentAppUser(this.fd).subscribe(d=>{
      this.listOfBuyingTicket = d; 
    }) 
    
    this.priceServie.getPricelist().subscribe(dataa=>{
      //dataa.forEach(element => { 
        this.idOfPricelist = dataa._id;
        console.log("IDDD", this.idOfPricelist)
      //});
    })

}

}