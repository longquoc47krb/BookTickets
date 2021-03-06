import { AuthService } from 'src/app/services/auth.service';
import { OnInit, Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup, NgForm, FormGroupDirective, FormControl, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { UserService } from './../../../services/user.service';
import { ToastComponent } from './../../../shared/toast/toast.component';
import { Router } from '@angular/router';
import { MustMatch } from 'src/app/helpers/must-match.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  submitted = false;
  loading = false;
  regrexVN =
    '^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ sW|_]+$';
  regrexPhone = '(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b';
  constructor(private formBuilder: FormBuilder,
    private router: Router,
    public toast: ToastComponent,
    private authService: AuthService) { }

  get f() {
    return this.registerForm.controls;
  }
  ngOnInit(): void {
    this.registerForm = this.formBuilder.group(
      {
        fullName: [
          '',
          [Validators.required, Validators.pattern(this.regrexVN)],
        ],
        username: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
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
        confirmPassword: ['', [Validators.required]],
        phone: ['', [Validators.required, CustomValidators.patternValidator(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, {
          isPhoneNumber: true
        })]],
      },
      {
        // check whether our password and confirm password match
        validator: CustomValidators.passwordMatchValidator
      }
    );
  }

  onSignUp() {
    var account = {
      username:this.registerForm.value.username,
      password:this.registerForm.value.password,
      fullName: this.registerForm.value.fullName,
      email:this.registerForm.value.email,
      phone:this.registerForm.value.phone
    }
    this.submitted = true;
    this.authService.registerUser(account);
  }

}
export class CustomValidators {
  static patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        // if control is empty return no error
        return null;
      }

      // test the value of the control against the regexp supplied
      const valid = regex.test(control.value);

      // if true, return no error (no error), else return error passed in the second parameter
      return valid ? null : error;
    };
  }

  static passwordMatchValidator(control: AbstractControl) {
    const password: string = control.get('password').value; // get password from our password form control
    const confirmPassword: string = control.get('confirmPassword').value; // get password from our confirmPassword form control
    // compare is the password math
    if (password !== confirmPassword) {
      // if they don't match, set an error in our confirmPassword form control
      control.get('confirmPassword').setErrors({ NoPassswordMatch: true });
    }
  }
}
