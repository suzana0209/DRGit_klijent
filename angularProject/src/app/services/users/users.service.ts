import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })

export class UsersService{
    constructor(private http: Http, private httpClient: HttpClient) { }
    

    private token: string;
    private request(method: 'post'|'get', type: 'getUserData',  email?:String):Observable<any>{
      let base;

      if (method === 'post') {
       // base = this.httpClient.post(`/api/${type}`, user);
      // }else if(method === 'delete'){
      //   base = this.httpClient.delete(`/api/${type}/`+ stid);
       } 
      else {
        base = this.httpClient.get(`/api/${type}/` + email);
      }

      return base;
    }



    public getUserData(email:String){ 
      return this.request('get', 'getUserData', email);
    }   
}