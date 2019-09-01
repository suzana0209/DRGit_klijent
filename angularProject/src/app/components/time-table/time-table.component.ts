import { Component, OnInit } from '@angular/core';
import { LineService } from 'src/app/services/lineService/line.service';
import { TimetableModel, TimetableModel2, TimetableModel3, TimetableModel4 } from 'src/app/models/timetable.model';
import { NgForm } from '@angular/forms';
import { TimetableService } from 'src/app/services/timetableService/timetable.service';

import { DayService } from 'src/app/services/dayService/day.service';
import { Router } from '@angular/router';
import { ValidTimetableModel } from 'src/app/models/validTimetable.model';
import { ValidForTimetableModel, ValidForTimetableDeleteModel, ValidForTimetableEditModel, ValidForNewDepModel } from 'src/app/models/modelsForValidation/validForTimetable.model';
import { UsersService } from 'src/app/services/users/users.service';
import { VehicleService } from 'src/app/services/vehicleService/vehicle.service';
import { AccountService } from 'src/app/services/account/account.service';

@Component({
  selector: 'app-time-table',
  templateUrl: './time-table.component.html',
  styleUrls: ['./time-table.component.css']
})
export class TimeTableComponent implements OnInit {

  selected: string = "";
  allLinesFromDb: any = []
  allTimetablesFromDb: any = [];
  allDaysFromDb: any = []
  //tt: TimetableModel2;

  dayId: string = "";
  lineId: string = "";
  timetableId: string = "";

  allLinesFromTimetable: any = [];

  allLT: any = [];
  comboBoxLineForEdit: any = []
  comboBoxDayForEdit: any = []

  selectedDayForEdit: any;

  allLineForSelDay: any = []

  allLineForSelectedDays: any = []

  idLinesArray: any[] = []
  showLineComboBox: boolean = false;
  showDepartureComboBox: boolean = false;

  allDeparturesForSelect: string[] = []

  departuresForEditInput: string = ""
  showInputTime: boolean = false;

  timetableIdForSend: string = ""

  clickedDeleteTime: boolean = false;
  boolForButton: boolean = false;
  editSubmitBool: boolean = false;

  hiddenDeleteButton: boolean = false;
  hiddenEditButton: boolean = false;

   selectedDayFromCb: string = "";
   selectedLineFromCb: string = ""

   showLineCbForUnlogedUser: boolean = false;
   izabranaLinija: string = "";

   pom: string = ""
   polasci: any = []
   showDepForUnregisterUser: boolean = false;
   messageDontDepartures: string = ""
   fd: FormData = new FormData()
   sviPolasciIzBaze: string = ""

   validations: ValidTimetableModel = new ValidTimetableModel();
   validationsForAdd: ValidForTimetableModel = new ValidForTimetableModel();
   validationsForDelete: ValidForTimetableDeleteModel = new ValidForTimetableDeleteModel();
   validationsForEdit :ValidForTimetableEditModel = new ValidForTimetableEditModel();

   validForNewD: ValidForNewDepModel = new ValidForNewDepModel();


  boolBezvezeZaPoruku: boolean = false;
  boolBezvezeZaPorukuDenied: boolean = false;
  userPom: any;

  messageForEmptyLine: string = ""
  arrayForShowDepartures: any = []
  timeForAddTTString: string = "";
  allVehicleFromDb: any = []
  allTimetableFromDb: any = []
  tt: TimetableModel2 = new TimetableModel2("","","","","", "")
  idOfTT: string = ""
  


  constructor(private lineService: LineService, 
              private timetableService: TimetableService, 
              private daysService: DayService, private router:Router,
              private userService: UsersService,
              private vehicleService: VehicleService, private accountService: AccountService) { 

    this.accountService.getUserData(localStorage.getItem('name')).subscribe(a=>{
      
      if(a != null && a != undefined){
        
        this.userPom = a;
        //this.boolBezvezeZaPoruku = this.userPom.Activated;
        //this.boolBezvezeZaPorukuDenied = this.userPom.Deny; 
      }
      
    })
                
    this.lineService.getAllLines().subscribe(d=>{
      this.allLinesFromDb = d;
    });

    this.daysService.getAllDayTypes().subscribe(dt=>{
      this.allDaysFromDb = dt;
      console.log("Danii", this.allDaysFromDb);
    })

    this.vehicleService.getAllVehicle().subscribe(dd=>{
      this.allVehicleFromDb = dd;
      console.log("Vehicle: ", this.allVehicleFromDb);
    })

    // this.timetableService.getAll().subscribe(e =>{
    //   this.allTimetablesFromDb = e; 
      
    // })

    // this.daysService.getAll().subscribe(d1=>{
    //     this.allDaysFromDb = d1;
    // }) 

    this.clickedDeleteTime = false;
    
  }

  ngOnInit() {
  }

