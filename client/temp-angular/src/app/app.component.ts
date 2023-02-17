import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Redis';
  titleSmall = 'Shopping';
  cartTitle = 'Cart';
  searchItem = '';
  totalQuantity = 0;
  carts = [];
  showCart = false;
  details = [
    {
      "id": 1,
      "name": "Nike Air Zoom Pegasus 37",
      "brand": "Nike",
      "price": 120.00,
      "description": "The Nike Air Zoom Pegasus 37 is a running shoe with Zoom Air technology for a smooth and responsive ride.",
      "category": "Running",
      "image_url": "https://c4.wallpaperflare.com/wallpaper/601/305/95/nike-full-hd-wallpaper-preview.jpg"
    },
    {
      "id": 2,
      "name": "Adidas UltraBoost 21",
      "brand": "Adidas",
      "price": 180.00,
      "description": "The Adidas UltraBoost 21 is a running shoe with a responsive Boost midsole for a plush, energized ride.",
      "category": "Running",
      "image_url": "https://c4.wallpaperflare.com/wallpaper/601/305/95/nike-full-hd-wallpaper-preview.jpg"
    },
    {
      "id": 3,
      "name": "Converse Chuck Taylor All Star",
      "brand": "Converse",
      "price": 55.00,
      "description": "The Converse Chuck Taylor All Star is a classic canvas shoe with a rubber toe cap and sole.",
      "category": "Casual",
      "image_url": "https://c4.wallpaperflare.com/wallpaper/601/305/95/nike-full-hd-wallpaper-preview.jpg"
    },
    {
      "id": 4,
      "name": "New Balance Fresh Foam 1080v11",
      "brand": "New Balance",
      "price": 150.00,
      "description": "The New Balance Fresh Foam 1080v11 is a cushioned running shoe with a plush, comfortable fit.",
      "category": "Running",
      "image_url": "https://c4.wallpaperflare.com/wallpaper/601/305/95/nike-full-hd-wallpaper-preview.jpg"
    },
    {
      "id": 5,
      "name": "Under Armour HOVR Infinite 2",
      "brand": "Under Armour",
      "price": 130.00,
      "description": "The Under Armour HOVR Infinite 2 is a lightweight running shoe with HOVR technology for a zero gravity feel.",
      "category": "Running",
      "image_url": "https://c4.wallpaperflare.com/wallpaper/601/305/95/nike-full-hd-wallpaper-preview.jpg"
    },
    {
      "id": 6,
      "name": "Puma Calibrate Runner",
      "brand": "Puma",
      "price": 85.00,
      "description": "The Puma Calibrate Runner is a versatile running shoe with a sleek, modern design.",
      "category": "Running",
      "image_url": "https://c4.wallpaperflare.com/wallpaper/601/305/95/nike-full-hd-wallpaper-preview.jpg"
    },
    {
      "id": 7,
      "name": "Vans Old Skool",
      "brand": "Vans",
      "price": 65.00,
      "description": "The Vans Old Skool is a classic skate shoe with the iconic side stripe.",
      "category": "Casual",
      "image_url": "https://c4.wallpaperflare.com/wallpaper/601/305/95/nike-full-hd-wallpaper-preview.jpg"
    }
  ];


  finalData = [...this.details];

  onClickSearch() {
    //dummy full name search (add loader)
    if (this.searchItem && this.searchItem.length) {
      this.finalData = this.details.filter(element => element.name == this.searchItem);
    } else {
      this.finalData = [...this.details];
    }
  }

  onClickAddToCart(_element) {
    if (_element && _element.id) {
      let existElmIndex = this.carts.findIndex(_elm => _elm.id == _element.id);
      if (existElmIndex > -1) {
        _element.quantity = _element.quantity ? _element.quantity + 1 : 1;
      } else {
        _element.quantity = 1;
        this.carts.push(_element);
      }
      this.totalQuantity++;
    }
  }

  onClickCartToggle(isShow) {
    this.showCart = isShow;
  }

  onClickQuantityIcon(_item, _isAdd) {
    if (_item) {
      if (!_item.quantity) {
        _item.quantity = 1; //min
      }
      if (_isAdd) {
        _item.quantity += 1;
        this.totalQuantity++;
      } else {
        if (_item.quantity !== 1) {//min
          _item.quantity -= 1;
          this.totalQuantity--;
        }
      }
    }
  }

  onClickRemoveFromCart(_item) {
    if (_item) {
      let elmIndex = this.carts.findIndex(_elm => _elm.id == _item.id);
      this.carts.splice(elmIndex, 1);
      if (_item.quantity) {
        this.totalQuantity = this.totalQuantity - _item.quantity;
      }
      if (!this.carts || !this.carts.length) {
        this.showCart = false;
      }
    }
  }
}
