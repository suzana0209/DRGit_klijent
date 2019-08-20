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

  private request(method: 'get', type: 'getPassengerTypes'): Observable<any> {
    let base;

    
     return base = this.http.get(`/api/${type}`).pipe();
    

    // const request = base.pipe(
    //   map((data: TokenResponse) => {
    //     if (data.token) {
    //       this.saveToken(data.token);
    //     }
    //     return data;
    //   })
    // );

    // return request;
  }

  public getPassengerTypes(): Observable<any> {
    return this.request('get', 'getPassengerTypes');
  }
}
