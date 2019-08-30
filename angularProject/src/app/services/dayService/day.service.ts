import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DayService {

  baseUrl = "http://localhost:52295";

  
  constructor(private http:Http, private httpClient:HttpClient) { }

  private token:string;
  private getToken(): string { 
    if (!this.token) {
      this.token = localStorage.getItem('mean-token');
    }
    return this.token;
  }

  private request(method: 'post'|'get', type: 'getAllDayTypes'): Observable<any> {
    let base;

    
    
      return  this.httpClient.get(`/api/${type}`, { headers: { Authorization: `Bearer ${this.getToken()}` }});

    // return base;
  }  

  public getAllDayTypes(): Observable<any> {
    return this.request('get', 'getAllDayTypes');
  }
 



  getAll(){
    return this.httpClient.get(this.baseUrl + "/api/Days/GetAll");
  }

  getIdDay(name: string): Observable<any>{
    return this.httpClient.get(this.baseUrl + "/api/Days/GetIdDay" + name);
  }


}
