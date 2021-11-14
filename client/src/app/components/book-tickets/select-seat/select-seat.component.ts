import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


import { BookService } from 'src/app/services/book.service';

@Component({
  selector: 'app-select-seat',
  templateUrl: './select-seat.component.html',
  styles: [
  ]
})
export class SelectSeatComponent implements OnInit {

  seat = [];
  listitem = [];
  schedule = [];
  price = 0;
  listTime: any;
  day: any;

  constructor(private router: Router, public ser: BookService) { }

  ngOnInit(): void {

    this.ser.step1 = JSON.parse(sessionStorage.getItem('b1'));
    console.log(this.ser.step1);
    this.load();
    this.day = this.ser.step1.daygo;
  }

  isDown = true;
  onClick() {
    if (this.isDown)
      this.isDown = false
    else
      this.isDown = true

    var nav1 = document.getElementsByClassName('information')
    nav1[0].classList.toggle('information-display')

  }

  load() {

    this.ser.getRouterId(this.ser.step1.departure.id, this.ser.step1.destination.id).subscribe(
      data => {
        this.ser.step2.routerId = data.data.id;
        this.price = data.data.gia_ca;
        this.getTime(this.ser.step2.routerId);

      }
    );


    this.ser.getListStop(this.ser.step1.departure.id, this.ser.step1.destination.id).subscribe(
      data => this.schedule = data.data
    );




  }

  listSang = [];
  listChieu = [];
  listToi = [];

  getTime(routerId: any) {
    this.ser.getRunTime(routerId, this.ser.step1.daygo).subscribe(res => {
      for (let i of res.data) {
        if (i.giochay < 12)
          this.listSang.push(i.giochay)
        else if (i.giochay >= 12 && i.giochay < 17)
          this.listChieu.push(i.giochay)
        else
          this.listToi.push(i.giochay)
      }
      this.ser.step2.time = res.data[0].giochay;
      console.log(res.data);
      this.ser.getStatusSeat(this.ser.step2.routerId, this.ser.step2.time, this.ser.step1.daygo).subscribe(
        data => {
          console.log("adaaa")
          console.log(data.data);
          for (let i of data.data) {
            if (i.trangThai == Number(1)) {
              document.getElementsByClassName(i.stt)[0].classList.add('disable');
            }
            else {
              document.getElementsByClassName(i.stt)[0].classList.add('active');
            }
          }
          this.seat = data.data;
          console.log("jk")
          console.log(this.seat);
        }
      );
    });
  }

  submit() {
    this.ser.step2.boardingPoint.id = this.ser.step1.departure.id;
    this.ser.step2.boardingPoint.name = "Bến xe " + this.ser.step1.departure.toStationName;
    this.ser.step2.seats = this.listitem;
    this.ser.step2.number = this.listitem.length;

    if (this.listitem.length == 0) {
      window.alert('Xin hãy chọn giường.')
      return
    }

    sessionStorage.setItem('b2', JSON.stringify(this.ser.step2));
    console.log(sessionStorage.getItem('b2'));

    if (this.listitem.length > 1) {
      this.router.navigate(['/booktickets/infor-multiple-customer']);
    }
    else {
      this.router.navigate(['/booktickets/infor-customer']);
    }
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
    this.ser.step2.totalMoney = this.price * this.listitem.length;
  }

  onChangeTime(obj: any) {
    this.ser.step2.time = obj;
    this.resetSeats(this.seat);
    this.ser.getStatusSeat(this.ser.step2.routerId, this.ser.step2.time, this.ser.step1.daygo).subscribe(
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
    this.ser.step2.totalMoney = 0
  }


}
