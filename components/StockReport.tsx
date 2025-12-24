
import React from 'react';
import { Medicine } from '../types';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface Props {
  medicines: Medicine[];
}

const StockReport: React.FC<Props> = ({ medicines }) => {
  const lowStock = medicines.filter(m => m.stock < 10);
  const criticalStock = medicines.filter(m => m.stock < 5);
  const healthyStock = medicines.filter(m => m.stock >= 10);
  
  // Checking expiry dates (rough check)
  const today = new Date();
  const nearExpiry = medicines.filter(m => {
    const exp = new Date(m.expiryDate);
    const monthsDiff = (exp.getFullYear() - today.getFullYear()) * 12 + (exp.getMonth() - today.getMonth());
    return monthsDiff <= 3;
  });

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm">
           <div className="flex items-center gap-3 mb-4">
             <div className="p-2 bg-red-50 text-red-500 rounded-lg">
               <AlertCircle />
             </div>
             <h3 className="font-bold text-gray-800">Critical Stock</h3>
           </div>
           <p className="text-3xl font-black text-red-600">{criticalStock.length}</p>
           <p className="text-sm text-gray-500 mt-2">Less than 5 units left</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-amber-100 shadow-sm">
           <div className="flex items-center gap-3 mb-4">
             <div className="p-2 bg-amber-50 text-amber-500 rounded-lg">
               <Clock />
             </div>
             <h3 className="font-bold text-gray-800">Near Expiry</h3>
           </div>
           <p className="text-3xl font-black text-amber-600">{nearExpiry.length}</p>
           <p className="text-sm text-gray-500 mt-2">Expires within 3 months</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">
           <div className="flex items-center gap-3 mb-4">
             <div className="p-2 bg-emerald-50 text-emerald-500 rounded-lg">
               <CheckCircle />
             </div>
             <h3 className="font-bold text-gray-800">Healthy Stock</h3>
           </div>
           <p className="text-3xl font-black text-emerald-600">{healthyStock.length}</p>
           <p className="text-sm text-gray-500 mt-2">Inventory is stable</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-800">Stock Reorder List</h2>
          <p className="text-sm text-gray-500">Items requiring immediate attention</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
             <thead className="bg-gray-100/50 text-gray-400 text-[10px] font-bold uppercase tracking-wider">
               <tr>
                 <th className="px-6 py-4">Medicine</th>
                 <th className="px-6 py-4">Current Stock</th>
                 <th className="px-6 py-4">Status</th>
                 <th className="px-6 py-4">Expiry Date</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-gray-100 text-sm">
               {[...criticalStock, ...lowStock, ...nearExpiry].length > 0 ? (
                 Array.from(new Set([...criticalStock, ...lowStock, ...nearExpiry])).map(med => (
                   <tr key={med.id}>
                     <td className="px-6 py-4">
                       <p className="font-bold text-gray-800">{med.name}</p>
                       <p className="text-xs text-gray-400">{med.genericName}</p>
                     </td>
                     <td className="px-6 py-4 font-bold">{med.stock} units</td>
                     <td className="px-6 py-4">
                        {med.stock < 5 ? (
                          <span className="px-2 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-bold uppercase">Critical</span>
                        ) : med.stock < 10 ? (
                          <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold uppercase">Reorder</span>
                        ) : (
                          <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold uppercase">OK</span>
                        )}
                     </td>
                     <td className="px-6 py-4 text-gray-500 font-mono">{med.expiryDate}</td>
                   </tr>
                 ))
               ) : (
                 <tr>
                   <td colSpan={4} className="px-6 py-12 text-center text-gray-400 italic">No items require reordering</td>
                 </tr>
               )}
             </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StockReport;
