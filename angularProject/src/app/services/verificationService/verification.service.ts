import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VerificationService {

  
  constructor(private http: Http, private httpClient: HttpClient) { }

  private token: string;

  private getToken(): string { 
    if (!this.token) {
      this.token = localStorage.getItem('mean-token');
    }
    return this.token;
  }

  private request(method: 'post'|'get'|'delete', type: 'getAwaitingAdmins'|'getAwaitingAppUsers'|'getAwaitingControllers'|
      'autorizeAdmin'|'authorizeController'|'authorizeAppUser'|'denyAdmin'|'denyController'|'denyAppUser'|'authorizeDeniedUser'|
      'getDeniedUsers', fd?:FormData): Observable<any> {
    let base;
    if(method === 'get'){
      base = this.httpClient.get(`/api/${type}`, { headers: { Authorization: `Bearer ${this.getToken()}` }});
    }
    else if(method === 'post'){
      base = this.httpClient.post(`/api/${type}`,fd);}
    

    return base;
  }

  

  public getAwaitingAdmins(): Observable<any> {
    return this.request('get', 'getAwaitingAdmins');
  }

  public getAwaitingControllers(): Observable<any> {
    return this.request('get', 'getAwaitingControllers');
  }

  public getAwaitingAppUsers(): Observable<any> {
    return this.request('get', 'getAwaitingAppUsers');
  }

  public authorizeAdmin(fd:FormData): Observable<any>{
    return this.request('post', 'autorizeAdmin', fd);
  }

  public authorizeController(fd:FormData):Observable<any>{
    return this.request('post', 'authorizeController', fd);
  }

  public authorizeAppUser(fd:FormData): Observable<any>{
    return this.request('post', 'authorizeAppUser', fd);
  }

  public denyAdmin(fd:FormData): Observable<any>{
    return this.request('post', 'denyAdmin', fd);
  }

  public denyController(fd:FormData):Observable<any>{
    return this.request('post', 'denyController', fd);
  }

  public denyAppUser(fd:FormData): Observable<any>{
    return this.request('post', 'denyAppUser', fd);
  }

  public authorizeDeniedUser(fd:FormData): Observable<any>{
    return this.request('post', 'authorizeDeniedUser', fd);
  }

  public getDeniedUsers():Observable<any>{
    return this.request('get', 'getDeniedUsers'); 
  }
}
