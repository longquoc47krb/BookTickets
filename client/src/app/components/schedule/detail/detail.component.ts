import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from 'src/app/services/book.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styles: [
  ]
})
export class DetailComponent implements OnInit {

  routeId;
  route;

  listSang = [];
  listChieu = [];
  listToi = [];

  constructor(private routers: Router,private router: ActivatedRoute, private service: BookService ) { }

  ngOnInit(): void {
    

      this.routeId = this.router.snapshot.params['id'];
    

    this.route = JSON.parse(sessionStorage.getItem('routeDetail'));
    this.getTime(this.routeId);
  }

  getTime(routerId:any){
    var dd = new Date();
    var value = ('0' + dd.getDate()).slice(-2)+'/'+('0' + (dd.getMonth() + 1)).slice(-2) +"/"+dd.getFullYear();

    this.service.getRunTime(routerId,value).subscribe(res=>{
        for(let i of res.data){
          if(i.giochay<12)
            this.listSang.push(i.giochay)
          else if(i.giochay>=12&&i.giochay<17)
            this.listChieu.push(i.giochay)
          else 
            this.listToi.push(i.giochay)
        }
      console.log(this.listToi);
    });
  }

  onBook(){
    sessionStorage.setItem('schedule',JSON.stringify(this.route));
    this.routers.navigate(['/booktickets/select-route']);
  }

}
