import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VehicleModel } from 'src/app/models/vehicle.model';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  baseUrl = "http://localhost:52295"
  constructor(private http: Http, private httpClient:HttpClient) { }


  
  private token: string;

  private getToken(): string { 
    if (!this.token) {
      this.token = localStorage.getItem('mean-token');
    }
    return this.token;
  }

  private request(method: 'post'|'get'|'delete', type: 'addVehicle'|'getAllVehicle'|'deleteVehicle', vehicle?: VehicleModel, stid?:String): Observable<any> {
    let base;

    if (method === 'post') {
      base = this.httpClient.post(`/api/${type}`, vehicle);
    }else if(method === 'delete'){
      base = this.httpClient.delete(`/api/${type}/`+ stid);
    } 
    else {
      base = this.httpClient.get(`/api/${type}`, { headers: { Authorization: `Bearer ${this.getToken()}` }});
   
      //base = this.httpClient.get(`/api/${type}`, { headers: { Authorization: `Bearer ${this.getToken()}` }}); 
    }

    return base;
  }

  public addVehicle(vehicle): Observable<any>{
    return this.request('post', 'addVehicle', vehicle); 
  }

  public getAllVehicle(): Observable<any>{
    return this.request('get', 'getAllVehicle');
  }

  public deleteVehicle(stid: String):Observable<any>{
    return this.request('delete', 'deleteVehicle', null,stid);
  }



  // addVehicle(vehicle): Observable<any>{
  //   return this.httpClient.post(this.baseUrl+"/api/Vehicles/Add",vehicle);
  // }

  // getAllVehicles(){
  //   return this.httpClient.get(this.baseUrl + "/api/Vehicles/GetAll");
  // }

  // getLinesForVehicle(){
  //   return this.httpClient.get(this.baseUrl + "/api/Vehicles/GetLinesForVehicle"); 
  // }

  // getTimetablesForVehicle(){
  //   return this.httpClient.get(this.baseUrl + "/api/Vehicles/TimetablesForVehicle"); 
  // }

  // deleteVehicle(id){
  //   return this.httpClient.delete(this.baseUrl + "/api/Vehicles/Delete?id=" + id);
  // }
  // //

  // getVehicle(id: number){
  //   return this.httpClient.get(this.baseUrl + "/api/Vehicles/GetVehicle?id=" + id);
  // }

  // editVehicle(vehicle):Observable<any>{
  //   return this.httpClient.post(this.baseUrl + "/api/Vehicles/Edit", vehicle);
  // }

}
