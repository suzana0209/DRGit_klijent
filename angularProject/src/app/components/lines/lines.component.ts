import { Component, OnInit, NgZone } from '@angular/core';
import { Polyline } from '../map/modelsForMap/polyline';
import { MarkerInfo } from '../map/modelsForMap/marker-info.model';
import { StationModel } from 'src/app/models/station.model';
import { MapsAPILoader } from '@agm/core';
import { StationService } from 'src/app/services/stationService/station.service';
import { GeoLocation } from '../map/modelsForMap/geolocation';
import { LineService } from 'src/app/services/lineService/line.service';
import { LineModel } from 'src/app/models/line.model';
import { NgForm } from '@angular/forms';
import { IconSequence } from '@agm/core/services/google-maps-types';
import { LineStationModel } from 'src/app/models/lineStation.model';
import { typeWithParameters } from '@angular/compiler/src/render3/util';
import { PomLineModel } from 'src/app/models/pomLineModel.model';
import { ValidForLineModel, ValidForEditLineModel } from 'src/app/models/modelsForValidation/validForLineModel.model';
import { UsersService } from 'src/app/services/users/users.service';
import { AccountService } from 'src/app/services/account/account.service';

@Component({
  selector: 'app-lines',
  templateUrl: './lines.component.html',
  styleUrls: ['./lines.component.css'],
  styles: ['agm-map {height: 400px; width: 100%;}']
})
export class LinesComponent implements OnInit {

  selectedForComboBox: string = '';
  selected: string = "";
  public polyline: Polyline;
  
  id: String;
  public zoom: number;
  stations: any = [];
  markerInfo: MarkerInfo;
  pomStat: StationModel;
  selectedStations: StationModel[] = [];
  lines: any = [];

  linesForEdit: any = []

  selectedLine: LineModel

  selectedForEdit: string = ''

  selectedLineForEdit: LineModel
  otherStations: any = [];

  lineStations: LineStationModel[] = []
  lineStation: LineStationModel

  counterForStation: number = 0
  orderedStation: any = [];
  linesWithOrderedStations: any = [];
  linesWithStations: LineModel[] = []
  
  pomLine: any;

  keys: any = [];
  pomModelList: any = [];
  pomOdPom: PomLineModel;

  linesForComboBox: any = []

  lineForEditString: string = ''
  sLineForEdit: LineModel
  allLinesForEditFromDb: any = []
  orderedStationEdit: any = []

  newLineEdit: any;
  //newLineEdit = new LineModel(0,"",[],)

  allStationFromDb: any = []

  restStation: any = []

  showComboBoxForAddSt: boolean = false;
  showComboBoxForAddSt2: boolean = false;


  arrayIntForAddStation: any = []
  showAddButtonBool: boolean = false;
  addStation: StationModel;
  addStationPosition: number;
  idAdded: string;

  showListOfStations: boolean = false;

  userPom: any;
  sakrijDugmice: boolean = true;

  selLine: Polyline
  directionsService :any ;
  directionsDisplay : any ;
  sl: LineModel = new LineModel(0,"",[],0,"","");
  naCekanju: boolean = false;
  odbijen: boolean = false;
  aktivan: boolean = false;
  

  iconPath: any = {url: "assets/busicon.png", scaledSize: {width: 50, height:50}}

  constructor(private ngZone: NgZone, private mapsApiLoader : MapsAPILoader , 
    private stationService: StationService, 
    private lineService: LineService, 
    private accountService: AccountService, private userService: UsersService) { 

      this.sakrijDugmice = true;

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
  

    this.stationService.getAllStations().subscribe(data => {
      this.stations = data;
      this.allStationFromDb = data
      console.log(this.stations)

    });

      this.lineService.getAllLines().subscribe(s => {
        this.linesForComboBox = s;
        this.allLinesForEditFromDb = s;
      })

      this.arrayIntForAddStation = [];
      
  }

  ngOnInit() {
    this.markerInfo = new MarkerInfo(new GeoLocation(45.242268, 19.842954), 
    "assets/ftn.png",
    "Jugodrvo" , "" , "http://ftn.uns.ac.rs/691618389/fakultet-tehnickih-nauka");
    this.polyline = new Polyline([], 'blue', { url:"assets/busicon.png", scaledSize: {width: 50, height: 50}});

    this.selLine = new Polyline([], 'red', { url:"assets/busicon.png", scaledSize: {width: 50, height: 50}});



    this.mapsApiLoader.load().then(() =>{
      google.maps.event.addListener(this.sl, 'positionChanged', (function(selLine, i) {
        return function(event) {
          console.log(event.LatLngLiteral);
          alert("WTF");
        }
      }));
      this.directionsService  = new google.maps.DirectionsService();
      this.directionsDisplay = new google.maps.DirectionsRenderer();
    });

  }

