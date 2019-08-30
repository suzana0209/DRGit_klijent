import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VerificationService {

  baseUrl = "http://localhost:52295"
  

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

  //  authorizeAdmin(adminId): Observable<any> {
  //   return this.httpClient.post(this.baseUrl + "/api/Account/AuthorizeAdmin", adminId);
  // }
 

  // public getAllStations(): Observable<any> {
  //   return this.request('get', 'getAllStations');
  // }

  // public getAllStations(): Observable<any> {
  //   return this.request('get', 'getAllStations');
  // }

  

  // getAwaitingAdmins(): Observable<any> {
  //   return this.httpClient.get(this.baseUrl + "/api/Account/GetAwaitingAdmins");
  // }

  //  authorizeAdmin(adminId): Observable<any> {
  //   return this.httpClient.post(this.baseUrl + "/api/Account/AuthorizeAdmin", adminId);
  // }

  //  getAwaitingControllers(): Observable<any> {
  //   return this.httpClient.get(this.baseUrl + "/api/Account/GetAwaitingAControllers");
  // }

  //  authorizeController(controllerId): Observable<any> {
  // //  let data = `${controllerId}`;
  //   let headers = new HttpHeaders();
  //   headers = headers.append( "Content-type","application/json");
  //   return this.httpClient.post(this.baseUrl + "/api/Account/AuthorizeController", controllerId);
  // }

  // getAwaitingAppUsers(): Observable<any> {
  //   return this.httpClient.get(this.baseUrl + "/api/Account/GetAwaitingAppUsers");
  // }

  // authorizeAppUser(appUserId): Observable<any> {
  //     let headers = new HttpHeaders();
  //     headers = headers.append( "Content-type","application/json");
  //     return this.httpClient.post(this.baseUrl + "/api/Account/AuthorizeAppUser", appUserId);
  //   }

  //   denyAppUser(appUserId): Observable<any> {
  //     let headers = new HttpHeaders();
  //     headers = headers.append( "Content-type","application/json");
  //     return this.httpClient.post(this.baseUrl + "/api/Account/DenyAppUser", appUserId);
  //   }
  
  //   denyAdmin(adminId): Observable<any> {
  //     let headers = new HttpHeaders();
  //     headers = headers.append( "Content-type","application/json");
  //     return this.httpClient.post(this.baseUrl + "/api/Account/DenyAdmin", adminId);
  //   }

  //   denyControll(conttrollerId): Observable<any> {
  //     let headers = new HttpHeaders();
  //     headers = headers.append( "Content-type","application/json");
  //     return this.httpClient.post(this.baseUrl + "/api/Account/DenyControll", conttrollerId);
  //   }

  //   getDeniedUsers(): Observable<any> {
  //     return this.httpClient.get(this.baseUrl + "/api/Account/GetDenyUsers");
  //   }

  //   //
  //   authorizeDeniedUser(userId): Observable<any> {
  //       let headers = new HttpHeaders();
  //       headers = headers.append( "Content-type","application/json");
  //       return this.httpClient.post(this.baseUrl + "/api/Account/AuthorizeDeniedUser", userId);
  //     }



  
}
