import { Component, forwardRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HAMMER_LOADER } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BookService } from 'src/app/services/book.service';

@Component({
  selector: 'app-infor-multiple-customer',
  templateUrl: './infor-multiple-customer.component.html',
  styles: [
  ]
})
export class InforMultipleCustomerComponent implements OnInit {

  form: FormGroup;
  formBuyer: FormGroup;
  submitted = false;

  listAllCity:any;
  listDistrict:any;
  b2:any;

  listForm = [];
  listSeats = [];
  listSeatsContinues = [];

  constructor(private fb:FormBuilder, private router: Router, private service: BookService) { }

  ngOnInit(): void {
    this.formBuyer = this.fb.group({
      username: ['', [Validators.required]],
      phone: ['', [Validators.required,Validators.pattern("^[0-9]*$"),Validators.maxLength(11), Validators.minLength(9)]],
      email: ['', [Validators.required,Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
      city: ['', [Validators.required]],
      district: ['', [Validators.required]],
      point: ['', [Validators.required]],
      bed: ['', [Validators.required]]
    });
    this.load();
  }

  load(){

    this.b2 = JSON.parse(sessionStorage.getItem('b2'));

    this.listSeats = this.ConvertSeats(this.b2.seats);

    var length = this.listSeats.length;
    for(let i=1;i<length;i++){
      this.listSeatsContinues.push(this.listSeats[i]);
    }

    this.getAllCity();

    this.createForm(this.b2.seats.length-1);
  }

  createForm(length:any){
    for(var i =0; i< length; i++){
      this.form = this.fb.group({
        username: ['', [Validators.required]],
        phone: ['', [Validators.required,Validators.pattern("^[0-9]*$"),Validators.maxLength(10), Validators.minLength(10)]],
        address: ['', [Validators.required]],
        point: ['', [Validators.required]],
        bed: ['', [Validators.required]]
      });
      this.listForm.push(this.form)
    }

    for(let i of this.listForm){
      console.log(i.value);
    }
  }

  onSubmit(){
    if(this.onCheckBeforeSubmit() == true){

      if(this.formBuyer.value.bed == "")
        this.formBuyer.value.bed = this.ConvertSeats(this.b2.seats)[0];

      var length = this.listForm.length;
      for(let i=0; i<length;i++){
        this.listForm[i].value.bed = this.listSeatsContinues[i];
      }
     
      //Lưu thông tin người mua
      sessionStorage.setItem('b3',JSON.stringify(this.formBuyer.value));
      console.log("Session for buyer");
      console.log(sessionStorage.getItem('b3'))
      
      for(let i =0;i<length;i++){
        var name = 'p'+(i+1);
        console.log("Session for person"+(i+1));
        sessionStorage.setItem(name,JSON.stringify(this.listForm[i].value));
        console.log(sessionStorage.getItem(name));
      }

      this.router.navigate(['/booktickets/pay']);

    }
  }

  onCheckBeforeSubmit(){
    var length = this.listForm.length;
    for(let i=0;i<length;i++){
      if(this.listForm[i].value.username==""){
        return alert("Xin hãy nhập tên người thứ "+(i+1));
      }
      if(this.listForm[i].value.phone[0]!=0){
        return alert("Xin hãy nhập đúng số điện thoại của người thứ "+(i+1));
      }
      if(this.listForm[i].value.address == ""){
        return alert("Xin hãy nhập nơi ở của người thứ "+(i+1));
      }
      if(this.isCheck = false){
        return alert('Xin hãy chấp nhận điều khoản đặt vé');
      }
    }
    return true;
  }

  isCheck = false;
  onChecked(){
    this.isCheck == true ? this.isCheck = false : this.isCheck = true
  }

  onBack(){
    this.router.navigate(["/"]);
  }

  getAllCity(){
    this.service.getAllCity().subscribe(
      data => {
        this.listAllCity = data;
        console.log(data);
      }
    )
  }

  onChangeCity(cityId:any){
    this.formBuyer.value.city = this.listAllCity.find((element => element.id==cityId)).name;
    this.service.getAllDistrict(cityId).subscribe(
      data => {
        this.listDistrict = data;
        this.formBuyer.value.district = this.listDistrict[0].name;
      }
    )
  }

  onChangeDistric(name:any){
    this.formBuyer.value.district = name;
  }

  ConvertSeats(listSeats:any){
    var list = [];
    for(let i of listSeats){
      var temp = "";
      if(i<10){
        temp = "A0"+i;
      }
      else if(i>=10&&i<=22){
        temp = "A"+i
      }
      else if(i-22<10&&i-22>0){
        temp = "B0"+(i-22);
      }
      else{
        temp = "B"+(i-22);
      }
      list.push({
        id:i,
        name: temp
      })
    }
    return list;
  }
  
  onChangeSeat(obj:any){
    this.listSeatsContinues = [];
    var length = this.listSeats.length;
    var count = 0;
    for(let i = 0; i< length; i++){
      if(this.listSeats[i].id != obj){
        this.listSeatsContinues.push(this.listSeats[i]);
        this.listForm[count].value.bed = (this.listSeats[i]);
        count ++;
      }
      else{
        console.log("aaa");
        console.log(this.listSeats[i]);
        this.formBuyer.value.bed = this.listSeats[i];
      }
    }

   

    console.log("Danh sách các giường phân phối");
    console.log(this.listSeatsContinues);
    console.log("Thông tin form buyer");
    console.log(this.formBuyer.value);
    console.log("Thông tin form");
    for(let i of this.listForm){
      console.log(i.value);
    }
  }

}
