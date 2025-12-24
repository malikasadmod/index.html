
import { AppState, Medicine, Supplier, Customer, Bill } from '../types';

const STORAGE_KEY = 'KHAN_MEDICAL_DATA';

const initialData: AppState = {
  medicines: [],
  suppliers: [],
  customers: [],
  bills: [],
  user: null
};

export const storageService = {
  saveData: (data: AppState) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },

  loadData: (): AppState => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return initialData;
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse storage data", e);
      return initialData;
    }
  },

  clearData: () => {
    localStorage.removeItem(STORAGE_KEY);
  },

  generateBillNo: (bills: Bill[]): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const prefix = `BILL-${year}-${month}-`;
    
    const count = bills.filter(b => b.billNo.startsWith(prefix)).length + 1;
    return `${prefix}${String(count).padStart(3, '0')}`;
  }
};
