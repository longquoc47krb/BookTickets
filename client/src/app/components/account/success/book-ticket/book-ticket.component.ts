import { BookService } from './../../../../services/book.service';
import { Component, ElementRef, forwardRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { SelectControlValueAccessor } from '@angular/forms';
declare var paypal;

@Component({
  selector: 'app-book-ticket',
  templateUrl: './book-ticket.component.html',
  styles: [
  ]
})
export class BookTicketComponent implements OnInit {

  @ViewChild('paypal', { static: true }) paypalElement: ElementRef;

  seat = [];
  listitem = [];
  price = 0;

  seats = "";

  items = ['oneway', 'round'];

  today: any;
  listDeparture: any;
  listRoterPoppular: [];

  logIn;
  customer;
  isCheck = false;

  ticket: any;
  customerInfor: any;
  paidFor = false;
  isWaitting = false;

  tokenPayPal;
  point = "";

  constructor(private route: Router, public service: BookService, private serviceCustomer: AuthService) { }

  ngOnInit(): void {


    console.log(this.seat);
    this.select_floor('floor-1');
    this.load();


  }

  select_floor(floor: any) {
    var f3 = document.getElementById('show-floor-1')
    var f4 = document.getElementById('show-floor-2')
    if (floor == 'floor-1') {
      var f1 = document.getElementsByClassName(floor)
      f1[0].classList.add('show-boder')
      var f2 = document.getElementsByClassName('floor-2')
      f2[0].classList.remove('show-boder')
      if (f3.classList.toggle('hide-item') == true) {
        f3.classList.toggle('hide-item')
      }
      if (f4.classList.toggle('hide-item') == false) {
        f4.classList.toggle('hide-item')
      }
    }
    else {
      var f1 = document.getElementsByClassName(floor)
      f1[0].classList.add('show-boder')
      var f2 = document.getElementsByClassName('floor-1')
      f2[0].classList.remove('show-boder')
      if (f3.classList.toggle('hide-item') == false) {
        f3.classList.toggle('hide-item')
      }
      if (f4.classList.toggle('hide-item') == true) {
        f4.classList.toggle('hide-item')
      }
    }
  }

  load() {
    this.tokenPayPal = JSON.parse(sessionStorage.getItem("tokenPayPal"));

    var bpa = document.getElementsByClassName('book-pay-accept');
    bpa[0].classList.add('show-book');


    this.logIn = JSON.parse(sessionStorage.getItem("login"));
    this.getAllDeparture();
    this.getDate();
    this.getInforCustomerById();

  }



  onBook(item: any, index: any) {

    var seat = document.getElementById(item);
    var test = seat.getElementsByClassName('disable');
    if (test[0] == null) {
      var nav1 = document.getElementsByClassName(item);
      if (this.seat[index].trangThai == 0 && this.listitem.length <= 5) {
        if (this.listitem.length + 1 == 6) {
          window.alert("Số vé giới hạn mua là 5 vé");
          return;
        }
        nav1[0].classList.add('select');
        this.listitem.push(item);
        this.seat[index].trangThai = 2;
      }
      else if (this.seat[index].trangThai == 2) {
        nav1[0].classList.remove('select');
        this.seat[index].trangThai = 0;
        for (let i = 0; i < this.listitem.length; i++) {
          if (this.listitem[i] == item) {
            this.listitem.splice(i, 1);
          }
        }
      }
    }
    this.service.step2.totalMoney = this.price * this.listitem.length;

  }

  onSubmitBook() {
    this.service.step2.boardingPoint.id = this.service.step1.departure.id;
    this.service.step2.boardingPoint.name = "Bến xe " + this.service.step1.departure.toStationName;
    this.service.step2.seats = this.listitem;
    this.service.step2.number = this.listitem.length;

    if (this.logIn.discount != 0) {

      this.service.step2.totalMoney = (this.price * this.listitem.length * (100 - this.logIn.discount)) / 100;
    }
    else
      this.service.step2.totalMoney = this.price * this.listitem.length;

    for (let i of this.listitem) {
      var temp = "";
      if (i < 10) {
        temp = "A0" + i;
      }
      else if (i >= 10 && i <= 22) {
        temp = "A" + i;
      }
      else if (i - 22 < 10) {
        temp = "B0" + (i - 22);
      }
      else if (i - 22 >= 10) {
        temp = "B" + (i - 22);
      }
      this.seats += temp + " ";
    }

    if (this.listitem.length == 0) {
      window.alert('Xin hãy chọn giường.')
      return
    }
    if (this.isCheck == false) {
      return alert("Xin hãy chận nhận điều khoản đặt vé");
    }
    sessionStorage.setItem('b2', JSON.stringify(this.service.step2));
    console.log(sessionStorage.getItem('b2'));

    var b = document.getElementsByClassName('book-pay')
    b[0].classList.toggle('show-book')
    b = document.getElementsByClassName('book-pay-accept')
    b[0].classList.remove('show-book')
    this.onPay();
  }

  onCheck() {
    this.isCheck = this.isCheck == false ? true : false;
  }

  getAllDeparture() {
    this.service.getRouter().subscribe(
      data => {
        this.listDeparture = data.data;
        this.getTimes(this.listDeparture[0].id);
        this.service.step2.routerId = this.listDeparture[0].id;
        this.service.step1.departure.id = this.listDeparture[0].ben_xe_di_id;
        this.service.step1.destination.id = this.listDeparture[0].ben_xe_toi_id;
        this.service.step1.departure.toStationName = this.listDeparture[0].ben_xe_di;
        this.service.step1.destination.toStationName = this.listDeparture[0].ben_xe_toi;
        this.service.step2.boardingPoint.id = this.service.step1.departure.id;
        this.service.step2.boardingPoint.name = this.service.step1.departure.toStationName;
        this.price = this.listDeparture[0].gia_ca;

        sessionStorage.setItem('listRoute', JSON.stringify(this.listDeparture));
      }
    )
  }

  cityChanged(obj: any) {

    this.service.step2.routerId = obj;
    for (let i of this.listDeparture) {
      if (i.id == obj) {
        this.service.step1.departure.id = i.ben_xe_di_id;
        this.service.step1.destination.id = i.ben_xe_toi_id;
        this.service.step1.departure.toStationName = i.ben_xe_di;
        this.service.step1.destination.toStationName = i.ben_xe_toi;
        this.price = i.gia_ca;
      }
    }

    /*   this.service.step2.time */

    this.getTimes(obj);
  }

  getDate() {
    var today = new Date();
    var x = (<HTMLInputElement>document.getElementById("date"));
    x.value = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
    this.service.step1.daygo = ('0' + today.getDate()).slice(-2) + "/" + ('0' + (today.getMonth() + 1)).slice(-2) + "/" + today.getFullYear();
    this.today = x.value;
    /*     this.getTimes(this.service.step2.routerId);
        alert(this.service.step2.routerId); */
  }

  dateChanged(obj: any) {
    var dd = new Date(obj.value);
    var value = ('0' + dd.getDate()).slice(-2) + "/" + ('0' + (dd.getMonth() + 1)).slice(-2) + "/" + dd.getFullYear();
    this.service.step1.daygo = value;

    this.resetSeats(this.seat);

    this.service.getStatusSeat(this.service.step2.routerId, this.service.step2.time, this.service.step1.daygo).subscribe(
      data => {
        for (let i of data.data) {
          if (i.trangThai == Number(1)) {
            document.getElementsByClassName(i.stt)[0].classList.add('disable');
          }
          else {
            document.getElementsByClassName(i.stt)[0].classList.add('active');
          }
        }
        this.seat = data.data;
      }
    );

  }

  listSang = [];
  listChieu = [];
  listToi = [];
  getTimes(routerId: any) {
    this.resetSeats(this.seat);
    this.listSang = [];
    this.listChieu = [];
    this.listToi = [];
    this.service.getRunTime(routerId, "").subscribe(res => {
      for (let i of res.data) {
        if (i.giochay < 12)
          this.listSang.push(i.giochay)
        else if (i.giochay >= 12 && i.giochay < 17)
          this.listChieu.push(i.giochay)
        else
          this.listToi.push(i.giochay)
      }

      this.service.step2.time = res.data[0].giochay;
      console.log("Giờ chạy")
      console.log(res.data);

      /*       alert(routerId);
            alert(this.service.step2.time);
            alert(this.service.step1.daygo); */


      this.service.getStatusSeat(routerId, this.service.step2.time, this.service.step1.daygo).subscribe(
        data => {
          for (let i of data.data) {
            if (i.trangThai == Number(1)) {
              document.getElementsByClassName(i.stt)[0].classList.add('disable');
            }
            else {
              document.getElementsByClassName(i.stt)[0].classList.add('active');
            }
          }
          this.seat = data.data;
        }
      );
    });
  }

  onChangeTime(obj: any) {
    this.service.step2.time = obj;
    this.resetSeats(this.seat);
    this.service.getStatusSeat(this.service.step2.routerId, this.service.step2.time, this.service.step1.daygo).subscribe(
      data => {
        for (let i of data.data) {
          if (i.trangThai == Number(1)) {
            document.getElementsByClassName(i.stt)[0].classList.add('disable');
          }
          else {
            document.getElementsByClassName(i.stt)[0].classList.add('active');
          }
        }
        this.seat = data.data;
      }
    );
  }

  resetSeats(array: any) {
    for (let i of array) {
      document.getElementsByClassName(i.stt)[0].classList.remove('disable');
      document.getElementsByClassName(i.stt)[0].classList.remove('active');
      document.getElementsByClassName(i.stt)[0].classList.remove('select');
    }

    this.listitem = [];
    this.seat = [];
    this.service.step2.totalMoney = 0
  }

  onBack() {
    var b = document.getElementsByClassName('book-pay')
    b[0].classList.toggle('show-book')
    b = document.getElementsByClassName('book-pay-accept')
    b[0].classList.add('show-book')
  }

  getInforCustomerById() {
    // this.serviceCustomer.getInforCustomer(this.logIn.Token,this.logIn.id).subscribe(
    //   data => this.customer= data.data
    // );
  }

  onPay() {
    this.customerInfor = {
      name: this.customer.fullName,
      phone: this.customer.phone,
      email: this.customer.email,
      city: this.customer.diaChi
    }



    this.ticket = {
      gio_chay: this.service.step2.time,
      gio_ket_thuc: "",
      id_tuyen_xe: this.service.step2.routerId,
      phone: this.customer.phone,
      email: this.customer.email,
      date: this.service.step1.daygo,
      gia_ve: this.service.step2.totalMoney,
      paypal_id: "paypalId",
      diem_xuong: this.point,
      slot: [],
    }



    var description = "Book ticket" + this.service.step1.departure.toStationName + " -- " + this.service.step1.destination.toStationName;
    var price = this.service.step2.totalMoney / 22000;

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
          this.isWaitting = true;
          const order = await actions.order.capture();

          this.service.getTransectionPayPal(data.orderID, this.tokenPayPal).subscribe(
            data => {
              if (data != []) {
                console.log(data.purchase_units[0].payments.captures[0].id);
                console.log(this.customer);
                // thêm transection paypal vào post
                if (this.customer.diaChi == null)
                  this.customer.diaChi = "Ở nhà";
                var slots = [];
                for (let i of this.service.step2.seats) {
                  var slot = {
                    "ten": this.customer.fullName,
                    "so_ghe": i,
                    "noi_xuong": this.point,
                    "address": this.customer.diaChi
                  }
                  slots.push(slot);
                }

                var ticket = {
                  gio_chay: this.service.step2.time,
                  gio_ket_thuc: "",
                  id_tuyen_xe: this.service.step2.routerId,
                  phone: this.customer.phone,
                  email: this.customer.email,
                  date: this.service.step1.daygo,
                  gia_ve: this.service.step2.totalMoney,
                  paypal_id: data.purchase_units[0].payments.captures[0].id,
                  diem_xuong: this.point,
                  slot: slots,
                }

                console.log("Data Ve")
                console.log(ticket);
                this.service.postCreateTicket(ticket).subscribe(
                  data => {
                    if (data.data != null) {
                      alert("Thành công");
                      this.paidFor = true;
                      this.isWaitting = false;

                      console.log(data);
                    }
                    else {
                      this.isWaitting = false
                      alert("Lỗi server");

                    }
                    location.reload();
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

  onChange(obj: any) {
    this.point = obj;
  }

}
