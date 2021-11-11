import { CustomValidators } from './../register/register.component';
import { ToastComponent } from './../../../shared/toast/toast.component';
import { AuthService } from './../../../services/auth.service';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  ngOnInit(): void {
    this.resetForm = this.formBuilder.group(
      {
        password: ['', [Validators.required, // check whether the entered password has a number
        CustomValidators.patternValidator(/\d/, {
          hasNumber: true
        }),
        // check whether the entered password has upper case letter
        CustomValidators.patternValidator(/[A-Z]/, {
          hasCapitalCase: true
        }),
        // check whether the entered password has a lower case letter
        CustomValidators.patternValidator(/[a-z]/, {
          hasSmallCase: true
        }),
        // check whether the entered password has a special character
        CustomValidators.patternValidator(
          /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
          {
            hasSpecialCharacters: true
          }
        ),
        Validators.minLength(8)
        ]],
        confirmPassword: ['', [Validators.required]]
      },
      {
        // check whether our password and confirm password match
        validator: CustomValidators.passwordMatchValidator
      }
    );
  }
  resetForm: FormGroup;
  submitted = false;
  password: any;
  confirmPassword: any;
  constructor(public authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private toast: ToastComponent,) { }


  onReset() {
    var account = {
      token: this.route.snapshot.params.token,
      password: this.resetForm.value.password
    }
    console.log("token:", account.token);
    this.submitted = true;
    this.authService.resetPassword(account);
  }

}
