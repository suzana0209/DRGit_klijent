import { TicketPricesPomModel } from '../ticketPrice.model';
import { PriceListModel } from '../priceList.model';

export class ValidForPriceListModel{
    passangerTypeOk: boolean = true;
    typeOfTicketOk: boolean = true;

    // PassangerType: string;
    // TypeOfTicket: string;

    validate(pomModelForPriceList){
        let wrong = false;
        if(pomModelForPriceList.PassangerType == null || pomModelForPriceList.PassangerType == ""){
            this.passangerTypeOk = false;
            wrong = true;
        }else this.passangerTypeOk = true;

        if(pomModelForPriceList.TypeOfTicket == null || pomModelForPriceList.TypeOfTicket == ""){
            this.typeOfTicketOk = false;
            wrong = true;
        }else this.typeOfTicketOk = true;

        return wrong;
    }
}

export class ValidForPriceModel{
    HourlyOk: boolean = true;
    HourlyOk0: boolean = true;
    HourlyOkMinus: boolean = true;

    dailyOk: boolean = true;
    dailyOk0: boolean = true;
    dailyOkMinus: boolean = true;

    monthlyOk: boolean = true;
    monthlyOk0: boolean = true;
    mohtlyOkMinus: boolean = true;

    YearlyOk: boolean = true;
    YearlyOk0: boolean = true;
    YearlyOkMinus: boolean = true;

    validate(pom: TicketPricesPomModel){
        let wrong = false;

        if(pom.Hourly == null || pom.Hourly.toString() == ""){
            this.HourlyOk = false;
            this.HourlyOk0 = true;  //ovo mora zbog ispisa poruka
            this.HourlyOkMinus = true;
            wrong = true;
        }
        else{
            if(pom.Hourly == 0){
                this.HourlyOk0 = false;
                this.HourlyOk = true;
                this.HourlyOkMinus = true;
                wrong = true;
            }
            else if(pom.Hourly < 0){
                this.HourlyOkMinus = false;
                this.HourlyOk = true;
                this.HourlyOk0 = true;
                wrong = true;
            }
            else{
                this.HourlyOk = true;
                this.HourlyOk0 = true;
                this.HourlyOkMinus = true;
            }
        }

        if(pom.Monthly == null || pom.Monthly.toString() == ""){
            this.monthlyOk = false;
            this.monthlyOk0 = true;  //ovo mora zbog ispisa poruka
            this.mohtlyOkMinus = true;
            wrong = true;
        }
        else{
            if(pom.Monthly == 0){
                this.monthlyOk0 = false;
                this.monthlyOk = true;
                this.mohtlyOkMinus = true;
                wrong = true;
            }
            else if(pom.Monthly < 0){
                this.mohtlyOkMinus = false;
                this.monthlyOk = true;
                this.monthlyOk0 = true;
                wrong = true;
            }
            else{
                this.monthlyOk = true;
                this.monthlyOk0 = true;  //ovo mora zbog ispisa poruka
                this.mohtlyOkMinus = true;
            }
        }

        if(pom.Daily == null || pom.Daily.toString() == ""){
            this.dailyOk = false;
            this.dailyOk0 = true;  //ovo mora zbog ispisa poruka
            this.dailyOkMinus = true;
            wrong = true;
        }
        else{
            if(pom.Daily == 0){
                this.dailyOk0 = false;
                this.dailyOk = true;
                this.dailyOkMinus = true;
                wrong = true;
            }
            else if(pom.Daily < 0){
                this.dailyOkMinus = false;
                this.dailyOk = true;
                this.dailyOk0 = true;
                wrong = true;
            }
            else{
                this.dailyOk = true;
                this.dailyOk0 = true;  //ovo mora zbog ispisa poruka
                this.dailyOkMinus = true;
            }
        }

        if(pom.Yearly == null || pom.Yearly.toString() == ""){
            this.YearlyOk = false;
            this.YearlyOk0 = true;  //ovo mora zbog ispisa poruka
            this.YearlyOkMinus = true;
            wrong = true;
        }
        else{
            if(pom.Yearly == 0){
                this.YearlyOk0 = false;
                this.YearlyOk = true;
                this.YearlyOkMinus = true;
                wrong = true;
            }
            else if(pom.Yearly < 0){
                this.YearlyOkMinus = false;
                this.YearlyOk = true;
                this.YearlyOk0 = true;
                wrong = true;
            }
            else{
                this.YearlyOk = true;
                this.YearlyOk0 = true;  //ovo mora zbog ispisa poruka
                this.YearlyOkMinus = true;
            }
        }
        return wrong;
    }
}

export class ValidForDateTimeInPriceList{
    fromTimeOk: boolean = true;
    toTimeOk: boolean = true;

    validate(pom:PriceListModel){
        let wrong = false;

        if(pom.FromTime == null || pom.FromTime.toString() == ""){
            this.fromTimeOk = false;
            wrong = true;
        }
        else this.fromTimeOk = true;

        if(pom.ToTime == null || pom.ToTime.toString() == ""){
            this.toTimeOk = false;
            wrong = true;
        }
        else this.toTimeOk = true;
        

        return wrong;
    }
}