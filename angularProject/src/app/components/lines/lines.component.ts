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
import { LineStationService } from 'src/app/services/lineStationService/line-station.service';
import { typeWithParameters } from '@angular/compiler/src/render3/util';
import { PomLineModel } from 'src/app/models/pomLineModel.model';
import { ValidForLineModel, ValidForEditLineModel } from 'src/app/models/modelsForValidation/validForLineModel.model';
import { UsersService } from 'src/app/services/users/users.service';

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

  validationsForAdd: ValidForLineModel = new ValidForLineModel();
  validationsForEdit: ValidForEditLineModel = new ValidForEditLineModel();
  showListOfStations: boolean = false;

  boolBezvezeZaPoruku: string = "";
  boolBezvezeZaPorukuDenied: string = "";
  userPom: any;
  sakrijDugmice: boolean = true;
  

  iconPath: any = {url: "assets/busicon.png", scaledSize: {width: 50, height:50}}

  constructor(private ngZone: NgZone, private mapsApiLoader : MapsAPILoader , 
    private stationService: StationService, 
    private lineService: LineService, 
    private lineStationService: LineStationService, private userService: UsersService) { 

      this.sakrijDugmice = true;
      // this.userService.getUserData(localStorage.getItem('name')).subscribe(a=>{
      //   console.log("Userrr: ", a);
      //   if(a != null && a != undefined){
          
      //     this.userPom = a;
      //     this.boolBezvezeZaPoruku = this.userPom.Activated;
      //     // this.boolBezvezeZaPorukuDenied = this.userPom.Deny; 
      //   }
        
      // })

    this.stationService.getAllStations().subscribe(data => {
      this.stations = data;
      this.allStationFromDb = data
      console.log(this.stations)

      

      // this.restStation = this.allStationFromDb.filter(o=> !this.newLineEdit.ListOfStations.find(o2=> o._id === o2.Id));
        
      // let countOfArray1 = this.newLineEdit.ListOfStations.length;

      // if(this.arrayIntForAddStation.length <= countOfArray1){
      //   for (let i = 0; i < countOfArray1 + 1; i++) {
      //     this.arrayIntForAddStation.push(i+1);
      //   }
      // }

    });

     


    // this.stationService.getAll().subscribe(k=>{
    //   //this.lines = k;   
    //   this.pomModelList = k;     

    // });

    

    // this.stationService.getIdes().subscribe(ides => {
    //   this.keys = ides;
    // });


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

  }

  onSubmit(lineData: LineModel, form: NgForm){
    lineData.ListOfStations = this.selectedStations;

    // if(this.validationsForAdd.validate(lineData)){
    //   return;
    // }

    // this.lineService.AlredyExistRegularNumber(lineData).subscribe(a=>{
    //   if(a == "Yes"){
    //     alert("Line number: "+ lineData.RegularNumber +" alredy exists!");
    //     //window.location.reload();
    //   }
    //   else if(a == "No"){
    //     console.log(lineData);
        this.lineService.addLine(lineData).subscribe(data => {
        alert("Line "+ lineData.RegularNumber +" successful added!");
        window.location.reload();
      },
      err => {
        window.alert(err.error.message);
        window.location.reload();
         
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
        if(this.alreadyExists(this.restStation, element._id)){    
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
    console.log("Line for delete: ", lineData);

    // if(this.validationsForAdd.validateForDelete(lineData)){
    //   return;
    // }
    
      this.lineService.deleteLine(this.selectedLine._id.toString()).subscribe(data => {
        alert("Line with Number="+ lineData.RegularNumber +" successful delted!");
        //form.reset();
        window.location.reload();
  
      },
      err => {
        //alert("Delete line - error!");
        window.alert(err.error);
        window.location.reload();
  
        //console.log(lineData);
      })
  }


  onSubmitEdit(){

    console.log("Nove linije za edit:", this.newLineEdit);
    console.log("pozicja: ", this.addStationPosition);
    
    this.lineService.changeLine(this.newLineEdit.Id, this.newLineEdit).subscribe(d=>{
      alert("Line with ID="+ this.newLineEdit.Id +" successful changed!")

      window.location.reload();
    },
    err=>{
      window.alert(err.error);
      window.location.reload();
    })

  }


  showLinesForChange(event: any){
    //this.showComboBoxForAddSt = true;
    this.lineForEditString = event.target.value;
    if(this.lineForEditString != null && this.lineForEditString != undefined){
      this.showListOfStations = true;
    }
    this.allLinesForEditFromDb.forEach(element => {
      if(element.regularNumber == this.lineForEditString){
        this.sLineForEdit = element;
        this.sLineForEdit.ListOfStations = this.getNamee(element.stations)

      }
    });
  }

  getNamee(stations: StationModel[]){
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
    //validacija za stanicu i poziciju
    // if(this.validationsForEdit.validate(this.idAdded, this.addStationPosition)){
    //   return;
    // }

    console.log("Prije dodaavanja", this.newLineEdit);
      this.restStation.forEach(ee => {
        if(ee._id == this.idAdded ){
          if(this.alreadyExists(this.newLineEdit.ListOfStations, this.idAdded)){
            this.newLineEdit.ListOfStations.splice(this.addStationPosition-1, 0, ee);
               
            
            

          }
          
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

    this.linesForComboBox.forEach(element => {
      if(element.regularNumber == this.selectedForComboBox){
        this.selectedLine = element;
        this.selectedLine.ListOfStations = this.getNamee(element.stations) 
        
      }
    });

     if(this.selectedLine != null){
      //  this.stationService.getOrderedStations(this.selectedLine.Id).subscribe(d =>{
      //    this.orderedStation = d;
         
      //    console.log(d);
      //  });
      }
  }

  // showLinesForChange(event: any){
  //   //this.showComboBoxForAddSt = true;
  //   this.lineForEditString = event.target.value;
  //   if(this.lineForEditString != null && this.lineForEditString != undefined){
  //     this.showListOfStations = true;
  //   }
  //   this.allLinesForEditFromDb.forEach(element => {
  //     if(element.regularNumber == this.lineForEditString){
  //       this.sLineForEdit = element;
  //       this.sLineForEdit.ListOfStations = this.getNamee(element.stations)

  //     }
  //   });
  // }


  showComboBox(){
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

}