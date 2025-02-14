import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild, UrlTree, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import Swal from "sweetalert2";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(private _cookie: CookieService, private _route: Router) { }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot)
    : boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const sessionId = localStorage.getItem('sessionID');
    //console.log('state.url - ' + state.url);
    //console.log('childRoute.url - ' + childRoute.url);
    if (sessionId && sessionId !== null && sessionId !== '') {
      return true;
    }
    //Swal.fire({
    //  icon: "info",
    //  title: "Invalid session",
    //  text: "Sorry, your session has expired. We are routing you to login page.",
    //  showConfirmButton: false,
   //   timer: 3000,
    //}).then(()=>{
      this._route.navigate(['/login'],{queryParams :{redirectTo:state.url}});
      return false;
    //});

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const sessionId = localStorage.getItem('sessionID');
    //console.log('state.url - ' + state.url);
    //console.log('childRoute.url - ' + route.url);
    if (sessionId && sessionId !== null && sessionId !== '') {
      return true;
    }else {
      //Swal.fire({
      //  icon: "info",
      //  title: "Invalid session",
      //  text: "Sorry, your session has expired. We are routing you to login page.",
      //  showConfirmButton: false,
      //  timer: 3000,
     // }).then(()=>{
        this._route.navigate(['/login'],{queryParams :{redirectTo:state.url}});
        return false;
     // })
    }
  }
}
