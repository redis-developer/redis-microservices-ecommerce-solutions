declare namespace models {
  interface Alert {
    message: string;
  }
  interface CartItem {
    product: Product;
    quantity: number;
  }
  interface OrderItem {
    productId: number;
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
    id: number;
    price: number;
    productDisplayName: string;
    variantName: string;
    brandName: string;
    ageGroup: string;
    gender: string;
    displayCategories: string;
    styleImages: {
      default: {
        imageURL: string;
      };
    };
    productDescriptors: {
      description: {
        value: string;
      };
    };
  }
}
