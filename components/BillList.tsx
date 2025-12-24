
import React from 'react';
import { Bill } from '../types';
import { Search, Printer, FileText, ChevronRight, X, Mail, Phone, MapPin } from 'lucide-react';

interface Props {
  bills: Bill[];
  selectedBill: Bill | null;
  onSelectBill: (bill: Bill | null) => void;
}

const BillList: React.FC<Props> = ({ bills, selectedBill, onSelectBill }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
         <div>
          <h2 className="text-xl font-bold text-gray-800">Invoices & Receipts</h2>
          <p className="text-sm text-gray-500">History of all transactions</p>
        </div>
        <div className="relative w-full md:w-64">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
           <input 
             placeholder="Search by Bill No..."
             className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm"
           />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
        {/* Invoice List */}
        <div className={`lg:col-span-4 space-y-3 no-print ${selectedBill ? 'hidden lg:block' : ''}`}>
           {bills.length > 0 ? bills.map(bill => (
             <button 
               key={bill.billNo}
               onClick={() => onSelectBill(bill)}
               className={`w-full text-left p-4 rounded-2xl border transition-all ${
                 selectedBill?.billNo === bill.billNo 
                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-600/20' 
                  : 'bg-white border-gray-100 hover:border-emerald-200 text-gray-700'
               }`}
             >
               <div className="flex justify-between items-start mb-1">
                 <span className="font-bold">{bill.billNo}</span>
                 <span className={`text-[10px] font-bold uppercase ${selectedBill?.billNo === bill.billNo ? 'text-emerald-100' : 'text-gray-400'}`}>
                   {new Date(bill.date).toLocaleDateString()}
                 </span>
               </div>
               <p className={`text-sm ${selectedBill?.billNo === bill.billNo ? 'text-emerald-50' : 'text-gray-500'}`}>{bill.customerName}</p>
               <div className="mt-3 flex justify-between items-center">
                 <span className="text-lg font-black">${bill.total.toFixed(2)}</span>
                 <ChevronRight size={18} className={selectedBill?.billNo === bill.billNo ? 'opacity-100' : 'opacity-20'} />
               </div>
             </button>
           )) : (
             <div className="p-8 text-center text-gray-400 bg-white rounded-2xl border border-gray-100 italic">
               No invoices found
             </div>
           )}
        </div>

        {/* Invoice Detail / Print View */}
        <div className={`lg:col-span-8 ${selectedBill ? 'block' : 'hidden lg:flex items-center justify-center bg-gray-100/50 rounded-2xl border-2 border-dashed border-gray-200'} no-print`}>
          {selectedBill ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-0">
               <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                 <div className="flex items-center gap-2">
                   <button onClick={() => onSelectBill(null)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
                     <X size={18} />
                   </button>
                   <span className="font-bold text-gray-800">Invoice Details</span>
                 </div>
                 <button 
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-xl font-bold text-sm hover:bg-slate-900 transition-colors"
                 >
                   <Printer size={18} />
                   Print Invoice
                 </button>
               </div>
               
               {/* Actual Receipt Content (Styled for print) */}
               <div className="p-8 max-h-[70vh] overflow-y-auto">
                 <ReceiptContent bill={selectedBill} />
               </div>
            </div>
          ) : (
            <div className="text-center text-gray-400 space-y-4">
              <FileText size={64} className="mx-auto opacity-10" />
              <p className="font-medium">Select an invoice to view details</p>
            </div>
          )}
        </div>

        {/* Print Only Section */}
        {selectedBill && (
          <div className="print-only fixed inset-0 bg-white z-[9999] p-10 text-black">
            <ReceiptContent bill={selectedBill} />
            <div className="mt-12 text-center text-xs text-gray-400 border-t pt-4">
               Software provided by Khan Medical Complex Management System
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ReceiptContent = ({ bill }: { bill: Bill }) => (
  <div className="max-w-2xl mx-auto">
    <div className="text-center mb-10">
      <h1 className="text-3xl font-black text-emerald-600 mb-1">KHAN MEDICAL COMPLEX</h1>
      <p className="text-sm text-gray-500 flex items-center justify-center gap-4">
        <span className="flex items-center gap-1"><MapPin size={12} /> Peshawar Road, Main Market</span>
        <span className="flex items-center gap-1"><Phone size={12} /> +92 123 4567890</span>
      </p>
      <div className="mt-6 flex items-center justify-center gap-2">
        <span className="h-[1px] w-12 bg-gray-200"></span>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Official Receipt</span>
        <span className="h-[1px] w-12 bg-gray-200"></span>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-8 mb-10 pb-8 border-b border-gray-100">
      <div className="space-y-1">
        <p className="text-[10px] font-bold text-gray-400 uppercase">Billed To</p>
        <p className="font-bold text-gray-800 text-lg">{bill.customerName}</p>
        <p className="text-sm text-gray-500">Walk-in Customer ID: {bill.customerId}</p>
      </div>
      <div className="text-right space-y-1">
        <p className="text-[10px] font-bold text-gray-400 uppercase">Invoice Info</p>
        <p className="font-bold text-gray-800 text-lg">{bill.billNo}</p>
        <p className="text-sm text-gray-500">{new Date(bill.date).toLocaleString()}</p>
      </div>
    </div>

    <table className="w-full text-left mb-10">
      <thead>
        <tr className="text-[10px] font-bold text-gray-400 uppercase border-b border-gray-100">
          <th className="py-3">Medicine Description</th>
          <th className="py-3 text-center">Qty</th>
          <th className="py-3 text-right">Rate</th>
          <th className="py-3 text-right">Amount</th>
        </tr>
      </thead>
      <tbody className="text-sm divide-y divide-gray-50">
        {bill.items.map((item, idx) => (
          <tr key={idx}>
            <td className="py-4 font-medium text-gray-700">{item.name}</td>
            <td className="py-4 text-center">{item.quantity}</td>
            <td className="py-4 text-right">${item.unitPrice.toFixed(2)}</td>
            <td className="py-4 text-right font-bold">${item.subtotal.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>

    <div className="max-w-[240px] ml-auto space-y-3">
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-500">Subtotal</span>
        <span className="font-semibold text-gray-800">${bill.total.toFixed(2)}</span>
      </div>
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-500">Tax</span>
        <span className="font-semibold text-gray-800">$0.00</span>
      </div>
      <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
        <span className="text-lg font-black text-gray-900">Total Due</span>
        <span className="text-2xl font-black text-emerald-600">${bill.total.toFixed(2)}</span>
      </div>
      
      <div className="pt-8 space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-400">Cash Received</span>
          <span className="font-bold text-gray-600">${bill.cashReceived.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-400">Change Returned</span>
          <span className="font-bold text-emerald-600">${bill.balance.toFixed(2)}</span>
        </div>
      </div>
    </div>

    <div className="mt-20 flex flex-col items-center">
      <div className="w-32 h-1 bg-gray-100 mb-2"></div>
      <p className="text-[10px] font-bold text-gray-400 uppercase">Authorized Signature</p>
      <p className="mt-6 text-sm italic text-gray-500">"May you have a speedy recovery!"</p>
    </div>
  </div>
);

export default BillList;