  onSubmit(lineData: LineModel, form: NgForm){
    lineData.ListOfStations = this.selectedStations;

      this.lineService.addLine(lineData).subscribe(data => {
      window.alert(data.message);
      form.reset();
      this.refreshPage();
      },
      err => {
        window.alert(err.error.message); 
      })
  }


  removeStationFromLine(id: string){
    var counter = 0;
    this.newLineEdit = this.sLineForEdit;
    this.newLineEdit.ListOfStations.forEach(element => {      
      if(element.Id == id){
        this.newLineEdit.ListOfStations.splice(counter, 1);
        console.log("Izbrisana: ", this.newLineEdit);

        //moze da doda element samo ako vec ne postoji u rest-u
        if(this.alreadyExists(this.restStation, element.Id)){    
          this.restStation.push(element);
        }

        console.log("Probaj rest: ", this.restStation);
        if(this.arrayIntForAddStation.length > 0){       
          this.arrayIntForAddStation.pop();
        }
      }
      counter++;
    });
  }

  onSubmitDelete(lineData: LineModel, form:NgForm){
   
      this.lineService.deleteLine(this.selectedLine._id.toString()).subscribe(data => {
       window.alert(data.message);
        this.refreshPage();
      
      },
      err => {
        window.alert(err.error.message);
      })
  }


  onSubmitEdit(){

    console.log("Nove linije za edit:", this.newLineEdit);
    console.log("pozicja: ", this.addStationPosition);

    let lineData: LineModel = new LineModel(0,"",[]);
    lineData.RegularNumber = this.newLineEdit.regularNumber;
    lineData.Id = this.newLineEdit._id;
    lineData.ColorLine = this.newLineEdit.colorLine;
    this.newLineEdit.ListOfStations.forEach(element => {
      lineData.ListOfStations.push(element.Id);
    });
    
    this.lineService.changeLine( lineData, this.newLineEdit._id).subscribe(d=>{
      window.alert(d.message);
      this.refreshPage();
    },
    err=>{ 
      window.alert(err.error.message);
    })

  }


  showLinesForChange(event: any){
    //this.showComboBoxForAddSt = true;
    this.lineForEditString = event.target.value;
    if(this.lineForEditString == "" || this.lineForEditString == undefined){
      this.sl = new LineModel(0,"",[],0,"","")
    }
    if(this.lineForEditString != null && this.lineForEditString != undefined){
      this.showListOfStations = true;
    }
    this.allLinesForEditFromDb.forEach(element => {
      if(element.regularNumber == this.lineForEditString){
        
        this.sLineForEdit = element;
        this.sLineForEdit.ListOfStations = this.getNamee(element.stations)
        console.log("sLineForEdit: ", this.sLineForEdit)
        //dodato
        this.sl = element;
        element.ListOfStations.forEach(element1 => {
          this.selLine.addLocation(new GeoLocation(element1.Longitude, element1.Latitude));
        });


      }
    });
  }

  getNamee(stations: any[]){
    var retValue:StationModel[] = [];
    
    let ime;

    stations.forEach(element => {
      this.stationService.getAllStations().subscribe(dd=>{
        ime = dd.find(x=> x._id == element);
        let pom:StationModel = new StationModel("",0,0,"",0);
        pom.Name = ime.name;
        pom.Latitude = ime.latitude;
        pom.Longitude = ime.longitude;
        pom.Id = ime._id;
        pom.AddressStation = ime.addressStation;

        retValue.push(pom);
      })
    });

    return retValue;
    
  }

  //list:StationModel[]
  alreadyExists(list: any, id: string): boolean{
    list.forEach(d=>{
      if(d._id == id){
        return false;
      }
    })
    return true;
  }

  showAddButton(event){
    if(event.target.value != "" && parseInt(event.target.value, 10) > 0){
      this.showAddButtonBool = true;
      this.addStationPosition = parseInt(event.target.value, 10)      
    }
  }

