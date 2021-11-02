import { User } from './../shared/models/user.model';
import { UserService } from './user.service';
import { ToastComponent } from './../shared/toast/toast.component';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from "rxjs";
import {JwtHelperService} from '@auth0/angular-jwt'
import { Auth, AuthUser } from './../interface/AuthResponse';
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
    public toast: ToastComponent) { }


    loginUser(user: User) {
      return this.http
        .post<Auth>(this.endpoint + "/auth/login", user)
        .subscribe((res) => {
          localStorage.setItem("id", res.user.id);
          localStorage.setItem("role", res.user.role);
          localStorage.setItem("username", res.user.username);
          localStorage.setItem("access-token", res.tokens.access.token);
          if(String(localStorage.getItem("role")) === "admin"){
            this.router.navigate(["/admin/dashboard"]);
          }
          else{
            this.router.navigate(['/customer/dashboard']);
          }

        }, console.error);
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
    logout(){
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
        this.toast.setMessage('Đăng ký thành công','success');
        this.router.navigate(["/"]);
      }, error =>{
        if(error.status(500)){
          this.toast.setMessage('Lỗi server','danger');
        }
        else if(error.status(400)){
          this.toast.setMessage('Yêu cầu bị lỗi','danger');
        }
      });
  }

}
