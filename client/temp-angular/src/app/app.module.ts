import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';

import { FormsModule } from '@angular/forms';
import { HoverCssDirective } from './directives/hove-css.directive';
import { OrderComponent } from './components/orders/orders.component';
import { Orderconfirmation } from './components/order-confirmation/order-confirmation.component';

const appRouter: Routes = [
  { path: '', component: HomeComponent },
  { path: 'orders', component: OrderComponent },
  { path: 'orderconfirm/:id', component: Orderconfirmation },
];

@NgModule({
  declarations: [
    AppComponent,
    HoverCssDirective,
    HomeComponent,
    OrderComponent,
    Orderconfirmation,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    RouterModule.forRoot(appRouter),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
