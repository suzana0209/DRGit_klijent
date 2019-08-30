import { Injectable } from '@angular/core';

import { Http, Response} from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TokenPayload } from '../models/modelsForNode/tokenPayload';
import { map } from 'rxjs/operators';
import { RegistrationModel } from '../models/registration.model';


export interface UserDetails {
  _id: string;
  email: string;
  name: string;
  surname: string;
  address: string;
  birthday: Date;
  image: string;
  activated: string;
  role: string;
  exp: number;
  iat: number;
}

interface TokenResponse {
  token: string;
}


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
    //base_url = 'http://localhost:52295'
    private token: string;

    constructor(private http: HttpClient, private router:Router) { }

    private saveToken(token:string): void{
      localStorage.setItem('mean-token', token);
      this.token = token;
    }

    private getToken(): string{
      if(!this.token){
        this.token = localStorage.getItem('mean-token');
      }
      return this.token;
    }

    public getUserDetails(): UserDetails{
      const token = this.getToken();
      let payload;
      if(token){
        payload = token.split('.')[1];
        payload = window.atob(payload);
        return JSON.parse(payload);
      }
      else{
        return null;
      }
    }

    public isLoggedIn(): boolean{
      const user = this.getUserDetails();
      if (user) {
        return user.exp > Date.now() / 1000;
      } else {
        return false;
      }
    }

    private request(method: 'post'|'get', type: 'logIn'|'register'|'profile'|'getUserData'|'edit'|'editPassword', user?: FormData, usForEdit?:RegistrationModel): Observable<any> {
      let base;
  
      if (method === 'post') {
        if(type === 'edit'){
          base = this.http.post(`/api/${type}`, user);
        }
        else{
          base = this.http.post(`/api/${type}`, user );
        //base = this.http.post(`/api/${type}`, user);
        }
      } else {
        base = this.http.get(`/api/${type}`, { headers: { Authorization: `Bearer ${this.getToken()}` }});
      }
  
      const request = base.pipe(
        map((data: TokenResponse) => {
          if (data.token) {
            if( type === 'logIn')
            {
              this.saveToken(data.token);
            }
            
          }
          return data;
        })
      );
  
      return request;
    }

    public edit(userr: FormData) : Observable<any>{
      return this.request('post', 'edit', userr);
    }

    public editPassword(userr: FormData): Observable<any>{
      return this.request('post', 'editPassword', userr);
    }
  
    public register(user: FormData): Observable<any> {
      return this.request('post', 'register', user);
    }
   
    public logIn(user: FormData): Observable<any> {
      return this.request('post', 'logIn', user);
    }
  
    public profile(): Observable<any> {
      return this.request('get', 'profile');
    }
  
    public logout(): void {
      this.token = '';
      window.localStorage.removeItem('mean-token');
      // localStorage.removeItem('jwt');
      localStorage.removeItem('role');
      localStorage.removeItem('name');
      this.router.navigateByUrl('/');
    }

    // public getUserData():Observable<any>{
    //   return this.request('get','getUserData');
    // }


  }

