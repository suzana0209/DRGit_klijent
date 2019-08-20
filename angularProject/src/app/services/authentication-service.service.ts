import { Injectable } from '@angular/core';

import { Http, Response} from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TokenPayload } from '../models/modelsForNode/tokenPayload';
import { map } from 'rxjs/operators';


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

    private request(method: 'post'|'get', type: 'logIn'|'register'|'profile', user?: TokenPayload): Observable<any> {
      let base;
  
      if (method === 'post') {
        base = this.http.post(`/api/${type}`, user);
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
  
    public register(user: TokenPayload): Observable<any> {
      return this.request('post', 'register', user);
    }
  
    public logIn(user: TokenPayload): Observable<any> {
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



    // private parseData(res: Response){
    //   return res.json() || [];
    // }

    // register(user): Observable<any> {
    //     console.log(user);
        
    //     return this.httpClient.post(this.base_url+"/api/Account/Register",user).pipe(
    //       catchError(e=>throwError(this.errorHandler(e)))
    //     );
    // }

    // errorHandler(error){
    //   console.log("Greska: ", error);
    // }

    

    // logIn(loginData: any){

    //   let headers = new HttpHeaders();
    //   headers = headers.append('Content-type', 'application/x-www-form-urlencoded');

    //   //headerObj.append('Authorization','Basic '+btoa(login.usrNm+':'+login.pswd));
    //   headers.append('Authorization','Basic '+btoa(loginData.username+':'+loginData.password));

    //   console.log(loginData.Email);
    //   console.log(loginData.Password);

    //   console.log(localStorage.role);

    //   if(!localStorage.jwt){
    //     let x = this.httpClient.post(this.base_url+'/oauth/token',`username=${loginData.Email}&password=${loginData.Password}&grant_type=password`, {"headers":headers}) as Observable<any>

    //     x.subscribe(
    //       res => {
    //         console.log(res.access_token);

    //         let jwt = res.access_token;

    //         let jwtData = jwt.split('.')[1]
    //         let decodedJwtJsonData = window.atob(jwtData)
    //         let decodedJwtData = JSON.parse(decodedJwtJsonData)

    //         let role = decodedJwtData.role

    //         console.log('jwtData: ' + jwtData)
    //         console.log('decodedJwtJsonData: ' + decodedJwtJsonData)
    //         console.log(decodedJwtData)
    //         console.log('Role ' + role)

    //         let logUser = decodedJwtData.unique_name;

    //         localStorage.setItem('jwt', jwt)
    //         localStorage.setItem('role', role);
    //         localStorage.setItem('name',logUser);

    //         window.location.href="/busLines";
    //       },
    //       err => {
    //         alert("Invalid username or password!");
    //       }
    //     );
    //   }
    //   else{
    //       alert("Already logged in ! ");
    //     // console.log("Error occured - ELSE");
    //   }
       
    // }


  }

