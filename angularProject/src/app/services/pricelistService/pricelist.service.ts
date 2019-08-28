import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PriceListModel } from 'src/app/models/priceList.model';
import { TicketPricesPomModel } from 'src/app/models/ticketPrice.model';

@Injectable({
  providedIn: 'root'
})
export class PricelistService {
  base_url = "http://localhost:52295"
  private token: string;

  constructor(private http: Http, private httpClient:HttpClient) { }

  private getToken(): string{
    if(!this.token){
      this.token = localStorage.getItem('mean-token');
    }
    return this.token;
  }

  private request(method: 'post'|'get', type: 'addPricelist'|'getPricelist'|'getTicketPrices', pricelist?:TicketPricesPomModel, param?:any): Observable<any>{
    let base;
   
    if(method ==='get'){
      if(type === 'getTicketPrices'){
        //base = this.httpClient.get(`/api/${type}/` + idPL);
        base = this.httpClient.get(`/api/${type}`,  { headers: { Authorization: `Bearer ${this.getToken()}` }, params: {parami : param}});
      }else{
        base = this.httpClient.get(`/api/${type}`, { headers: { Authorization: `Bearer ${this.getToken()}` }});
      }
      
    }
    else{
      base = this.httpClient.post(`/api/${type}`, pricelist);
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




  addTicketPrices(ticketprices): any{
    return this.httpClient.post(this.base_url+"/api/TicketPrices/Add",ticketprices);
  }
  getValidPrices(id){
    return this.httpClient.get(this.base_url+"/api/TicketPrices/GetValidPrices?id=" + id);
  }

  // addPricelist(pricelist): any{
  //   return this.httpClient.post(this.base_url+"/api/Pricelist/Add",pricelist);
  // }  

  getAllPricelists() {
    return this.httpClient.get(this.base_url+"/api/Pricelist/GetPricelists");
  }

  // getPricelist(){
  //   return this.httpClient.get(this.base_url+"/api/Pricelist/GetPricelist");
  // }

  getPricelistLast(){
    return this.httpClient.get(this.base_url+"/api/Pricelist/GetPricelistLast");
  }
  
  // deletePricelist(id){
  //   return this.httpClient.delete(this.base_url+"/api/Pricelist/Delete?id=" + id);
  // }

  // changePricelist(id,pricelist): Observable<any>{
  //   return this.httpClient.put(this.base_url+"/api/Pricelist/Change?id=" + id,pricelist);
  // }

  calculateTicketPrice(pomModel){
    return this.httpClient.post(this.base_url+"/api/Pricelist/Calculate",pomModel);
  }

  CheckDateTime(pom){
    return this.httpClient.post(this.base_url + "/api/Pricelist/CheckDateTime", pom);
  }

}
