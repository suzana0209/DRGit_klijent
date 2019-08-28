export class VehicleModel {
    Id: number;
    Type: string;
  
    constructor(id: number,type?: string) {
        this.Id = id;
        this.Type = type;
    }
  }