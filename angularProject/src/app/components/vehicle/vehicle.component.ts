import { Component, OnInit } from '@angular/core';
import { VehicleService } from 'src/app/services/vehicleService/vehicle.service';
import { LineService } from 'src/app/services/lineService/line.service';
import { VehicleModel } from 'src/app/models/vehicle.model';
import { NgForm } from '@angular/forms';
import { AccountService } from 'src/app/services/account/account.service';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.css']
})
export class VehicleComponent implements OnInit {

  selected: string = ""
  RegistrationNumber: string =  ""
  lines: any = [];
  linesWithoutVehicle: any = [];
  vehicles: any = [];
  timetables: any = [];
  idVehicleForDelete: string = "";
  idVehicleForEdit: number;

  vehicleForEdit: any;
  availableVehicles: any = []
  userPom: any;
  odbijen: boolean = false;
  aktivan: boolean = false;
  naCekanju: boolean = false;


  constructor(private vehicleService: VehicleService, private lineService: LineService, private accountService: AccountService) { 
    this.availableVehicles = [];
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
      });
    })    
    this.vehicleService.getAllVehicle().subscribe(d=>{
      this.vehicles = d; 
      console.log("All vehicels: ", this.vehicles);
      
      this.vehicles.forEach(element => {
        if(element.timetables.length == 0 || element.timetables == undefined){
          this.availableVehicles.push(element); 
        }
      });

    })
  }

  ngOnInit() {
  }

  onSubmit(vehicleData: VehicleModel, form:NgForm){
    
    this.vehicleService.addVehicle(vehicleData).subscribe(data => {     
      console.log(data); 
      //alert("Successfully added vehicle")
      window.alert(data.message)
      //window.location.reload();
      this.refresh();
    },
    err=>{
      window.alert(err.error.message);
      //this.refresh();
    });     
  }



  //Samo one koji nemaju timetable u sebi
    deleteVehicle(){
    console.log("Reg number: ", this.idVehicleForDelete);
    this.vehicleService.deleteVehicle(this.idVehicleForDelete).subscribe(d=>{
      window.alert(d.message);
      //alert("Vehicle delete successfull! ");
      //window.location.reload();
      this.refresh();
    },
    err=>{
      window.alert(err.error.message);
      //this.refresh();
    })
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


  refresh(){
    this.selected = "";
    this.idVehicleForDelete = "";

    this.availableVehicles = [];

    this.vehicleService.getAllVehicle().subscribe(data=>{
      this.vehicles = data;

      this.vehicles.forEach(element => {
        if(element.timetables.length == 0 || element.timetables == undefined){
          this.availableVehicles.push(element); 
        }
      });
    })
  }

}
