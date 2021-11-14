import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookService } from 'src/app/services/book.service';

@Component({
  selector: 'app-select-seat-return-away',
  templateUrl: './select-seat-return-away.component.html',
  styles: [
  ]
})
export class SelectSeatReturnAwayComponent implements OnInit {

  floorGo = 1;
  floorReturn = 1;

  inforRouteGo;
  inforRouteReturn;

  timeRouteGo = [];
  timeRouteReturn = [];

  listitemGo = [];
  listitemReturn = [];

  listitemGos = [];
  listitemReturns = [];

  seatGo = [];
  seatReturn = [];

  priceGo = 0;
  priceReturn = 0;

  listTime: any;
  day: any;

  listSangGo = [];
  listChieuGo = [];
  listToiGo = [];

  listSangReturn = [];
  listChieuReturn = [];
  listToiReturn = [];

  routeGo;
  routeReturn;

  stationInfor;

  constructor(public ser: BookService, private route: Router) { }

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.getInforSession();
    this.OnSelectFloor(1, 1);
    this.OnSelectFloor(1, 2);
  }

  getInforSession() {
    this.stationInfor = JSON.parse(sessionStorage.getItem('b1'));
    console.log(this.stationInfor);
    this.getRouteByIdPoint(this.stationInfor.departure.id, this.stationInfor.destination.id)
  }

  onChangeTime(obj: any, option = 0) {
    if (option == 1) {
      this.routeGo.gio = obj;
      console.log("Go")
      console.log(this.routeGo);
      this.resetSeats(this.seatGo);
      this.getStatusSeat(this.routeGo, "");
    }
    else {
      this.routeReturn.gio = obj;
      console.log("Return")
      console.log(this.routeReturn);
      this.resetSeats(this.seatReturn, 0);
      this.getStatusSeat("", this.routeReturn);
    }

  }



  onBook(item: any, index: any, option = 0) {
    if (option == 1) {
      var seat = document.getElementById(item);
      var test = seat.getElementsByClassName('disable');
      if (test[0] == null) {
        var nav1 = document.getElementsByClassName(item);
        if (this.seatGo[index].trangThai == 0 && this.listitemGo.length <= 5) {
          if (this.listitemGo.length + 1 == 6) {
            window.alert("Số vé giới hạn mua là 5 vé");
            return;
          }
          nav1[0].classList.add('select');
          this.listitemGo.push(item);
          this.seatGo[index].trangThai = 2;
        }
        else if (this.seatGo[index].trangThai == 2) {
          nav1[0].classList.remove('select');
          this.seatGo[index].trangThai = 0;

          for (let i = 0; i < this.listitemGo.length; i++) {
            if (this.listitemGo[i] == item) {
              this.listitemGo.splice(i, 1);
            }
          }
        }
      }
    }
    else {
      var seat = document.getElementById(item);
      var test = seat.getElementsByClassName('disable');
      if (test[0] == null) {
        var nav1 = document.getElementsByClassName(item);
        if (this.seatReturn[index].trangThai == 0 && this.listitemReturn.length <= 5) {
          if (this.listitemReturn.length + 1 == 6) {
            window.alert("Số vé giới hạn mua là 5 vé");
            return;
          }
          nav1[0].classList.add('select');

          this.listitemReturn.push(item);
          this.seatReturn[index].trangThai = 2;
        }
        else if (this.seatReturn[index].trangThai == 2) {
          nav1[0].classList.remove('select');
          this.seatReturn[index].trangThai = 0;
          for (let i = 0; i < this.listitemReturn.length; i++) {
            if (this.listitemReturn[i] == item) {
              this.listitemReturn.splice(i, 1);
            }
          }
        }
      }
    }

    console.log("Danh sách ghế")
    this.listitemGos = [];
    for (let i of this.listitemGo) {
      this.listitemGos.push(i.replace("G", ""))
    }

    this.listitemReturns = [];
    for (let i of this.listitemReturn) {
      this.listitemReturns.push(i.replace("R", ""))
    }

    this.routeGo.gia_ve = this.priceGo * (this.listitemGos.length);

    this.routeReturn.gia_ve = this.priceReturn * (this.listitemReturns.length);

  }

  resetSeats(array: any, option = 1) {
    if (option == 1) {
      for (let i of array) {
        document.getElementsByClassName("G" + i.stt)[0].classList.remove('disable');
        document.getElementsByClassName("G" + i.stt)[0].classList.remove('select');
      }
      this.listitemGo = [];
      this.listitemGos = [];
      this.routeGo.gia_ve = 0;
    }
    else {
      for (let i of array) {
        document.getElementsByClassName("R" + i.stt)[0].classList.remove('disable');
        document.getElementsByClassName("R" + i.stt)[0].classList.remove('select');
      }

      this.listitemReturn = [];
      this.listitemReturns = [];
      this.routeReturn.gia_ve = 0;
    }
  }

  OnSelectFloor(index: any, type: any) {
    if (type == 1) {
      if (index == 1) {
        var btn = document.getElementsByClassName("T11");
        btn[0].classList.add("bottom");
        btn = document.getElementsByClassName("T12");
        btn[0].classList.remove("bottom");
        var floor1 = document.getElementsByClassName("floor-1");
        floor1[0].classList.add("show-hide-item");
        var floor2 = document.getElementsByClassName("floor-2");
        floor2[0].classList.add("hide-item");
        floor2[0].classList.remove("show-hide-item");
      }
      else {
        var btn = document.getElementsByClassName("T11");
        btn[0].classList.remove("bottom");
        btn = document.getElementsByClassName("T12");
        btn[0].classList.add("bottom");
        var floor2 = document.getElementsByClassName("floor-2");
        floor2[0].classList.add("show-hide-item");
        var floor1 = document.getElementsByClassName("floor-1");
        floor1[0].classList.add("hide-item");
        floor1[0].classList.remove("show-hide-item");
      }
      this.floorGo = index;
    }
    else {
      this.floorReturn = index;
      if (index == 1) {
        var btn = document.getElementsByClassName("T21");
        btn[0].classList.add("bottom");
        btn = document.getElementsByClassName("T22");
        btn[0].classList.remove("bottom");

        var floor1 = document.getElementsByClassName("floor-1");
        floor1[1].classList.add("show-hide-item");
        var floor2 = document.getElementsByClassName("floor-2");
        floor2[1].classList.add("hide-item");
        floor2[1].classList.remove("show-hide-item");
      }
      else {
        var btn = document.getElementsByClassName("T21");
        btn[0].classList.remove("bottom");
        btn = document.getElementsByClassName("T22");
        btn[0].classList.add("bottom");

        var floor2 = document.getElementsByClassName("floor-2");
        floor2[1].classList.add("show-hide-item");
        var floor1 = document.getElementsByClassName("floor-1");
        floor1[1].classList.add("hide-item");
        floor1[1].classList.remove("show-hide-item");
      }
    }
  }

  getRouteByIdPoint(ben_di_id: any, ben_toi_id: any) {
    this.ser.getRouterId(ben_di_id, ben_toi_id).subscribe(
      data => {
        this.inforRouteGo = data.data
        console.log("thong tin di");
        console.log(this.inforRouteGo)
        this.priceGo = this.inforRouteGo.gia_ca;
        this.ser.getRunTime(this.inforRouteGo.id, this.stationInfor.daygo).subscribe(
          data => {
            this.timeRouteGo = data.data;
            for (let i of this.timeRouteGo) {
              if (i.giochay < 12)
                this.listSangGo.push(i.giochay)
              else if (i.giochay >= 12 && i.giochay < 17)
                this.listChieuGo.push(i.giochay)
              else
                this.listToiGo.push(i.giochay)
            }
            this.routeGo = {
              tuyen_xe_id: this.inforRouteGo.id,
              gio: this.timeRouteGo[0].giochay,
              ngay: this.stationInfor.daygo,
              gia_ve: 0
            }
            console.log("Thông tin chạy đi");
            console.log(this.routeGo);
            this.getStatusSeat(this.routeGo, "");

            console.log("Sang")
            console.log(this.listSangGo);
            console.log("Sang")
            console.log(this.listChieuGo);
            console.log("Sang")
            console.log(this.listToiGo);
          }
        )

      }
    )
    this.ser.getRouterId(ben_toi_id, ben_di_id).subscribe(
      data => {
        this.inforRouteReturn = data.data;
        console.log("thong tin toi");
        console.log(this.inforRouteReturn);
        this.priceReturn = this.inforRouteReturn.gia_ca;
        this.ser.getRunTime(this.inforRouteReturn.id, this.stationInfor.returnday).subscribe(
          data => {
            this.timeRouteReturn = data.data;
            console.log("ádawdwadwadwad");
            console.log(this.timeRouteReturn);
            for (let i of this.timeRouteReturn) {
              if (i.giochay < 12)
                this.listSangReturn.push(i.giochay)
              else if (i.giochay >= 12 && i.giochay < 17)
                this.listChieuReturn.push(i.giochay)
              else
                this.listToiReturn.push(i.giochay)
            }
            this.routeReturn = {
              tuyen_xe_id: this.inforRouteReturn.id,
              gio: this.timeRouteReturn[0].giochay,
              ngay: this.stationInfor.returnday,
              gia_ve: 0
            }
            console.log("Thông tin chạy về");
            console.log(this.routeReturn);
            this.getStatusSeat("", this.routeReturn);
          }
        )
      }
    )

  }

  getStatusSeat(routeGo: any, routeReturn: any) {
    if (routeReturn == "") {
      console.log("data");
      console.log(routeGo);
      this.ser.getStatusSeat(routeGo.tuyen_xe_id, routeGo.gio, routeGo.ngay).subscribe(
        data => {
          for (let i of data.data) {
            if (i.trangThai == Number(1)) {
              var name = "G" + i.stt;
              document.getElementsByClassName(name)[0].classList.add('disable');
            }
            else {
              var name = "G" + i.stt;
              document.getElementsByClassName(name)[0].classList.add('active');
            }
          }
          this.seatGo = data.data;
          console.log("Status");
          console.log(this.seatGo);
        }
      )
    }
    else if (routeGo == "") {
      console.log("data");
      console.log(routeReturn);
      this.ser.getStatusSeat(routeReturn.tuyen_xe_id, routeReturn.gio, routeReturn.ngay).subscribe(
        data => {
          for (let i of data.data) {
            if (i.trangThai == Number(1)) {
              document.getElementsByClassName("R" + i.stt)[0].classList.add('disable');
            }
            else {
              document.getElementsByClassName("R" + i.stt)[0].classList.add('active');
            }
          }
          this.seatReturn = data.data;
          console.log("Status");
          console.log(this.seatReturn);
        }
      )
    }
  }

  submit() {
    if (this.listitemGos.length == 0 || this.listitemReturns.length == 0) {
      return alert("Xin hãy chọn giường");
    }

    var routeGoStore = {
      gio_chay: this.routeGo.gio,
      gio_ket_thuc: this.routeGo.gio,
      id_tuyen_xe: this.routeGo.tuyen_xe_id,
      date: this.routeGo.ngay,
      gia_ve: this.routeGo.gia_ve,
      slot: this.listitemGos
    }

    var routeReturnStore = {
      gio_chay: this.routeReturn.gio,
      gio_ket_thuc: this.routeReturn.gio,
      id_tuyen_xe: this.routeReturn.tuyen_xe_id,
      date: this.routeReturn.ngay,
      gia_ve: this.routeReturn.gia_ve,
      slot: this.listitemReturns
    }

    sessionStorage.setItem("oneWay", JSON.stringify(routeGoStore));
    sessionStorage.setItem("twoWay", JSON.stringify(routeReturnStore))

    if (this.listitemGos.length == 1 && this.listitemReturns.length == 1) {
      this.route.navigate(['/booktickets/infor-customer']);
    }
    else {
      this.route.navigate(['/booktickets/infor-multiple-customer-two-way']);
    }


  }

  onBack() {
    this.route.navigate(["/"]);
  }

}
