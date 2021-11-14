import { Observable } from 'rxjs';
import { UploadImageService } from './../../../services/upload-image.service';
import { UserService } from './../../../services/user.service';
import { AdminService } from './../../../services/admin.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Chart } from "chart.js";
import { BookService } from 'src/app/services/book.service';



// import * as FileSaver from 'file-saver';

import 'jspdf-autotable';
import { ElementRef } from '@angular/core';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-addmin',
  templateUrl: './addmin.component.html',
  styles: [
  ]
})
export class AddminComponent implements OnInit {

  @ViewChild('time') inputKhoangThoiGian;
  @ViewChild('distance') inputKhoangCach;
  @ViewChild('price') inputGiaCa;
  @ViewChild('tenXe') inputTenXe;
  @ViewChild('hangXe') inputHangXe;
  @ViewChild('gioChay') inputGioChay;

  @ViewChild('tenTP') inputTenTP;
  @ViewChild('diaChi') inputDiaChi;
  @ViewChild('tenBen') inputTenBen;

  @ViewChild('content', { static: false }) content: ElementRef;



  fileInfos: Observable<any>;
  selectedFiles: FileList;
  currentFile: File;
  isShow = 0;
  isCreateAccount = 1;
  isUpdate = false;

  typeChart = 1;

  isChart = 0;

  srcImage;
  fileSelected: File = null;
  today;
  date;

  isRoute = false;
  isDate = 1;
  isWaiting = false;
  isWaittingCancel = false;

  form: FormGroup;
  formRoute: FormGroup;
  formPoint: FormGroup;
  formCar: FormGroup;

  logIn;

  listDeparture;
  listDestination;
  listUser;
  listRoute;
  listDestinationForRoute;
  route;

  listCar = [];

  listRouteExport = []

  listMonth = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
  listDate = ["Ngày 1", "Ngày 2", "Ngày 3", "Ngày 4", "Ngày 5", "Ngày 6", "Ngày 7", "Ngày 8", "Ngày 9", "Ngày 10", "Ngày 11", "Ngày 12", "Ngày 13", "Ngày 14", "Ngày 15", "Ngày 16", "Ngày 17"
    , "Ngày 18", "Ngày 19", "Ngày 20", "Ngày 21", "Ngày 22", "Ngày 23", "Ngày 24", "Ngày 25", "Ngày 26", "Ngày 27", "Ngày 28", "Ngày 29", "Ngày 30"];

  listDataDate = [];
  listDataMonth = [];

  listColorMonth = ['rgba(255, 99, 132, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(255, 206, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(255, 159, 64, 0.2)',
    'rgba(255, 99, 132, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(255, 206, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(255, 159, 64, 0.2)',];
  listColorDate = ['rgba(255, 99, 132, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(255, 206, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(255, 159, 64, 0.2)',
    'rgba(255, 99, 132, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(255, 206, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(255, 159, 64, 0.2)',
    'rgba(255, 99, 132, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(255, 206, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(255, 159, 64, 0.2)',
    'rgba(255, 99, 132, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(255, 206, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(255, 159, 64, 0.2)',
    'rgba(255, 99, 132, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(255, 206, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(255, 159, 64, 0.2)',]

  chart: any;

  data: any = []

  constructor(private fb: FormBuilder, private service: AdminService, public ser: BookService, private routerr: Router, private userService: UserService, private uploadService: UploadImageService) { }

