import { Component, OnInit } from '@angular/core';
import { LineModel } from 'src/app/models/line.model';
import { VehicleService } from 'src/app/services/vehicleService/vehicle.service';
import { LineService } from 'src/app/services/lineService/line.service';
import { VehicleModel } from 'src/app/models/vehicle.model';
import { NgForm } from '@angular/forms';

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


  constructor(private vehicleService: VehicleService, private lineService: LineService) {     
    // vehicleService.getLinesForVehicle().subscribe(xx =>{
    //   this.linesWithoutVehicle = xx;
    //   vehicleService.getTimetablesForVehicle().subscribe(x =>{
    //     this.timetables = x;
    //     console.log("Timetables:" ,x);
    //   })
    // })

    this.vehicleService.getAllVehicle().subscribe(d=>{
      this.vehicles = d; 
      console.log("All vehicels: ", this.vehicles);
      
      this.vehicles.forEach(element => {
        if(element.timetable == null || element.timetable == undefined){
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
      alert("Successfully added vehicle")
      //window.location.reload();
      this.refresh();
    },
    err=>{
      window.alert(err.error.message);
      this.refresh();
    });     
  }



  //Samo one koji nemaju timetable u sebi
  deleteVehicle(){
    console.log("Reg number: ", this.idVehicleForDelete);
    this.vehicleService.deleteVehicle(this.idVehicleForDelete).subscribe(d=>{
      alert("Vehicle delete successfull! ");
      //window.location.reload();
      this.refresh();
    },
    err=>{
      window.alert(err.error.message);
      this.refresh();
    })
  } 


  // getIdVehiclee(event){
  //   this.idVehicleForEdit = event.target.value;
  //   if(this.idVehicleForEdit != null && event.target.value != ""){
  //   this.vehicleService.getVehicle(this.idVehicleForEdit).subscribe(c=>{
  //     this.vehicleForEdit = c;
  //     console.log("Vehicle for edit: ", this.vehicleForEdit);
  //   })
  // }
  // }




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



  refresh(){
    this.selected = "";
    this.idVehicleForDelete = "";

    this.availableVehicles = [];

    this.vehicleService.getAllVehicle().subscribe(data=>{
      this.vehicles = data;

      this.vehicles.forEach(element => {
        if(element.timetable == null || element.timetable == undefined){
          this.availableVehicles.push(element);
        }
      });
    })
  }

}
