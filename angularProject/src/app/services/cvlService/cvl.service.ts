import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class CvlService {

  private url = 'http://localhost:3000';
  private socket;
  observer: Observer<number>;


  public sendStations(s : any) {
    //let s = [];
    //s.push(new StationModel("stanica1","adresa1",43.23, 28.13,1));
    //s.push(new StationModel("stanica2","adresa2",43.23, 29.13,2));
   // s.push(new StationModel("stanica3","adresa3",43.23, 26.13,3));
    this.socket = io.connect(this.url);
    this.socket.emit('recive', s);
  }
  public readyToReceive(){
    this.socket.emit('send',"send");
  }

  getMessages(): Observable<number> {



    this.socket.on('data',
      (res) => {
        this.observer.next(res.data);
      });
    return this.createObservable();
  }

  createObservable(): Observable<number> {
    return Observable.create((observer: Observer<number>) => {
      this.observer = observer;
    });
  }
} 