import { Router } from '@angular/router';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './../shared/models/user.model';
import { Injectable } from '@angular/core';
import { UserPages } from './../interface/UserResponse'
@Injectable(
)
export class UserService {
  endpoint = 'http://localhost:3000/v1/'
  constructor(private http: HttpClient, private router: Router) { }

  user: User[];
  getUsers() {
    return this.http.get<User[]>(this.endpoint + "users");
  }

  countUsers(): Observable<number> {
    return this.http.get<number>('users/count');
  }

  createUser(user: User) {
    const token = localStorage.getItem("x-token");
    const headers = new HttpHeaders().append(
      "Authorization",
      "Bearer " + token
    );
    this.http
      .post(this.endpoint + "/users", user, {
        headers,
      })
  }

  getUser(user: User): Observable<User> {
    return this.http.get<User>(`users/${user._id}`);
  }

  editUser(user: User): Observable<any> {
    return this.http.put(`users/${user._id}`, user, { responseType: 'text' });
  }

  deleteUser(user: User): Observable<any> {
    return this.http.delete(`users/${user._id}`, { responseType: 'text' });
  }

}
