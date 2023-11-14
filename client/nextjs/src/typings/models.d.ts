declare namespace models {
  interface Alert {
    message: string;
  }
  interface CartItem {
    product: Product;
    quantity: number;
  }
  interface OrderItem {
    productId: string;
    qty: number;
    productPrice: number;
    productData: Product;
  }

  interface Order {
    orderId: number;
    userId: number;
    orderStatusCode: number;
    products: OrderItem[];
    createdOn: string;
    createdBy: string;
    lastUpdateOn: string;
    lastUpdateBy: string;
  }

  interface Product {
    productId: string;
    price: number;
    productDisplayName: string;
    variantName: string;
    brandName: string;
    ageGroup: string;
    gender: string;
    displayCategories: string;
    styleImages_default_imageURL: string;
    productDescriptors_description_value: string;
    stockQty: number;

    storeId?: string;
    storeName?: string;
    distInMiles?: string;

  }

  interface ZipCode {
    zipCode?: number;
    zipLocation?: {
      latitude?: number;
      longitude?: number;
    },
    statusCode?: number
  }
}

//------

interface ListItem {
  id: string | number;
  text: string;
  value: any;
}