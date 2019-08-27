import { PriceListModel } from './priceList.model';

export class TicketPricesPomModel{
    Hourly: number;
    Daily: number;
    Monthly: number;
    Yearly: number;
    IdPriceList: number;
    PriceList: PriceListModel;
    
    constructor( h: number, d: number,m: number,y: number, idp: number, prl: PriceListModel ){
        this.Hourly = h;
        this.Daily = d;
        this.Monthly = m;
        this.Yearly = y;
        this.IdPriceList = idp;
        this.PriceList = prl;
    }
} 