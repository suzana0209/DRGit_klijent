import { Component, OnInit, NgZone } from '@angular/core';
import { MarkerInfo } from '../map/modelsForMap/marker-info.model';
import { GeoLocation } from '../map/modelsForMap/geolocation';
import { Polyline } from '../map/modelsForMap/polyline';
import { StationModel } from 'src/app/models/station.model';
import { StationService } from 'src/app/services/stationService/station.service';
import { LineService } from 'src/app/services/lineService/line.service';
import { PomLineModel } from 'src/app/models/pomLineModel.model';

import { R3TargetBinder } from '@angular/compiler';
import { PoModelForColors } from 'src/app/models/poModelForColors.model';
import { Router } from '@angular/router';
import { LineModel } from 'src/app/models/line.model';


@Component({
  selector: 'app-bus-lines',
  templateUrl: './bus-lines.component.html',
  styleUrls: ['./bus-lines.component.css'],
  styles: ['agm-map {height: 360px; width: 100%;}']
})
export class BusLinesComponent implements OnInit {

  markerInfo: MarkerInfo;
  stations: any= []; //lista svihStranica
  lines: any = [];  //listaSvihLinija
  pomModel: any = []; //lista PomModela (idLinije, ListaStanica po datom redosledu)
  listOfCheckedLines: any = [];
  idOfCheckedLines: string[] = [];
  
  listOfCheckedColors: PoModelForColors[] = [];
  counterForColor: number = 0;

  linesWStations:any = []

  polyline: Polyline;
  pomStat: StationModel;
  selectedStations: StationModel[] = [];
  id: number;

  iconPath: any = {url: "assets/busicon.png", scaledSize: {width: 50, height:50}}
  
  constructor(private ngZone: NgZone, 
    private stationService: StationService,
    private lineService: LineService, private router:Router) {
    this.stationService.getAllStations().subscribe(a => {
      this.stations = a;
    });

    this.lineService.getAllLines().subscribe(b => {
      this.lines = b;
      console.log("Sve linije!", this.lines)

      this.linesWStations = [];
      let lineses = new LineModel(0,"",[],0,"");
      this.lines.forEach(l1 => {
        lineses.ColorLine = l1.colorLine;
        lineses.RegularNumber = l1.regularNumber;
        lineses._id = l1._id;
        lineses.ListOfStations = this.findStations(l1.stations);

        this.linesWStations.push(lineses);

        lineses = new LineModel(0,"",[],0,"");
      });

      console.log("Without station: ", this.lines);
      console.log("With station: ", this.linesWStations);
      

    })

    

   }

  ngOnInit() {
    this.markerInfo = new MarkerInfo(new GeoLocation(45.242268, 19.842954), 
    "assets/ftn.png",
    "Jugodrvo" , "" , "http://ftn.uns.ac.rs/691618389/fakultet-tehnickih-nauka");
    this.polyline = new Polyline([], 'blue', { url:"assets/busicon.png", scaledSize: {width: 50, height: 50}});


  }

  findStations(e : any[]) : StationModel[]
  {
    let ret :StationModel[] = [];
    //let statPom : StationModel = new StationModel()
      e.forEach(element => {
       ret.push(this.stations.find(x => x._id == element));
      });

    return ret;
  }

  stationClick(id: number){
    this.stations.forEach(element => {
      if(element._id == id){
        this.pomStat = element;
      }
    });

    console.log(this.pomStat);
    this.selectedStations.push(this.pomStat);
    
    this.polyline.addLocation(new GeoLocation(this.pomStat.Latitude, this.pomStat.Longitude));
    this.id = id;
  }


  ShowCheckedLine(event: any){
    let checkedBool = event.target.checked;
    let parse = event.target.value;
    
    
    if(checkedBool){
      if(!this.alreadyExistsId(this.idOfCheckedLines, parse)){        
          this.idOfCheckedLines.push(parse);
      }    
      
      console.log("Checked IDs",this.idOfCheckedLines)
      
      this.linesWStations.forEach(e1 => {
        if(e1._id == parse){
          this.listOfCheckedLines.push(e1);

          //this.pomModel.push(e1);
        }
      });

      // this.pomModel.forEach(element => {
      //   if(element._id == parse){
          
      //     //let dd = element;
      //     // dd.ListOfStations = this.getNamee(element.ListOfStations);
          
      //   }
      // });
      console.log("Listaaa: ", this.listOfCheckedLines);
    }
    else{
      let a: string;
      this.idOfCheckedLines.forEach(element => {
        //let counter1 = 0;
        if(element == parse){
          a = element;
        }

      });

      const index: number = this.idOfCheckedLines.indexOf(a);
      this.idOfCheckedLines.splice(index, 1);
      this.listOfCheckedLines.splice(index, 1); 

      console.log(this.idOfCheckedLines);
      console.log(this.listOfCheckedLines)

    }
  }

  // ShowCheckedLine(event: any){
  //   let checkedBool = event.target.checked;
  //   let parse = parseInt(event.target.value, 10)
    
    
  //   if(checkedBool){
  //     if(this.alreadyExistsId(this.idOfCheckedLines, parse)){        
  //         this.idOfCheckedLines.push(parse);
  //     }    
      
  //     console.log("Checked IDs",this.idOfCheckedLines)
  //     this.pomModel.forEach(element => {
  //       if(element.Id == parse){
  //         this.listOfCheckedLines.push(element);
  //       }
  //     });
      
  //   }
  //   else{
  //     let a: number;
  //     this.idOfCheckedLines.forEach(element => {
  //       //let counter1 = 0;
  //       if(element == parse){
  //         a = element;
  //       }

  //     });

  //     const index: number = this.idOfCheckedLines.indexOf(a);
  //     this.idOfCheckedLines.splice(index, 1);
  //     this.listOfCheckedLines.splice(index, 1);

  //   }
  // }

  alreadyExistsId(listId: string[], id:string): boolean{
    listId.forEach(element => {
      if(element == id){
        return true;
      }
    });
    return false;
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

}
