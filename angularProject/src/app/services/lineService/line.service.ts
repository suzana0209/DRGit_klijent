import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LineModel } from 'src/app/models/line.model';


@Injectable({
  providedIn: 'root'
})
export class LineService {

  //baseUrl = "http://localhost:52295"
  private token: string;

  constructor(private http: Http, private httpClient:HttpClient) { }

  private getToken(): string{
    if(!this.token){
      this.token = localStorage.getItem('mean-token');
    }
    return this.token;
  }

  private request(method: 'post'|'get'|'delete', type: 'addLine'|'getAllLines'|'changeLine'|'deleteLine', line?:LineModel, lineId?:String): Observable<any>{
    let base;
    if(method === 'post'){
      if(type === 'changeLine'){
        base = this.httpClient.post(`/api/${type}/` + lineId, line);
      }
      else{
        base = this.httpClient.post(`/api/${type}`, line);
      }   
    }
    else if(method === 'get'){
      base = this.httpClient.get(`/api/${type}`, { headers: { Authorization: `Bearer ${this.getToken()}` }});
    }
    else{
      base= this.httpClient.delete(`/api/${type}/`+ lineId);
    }

    return base;
    
  }  

  public addLine(line:LineModel):Observable<any>{
    return this.request('post', 'addLine', line);
  }

  public changeLine(line: LineModel, lineId: String):Observable<any>{
    return this.request('post', 'changeLine', line, lineId);
  }

  public deleteLine(lineId: String){
    return this.request('delete', 'deleteLine', null, lineId);
  }

  public getAllLines(): Observable<any>{
    return this.request('get', 'getAllLines');
  }

 

  // addLine(line): Observable<any>{
  //   return this.httpClient.post(this.baseUrl+"/api/Lines/Add",line);
  // }

  // getAllLines(){
  //   return this.httpClient.get(this.baseUrl + "/api/Lines/GetAll");
  // }

  // deleteLine(idLine){
  //   return this.httpClient.delete(this.baseUrl + "/api/Lines/Delete?id=" + idLine);
  // }

  // // editStation(station):Observable<any>{
  // //   return this.httpClient.post(this.baseUrl+ "/api/Stations/Edit", station);
  // // }

  // editLine(id, line):Observable<any>{
  //   return this.httpClient.put(this.baseUrl + "/api/Lines/EditLine?id=" + id, line);
  // }

  // getLine(id: number){
  //   return this.httpClient.get(this.baseUrl + "/api/Lines/GetLine?id=" + id);
  // }

  // AlredyExistRegularNumber(line){
  //   return this.httpClient.post(this.baseUrl + "/api/Lines/AlredyExistRegularNumber", line);
  // }

}
