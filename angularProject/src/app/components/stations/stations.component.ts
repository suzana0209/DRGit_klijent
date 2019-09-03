import { Component, OnInit, NgZone } from '@angular/core';
import { GeoLocation } from '../map/modelsForMap/geolocation';
import { MarkerInfo } from '../map/modelsForMap/marker-info.model';
import { StationService } from 'src/app/services/stationService/station.service';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { StationModel } from 'src/app/models/station.model';
import { NgForm } from '@angular/forms';
import { MapComponent } from '../map/map.component';
import { Router } from '@angular/router';
import { ValidForAddStationModel } from 'src/app/models/modelsForValidation/validForStation.model';
import { UsersService } from 'src/app/services/users/users.service';
import { AuthenticationService } from 'src/app/services/authentication-service.service';
import { RegistrationModel } from 'src/app/models/registration.model';
import { AccountService } from 'src/app/services/account/account.service';


@Component({
  selector: 'app-stations',
  templateUrl: './stations.component.html',
  styleUrls: ['./stations.component.css'],
  styles: ['agm-map {height: 400px; width: 100%;}']
  //styles: ['agm-map {height: 500px; width: 700px;}']
  //styles: ['agm-map {height: 500px; width: 80%;}']
})
export class StationsComponent implements OnInit {
  private selected: string = '';
  coordinates: GeoLocation = new GeoLocation(0,0); 
  markerInfo: MarkerInfo;
  private geocoder : any;


  address: string;

  public stations: any = [];
  markers: any = [];
  iconPath : any = {url: "assets/busicon.png", scaledSize: {width: 50, height:50}}

  newStation: StationModel
  public nameOfStation: string = "";
  id: number;
  version: number;

  //validationsForAdd: ValidForAddStationModel = new ValidForAddStationModel();
  boolBezvezeZaPoruku: string = "";
  boolBezvezeZaPorukuDenied: boolean = false;
  userPom: any;
  sakrijDugmice: boolean = true;
  pomocniUser: RegistrationModel = new RegistrationModel("","","","","","","","",new Date(),"","","","");
  selectedStationForDelete: StationModel = new StationModel("",0,0,"",0)
  aktivan: boolean = false;
  odbijen: boolean = false;
  naCekanju: boolean = false;



  constructor(private ngZone: NgZone, private route: Router, private mapsApiLoader: MapsAPILoader,
    private stationService: StationService, private userService: UsersService, private authService: AuthenticationService, private accountService: AccountService) {

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

    this.selectedStationForDelete = new StationModel("",0,0,"",0)
    this.sakrijDugmice = true;

    this.stationService.getAllStations().subscribe(st =>{
      this.stations = st;
      console.log("Podaci o stanicama: ", this.stations);
    });
  }

  ngOnInit() {
    this.markerInfo = new MarkerInfo(new GeoLocation(45.242268, 19.842954), 
    "assets/ftn.png",
    "Jugodrvo" , "" , "http://ftn.uns.ac.rs/691618389/fakultet-tehnickih-nauka");
  
    this.mapsApiLoader.load().then(() =>{
      this.geocoder = new google.maps.Geocoder();
    });

  }

  onSubmit(stationData: StationModel, form: NgForm){

    stationData.Latitude = this.coordinates.latitude;
    stationData.Longitude = this.coordinates.longitude;
    stationData.AddressStation = this.address;

    console.log(stationData);

    this.stationService.addStation(stationData).subscribe(data => {
      form.reset();
      window.alert(data.message);
      this.refreshPage();
    },
    err => {
      window.alert(err.error.message);   
    });
  }

  onSubmitEdit(stationData: StationModel, form: NgForm){

    stationData.Latitude = this.coordinates.latitude;
    stationData.Longitude = this.coordinates.longitude;
    stationData.AddressStation = this.address;
    stationData.Name = this.nameOfStation;
    stationData.Id = this.id;
    stationData.Version = this.version;

    console.log(stationData);

   
    this.stationService.changeStation(stationData).subscribe(data => {
      window.alert(data.message);
      this.refreshPage();
    },
    err => { 
      window.alert(err.error.message);
    });  
  }

   
  onSubmitDelete(stationData: StationModel, form:NgForm){
    //Dodato
    this.stationService.getAllStations().subscribe(st =>{
      this.stations = st;
      console.log("Podaci o stanicama: ", this.stations);
    });

      console.log("Stanicaaa: ", stationData);

      this.stationService.deleteStation(this.id.toString()).subscribe(x => {
        window.alert(x.message);
        this.refreshPage();
      },
      err=>{
        window.alert(err.error.message);
      });  
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

  markerDragEnd($event: MouseEvent, nameOfStation:string, id: number, version:number) { //version:number
    console.log($event);
     this.coordinates.latitude = $event.coords.lat;
     this.coordinates.longitude = $event.coords.lng;
     this.getAddress(this.coordinates.latitude, this.coordinates.longitude);
     this.nameOfStation = nameOfStation;
     this.id = id;
     this.version = version;
     console.log(id);
  }

  stationClick(id: number){  
    this.id = id;

    this.stationService.getAllStations().subscribe(st=>{
      st.forEach(element => {
        if(element._id == this.id){
          this.selectedStationForDelete.Name = element.name;
          this.selectedStationForDelete.Latitude = element.latitude;
          this.selectedStationForDelete.Longitude = element.longitude;
          this.selectedStationForDelete.AddressStation = element.addressStation;
        }
      });
    })
  }
 
  placeMarker1($event){
    this.coordinates = new GeoLocation($event.coords.lat, $event.coords.lng);
    this.getAddress(this.coordinates.latitude,this.coordinates.longitude);
  }


  getAddress(latitude: number,longitude:number){
    this.geocoder.geocode({'location': {lat: latitude, lng: longitude}}, (results,status) =>{
      console.log(results);
      if(status === 'OK'){
          if(results[0]){
            this.address = results[0].formatted_address;
          }
          else{
            window.alert('no results found');
          }
      }
    });

  }

  showAdd(){
    this.sakrijDugmice = false;
    this.selected = "Add";
    
  }

  showEdit(){
    
    this.sakrijDugmice = false;
    this.selected = "Edit";
  }

  showDelete(){
    
    this.sakrijDugmice = false;
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

  refreshPage(){
    this.sakrijDugmice = true;
    this.selectedStationForDelete = new StationModel("",0,0,"",0)
    this.coordinates = new GeoLocation(0,0);
    this.stations = [];
    this.address = "";

    this.stationService.getAllStations().subscribe(data=>{
      this.stations = data;
    })

  }
}
