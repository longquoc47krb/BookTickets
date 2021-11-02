import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styles: [
  ]
})
export class SuccessComponent implements OnInit {

  logIn:any;
  taiKhoan = "";
  index:any;
  customer:any;
  constructor(private route: ActivatedRoute, private service: AuthService) { }

  ngOnInit(): void {
    this.taiKhoan = this.route.snapshot.params['email'];
    this.load()
  }


  load(){
    this.loadChange(0)
    this.logIn =  JSON.parse(sessionStorage.getItem('login'));
    this.getInforCustomerById();
  }

  loadChange(index:any){
    var root = document.getElementsByClassName('container-success')
    var chil = root[0].getElementsByClassName('item')
    for(let i=0; i< chil.length; i++){
      chil[i].classList.remove('change')
    }
    chil[index].classList.add('change')
    this.index = index
  }

  getInforCustomerById(){
    // this.service.getInforCustomer(this.logIn.Token,this.logIn.id).subscribe(
    //   data => {
    //     this.customer= data.data
    //     sessionStorage.setItem("customerInfor",JSON.stringify(this.customer));
    //   }
    // );
  }



}
