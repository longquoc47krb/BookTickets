import { SharedModule } from './shared/shared.module';
import { UserService } from './services/user.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './components/account/login/login.component';
import { RegisterComponent } from './components/account/register/register.component';
import { NewsListComponent } from './components/news/news-list/news-list.component';
import { NewsDetailsComponent } from './components/news/news-details/news-details.component';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { DetailComponent } from './components/schedule/detail/detail.component';
import { SelectRouteComponent } from './components/book-tickets/select-route/select-route.component';
import { SelectSeatComponent } from './components/book-tickets/select-seat/select-seat.component';
import { InforCustomerComponent } from './components/book-tickets/infor-customer/infor-customer.component';
import { PayComponent } from './components/book-tickets/pay/pay.component';
import { RulesComponent } from './components/policy/rules/rules.component';
import { InvoiceComponent } from './components/invoice/invoice.component';
import { HttpClientModule } from '@angular/common/http';

import { SuccessComponent } from './components/account/success/success.component';
import { BookTicketComponent } from './components/account/success/book-ticket/book-ticket.component';
import { HistoryComponent } from './components/account/success/history/history.component';
import { RewardPointComponent } from './components/account/success/reward-point/reward-point.component';
import { InforLoginComponent } from './components/account/success/infor-login/infor-login.component';
import { InforPersonalComponent } from './components/account/success/infor-personal/infor-personal.component';
import { SelectPayComponent } from './components/account/success/pay/select-pay/select-pay.component';
import { AddminComponent } from './components/account/addmin/addmin.component';

import { BookService } from '../../src/app/services/book.service';
import { AuthService } from '../../src/app/services/auth.service';
import { AdminService } from "../../src/app/services/admin.service";
import { PaypallComponent } from './components/paypall/paypall.component';
import { SelectSeatReturnAwayComponent } from './components/book-tickets/select-seat-return-away/select-seat-return-away.component';
import { PayTwoWayComponent } from './components/book-tickets/pay-two-way/pay-two-way.component';
import { PaypallTwoWayComponent } from './components/paypall-two-way/paypall-two-way.component';
import { InforMultipleCustomerComponent } from './components/book-tickets/infor-multiple-customer/infor-multiple-customer.component';
import { InforMultipleCustomerTwoWayComponent } from './components/book-tickets/infor-multiple-customer-two-way/infor-multiple-customer-two-way.component';
import { JwtModule } from '@auth0/angular-jwt';
import { NotFoundComponent } from './components/not-found/not-found.component';




@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    FooterComponent,
    LoginComponent,
    RegisterComponent,
    NewsListComponent,
    NewsDetailsComponent,
    ScheduleComponent,
    DetailComponent,
    SelectRouteComponent,
    SelectSeatComponent,
    InforCustomerComponent,
    PayComponent,
    RulesComponent,
    InvoiceComponent,
    SuccessComponent,
    BookTicketComponent,
    HistoryComponent,
    RewardPointComponent,
    InforLoginComponent,
    InforPersonalComponent,
    SelectPayComponent,
    AddminComponent,
    PaypallComponent,
    SelectSeatReturnAwayComponent,
    PayTwoWayComponent,
    PaypallTwoWayComponent,
    InforMultipleCustomerComponent,
    InforMultipleCustomerTwoWayComponent,
    NotFoundComponent,


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: (): string => localStorage.getItem('token'),
        // allowedDomains: ['localhost:3000', 'localhost:4200']
      }
    })

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [AuthService, BookService, AdminService, UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
