import { NotFoundComponent } from './components/not-found/not-found.component';
import { PrivateGuard } from './guard/private.guard';
import { PublicGuard } from './guard/public.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/account/login/login.component';
import { RegisterComponent } from './components/account/register/register.component';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { DetailComponent } from './components/schedule/detail/detail.component';
import { SelectRouteComponent } from './components/book-tickets/select-route/select-route.component';
import { SelectSeatComponent } from './components/book-tickets/select-seat/select-seat.component';
import { InforCustomerComponent } from './components/book-tickets/infor-customer/infor-customer.component';
import { PayComponent } from './components/book-tickets/pay/pay.component';
import { RulesComponent } from './components/policy/rules/rules.component';
import { InvoiceComponent } from './components/invoice/invoice.component';
import { SuccessComponent } from './components/account/success/success.component';
import { AddminComponent } from './components/account/addmin/addmin.component';
import { SelectSeatReturnAwayComponent } from './components/book-tickets/select-seat-return-away/select-seat-return-away.component';
import { PayTwoWayComponent } from './components/book-tickets/pay-two-way/pay-two-way.component';
import { InforMultipleCustomerComponent } from './components/book-tickets/infor-multiple-customer/infor-multiple-customer.component';
import { InforMultipleCustomerTwoWayComponent } from './components/book-tickets/infor-multiple-customer-two-way/infor-multiple-customer-two-way.component';


const routes: Routes = [
  {path:'', component: HomeComponent},
  {path:'login', component:LoginComponent, canActivate: [PublicGuard]},
  {path:'register', component:RegisterComponent, canActivate: [PublicGuard]},
  {path:'schedule', component:ScheduleComponent, canActivate: [PublicGuard]},
  {path:'schedule/detail/:id', component:DetailComponent, canActivate: [PublicGuard]},
  {path:'booktickets/select-route', component:SelectRouteComponent, canActivate: [PublicGuard]},
  {path:'booktickets/select-seat', component:SelectSeatComponent, canActivate: [PublicGuard]},
  {path:'booktickets/infor-customer', component:InforCustomerComponent,canActivate: [PublicGuard] },
  {path:'booktickets/infor-multiple-customer', component:InforMultipleCustomerComponent, canActivate: [PublicGuard]},
  {path:'booktickets/infor-multiple-customer-two-way', component:InforMultipleCustomerTwoWayComponent, canActivate: [PublicGuard]},
  {path:'booktickets/pay', component:PayComponent, canActivate: [PublicGuard]},
  {path:'policy/rules', component:RulesComponent, canActivate: [PublicGuard]},
  {path:'invoice', component:InvoiceComponent, canActivate: [PublicGuard]},
  {path:'customer/dashboard', component:SuccessComponent, canActivate: [PrivateGuard]},
  {path:'admin/dashboard', component:AddminComponent, canActivate: [PrivateGuard]},
  {path:'booktickets/select-seat-two-way', component:SelectSeatReturnAwayComponent, canActivate: [PublicGuard]},
  {path:'booktickets/pay-two-way', component:PayTwoWayComponent, canActivate: [PublicGuard]},
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
