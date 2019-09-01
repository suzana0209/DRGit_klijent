import { Time } from '@angular/common';

export class TimetableModel{
    //Id: number;
    LineId: string;
    DayId: string;
    Departures: Time
    VehicleId?:string


    constructor(lineId: string, dayId: string, departures: Time, vId?:string){
        this.LineId = lineId;
        this.DayId = dayId;
        this.Departures = departures;
        this.VehicleId = vId;
    }
}
export class TimetableModel2{
    LineId: string;
    DayId: string;
    Departures: string;
    VehicleId: string;
    TipDodavanja: string;
    Idd?: string;

     constructor(lineId: string, dayId: string, departures: string, vId:string, tip: string, idd: string){
        this.LineId = lineId;
        this.DayId = dayId;
        this.Departures = departures;
        this.VehicleId = vId;
        this.TipDodavanja = tip;
        this.Idd = idd;
    }
} 

export class TimetableModel3{
    LineId: number;
    DayId: string;

    constructor(lineId: number, dayId: string){
        this.LineId = lineId;
        this.DayId = dayId;
    }
}

export class TimetableModel4{
    Idd: string;
    LineId: string;
    DayId: string;
    Departures: string
    NewDepartures: string

    constructor(lineId: string, dayId: string, departures: string, newDepartures: string, idd: string){
        this.LineId = lineId;
        this.DayId = dayId;
        this.Departures = departures;
        this.NewDepartures = newDepartures;
        this.Idd = idd;
    }
}
