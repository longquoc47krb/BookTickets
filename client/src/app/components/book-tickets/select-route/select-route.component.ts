import { BookService } from './../../../services/book.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Ben } from 'src/app/models/Ben';

@Component({
  selector: 'app-select-route',
  templateUrl: './select-route.component.html',
  styles: [
  ]
})
export class SelectRouteComponent implements OnInit {

  items = ['oneway', 'round']
  listDeparture = [];
  listDestiantion = [];

  today: any

  schedule: any;
  range: any;
  time: any;


  constructor(private router: Router, public service: BookService) { }

  ngOnInit(): void {
    this.load();
    (<HTMLInputElement>document.getElementById("return-date")).disabled = true
  }

  getDate() {
    var today = new Date();
    var x = (<HTMLInputElement>document.getElementById("date"))
    x.value = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
    this.service.step1.daygo = ('0' + today.getDate()).slice(-2) + "/" + ('0' + (today.getMonth() + 1)).slice(-2) + "/" + today.getFullYear();
    this.today = x.value;
  }

  onItemChange(x) {
    if (x == this.items[0]) {
      (<HTMLInputElement>document.getElementById("return-date")).value = "";
      (<HTMLInputElement>document.getElementById("return-date")).disabled = true
      this.service.step1.isOneWay = true
      this.service.step1.returnday = ""
    }
    else {
      (<HTMLInputElement>document.getElementById("return-date")).disabled = false
      this.service.step1.isOneWay = false
    }
  }

  load() {

    this.schedule = JSON.parse(sessionStorage.getItem('schedule'));

    this.service.step1.departure.id = this.schedule.ben_xe_di_id;
    this.service.step1.departure.toStationName = this.schedule.ben_xe_di;
    this.service.step1.destination.id = this.schedule.ben_xe_toi_id;
    this.service.step1.destination.toStationName = this.schedule.ben_xe_toi;

    this.range = this.schedule.khoang_cach;
    this.time = this.schedule.khoang_thoi_gian;

    this.service.getAllBen().subscribe(data => {

      this.listDeparture.push(this.service.step1.departure);
      for (let i of data.data) {
        if (i.toStationName != this.listDeparture[0].toStationName)
          this.listDeparture.push(i);
      }
      this.listDestiantion.push(this.service.step1.destination);
      /* this.cityChanged(this.listDeparture[0].id,0); */
      this.getAllDestination(this.listDeparture[0].id);
      console.log(this.listDeparture);
    });
    this.service.step1.isOneWay = true;

    this.getDate()
    /* alert(this.service.step1.daygo); */
  }

  getAllDestination(item: any) {
    this.service.getBenById(item).subscribe(
      data => {
        var destination = data.data;
        for (let i of destination) {
          if (i.id != this.listDestiantion[0].id) {
            this.listDestiantion.push(i);
          }
        }
        console.log(this.listDestiantion);
      }
    )
  }


  cityChanged(obj: any, index: any) {
    if (index == 0) {
      this.service.getBenById(obj).subscribe(
        data => {
          this.listDestiantion = data.data;
        }
      )
    }
    else {
      const item = this.listDestiantion.find(destination => destination.id == obj);
      this.service.step1.destination.toStationName = item.toStationName.replace('Bến xe', '');
      this.service.step1.destination.id = item.id.toString();
    }
  }

  submit() {
    if (this.service.step1.isOneWay == false && this.service.step1.returnday == "") {
      window.alert("xin hay chon ngay ve")
      return
    }
    sessionStorage.setItem('b1', JSON.stringify(this.service.step1))
    console.log(sessionStorage.getItem('b1'))
    if (this.service.step1.isOneWay == false) {
      this.router.navigate(['/booktickets/select-seat-two-way'])
    }
    else {
      this.router.navigate(['/booktickets/select-seat'])
    }

  }

  dateChanged(obj: any) {
    var dd = new Date(obj.value)
    var value = ('0' + dd.getDate()).slice(-2) + "/" + ('0' + (dd.getMonth() + 1)).slice(-2) + "/" + dd.getFullYear()
    if (this.service.step1.isOneWay == true) {
      this.service.step1.daygo = value;
      this.service.step1.returnday = "";
    }
    else {
      this.service.step1.returnday = value
    }
  }
}
