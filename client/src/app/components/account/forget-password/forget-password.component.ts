import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {


  submitted = false;
  emailForm: FormGroup;
  constructor(private formBuilder: FormBuilder, private authService: AuthService, private toast: ToastrService) { }

  ngOnInit(): void {
    this.emailForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    }
    )
  }

  onReset() {
    this.submitted = true;
    console.log(this.emailForm.value);
    this.authService.forgetPasswordLink(this.emailForm.value).subscribe((res) => {
      this.toast.success('Liên kết khôi phục mật khẩu đã được gửi đến email của bạn! Vui lòng kiểm tra !', 'Sent', {
        progressBar: true
      })
    }, error => {
      this.toast.error('Email không đúng', 'Error')
    });
  }
}
