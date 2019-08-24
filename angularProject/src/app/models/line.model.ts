import { StationModel } from './station.model';

export class LineModel{
    Id: number;
    RegularNumber: string;
    ListOfStations: StationModel[] = [];
    Version: number;
    _id: string;
    ColorLine: string;
    

    constructor(id: number, regularNumber: string, 
        listOfStatios: StationModel[], 
        version? : number, id1?: string, colorLine?:string){
        this.Id = id;
        this.RegularNumber = regularNumber;
        this.ListOfStations = listOfStatios;
        this.Version = version;
        this._id = id1;
        this.ColorLine = colorLine;

    }
}

