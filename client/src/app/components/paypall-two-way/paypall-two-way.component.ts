import { BookService } from './../../services/book.service';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare var paypal;

@Component({
  selector: 'app-paypall-two-way',
  templateUrl: './paypall-two-way.component.html',
  styles: [
  ]
})
export class PaypallTwoWayComponent implements OnInit {

  @ViewChild('paypal', { static: true }) paypalElement: ElementRef;

  infor:any
  infor_router:any
  infor_seat:any
  inforReturn:any;
  ticket = {}
  customer ={}
  listSeats = []

  routeGo:any;
  routeReturn:any;

  numberGo:any;
  numberReturn:any;

  listSeatsGo = [];
  listSeatsReturn = [];

  slots = [];
  slotsReturn = [];

  totalMoney = 0;

  paidFor = false;
  isWaitting = false;
  tokenPayPal;

  constructor(private service: BookService, private router: Router) { }

  ngOnInit(): void {
    this.tokenPayPal = JSON.parse(sessionStorage.getItem("tokenPayPal"));

    this.infor = JSON.parse(sessionStorage.getItem('b3'));
    this.inforReturn = JSON.parse(sessionStorage.getItem('b3r'));
    this.infor_seat = JSON.parse(sessionStorage.getItem('b2'));
    this.infor_router = JSON.parse(sessionStorage.getItem('b1'));

    this.routeGo = JSON.parse(sessionStorage.getItem("oneWay"));
    this.routeReturn = JSON.parse(sessionStorage.getItem("twoWay"));

    this.numberGo = this.routeGo.slot.length;
    this.numberReturn = this.routeReturn.slot.length;

    this.totalMoney = this.routeGo.gia_ve + this.routeReturn.gia_ve;

    console.log(this.routeGo);

    this.listSeatsGo = this.ConvertSeats(this.routeGo.slot);
    this.listSeatsReturn = this.ConvertSeats(this.routeReturn.slot);

    

    this.customer = {
      name:this.infor.username,
      sdt:this.infor.phone,
      email:this.infor.email,
      city:this.infor.city
    }

    var description = "Book ticket" + this.infor_router.departure.ben_toi + " -- "+this.infor_router.destination.ben_toi+" (thứ hồi)";
    var price = this.totalMoney/22000;



    this.payMent(description,price);
  }

