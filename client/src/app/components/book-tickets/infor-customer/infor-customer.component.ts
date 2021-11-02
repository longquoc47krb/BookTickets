import { Component, IterableDiffers, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BookService } from 'src/app/services/book.service';

@Component({
  selector: 'app-infor-customer',
  templateUrl: './infor-customer.component.html',
  styles: [
  ]
})
export class InforCustomerComponent implements OnInit {

  form: FormGroup;
  submitted = false;

  listAllCity:any;
  listDistrict:any;
  b1:any;
  constructor(private fb:FormBuilder, private router: Router, private service: BookService) { }

  ngOnInit(): void {
    console.log(sessionStorage.getItem('b1'));
    this.b1 = JSON.parse(sessionStorage.getItem('b1'));
    this.loadForm(this.b1.isOneWay);
    this.getAllCity();
    console.log(sessionStorage.getItem('b2'));
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      phone: ['', [Validators.required,Validators.pattern("^[0-9]*$"),Validators.maxLength(10), Validators.minLength(10)]],
      email: ['', [Validators.required,Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
      city: ['', [Validators.required]],
      district: ['', [Validators.required]],
      point: ['', [Validators.required]],
      pointReturn: ['', [Validators.required]]
    });
  }


  onSubmit(){
    // stop here if form is invalid
    if (this.form.value.username == '') {
      window.alert('Xin hãy điền tên');
      return;
    }
    if (this.form.value.email == '') {
      window.alert('Xin hãy điền email');
      return;
    }
    if(this.form.value.phone[0]!=0){
      window.alert('Số điện thoại phải bắt đầu bằng số 0');
      return
    }
    if(this.isCheck==false){
      window.alert('Bạn chưa đồng ý các điều kiện của nhà xe');
      return
    }
    if (this.form.value.city == '') {
      window.alert('Xin hãy chọn thành phố');
      return;
    }
    if (this.form.value.district == '') {
      window.alert('Xin hãy chọn quận huyện');
      return;
    }
    sessionStorage.setItem('b3',JSON.stringify(this.form.value))

    var b1 = JSON.parse(sessionStorage.getItem("b1"));

    console.log(this.form.value);

    if(b1.isOneWay==false){
      this.router.navigate(['/booktickets/pay-two-way'])
    }
    else{
      this.router.navigate(['/booktickets/pay'])
    }

    
    
  }

  isCheck = false;
  onChecked(){
    this.isCheck == true ? this.isCheck = false : this.isCheck = true
  }

  onClick(){
    this.router.navigate(['policy/rules'])
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
    this.form.value.city = this.listAllCity.find((element => element.id==cityId)).name;
    this.service.getAllDistrict(cityId).subscribe(
      data => {
        this.listDistrict = data;
        this.form.value.district = this.listDistrict[0].name;
      }
    )
  }

  onChangeDistric(name:any){
    this.form.value.district = name;
  }

  onBack(){
    if(this.b1.isOneWay==true){
      this.router.navigate(["/booktickets/select-seat"])
    }
    else{
      this.router.navigate(["/booktickets/select-seat-two-way"])
    }
  }

  loadForm(isOneWay:any){
    var doc = (<HTMLInputElement>document.getElementById("point-return"))

    if(isOneWay==true){
      doc.disabled = true;
    }
    else{
      doc.disabled = false;
    }
  }
  


}
