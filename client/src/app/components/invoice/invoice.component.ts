import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookService } from './../../services/book.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styles: [
  ]
})
export class InvoiceComponent implements OnInit {

  code = "";  

  isShow = false;
  listItem = [];
  number = 0;
  data:any;
  isWaitting = false;

  constructor(private service:BookService, private router: Router) { }

  ngOnInit(): void {
    this.isShow = false;
  }


  onSearch(){
    this.service.getSearch(this.code).subscribe(
      data => {
        if(data.data == null){
          return alert("Bạn đã nhập sai mã");
        }
        else{
          this.data = data.data;
          this.isShow = true;
          this.listItem = this.ConvertSeats(this.data.slots);
          this.number = this.data.slots.length;
        }
      }
    )
  }

  ConvertSeats(data:any){
    var list = [];
    console.log(data);
    for(let i of data){
      if(i<10){
        list.push("A0"+i);  
      }
      if(i>=10&&i<=22){ 
        list.push("A"+i);
      }
      if((i-22)<10&&(i-22)>0){
        list.push("B0"+(i-22));
      }
      if((i-22)>=10&&(i-22)<=22){  
        list.push("B"+(i-22));
      }
    }
    return list;
  }

  onCancel(){
    this.isWaitting = true;
    this.service.getCancel(parseInt(this.data.id)).subscribe(
      data => {
        if(data.message == "Fail rồi bạn ơi"){
           alert("Hủy thất bại");
        }
        else{
           alert("Hủy thành công");
        }
        this.isWaitting = false;
        this.isShow = false;
      }
    )
  }

  onBack(){
    location.reload();
  }

}
