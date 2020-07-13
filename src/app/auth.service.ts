import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

import { of } from 'rxjs/internal/observable/of';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn: boolean = true;
  tryingUrl;
  constructor(private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    let url: string = state.url;
    console.log('inner', url);
    this.tryingUrl = new Observable((subscriber) => {
      subscriber.next(url);
    });
    return this.checkLogin(url);
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return this.canActivate(route, state);
  }

  // checkLogin(url: string): boolean {
  //   if (this.authService.isLoggedIn) {
  //     return true;
  //   }

  //   // Store the attempted URL for redirecting
  //   this.authService.redirectUrl = url;

  //   // Navigate to the login page with extras
  //   this.router.navigate(['/login']);
  //   return false;
  // }
  checkLogin(url: string): boolean {
    if (this.isLoggedIn) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}
