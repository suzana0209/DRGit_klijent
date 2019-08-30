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

    constructor(lineId: string, dayId: string, departures: string, vId:string){
        this.LineId = lineId;
        this.DayId = dayId;
        this.Departures = departures;
        this.VehicleId = vId;
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
    LineId: number;
    DayId: number;
    Departures: string
    NewDepartures: string

    constructor(lineId: number, dayId: number, departures: string, newDepartures: string){
        this.LineId = lineId;
        this.DayId = dayId;
        this.Departures = departures;
        this.NewDepartures = newDepartures;
    }
}
