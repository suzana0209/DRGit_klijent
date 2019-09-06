import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PriceListModel } from 'src/app/models/priceList.model';
import { TicketPricesPomModel } from 'src/app/models/ticketPrice.model';
import { PomModelForPriceList } from 'src/app/models/pomModelForPriceList.model';

@Injectable({
  providedIn: 'root'
})
export class PricelistService {
  private token: string;

  constructor(private http: Http, private httpClient:HttpClient) { }

  private getToken(): string{
    if(!this.token){
      this.token = localStorage.getItem('mean-token');
    }
    return this.token;
  }

  private request(method: 'post'|'get', type: 'addPricelist'|'getPricelist'|'getTicketPrices'|'calculatePrice', 
  pricelist?:TicketPricesPomModel, param?:any, fd?:FormData): Observable<any>{
    let base;
   
    if(method ==='get'){
      if(type === 'getTicketPrices' || type === 'calculatePrice'){
        //base = this.httpClient.get(`/api/${type}/` + idPL);
        base = this.httpClient.get(`/api/${type}`,  { headers: { Authorization: `Bearer ${this.getToken()}` }, params: {parami : param}});
      }else{
        base = this.httpClient.get(`/api/${type}`, { headers: { Authorization: `Bearer ${this.getToken()}` }});
      }
      
    }  
    else{
      if(type === 'calculatePrice'){
        base = this.httpClient.post(`/api/${type}`, fd);
      }
      else{
        base = this.httpClient.post(`/api/${type}`, pricelist);
      }
     
    }

    return base;
    
  }  

  public addPricelist(pricelist:TicketPricesPomModel):Observable<any>{
    return this.request('post', 'addPricelist', pricelist);
  }

  public getPricelist(): Observable<any>{
    return this.request('get','getPricelist');
  }

  public getTicketPrices(idPL:any): Observable<any>{
    return this.request('get', 'getTicketPrices', null,idPL);
  }

  public calculatePrice(pp: FormData): Observable<any>{
    return this.request('post', 'calculatePrice', null,null,pp);
  }
}
