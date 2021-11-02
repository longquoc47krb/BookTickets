import { AuthService } from 'src/app/services/auth.service';
import { AuthUser } from './../../interface/AuthResponse';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { flatMap } from 'rxjs/operators';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input() index = 0;


  isShow = false;
  user: AuthUser;
  role = ''
  username=''
  nav: any
  customerInfor;
  token: any;
  constructor(private route: Router, private ac: ActivatedRoute, private authService: AuthService) { }

  ngOnInit(): void {
    this.user = this.authService.getAuth();
    this.token = localStorage.getItem("access-token");
    this.onChange(this.index);
    this.onPersonal();
    this.role = localStorage.getItem("role");
    this.username = localStorage.getItem("username");
    this.onShowDown();
  }

  onClick(){
    var nav = document.getElementsByClassName('nav')
    nav[0].classList.toggle('collapse')
  }

  onChange(index:any){
    this.nav = document.getElementsByClassName('item')
    if(index==-1){
      for(let i = 0; i< this.nav.length; i++){
        this.nav[i].classList.remove('pick')
      }
      return
    }
    if(index>2){
      index = index -1;
    }
    this.nav[index].classList.add('pick')
    for(let i = 0; i< this.nav.length; i++){
      if( i != index ){
        this.nav[i].classList.remove('pick')
      }
    }
  }

  onPersonal(){

  }

  onShowDown(){
    var nav = document.getElementsByClassName('logOut')
    nav[0].classList.toggle('display_logout')
  }

  onLogOut(){
   this.authService.logout();
  }
}
