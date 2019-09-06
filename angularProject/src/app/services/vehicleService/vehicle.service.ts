import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VehicleModel } from 'src/app/models/vehicle.model';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

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

}
