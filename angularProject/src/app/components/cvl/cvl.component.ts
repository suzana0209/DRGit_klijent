import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { Polyline } from '../map/modelsForMap/polyline';
import { StationModel } from 'src/app/models/station.model';
import { MarkerInfo } from '../map/modelsForMap/marker-info.model';
import { GeoLocation } from '../map/modelsForMap/geolocation';
import { MapsAPILoader } from '@agm/core';
import { LineService } from 'src/app/services/lineService/line.service';
import { StationService } from 'src/app/services/stationService/station.service';
import { CvlService } from 'src/app/services/cvlService/cvl.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cvl',
  templateUrl: './cvl.component.html',
  styleUrls: ['./cvl.component.css'],
  styles: ['agm-map {height: 400px; width: 100%;}']
})

export class CvlComponent implements OnInit, OnDestroy {
 
  currentNumber: number;
  currNmr: any;
  sub: Subscription;

  public polyline: Polyline;
  public polylineRT: Polyline;
  public zoom: number = 15;
  startLat : number = 45.242268;
  startLon : number = 19.842954;

  //publicDeals: Deal[] = new Array();
  options : string[];
  options1: any;
  //stations : StationModel[] = [];
  stations: any = []
  buses : any[];
  busImgIcon : any = {url:"assets/busicon.png", scaledSize: {width: 50, height: 50}};
  autobusImgIcon : any = {url:"assets/autobus.png", scaledSize: {width: 50, height: 50}};

  isConnected: boolean;
  notificationBus: string[];
  time: number[] = [];

  latitude : number ;
  longitude : number;
  pomm: any = []
  //sub: Subscription;
  getAllStations: any[] = []

  marker: MarkerInfo = new MarkerInfo(new GeoLocation(this.startLat,this.startLon),"","","","");

  isChanged : boolean = false;

//iconPath : any = { url:"assets/busicon.png", scaledSize: {width: 50, height: 50}};
  constructor(private mapsApiLoader : MapsAPILoader,
    private  cvlService: CvlService,
    private ngZone: NgZone,
    private lineService : LineService,
    private stationsService: StationService) {

    this.isConnected = false;
    this.notificationBus = [];
   }


  ngOnInit() {
    this.isChanged = false;

    this.stationsService.getAllStations().subscribe(dd=>{
      this.getAllStations = dd;
      console.log("Sve stanice: ", this.getAllStations);
    })

    this.lineService.getAllLines().subscribe(
      data =>{
        this.options = [];
        this.options1 = data;

        this.options1.forEach(element => {
          this.options.push(element.regularNumber); 
        });
      });
    //inicijalizacija polyline
    this.polyline = new Polyline([], 'blue', { url:"assets/busicon.png", scaledSize: {width: 50, height: 50}});

    //novo
    this.stations = [];

  }

  findStations(e : any[]) : StationModel[]{
    let ret :StationModel[] = [];
    //let statPom : StationModel = new StationModel()
      e.forEach(element => {
       ret.push(this.getAllStations.find(x => x._id == element));
      });

    return ret;
  } 
 
  getStationsByLineNumber(regularNumber : string){
    console.log("Linije iz baze: ", this.options1); 


    this.options1.forEach(element => {
      if(element.regularNumber == regularNumber)
      {
        this.stations = this.findStations(element.stations);
        console.log("Stanice iz linije: ", this.stations);
        for(var i=0; i<this.stations.length; ++i){
          this.polyline.addLocation(new GeoLocation(this.stations[i].latitude, this.stations[i].longitude));
        }
        console.log("Prije slanja: ", this.stations);

        this.cvlService.sendStations(this.stations);
        this.cvlService.readyToReceive();

        this.sub = this.cvlService.getMessages().subscribe(aa=>{
          this.ngZone.run(() => {
            console.log("Current number: ", aa);
            this.currentNumber = aa;
            this.currNmr = aa;

            this.longitude = aa[0];
            this.latitude = aa[1];

            console.log("Lat, lng: ", this.latitude, this.longitude);
          })
        })
      }
    });

  }

  onSelectionChangeNumber(event){
    this.isChanged = true;
    this.stations = [];
    this.polyline.path = [];
    if(event.target.value == "" || event.target.value.length == 0 || event.target.value == null)
    {
      this.isChanged = false;
      this.stations = [];
      this.polyline.path = [];

    }
    else{

      this.getStationsByLineNumber(event.target.value);
    }

  }

  ngOnDestroy(){
    this.sub.unsubscribe();
  }

}