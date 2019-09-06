import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LineModel } from 'src/app/models/line.model';


@Injectable({
  providedIn: 'root'
})
export class LineService {

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

}
