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

  baseUrl = "http://localhost:52295"

    constructor(private http: Http, private httpClient: HttpClient) { }

    private token: string;

    private getToken(): string { 
      if (!this.token) {
        this.token = localStorage.getItem('mean-token');
      }
      return this.token;
    }
  
    private request(method: 'post'|'get'|'delete', type: 'priceForPaypal'|'postPayPalModel'|'getTicketWithCurrentAppUser'|'validateTicket'|'getNameOfCustomer', 
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
        // else if(type === 'getTicketWithCurrentAppUser'){
        //   base = this.httpClient.get(`/api/${type}`,{ headers: { Authorization: `Bearer ${this.getToken()}` }, params: {parami : stId1}});
        // }
        else{
          base = this.httpClient.get(`/api/${type}`, { headers: { Authorization: `Bearer ${this.getToken()}` }});
        }
        
        //base = this.httpClient.get(`/api/${type}`, { headers: { Authorization: `Bearer ${this.getToken()}` }}); 
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
   
  
    // public getAllStations(): Observable<any> {
    //   return this.request('get', 'getAllStations');
    // }
  
    // public getAllStations(): Observable<any> {
    //   return this.request('get', 'getAllStations');
    // }
  
    // public changeStation(stat:StationModel): Observable<any>{
    //   return this.request('post', 'changeStation', stat);
    // }
  
    // public deleteStation(stid:String):Observable<any>{
    //   return this.request('delete', 'deleteStation',null,stid);
    // }


    
    buyTicket(buyTicketForm: PomModelForAddTicketPayPal) {
     return this.httpClient.post(this.baseUrl + "/api/Tickets/Add", buyTicketForm);
     
    //return this.httpClient.put(this.baseUrl + "/Tickets/Add", {email, typeOfTicket})
    }

    buyTicketViaEmail(ticket): Observable<any>{

      return this.httpClient.post(this.baseUrl + "/api/Tickets/SendMail",ticket);
   }

  //  validateTicket(idTicket){
  //    return this.httpClient.post(this.baseUrl + "/api/Tickets/ValidateTicket", idTicket); //idTicket -> pomModelForAuthorization
  //  }

   GetTicketWithCurrentAppUser(idUser:string) {
     return this.httpClient.get(this.baseUrl + "/api/Tickets/GetTicketWithCurrentAppUser?pom="+ idUser);
   }

   GetNameOfCustomer(idTicket){
     return this.httpClient.get(this.baseUrl + "/api/Tickets/GetNameOfCustomer?idTicket=" + idTicket);
   }

  //  PriceForPayPal(ticket){
  //    return this.httpClient.post(this.baseUrl + "/api/Tickets/PriceForPayPal", ticket);
  //  }

}