  payMent(description:any, price:any){

    paypal
    .Buttons({
      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units: [
            {
              description: description,
              amount: {
                currency_code: 'USD',
                value: price.toFixed(2)
              },
              
            }
          ]
        });
      },
      onApprove: async (data, actions) => {
        this.isWaitting = true;
        const order = await actions.order.capture();

        this.service.getTransectionPayPal(data.orderID, this.tokenPayPal).subscribe(
          data => {
            if(data!=[]){
              console.log(data.purchase_units[0].payments.captures[0].id)  
              // thêm transection paypal vào post 
              var ticket;
              if(this.inforReturn==null){
                
                this.onSetData(this.routeGo.slot[0],this.routeReturn.slot[0]);

                ticket = {
                  "gio_chay2":this.routeReturn.gio_chay,
                  "gio_ket_thuc2":this.routeReturn.gio_chay,
                  "id_tuyen_xe2":this.routeReturn.id_tuyen_xe,
                  "date2":this.routeReturn.date,
                  "gia_ve2":this.routeReturn.gia_ve,
                  "slot2":this.slotsReturn,
  
                  "gio_chay":this.routeGo.gio_chay,
                  "gio_ket_thuc":this.routeGo.gio_chay,
                  "id_tuyen_xe":this.routeGo.id_tuyen_xe,
                  "sdt":this.infor.phone,
                  "email":this.infor.email,
                  "date":this.routeGo.date,
                  "gia_ve":this.routeGo.gia_ve,
                  "slot":this.slots,
  
                  paypal_id:data.purchase_units[0].payments.captures[0].id.toString(),
                  "diem_xuong":this.infor.point,
                  "diem_xuong2":this.infor.pointReturn
                }
              }
              else{
                ticket = this.onSetDataMultiple(data.purchase_units[0].payments.captures[0].id);
              }



              this.service.postCreateTicket2(ticket).subscribe(
                data => {
                  if(data.status==200){
                    alert("Thành công");
                    this.paidFor = true;
                    console.log(data);
                    this.isWaitting = false;
                  }
                  else{
                    alert("Lỗi server");
                    return;
                  }
                }
              )
            }
            else{
              console.log('Lỗi Paypal')
            }
          }
        )
      },
      onError: err => {
        console.log(err);
      }
    })
    .render(this.paypalElement.nativeElement);
  }

  ConvertSeats(listSeats:any){
    var list = [];
    for(let i of listSeats){
      if(i<10){
        list.push("A0"+i);
      }
      else if(i>=10&&i<=22){
        list.push("A"+i);
      }
      else if(i-22<10){
        list.push("B0"+(i-22));
      }
      else{
        list.push("B"+(i-22));
      }
    }
    return list;
  }

  onSetData(slots:any, slotsReturn:any){
    this.slots.push({
      "ten":this.infor.username,
      "so_ghe":slots,
      "noi_xuong":this.infor.point,
      "dia_chi":this.infor.district + " - " +this.infor.city
    })

    this.slotsReturn.push({
      "ten":this.infor.username,
      "so_ghe":slotsReturn,
      "noi_xuong":this.infor.pointReturn,
      "dia_chi":this.infor.district + " - " +this.infor.city
    })
    console.log("data");
    console.log(this.slots);
    console.log(this.slotsReturn);
  }

  onSetDataMultiple(paypalId:any){
    var slots = [];
    var slotsReturn = [];

    var person = JSON.parse(sessionStorage.getItem('p3w'));
    var personReturn = JSON.parse(sessionStorage.getItem('p3wr'));

    slots.push({
      "ten":this.infor.username,
      "so_ghe":this.infor.bed.id,
      "noi_xuong":this.infor.point,
      "dia_chi":this.infor.district+" - "+this.infor.city
    })
    for(let i of person){
      var data ={
        "ten":i.username,
        "so_ghe":i.bed.id,
        "noi_xuong":i.point,
        "dia_chi":i.address
      }
      slots.push(data)
    }


    slotsReturn.push({
      "ten":this.inforReturn.username,
      "so_ghe":this.inforReturn.bed.id,
      "noi_xuong":this.inforReturn.point,
      "dia_chi":this.inforReturn.district+" - "+this.inforReturn.city
    })

    for(let i of personReturn){
      var data ={
        "ten":i.username,
        "so_ghe":i.bed.id,
        "noi_xuong":i.point,
        "dia_chi":i.address
      }
      slotsReturn.push(data)
    }

    var ticket = {
      "gio_chay2":this.routeReturn.gio_chay,
      "gio_ket_thuc2":this.routeReturn.gio_chay,
      "id_tuyen_xe2":this.routeReturn.id_tuyen_xe,
      "date2":this.routeReturn.date,
      "gia_ve2":this.routeReturn.gia_ve,
      "slot2":slotsReturn,

      "gio_chay":this.routeGo.gio_chay,
      "gio_ket_thuc":this.routeGo.gio_chay,
      "id_tuyen_xe":this.routeGo.id_tuyen_xe,
      "sdt":this.infor.phone,
      "email":this.infor.email,
      "date":this.routeGo.date,
      "gia_ve":this.routeGo.gia_ve,
      "slot":slots,

      paypal_id:paypalId,
      "diem_xuong":this.infor.point,
      "diem_xuong2":this.inforReturn.point
    }

    console.log("Dữ liệu trước khi xử lý");
    console.log(ticket);
    return ticket;

  }



}
