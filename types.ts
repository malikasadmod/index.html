
export interface Medicine {
  id: string;
  name: string;
  genericName?: string;
  category: string;
  price: number;
  costPrice: number;
  stock: number;
  expiryDate: string;
  supplierId: string;
}

export interface Supplier {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address?: string;
}

export interface BillItem {
  medicineId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Bill {
  billNo: string;
  date: string;
  customerId: string;
  customerName: string;
  items: BillItem[];
  total: number;
  cashReceived: number;
  balance: number;
}

export interface AppState {
  medicines: Medicine[];
  suppliers: Supplier[];
  customers: Customer[];
  bills: Bill[];
  user: {
    username: string;
    isLoggedIn: boolean;
  } | null;
}

export enum ViewType {
  DASHBOARD = 'DASHBOARD',
  MEDICINES = 'MEDICINES',
  PURCHASE = 'PURCHASE',
  SALES = 'SALES',
  STOCK = 'STOCK',
  REPORTS = 'REPORTS',
  SUPPLIERS = 'SUPPLIERS',
  CUSTOMERS = 'CUSTOMERS',
  CREATE_BILL = 'CREATE_BILL',
  VIEW_BILLS = 'VIEW_BILLS'
}
