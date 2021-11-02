import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { BookService } from 'src/app/services/book.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styles: [
  ]
})
export class HistoryComponent implements OnInit {

  history;
  tempHistory = [];
  allRoute = [];
  isWaitting = false;

  constructor(private service: AuthService, private serviceB: BookService) { }

  ngOnInit(): void {
    this.isWaitting = false;
    this.load();
  }

  load(){
    this.getTiketHistory();
    this.getTime();
    this.getAllRoute();
  }

  getTiketHistory(){
    var customer = JSON.parse(sessionStorage.getItem("login"));
    this.service.getTicketHistory(customer.Token, customer.id).subscribe(
      data => {
        this.history = data;
        this.history = this.history.data;
        this.tempHistory = this.history;

        for(let i of this.history){
          if(i.trang_thai == "1"){
            i.trang_thai = "Đã chạy";
          }
          else{
            i.trang_thai = "Chưa chạy";
          }
        }
        console.log("Data ticket");
        console.log(data);
      }
    )
  }

  onReset(){
    this.history = this.tempHistory;
  }

  onSearch(){

  }

  onChangeDate(obj:any){
    var dd = new Date(obj.value);
    var day = dd.getDate()<10?"0"+dd.getDate():dd.getDate();
    var month = dd.getMonth()+1;
    var value = day+"/"+month+"/"+dd.getFullYear();
    this.history = [];
   
    for(let i of this.tempHistory){
      if(i.ngay_chay.toString() == value.toString()){
        this.history.push(i);
      }
    }
  }

  getTime(){
    var today = new Date();
    var x = (<HTMLInputElement>document.getElementById("historyDate"));
    x.value = today.getFullYear()+ '-' + ('0' + (today.getMonth() + 1)).slice(-2)  + '-' + ('0' + today.getDate()).slice(-2);
  }

  getAllRoute(){
    var routes = JSON.parse(sessionStorage.getItem('listRoute'));
    for(let i of routes){
      var route = {
        id:i.id,
        benDi:i.ben_xe_di,
        benToi:i.ben_xe_toi
      }
      this.allRoute.push(route);
    }
    console.log("All Route");
    console.log(this.allRoute);
  }

  cityChanged(obj:any){
    //Id tuyến nha
    this.history = [];
    for(let i of this.tempHistory){
      if(i.id_tuyen_xe == obj){
        this.history.push(i);
      }
    }
  }

  onCancelTicket(item:any){
    this.isWaitting = true;
    this.serviceB.getCancel(parseInt(item.id)).subscribe(
      data => {
        if(data.message == "Fail rồi bạn ơi"){
           alert("Hủy thất bại");
        }
        else{
           alert("Hủy thành công");
        }
        this.isWaitting = false;
        this.load();
      }
    )
  }

}