  onSubmit(timetableData: TimetableModel, form:NgForm){
    console.log("TimeTable:", timetableData);
    
    this.fd = new FormData();
    var kk: string = "";
    var ss = "update";
    var postoji: boolean = false;
    kk = timetableData.Departures.toString()
    this.timetableService.getAllTimetable().subscribe(dd=>{
        this.allTimetableFromDb = dd;
        console.log("All", this.allTimetableFromDb);
        this.allTimetableFromDb.forEach(element => {
          if(element.dayType == timetableData.DayId && element.line == timetableData.LineId &&
            element.vehicle == timetableData.VehicleId){
              if(element.departures.includes(kk) == 0){ 
                this.idOfTT = element._id; 
                kk = kk +"|"+ element.departures;
              }
              else{ 
                //window.alert("Departures already exist for Line "+element.Line+"!")
                ss = "alreadyExist"
                //window.location.reload();  
              }

              // this.fd.append('lineIdd', timetableData.LineId);
              // this.fd.append('vehicleIdd', timetableData.VehicleId);
              // this.fd.append('dayIdd', timetableData.DayId);
              // this.fd.append('departuresIdd', kk);
              // this.fd.append('tipDodavanjaIdd', "update");
              
              postoji = true;
              
            }
        });

        if(!postoji){
          // this.fd.append('lineIdd', timetableData.LineId);
          // this.fd.append('vehicleIdd', timetableData.VehicleId);
          // this.fd.append('dayIdd', timetableData.DayId);
          // this.fd.append('departuresIdd', kk);
          // this.fd.append('tipDodavanjaIdd', "add");
          ss = "add";
          //this.tt = new TimetableModel2(timetableData.LineId, timetableData.DayId, kk, timetableData.VehicleId, "add");
          this.idOfTT = "";
        }  
        this.tt = new TimetableModel2(timetableData.LineId, timetableData.DayId, kk, timetableData.VehicleId, ss, this.idOfTT);
      
        this.timetableService.addTimetable(this.tt).subscribe(rez=>{
          alert("Timetable successful added!");
          window.location.reload();
        },
        err=>{ 
          window.alert(err.error.message);
        })




    })
    
}

  onSubmitDelete(timetableData: TimetableModel3, form:NgForm){

    // if(this.validationsForDelete.validate(timetableData)){
    //   return;
    // }
    
    // this.allDaysFromDb.forEach(d => {
    //   if(d.Name == timetableData.DayId){
    //     this.dayId = d.Id;
    //   }
    // });


    this.allLinesFromDb.forEach(l => {
      if(l.regularNumber == timetableData.LineId){
        this.lineId = l._id;
        
      }
    });


    this.timetableService.getAllTimetable().subscribe(dd=>{
      this.allTimetablesFromDb = dd;

      this.allTimetablesFromDb.forEach(element => {
        if(element.line == this.lineId && element.dayType == this.dayId){
            this.timetableId = element._id;
        }
    });
    })

   

    this.timetableService.deleteTimetable(this.timetableId).subscribe(data => {
      alert("Timetable  successful deleted!");
      window.location.reload();
    },
    err => {
      window.alert(err.error.message)
    });

  }

  onSubmitEdit(timetableData: TimetableModel4, form:NgForm){
   
    let ttt = new TimetableModel4(this.lineId, this.dayId, this.departuresForEditInput, timetableData.NewDepartures, this.timetableIdForSend);
    let pol = this.sviPolasciIzBaze.toString().replace(this.departuresForEditInput, timetableData.NewDepartures);
    console.log("Pol: ", pol);
                                                                                                //a umjesto tip se stavlja novi polazak koji smo unijeli      
    var ttForEditt = new TimetableModel2(timetableData.LineId, timetableData.DayId, pol, "",timetableData.NewDepartures, this.timetableIdForSend);   //vId i se ne popunjavaju ostaju ""

    if(this.clickedDeleteTime){
      ttForEditt.Departures = timetableData.Departures;
      ttForEditt.TipDodavanja = "";
      this.timetableService.changeTimetable(ttForEditt).subscribe(dd=>{
        alert("Departure successful deleted!");
        window.location.reload(); 
        
      }, 
      err=>{
        window.alert(err.error.message);
      });
    }
    else{
      // if(this.validForNewD.validate(ttt.NewDepartures)){
      //   return;
      // }
      // this.timetableService.AlreadyExistByEdit(ttt).subscribe(a=>{
      //   if(a == "No"){
          this.timetableService.changeTimetable(ttForEditt).subscribe(dd=>{
            alert("Departure successful edit!");
            window.location.reload();
          },
          err=>{
            window.alert(err.error.message);
          });
        //}
        // else if(a == "Yes"){
        //   alert("New departure alredy exist in timetable!");
        //   //window.location.reload();
        // }
      //});
    }
  }

 


