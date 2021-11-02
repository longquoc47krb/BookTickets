import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-reward-point',
  templateUrl: './reward-point.component.html',
  styles: [
  ]
})
export class RewardPointComponent implements OnInit {

  point;

  constructor(private service: AuthService) { }

  ngOnInit(): void {
    // this.getPointCustomer();
  }


  // getPointCustomer(){
  //   var login =JSON.parse(sessionStorage.getItem("login"));
  //   this.service.getPointCustomer(login.Token, login.id).subscribe(
  //     data => {
  //       this.point = data.data;


  //     }
  //   )
  // }

}