  finallyAdd(){
    
    console.log("sLineForEdit: ", this.sLineForEdit);
    console.log("newLineEdit", this.newLineEdit);
    console.log("Pozicija: ", this.arrayIntForAddStation.length);
    console.log("Rest station: ", this.restStation);


    console.log("Prije dodaavanja", this.newLineEdit);
    let retValue = []
      this.restStation.forEach(ee => {
        if(ee._id == this.idAdded ){
          let pomocna = [];
          //pomocna.push(ee._id);
          

          this.stationService.getAllStations().subscribe(dd=>{
            let ime = dd.find(x=> x._id == ee._id);
            let pom:StationModel = new StationModel("",0,0,"",0);
            pom.Name = ime.name;
            pom.Latitude = ime.latitude;
            pom.Longitude = ime.longitude;
            pom.Id = ime._id;
            pom.AddressStation = ime.addressStation;
    
            retValue.push(pom);
            let pom1: StationModel = new StationModel(pom.Name, pom.Longitude,
              pom.Latitude, pom.AddressStation,pom.Id);
            //this.newLineEdit.ListOfStations.push(pom);
            
            this.newLineEdit.ListOfStations.splice(this.addStationPosition-1, 0, pom1);

            console.log(this.newLineEdit);

          })
        }
      });

      let counterForDel = 0;

      this.restStation.forEach(e1 => {
        if(e1.Id == this.idAdded){
          this.restStation.splice(counterForDel, 1);
        }
        counterForDel = counterForDel + 1;
      });

      if(this.idAdded != ""){
        this.arrayIntForAddStation.push(this.arrayIntForAddStation.length+1);
      }
      
      this.showAddButtonBool = false;
      this.showComboBoxForAddSt =  false;
      this.showComboBoxForAddSt2 = false;

     

  }

  sendIdOfStation(event){
    console.log("Target vale", event.target.value);
    if(event.target.value != ""){
      this.showComboBoxForAddSt2 = true;
      
      this.idAdded = event.target.value.toString();
      // this.idAdded = parseInt(event.target.value, 10);
      this.restStation.forEach(element => {
        if(element.Id == this.idAdded){
          //this.restStation.splice(this.idAdded, 1);
          
        }
      });      
    }
  }

 //poziva se u delete-u  
 showLines(event: any){
    this.selectedForComboBox = event.target.value;
    if(this.selectedForComboBox == "" || this.selectedForComboBox == undefined){
      this.sl = new LineModel(0,"",[],0,"","")
    }


    this.allLinesForEditFromDb.forEach(element => {
      if(element.regularNumber == this.selectedForComboBox){
        this.selectedLine = element;
        this.sLineForEdit = element;
        let pomLista = this.getNamee(element.stations);
        this.sLineForEdit.ListOfStations =  pomLista;
        console.log("sLineForEdit: ", this.sLineForEdit)
        //dodato
        this.sl = element;
        element.ListOfStations.forEach(element1 => {
          this.selLine.addLocation(new GeoLocation(element1.Longitude, element1.Latitude));
        });
      }
    })

     if(this.selectedLine != null){
      }
  }

  

  showComboBox(){
    this.showComboBoxForAddSt2 = true;    //ovo je za poziciju Position combo box
    this.newLineEdit = this.sLineForEdit;
    this.showComboBoxForAddSt = true;

    this.restStation = this.allStationFromDb.filter(o=> !this.newLineEdit.ListOfStations.find(o2=> o._id === o2.Id));
        
      let countOfArray1 = this.newLineEdit.ListOfStations.length;

      if(this.arrayIntForAddStation.length <= countOfArray1){ 
        for (let i = 0; i < countOfArray1 + 1; i++) {
          this.arrayIntForAddStation.push(i+1);
        }
      }

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

  isTrue(name:string):boolean{
    if(this.selectedLineForEdit != null){
      this.selectedLineForEdit.ListOfStations.forEach(element => {
        if(element.Name == name){
          element.Checked = true;
          return true;
        }
      });
    }
    return false;
  }

  stationClick(id: string){
    this.pomStat = new StationModel("",0,0,"",0);
    let postojiStanica: boolean = false;

    this.stations.forEach(element => {
      if(element._id == id){
        //this.pomStat = element;
        this.pomStat.Id = element._id;
        this.pomStat.Name = element.name;
        this.pomStat.Latitude = element.latitude;
        this.pomStat.Longitude = element.longitude;

        this.pomStat.AddressStation = element.addressStation;
      }
    });

    console.log(this.pomStat);
    this.selectedStations.push(this.pomStat);


    this.polyline.addLocation(new GeoLocation(this.pomStat.Latitude, this.pomStat.Longitude));
    this.id = id;

  }

  refreshPage(){
    this.sakrijDugmice = true;
    this.selected = "";

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
    this.sLineForEdit = new LineModel(0,"",[])
    this.sl = new LineModel(0,"",[],0,"","");
    this.showListOfStations = false;
    this.selectedLineForEdit = new LineModel(0,"",[])
    this.stationService.getAllStations().subscribe(data => {
      this.stations = data;
      this.allStationFromDb = data
      console.log(this.stations)

    });

      this.lineService.getAllLines().subscribe(s => {
        this.linesForComboBox = s;
        this.allLinesForEditFromDb = s;
      })

      this.arrayIntForAddStation = []; 

    //ostatak 
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