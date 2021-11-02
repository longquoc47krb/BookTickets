import { User } from './../../../shared/models/user.model';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  constructor(private fb:FormBuilder, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    if (this.authService.loggedIn) {
      this.router.navigate(['/']);
    }
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  get username() { return this.loginForm.get('username'); }
  get password() { return this.loginForm.get('password'); }
  onSubmit(){
    this.submitted = true;
    if (!this.loginForm.invalid) {
      const user: User = this.loginForm.value;
      this.authService.loginUser(user);
      alert('Dang nhap thanh cong')
    }
  }
}