  ngOnInit(): void {
    this.isCreateAccount = 1;
    console.log(this.listDate);
    this.onShowMenu(0);
    this.fileInfos = this.uploadService.getFiles();
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
      phone: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(10), Validators.minLength(10)]],
      address: ['', [Validators.required]],
      province: ['', [Validators.required]]
    })

    this.formRoute = this.fb.group({
      fromStation_Id: ['', [Validators.required]],
      toStation_Id: ['', [Validators.required]],
      distance: ['', [Validators.required]],
      price: ['', [Validators.required]],
      time: ['', [Validators.required]],
    })

    this.formPoint = this.fb.group({
      province: ['', [Validators.required]],
      stationName: ['', [Validators.required]],
      address: ['', [Validators.required]],
    })

    this.formCar = this.fb.group({
      ten_xe: ['', [Validators.required]],
      hang_xe: ['', [Validators.required]],
      tuyen_san_sang_id: ['', [Validators.required]],
      tuyen_off_id: ['', [Validators.required]],
      gio_chay: ['', [Validators.required]],
      fromStation_Id: ['', [Validators.required]],
      toStation_Id: ['', [Validators.required]],
    })
    this.getAllRoute();
    this.getAllAccount();
    console.log(this.listUser)
    this.getAllCar();
    this.getDate();
    this.onGetRouteToExport();
    this.onGetAllRouteInfor();
  }

  onItemChange(obj: any, type: any) {
    if (type == 0) {
      if (obj == 0)
        this.isRoute = true;
      else
        this.isRoute = false;
    }
    else {
      this.isDate = obj;
    }
  }

  dateValue;

  getDate() {
    var date = new Date();
    this.today = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
    this.date = date.getFullYear() + '/' + ('0' + (date.getMonth())).slice(-2) + "/" + ('0' + date.getDate()).slice(-2);
    this.dateValue = date.getFullYear() + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + "/" + ('0' + date.getDate()).slice(-2);
    this.dateCancel = ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + "/" + date.getFullYear();
  }

  dateChanged(obj: any) {
    var dd = new Date(obj.value);
    this.dateValue = dd.getFullYear() + '/' + ('0' + (dd.getMonth() + 1)).slice(-2) + "/" + ('0' + dd.getDate()).slice(-2);
  }

  onShow(show: any, type: any, optArg = "qqqq") {
    if (show == 2) {
      /* this.isCreateAccount = 0; */
      switch (this.isShow) {
        case 0:
          break;
        case 1:
          this.updateRoute();
          break;
        case 2:
          this.onSubmit(2);
          break;
        case 3:
          this.updateCar();
          break;
        default:
      }
    }
    else if (show == 1) {
      /* this.isCreateAccount = 0; */

      switch (this.isShow) {
        case 0:
          this.createAccount();
          break;
        case 1:
          this.createRoute();
          break;
        case 2:
          this.onSubmit(1);
          break;
        case 3:
          this.postCreateCar();
          break;
        default:
      }
    }
    else if (type == 1) {
      this.isCreateAccount = 1;
      this.ResetText();
      this.isUpdate = false;
      /*  alert('Thêm') */

    }
    else {
      /* alert('Chỉnh sửa'); */
      this.ResetText();
      this.route = optArg;
      this.isUpdate = true;
      if (this.isShow == 1) {
        this.SwapData(this.route);
      }
      if (this.isShow == 1) {
        this.formRoute = this.fb.group({
          fromStation_Id: '',
          toStation_Id: '',
          distance: '',
          price: '',
          time: '',
        })
      }
      if (this.isShow == 2) {
        this.formPoint = this.fb.group({
          province: '',
          stationName: '',
          address: '',
        });
        this.srcImage = this.route.picture;
      }
      if (this.isShow == 3) {
        this.formCar = this.fb.group({
          ten_xe: '',
          hang_xe: '',
          tuyen_san_sang_id: '',
          tuyen_off_id: '',
          gio_chay: '',
          fromStation_Id: '',
          toStation_Id: '',
        })
      }

      this.isCreateAccount = 2;
      this.ResetText();
    }
  }

  ResetText() {
    if (this.isShow == 1) {
      this.inputKhoangThoiGian.nativeElement.value = "";
      this.inputGiaCa.nativeElement.value = "";
      this.inputKhoangCach.nativeElement.value = "";
    }

    if (this.isShow == 3) {
      this.inputTenXe.nativeElement.value = "";
      this.inputHangXe.nativeElement.value = "";
      this.inputGioChay.nativeElement.value = "";
    }

    if (this.isShow == 2) {
      this.inputTenTP.nativeElement.value = "";
      this.inputDiaChi.nativeElement.value = "";
      this.inputTenBen.nativeElement.value = "";
    }
  }

  SwapData(data: any) {
    switch (this.isShow) {
      case 0:
        break;
      case 1:
        this.formRoute.value.distance = data.distance;
        this.formRoute.value.price = data.price;
        this.formRoute.value.time = data.time;
        break;
      case 2:
        break;
      case 3:
        this.formCar.value.ten_xe = data.tenXe;
        this.formCar.value.hang_xe = data.hangXe;
        this.formCar.value.gio_chay = data.gioChay;
        break;
      case 4:
        break;
      case 5:
        break;
      default:
        break;
    }
  }
  listStatistic = [];

  onShowChart(show: any, type: any) {
    this.onChangeTypeChart(show, type);

    if (show == false) {
      this.isChart = 0;
      if (type == 1) {
        this.service.getStatisticByDateRoute(this.dateValue, type).subscribe(
          data => {
            console.log(this.listRoute);

            var lStatistic = data.data;

            this.listStatistic = [];

            for (let i of lStatistic) {
              for (let j of this.listRoute) {
                if (i.idTuyenXe == j.id) {
                  var item = {
                    time: i.time,
                    route: j.ben_xe_di + " ⇒ " + j.ben_xe_toi,
                    number: i.tongVe,
                    totalMoney: i.doanhThu
                  }
                  this.listStatistic.push(item);
                }
              }
            }
            console.log(this.listStatistic);
          }
        );
      }
      else {
        this.service.getStatisticsByMonthRoute(this.dateValue, type).subscribe(
          data => {
            this.listStatistic = [];
            var lStatistic = data.data;
            console.log(lStatistic);
            console.log("Tuyến ");
            console.log(this.listRoute);

            for (let i of lStatistic) {
              for (let j of this.listRoute) {
                if (i.idTuyenXe == j.id) {
                  var item = {
                    time: i.time,
                    route: j.ben_xe_di + " ⇒ " + j.ben_xe_toi,
                    number: i.tongVe,
                    totalMoney: i.doanhThu
                  }
                  this.listStatistic.push(item);
                }
              }
            }
            console.log(this.listStatistic);

          }
        );
      }
    }
    else {
      this.isChart = 1;
      if (type == 1) {
        this.service.getStatisticsByDateRevenue(this.dateValue, type).subscribe(
          data => {
            var length = data.data.length;
            var listData = data.data;
            console.log("data");
            console.log(data.data);
            if (length == 31) {
              if (this.listDate.length == 30)
                this.listDate.push("Ngày 31");
            }
            else {
              if (this.listDate.length == 31)
                this.listDate.pop();

            }
            console.log("list date");
            console.log(this.listDate)
            this.listDataDate = [];

            for (let i = 0; i < length; i++) {
              this.listDataDate.push(listData[i].totalAmount);
            }
            console.log("date of revenue")
            console.log(data);
            console.log(this.listDataDate);

            this.drawChart(type);
          }
        );
      }
      else {
        this.service.getStatisticsByMonthRevenue(this.dateValue, type).subscribe(
          data => {
            var length = data.data.length;
            var listData = data.data;
            console.log('data')
            console.log(data.data)

            this.listDataMonth = [];

            for (let i = 0; i < length; i++) {
              this.listDataMonth.push(listData[i].totalAmount);
            }
            console.log("month of route")
            console.log(this.listDataMonth);
            this.drawChart(type);
          }
        );
      }
    }
    this.isCreateAccount = 1;
  }

  drawChart(type: any) {
    if (type == 2) {

      this.chart = new Chart(this.myChart, {
        type: 'bar',
        data: {
          labels: this.listMonth,
          datasets: [{
            label: "",
            data: this.listDataMonth,
            backgroundColor: this.listColorMonth,
            borderColor: this.listColorMonth
          }]
        }
      });
    }
    else {

      this.chart = new Chart(this.myChart, {
        type: 'bar',
        data: {
          labels: this.listDate,
          datasets: [{
            label: "",
            data: this.listDataDate,
            backgroundColor: this.listColorDate,
            borderColor: this.listColorDate
          }]
        }
      });
    }
  }

  myChart;
  onChangeTypeChart(show: any, type: any) {
    if (show == true) {
      this.typeChart = type == 1 ? 3 : 4;
      this.myChart = type == 1 ? "myChart3" : "myChart4";
    }
  }

  onChangeRoute(obj: any) {
    this.listDestinationForRoute = JSON.parse(sessionStorage.getItem('lBenDi'));
    var length = this.listDestinationForRoute.length;
    for (var i = 0; i < length; i++) {
      if (this.listDestinationForRoute[i].id == obj) {
        this.listDestinationForRoute.splice(i, 1);
        break;
      }
    }

    for (let j = 0; j < length; j++) {
      for (let i of this.listRoute) {
        if (i.ben_xe_di_id == obj && i.ben_xe_toi_id == this.listDestinationForRoute[j].id) {
          this.listDestinationForRoute.splice(j, 1);
        }
      }
    }

    console.log("du lieu tuyen xe");
    console.log(this.listRoute);
    console.log("du lieu xe toi");
    console.log(this.listDestinationForRoute);
  }

  onShowMenu(index: any) {


    this.isShow = index;
    this.isCreateAccount = 1;
    for (let i = 0; i < 6; i++) {
      if (i == index)
        document.getElementById(index).style.background = "-webkit-linear-gradient(right, #F2754E,#009344 )";
      else
        document.getElementById(i.toString()).style.background = "-webkit-linear-gradient(left, #F2754E,#009344 )";
    }

    if (index == 6) {
      var date = new Date();
      var x = (<HTMLInputElement>document.getElementById("timeCancel"));
      x.value = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
    }
  }

  cityChanged(obj: any, index: any) {
    if (index == 0) {
      this.ser.getBenById(obj).subscribe(
        data => {
          this.listDestination = data.data;
          this.ser.step1.destination.toStationName = this.listDestination[0].toStationName.replace('Bến xe', '');
          this.ser.step1.destination.id = this.listDestination[0].id;
          sessionStorage.setItem('lBenToi', JSON.stringify(this.listDestination));
        }
      )
      const item = this.listDeparture.find(departure => departure.id == obj);
      this.ser.step1.departure.toStationName = item.toStationName.replace('Bến xe', '');
      this.ser.step1.departure.id = item.id.toString();
      this.form.value.fromStation_Id = obj;
    }
    else {
      const item = this.listDestination.find(destination => destination.id == obj);
      this.ser.step1.destination.toStationName = item.toStationName.replace('Bến xe', '');
      this.ser.step1.destination.id = item.id.toString();
      this.form.value.toStation_Id = obj;
    }
  }

  imgeChanged(obj: any) {
    this.fileSelected = <File>obj.target.files[0];
    if (obj.target.files && obj.target.files[0]) {
      const file = obj.target.files[0];

      const reader = new FileReader();
      reader.onload = e => this.srcImage = reader.result;

      reader.readAsDataURL(file);
    }
  }

  createAccount() {
    var account = {
      username: this.form.value.username,
      password: this.form.value.password,
      fullName: this.form.value.fullName,
      email: this.form.value.email,
      phone: this.form.value.phone,
      cmnd: this.form.value.cmnd,
      address: this.form.value.address,
      province: this.form.value.province,
      quan_huyen: this.form.value.quan_huyen
    }

    if (this.form.invalid) {
      return alert("Xin hãy nhập đúng loại giá trị hoặc điền đầy đủ thông tin");
    }

    this.service.registerUser(this.logIn.Token, account).subscribe(
      data => {
        if (data.status == 200) {
          this.getAllAccount();
          return alert("Tạo tài khoản thành công");
        }
        else
          alert("Không thể tạo tài khoản này")
        return;
      }
    )
  }

  createRoute() {
    if (this.formRoute.invalid) {
      return alert("Xin hãy nhập đúng loại giá trị hoặc điền đầy đủ thông tin");
    }



    this.service.postCreateRote(this.logIn.Token, this.formRoute.value).subscribe(
      data => {
        if (data.status == 200) {
          this.getAllRoute();
          return alert("Tạo tuyến thành công");
        }
        else
          return alert("Không thể tạo tuyến này");
      }
    )
  }

  updateRoute() {
    var routerId;
    for (let i of this.listRoute) {
      if (i.ben_xe_di_id == this.route.ben_xe_di_id && i.ben_xe_toi_id == this.route.ben_xe_toi_id) {
        routerId = i.id;
        break;
      }
    }
    var route = {
      fromStation_Id: this.route.ben_xe_di_id,
      toStation_Id: this.route.ben_xe_toi_id,
      distance: this.formRoute.value.distance == "" ? this.route.distance : this.formRoute.value.distance,
      price: this.formRoute.value.price == "" ? this.route.price : this.formRoute.value.price,
      time: this.formRoute.value.time == "" ? this.route.time : this.formRoute.value.time
    }

    this.service.postUpdateRoute(this.logIn.Token, routerId, route).subscribe(
      data => {
        if (data.status == 200) {
          this.getAllRoute();
          alert("Thay đổi thành công");
        }
        else {
          alert("Thay đổi không thành công");
        }
      }
    )
  }

  getAllRoute() {
    this.listDeparture = JSON.parse(sessionStorage.getItem('lBenDi'));
    /* this.listDestination = JSON.parse(sessionStorage.getItem('lBenToi')); */
    this.listDestinationForRoute = JSON.parse(sessionStorage.getItem('lBenDi'));
    console.log("Bến di");
    console.log(this.listDestinationForRoute)
    this.service.getAllRoute().subscribe(
      data => {
        this.listRoute = data.data;

        this.routerIdCancel = this.listRoute[0].id;
        var dd = new Date();
        var value = ('0' + dd.getDate()).slice(-2) + '/' + ('0' + (dd.getMonth() + 1)).slice(-2) + "/" + dd.getFullYear();
        this.ser.getRunTime(this.listRoute[0].id, value).subscribe(
          data => {
            this.listTimeGoForRoute = data.data;
            this.time = this.listTimeGoForRoute[0].giochay;
            console.log(this.listTimeGoForRoute);
          }
        )
      }
    );
  }


  getAllAccount() {
    this.userService.getUsers().subscribe(
      res => {
        console.log(res)
        this.listUser = res;
        console.log(this.listUser)
      },
      err => console.error(err)
    );
  }

  getAllCar() {
    this.listCar = [];

    this.service.getAllCar(this.logIn.Token).subscribe(
      data => {
        for (let i of data.data) {
          for (let j of this.listRoute) {
            if (i.tuyenSanSangId == j.id) {
              var car = {
                xeId: i.id,
                hangXe: i.hangXe,
                routeId: i.tuyenSanSangId,
                ben_xe_di: j.ben_xe_di,
                ben_xe_di_id: j.ben_xe_di_id,
                ben_xe_toi: j.ben_xe_toi,
                ben_xe_toi_id: j.ben_xe_toi_id,
                tenXe: i.tenXe,
                gioChay: i.gioChay,
                tuyenSanSangId: i.tuyenSanSangId,
                tuyenOffId: i.tuyenOffId
              }
              this.listCar.push(car);
            }
          }
        }
        var length = this.listCar.length;
        for (let i = 0; i < length - 1; i++) {
          for (let j = i + 1; j < length; j++) {
            if (this.listCar[i].routeId > this.listCar[j].routeId) {
              var temp = this.listCar[i];
              this.listCar[i] = this.listCar[j];
              this.listCar[j] = temp;
            }
          }
        }
      }
    )
  }

  postCreateCar() {

    /*     if(this.formCar.invalid){
          return alert("Xin hãy nhập đúng loại giá trị hoặc nhập đầy đủ dữ liệu");
        } */

    for (let i of this.listRoute) {
      if (i.ben_xe_di_id == this.form.value.fromStation_Id && i.ben_xe_toi_id == this.form.value.toStation_Id) {
        this.formCar.value.tuyen_san_sang_id = i.id;
      }
      else if (i.ben_xe_di_id == this.form.value.toStation_Id && i.ben_xe_toi_id == this.form.value.fromStation_Id) {
        this.formCar.value.tuyen_off_id = i.id;
      }
    }

    this.service.postCreateCar(this.logIn.Token, this.formCar.value).subscribe(
      data => {
        if (data.data != null) {
          this.getAllCar();
          return alert("Thêm thành công");
        }
        else return alert("Thêm thất bại");
      }
    );
  }

  updateCar() {
    var car = {
      ten_xe: this.formCar.value.ten_xe == "" ? this.route.tenXe : this.formCar.value.ten_xe,
      hang_xe: this.formCar.value.hang_xe == "" ? this.route.hangXe : this.formCar.value.hangXe,
      tuyen_san_sang_id: this.route.tuyenSanSangId,
      tuyen_off_id: this.route.tuyenOffId,
      gio_chay: this.formCar.value.gio_chay == "" ? this.route.gioChay : this.formCar.value.gio_chay
    }

    this.service.postUpdateCar(this.logIn.Token, this.route.xeId, car).subscribe(
      data => {
        if (data.status == 200) {
          this.getAllCar();
          alert("Cập nhật thành công");
        }
        else alert("Cập nhật thất bại");
      }
    )
  }

  hinhAnh;

  onSubmit(data: any) {
    this.isWaiting = true;
    if (data == 1) {
      var data1 = {}
      if (this.fileSelected == null) {
        data1 = {
          stationName: this.formPoint.value.stationName,
          address: this.formPoint.value.address,
          province: this.formPoint.value.province,
          picture: null,
        };
        console.log(data1);
      }
      else {
        this.service.uploadImage(this.fileSelected)
          .pipe()
          .subscribe(
            res => {
              this.hinhAnh = "https://drive.google.com/uc?id=" + res.id;
              data1 = {
                stationName: this.formPoint.value.stationName,
                address: this.formPoint.value.address,
                province: this.formPoint.value.province,
                picture: this.hinhAnh,
              };
              this.onCreateRoute(data1);
            }
          )
      }

    }
    else {
      var data1 = {}
      var hinhAnh;
      console.log("AAA");
      console.log(this.route);
      if (this.fileSelected == null) {
        if (this.route.picture != null)
          hinhAnh = this.route.picture;
        else
          hinhAnh = null;

        data1 = {
          stationName: this.formPoint.value.stationName == "" ? this.route.toStationName : this.formPoint.value.stationName,
          address: this.formPoint.value.address == "" ? this.route.address : this.formPoint.value.address,
          picture: hinhAnh,
        };
      }
      else {
        this.service.uploadImage(this.fileSelected)
          .pipe()
          .subscribe(
            res => {
              // this.hinhAnh = "https://drive.google.com/uc?id="+res.id;
              // data1 = {
              //     stationName:this.formPoint.value.stationName==""?this.route.toStationName:this.formPoint.value.stationName,
              //     address:this.formPoint.value.address==""?this.route.address:this.formPoint.value.address,
              //     picture:this.hinhAnh,
              //   };
              //   console.log(data1);
              //   this.onUpdatePoint(this.route.id,data1)
            }
          )
      }

    }

    this.srcImage = "";
    this.ResetText();
    this.isCreateAccount = 1;
    this.ResetText();
  }

  onGetRouteToExport() {
    this.service.getAllRouteToExport(this.logIn.Token).subscribe(
      data => {
        var listRoute = data.data;
        console.log(this.listRoute);
        console.log(listRoute);
        for (let i of listRoute) {
          for (let j of this.listRoute) {
            if (i.id_tuyen_xe.toString() == j.id.toString()) {
              var route = {
                id_tuyen_xe: i.id_tuyen_xe,
                ben_xe_di: j.ben_xe_di,
                ben_xe_toi: j.ben_xe_toi,
                gio_chay: i.gio_chay,
                so_luong_ve: i.so_luong_ve
              }
              this.listRouteExport.push(route)

            }
          }
        }
        console.log(this.listRouteExport);
        this.detailItem = this.listRouteExport[0];
      }
    )
  }

  detailItem;
  dataShow = [];
  onPostExcel(obj: any) {
    this.data = [];
    this.dataShow = [];
    this.detailItem = obj;

    console.log(obj);


    this.service.postExcel(this.logIn.Token, obj.id_tuyen_xe, obj.gio_chay).subscribe(
      data => {
        var infor = data.data;
        var route = {
          "Tuyến xe": infor.tuyen_xe,
          "Ngày chạy": infor.ngay_chay,
          "Tổng vé": infor.tong_ve + "vé",
          "Giờ chạy": infor.gio_chay,
        }
        this.data.push(route);
        console.log("data");
        console.log(data.data);

        for (let i of data.data.danh_sach_ve) {
          for (let j of i.vi_tri_giuong) {
            var datas = {
              "Mã vé": i.ma_ve,
              "Tên khách hàng": j.fullName,
              "Số điện thoại": i.phone,
              "Giường": j.stt,
              "Nơi xuống": j.noi_xuong
            }
            var datas1 = {
              maVe: i.ma_ve,
              ten_khach_hang: j.fullName,
              phone: i.phone,
              giuong: j.stt,
              noiXuong: j.noi_xuong
            }

            this.dataShow.push(datas1);
            this.data.push(datas);
          }
        }

        console.log(this.dataShow);
        console.log(this.data);
        // this.exportAsExcelFile(this.data,infor.tuyen_xe);

      }
    )
  }



  stationInfor;
  onGetAllRouteInfor() {
    this.service.getAllRouteInfor().subscribe(
      data => {
        this.stationInfor = data.data;
        console.log("Bến ")
        console.log(this.stationInfor);

      }
    )
  }

  onCreateRoute(data: any) {
    this.service.postCreateB(this.logIn.Token, data).subscribe(
      data => {
        if (data.data != null) {
          this.onGetAllRouteInfor();
          this.isWaiting = false;
          alert("Thành công");
        }
        else {
          this.isWaiting = false;
          alert("Không tạo được bến");
        }
      }
    )
  }

  onUpdatePoint(id: any, data: any) {

    this.service.postUpdateB(this.logIn.Token, id, data).subscribe(
      data => {
        if (data.status == 200) {
          this.onGetAllRouteInfor();
          this.isWaiting = false;
          alert("Cập nhật bến thành công");
        }
        else {
          this.isWaiting = false;
          alert("Không cập nhật được bến");
        }
      }
    )
  }

  onConfirmCancle(type: any) {
    if (confirm('Are you sure you want to save this thing into the database?')) {
      // Save it!
      console.log('Thing was saved to the database.');
    } else {
      // Do nothing!
      console.log('Thing was not saved to the database.');
    }
  }

  onRouteExcute(obj: any) {
    this.isWaittingCancel = true;
    if (obj.trang_thai == 1) {
      //call api huy
      this.ser.postCancelRoute(obj.id).subscribe(
        data => {
          if (data.message == "Fail rồi bạn ơi") {
            alert("Không hủy thành công");

          }
          else {
            alert("Hủy thành công");
            this.getAllRoute();

          }
          this.isWaittingCancel = false;
        }
      )

    }
    else {
      //call api return
      this.ser.postReturnRoute(obj.id, this.logIn.Token).subscribe(
        data => {
          if (data.message == "Thành công") {
            alert("Mở tuyến thành công");
            this.getAllRoute();
          }
          else {
            alert("Mở tuyến không thành công");
          }
          this.isWaittingCancel = false;
        }
      )
    }
  }


  routerIdCancel;
  time;
  listTimeGoForRoute = [];
  changeRouteCancel(obj: any) {
    this.routerIdCancel = obj;
    var dd = new Date();
    var value = ('0' + dd.getDate()).slice(-2) + '/' + ('0' + (dd.getMonth() + 1)).slice(-2) + "/" + dd.getFullYear();
    this.ser.getRunTime(obj, value).subscribe(
      data => {
        this.listTimeGoForRoute = data.data;
        console.log(this.listTimeGoForRoute);
        this.time = this.listTimeGoForRoute[0].giochay;
      }
    )
  }

  dateCancel;
  onChangeDateCancel(obj: any) {
    var dd = new Date(obj.value);
    var value = ('0' + dd.getDate()).slice(-2) + '/' + ('0' + (dd.getMonth() + 1)).slice(-2) + "/" + dd.getFullYear();
    this.dateCancel = value;
    this.ser.getRunTime(this.routerIdCancel, value).subscribe(
      data => {
        this.listTimeGoForRoute = data.data;
        this.time = this.listTimeGoForRoute[0].giochay;
      }
    )
  }

  onChangeTime(obj: any) {
    this.time = obj;
  }

  onCancelDependent() {
    var body = {
      "id_tuyen_xe": this.routerIdCancel,
      "gio": this.time,
      "ngay": this.dateCancel
    }

    this.service.postCancelDependency(this.logIn.Token, body).subscribe(
      data => {
        if (data.message == "Thành công rồi nè") {
          alert("Thành công");
          this.onShowMenu(0);
        }
        else alert("Không thành công");
      }
    )
  }

}

