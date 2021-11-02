import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RouteConfigLoadEnd } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private endpoint = "http://localhost:3000/v1/";
  private url = "http://localhost:8082/api/admin";
  private urlRoute = "http://localhost:8082/api/tuyenxe";
  private urlCustomer =  'http://localhost:8082/api/khach-hang';
  private urlCar = "http://localhost:8082/api/xe";
  private urlTicket = "http://localhost:8082/api/ve";
  private urlExcel = "http://localhost:8082/api/excel/";
  private urlB = "http://localhost:8082/api/ben";



  constructor(public http: HttpClient) { }

  getAllRoute():Observable<any>{
    return this.http.get(this.urlRoute+"/");
  }

  registerUser(token:any,account:any):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*",
        'Authorization': token })
    };
    return this.http.post(this.url+'/create',account,httpOptions);
  }


/*   postAccount(token:any,account:any):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*",
        'Authorization': token })
    };
    return this.http.post(this.urlCustomer+'/get-all-user',account,httpOptions);
  } */


  postCreateRote(token:any,route:any):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*",
        'Authorization': token })
    };
    return this.http.post(this.urlRoute+'/create',route,httpOptions);
  }

  postUpdateRoute(token:any,routeId:any,route:any):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*",
        'Authorization': token })
    };
    return this.http.post(this.urlRoute+"/"+routeId+'/update/',route,httpOptions);
  }

  getAllCar(token:any):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*",
        'Authorization': token })
    };
    return this.http.get(this.urlCar+"/",httpOptions);
  }

  postCreateCar(token:any,car:any):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*",
        'Authorization': token })
    };
    return this.http.post(this.urlCar+"/create",car,httpOptions);
  }

  postUpdateCar(token:any,carId:any,car:any):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*",
        'Authorization': token })
    };
    return this.http.post(this.urlCar+"/update/"+carId,car,httpOptions);
  }

  getStatisticsByDateRevenue(date:any,selecter:any):Observable<any>{
    return this.http.get(this.urlTicket+"/thong-ke-doanh-thu?time="+date+"&selecter="+selecter);
  }

  getStatisticsByMonthRevenue(date:any,selecter:any):Observable<any>{
    return this.http.get(this.urlTicket+"/thong-ke-doanh-thu?time="+date+"&selecter="+selecter);
  }

  getStatisticByDateRoute(date:any,selecter:any):Observable<any>{
    return this.http.get(this.urlTicket+"/thong-ke-theo-tuyen?time="+date+"&selecter="+selecter);
  }

  getStatisticsByMonthRoute(date:any,selecter:any):Observable<any>{
    return this.http.get(this.urlTicket+"/thong-ke-theo-tuyen?time="+date+"&selecter="+selecter);
  }

  uploadImage(file:any){
    const fd = new FormData();
    fd.append("file",file);
    return this.http.post<any>(`https://uploadfileimage.herokuapp.com/uploadfileimage`,fd)
    .pipe(map(res=>{
        return res;
    }));
  }

  getAllRouteToExport(token:any):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*",
        'Authorization': token })
    };
    return this.http.get(this.urlRoute+"/list-tuyen-xe-theo-ve",httpOptions);
  }

  postExcel(token:any,routeId:any, time:any):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*",
        'Authorization': token })
    };
    return this.http.post(this.urlExcel+"xuat-file?id_tuyen_xe="+routeId+"&gio="+time,null,httpOptions);
  }

  getAllRouteInfor():Observable<any>{
    return this.http.get(this.urlB);
  }

  postCreateB(token:any,data:any):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*",
        'Authorization': token })
    };
    return this.http.post(this.urlB+"/create",data,httpOptions);
  }

  postUpdateB(token:any,id:any,data:any):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*",
        'Authorization': token })
    };
    return this.http.post(this.urlB+"/"+id+"/update",data,httpOptions);
  }


  postCancelDependency(token:any,body:any):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*",
        'Authorization': token })
    };
    return this.http.post(this.urlRoute+"/tao-tuyen-off",body,httpOptions);
  }

}
