import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BookService } from 'src/app/services/book.service';

@Component({
  selector: 'app-infor-multiple-customer-two-way',
  templateUrl: './infor-multiple-customer-two-way.component.html',
  styles: [
  ]
})
export class InforMultipleCustomerTwoWayComponent implements OnInit {

  form: FormGroup;
  formBuyer: FormGroup;
  formBuyerReturn: FormGroup;
  submitted = false;

  listAllCity:any;
  listDistrict:any;

  listAllCityReturn:any;
  listDistrictReturn:any;
  b2:any;

  listForm = [];
  listFormReturn = [];

  listSeats = [];
  listSeatsContinues = [];

  listSeatsReturn = [];
  listSeatsContinuesReturn = [];

  oneWay:any;
  twoWay:any;

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

    this.formBuyerReturn = this.fb.group({
      username: ['', [Validators.required]],
      phone: ['', [Validators.required,Validators.pattern("^[0-9]*$"),Validators.maxLength(11), Validators.minLength(9)]],
      email: ['', [Validators.required,Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
      city: ['', [Validators.required]],
      district: ['', [Validators.required]],
      point: ['', [Validators.required]],
      bed: ['', [Validators.required]]
    })

    this.load();
  }

  load(){

    this.b2 = JSON.parse(sessionStorage.getItem('b2'));

    this.oneWay = JSON.parse(sessionStorage.getItem("oneWay"));
    this.twoWay = JSON.parse(sessionStorage.getItem("twoWay"));

    console.log("One way");
    console.log(this.oneWay);
    console.log("Two way");
    console.log(this.twoWay);

    this.listSeats = this.ConvertSeats(this.oneWay.slot);
    this.listSeatsReturn = this.ConvertSeats(this.twoWay.slot);

    console.log("Danh sách ghế đi");
    console.log(this.listSeats);
    console.log("Danh sách ghế về");
    console.log(this.listSeatsReturn);

    var length = this.listSeats.length;
    for(let i=1;i<length;i++){
      this.listSeatsContinues.push(this.listSeats[i]);
    }

    length = this.listSeatsReturn.length;
    for(let i=1;i<length;i++){
      this.listSeatsContinuesReturn.push(this.listSeatsReturn[i]);
    }

    console.log("Danh sách ghế đi còn lại");
    console.log(this.listSeatsContinues);
    console.log("Danh sách ghế về còn lại");
    console.log(this.listSeatsContinuesReturn);

    this.getAllCity();
    
    this.createForm(this.listSeats.length-1, length - 1);

  }

  createForm(length:any, lengthReturn:any){
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

    console.log("Dữ liệu Form đi");
    for(let i of this.listForm){
      console.log(i.value);
    }

    for(var i =0; i< lengthReturn; i++){
      this.form = this.fb.group({
        username: ['', [Validators.required]],
        phone: ['', [Validators.required,Validators.pattern("^[0-9]*$"),Validators.maxLength(10), Validators.minLength(10)]],
        address: ['', [Validators.required]],
        point: ['', [Validators.required]],
        bed: ['', [Validators.required]]
      });
      this.listFormReturn.push(this.form)
    }

    console.log("Dữ liệu Form về");
    for(let i of this.listFormReturn){
      console.log(i.value);
    }
    
  }

  onSubmit(){

    if(this.onCheckBeforeSubmit()==true){

      if(this.formBuyer.value.bed == "")
        this.formBuyer.value.bed = this.ConvertSeats(this.oneWay.slot)[0];
      if(this.formBuyerReturn.value.bed == "")
        this.formBuyerReturn.value.bed = this.ConvertSeats(this.twoWay.slot)[0];


      /*       phone: ['', [Validators.required,Validators.pattern("^[0-9]*$"),Validators.maxLength(11), Validators.minLength(9)]],
      email: ['', [Validators.required,Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
      city: ['', [Validators.required]],
      district: ['', [Validators.required]], */  

      this.formBuyerReturn.value.username =  this.formBuyer.value.username;
      this.formBuyerReturn.value.phone =  this.formBuyer.value.phone;
      this.formBuyerReturn.value.email =  this.formBuyer.value.email;
      this.formBuyerReturn.value.city =  this.formBuyer.value.city;
      this.formBuyerReturn.value.district =  this.formBuyer.value.district;


      console.log("Form buyer");
      console.log(this.formBuyer.value);

      var length = this.listForm.length;
      for(let i=0; i<length;i++){
        this.listForm[i].value.bed = this.listSeatsContinues[i];
      }

      console.log("Form buyer return");
      console.log(this.formBuyerReturn.value);

      var length = this.listFormReturn.length;
      for(let i=0; i<length;i++){
        this.listFormReturn[i].value.bed = this.listSeatsContinuesReturn[i];
      }

      console.log("go");
      for(let i of this.listForm){
        console.log(i.value);
      }
  
      console.log("return");
      for(let i of this.listFormReturn){
        console.log(i.value);
      }

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
        console.log("Session for person "+(i+1));
        sessionStorage.setItem(name,JSON.stringify(this.listForm[i].value));
        console.log(sessionStorage.getItem(name));
      }

      //Lưu thông tin người mua về
      sessionStorage.setItem('b3r',JSON.stringify(this.formBuyerReturn.value));
      console.log("Session for buyer r");
      console.log(sessionStorage.getItem('b3r'))
      
      length = this.listFormReturn.length;
      for(let i =0;i<length;i++){
        var name = 'p'+(i+1)+'r';
        console.log("Session for person "+(i+1));
        sessionStorage.setItem(name,JSON.stringify(this.listFormReturn[i].value));
        console.log(sessionStorage.getItem(name));
      }
      
      this.router.navigate(['/booktickets/pay-two-way']);
    }
  }

