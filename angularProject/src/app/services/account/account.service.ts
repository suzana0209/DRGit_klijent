import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { map } from 'rxjs/operators';


interface TokenResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private token: string;

  

  constructor(private http: HttpClient, private router: Router) { }

  private saveToken(token: string): void {
    localStorage.setItem('mean-token', token);
    this.token = token;
  }


  private getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('mean-token');
    }
    return this.token;
  }

  private request(method: 'get'|'post', type: 'getPassengerTypes'|'getUserData', param?:any): Observable<any> {
    let base;
    if(method === 'get'){
      if(type === 'getPassengerTypes'){
        base = this.http.get(`/api/${type}`).pipe();
      }
      else if(type === 'getUserData'){
        base = this.http.get(`/api/${type}`,  { headers: { Authorization: `Bearer ${this.getToken()}` }, params: {parami : param}});
      }  
    }
    
     return base;
  
  }

  public getPassengerTypes(): Observable<any> {
    return this.request('get', 'getPassengerTypes');
  }

  public getUserData(parameter: any): Observable<any>{
    return this.request('get', 'getUserData', parameter);
  }
}
