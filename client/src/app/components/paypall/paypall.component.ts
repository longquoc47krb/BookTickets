import { BookService } from './../../services/book.service';
import { convertActionBinding } from '@angular/compiler/src/compiler_util/expression_converter';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
declare var paypal;

@Component({
  selector: 'app-paypall',
  templateUrl: './paypall.component.html',
  styles: [
  ]
})
export class PaypallComponent implements OnInit {

  @ViewChild('paypal', { static: true }) paypalElement: ElementRef;

  infor: any;
  infor_router: any;
  infor_seat: any;


  ticket = {}
  customer = {}
  listSeats = []

  listPersonGoWithBuyer = [];

  paidFor = false;
  isWaitting = false;

  tokenPayPal;


  constructor(private service: BookService) { }

  ngOnInit(): void {

    this.infor = JSON.parse(sessionStorage.getItem('b3'));
    this.infor_seat = JSON.parse(sessionStorage.getItem('b2'));
    this.infor_router = JSON.parse(sessionStorage.getItem('b1'));


    this.tokenPayPal = JSON.parse(sessionStorage.getItem("tokenPayPal"));

    if (this.infor_seat.seats.length > 1)
      this.onGetInforPersonGoWithBuyer(this.infor_seat.seats.length - 1);

    this.customer = {
      name: this.infor.username,
      phone: this.infor.phone,
      email: this.infor.email,
      city: this.infor.city,
      point: this.infor.point
    }

    this.ticket = {
      route: this.infor_seat.routerId,
      dateGo: this.infor_router.daygo,
      timeGo: this.infor_seat.time,
      seats: this.infor_seat.seats,
      number: this.infor_seat.number,
      totalMoney: this.infor_seat.totalMoney,
      range: "",
      time: "",
    }

    console.log(this.infor_router);
    this.listSeats = this.ConvertSeats(this.infor_seat.seats)
    console.log(this.listSeats)

    var description = "Book ticket" + this.infor_router.departure.toStationName + " -- " + this.infor_router.destination.toStationName;
    var price = this.infor_seat.totalMoney / 22000;

    this.payMent(description, price);
  }

  payMent(description: any, price: any) {

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
                }
              }
            ]

          });

        },
        onApprove: async (data, actions) => {
          console.log(data);
          this.isWaitting = true;
          const order = await actions.order.capture();


          this.service.getTransectionPayPal(data.orderID, this.tokenPayPal).subscribe(
            data => {
              if (data != []) {
                console.log(data.purchase_units[0].payments.captures[0].id)
                // thêm transection paypal vào post

                var ticket = this.onSetData(data.purchase_units[0].payments.captures[0].id, this.infor_seat.seats.length);

                console.log("Dữ liệu trước khi xử lý");
                console.log(ticket);
                this.service.postCreateTicket(ticket).subscribe(
                  data => {
                    if (data.data != null) {
                      alert("Thành công");
                      this.paidFor = true;
                      this.isWaitting = false
                      console.log(data);
                    }
                    else {
                      this.isWaitting = false
                      alert("Lỗi server");
                      return;
                    }
                  }
                )
              }
              else {
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

  ConvertSeats(listSeats: any) {
    var list = [];
    for (let i of listSeats) {
      if (i < 10) {
        list.push("A0" + i);
      }
      else if (i >= 10 && i <= 22) {
        list.push("A" + i);
      }
      else if (i - 22 < 10) {
        list.push("B0" + (i - 22));
      }
      else {
        list.push("B" + (i - 22));
      }
    }
    return list;
  }

  onSetData(paypalId: any, length: any) {
    var slots = [];

    if (length > 1) {
      slots.push({
        "ten": this.infor.username,
        "so_ghe": this.infor.bed.id,
        "noi_xuong": this.infor.point,
        "address": this.infor.district + " - " + this.infor.city
      })

      for (let i = 0; i < length - 1; i++) {
        var slot = {
          "ten": this.listPersonGoWithBuyer[i].username,
          "so_ghe": this.listPersonGoWithBuyer[i].bed.id,
          "noi_xuong": this.listPersonGoWithBuyer[i].point,
          "address": this.listPersonGoWithBuyer[i].address
        }
        slots.push(slot);
      }
    }
    else {
      slots.push({
        "ten": this.infor.username,
        "so_ghe": this.infor_seat.seats[0],
        "noi_xuong": this.infor.point,
        "address": this.infor.district + " - " + this.infor.city
      })
    }

    var ticket = {
      gio_chay: this.infor_seat.time,
      gio_ket_thuc: this.infor_seat.time,
      id_tuyen_xe: this.infor_seat.routerId,
      phone: this.infor.phone,
      email: this.infor.email,
      date: this.infor_router.daygo,
      gia_ve: this.infor_seat.totalMoney,
      paypal_id: paypalId,
      diem_xuong: this.infor.point,
      slot: slots,
    }

    return ticket;
  }

  onGetInforPersonGoWithBuyer(number: any) {
    for (let i = 0; i < number; i++) {
      var name = 'p' + (i + 1);
      var person = JSON.parse(sessionStorage.getItem(name));
      this.listPersonGoWithBuyer.push(person);
    }
    console.log("Danh sách những người đi cùng");
    console.log(this.listPersonGoWithBuyer[0].username);
  }


}
