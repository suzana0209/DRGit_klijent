import { Component, OnInit } from '@angular/core';
import { TicketPricesPomModel } from 'src/app/models/ticketPrice.model';
import { PricelistService } from 'src/app/services/pricelistService/pricelist.service';
import { PriceListModel } from 'src/app/models/priceList.model';
import { NgForm } from '@angular/forms';
import { PomModelForPriceList } from 'src/app/models/pomModelForPriceList.model';
import { ValidForPriceListModel, ValidForPriceModel, ValidForDateTimeInPriceList } from 'src/app/models/modelsForValidation/validForPriceList.model';
import { UsersService } from 'src/app/services/users/users.service';
import { AccountService } from 'src/app/services/account/account.service';

@Component({
  selector: 'app-price-list',
  templateUrl: './price-list.component.html',
  styleUrls: ['./price-list.component.css']
})
export class PriceListComponent implements OnInit {

  priceList: any;
  ticketPricesPom: TicketPricesPomModel = new TicketPricesPomModel(0,0,0,0,0,new PriceListModel(new Date(),new Date(),0, []));
  datumVazenjaBool: boolean = false;
  validPrices: TicketPricesPomModel = new TicketPricesPomModel(0,0,0,0,0,null);
  //validPrices: TicketPricesPomModel
  validPricesForShow: TicketPricesPomModel = new TicketPricesPomModel(0,0,0,0);

  selectedTicket: string = ""; 
  selectedPassanger: string = "";
  showLabel: boolean = false;

  pomModelForPriceList: PomModelForPriceList = new PomModelForPriceList("", "", "");

  retPrice: any;
  validations: ValidForPriceListModel = new ValidForPriceListModel();
  showPriceInInput:boolean = false;
  validationsForPrice: ValidForPriceModel = new ValidForPriceModel();
  validationsForDate: ValidForDateTimeInPriceList = new ValidForDateTimeInPriceList();
  datePickerId: any;

  priceListModelForCheckDatum: PriceListModel = new PriceListModel(new Date(),new Date(),0, []);
  userPom: any;
  boolBezvezeZaPoruku: boolean = false;
  boolBezvezeZaPorukuDenied: boolean = false;

  typePassanger: string = "";
  messageNoExistPricelist: string = "";
  prviAddPL: boolean = true;
  pomPricelist: any;
  savePriceFromDb: any;
  odbijen: boolean = false;
  aktivan: boolean = false;
  naCekanju: boolean = false;

  constructor( private pricelistServ: PricelistService, private userService: UsersService, private accountService: AccountService) { 
    this.prviAddPL = true;
    
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

    this.datePickerId = new Date().toISOString().split('T')[0];
    this.showPriceInInput = false;

    this.pricelistServ.getPricelist().subscribe(data=>{
      console.log("Podacii: ", data); 
      this.pomPricelist = data;
      this.pricelistServ.getTicketPrices(this.pomPricelist.ticketPrices).subscribe(aa=>{
        console.log("Nestooo: ", aa);
        this.savePriceFromDb = aa;
        this.validPricesForShow = new TicketPricesPomModel(this.savePriceFromDb[0].hourly, this.savePriceFromDb[0].daily, 
          this.savePriceFromDb[0].monthly, this.savePriceFromDb[0].yearly);
        
      })
    }) 
  }

  ngOnInit() {
  }


  onSubmit(pm: PriceListModel, form: NgForm){
    
    console.log("PM: ", pm);
    
      this.ticketPricesPom.PriceList = pm;
      this.pricelistServ.addPricelist(this.ticketPricesPom).subscribe( x =>{
        //alert("Succ add!");
        window.alert(x.message);
        window.location.reload();
    
    },err => {
      //alert("Station - error!");
      window.alert(err.error.message);  
    });

  }



  onSubmit1(pm: TicketPricesPomModel, form: NgForm){
    
    this.ticketPricesPom = pm;
    this.datumVazenjaBool = true;
    // this.pricelistServ.addTicketPrices(pm).subscribe();
  }

  nonRegisterUser(): boolean{
    if(localStorage.getItem('role') == null){
      return true;
    }
    else{
      return false;
    }
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

  getSelectedTicket(event){
    if(event.target.value == "Hourly" || 
      event.target.value == "Daily" ||
      event.target.value == "Monthly" || 
      event.target.value == "Yearly"){
      this.selectedTicket = event.target.value;
    }
  }

  getSelectedPassanger(event){
    if(event.target.value == "Student" || 
      event.target.value == "Pensioner" ||
      event.target.value == "Regular" ){
        this.selectedPassanger = event.target.value;
    }
  }

  calculatePrice(){
    this.pomModelForPriceList.PassangerType = this.selectedPassanger;
    this.pomModelForPriceList.TypeOfTicket = this.selectedTicket;
    this.pomModelForPriceList.PriceListId = this.pomPricelist._id;


    let fd = new FormData();
    fd.append('PassengerType', this.selectedPassanger);
    fd.append('SelectedTicket', this.selectedTicket);
    fd.append('IdOfPriceList', this.pomPricelist._id);

    this.pricelistServ.calculatePrice(fd).subscribe(d=>{
      this.retPrice = d.toFixed(2);
      this.showLabel = true;
      console.log("Ret: ", this.retPrice); 
      
    },
    err=>{
      window.alert(err.error.message);
    });
  } 
  
  editPricelistClick(){
    this.showPriceInInput = true;
    this.prviAddPL = false;
  }

  checkIsAuthorized(){
    if(this.LoggedAdmin()){
      
      this.accountService.getUserData(localStorage.getItem('name')).subscribe(a=>{
        console.log("Userrr: ", a);
        this.userPom = a;
        console.log(this.userPom);
        if(this.userPom.activated == "ACTIVATED"){
          return true;
        }
        else {
          return false;
        }
      })
      
    }
    return false;
  }


}
