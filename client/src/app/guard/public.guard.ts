import { AuthService } from './../services/auth.service';
import { AuthUser } from './../interface/AuthResponse';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PublicGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const user: AuthUser = this.authService.getAuth();
    const token = localStorage.getItem("access-token");
    if (!user && !token) return true;
    else {
      this.router.navigate(["/"]);
      return false;
    }
  }
}
