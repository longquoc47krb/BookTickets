import { AuthUser } from './../interface/AuthResponse';
import { AuthService } from 'src/app/services/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrivateGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

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
    if (!user && !token) {
      this.router.navigate(["/login"]);
      return false;
    }
    switch (state.url) {
      case "/maps":
      case this.findText(state.url, "/table/"):
        if (user && user.role !== "admin") {
          this.router.navigate(["/customer/dashboard"]);
          return false;
        } else return true;

      default:
        return true;
    }
  }

  private findText(url = "", path = "") {
    if (url.includes(path)) {
      return url;
    }
  }
}
