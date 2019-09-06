import { Component, NgZone } from '@angular/core';
import { AuthenticationService } from './services/authentication/authentication.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
  // providers: [RequestsService],
})
export class AppComponent {
  title = 'angularProject';

  constructor(public auth: AuthenticationService){}

}
