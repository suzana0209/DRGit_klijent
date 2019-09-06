import {HttpInterceptor,HttpRequest,HttpHandler,HttpEvent} from '@angular/common/http' 
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor{
    constructor() {}
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        //throw new Error("Method not implemented.");
        let jwt = localStorage.jwt;
        console.log(req);
        if(jwt){
            req = req.clone({
                setHeaders: {
                    "Authorization": "Bearer "+jwt
                }
            });
        }
        return next.handle(req);
    }

} 