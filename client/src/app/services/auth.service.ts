import { User } from './../shared/models/user.model';
import { UserService } from './user.service';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { JwtHelperService } from '@auth0/angular-jwt'
import { Auth, AuthUser, ResetPassword } from './../interface/AuthResponse';

import { ToastrService } from 'ngx-toastr';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loggedIn = false;
  isAdmin = false;

  user: AuthUser = null;

  account = {
    username: '',
    password: ''
  }

  private endpoint = 'http://localhost:3000/v1'
  private urlTicket = "http://localhost:8082/api/ve";


  constructor(public http: HttpClient,
    private userService: UserService,
    private router: Router,
    private jwtHelper: JwtHelperService,
    public toast: ToastrService) { }

  resetPassword(model) {
    this.http.post(this.endpoint + '/reset-password', model).subscribe((res: any) => {
      this.toast.success(res.message);
      this.router.navigate(['/login']);
    }, (res: any) => {
      this.toast.error(res.error.message, 'Error');
    });
  }
  loginUser(user: User) {
    return this.http
      .post<Auth>(this.endpoint + "/auth/login", user)
      .subscribe((res) => {
        localStorage.setItem("id", res.user.id);
        localStorage.setItem("role", res.user.role);
        localStorage.setItem("username", res.user.username);
        localStorage.setItem("access-token", res.tokens.access.token);
        if (String(localStorage.getItem("role")) === "admin") {
          this.router.navigate(["/admin/dashboard"]);
        }
        else {
          this.router.navigate(['/customer/dashboard']);
        }

      }, console.error);
  }
  verifyEmail(token: string) {
    return this.http.post(this.endpoint + '/auth/verify-email', token);
  }
  forgetPasswordLink(email) {
    return this.http.post(this.endpoint + '/auth/forgot-password', email);
  }

  refreshAuth() {
    const id = localStorage.getItem("id");
    const token = localStorage.getItem("access-token");
    const headers = new HttpHeaders().append(
      "Authorization",
      "Bearer " + token
    );
    return this.http
      .get(this.endpoint + "/users/" + id, {
        headers,
      })
  }

  getAuth() {
    return this.user;
  }

  getRole() {
    return this.user.role;
  }
  logout() {
    localStorage.clear();
    this.router.navigate(["/"]);
  }

  postChangePassword(token: any, userName: any, passWordOld: any, passWord: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*",
        'Authorization': token
      })
    };

    return this.http.post(this.endpoint + "/change-password?user_name=" + userName.toString() + "&password_old=" + passWordOld.toString() + "&password=" + passWord.toString() + "", null, httpOptions);
  }

  // getInforCustomer(token: any, customerId: any): Observable<any> {
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       "Access-Control-Allow-Origin": "*",
  //       'Authorization': token
  //     })
  //   };
  //   return this.http.get(this.endpoint + "/" + customerId, httpOptions);

  // }

  getTicketHistory(token: any, customerId: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*",
        'Authorization': token
      })
    };
    return this.http.get(this.urlTicket + "/thong-ke-theo-khach-hang?khach_hang_id=" + customerId, httpOptions);
  }

  postChangeInforPersional(token: any, customerID: any, customerInfor: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*",
        'Authorization': token
      })
    };
    return this.http.patch(this.endpoint + "/" + customerID + "/", customerInfor, httpOptions);
  }
  registerUser(user: User) {
    return this.http
      .post<Auth>(this.endpoint + "/auth/register", user)
      .subscribe((res) => {
        localStorage.setItem("id", res.user.id);
        localStorage.setItem("role", res.user.role);
        localStorage.setItem("username", res.user.username);
        localStorage.setItem("access-token", res.tokens.access.token);
        this.toast.success('Đăng ký thành công');
        this.router.navigate(["/"]);
      }, error => {
        this.toast.error(error.error.message)
      });
  }

}
