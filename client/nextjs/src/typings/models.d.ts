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
  }
}
