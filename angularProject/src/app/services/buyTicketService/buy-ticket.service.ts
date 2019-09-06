import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PomModelForBuyTicket, PomModelForAddTicketPayPal } from 'src/app/models/pomModelForBuyTicket.model';
import { PomModelForAuthorization } from 'src/app/models/pomModelForAuth.model';

@Injectable({
  providedIn: 'root'
})
export class BuyTicketService {

    constructor(private http: Http, private httpClient: HttpClient) { }

    private token: string;

    private getToken(): string { 
      if (!this.token) {
        this.token = localStorage.getItem('mean-token');
      }
      return this.token;
    }
  
    private request(method: 'post'|'get'|'delete', type: 'priceForPaypal'|'postPayPalModel'|'getTicketWithCurrentAppUser'|'validateTicket'|'getNameOfCustomer'|'getAllTicket', 
    fd?:FormData, stId?:any, noviPar?:any, noviPar1?:any): Observable<any> {
      let base;
  
      if (method === 'post') {

        if( type === 'validateTicket'){
          //base = this.httpClient.post(`/api/${type}/` + stId, noviPar);
          base = this.httpClient.post(`/api/${type}/` + stId, noviPar);
        }
        else{
          base = this.httpClient.post(`/api/${type}`, fd);
        }
        
      }
      else if(method === 'delete'){
        // base = this.httpClient.delete(`/api/${type}/`+ stid);
      }  
      else {
        if(type === 'priceForPaypal'){
          base = this.httpClient.get(`/api/${type}`,{ headers: { Authorization: `Bearer ${this.getToken()}` }, params: {parami : stId, par:  noviPar, par1: noviPar1}});
        }
        else{
          base = this.httpClient.get(`/api/${type}`, { headers: { Authorization: `Bearer ${this.getToken()}` }});
        }
      }
    
      return base;
    }
  
    
  
    public priceForPaypal(param,aa, nn): Observable<any> {
      return this.request('get', 'priceForPaypal', null,param, aa,nn);
    }

    public postPayPalModel(fd:FormData): Observable<any>{
      return this.request('post', 'postPayPalModel', fd);
    }

    public getTicketWithCurrentAppUser(fd:FormData): Observable<any>{
      return this.request('post', 'getTicketWithCurrentAppUser', fd);
    }

    public validateTicket(param):Observable<any> {
      return this.request('post', 'validateTicket',null, param);
    }

    public getNameOfCustomer(fd:FormData): Observable<any>{
      return this.request('post', 'getNameOfCustomer', fd);
    }

    public getAllTicket(): Observable<any>{
      return this.request('get', 'getAllTicket');
    }
}
