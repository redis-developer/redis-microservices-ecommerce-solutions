import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  host: {
    class: 'rds-main-container',
  },
})
export class HomeComponent implements OnInit {
  title = 'Redis';
  titleSmall = 'Shopping';
  cartTitle = 'Cart';
  searchItem = '';
  lblNoData = 'No data to display!';
  lblLoading = 'Loading...';
  totalQuantity = 0;
  carts = [];
  showCart = false;
  showLoader = false;
  finalData = [];
  details = [
    {
      id: 11001,
      price: 5450,
      productDisplayName: 'Puma Men Top Fluctuation Red Black Watches',
      brandName: 'Puma',
      productDescriptors: {
        description: {
          descriptorType: 'description',
          value:
            '<p style="text-align: justify;">This watch from puma comes in a clean sleek design. This active watch is perfect for urban wear and can serve you well in the gym or a night of clubbing.<br /><strong><br />Case diamete</strong>r: 40 mm&lt;</p>',
        },
      },
      displayCategories: 'Accessories',
      brandUserProfile: {
        uidx: '12c1ae88.a2e0.4ada.8a85.2259c8f751fdEzea5ihq34',
        bio: "PUMA is the World's Fastest Sports Brand",
        name: 'PUMA',
        image: '../assets/fashion-dataset/images/11001.jpg',
        publicProfileId: 'PUMA',
        tagsMap:
          '{"roles":[],"labels":[],"myntraVerified":true,"invited":true,"brandUrl":"/puma"}',
      },
      styleImages: {
        default: {
          imageURL: '../assets/fashion-dataset/images/11001.jpg',
          resolutions: {
            '1080X1440Xmini':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/fd4356e4df582e29159e685e13e6c205_images_mini.jpg',
            '48X64':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/fd4356e4df582e29159e685e13e6c205_images.jpg',
            '1080X1440':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/fd4356e4df582e29159e685e13e6c205_images.jpg',
            '150X200':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/fd4356e4df582e29159e685e13e6c205_images.jpg',
            '360X480':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/fd4356e4df582e29159e685e13e6c205_images.jpg',
            '180X240':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/fd4356e4df582e29159e685e13e6c205_images.jpg',
            '360X480Xmini':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/fd4356e4df582e29159e685e13e6c205_images_mini.jpg',
            '180X240Xmini':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/fd4356e4df582e29159e685e13e6c205_images_mini.jpg',
            '150X200Xmini':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/fd4356e4df582e29159e685e13e6c205_images_mini.jpg',
            '48X64Xmini':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/fd4356e4df582e29159e685e13e6c205_images_mini.jpg',
            '125X161':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/fd4356e4df582e29159e685e13e6c205_images.jpg',
            '125X161Xmini':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/fd4356e4df582e29159e685e13e6c205_images_mini.jpg',
          },
          imageType: 'default',
        },
        search: {
          imageURL:
            'http://assets.myntassets.com/v1/images/style/properties/fd4356e4df582e29159e685e13e6c205_images.jpg',
          resolutions: {
            '1080X1440Xmini':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/fd4356e4df582e29159e685e13e6c205_images_mini.jpg',
            '48X64':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/fd4356e4df582e29159e685e13e6c205_images.jpg',
            '1080X1440':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/fd4356e4df582e29159e685e13e6c205_images.jpg',
            '150X200':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/fd4356e4df582e29159e685e13e6c205_images.jpg',
            '360X480':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/fd4356e4df582e29159e685e13e6c205_images.jpg',
            '180X240':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/fd4356e4df582e29159e685e13e6c205_images.jpg',
            '360X480Xmini':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/fd4356e4df582e29159e685e13e6c205_images_mini.jpg',
            '180X240Xmini':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/fd4356e4df582e29159e685e13e6c205_images_mini.jpg',
            '150X200Xmini':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/fd4356e4df582e29159e685e13e6c205_images_mini.jpg',
            '48X64Xmini':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/fd4356e4df582e29159e685e13e6c205_images_mini.jpg',
            '125X161':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/fd4356e4df582e29159e685e13e6c205_images.jpg',
            '125X161Xmini':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/fd4356e4df582e29159e685e13e6c205_images_mini.jpg',
          },
          imageType: 'search',
        },
        back: {
          imageURL:
            'http://assets.myntassets.com/v1/images/style/properties/6d65701e42136cf6b517a4a50c14485a_images.jpg',
          resolutions: {
            '1080X1440Xmini':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/6d65701e42136cf6b517a4a50c14485a_images_mini.jpg',
            '48X64':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/6d65701e42136cf6b517a4a50c14485a_images.jpg',
            '1080X1440':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/6d65701e42136cf6b517a4a50c14485a_images.jpg',
            '150X200':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/6d65701e42136cf6b517a4a50c14485a_images.jpg',
            '360X480':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/6d65701e42136cf6b517a4a50c14485a_images.jpg',
            '180X240':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/6d65701e42136cf6b517a4a50c14485a_images.jpg',
            '360X480Xmini':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/6d65701e42136cf6b517a4a50c14485a_images_mini.jpg',
            '180X240Xmini':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/6d65701e42136cf6b517a4a50c14485a_images_mini.jpg',
            '150X200Xmini':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/6d65701e42136cf6b517a4a50c14485a_images_mini.jpg',
            '48X64Xmini':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/6d65701e42136cf6b517a4a50c14485a_images_mini.jpg',
            '125X161':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/6d65701e42136cf6b517a4a50c14485a_images.jpg',
            '125X161Xmini':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/6d65701e42136cf6b517a4a50c14485a_images_mini.jpg',
          },
          imageType: 'back',
        },
        left: {
          imageURL:
            'http://assets.myntassets.com/v1/images/style/properties/20dbcd144d59c024bd8d1ba541c6b7e6_images.jpg',
          resolutions: {
            '1080X1440Xmini':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/20dbcd144d59c024bd8d1ba541c6b7e6_images_mini.jpg',
            '48X64':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/20dbcd144d59c024bd8d1ba541c6b7e6_images.jpg',
            '1080X1440':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/20dbcd144d59c024bd8d1ba541c6b7e6_images.jpg',
            '150X200':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/20dbcd144d59c024bd8d1ba541c6b7e6_images.jpg',
            '360X480':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/20dbcd144d59c024bd8d1ba541c6b7e6_images.jpg',
            '180X240':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/20dbcd144d59c024bd8d1ba541c6b7e6_images.jpg',
            '360X480Xmini':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/20dbcd144d59c024bd8d1ba541c6b7e6_images_mini.jpg',
            '180X240Xmini':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/20dbcd144d59c024bd8d1ba541c6b7e6_images_mini.jpg',
            '150X200Xmini':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/20dbcd144d59c024bd8d1ba541c6b7e6_images_mini.jpg',
            '48X64Xmini':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/20dbcd144d59c024bd8d1ba541c6b7e6_images_mini.jpg',
            '125X161':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/20dbcd144d59c024bd8d1ba541c6b7e6_images.jpg',
            '125X161Xmini':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/20dbcd144d59c024bd8d1ba541c6b7e6_images_mini.jpg',
          },
          imageType: 'left',
        },
        front: {
          imageURL:
            'http://assets.myntassets.com/v1/images/style/properties/84bda679d174e6e4356d29dc18d83685_images.jpg',
          resolutions: {
            '1080X1440Xmini':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/84bda679d174e6e4356d29dc18d83685_images_mini.jpg',
            '48X64':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/84bda679d174e6e4356d29dc18d83685_images.jpg',
            '1080X1440':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/84bda679d174e6e4356d29dc18d83685_images.jpg',
            '150X200':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/84bda679d174e6e4356d29dc18d83685_images.jpg',
            '360X480':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/84bda679d174e6e4356d29dc18d83685_images.jpg',
            '180X240':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/84bda679d174e6e4356d29dc18d83685_images.jpg',
            '360X480Xmini':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/84bda679d174e6e4356d29dc18d83685_images_mini.jpg',
            '180X240Xmini':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/84bda679d174e6e4356d29dc18d83685_images_mini.jpg',
            '150X200Xmini':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/84bda679d174e6e4356d29dc18d83685_images_mini.jpg',
            '48X64Xmini':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/84bda679d174e6e4356d29dc18d83685_images_mini.jpg',
            '125X161':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/84bda679d174e6e4356d29dc18d83685_images.jpg',
            '125X161Xmini':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/84bda679d174e6e4356d29dc18d83685_images_mini.jpg',
          },
          imageType: 'front',
        },
        right: {
          imageURL:
            'http://assets.myntassets.com/v1/images/style/properties/46a420edbda49bd1d7386e0a6b873f95_images.jpg',
          resolutions: {
            '1080X1440Xmini':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/46a420edbda49bd1d7386e0a6b873f95_images_mini.jpg',
            '48X64':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/46a420edbda49bd1d7386e0a6b873f95_images.jpg',
            '1080X1440':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/46a420edbda49bd1d7386e0a6b873f95_images.jpg',
            '150X200':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/46a420edbda49bd1d7386e0a6b873f95_images.jpg',
            '360X480':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/46a420edbda49bd1d7386e0a6b873f95_images.jpg',
            '180X240':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/46a420edbda49bd1d7386e0a6b873f95_images.jpg',
            '360X480Xmini':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/46a420edbda49bd1d7386e0a6b873f95_images_mini.jpg',
            '180X240Xmini':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/46a420edbda49bd1d7386e0a6b873f95_images_mini.jpg',
            '150X200Xmini':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/46a420edbda49bd1d7386e0a6b873f95_images_mini.jpg',
            '48X64Xmini':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/46a420edbda49bd1d7386e0a6b873f95_images_mini.jpg',
            '125X161':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/46a420edbda49bd1d7386e0a6b873f95_images.jpg',
            '125X161Xmini':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/46a420edbda49bd1d7386e0a6b873f95_images_mini.jpg',
          },
          imageType: 'right',
        },
        top: {
          imageURL:
            'http://assets.myntassets.com/v1/images/style/properties/7e978611ce1c375ce3a8844731db54aa_images.jpg',
          resolutions: {
            '1080X1440Xmini':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/7e978611ce1c375ce3a8844731db54aa_images_mini.jpg',
            '48X64':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/7e978611ce1c375ce3a8844731db54aa_images.jpg',
            '1080X1440':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/7e978611ce1c375ce3a8844731db54aa_images.jpg',
            '150X200':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/7e978611ce1c375ce3a8844731db54aa_images.jpg',
            '360X480':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/7e978611ce1c375ce3a8844731db54aa_images.jpg',
            '180X240':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/7e978611ce1c375ce3a8844731db54aa_images.jpg',
            '360X480Xmini':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/7e978611ce1c375ce3a8844731db54aa_images_mini.jpg',
            '180X240Xmini':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/7e978611ce1c375ce3a8844731db54aa_images_mini.jpg',
            '150X200Xmini':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/7e978611ce1c375ce3a8844731db54aa_images_mini.jpg',
            '48X64Xmini':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/7e978611ce1c375ce3a8844731db54aa_images_mini.jpg',
            '125X161':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/7e978611ce1c375ce3a8844731db54aa_images.jpg',
            '125X161Xmini':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/7e978611ce1c375ce3a8844731db54aa_images_mini.jpg',
          },
          imageType: 'top',
        },
      },
    },
    {
      id: 11002,
      price: 4950,
      productDisplayName: 'Puma Men Race Black Watch',
      brandName: 'Puma',
      productDescriptors: {
        description: {
          descriptorType: 'description',
          value:
            '<p>This watch from puma comes in a heavy duty design. The assymentric dial and chunky casing gives this watch a tough appearance perfect for navigating the urban jungle.<br /><strong><br />Dial shape</strong>: Round<br /><strong>Case diameter</strong>: 32 cm<br /><strong>Warranty</strong>: 2 Years<br /><br />Stainless steel case with a fixed bezel for added durability, style and comfort<br />Leather straps with a tang clasp for comfort and style<br />Black dial with cat logo on the 12 hour mark<br />Date aperture at the 3 hour mark<br />Analog time display<br />Solid case back made of stainless steel for enhanced durability<br />Water resistant upto 100 metres</p>',
        },
      },
      displayCategories: 'Accessories',
      brandUserProfile: {
        uidx: '12c1ae88.a2e0.4ada.8a85.2259c8f751fdEzea5ihq34',
        bio: "PUMA is the World's Fastest Sports Brand",
        name: 'PUMA',
        image: '../assets/fashion-dataset/images/11002.jpg',
        publicProfileId: 'PUMA',
        tagsMap:
          '{"roles":[],"labels":[],"myntraVerified":true,"invited":true,"brandUrl":"/puma"}',
      },
      styleImages: {
        default: {
          imageURL: '../assets/fashion-dataset/images/11002.jpg',
          resolutions: {
            '1080X1440Xmini':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/ff906339306790bc4ebf546a9d42f85d_images_mini.jpg',
            '48X64':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/ff906339306790bc4ebf546a9d42f85d_images.jpg',
            '1080X1440':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/ff906339306790bc4ebf546a9d42f85d_images.jpg',
            '150X200':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/ff906339306790bc4ebf546a9d42f85d_images.jpg',
            '360X480':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/ff906339306790bc4ebf546a9d42f85d_images.jpg',
            '180X240':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/ff906339306790bc4ebf546a9d42f85d_images.jpg',
            '360X480Xmini':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/ff906339306790bc4ebf546a9d42f85d_images_mini.jpg',
            '180X240Xmini':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/ff906339306790bc4ebf546a9d42f85d_images_mini.jpg',
            '150X200Xmini':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/ff906339306790bc4ebf546a9d42f85d_images_mini.jpg',
            '48X64Xmini':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/ff906339306790bc4ebf546a9d42f85d_images_mini.jpg',
            '125X161':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/ff906339306790bc4ebf546a9d42f85d_images.jpg',
            '125X161Xmini':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/ff906339306790bc4ebf546a9d42f85d_images_mini.jpg',
          },
          imageType: 'default',
        },
        search: {
          imageURL:
            'http://assets.myntassets.com/v1/images/style/properties/ff906339306790bc4ebf546a9d42f85d_images.jpg',
          resolutions: {
            '1080X1440Xmini':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/ff906339306790bc4ebf546a9d42f85d_images_mini.jpg',
            '48X64':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/ff906339306790bc4ebf546a9d42f85d_images.jpg',
            '1080X1440':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/ff906339306790bc4ebf546a9d42f85d_images.jpg',
            '150X200':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/ff906339306790bc4ebf546a9d42f85d_images.jpg',
            '360X480':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/ff906339306790bc4ebf546a9d42f85d_images.jpg',
            '180X240':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/ff906339306790bc4ebf546a9d42f85d_images.jpg',
            '360X480Xmini':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/ff906339306790bc4ebf546a9d42f85d_images_mini.jpg',
            '180X240Xmini':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/ff906339306790bc4ebf546a9d42f85d_images_mini.jpg',
            '150X200Xmini':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/ff906339306790bc4ebf546a9d42f85d_images_mini.jpg',
            '48X64Xmini':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/ff906339306790bc4ebf546a9d42f85d_images_mini.jpg',
            '125X161':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/ff906339306790bc4ebf546a9d42f85d_images.jpg',
            '125X161Xmini':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/ff906339306790bc4ebf546a9d42f85d_images_mini.jpg',
          },
          imageType: 'search',
        },
        back: {
          imageURL:
            'http://assets.myntassets.com/v1/images/style/properties/5ce0d8e73f85d9c7ab8efc878881064d_images.jpg',
          resolutions: {
            '1080X1440Xmini':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/5ce0d8e73f85d9c7ab8efc878881064d_images_mini.jpg',
            '48X64':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/5ce0d8e73f85d9c7ab8efc878881064d_images.jpg',
            '1080X1440':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/5ce0d8e73f85d9c7ab8efc878881064d_images.jpg',
            '150X200':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/5ce0d8e73f85d9c7ab8efc878881064d_images.jpg',
            '360X480':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/5ce0d8e73f85d9c7ab8efc878881064d_images.jpg',
            '180X240':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/5ce0d8e73f85d9c7ab8efc878881064d_images.jpg',
            '360X480Xmini':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/5ce0d8e73f85d9c7ab8efc878881064d_images_mini.jpg',
            '180X240Xmini':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/5ce0d8e73f85d9c7ab8efc878881064d_images_mini.jpg',
            '150X200Xmini':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/5ce0d8e73f85d9c7ab8efc878881064d_images_mini.jpg',
            '48X64Xmini':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/5ce0d8e73f85d9c7ab8efc878881064d_images_mini.jpg',
            '125X161':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/5ce0d8e73f85d9c7ab8efc878881064d_images.jpg',
            '125X161Xmini':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/5ce0d8e73f85d9c7ab8efc878881064d_images_mini.jpg',
          },
          imageType: 'back',
        },
        left: {
          imageURL:
            'http://assets.myntassets.com/v1/images/style/properties/d355459c57e75467bb431aabd95cf014_images.jpg',
          resolutions: {
            '1080X1440Xmini':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/d355459c57e75467bb431aabd95cf014_images_mini.jpg',
            '48X64':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/d355459c57e75467bb431aabd95cf014_images.jpg',
            '1080X1440':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/d355459c57e75467bb431aabd95cf014_images.jpg',
            '150X200':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/d355459c57e75467bb431aabd95cf014_images.jpg',
            '360X480':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/d355459c57e75467bb431aabd95cf014_images.jpg',
            '180X240':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/d355459c57e75467bb431aabd95cf014_images.jpg',
            '360X480Xmini':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/d355459c57e75467bb431aabd95cf014_images_mini.jpg',
            '180X240Xmini':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/d355459c57e75467bb431aabd95cf014_images_mini.jpg',
            '150X200Xmini':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/d355459c57e75467bb431aabd95cf014_images_mini.jpg',
            '48X64Xmini':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/d355459c57e75467bb431aabd95cf014_images_mini.jpg',
            '125X161':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/d355459c57e75467bb431aabd95cf014_images.jpg',
            '125X161Xmini':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/d355459c57e75467bb431aabd95cf014_images_mini.jpg',
          },
          imageType: 'left',
        },
        front: {
          imageURL:
            'http://assets.myntassets.com/v1/images/style/properties/ac062f5e2d400915aa703ba7831a0f7f_images.jpg',
          resolutions: {
            '1080X1440Xmini':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/ac062f5e2d400915aa703ba7831a0f7f_images_mini.jpg',
            '48X64':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/ac062f5e2d400915aa703ba7831a0f7f_images.jpg',
            '1080X1440':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/ac062f5e2d400915aa703ba7831a0f7f_images.jpg',
            '150X200':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/ac062f5e2d400915aa703ba7831a0f7f_images.jpg',
            '360X480':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/ac062f5e2d400915aa703ba7831a0f7f_images.jpg',
            '180X240':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/ac062f5e2d400915aa703ba7831a0f7f_images.jpg',
            '360X480Xmini':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/ac062f5e2d400915aa703ba7831a0f7f_images_mini.jpg',
            '180X240Xmini':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/ac062f5e2d400915aa703ba7831a0f7f_images_mini.jpg',
            '150X200Xmini':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/ac062f5e2d400915aa703ba7831a0f7f_images_mini.jpg',
            '48X64Xmini':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/ac062f5e2d400915aa703ba7831a0f7f_images_mini.jpg',
            '125X161':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/ac062f5e2d400915aa703ba7831a0f7f_images.jpg',
            '125X161Xmini':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/ac062f5e2d400915aa703ba7831a0f7f_images_mini.jpg',
          },
          imageType: 'front',
        },
        right: {
          imageURL:
            'http://assets.myntassets.com/v1/images/style/properties/c35b33019e331bd4a841335c57419d05_images.jpg',
          resolutions: {
            '1080X1440Xmini':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/c35b33019e331bd4a841335c57419d05_images_mini.jpg',
            '48X64':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/c35b33019e331bd4a841335c57419d05_images.jpg',
            '1080X1440':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/c35b33019e331bd4a841335c57419d05_images.jpg',
            '150X200':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/c35b33019e331bd4a841335c57419d05_images.jpg',
            '360X480':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/c35b33019e331bd4a841335c57419d05_images.jpg',
            '180X240':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/c35b33019e331bd4a841335c57419d05_images.jpg',
            '360X480Xmini':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/c35b33019e331bd4a841335c57419d05_images_mini.jpg',
            '180X240Xmini':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/c35b33019e331bd4a841335c57419d05_images_mini.jpg',
            '150X200Xmini':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/c35b33019e331bd4a841335c57419d05_images_mini.jpg',
            '48X64Xmini':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/c35b33019e331bd4a841335c57419d05_images_mini.jpg',
            '125X161':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/c35b33019e331bd4a841335c57419d05_images.jpg',
            '125X161Xmini':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/c35b33019e331bd4a841335c57419d05_images_mini.jpg',
          },
          imageType: 'right',
        },
        top: {
          imageURL:
            'http://assets.myntassets.com/v1/images/style/properties/787a6b5559eba0acd79569802cd27f52_images.jpg',
          resolutions: {
            '1080X1440Xmini':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/787a6b5559eba0acd79569802cd27f52_images_mini.jpg',
            '48X64':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/787a6b5559eba0acd79569802cd27f52_images.jpg',
            '1080X1440':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/787a6b5559eba0acd79569802cd27f52_images.jpg',
            '150X200':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/787a6b5559eba0acd79569802cd27f52_images.jpg',
            '360X480':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/787a6b5559eba0acd79569802cd27f52_images.jpg',
            '180X240':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/787a6b5559eba0acd79569802cd27f52_images.jpg',
            '360X480Xmini':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/787a6b5559eba0acd79569802cd27f52_images_mini.jpg',
            '180X240Xmini':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/787a6b5559eba0acd79569802cd27f52_images_mini.jpg',
            '150X200Xmini':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/787a6b5559eba0acd79569802cd27f52_images_mini.jpg',
            '48X64Xmini':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/787a6b5559eba0acd79569802cd27f52_images_mini.jpg',
            '125X161':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/787a6b5559eba0acd79569802cd27f52_images.jpg',
            '125X161Xmini':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/787a6b5559eba0acd79569802cd27f52_images_mini.jpg',
          },
          imageType: 'top',
        },
      },
    },
    {
      id: 11003,
      price: 3950,
      productDisplayName: 'Puma Men Fluctuation Red Dial Watch',
      brandName: 'Puma',
      productDescriptors: {
        description: {
          descriptorType: 'description',
          value:
            '<p>This watch from puma comes in a heavy duty design. The assymentric dial and chunky casing gives this watch a tough appearance perfect for navigating the urban jungle.<br /><br /><strong>Dial shape</strong>: Rectangle<br /><strong>Case diameter</strong>: 32 cm<br /><strong>Warranty</strong>: 2 Years<br /><br />Plastic case with a fixed bezel for added durability, style and comfort<br />Textured rubber straps with a tang clasp for comfort and style<br />Black dial with cat logo on the dial<br />Digital time display<br />Solid case back made of stainless steel for enhanced durability<br />Water resistant upto 100 metres</p>',
        },
      },
      displayCategories: 'Accessories',
      brandUserProfile: {
        uidx: '12c1ae88.a2e0.4ada.8a85.2259c8f751fdEzea5ihq34',
        bio: "PUMA is the World's Fastest Sports Brand",
        name: 'PUMA',
        image: '../assets/fashion-dataset/images/11003.jpg',
        publicProfileId: 'PUMA',
        tagsMap:
          '{"roles":[],"labels":[],"myntraVerified":true,"invited":true,"brandUrl":"/puma"}',
      },
      styleImages: {
        default: {
          imageURL: '../assets/fashion-dataset/images/11003.jpg',
          resolutions: {
            '1080X1440Xmini':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/1b7d93f1c155844d9149f1d3ba7e0688_images_mini.jpg',
            '48X64':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/1b7d93f1c155844d9149f1d3ba7e0688_images.jpg',
            '1080X1440':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/1b7d93f1c155844d9149f1d3ba7e0688_images.jpg',
            '150X200':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/1b7d93f1c155844d9149f1d3ba7e0688_images.jpg',
            '360X480':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/1b7d93f1c155844d9149f1d3ba7e0688_images.jpg',
            '180X240':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/1b7d93f1c155844d9149f1d3ba7e0688_images.jpg',
            '360X480Xmini':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/1b7d93f1c155844d9149f1d3ba7e0688_images_mini.jpg',
            '180X240Xmini':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/1b7d93f1c155844d9149f1d3ba7e0688_images_mini.jpg',
            '150X200Xmini':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/1b7d93f1c155844d9149f1d3ba7e0688_images_mini.jpg',
            '48X64Xmini':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/1b7d93f1c155844d9149f1d3ba7e0688_images_mini.jpg',
            '125X161':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/1b7d93f1c155844d9149f1d3ba7e0688_images.jpg',
            '125X161Xmini':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/1b7d93f1c155844d9149f1d3ba7e0688_images_mini.jpg',
          },
          imageType: 'default',
        },
        search: {
          imageURL:
            'http://assets.myntassets.com/v1/images/style/properties/1b7d93f1c155844d9149f1d3ba7e0688_images.jpg',
          resolutions: {
            '1080X1440Xmini':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/1b7d93f1c155844d9149f1d3ba7e0688_images_mini.jpg',
            '48X64':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/1b7d93f1c155844d9149f1d3ba7e0688_images.jpg',
            '1080X1440':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/1b7d93f1c155844d9149f1d3ba7e0688_images.jpg',
            '150X200':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/1b7d93f1c155844d9149f1d3ba7e0688_images.jpg',
            '360X480':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/1b7d93f1c155844d9149f1d3ba7e0688_images.jpg',
            '180X240':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/1b7d93f1c155844d9149f1d3ba7e0688_images.jpg',
            '360X480Xmini':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/1b7d93f1c155844d9149f1d3ba7e0688_images_mini.jpg',
            '180X240Xmini':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/1b7d93f1c155844d9149f1d3ba7e0688_images_mini.jpg',
            '150X200Xmini':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/1b7d93f1c155844d9149f1d3ba7e0688_images_mini.jpg',
            '48X64Xmini':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/1b7d93f1c155844d9149f1d3ba7e0688_images_mini.jpg',
            '125X161':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/1b7d93f1c155844d9149f1d3ba7e0688_images.jpg',
            '125X161Xmini':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/1b7d93f1c155844d9149f1d3ba7e0688_images_mini.jpg',
          },
          imageType: 'search',
        },
        back: {
          imageURL:
            'http://assets.myntassets.com/v1/images/style/properties/f0b4ed6bdf11b87c77b5cfffb6108574_images.jpg',
          resolutions: {
            '1080X1440Xmini':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/f0b4ed6bdf11b87c77b5cfffb6108574_images_mini.jpg',
            '48X64':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/f0b4ed6bdf11b87c77b5cfffb6108574_images.jpg',
            '1080X1440':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/f0b4ed6bdf11b87c77b5cfffb6108574_images.jpg',
            '150X200':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/f0b4ed6bdf11b87c77b5cfffb6108574_images.jpg',
            '360X480':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/f0b4ed6bdf11b87c77b5cfffb6108574_images.jpg',
            '180X240':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/f0b4ed6bdf11b87c77b5cfffb6108574_images.jpg',
            '360X480Xmini':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/f0b4ed6bdf11b87c77b5cfffb6108574_images_mini.jpg',
            '180X240Xmini':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/f0b4ed6bdf11b87c77b5cfffb6108574_images_mini.jpg',
            '150X200Xmini':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/f0b4ed6bdf11b87c77b5cfffb6108574_images_mini.jpg',
            '48X64Xmini':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/f0b4ed6bdf11b87c77b5cfffb6108574_images_mini.jpg',
            '125X161':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/f0b4ed6bdf11b87c77b5cfffb6108574_images.jpg',
            '125X161Xmini':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/f0b4ed6bdf11b87c77b5cfffb6108574_images_mini.jpg',
          },
          imageType: 'back',
        },
        left: {
          imageURL:
            'http://assets.myntassets.com/v1/images/style/properties/1d5f94f47eb32efda029177842a8c8e0_images.jpg',
          resolutions: {
            '1080X1440Xmini':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/1d5f94f47eb32efda029177842a8c8e0_images_mini.jpg',
            '48X64':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/1d5f94f47eb32efda029177842a8c8e0_images.jpg',
            '1080X1440':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/1d5f94f47eb32efda029177842a8c8e0_images.jpg',
            '150X200':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/1d5f94f47eb32efda029177842a8c8e0_images.jpg',
            '360X480':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/1d5f94f47eb32efda029177842a8c8e0_images.jpg',
            '180X240':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/1d5f94f47eb32efda029177842a8c8e0_images.jpg',
            '360X480Xmini':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/1d5f94f47eb32efda029177842a8c8e0_images_mini.jpg',
            '180X240Xmini':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/1d5f94f47eb32efda029177842a8c8e0_images_mini.jpg',
            '150X200Xmini':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/1d5f94f47eb32efda029177842a8c8e0_images_mini.jpg',
            '48X64Xmini':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/1d5f94f47eb32efda029177842a8c8e0_images_mini.jpg',
            '125X161':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/1d5f94f47eb32efda029177842a8c8e0_images.jpg',
            '125X161Xmini':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/1d5f94f47eb32efda029177842a8c8e0_images_mini.jpg',
          },
          imageType: 'left',
        },
        front: {
          imageURL:
            'http://assets.myntassets.com/v1/images/style/properties/0c97edf5d33bc829e65c2f8128a5e1b0_images.jpg',
          resolutions: {
            '1080X1440Xmini':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/0c97edf5d33bc829e65c2f8128a5e1b0_images_mini.jpg',
            '48X64':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/0c97edf5d33bc829e65c2f8128a5e1b0_images.jpg',
            '1080X1440':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/0c97edf5d33bc829e65c2f8128a5e1b0_images.jpg',
            '150X200':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/0c97edf5d33bc829e65c2f8128a5e1b0_images.jpg',
            '360X480':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/0c97edf5d33bc829e65c2f8128a5e1b0_images.jpg',
            '180X240':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/0c97edf5d33bc829e65c2f8128a5e1b0_images.jpg',
            '360X480Xmini':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/0c97edf5d33bc829e65c2f8128a5e1b0_images_mini.jpg',
            '180X240Xmini':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/0c97edf5d33bc829e65c2f8128a5e1b0_images_mini.jpg',
            '150X200Xmini':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/0c97edf5d33bc829e65c2f8128a5e1b0_images_mini.jpg',
            '48X64Xmini':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/0c97edf5d33bc829e65c2f8128a5e1b0_images_mini.jpg',
            '125X161':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/0c97edf5d33bc829e65c2f8128a5e1b0_images.jpg',
            '125X161Xmini':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/0c97edf5d33bc829e65c2f8128a5e1b0_images_mini.jpg',
          },
          imageType: 'front',
        },
        right: {
          imageURL:
            'http://assets.myntassets.com/v1/images/style/properties/7f92a3a3f7357f1ad288fdf1019b8dff_images.jpg',
          resolutions: {
            '1080X1440Xmini':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/7f92a3a3f7357f1ad288fdf1019b8dff_images_mini.jpg',
            '48X64':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/7f92a3a3f7357f1ad288fdf1019b8dff_images.jpg',
            '1080X1440':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/7f92a3a3f7357f1ad288fdf1019b8dff_images.jpg',
            '150X200':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/7f92a3a3f7357f1ad288fdf1019b8dff_images.jpg',
            '360X480':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/7f92a3a3f7357f1ad288fdf1019b8dff_images.jpg',
            '180X240':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/7f92a3a3f7357f1ad288fdf1019b8dff_images.jpg',
            '360X480Xmini':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/7f92a3a3f7357f1ad288fdf1019b8dff_images_mini.jpg',
            '180X240Xmini':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/7f92a3a3f7357f1ad288fdf1019b8dff_images_mini.jpg',
            '150X200Xmini':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/7f92a3a3f7357f1ad288fdf1019b8dff_images_mini.jpg',
            '48X64Xmini':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/7f92a3a3f7357f1ad288fdf1019b8dff_images_mini.jpg',
            '125X161':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/7f92a3a3f7357f1ad288fdf1019b8dff_images.jpg',
            '125X161Xmini':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/7f92a3a3f7357f1ad288fdf1019b8dff_images_mini.jpg',
          },
          imageType: 'right',
        },
        top: {
          imageURL:
            'http://assets.myntassets.com/v1/images/style/properties/69b490428a0bafa94823875a676fcb88_images.jpg',
          resolutions: {
            '1080X1440Xmini':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/69b490428a0bafa94823875a676fcb88_images_mini.jpg',
            '48X64':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/69b490428a0bafa94823875a676fcb88_images.jpg',
            '1080X1440':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/69b490428a0bafa94823875a676fcb88_images.jpg',
            '150X200':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/69b490428a0bafa94823875a676fcb88_images.jpg',
            '360X480':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/69b490428a0bafa94823875a676fcb88_images.jpg',
            '180X240':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/69b490428a0bafa94823875a676fcb88_images.jpg',
            '360X480Xmini':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/69b490428a0bafa94823875a676fcb88_images_mini.jpg',
            '180X240Xmini':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/69b490428a0bafa94823875a676fcb88_images_mini.jpg',
            '150X200Xmini':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/69b490428a0bafa94823875a676fcb88_images_mini.jpg',
            '48X64Xmini':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/69b490428a0bafa94823875a676fcb88_images_mini.jpg',
            '125X161':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/69b490428a0bafa94823875a676fcb88_images.jpg',
            '125X161Xmini':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/69b490428a0bafa94823875a676fcb88_images_mini.jpg',
          },
          imageType: 'top',
        },
      },
    },
    {
      id: 11004,
      price: 5995,
      productDisplayName: 'Puma Men Track Black Watch',
      brandName: 'Puma',
      productDescriptors: {
        description: {
          descriptorType: 'description',
          value:
            '<p>This watch from puma comes in a heavy duty design. The assymentric dial and chunky casing gives this watch a tough appearance perfect for navigating the urban jungle.<br /><strong><br />Dial shape</strong>: Octagon<br /><strong>Case diameter</strong>: 32 cm<br /><strong>Warranty</strong>: 2 Years<br /><br />Metal case with a fixed bezel for added durability, style and comfort<br />Textured rubber straps with a tang clasp for comfort and style<br />Black dial with cat logo below 12 hour mark<br />Time marked in bold numerals<br />Analog dial showing time in hours, minutes and seconds<br />Date aperture at 3 hour mark<br />Quartz movement of time display<br />Solid case back made of stainless steel for enhanced durability<br />Water resistant upto 50 metres</p>',
        },
      },
      displayCategories: 'Accessories',
      brandUserProfile: {
        uidx: '12c1ae88.a2e0.4ada.8a85.2259c8f751fdEzea5ihq34',
        bio: "PUMA is the World's Fastest Sports Brand",
        name: 'PUMA',
        image: '../assets/fashion-dataset/images/11004.jpg',
        publicProfileId: 'PUMA',
        tagsMap:
          '{"roles":[],"labels":[],"myntraVerified":true,"invited":true,"brandUrl":"/puma"}',
      },
      styleImages: {
        default: {
          imageURL: '../assets/fashion-dataset/images/11004.jpg',
          resolutions: {
            '1080X1440Xmini':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/b23c16f6e7cd7ef77906a349beed92cf_images_mini.jpg',
            '48X64':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/b23c16f6e7cd7ef77906a349beed92cf_images.jpg',
            '1080X1440':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/b23c16f6e7cd7ef77906a349beed92cf_images.jpg',
            '150X200':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/b23c16f6e7cd7ef77906a349beed92cf_images.jpg',
            '360X480':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/b23c16f6e7cd7ef77906a349beed92cf_images.jpg',
            '180X240':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/b23c16f6e7cd7ef77906a349beed92cf_images.jpg',
            '360X480Xmini':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/b23c16f6e7cd7ef77906a349beed92cf_images_mini.jpg',
            '180X240Xmini':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/b23c16f6e7cd7ef77906a349beed92cf_images_mini.jpg',
            '150X200Xmini':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/b23c16f6e7cd7ef77906a349beed92cf_images_mini.jpg',
            '48X64Xmini':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/b23c16f6e7cd7ef77906a349beed92cf_images_mini.jpg',
            '125X161':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/b23c16f6e7cd7ef77906a349beed92cf_images.jpg',
            '125X161Xmini':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/b23c16f6e7cd7ef77906a349beed92cf_images_mini.jpg',
          },
          imageType: 'default',
        },
        search: {
          imageURL:
            'http://assets.myntassets.com/v1/images/style/properties/b23c16f6e7cd7ef77906a349beed92cf_images.jpg',
          resolutions: {
            '1080X1440Xmini':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/b23c16f6e7cd7ef77906a349beed92cf_images_mini.jpg',
            '48X64':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/b23c16f6e7cd7ef77906a349beed92cf_images.jpg',
            '1080X1440':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/b23c16f6e7cd7ef77906a349beed92cf_images.jpg',
            '150X200':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/b23c16f6e7cd7ef77906a349beed92cf_images.jpg',
            '360X480':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/b23c16f6e7cd7ef77906a349beed92cf_images.jpg',
            '180X240':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/b23c16f6e7cd7ef77906a349beed92cf_images.jpg',
            '360X480Xmini':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/b23c16f6e7cd7ef77906a349beed92cf_images_mini.jpg',
            '180X240Xmini':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/b23c16f6e7cd7ef77906a349beed92cf_images_mini.jpg',
            '150X200Xmini':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/b23c16f6e7cd7ef77906a349beed92cf_images_mini.jpg',
            '48X64Xmini':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/b23c16f6e7cd7ef77906a349beed92cf_images_mini.jpg',
            '125X161':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/b23c16f6e7cd7ef77906a349beed92cf_images.jpg',
            '125X161Xmini':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/b23c16f6e7cd7ef77906a349beed92cf_images_mini.jpg',
          },
          imageType: 'search',
        },
        back: {
          imageURL:
            'http://assets.myntassets.com/v1/images/style/properties/7ae8ff9e71c64d89ff4995764454a947_images.jpg',
          resolutions: {
            '1080X1440Xmini':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/7ae8ff9e71c64d89ff4995764454a947_images_mini.jpg',
            '48X64':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/7ae8ff9e71c64d89ff4995764454a947_images.jpg',
            '1080X1440':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/7ae8ff9e71c64d89ff4995764454a947_images.jpg',
            '150X200':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/7ae8ff9e71c64d89ff4995764454a947_images.jpg',
            '360X480':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/7ae8ff9e71c64d89ff4995764454a947_images.jpg',
            '180X240':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/7ae8ff9e71c64d89ff4995764454a947_images.jpg',
            '360X480Xmini':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/7ae8ff9e71c64d89ff4995764454a947_images_mini.jpg',
            '180X240Xmini':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/7ae8ff9e71c64d89ff4995764454a947_images_mini.jpg',
            '150X200Xmini':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/7ae8ff9e71c64d89ff4995764454a947_images_mini.jpg',
            '48X64Xmini':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/7ae8ff9e71c64d89ff4995764454a947_images_mini.jpg',
            '125X161':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/7ae8ff9e71c64d89ff4995764454a947_images.jpg',
            '125X161Xmini':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/7ae8ff9e71c64d89ff4995764454a947_images_mini.jpg',
          },
          imageType: 'back',
        },
        left: {
          imageURL:
            'http://assets.myntassets.com/v1/images/style/properties/816af614cc82b316bca64b70b30e800c_images.jpg',
          resolutions: {
            '1080X1440Xmini':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/816af614cc82b316bca64b70b30e800c_images_mini.jpg',
            '48X64':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/816af614cc82b316bca64b70b30e800c_images.jpg',
            '1080X1440':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/816af614cc82b316bca64b70b30e800c_images.jpg',
            '150X200':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/816af614cc82b316bca64b70b30e800c_images.jpg',
            '360X480':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/816af614cc82b316bca64b70b30e800c_images.jpg',
            '180X240':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/816af614cc82b316bca64b70b30e800c_images.jpg',
            '360X480Xmini':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/816af614cc82b316bca64b70b30e800c_images_mini.jpg',
            '180X240Xmini':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/816af614cc82b316bca64b70b30e800c_images_mini.jpg',
            '150X200Xmini':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/816af614cc82b316bca64b70b30e800c_images_mini.jpg',
            '48X64Xmini':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/816af614cc82b316bca64b70b30e800c_images_mini.jpg',
            '125X161':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/816af614cc82b316bca64b70b30e800c_images.jpg',
            '125X161Xmini':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/816af614cc82b316bca64b70b30e800c_images_mini.jpg',
          },
          imageType: 'left',
        },
        front: {
          imageURL:
            'http://assets.myntassets.com/v1/images/style/properties/dc957e95adc2a4594cde2eeaa7b61b6f_images.jpg',
          resolutions: {
            '1080X1440Xmini':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/dc957e95adc2a4594cde2eeaa7b61b6f_images_mini.jpg',
            '48X64':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/dc957e95adc2a4594cde2eeaa7b61b6f_images.jpg',
            '1080X1440':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/dc957e95adc2a4594cde2eeaa7b61b6f_images.jpg',
            '150X200':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/dc957e95adc2a4594cde2eeaa7b61b6f_images.jpg',
            '360X480':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/dc957e95adc2a4594cde2eeaa7b61b6f_images.jpg',
            '180X240':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/dc957e95adc2a4594cde2eeaa7b61b6f_images.jpg',
            '360X480Xmini':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/dc957e95adc2a4594cde2eeaa7b61b6f_images_mini.jpg',
            '180X240Xmini':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/dc957e95adc2a4594cde2eeaa7b61b6f_images_mini.jpg',
            '150X200Xmini':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/dc957e95adc2a4594cde2eeaa7b61b6f_images_mini.jpg',
            '48X64Xmini':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/dc957e95adc2a4594cde2eeaa7b61b6f_images_mini.jpg',
            '125X161':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/dc957e95adc2a4594cde2eeaa7b61b6f_images.jpg',
            '125X161Xmini':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/dc957e95adc2a4594cde2eeaa7b61b6f_images_mini.jpg',
          },
          imageType: 'front',
        },
        right: {
          imageURL:
            'http://assets.myntassets.com/v1/images/style/properties/459802197d638f069dc0dbcbab29f310_images.jpg',
          resolutions: {
            '1080X1440Xmini':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/459802197d638f069dc0dbcbab29f310_images_mini.jpg',
            '48X64':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/459802197d638f069dc0dbcbab29f310_images.jpg',
            '1080X1440':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/459802197d638f069dc0dbcbab29f310_images.jpg',
            '150X200':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/459802197d638f069dc0dbcbab29f310_images.jpg',
            '360X480':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/459802197d638f069dc0dbcbab29f310_images.jpg',
            '180X240':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/459802197d638f069dc0dbcbab29f310_images.jpg',
            '360X480Xmini':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/459802197d638f069dc0dbcbab29f310_images_mini.jpg',
            '180X240Xmini':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/459802197d638f069dc0dbcbab29f310_images_mini.jpg',
            '150X200Xmini':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/459802197d638f069dc0dbcbab29f310_images_mini.jpg',
            '48X64Xmini':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/459802197d638f069dc0dbcbab29f310_images_mini.jpg',
            '125X161':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/459802197d638f069dc0dbcbab29f310_images.jpg',
            '125X161Xmini':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/459802197d638f069dc0dbcbab29f310_images_mini.jpg',
          },
          imageType: 'right',
        },
        top: {
          imageURL:
            'http://assets.myntassets.com/v1/images/style/properties/c22123affdd13368757a71b7778d2d32_images.jpg',
          resolutions: {
            '1080X1440Xmini':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/c22123affdd13368757a71b7778d2d32_images_mini.jpg',
            '48X64':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/c22123affdd13368757a71b7778d2d32_images.jpg',
            '1080X1440':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/c22123affdd13368757a71b7778d2d32_images.jpg',
            '150X200':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/c22123affdd13368757a71b7778d2d32_images.jpg',
            '360X480':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/c22123affdd13368757a71b7778d2d32_images.jpg',
            '180X240':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/c22123affdd13368757a71b7778d2d32_images.jpg',
            '360X480Xmini':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/c22123affdd13368757a71b7778d2d32_images_mini.jpg',
            '180X240Xmini':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/c22123affdd13368757a71b7778d2d32_images_mini.jpg',
            '150X200Xmini':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/c22123affdd13368757a71b7778d2d32_images_mini.jpg',
            '48X64Xmini':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/c22123affdd13368757a71b7778d2d32_images_mini.jpg',
            '125X161':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/c22123affdd13368757a71b7778d2d32_images.jpg',
            '125X161Xmini':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/c22123affdd13368757a71b7778d2d32_images_mini.jpg',
          },
          imageType: 'top',
        },
      },
    },
    {
      id: 11005,
      price: 5495,
      productDisplayName: 'Puma Men Visor 3HD Black Watch',
      brandName: 'Puma',
      productDescriptors: {
        description: {
          descriptorType: 'description',
          value:
            '<p>This watch from puma comes in a heavy duty design. The stylish dial and chunky casing gives this watch a tough appearance - perfect for navigating the urban jungle.<br /><br /><strong>Case diameter</strong>: 32 mm<br /><strong>Dial shape</strong>: Square<br /><strong>Warranty</strong>: 2 Years<br /><br />Stainless steel case with a black bezel<br />Rubber straps with a tang clasp<br />Black dial with branding at the 7 hour mark<br />Date aperture at the 6 hour mark<br />Screw to reset time<br />Solid case back made of stainless steel for durability<br />Water resistant upto 50 meters</p>',
        },
      },
      displayCategories: 'Accessories',
      brandUserProfile: {
        uidx: '12c1ae88.a2e0.4ada.8a85.2259c8f751fdEzea5ihq34',
        bio: "PUMA is the World's Fastest Sports Brand",
        name: 'PUMA',
        image: '../assets/fashion-dataset/images/11005.jpg',
        publicProfileId: 'PUMA',
        tagsMap:
          '{"roles":[],"labels":[],"myntraVerified":true,"invited":true,"brandUrl":"/puma"}',
      },
      styleImages: {
        default: {
          imageURL: '../assets/fashion-dataset/images/11005.jpg',
          resolutions: {
            '1080X1440Xmini':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/98d66eb79c80b66e81dc6b6530d7239b_images_mini.jpg',
            '48X64':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/98d66eb79c80b66e81dc6b6530d7239b_images.jpg',
            '1080X1440':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/98d66eb79c80b66e81dc6b6530d7239b_images.jpg',
            '150X200':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/98d66eb79c80b66e81dc6b6530d7239b_images.jpg',
            '360X480':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/98d66eb79c80b66e81dc6b6530d7239b_images.jpg',
            '180X240':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/98d66eb79c80b66e81dc6b6530d7239b_images.jpg',
            '360X480Xmini':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/98d66eb79c80b66e81dc6b6530d7239b_images_mini.jpg',
            '180X240Xmini':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/98d66eb79c80b66e81dc6b6530d7239b_images_mini.jpg',
            '150X200Xmini':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/98d66eb79c80b66e81dc6b6530d7239b_images_mini.jpg',
            '48X64Xmini':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/98d66eb79c80b66e81dc6b6530d7239b_images_mini.jpg',
            '125X161':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/98d66eb79c80b66e81dc6b6530d7239b_images.jpg',
            '125X161Xmini':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/98d66eb79c80b66e81dc6b6530d7239b_images_mini.jpg',
          },
          imageType: 'default',
        },
        search: {
          imageURL:
            'http://assets.myntassets.com/v1/images/style/properties/98d66eb79c80b66e81dc6b6530d7239b_images.jpg',
          resolutions: {
            '1080X1440Xmini':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/98d66eb79c80b66e81dc6b6530d7239b_images_mini.jpg',
            '48X64':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/98d66eb79c80b66e81dc6b6530d7239b_images.jpg',
            '1080X1440':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/98d66eb79c80b66e81dc6b6530d7239b_images.jpg',
            '150X200':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/98d66eb79c80b66e81dc6b6530d7239b_images.jpg',
            '360X480':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/98d66eb79c80b66e81dc6b6530d7239b_images.jpg',
            '180X240':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/98d66eb79c80b66e81dc6b6530d7239b_images.jpg',
            '360X480Xmini':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/98d66eb79c80b66e81dc6b6530d7239b_images_mini.jpg',
            '180X240Xmini':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/98d66eb79c80b66e81dc6b6530d7239b_images_mini.jpg',
            '150X200Xmini':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/98d66eb79c80b66e81dc6b6530d7239b_images_mini.jpg',
            '48X64Xmini':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/98d66eb79c80b66e81dc6b6530d7239b_images_mini.jpg',
            '125X161':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/98d66eb79c80b66e81dc6b6530d7239b_images.jpg',
            '125X161Xmini':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/98d66eb79c80b66e81dc6b6530d7239b_images_mini.jpg',
          },
          imageType: 'search',
        },
        back: {
          imageURL:
            'http://assets.myntassets.com/v1/images/style/properties/d268af6867f3851b4e2f3f9aecbb6a72_images.jpg',
          resolutions: {
            '1080X1440Xmini':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/d268af6867f3851b4e2f3f9aecbb6a72_images_mini.jpg',
            '48X64':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/d268af6867f3851b4e2f3f9aecbb6a72_images.jpg',
            '1080X1440':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/d268af6867f3851b4e2f3f9aecbb6a72_images.jpg',
            '150X200':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/d268af6867f3851b4e2f3f9aecbb6a72_images.jpg',
            '360X480':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/d268af6867f3851b4e2f3f9aecbb6a72_images.jpg',
            '180X240':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/d268af6867f3851b4e2f3f9aecbb6a72_images.jpg',
            '360X480Xmini':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/d268af6867f3851b4e2f3f9aecbb6a72_images_mini.jpg',
            '180X240Xmini':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/d268af6867f3851b4e2f3f9aecbb6a72_images_mini.jpg',
            '150X200Xmini':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/d268af6867f3851b4e2f3f9aecbb6a72_images_mini.jpg',
            '48X64Xmini':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/d268af6867f3851b4e2f3f9aecbb6a72_images_mini.jpg',
            '125X161':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/d268af6867f3851b4e2f3f9aecbb6a72_images.jpg',
            '125X161Xmini':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/d268af6867f3851b4e2f3f9aecbb6a72_images_mini.jpg',
          },
          imageType: 'back',
        },
        left: {
          imageURL:
            'http://assets.myntassets.com/v1/images/style/properties/a44688fd257cb1158a422629ebee5176_images.jpg',
          resolutions: {
            '1080X1440Xmini':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/a44688fd257cb1158a422629ebee5176_images_mini.jpg',
            '48X64':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/a44688fd257cb1158a422629ebee5176_images.jpg',
            '1080X1440':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/a44688fd257cb1158a422629ebee5176_images.jpg',
            '150X200':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/a44688fd257cb1158a422629ebee5176_images.jpg',
            '360X480':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/a44688fd257cb1158a422629ebee5176_images.jpg',
            '180X240':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/a44688fd257cb1158a422629ebee5176_images.jpg',
            '360X480Xmini':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/a44688fd257cb1158a422629ebee5176_images_mini.jpg',
            '180X240Xmini':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/a44688fd257cb1158a422629ebee5176_images_mini.jpg',
            '150X200Xmini':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/a44688fd257cb1158a422629ebee5176_images_mini.jpg',
            '48X64Xmini':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/a44688fd257cb1158a422629ebee5176_images_mini.jpg',
            '125X161':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/a44688fd257cb1158a422629ebee5176_images.jpg',
            '125X161Xmini':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/a44688fd257cb1158a422629ebee5176_images_mini.jpg',
          },
          imageType: 'left',
        },
        front: {
          imageURL:
            'http://assets.myntassets.com/v1/images/style/properties/920618ee4ef8d51a39076253b72c968e_images.jpg',
          resolutions: {
            '1080X1440Xmini':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/920618ee4ef8d51a39076253b72c968e_images_mini.jpg',
            '48X64':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/920618ee4ef8d51a39076253b72c968e_images.jpg',
            '1080X1440':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/920618ee4ef8d51a39076253b72c968e_images.jpg',
            '150X200':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/920618ee4ef8d51a39076253b72c968e_images.jpg',
            '360X480':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/920618ee4ef8d51a39076253b72c968e_images.jpg',
            '180X240':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/920618ee4ef8d51a39076253b72c968e_images.jpg',
            '360X480Xmini':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/920618ee4ef8d51a39076253b72c968e_images_mini.jpg',
            '180X240Xmini':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/920618ee4ef8d51a39076253b72c968e_images_mini.jpg',
            '150X200Xmini':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/920618ee4ef8d51a39076253b72c968e_images_mini.jpg',
            '48X64Xmini':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/920618ee4ef8d51a39076253b72c968e_images_mini.jpg',
            '125X161':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/920618ee4ef8d51a39076253b72c968e_images.jpg',
            '125X161Xmini':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/920618ee4ef8d51a39076253b72c968e_images_mini.jpg',
          },
          imageType: 'front',
        },
        right: {
          imageURL:
            'http://assets.myntassets.com/v1/images/style/properties/cc63975cc43bad59f1ce6a48b35d286d_images.jpg',
          resolutions: {
            '1080X1440Xmini':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/cc63975cc43bad59f1ce6a48b35d286d_images_mini.jpg',
            '48X64':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/cc63975cc43bad59f1ce6a48b35d286d_images.jpg',
            '1080X1440':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/cc63975cc43bad59f1ce6a48b35d286d_images.jpg',
            '150X200':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/cc63975cc43bad59f1ce6a48b35d286d_images.jpg',
            '360X480':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/cc63975cc43bad59f1ce6a48b35d286d_images.jpg',
            '180X240':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/cc63975cc43bad59f1ce6a48b35d286d_images.jpg',
            '360X480Xmini':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/cc63975cc43bad59f1ce6a48b35d286d_images_mini.jpg',
            '180X240Xmini':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/cc63975cc43bad59f1ce6a48b35d286d_images_mini.jpg',
            '150X200Xmini':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/cc63975cc43bad59f1ce6a48b35d286d_images_mini.jpg',
            '48X64Xmini':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/cc63975cc43bad59f1ce6a48b35d286d_images_mini.jpg',
            '125X161':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/cc63975cc43bad59f1ce6a48b35d286d_images.jpg',
            '125X161Xmini':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/cc63975cc43bad59f1ce6a48b35d286d_images_mini.jpg',
          },
          imageType: 'right',
        },
        top: {
          imageURL:
            'http://assets.myntassets.com/v1/images/style/properties/d5af7112018293e94c8b1608884e76cc_images.jpg',
          resolutions: {
            '1080X1440Xmini':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/d5af7112018293e94c8b1608884e76cc_images_mini.jpg',
            '48X64':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/d5af7112018293e94c8b1608884e76cc_images.jpg',
            '1080X1440':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/d5af7112018293e94c8b1608884e76cc_images.jpg',
            '150X200':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/d5af7112018293e94c8b1608884e76cc_images.jpg',
            '360X480':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/d5af7112018293e94c8b1608884e76cc_images.jpg',
            '180X240':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/d5af7112018293e94c8b1608884e76cc_images.jpg',
            '360X480Xmini':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/d5af7112018293e94c8b1608884e76cc_images_mini.jpg',
            '180X240Xmini':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/d5af7112018293e94c8b1608884e76cc_images_mini.jpg',
            '150X200Xmini':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/d5af7112018293e94c8b1608884e76cc_images_mini.jpg',
            '48X64Xmini':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/d5af7112018293e94c8b1608884e76cc_images_mini.jpg',
            '125X161':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/d5af7112018293e94c8b1608884e76cc_images.jpg',
            '125X161Xmini':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/d5af7112018293e94c8b1608884e76cc_images_mini.jpg',
          },
          imageType: 'top',
        },
      },
    },
    {
      id: 11006,
      price: 7795,
      productDisplayName: 'Puma Men Race Luminous Black Chronograph Watch',
      brandName: 'Puma',
      productDescriptors: {
        description: {
          descriptorType: 'description',
          value:
            '<p>This watch from puma comes in a heavy duty design. The stylish dial and chunky casing gives this watch a tough appearance - perfect for navigating the urban jungle.<br /><br /><strong>Case diameter</strong>: 40 mm<br /><strong>Dial shape</strong>: Round<br /><strong>Warranty</strong>: 2 Years<br /><br />Stainless steel case with a rose gold bezel<br />Rubber straps with a tang clasp<br />Black dial with branding at the 12 hour mark<br />Three time displays<br />Date aperture at the 4 hour mark<br />Screw to reset time<br />Solid case back made of stainless steel for durability<br />Water resistant upto 50 meters</p>',
        },
      },
      displayCategories: 'Accessories',
      brandUserProfile: {
        uidx: '12c1ae88.a2e0.4ada.8a85.2259c8f751fdEzea5ihq34',
        bio: "PUMA is the World's Fastest Sports Brand",
        name: 'PUMA',
        image: '../assets/fashion-dataset/images/11006.jpg',
        publicProfileId: 'PUMA',
        tagsMap:
          '{"roles":[],"labels":[],"myntraVerified":true,"invited":true,"brandUrl":"/puma"}',
      },
      styleImages: {
        default: {
          imageURL: '../assets/fashion-dataset/images/11006.jpg',
          resolutions: {
            '1080X1440Xmini':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/41a7fb3cda478f5432def21fc52a5a8d_images_mini.jpg',
            '48X64':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/41a7fb3cda478f5432def21fc52a5a8d_images.jpg',
            '1080X1440':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/41a7fb3cda478f5432def21fc52a5a8d_images.jpg',
            '150X200':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/41a7fb3cda478f5432def21fc52a5a8d_images.jpg',
            '360X480':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/41a7fb3cda478f5432def21fc52a5a8d_images.jpg',
            '180X240':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/41a7fb3cda478f5432def21fc52a5a8d_images.jpg',
            '360X480Xmini':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/41a7fb3cda478f5432def21fc52a5a8d_images_mini.jpg',
            '180X240Xmini':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/41a7fb3cda478f5432def21fc52a5a8d_images_mini.jpg',
            '150X200Xmini':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/41a7fb3cda478f5432def21fc52a5a8d_images_mini.jpg',
            '48X64Xmini':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/41a7fb3cda478f5432def21fc52a5a8d_images_mini.jpg',
            '125X161':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/41a7fb3cda478f5432def21fc52a5a8d_images.jpg',
            '125X161Xmini':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/41a7fb3cda478f5432def21fc52a5a8d_images_mini.jpg',
          },
          imageType: 'default',
        },
        search: {
          imageURL:
            'http://assets.myntassets.com/v1/images/style/properties/41a7fb3cda478f5432def21fc52a5a8d_images.jpg',
          resolutions: {
            '1080X1440Xmini':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/41a7fb3cda478f5432def21fc52a5a8d_images_mini.jpg',
            '48X64':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/41a7fb3cda478f5432def21fc52a5a8d_images.jpg',
            '1080X1440':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/41a7fb3cda478f5432def21fc52a5a8d_images.jpg',
            '150X200':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/41a7fb3cda478f5432def21fc52a5a8d_images.jpg',
            '360X480':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/41a7fb3cda478f5432def21fc52a5a8d_images.jpg',
            '180X240':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/41a7fb3cda478f5432def21fc52a5a8d_images.jpg',
            '360X480Xmini':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/41a7fb3cda478f5432def21fc52a5a8d_images_mini.jpg',
            '180X240Xmini':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/41a7fb3cda478f5432def21fc52a5a8d_images_mini.jpg',
            '150X200Xmini':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/41a7fb3cda478f5432def21fc52a5a8d_images_mini.jpg',
            '48X64Xmini':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/41a7fb3cda478f5432def21fc52a5a8d_images_mini.jpg',
            '125X161':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/41a7fb3cda478f5432def21fc52a5a8d_images.jpg',
            '125X161Xmini':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/41a7fb3cda478f5432def21fc52a5a8d_images_mini.jpg',
          },
          imageType: 'search',
        },
        back: {
          imageURL:
            'http://assets.myntassets.com/v1/images/style/properties/ec219183d4b66249117cd45d98c600b9_images.jpg',
          resolutions: {
            '1080X1440Xmini':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/ec219183d4b66249117cd45d98c600b9_images_mini.jpg',
            '48X64':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/ec219183d4b66249117cd45d98c600b9_images.jpg',
            '1080X1440':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/ec219183d4b66249117cd45d98c600b9_images.jpg',
            '150X200':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/ec219183d4b66249117cd45d98c600b9_images.jpg',
            '360X480':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/ec219183d4b66249117cd45d98c600b9_images.jpg',
            '180X240':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/ec219183d4b66249117cd45d98c600b9_images.jpg',
            '360X480Xmini':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/ec219183d4b66249117cd45d98c600b9_images_mini.jpg',
            '180X240Xmini':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/ec219183d4b66249117cd45d98c600b9_images_mini.jpg',
            '150X200Xmini':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/ec219183d4b66249117cd45d98c600b9_images_mini.jpg',
            '48X64Xmini':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/ec219183d4b66249117cd45d98c600b9_images_mini.jpg',
            '125X161':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/ec219183d4b66249117cd45d98c600b9_images.jpg',
            '125X161Xmini':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/ec219183d4b66249117cd45d98c600b9_images_mini.jpg',
          },
          imageType: 'back',
        },
        left: {
          imageURL:
            'http://assets.myntassets.com/v1/images/style/properties/067b5668b73a091889f85313b81b59d9_images.jpg',
          resolutions: {
            '1080X1440Xmini':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/067b5668b73a091889f85313b81b59d9_images_mini.jpg',
            '48X64':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/067b5668b73a091889f85313b81b59d9_images.jpg',
            '1080X1440':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/067b5668b73a091889f85313b81b59d9_images.jpg',
            '150X200':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/067b5668b73a091889f85313b81b59d9_images.jpg',
            '360X480':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/067b5668b73a091889f85313b81b59d9_images.jpg',
            '180X240':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/067b5668b73a091889f85313b81b59d9_images.jpg',
            '360X480Xmini':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/067b5668b73a091889f85313b81b59d9_images_mini.jpg',
            '180X240Xmini':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/067b5668b73a091889f85313b81b59d9_images_mini.jpg',
            '150X200Xmini':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/067b5668b73a091889f85313b81b59d9_images_mini.jpg',
            '48X64Xmini':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/067b5668b73a091889f85313b81b59d9_images_mini.jpg',
            '125X161':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/067b5668b73a091889f85313b81b59d9_images.jpg',
            '125X161Xmini':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/067b5668b73a091889f85313b81b59d9_images_mini.jpg',
          },
          imageType: 'left',
        },
        front: {
          imageURL:
            'http://assets.myntassets.com/v1/images/style/properties/0b8a30d6e39bdecea5097a7a21b8b22c_images.jpg',
          resolutions: {
            '1080X1440Xmini':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/0b8a30d6e39bdecea5097a7a21b8b22c_images_mini.jpg',
            '48X64':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/0b8a30d6e39bdecea5097a7a21b8b22c_images.jpg',
            '1080X1440':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/0b8a30d6e39bdecea5097a7a21b8b22c_images.jpg',
            '150X200':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/0b8a30d6e39bdecea5097a7a21b8b22c_images.jpg',
            '360X480':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/0b8a30d6e39bdecea5097a7a21b8b22c_images.jpg',
            '180X240':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/0b8a30d6e39bdecea5097a7a21b8b22c_images.jpg',
            '360X480Xmini':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/0b8a30d6e39bdecea5097a7a21b8b22c_images_mini.jpg',
            '180X240Xmini':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/0b8a30d6e39bdecea5097a7a21b8b22c_images_mini.jpg',
            '150X200Xmini':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/0b8a30d6e39bdecea5097a7a21b8b22c_images_mini.jpg',
            '48X64Xmini':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/0b8a30d6e39bdecea5097a7a21b8b22c_images_mini.jpg',
            '125X161':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/0b8a30d6e39bdecea5097a7a21b8b22c_images.jpg',
            '125X161Xmini':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/0b8a30d6e39bdecea5097a7a21b8b22c_images_mini.jpg',
          },
          imageType: 'front',
        },
        right: {
          imageURL:
            'http://assets.myntassets.com/v1/images/style/properties/ea36c86d4fd01bd1dbe89e4ab55328a4_images.jpg',
          resolutions: {
            '1080X1440Xmini':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/ea36c86d4fd01bd1dbe89e4ab55328a4_images_mini.jpg',
            '48X64':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/ea36c86d4fd01bd1dbe89e4ab55328a4_images.jpg',
            '1080X1440':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/ea36c86d4fd01bd1dbe89e4ab55328a4_images.jpg',
            '150X200':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/ea36c86d4fd01bd1dbe89e4ab55328a4_images.jpg',
            '360X480':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/ea36c86d4fd01bd1dbe89e4ab55328a4_images.jpg',
            '180X240':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/ea36c86d4fd01bd1dbe89e4ab55328a4_images.jpg',
            '360X480Xmini':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/ea36c86d4fd01bd1dbe89e4ab55328a4_images_mini.jpg',
            '180X240Xmini':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/ea36c86d4fd01bd1dbe89e4ab55328a4_images_mini.jpg',
            '150X200Xmini':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/ea36c86d4fd01bd1dbe89e4ab55328a4_images_mini.jpg',
            '48X64Xmini':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/ea36c86d4fd01bd1dbe89e4ab55328a4_images_mini.jpg',
            '125X161':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/ea36c86d4fd01bd1dbe89e4ab55328a4_images.jpg',
            '125X161Xmini':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/ea36c86d4fd01bd1dbe89e4ab55328a4_images_mini.jpg',
          },
          imageType: 'right',
        },
        top: {
          imageURL:
            'http://assets.myntassets.com/v1/images/style/properties/65d5a0cd989ae3c15393d699c0cae130_images.jpg',
          resolutions: {
            '1080X1440Xmini':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/65d5a0cd989ae3c15393d699c0cae130_images_mini.jpg',
            '48X64':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/65d5a0cd989ae3c15393d699c0cae130_images.jpg',
            '1080X1440':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/65d5a0cd989ae3c15393d699c0cae130_images.jpg',
            '150X200':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/65d5a0cd989ae3c15393d699c0cae130_images.jpg',
            '360X480':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/65d5a0cd989ae3c15393d699c0cae130_images.jpg',
            '180X240':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/65d5a0cd989ae3c15393d699c0cae130_images.jpg',
            '360X480Xmini':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/65d5a0cd989ae3c15393d699c0cae130_images_mini.jpg',
            '180X240Xmini':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/65d5a0cd989ae3c15393d699c0cae130_images_mini.jpg',
            '150X200Xmini':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/65d5a0cd989ae3c15393d699c0cae130_images_mini.jpg',
            '48X64Xmini':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/65d5a0cd989ae3c15393d699c0cae130_images_mini.jpg',
            '125X161':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/65d5a0cd989ae3c15393d699c0cae130_images.jpg',
            '125X161Xmini':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/65d5a0cd989ae3c15393d699c0cae130_images_mini.jpg',
          },
          imageType: 'top',
        },
      },
    },
    {
      id: 11007,
      price: 9495,
      productDisplayName: 'Puma Men Turbo Black Chronograph Watch',
      brandName: 'Puma',
      productDescriptors: {
        description: {
          descriptorType: 'description',
          value:
            '<p>This watch from puma comes in a heavy duty design. The stylish dial and chunky casing gives this watch a tough appearance - perfect for navigating the urban jungle.<br /><br /><strong>Case diameter</strong>: 35 mm<br /><strong>Dial shape</strong>: Round<br /><strong>Warranty</strong>: 2 Years<br /><br />Plastic case and a gold bezel<br />Rubber straps with a tang clasp<br />Black dial with branding at the 12 hour mark<br />Three time displays<br />Date aperture at the 4 hour mark<br />Branding on the bezel<br />Press to reset time<br />Solid case back made of stainless steel for durability<br />Water resistant upto 50 meters</p>',
        },
      },
      displayCategories: 'Accessories',
      brandUserProfile: {
        uidx: '12c1ae88.a2e0.4ada.8a85.2259c8f751fdEzea5ihq34',
        bio: "PUMA is the World's Fastest Sports Brand",
        name: 'PUMA',
        image: '../assets/fashion-dataset/images/11007.jpg',
        publicProfileId: 'PUMA',
        tagsMap:
          '{"roles":[],"labels":[],"myntraVerified":true,"invited":true,"brandUrl":"/puma"}',
      },
      styleImages: {
        default: {
          imageURL: '../assets/fashion-dataset/images/11007.jpg',
          resolutions: {
            '1080X1440Xmini':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/705aa471f4f1b62ed538d907f4160f7d_images_mini.jpg',
            '48X64':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/705aa471f4f1b62ed538d907f4160f7d_images.jpg',
            '1080X1440':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/705aa471f4f1b62ed538d907f4160f7d_images.jpg',
            '150X200':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/705aa471f4f1b62ed538d907f4160f7d_images.jpg',
            '360X480':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/705aa471f4f1b62ed538d907f4160f7d_images.jpg',
            '180X240':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/705aa471f4f1b62ed538d907f4160f7d_images.jpg',
            '360X480Xmini':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/705aa471f4f1b62ed538d907f4160f7d_images_mini.jpg',
            '180X240Xmini':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/705aa471f4f1b62ed538d907f4160f7d_images_mini.jpg',
            '150X200Xmini':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/705aa471f4f1b62ed538d907f4160f7d_images_mini.jpg',
            '48X64Xmini':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/705aa471f4f1b62ed538d907f4160f7d_images_mini.jpg',
            '125X161':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/705aa471f4f1b62ed538d907f4160f7d_images.jpg',
            '125X161Xmini':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/705aa471f4f1b62ed538d907f4160f7d_images_mini.jpg',
          },
          imageType: 'default',
        },
        search: {
          imageURL:
            'http://assets.myntassets.com/v1/images/style/properties/705aa471f4f1b62ed538d907f4160f7d_images.jpg',
          resolutions: {
            '1080X1440Xmini':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/705aa471f4f1b62ed538d907f4160f7d_images_mini.jpg',
            '48X64':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/705aa471f4f1b62ed538d907f4160f7d_images.jpg',
            '1080X1440':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/705aa471f4f1b62ed538d907f4160f7d_images.jpg',
            '150X200':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/705aa471f4f1b62ed538d907f4160f7d_images.jpg',
            '360X480':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/705aa471f4f1b62ed538d907f4160f7d_images.jpg',
            '180X240':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/705aa471f4f1b62ed538d907f4160f7d_images.jpg',
            '360X480Xmini':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/705aa471f4f1b62ed538d907f4160f7d_images_mini.jpg',
            '180X240Xmini':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/705aa471f4f1b62ed538d907f4160f7d_images_mini.jpg',
            '150X200Xmini':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/705aa471f4f1b62ed538d907f4160f7d_images_mini.jpg',
            '48X64Xmini':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/705aa471f4f1b62ed538d907f4160f7d_images_mini.jpg',
            '125X161':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/705aa471f4f1b62ed538d907f4160f7d_images.jpg',
            '125X161Xmini':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/705aa471f4f1b62ed538d907f4160f7d_images_mini.jpg',
          },
          imageType: 'search',
        },
        back: {
          imageURL:
            'http://assets.myntassets.com/v1/images/style/properties/17bfc6302af9736fc5fa1e5cc45a9c23_images.jpg',
          resolutions: {
            '1080X1440Xmini':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/17bfc6302af9736fc5fa1e5cc45a9c23_images_mini.jpg',
            '48X64':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/17bfc6302af9736fc5fa1e5cc45a9c23_images.jpg',
            '1080X1440':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/17bfc6302af9736fc5fa1e5cc45a9c23_images.jpg',
            '150X200':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/17bfc6302af9736fc5fa1e5cc45a9c23_images.jpg',
            '360X480':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/17bfc6302af9736fc5fa1e5cc45a9c23_images.jpg',
            '180X240':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/17bfc6302af9736fc5fa1e5cc45a9c23_images.jpg',
            '360X480Xmini':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/17bfc6302af9736fc5fa1e5cc45a9c23_images_mini.jpg',
            '180X240Xmini':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/17bfc6302af9736fc5fa1e5cc45a9c23_images_mini.jpg',
            '150X200Xmini':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/17bfc6302af9736fc5fa1e5cc45a9c23_images_mini.jpg',
            '48X64Xmini':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/17bfc6302af9736fc5fa1e5cc45a9c23_images_mini.jpg',
            '125X161':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/17bfc6302af9736fc5fa1e5cc45a9c23_images.jpg',
            '125X161Xmini':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/17bfc6302af9736fc5fa1e5cc45a9c23_images_mini.jpg',
          },
          imageType: 'back',
        },
        left: {
          imageURL:
            'http://assets.myntassets.com/v1/images/style/properties/c6d8f984b6e66138a6c9b2b71f777c62_images.jpg',
          resolutions: {
            '1080X1440Xmini':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/c6d8f984b6e66138a6c9b2b71f777c62_images_mini.jpg',
            '48X64':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/c6d8f984b6e66138a6c9b2b71f777c62_images.jpg',
            '1080X1440':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/c6d8f984b6e66138a6c9b2b71f777c62_images.jpg',
            '150X200':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/c6d8f984b6e66138a6c9b2b71f777c62_images.jpg',
            '360X480':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/c6d8f984b6e66138a6c9b2b71f777c62_images.jpg',
            '180X240':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/c6d8f984b6e66138a6c9b2b71f777c62_images.jpg',
            '360X480Xmini':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/c6d8f984b6e66138a6c9b2b71f777c62_images_mini.jpg',
            '180X240Xmini':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/c6d8f984b6e66138a6c9b2b71f777c62_images_mini.jpg',
            '150X200Xmini':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/c6d8f984b6e66138a6c9b2b71f777c62_images_mini.jpg',
            '48X64Xmini':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/c6d8f984b6e66138a6c9b2b71f777c62_images_mini.jpg',
            '125X161':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/c6d8f984b6e66138a6c9b2b71f777c62_images.jpg',
            '125X161Xmini':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/c6d8f984b6e66138a6c9b2b71f777c62_images_mini.jpg',
          },
          imageType: 'left',
        },
        front: {
          imageURL:
            'http://assets.myntassets.com/v1/images/style/properties/c61ff3f48390f93ee52013e72d410c75_images.jpg',
          resolutions: {
            '1080X1440Xmini':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/c61ff3f48390f93ee52013e72d410c75_images_mini.jpg',
            '48X64':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/c61ff3f48390f93ee52013e72d410c75_images.jpg',
            '1080X1440':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/c61ff3f48390f93ee52013e72d410c75_images.jpg',
            '150X200':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/c61ff3f48390f93ee52013e72d410c75_images.jpg',
            '360X480':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/c61ff3f48390f93ee52013e72d410c75_images.jpg',
            '180X240':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/c61ff3f48390f93ee52013e72d410c75_images.jpg',
            '360X480Xmini':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/c61ff3f48390f93ee52013e72d410c75_images_mini.jpg',
            '180X240Xmini':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/c61ff3f48390f93ee52013e72d410c75_images_mini.jpg',
            '150X200Xmini':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/c61ff3f48390f93ee52013e72d410c75_images_mini.jpg',
            '48X64Xmini':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/c61ff3f48390f93ee52013e72d410c75_images_mini.jpg',
            '125X161':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/c61ff3f48390f93ee52013e72d410c75_images.jpg',
            '125X161Xmini':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/c61ff3f48390f93ee52013e72d410c75_images_mini.jpg',
          },
          imageType: 'front',
        },
        right: {
          imageURL:
            'http://assets.myntassets.com/v1/images/style/properties/dc0dca3a5f33ad207ffb0c62715c804c_images.jpg',
          resolutions: {
            '1080X1440Xmini':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/dc0dca3a5f33ad207ffb0c62715c804c_images_mini.jpg',
            '48X64':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/dc0dca3a5f33ad207ffb0c62715c804c_images.jpg',
            '1080X1440':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/dc0dca3a5f33ad207ffb0c62715c804c_images.jpg',
            '150X200':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/dc0dca3a5f33ad207ffb0c62715c804c_images.jpg',
            '360X480':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/dc0dca3a5f33ad207ffb0c62715c804c_images.jpg',
            '180X240':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/dc0dca3a5f33ad207ffb0c62715c804c_images.jpg',
            '360X480Xmini':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/dc0dca3a5f33ad207ffb0c62715c804c_images_mini.jpg',
            '180X240Xmini':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/dc0dca3a5f33ad207ffb0c62715c804c_images_mini.jpg',
            '150X200Xmini':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/dc0dca3a5f33ad207ffb0c62715c804c_images_mini.jpg',
            '48X64Xmini':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/dc0dca3a5f33ad207ffb0c62715c804c_images_mini.jpg',
            '125X161':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/dc0dca3a5f33ad207ffb0c62715c804c_images.jpg',
            '125X161Xmini':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/dc0dca3a5f33ad207ffb0c62715c804c_images_mini.jpg',
          },
          imageType: 'right',
        },
        top: {
          imageURL:
            'http://assets.myntassets.com/v1/images/style/properties/d64a2319baf28048f1cbd7aafca18ec8_images.jpg',
          resolutions: {
            '1080X1440Xmini':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/d64a2319baf28048f1cbd7aafca18ec8_images_mini.jpg',
            '48X64':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/d64a2319baf28048f1cbd7aafca18ec8_images.jpg',
            '1080X1440':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/d64a2319baf28048f1cbd7aafca18ec8_images.jpg',
            '150X200':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/d64a2319baf28048f1cbd7aafca18ec8_images.jpg',
            '360X480':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/d64a2319baf28048f1cbd7aafca18ec8_images.jpg',
            '180X240':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/d64a2319baf28048f1cbd7aafca18ec8_images.jpg',
            '360X480Xmini':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/d64a2319baf28048f1cbd7aafca18ec8_images_mini.jpg',
            '180X240Xmini':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/d64a2319baf28048f1cbd7aafca18ec8_images_mini.jpg',
            '150X200Xmini':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/d64a2319baf28048f1cbd7aafca18ec8_images_mini.jpg',
            '48X64Xmini':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/d64a2319baf28048f1cbd7aafca18ec8_images_mini.jpg',
            '125X161':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/d64a2319baf28048f1cbd7aafca18ec8_images.jpg',
            '125X161Xmini':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/d64a2319baf28048f1cbd7aafca18ec8_images_mini.jpg',
          },
          imageType: 'top',
        },
      },
    },
    {
      id: 11008,
      price: 499,
      productDisplayName: 'Inkfruit Women Behind Cream Tshirts',
      brandName: 'Inkfruit',
      productDescriptors: {
        description: {
          descriptorType: 'description',
          value:
            '<p><strong>Composition</strong><br />Yellow round neck t-shirt made of 100% cotton, has short sleeves and graphic print on the front<br /><br /><strong>Fitting</strong><br />Comfort<br /><br /><strong>Wash care</strong><br />Hand wash separately in cool water at 30 degrees <br />Do not scrub <br />Do not bleach <br />Turn inside out and dry flat in shade <br />Warm iron on reverse<br />Do not iron on print<br /><br />Flaunt your pretty, long legs in style with this inkfruit t-shirt. The graphic print oozes sensuality, while the cotton fabric keeps you fresh and comfortable all day. Team this with a short denim skirt and high-heeled sandals and get behind the wheel in style.<br /><br /><em>Model statistics</em><br />The model wears size M in t-shirts <br />Height: 5\'7", Chest: 33"</p>',
        },
      },
      displayCategories: 'Casual Wear',
      brandUserProfile: {},
      styleImages: {
        default: {
          imageURL: '../assets/fashion-dataset/images/11008.jpg',
          resolutions: {
            '1080X1440Xmini':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/7a3e4f2cab50d5b90b2ff16e40815faf_images_mini.jpg',
            '48X64':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/7a3e4f2cab50d5b90b2ff16e40815faf_images.jpg',
            '1080X1440':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/7a3e4f2cab50d5b90b2ff16e40815faf_images.jpg',
            '150X200':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/7a3e4f2cab50d5b90b2ff16e40815faf_images.jpg',
            '360X480':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/7a3e4f2cab50d5b90b2ff16e40815faf_images.jpg',
            '180X240':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/7a3e4f2cab50d5b90b2ff16e40815faf_images.jpg',
            '360X480Xmini':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/7a3e4f2cab50d5b90b2ff16e40815faf_images_mini.jpg',
            '180X240Xmini':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/7a3e4f2cab50d5b90b2ff16e40815faf_images_mini.jpg',
            '150X200Xmini':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/7a3e4f2cab50d5b90b2ff16e40815faf_images_mini.jpg',
            '48X64Xmini':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/7a3e4f2cab50d5b90b2ff16e40815faf_images_mini.jpg',
            '125X161':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/7a3e4f2cab50d5b90b2ff16e40815faf_images.jpg',
            '125X161Xmini':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/7a3e4f2cab50d5b90b2ff16e40815faf_images_mini.jpg',
          },
          imageType: 'default',
        },
        size_representation:
          'http://assets.myntassets.com/assets/images/sizechart/2016/12/14/11481690832632-Tshirts_-Women.png',
        search: {
          imageURL:
            'http://assets.myntassets.com/v1/images/style/properties/7a3e4f2cab50d5b90b2ff16e40815faf_images.jpg',
          resolutions: {
            '1080X1440Xmini':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/7a3e4f2cab50d5b90b2ff16e40815faf_images_mini.jpg',
            '48X64':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/7a3e4f2cab50d5b90b2ff16e40815faf_images.jpg',
            '1080X1440':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/7a3e4f2cab50d5b90b2ff16e40815faf_images.jpg',
            '150X200':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/7a3e4f2cab50d5b90b2ff16e40815faf_images.jpg',
            '360X480':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/7a3e4f2cab50d5b90b2ff16e40815faf_images.jpg',
            '180X240':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/7a3e4f2cab50d5b90b2ff16e40815faf_images.jpg',
            '360X480Xmini':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/7a3e4f2cab50d5b90b2ff16e40815faf_images_mini.jpg',
            '180X240Xmini':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/7a3e4f2cab50d5b90b2ff16e40815faf_images_mini.jpg',
            '150X200Xmini':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/7a3e4f2cab50d5b90b2ff16e40815faf_images_mini.jpg',
            '48X64Xmini':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/7a3e4f2cab50d5b90b2ff16e40815faf_images_mini.jpg',
            '125X161':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/7a3e4f2cab50d5b90b2ff16e40815faf_images.jpg',
            '125X161Xmini':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/7a3e4f2cab50d5b90b2ff16e40815faf_images_mini.jpg',
          },
          imageType: 'search',
        },
        back: {
          imageURL:
            'http://assets.myntassets.com/v1/images/style/properties/3fd57c22942be82ebc60d2615c31a181_images.jpg',
          resolutions: {
            '1080X1440Xmini':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/3fd57c22942be82ebc60d2615c31a181_images_mini.jpg',
            '48X64':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/3fd57c22942be82ebc60d2615c31a181_images.jpg',
            '1080X1440':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/3fd57c22942be82ebc60d2615c31a181_images.jpg',
            '150X200':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/3fd57c22942be82ebc60d2615c31a181_images.jpg',
            '360X480':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/3fd57c22942be82ebc60d2615c31a181_images.jpg',
            '180X240':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/3fd57c22942be82ebc60d2615c31a181_images.jpg',
            '360X480Xmini':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/3fd57c22942be82ebc60d2615c31a181_images_mini.jpg',
            '180X240Xmini':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/3fd57c22942be82ebc60d2615c31a181_images_mini.jpg',
            '150X200Xmini':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/3fd57c22942be82ebc60d2615c31a181_images_mini.jpg',
            '48X64Xmini':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/3fd57c22942be82ebc60d2615c31a181_images_mini.jpg',
            '125X161':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/3fd57c22942be82ebc60d2615c31a181_images.jpg',
            '125X161Xmini':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/3fd57c22942be82ebc60d2615c31a181_images_mini.jpg',
          },
          imageType: 'back',
        },
        left: {
          imageURL:
            'http://assets.myntassets.com/v1/images/style/properties/3e4ba681ce6b2b24c01df6eb77b20a77_images.jpg',
          resolutions: {
            '1080X1440Xmini':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/3e4ba681ce6b2b24c01df6eb77b20a77_images_mini.jpg',
            '48X64':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/3e4ba681ce6b2b24c01df6eb77b20a77_images.jpg',
            '1080X1440':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/3e4ba681ce6b2b24c01df6eb77b20a77_images.jpg',
            '150X200':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/3e4ba681ce6b2b24c01df6eb77b20a77_images.jpg',
            '360X480':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/3e4ba681ce6b2b24c01df6eb77b20a77_images.jpg',
            '180X240':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/3e4ba681ce6b2b24c01df6eb77b20a77_images.jpg',
            '360X480Xmini':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/3e4ba681ce6b2b24c01df6eb77b20a77_images_mini.jpg',
            '180X240Xmini':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/3e4ba681ce6b2b24c01df6eb77b20a77_images_mini.jpg',
            '150X200Xmini':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/3e4ba681ce6b2b24c01df6eb77b20a77_images_mini.jpg',
            '48X64Xmini':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/3e4ba681ce6b2b24c01df6eb77b20a77_images_mini.jpg',
            '125X161':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/3e4ba681ce6b2b24c01df6eb77b20a77_images.jpg',
            '125X161Xmini':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/3e4ba681ce6b2b24c01df6eb77b20a77_images_mini.jpg',
          },
          imageType: 'left',
        },
        front: {
          imageURL:
            'http://assets.myntassets.com/v1/images/style/properties/9b9c29cdb79a134927b437e170465add_images.jpg',
          resolutions: {
            '1080X1440Xmini':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/9b9c29cdb79a134927b437e170465add_images_mini.jpg',
            '48X64':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/9b9c29cdb79a134927b437e170465add_images.jpg',
            '1080X1440':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/9b9c29cdb79a134927b437e170465add_images.jpg',
            '150X200':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/9b9c29cdb79a134927b437e170465add_images.jpg',
            '360X480':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/9b9c29cdb79a134927b437e170465add_images.jpg',
            '180X240':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/9b9c29cdb79a134927b437e170465add_images.jpg',
            '360X480Xmini':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/9b9c29cdb79a134927b437e170465add_images_mini.jpg',
            '180X240Xmini':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/9b9c29cdb79a134927b437e170465add_images_mini.jpg',
            '150X200Xmini':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/9b9c29cdb79a134927b437e170465add_images_mini.jpg',
            '48X64Xmini':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/9b9c29cdb79a134927b437e170465add_images_mini.jpg',
            '125X161':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/9b9c29cdb79a134927b437e170465add_images.jpg',
            '125X161Xmini':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/9b9c29cdb79a134927b437e170465add_images_mini.jpg',
          },
          imageType: 'front',
        },
        right: {
          imageURL:
            'http://assets.myntassets.com/v1/images/style/properties/f96c230017f4d0ce3ca75fee2badb835_images.jpg',
          resolutions: {
            '1080X1440Xmini':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/f96c230017f4d0ce3ca75fee2badb835_images_mini.jpg',
            '48X64':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/f96c230017f4d0ce3ca75fee2badb835_images.jpg',
            '1080X1440':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/f96c230017f4d0ce3ca75fee2badb835_images.jpg',
            '150X200':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/f96c230017f4d0ce3ca75fee2badb835_images.jpg',
            '360X480':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/f96c230017f4d0ce3ca75fee2badb835_images.jpg',
            '180X240':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/f96c230017f4d0ce3ca75fee2badb835_images.jpg',
            '360X480Xmini':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/f96c230017f4d0ce3ca75fee2badb835_images_mini.jpg',
            '180X240Xmini':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/f96c230017f4d0ce3ca75fee2badb835_images_mini.jpg',
            '150X200Xmini':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/f96c230017f4d0ce3ca75fee2badb835_images_mini.jpg',
            '48X64Xmini':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/f96c230017f4d0ce3ca75fee2badb835_images_mini.jpg',
            '125X161':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/f96c230017f4d0ce3ca75fee2badb835_images.jpg',
            '125X161Xmini':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/f96c230017f4d0ce3ca75fee2badb835_images_mini.jpg',
          },
          imageType: 'right',
        },
      },
    },
    {
      id: 11009,
      price: 499,
      productDisplayName: 'Inkfruit Men Let Me Skate White Tshirts',
      brandName: 'Inkfruit',
      productDescriptors: {
        description: {
          descriptorType: 'description',
          value:
            "<p><strong>Composition</strong><br />White round neck t-shirt made of 100% cotton, has short sleeves and graphic print on the front<br /><br /><strong>Fitting</strong><br />Comfort<br /><br />Wash care<br />Hand wash separately in cool water at 30 degrees <br />Do not scrub <br />Do not bleach <br />Turn inside out and dry flat in shade <br />Warm iron on reverse<br />Do not iron on print<br /><br />Sky is the limit for those who love to skate. Care no more about the world, and simply fuel your passion for those feet on wheels with this inkfruit t-shirt. The sporty graphic print keeps your style high, while the cotton fabric keeps you fresh and comfortable all day. Team this with jeans and <a href='/sports-shoes?src=desc' class='seolink'>sports shoes</a> or <a href='/men-shorts?src=desc' class='seolink'>shorts</a> and sandals for unparalleled cool.<br /><br /><em>Model statistics</em><br />The model wears size M in t-shirts<br />Height-5'11\", Shoulders-18\"</p>",
        },
      },
      displayCategories: 'Casual Wear',
      brandUserProfile: {},
      styleImages: {
        default: {
          imageURL: '../assets/fashion-dataset/images/11009.jpg',
          resolutions: {
            '1080X1440Xmini':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/341ac59abad5a8063cec056ede780079_images_mini.jpg',
            '48X64':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/341ac59abad5a8063cec056ede780079_images.jpg',
            '1080X1440':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/341ac59abad5a8063cec056ede780079_images.jpg',
            '150X200':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/341ac59abad5a8063cec056ede780079_images.jpg',
            '360X480':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/341ac59abad5a8063cec056ede780079_images.jpg',
            '180X240':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/341ac59abad5a8063cec056ede780079_images.jpg',
            '360X480Xmini':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/341ac59abad5a8063cec056ede780079_images_mini.jpg',
            '180X240Xmini':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/341ac59abad5a8063cec056ede780079_images_mini.jpg',
            '150X200Xmini':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/341ac59abad5a8063cec056ede780079_images_mini.jpg',
            '48X64Xmini':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/341ac59abad5a8063cec056ede780079_images_mini.jpg',
            '125X161':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/341ac59abad5a8063cec056ede780079_images.jpg',
            '125X161Xmini':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/341ac59abad5a8063cec056ede780079_images_mini.jpg',
          },
          imageType: 'default',
        },
        size_representation:
          'http://assets.myntassets.com/assets/images/sizechart/2016/12/14/11481690842463-Tshirts_men.png',
        search: {
          imageURL:
            'http://assets.myntassets.com/v1/images/style/properties/341ac59abad5a8063cec056ede780079_images.jpg',
          resolutions: {
            '1080X1440Xmini':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/341ac59abad5a8063cec056ede780079_images_mini.jpg',
            '48X64':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/341ac59abad5a8063cec056ede780079_images.jpg',
            '1080X1440':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/341ac59abad5a8063cec056ede780079_images.jpg',
            '150X200':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/341ac59abad5a8063cec056ede780079_images.jpg',
            '360X480':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/341ac59abad5a8063cec056ede780079_images.jpg',
            '180X240':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/341ac59abad5a8063cec056ede780079_images.jpg',
            '360X480Xmini':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/341ac59abad5a8063cec056ede780079_images_mini.jpg',
            '180X240Xmini':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/341ac59abad5a8063cec056ede780079_images_mini.jpg',
            '150X200Xmini':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/341ac59abad5a8063cec056ede780079_images_mini.jpg',
            '48X64Xmini':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/341ac59abad5a8063cec056ede780079_images_mini.jpg',
            '125X161':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/341ac59abad5a8063cec056ede780079_images.jpg',
            '125X161Xmini':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/341ac59abad5a8063cec056ede780079_images_mini.jpg',
          },
          imageType: 'search',
        },
        back: {
          imageURL:
            'http://assets.myntassets.com/v1/images/style/properties/020c1ca0374640de701ecd7efb895e8c_images.jpg',
          resolutions: {
            '1080X1440Xmini':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/020c1ca0374640de701ecd7efb895e8c_images_mini.jpg',
            '48X64':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/020c1ca0374640de701ecd7efb895e8c_images.jpg',
            '1080X1440':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/020c1ca0374640de701ecd7efb895e8c_images.jpg',
            '150X200':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/020c1ca0374640de701ecd7efb895e8c_images.jpg',
            '360X480':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/020c1ca0374640de701ecd7efb895e8c_images.jpg',
            '180X240':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/020c1ca0374640de701ecd7efb895e8c_images.jpg',
            '360X480Xmini':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/020c1ca0374640de701ecd7efb895e8c_images_mini.jpg',
            '180X240Xmini':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/020c1ca0374640de701ecd7efb895e8c_images_mini.jpg',
            '150X200Xmini':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/020c1ca0374640de701ecd7efb895e8c_images_mini.jpg',
            '48X64Xmini':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/020c1ca0374640de701ecd7efb895e8c_images_mini.jpg',
            '125X161':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/020c1ca0374640de701ecd7efb895e8c_images.jpg',
            '125X161Xmini':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/020c1ca0374640de701ecd7efb895e8c_images_mini.jpg',
          },
          imageType: 'back',
        },
        left: {
          imageURL:
            'http://assets.myntassets.com/v1/images/style/properties/930e3d13f5d2e53066546e89297240de_images.jpg',
          resolutions: {
            '1080X1440Xmini':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/930e3d13f5d2e53066546e89297240de_images_mini.jpg',
            '48X64':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/930e3d13f5d2e53066546e89297240de_images.jpg',
            '1080X1440':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/930e3d13f5d2e53066546e89297240de_images.jpg',
            '150X200':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/930e3d13f5d2e53066546e89297240de_images.jpg',
            '360X480':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/930e3d13f5d2e53066546e89297240de_images.jpg',
            '180X240':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/930e3d13f5d2e53066546e89297240de_images.jpg',
            '360X480Xmini':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/930e3d13f5d2e53066546e89297240de_images_mini.jpg',
            '180X240Xmini':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/930e3d13f5d2e53066546e89297240de_images_mini.jpg',
            '150X200Xmini':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/930e3d13f5d2e53066546e89297240de_images_mini.jpg',
            '48X64Xmini':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/930e3d13f5d2e53066546e89297240de_images_mini.jpg',
            '125X161':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/930e3d13f5d2e53066546e89297240de_images.jpg',
            '125X161Xmini':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/930e3d13f5d2e53066546e89297240de_images_mini.jpg',
          },
          imageType: 'left',
        },
        front: {
          imageURL:
            'http://assets.myntassets.com/v1/images/style/properties/2a7668dc1d3bd9bb92c6c49b0bc3b5ed_images.jpg',
          resolutions: {
            '1080X1440Xmini':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/2a7668dc1d3bd9bb92c6c49b0bc3b5ed_images_mini.jpg',
            '48X64':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/2a7668dc1d3bd9bb92c6c49b0bc3b5ed_images.jpg',
            '1080X1440':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/2a7668dc1d3bd9bb92c6c49b0bc3b5ed_images.jpg',
            '150X200':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/2a7668dc1d3bd9bb92c6c49b0bc3b5ed_images.jpg',
            '360X480':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/2a7668dc1d3bd9bb92c6c49b0bc3b5ed_images.jpg',
            '180X240':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/2a7668dc1d3bd9bb92c6c49b0bc3b5ed_images.jpg',
            '360X480Xmini':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/2a7668dc1d3bd9bb92c6c49b0bc3b5ed_images_mini.jpg',
            '180X240Xmini':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/2a7668dc1d3bd9bb92c6c49b0bc3b5ed_images_mini.jpg',
            '150X200Xmini':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/2a7668dc1d3bd9bb92c6c49b0bc3b5ed_images_mini.jpg',
            '48X64Xmini':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/2a7668dc1d3bd9bb92c6c49b0bc3b5ed_images_mini.jpg',
            '125X161':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/2a7668dc1d3bd9bb92c6c49b0bc3b5ed_images.jpg',
            '125X161Xmini':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/2a7668dc1d3bd9bb92c6c49b0bc3b5ed_images_mini.jpg',
          },
          imageType: 'front',
        },
        right: {
          imageURL:
            'http://assets.myntassets.com/v1/images/style/properties/88a75f87f09d648d1fa453acb29195f4_images.jpg',
          resolutions: {
            '1080X1440Xmini':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/88a75f87f09d648d1fa453acb29195f4_images_mini.jpg',
            '48X64':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/88a75f87f09d648d1fa453acb29195f4_images.jpg',
            '1080X1440':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/88a75f87f09d648d1fa453acb29195f4_images.jpg',
            '150X200':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/88a75f87f09d648d1fa453acb29195f4_images.jpg',
            '360X480':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/88a75f87f09d648d1fa453acb29195f4_images.jpg',
            '180X240':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/88a75f87f09d648d1fa453acb29195f4_images.jpg',
            '360X480Xmini':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/88a75f87f09d648d1fa453acb29195f4_images_mini.jpg',
            '180X240Xmini':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/88a75f87f09d648d1fa453acb29195f4_images_mini.jpg',
            '150X200Xmini':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/88a75f87f09d648d1fa453acb29195f4_images_mini.jpg',
            '48X64Xmini':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/88a75f87f09d648d1fa453acb29195f4_images_mini.jpg',
            '125X161':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/88a75f87f09d648d1fa453acb29195f4_images.jpg',
            '125X161Xmini':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/88a75f87f09d648d1fa453acb29195f4_images_mini.jpg',
          },
          imageType: 'right',
        },
      },
    },
    {
      id: 11010,
      price: 1095,
      productDisplayName: 'Wrangler Women Smocked Yoke Purple Tops',
      brandName: 'Wrangler',
      productDescriptors: {
        description: {
          descriptorType: 'description',
          value:
            '<p><strong>Composition</strong><br /> Purple pinstriped shirt made of 100% cotton?, with a tipped collar and chest button placket, three-fourth cuff sleeves and has a curved hemline with embroidered branding on left hip<br /> <br /> <span style="font-style: normal; font-weight: bold;">Fitting<br /> </span><span style="font-style: normal; font-weight: normal;">Comfort<br /> <br /> </span><span style="font-style: normal; font-weight: bold;">Wash care<br /> </span><span style="font-style: normal; font-weight: normal;">only hand wash in cold water using a mild detergent<br /> Wash dark colours separately<br /> Do not bleach, wring or tumble dry<br /> Flat dry in shade<br /> Mild iron, and do not iron on print/embellishment/embroidery<br /> <br /> Perfect on style and great in comfort, this purple striped shirt from wrangler makes for a great semi-formal wear. The three-fourth cuff sleeves create a feel of casual comfort, while the fabric keeps you fresh and comfortable all day. Team this with formal trousers, blazer and pumps when at a meeting, or simply pair it with slim Fit jeans and heeled sandals and ooze style.<br /> <br /> </span><span style="font-style: italic; font-weight: normal;">Model statistics<br /> </span><span style="font-style: normal; font-weight: normal;">The model wears size M in shirts<br /> Height-5.7", Chest-33", Waist-26&rdquo;<br /> </span></p>',
        },
      },
      displayCategories: 'Sale and Clearance,Casual Wear',
      brandUserProfile: {
        uidx: 'b55b498e.8a78.4f5b.847d.1e76c1a0707bTQB0qVwNqO',
        bio: 'Wrangler empowers you to discover your free spirit',
        name: 'Wrangler',
        image: '../assets/fashion-dataset/images/11010.jpg',
        publicProfileId: 'Wrangler.India',
        imageJsonEntryMap: {
          '1': '{"id":17582431,"createdBy":"b55b498e.8a78.4f5b.847d.1e76c1a0707bTQB0qVwNqO","createdOn":1472711641000,"lastModifiedOn":1472711641000,"version":0,"format":"JPEG","isCompressed":false,"resolution":"720X544","aspectRatio":"45:34","viewtype":"front","client_id":4,"client_description":"video_migration_script","client_reference_id":"17582431","imgs":{"S3":{"id":30599348,"relativePath":"assets/images/2016/9/1/11472711641193-18820-apix1u.jpg","size":99643,"domain":"http://myntra.myntassets.com/","securedDomain":"https://myntrawebimages.s3.amazonaws.com/","resolutionFormula":"assets/images/2016/9/1/11472711641193-18820-apix1u_($width)_($height).jpg","path":"http://myntra.myntassets.com/assets/images/2016/9/1/11472711641193-18820-apix1u.jpg","storedUploaderType":"S3","servingUploaderType":"S3"},"CL":{"id":30599347,"relativePath":"assets/images/2016/9/1/11472711641193-18820-apix1u.jpg","size":99643,"domain":"http://assets.myntassets.com/","securedDomain":"https://secureassets.myntassets.com/","resolutionFormula":"h_($height),q_($qualityPercentage),w_($width)/v1/assets/images/2016/9/1/11472711641193-18820-apix1u.jpg","path":"http://assets.myntassets.com/assets/images/2016/9/1/11472711641193-18820-apix1u.jpg","storedUploaderType":"CL","servingUploaderType":"CL"}},"path":"assets/images/2016/9/1/11472711641193-18820-apix1u.jpg","securedDomain":"https://secureassets.myntassets.com/","domain":"http://assets.myntassets.com/","storedUploaderType":"CL","servingUploaderType":"CL","resolutionFormula":"h_($height),q_($qualityPercentage),w_($width)/v1/assets/images/2016/9/1/11472711641193-18820-apix1u.jpg"}',
          '3': 'http://assets.myntassets.com/assets/images/2016/9/1/11472711641193-18820-apix1u.jpg',
        },
        tagsMap:
          '{"roles":[],"labels":[],"myntraVerified":true,"invited":true}',
      },
      styleImages: {
        default: {
          imageURL: '../assets/fashion-dataset/images/11010.jpg',
          resolutions: {
            '1080X1440Xmini':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/acada18ae143589bc53ca71d305b2091_images_mini.jpg',
            '48X64':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/acada18ae143589bc53ca71d305b2091_images.jpg',
            '1080X1440':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/acada18ae143589bc53ca71d305b2091_images.jpg',
            '150X200':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/acada18ae143589bc53ca71d305b2091_images.jpg',
            '360X480':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/acada18ae143589bc53ca71d305b2091_images.jpg',
            '180X240':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/acada18ae143589bc53ca71d305b2091_images.jpg',
            '360X480Xmini':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/acada18ae143589bc53ca71d305b2091_images_mini.jpg',
            '180X240Xmini':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/acada18ae143589bc53ca71d305b2091_images_mini.jpg',
            '150X200Xmini':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/acada18ae143589bc53ca71d305b2091_images_mini.jpg',
            '48X64Xmini':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/acada18ae143589bc53ca71d305b2091_images_mini.jpg',
            '125X161':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/acada18ae143589bc53ca71d305b2091_images.jpg',
            '125X161Xmini':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/acada18ae143589bc53ca71d305b2091_images_mini.jpg',
          },
          imageType: 'default',
        },
        size_representation:
          'http://assets.myntassets.com/assets/images/sizechart/2016/12/14/11481690832632-Tshirts_-Women.png',
        search: {
          imageURL:
            'http://assets.myntassets.com/v1/images/style/properties/acada18ae143589bc53ca71d305b2091_images.jpg',
          resolutions: {
            '1080X1440Xmini':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/acada18ae143589bc53ca71d305b2091_images_mini.jpg',
            '48X64':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/acada18ae143589bc53ca71d305b2091_images.jpg',
            '1080X1440':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/acada18ae143589bc53ca71d305b2091_images.jpg',
            '150X200':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/acada18ae143589bc53ca71d305b2091_images.jpg',
            '360X480':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/acada18ae143589bc53ca71d305b2091_images.jpg',
            '180X240':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/acada18ae143589bc53ca71d305b2091_images.jpg',
            '360X480Xmini':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/acada18ae143589bc53ca71d305b2091_images_mini.jpg',
            '180X240Xmini':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/acada18ae143589bc53ca71d305b2091_images_mini.jpg',
            '150X200Xmini':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/acada18ae143589bc53ca71d305b2091_images_mini.jpg',
            '48X64Xmini':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/acada18ae143589bc53ca71d305b2091_images_mini.jpg',
            '125X161':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/acada18ae143589bc53ca71d305b2091_images.jpg',
            '125X161Xmini':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/acada18ae143589bc53ca71d305b2091_images_mini.jpg',
          },
          imageType: 'search',
        },
        back: {
          imageURL:
            'http://assets.myntassets.com/v1/images/style/properties/a5d50e475f7b3271b2211bbab1198894_images.jpg',
          resolutions: {
            '1080X1440Xmini':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/a5d50e475f7b3271b2211bbab1198894_images_mini.jpg',
            '48X64':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/a5d50e475f7b3271b2211bbab1198894_images.jpg',
            '1080X1440':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/a5d50e475f7b3271b2211bbab1198894_images.jpg',
            '150X200':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/a5d50e475f7b3271b2211bbab1198894_images.jpg',
            '360X480':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/a5d50e475f7b3271b2211bbab1198894_images.jpg',
            '180X240':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/a5d50e475f7b3271b2211bbab1198894_images.jpg',
            '360X480Xmini':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/a5d50e475f7b3271b2211bbab1198894_images_mini.jpg',
            '180X240Xmini':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/a5d50e475f7b3271b2211bbab1198894_images_mini.jpg',
            '150X200Xmini':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/a5d50e475f7b3271b2211bbab1198894_images_mini.jpg',
            '48X64Xmini':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/a5d50e475f7b3271b2211bbab1198894_images_mini.jpg',
            '125X161':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/a5d50e475f7b3271b2211bbab1198894_images.jpg',
            '125X161Xmini':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/a5d50e475f7b3271b2211bbab1198894_images_mini.jpg',
          },
          imageType: 'back',
        },
        left: {
          imageURL:
            'http://assets.myntassets.com/v1/images/style/properties/a94c4c018198068ba8be239bb7ced449_images.jpg',
          resolutions: {
            '1080X1440Xmini':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/a94c4c018198068ba8be239bb7ced449_images_mini.jpg',
            '48X64':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/a94c4c018198068ba8be239bb7ced449_images.jpg',
            '1080X1440':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/a94c4c018198068ba8be239bb7ced449_images.jpg',
            '150X200':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/a94c4c018198068ba8be239bb7ced449_images.jpg',
            '360X480':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/a94c4c018198068ba8be239bb7ced449_images.jpg',
            '180X240':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/a94c4c018198068ba8be239bb7ced449_images.jpg',
            '360X480Xmini':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/a94c4c018198068ba8be239bb7ced449_images_mini.jpg',
            '180X240Xmini':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/a94c4c018198068ba8be239bb7ced449_images_mini.jpg',
            '150X200Xmini':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/a94c4c018198068ba8be239bb7ced449_images_mini.jpg',
            '48X64Xmini':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/a94c4c018198068ba8be239bb7ced449_images_mini.jpg',
            '125X161':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/a94c4c018198068ba8be239bb7ced449_images.jpg',
            '125X161Xmini':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/a94c4c018198068ba8be239bb7ced449_images_mini.jpg',
          },
          imageType: 'left',
        },
        front: {
          imageURL:
            'http://assets.myntassets.com/v1/images/style/properties/440c526fdd5acb43dbb347a80c6ee899_images.jpg',
          resolutions: {
            '1080X1440Xmini':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/440c526fdd5acb43dbb347a80c6ee899_images_mini.jpg',
            '48X64':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/440c526fdd5acb43dbb347a80c6ee899_images.jpg',
            '1080X1440':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/440c526fdd5acb43dbb347a80c6ee899_images.jpg',
            '150X200':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/440c526fdd5acb43dbb347a80c6ee899_images.jpg',
            '360X480':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/440c526fdd5acb43dbb347a80c6ee899_images.jpg',
            '180X240':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/440c526fdd5acb43dbb347a80c6ee899_images.jpg',
            '360X480Xmini':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/440c526fdd5acb43dbb347a80c6ee899_images_mini.jpg',
            '180X240Xmini':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/440c526fdd5acb43dbb347a80c6ee899_images_mini.jpg',
            '150X200Xmini':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/440c526fdd5acb43dbb347a80c6ee899_images_mini.jpg',
            '48X64Xmini':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/440c526fdd5acb43dbb347a80c6ee899_images_mini.jpg',
            '125X161':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/440c526fdd5acb43dbb347a80c6ee899_images.jpg',
            '125X161Xmini':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/440c526fdd5acb43dbb347a80c6ee899_images_mini.jpg',
          },
          imageType: 'front',
        },
        right: {
          imageURL:
            'http://assets.myntassets.com/v1/images/style/properties/06552eb1e83ffd95232840185f69ddd0_images.jpg',
          resolutions: {
            '1080X1440Xmini':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/06552eb1e83ffd95232840185f69ddd0_images_mini.jpg',
            '48X64':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/06552eb1e83ffd95232840185f69ddd0_images.jpg',
            '1080X1440':
              'http://assets.myntassets.com/h_1440,q_95,w_1080/v1/images/style/properties/06552eb1e83ffd95232840185f69ddd0_images.jpg',
            '150X200':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/06552eb1e83ffd95232840185f69ddd0_images.jpg',
            '360X480':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/06552eb1e83ffd95232840185f69ddd0_images.jpg',
            '180X240':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/06552eb1e83ffd95232840185f69ddd0_images.jpg',
            '360X480Xmini':
              'http://assets.myntassets.com/h_480,q_95,w_360/v1/images/style/properties/06552eb1e83ffd95232840185f69ddd0_images_mini.jpg',
            '180X240Xmini':
              'http://assets.myntassets.com/h_240,q_95,w_180/v1/images/style/properties/06552eb1e83ffd95232840185f69ddd0_images_mini.jpg',
            '150X200Xmini':
              'http://assets.myntassets.com/h_200,q_95,w_150/v1/images/style/properties/06552eb1e83ffd95232840185f69ddd0_images_mini.jpg',
            '48X64Xmini':
              'http://assets.myntassets.com/h_64,q_95,w_48/v1/images/style/properties/06552eb1e83ffd95232840185f69ddd0_images_mini.jpg',
            '125X161':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/06552eb1e83ffd95232840185f69ddd0_images.jpg',
            '125X161Xmini':
              'http://assets.myntassets.com/h_161,q_95,w_125/v1/images/style/properties/06552eb1e83ffd95232840185f69ddd0_images_mini.jpg',
          },
          imageType: 'right',
        },
      },
    },
  ];
  constructor(private router: Router) {}
  ngOnInit() {
    this.showLoader = true;
    setTimeout(() => {
      this.finalData = [...this.details];
      this.showLoader = false;
    }, 2000);
  }

