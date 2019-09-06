import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TimetableModel2, TimetableModel3, TimetableModel4 } from 'src/app/models/timetable.model';

@Injectable({
  providedIn: 'root'
})
export class TimetableService {

  private token: string;


  constructor(private http:Http, private httpClient:HttpClient) { }

  private getToken(): string { 
    if (!this.token) {
      this.token = localStorage.getItem('mean-token');
    }
    return this.token;
  }

  private request(method: 'post'|'get'|'delete', type: 'addTimetable'|'getAllTimetable'|'changeTimetable'|'deleteTimetable', timetable?: TimetableModel2, stid?:String): Observable<any> {
    let base;

    if (method === 'post') {
      base = this.httpClient.post(`/api/${type}`, timetable);
    }else if(method === 'delete'){
      base = this.httpClient.delete(`/api/${type}/`+ stid);
    } 
    else {
      base = this.httpClient.get(`/api/${type}`, { headers: { Authorization: `Bearer ${this.getToken()}` }});
   
      //base = this.httpClient.get(`/api/${type}`, { headers: { Authorization: `Bearer ${this.getToken()}` }}); 
    }

    return base;
  }

  public addTimetable(fd: TimetableModel2): Observable<any> {
    return this.request('post', 'addTimetable', fd);
  }
   

  public getAllTimetable(): Observable<any> {
    return this.request('get', 'getAllTimetable');
  }

  // public getAllStations(): Observable<any> {
  //   return this.request('get', 'getAllStations');
  // }

  public changeTimetable(tt:TimetableModel2): Observable<any>{
    return this.request('post', 'changeTimetable', tt);
  }

  public deleteTimetable(stid:String):Observable<any>{
    return this.request('delete', 'deleteTimetable',null,stid);
  }

}
