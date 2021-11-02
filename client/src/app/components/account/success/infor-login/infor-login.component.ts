import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-infor-login',
  templateUrl: './infor-login.component.html',
  styles: [
  ]
})
export class InforLoginComponent implements OnInit {
  @Input() taiKhoan = "";

  form: FormGroup;

  showPassword1 = 'password';
  showPassword2 = 'password';
  showPassword3 = 'password';

  isShow = false
  constructor(private fb:FormBuilder, private service: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.load()
    this.form = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    })
  }

  load(){
    this.onShowEditInfor()
    this.isShow = false
  }

  onShowEditInfor(){
    this.isShow == true?this.isShow=false:this.isShow=true
    var ei = document.getElementsByClassName('edit-infor-login')
    ei[0].classList.toggle('show-edit-infor')
  }

  onShowPassword(index:any){
    if(index == 0){
      this.showPassword1 = this.showPassword1=="text"?"password":"text";
    }
    else if(index == 1){
      this.showPassword2 = this.showPassword2=="text"?"password":"text";
    }
    else if(index == 2){
      this.showPassword3 = this.showPassword3=="text"?"password":"text";
    }
  }

  onSubmit(){
    if(this.form.value.newPassword!=this.form.value.confirmPassword){
      window.alert("Xác nhận mật khẩu mới không đúng.");
      return;
    }
    else{
      var token = JSON.parse(sessionStorage.getItem('login')).Token;
      this.service.postChangePassword(token,this.taiKhoan,this.form.value.oldPassword,this.form.value.newPassword).subscribe(
        data => {
          if(data.status==200){
            return this.router.navigate(['/login'])    
          }   
          else{
            alert("Sai tài khoản mật khẩu");
            this.onShowEditInfor();
          }
        }
      )
    }
  }
}
