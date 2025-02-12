export interface Product {
  id: string;
  name: string;
  category: 'vegetables' | 'groceries';
  price: number;
  image: string;
  unit: string;
  discount: number;
  pin: string;
  min: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  name: string;
  phone: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  }
  manualLoc: string;
};

export interface Users{
  id: string;
  name: string;
  phone: string;
  location: {
    latitude: number;
    longitude: number;
  };
  manualLoc: string;
  createdAt?: Date;
}