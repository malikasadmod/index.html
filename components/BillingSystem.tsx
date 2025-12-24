
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Minus, 
  Trash2, 
  Search, 
  User, 
  CreditCard, 
  CheckCircle2, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { AppState, Bill, BillItem, Medicine } from '../types';
import { storageService } from '../services/storage';

interface Props {
  state: AppState;
  onBillComplete: (bill: Bill, newMeds: Medicine[]) => void;
}

const BillingSystem: React.FC<Props> = ({ state, onBillComplete }) => {
  const [items, setItems] = useState<BillItem[]>([]);
  const [customerName, setCustomerName] = useState('Walk-in Customer');
  const [customerPhone, setCustomerPhone] = useState('');
  const [cashReceived, setCashReceived] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMeds = useMemo(() => 
    state.medicines.filter(m => 
      m.stock > 0 && 
      (m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
       m.genericName?.toLowerCase().includes(searchTerm.toLowerCase()))
    ).slice(0, 8),
  [state.medicines, searchTerm]);

  const total = useMemo(() => items.reduce((acc, item) => acc + item.subtotal, 0), [items]);
  const balance = useMemo(() => Math.max(0, cashReceived - total), [cashReceived, total]);

  const addItem = (med: Medicine) => {
    const existing = items.find(i => i.medicineId === med.id);
    if (existing) {
      if (existing.quantity >= med.stock) {
        alert('Not enough stock!');
        return;
      }
      updateQuantity(med.id, existing.quantity + 1);
    } else {
      setItems([...items, {
        medicineId: med.id,
        name: med.name,
        quantity: 1,
        unitPrice: med.price,
        subtotal: med.price
      }]);
    }
    setSearchTerm('');
  };

  const updateQuantity = (id: string, qty: number) => {
    const med = state.medicines.find(m => m.id === id);
    if (!med || qty <= 0) return;
    if (qty > med.stock) {
      alert(`Only ${med.stock} units available!`);
      return;
    }

    setItems(items.map(item => 
      item.medicineId === id 
        ? { ...item, quantity: qty, subtotal: qty * item.unitPrice } 
        : item
    ));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(i => i.medicineId !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    if (cashReceived < total) {
      alert('Received amount is less than total!');
      return;
    }

    const bill: Bill = {
      billNo: storageService.generateBillNo(state.bills),
      date: new Date().toISOString(),
      customerId: 'WALK-IN',
      customerName,
      items,
      total,
      cashReceived,
      balance
    };

    // Update stock levels
    const newMeds = state.medicines.map(m => {
      const soldItem = items.find(i => i.medicineId === m.id);
      if (soldItem) {
        return { ...m, stock: m.stock - soldItem.quantity };
      }
      return m;
    });

    onBillComplete(bill, newMeds);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left side: Billing Form */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
           <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <CreditCard size={24} className="text-emerald-600" />
                Point of Sale
              </h2>
              <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                <Calendar size={16} />
                {new Date().toLocaleDateString()}
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Customer Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Walking Customer"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Phone Number</label>
                <input 
                  type="text"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Optional"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
              </div>
           </div>

           <div className="relative mb-8">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Select Medicine</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text"
                  className="w-full pl-10 pr-4 py-3 bg-emerald-50 border border-emerald-100 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-medium placeholder:text-emerald-300"
                  placeholder="Search and add medicines..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {searchTerm && filteredMeds.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl max-h-64 overflow-y-auto">
                  {filteredMeds.map(med => (
                    <button 
                      key={med.id}
                      onClick={() => addItem(med)}
                      className="w-full flex items-center justify-between p-4 hover:bg-emerald-50 text-left transition-colors border-b border-gray-50 last:border-0"
                    >
                      <div>
                        <p className="font-bold text-gray-800">{med.name}</p>
                        <p className="text-xs text-gray-500">{med.genericName} • Stock: {med.stock}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-emerald-600">${med.price.toFixed(2)}</p>
                        <p className="text-[10px] text-gray-400 uppercase font-bold">{med.category}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
           </div>

           {/* Items Table */}
           <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                <table className="w-full text-left">
                  <thead className="text-[10px] font-bold text-gray-400 uppercase bg-gray-100">
                    <tr>
                      <th className="px-4 py-3">Product</th>
                      <th className="px-4 py-3 text-center">Qty</th>
                      <th className="px-4 py-3 text-right">Price</th>
                      <th className="px-4 py-3 text-right">Total</th>
                      <th className="px-4 py-3 text-center">#</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-gray-100">
                    {items.length > 0 ? items.map(item => (
                      <tr key={item.medicineId} className="bg-white">
                        <td className="px-4 py-3 font-semibold">{item.name}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-3">
                            <button 
                              onClick={() => updateQuantity(item.medicineId, item.quantity - 1)}
                              className="p-1 text-gray-400 hover:text-emerald-600"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-8 text-center font-bold">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.medicineId, item.quantity + 1)}
                              className="p-1 text-gray-400 hover:text-emerald-600"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right text-gray-500">${item.unitPrice.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right font-bold text-gray-800">${item.subtotal.toFixed(2)}</td>
                        <td className="px-4 py-3 text-center">
                          <button 
                            onClick={() => removeItem(item.medicineId)}
                            className="p-2 text-red-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={5} className="px-4 py-12 text-center text-gray-400 italic">
                          No items added to bill yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
           </div>
        </div>
      </div>

      {/* Right side: Payment Summary */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
           <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
             <CheckCircle2 size={20} className="text-emerald-500" />
             Payment Summary
           </h3>

           <div className="space-y-4 flex-1">
              <div className="flex justify-between items-center text-gray-600">
                <span>Subtotal</span>
                <span className="font-semibold">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-gray-600">
                <span>Tax (0%)</span>
                <span className="font-semibold">$0.00</span>
              </div>
              <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Grand Total</span>
                <span className="text-2xl font-black text-emerald-600">${total.toFixed(2)}</span>
              </div>

              <div className="pt-6 space-y-4">
                 <div>
                    <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Cash Received</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                      <input 
                        type="number"
                        className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xl font-bold outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800"
                        value={cashReceived}
                        onChange={(e) => setCashReceived(Number(e.target.value))}
                      />
                    </div>
                 </div>

                 <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-emerald-600 uppercase">Return Balance</p>
                      <p className="text-2xl font-black text-emerald-700">${balance.toFixed(2)}</p>
                    </div>
                    <CreditCard className="text-emerald-300" size={32} />
                 </div>
              </div>
           </div>

           <button 
             disabled={items.length === 0 || cashReceived < total}
             onClick={handleSubmit}
             className="w-full mt-8 py-4 bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-emerald-700 text-white rounded-xl font-bold text-lg shadow-xl shadow-emerald-600/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
           >
             Complete Transaction
             <CheckCircle2 size={22} />
           </button>
           
           <div className="mt-4 flex items-center gap-2 text-[10px] text-gray-400 font-medium">
             <AlertCircle size={14} />
             NOTE: Transaction will be saved to local storage (.txt simulation)
           </div>
        </div>
      </div>
    </div>
  );
};

export default BillingSystem;