  getLineForEdit(event){

    this.showDepartureComboBox = false;
    this.showDepForUnregisterUser = false;
    if(event.target.value != "" || event.target.value != null){
      this.showLineCbForUnlogedUser = true;

      this.showLineComboBox = true;
      this.allLineForSelDay = []
      this.idLinesArray = []
  
      this.dayId = event.target.value;
      this.daysService.getAllDayTypes().subscribe(dd=>{
        dd.forEach(e1 => {
          if(e1._id == this.dayId){
            this.selectedDayForEdit = e1.name;
          }
        });
      })

      this.timetableService.getAllTimetable().subscribe(dd=>{
        this.allTimetableFromDb = dd;
      
  
        this.allTimetableFromDb.forEach(element => {
          if(element.dayType == this.dayId){ 
            this.idLinesArray.push(element.line);
          }
        });

        

    //});
        //Nadjemo nazive svih linija
      this.idLinesArray.forEach(d=>{
        this.allLinesFromDb.forEach(e => {
          if(d == e._id){
            if(!this.allLineForSelDay.includes(e.regularNumber)){
              
              this.allLineForSelDay.push(e.regularNumber);
            } 
          }
        });
      })
    //}
    
    if(this.allLineForSelDay.length != 0){
      this.messageForEmptyLine = "";
    }
    else{
      this.messageForEmptyLine = "There is not Line!";
    }
  })
  }

  }

  getDeparturesForEditt(event){
    this.allDeparturesForSelect = []
    this.showDepForUnregisterUser = false;
    
    console.log("Targetttt", event.target.value);
    if(event.target.value != "" || event.target.value != null || event.target.value.length != 0){
      this.showDepartureComboBox = true;
      this.pom = event.target.value;
     this.allLinesFromDb.forEach(element => {
       if(element.regularNumber == event.target.value){
         this.lineId = element._id;
       }
     });

     this.allTimetableFromDb.forEach(e1 => {
       if(e1.dayType == this.dayId && e1.line == this.lineId){
         this.sviPolasciIzBaze = e1.departures;
         this.allDeparturesForSelect = e1.departures.split("|");
         this.timetableIdForSend = e1._id;
       }
     });
     this.polasci = this.allDeparturesForSelect;
     //this.allDeparturesForSelect.pop();
    }
  }

  setNewDepartures(event){ 
    //this.showInputTime = true;
    if(event.target.value.length != 0){
      this.boolForButton = true;
    }
    else{
      this.messageDontDepartures = "Don't departures for selected line!";
    }
    //this.boolForButton = true;
    this.departuresForEditInput = event.target.value;
    this.hiddenDeleteButton =true;
    this.hiddenEditButton = true;
  }

  editTime(){
    this.clickedDeleteTime = false;

    this.showInputTime = true;
    this.editSubmitBool = true; //prikaz glavnog dugmica
    this.hiddenEditButton = false;

    this.hiddenDeleteButton = false;
  }

  deleteTime(){
    this.clickedDeleteTime = true;
    this.hiddenDeleteButton = false;

    this.editSubmitBool = true;
    this.hiddenEditButton = false;
  }
  
  getLineForEditUnloggedAdmin(event){
    this.selectedDayFromCb = event.target.value;
    if(this.selectedDayFromCb.length != 0){
      this.showLineCbForUnlogedUser = true;
    }
    console.log("Dayssss: ", this.selectedDayFromCb);
  }

  showDepartureOnClick(){
    this.showDepForUnregisterUser = true;
  }


//click
showTimetableForUser(){
  console.log()
}

  showAdd(){
    this.selected = "Add";
  }

  showEdit(){
    this.selected = "Edit";
  }

  showDelete(){
    this.selected = "Delete";
  }

  showTimeT(){
    this.selected = "Show"
  }

  isSelectedAdd(): boolean{
    if(this.selected == 'Add'){
      return true;
    }
  }

  isSelectedEdit(): boolean{
    if(this.selected == 'Edit'){
      return true;
    }
  }

  isSelectedDelete(): boolean{
    if(this.selected == 'Delete'){
      return true;
    }
  }

  isSelectedShow(): boolean{
    if(this.selected == 'Show'){
      return true;
    }
  }

  //&& this.boolBezvezeZaPoruku && !this.boolBezvezeZaPorukuDenied
  LoggedAdmin(): boolean{
    if(localStorage.getItem('role') == "Admin" ){
      return true;
    }
    return false;
  }

  NonActiveAdmin(){
    if(localStorage.getItem('role') == "Admin" && !this.boolBezvezeZaPoruku && !this.boolBezvezeZaPorukuDenied){
      return true;
    }
    return false;
  }

  DeniedAdmin(){
    if(localStorage.getItem('role') == "Admin" && this.boolBezvezeZaPorukuDenied){
      return true;
    }
  }
  //dodato
  addTimeToDepartures(event:any){
    this.timeForAddTTString = event.target.value;
    console.log('dep', this.timeForAddTTString);
    //this.arrayForShowDepartures = [];
  }

  addToArray(){
    let kk = this.arrayForShowDepartures.find(x=> x == this.timeForAddTTString);
    if(kk == undefined){
      this.arrayForShowDepartures.push(this.timeForAddTTString);
    }
    console.log("KK", kk);
  }
}