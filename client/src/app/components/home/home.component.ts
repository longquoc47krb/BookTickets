import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


declare var $:any

import { BookService } from "./../../services/book.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [
  ]
})
export class HomeComponent implements OnInit {

  items = ['oneway','round'];

  today:any;
  listDeparture:any;
  listDestination: any;
  listPopularRoute: [];
  listPopularDestination: [];
  allRouter = [];




  constructor( private route: Router, public ser: BookService) { 
  }

  ngOnInit(): void {
    this.load();
    (<HTMLInputElement>document.getElementById("return-date")).disabled = true;
    
  }

  onItemChange(x){
    if(x==this.items[0]){
      (<HTMLInputElement>document.getElementById("return-date")).value = "";
      (<HTMLInputElement>document.getElementById("return-date")).disabled = true
      this.ser.step1.isOneWay = true;
      this.ser.step1.returnday = "";
    }
    else{
      (<HTMLInputElement>document.getElementById("return-date")).disabled = false
      this.ser.step1.isOneWay = false;
    }
  }

  load(){
    this.getDate()
    $('.multiple-items').slick({
      infinites:true,
      slidesToShow:5,
      slidesToScroll:1,
      arrows:false,
      dots:false,
      autoplay: true,
      autoplaySpeed: 2000,
      centerMode:true,
      centerPadding:'0',
      pauseOnHover: false,
      responsive: [
        {
          breakpoint: 1100,
          settings: {
            arrows: false,
            centerMode: true,
            centerPadding: '40px',
            slidesToShow: 4
          }
        },
        {
          breakpoint: 900,
          settings: {
            arrows: false,
            centerMode: true,
            centerPadding: '40px',
            slidesToShow: 2
          }
        },
        {
          breakpoint: 700,
          settings: {
            arrows: false,
            centerMode: true,
            centerPadding: '40px',
            slidesToShow: 1
          }
        }
      ]
    });
  
    this.ser.getAllBen().subscribe(data => {
      this.listDeparture = data.data;
      this.provinceChange(this.listDeparture[0].id,0);
      this.ser.step1.departure.ben_toi = data.data[0].thanh_pho.replace('Bến xe','');
      this.ser.step1.departure.id = this.listDeparture[0].id.toString();
      sessionStorage.setItem('lBenDi', JSON.stringify(this.listDeparture));
    });
    this.ser.step1.isOneWay = true;

    this.ser.getRoterPopular().subscribe(
      data => {
        this.listPopularDestination = data.data;
        console.log(this.listPopularDestination);
      }
    )

    this.onGetTokenPayPal();
  }

  submit(){
    if(this.ser.step1.isOneWay == false && this.ser.step1.returnday == ""){
      window.alert("xin hay chon ngay ve");
      return;
    }

    sessionStorage.setItem('b1',JSON.stringify(this.ser.step1));
    console.log('Step1: '+sessionStorage.getItem('b1'));
    

    if(this.ser.step1.isOneWay == false){
      this.route.navigate(['/booktickets/select-seat-two-way']);
    }
    else{
      this.route.navigate(['/booktickets/select-seat']);
    }
  }
    
  getDate(){
    var today = new Date();
    var x = (<HTMLInputElement>document.getElementById("date"));
    x.value = today.getFullYear()+ '-' + ('0' + (today.getMonth() + 1)).slice(-2)  + '-' + ('0' + today.getDate()).slice(-2);
    this.ser.step1.daygo = ('0' + today.getDate()).slice(-2)+"/"+('0' + (today.getMonth() + 1)).slice(-2)+"/"+today.getFullYear();
    this.today = x.value;
    
  }

  dateChanged(obj:any){
    var dd = new Date(obj.value);
    var value = ('0' + dd.getDate()).slice(-2)+'/'+('0' + (dd.getMonth() + 1)).slice(-2) +"/"+dd.getFullYear();
    this.ser.step1.daygo = value;
    
  }

  dateChangedReturn(obj:any){

    var dd = new Date(obj.value);
    var value = ('0' + dd.getDate()).slice(-2)+'/'+('0' + (dd.getMonth() + 1)).slice(-2) +"/"+dd.getFullYear();
    this.ser.step1.returnday = value;
  }

provinceChange(obj:any,index:any){
    if(index==0){
      this.ser.getBenById(obj).subscribe(
        data => {
          this.listDestination = data.data;
          this.ser.step1.destination.ben_toi = this.listDestination[0].ben_toi;
          this.ser.step1.destination.id = this.listDestination[0].id;
          sessionStorage.setItem('lBenToi', JSON.stringify(this.listDestination));
        }
      )
      const item = this.listDeparture.find(departure => departure.id == obj);
      this.ser.step1.departure.ben_toi = item.ben_toi;
      this.ser.step1.departure.id = item.id.toString();
    }
    else{
      const item = this.listDestination.find(destination => destination.id == obj);
      this.ser.step1.destination.ben_toi = item.ben_toi;
      this.ser.step1.destination.id = item.id.toString();  
    }
  }

  onGetTokenPayPal(){
    this.ser.getTokenPayPal().subscribe(
      data => {
        sessionStorage.setItem("tokenPayPal",JSON.stringify(data.accessToken));
      }
    )
  }

  onTranser(obj:any){
    this.getAllRoter(obj.id);
  }


  getAllRoter(index:any){
    this.ser.getRouter().subscribe(
      data => {
        this.allRouter = data.data;
        for(let i of this.allRouter){
          if(i.id == index){
            sessionStorage.setItem('routeDetail', JSON.stringify(i));
            this.route.navigate(['/schedule/detail', index]);
            break;
          }
        }
      }
    );
  }


}