  onCheckBeforeSubmit(){
    var length = this.listForm.length;
    for(let i=0;i<length;i++){
      if(this.listForm[i].value.username==""){
        return alert("Xin hãy nhập tên người đi thứ "+(i+1));
      }
      if(this.listForm[i].value.phone[0]!=0){
        return alert("Xin hãy nhập đúng số điện thoại của người đi thứ "+(i+1));
      }
      if(this.listForm[i].value.address == ""){
        return alert("Xin hãy nhập nơi ở của người đi thứ "+(i+1));
      }
    }

    var length = this.listFormReturn.length;
    for(let i=0;i<length;i++){
      if(this.listFormReturn[i].value.username==""){
        return alert("Xin hãy nhập tên người về thứ "+(i+1));
      }
      if(this.listFormReturn[i].value.phone[0]!=0){
        return alert("Xin hãy nhập đúng số điện thoại của người về thứ "+(i+1));
      }
      if(this.listFormReturn[i].value.address == ""){
        return alert("Xin hãy nhập nơi ở của người về thứ "+(i+1));
      }
    }

    if(this.isCheck = false){
      return alert('Xin hãy chấp nhận điều khoản đặt vé');
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
        this.listAllCityReturn = data;
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

  onChangeCityReturn(cityId:any){
    this.formBuyerReturn.value.city = this.listAllCityReturn.find((element => element.id==cityId)).name;
    this.service.getAllDistrict(cityId).subscribe(
      data => {
        this.listDistrictReturn = data;
        this.formBuyerReturn.value.district = this.listDistrictReturn[0].name;
      }
    )
  }

  onChangeDistric(name:any){
    this.formBuyer.value.district = name;
  }

  onChangeDistricReturn(name:any){
    this.formBuyerReturn.value.district = name;
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

  onChangeSeatReturn(obj:any){
    this.listSeatsContinuesReturn = [];
    var length = this.listSeatsReturn.length;
    var count = 0;
    for(let i = 0; i< length; i++){
      if(this.listSeatsReturn[i].id != obj){
        this.listSeatsContinuesReturn.push(this.listSeatsReturn[i]);
        this.listFormReturn[count].value.bed = (this.listSeatsReturn[i]);
        count ++;
      }
      else{
        this.formBuyerReturn.value.bed = this.listSeatsReturn[i];
      }
    }

    console.log("Danh sách các giường phân phối r");
    console.log(this.listSeatsContinuesReturn);
    console.log("Thông tin form buyer r");
    console.log(this.formBuyerReturn.value);
    console.log("Thông tin form r");
    for(let i of this.listFormReturn){
      console.log(i.value);
    }
  }

}
