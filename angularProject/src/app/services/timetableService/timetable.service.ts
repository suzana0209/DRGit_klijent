import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TimetableModel2, TimetableModel3, TimetableModel4 } from 'src/app/models/timetable.model';

@Injectable({
  providedIn: 'root'
})
export class TimetableService {

  baseUrl = "http://localhost:52295";

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






  // addTimeTable(timeTable : TimetableModel2): Observable<any>{
  //   return this.httpClient.post(this.baseUrl + "/api/Timetable/Add", timeTable);
  // }

  // deleteTimetable(id:number){
  //   return this.httpClient.delete(this.baseUrl + "/api/Timetable/Delete?id=" + id);
  // }

  // getAll(){
  //   return this.httpClient.get(this.baseUrl + "/api/Timetable/GetAll");
  // }

    // uradjen Include
  // getLT(){
  //     return this.httpClient.get(this.baseUrl + "/api/Timetable/LineInTT");
  // }

  // editTimetable(id, timetable):Observable<any>{
  //   return this.httpClient.put(this.baseUrl + "/api/Timetable/Edit?id=" + id, timetable);
  // }

  // AlredyExistTimetable(timeTable: TimetableModel2){
  //   return this.httpClient.post(this.baseUrl + "/api/Timetable/AlredyExistTimetable", timeTable);
  // }

  // AlreadyExistByEdit(tt){
  //   return this.httpClient.post(this.baseUrl + "/api/Timetable/AlreadyExistByEdit", tt);
  // }




}