  onClickHome() {
    this.router.navigate(['']);
  }

  onClickOrders() {
    this.router.navigate(['/orders']);
  }

  onClickSearch() {
    //dummy full name search (add loader)
    this.showLoader = true;
    setTimeout(() => {
      if (this.searchItem && this.searchItem.length) {
        this.finalData = this.details.filter(
          (element) => element.productDisplayName == this.searchItem,
        );
      } else {
        this.finalData = [...this.details];
      }
      this.showLoader = false;
    }, 2000);
  }

  onClickAddToCart(_element) {
    if (_element && _element.id) {
      let existElmIndex = this.carts.findIndex(
        (_elm) => _elm.id == _element.id,
      );
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
        if (_item.quantity !== 1) {
          //min
          _item.quantity -= 1;
          this.totalQuantity--;
        }
      }
    }
  }

  onClickRemoveFromCart(_item) {
    if (_item) {
      let elmIndex = this.carts.findIndex((_elm) => _elm.id == _item.id);
      this.carts.splice(elmIndex, 1);
      if (_item.quantity) {
        this.totalQuantity = this.totalQuantity - _item.quantity;
      }
      if (!this.carts || !this.carts.length) {
        this.showCart = false;
      }
    }
  }

  getShortName(_str, _splitLength = 90) {
    let retVal = '';
    if (_str && _str.length) {
      if (_str.length > _splitLength) {
        retVal = _str.slice(0, _splitLength);
        retVal += '...';
      } else {
        retVal = _str;
      }
    }
    return retVal;
  }

  getHtmlToText(_str) {
    let retVal = '';
    if (_str && _str.length) {
      retVal = _str.replace(/<[^>]+>/g, ' ');
    }
    return retVal;
  }

  onClickBuyNow() {
    const orderId = Math.floor(100000000 + Math.random() * 900000000);
    this.router.navigate(['/orderconfirm/' + orderId.toString()]);
  }
}
