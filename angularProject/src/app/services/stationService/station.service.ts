import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StationModel } from 'src/app/models/station.model';

@Injectable({
  providedIn: 'root'
})
export class StationService {

  //baseUrl = "http://localhost:52295";

  constructor(private http:Http, private httpClient:HttpClient) { }

  private token: string;

  private getToken(): string { 
    if (!this.token) {
      this.token = localStorage.getItem('mean-token');
    }
    return this.token;
  }

  private request(method: 'post'|'get'|'delete', type: 'addStation'|'getAllStations'|'changeStation'|'deleteStation', user?: StationModel, stid?:String): Observable<any> {
    let base;

    if (method === 'post') {
      base = this.httpClient.post(`/api/${type}`, user);
    }else if(method === 'delete'){
      base = this.httpClient.delete(`/api/${type}/`+ stid);
    } 
    else {
      base = this.httpClient.get(`/api/${type}`, { headers: { Authorization: `Bearer ${this.getToken()}` }});
   
      //base = this.httpClient.get(`/api/${type}`, { headers: { Authorization: `Bearer ${this.getToken()}` }}); 
    }

    // const request = base.pipe(
    //   map((data: TokenResponse) => {
    //     if (data.token) {
    //       if( type === 'login')
    //       {
    //         this.saveToken(data.token);
    //       }
          
    //     }
    //     return data;
    //   })
    // );

    return base;
  }

  public addStation(stat: StationModel): Observable<any> {
    return this.request('post', 'addStation', stat);
  }

  public getAllStations(): Observable<any> {
    return this.request('get', 'getAllStations');
  }

  // public getAllStations(): Observable<any> {
  //   return this.request('get', 'getAllStations');
  // }

  public changeStation(stat:StationModel): Observable<any>{
    return this.request('post', 'changeStation', stat);
  }

  public deleteStation(stid:String):Observable<any>{
    return this.request('delete', 'deleteStation',null,stid);
  }


  // addStation(station): Observable<any>{
  //   return this.httpClient.post(this.baseUrl + "/api/Stations/Add", station);
  // }

  // getAllStations(){
  //   return this.httpClient.get(this.baseUrl + "/api/Stations/GetAll");
  // }

  // editStation(station):Observable<any>{
  //   return this.httpClient.post(this.baseUrl+ "/api/Stations/Edit", station);
  // }

  // deleteStation(idStation){
  //   return this.httpClient.delete(this.baseUrl + "/api/Stations/Delete?id=" + idStation);
  // }




  // getOrderedStations(id: number){
  //   return this.httpClient.get(this.baseUrl + "/api/Stations/GetOrderedAll?id=" + id);
  // }

  // getAll(){
  //   return this.httpClient.get(this.baseUrl + "/api/Stations/GetOrderedAllLines");
  // }

  // getIdes(){
  //   return this.httpClient.get(this.baseUrl + "/api/Stations/GetIdes");

  // }

  // AlredyExistStation(station){
  //   return this.httpClient.post(this.baseUrl + "/api/Stations/AlredyExistStation", station);
  // }

  // AlredyExistsStationForEdit(station){
  //   return this.httpClient.post(this.baseUrl + "/api/Stations/AlredyExistsStationForEdit", station);
  // }
}
