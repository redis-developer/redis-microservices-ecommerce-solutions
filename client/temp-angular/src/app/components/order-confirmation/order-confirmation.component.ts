import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.css'],
  host: {
    class: 'rds-main-container',
  },
})
export class Orderconfirmation implements OnInit {
  title = 'Redis';
  titleSmall = 'Shopping';
  pageLbl = {
    lblHead: 'Your order has been received',
    lblThanks: 'Thank you for your purchase',
    lblOrderId: 'Your order ID',
    btnTxt: 'CONTINUE SHOPPING',
  };
  productId;
  constructor(private route: ActivatedRoute, private router: Router) { }
  ngOnInit() {
    this.productId = +this.route.snapshot.params['productId'];
  }
  onClickHome() {
    this.router.navigate(['']);
  }
}
