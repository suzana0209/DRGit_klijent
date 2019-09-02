export class PomModelForPriceList{
    PriceListId: string;
    PassangerType: string;
    TypeOfTicket: string;

    constructor(priceListId: string, passType:string, typeOfTicket: string){
        this.PriceListId = priceListId;
        this.PassangerType = passType;
        this.TypeOfTicket = typeOfTicket;
    }
}