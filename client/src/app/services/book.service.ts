import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Ben } from "../models/Ben";
import { Observable, of } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BookService {

  step1 = {
    departure: {
      id: '',
      toStationName: ''
    },
    destination: {
      id: '',
      toStationName: ''
    },
    daygo: "",
    returnday: "",
    isOneWay: true,
  };

  step2 = {
    routerId: 0,
    time: 0,
    boardingPoint: {
      id: '',
      name: ''
    },
    seats: [],
    number: 0,
    totalMoney: 0
  };

  listDeparture: Ben[];

  private urlBen = "http://localhost:8082/api/ben";
  private urlTuyen = "http://localhost:8082/api/tuyenxe";
  private urlTram = "http://localhost:8082/api/tram-dung";
  private urlGiuong = "http://localhost:8082/api/web/giuong";
  private urlTicket = "http://localhost:8082/api/ve";
  private urlPayPal = "http://localhost:8082/api/paypal";
  private urlTransPayPal = "https://api.sandbox.paypal.com/v2/checkout/orders/";
  /*   private urlCity = "https://cors-anywhere.herokuapp.com/https://thongtindoanhnghiep.co"; */
  private urlCity = "https://dc.tintoc.net/app/api-customer/public/provinces?page=0&size=100";

  constructor(public http: HttpClient) { }

  getAllBen(): Observable<any> {
    return this.http.get<any>(this.urlBen);
  }

  getBenById(id: any): Observable<any> {
    return this.http.get<any>(this.urlBen + "/get-list-ben-toi?ben_di_id=" + id);
  }

  getRouterId(ben_di_id: any, ben_toi_id: any) {
    return this.http.get<any>(this.urlTuyen + "/get-tuyen-xe?diem_di_id=" + ben_di_id + "&diem_toi_id=" + ben_toi_id);
  }

  getRunTime(id: any, ngay: any): Observable<any> {
    return this.http.get<any>(this.urlTuyen + "/" + id + "/gio-chay?ngay=" + ngay);
  }

  getListStop(diemDi: any, diemToi: any): Observable<any> {
    return this.http.get<any>(this.urlTram + "/get-list-tram-dung-tuyen-xe?diem_di=" + diemDi + "&diem_toi=" + diemToi);
  }

  getStatusSeat(tuyen_xe_id: any, gio: any, ngay: any): Observable<any> {
    return this.http.get<any>(this.urlGiuong + "/get-list-giuong-for-xe?tuyen_xe_id=" + tuyen_xe_id + "&gio=" + gio + "&ngay=" + ngay);
  }

  getRoterPopular(): Observable<any> {
    return this.http.get<any>(this.urlTuyen + "/get-tuyen-xe-pho-bien");
  }

  getRouter(): Observable<any> {
    return this.http.get<any>(`${this.urlTuyen}/`);
  }

  postCreateTicket(ticket: any): Observable<any> {
    return this.http.post(this.urlTicket + "/create", ticket);
  }

  postCreateTicket2(ticket: any): Observable<any> {
    return this.http.post(this.urlTicket + "/create2", ticket);
  }

  getSearch(code: any): Observable<any> {
    return this.http.get(this.urlTicket + "/get-ve-by-code?code=" + code);
  }

  getTokenPayPal(): Observable<any> {
    return this.http.get(this.urlPayPal + "/pay/get-token");
  }

  getTransectionPayPal(orderId: any, token: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*",
        'Authorization': token
      })
    };
    return this.http.get(this.urlTransPayPal + orderId, httpOptions);
  }

  getCancel(ticketId: any): Observable<any> {
    return this.http.get(this.urlPayPal + "/pay/" + ticketId + "/refund");
  }


  getAllCity(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Headers': 'Content-Type',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
    };
    return this.http.get(this.urlCity, httpOptions);
  }

  getAllDistrict(cityId: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Headers': 'Content-Type',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
    };
    return this.http.get("https://dc.tintoc.net/app/api-customer/public/districts?page=0&size=100&provinceId.equals=" + cityId, httpOptions);
  }

  postCancelRoute(routeId: any): Observable<any> {
    return this.http.get(this.urlPayPal + "/cancel-tuyen-xe?id_tuyen_xe=" + routeId);
  }

  postReturnRoute(routeId: any, token: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*",
        'Authorization': token
      })
    };

    return this.http.post(this.urlTuyen + "/" + routeId + "/bat-tuyen-xe", null, httpOptions)

  }



}
