import { BookService } from './../../services/book.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styles: [
  ]
})
export class ScheduleComponent implements OnInit {

  allRouter = [];

  constructor(private service: BookService, private route: Router) { }

  ngOnInit(): void {
    this.getAllRoter();
  }

  getAllRoter(){
    this.service.getRouter().subscribe(
      data => {
        this.allRouter = data.data;
      }
    );
  }

  onClick(item:any){
    sessionStorage.setItem('schedule',JSON.stringify(item));
    this.route.navigate(['/booktickets/select-route']);
  }

  onDetail(item:any){
    sessionStorage.setItem("routeDetail", JSON.stringify(item));
    this.route.navigate(['/schedule/detail', item.id]);
  }
}
