import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
  host: {
    class: 'rds-main-container',
  },
})
export class OrderComponent {
  title = 'Redis';
  titleSmall = 'Shopping';
  heading = 'Your Orders';
  orders = [
    {
      orderId: '405-9972513-8007537',
      total: '10400',
      orderDate: '01/31/2023',
      items: [
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
      ],
    },
    {
      orderId: '405-7418027-7978719',
      total: '5495',
      orderDate: '02/22/2023',
      items: [
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
      ],
    },
  ];
  lblNoData = 'No data to display!';
  constructor(private router: Router) {}
  onClickHome() {
    this.router.navigate(['']);
  }
}
