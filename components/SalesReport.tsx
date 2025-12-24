
import React from 'react';
import { Bill } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Calendar, DollarSign, Receipt, ShoppingBag } from 'lucide-react';

interface Props {
  bills: Bill[];
}

const SalesReport: React.FC<Props> = ({ bills }) => {
  const totalRevenue = bills.reduce((acc, b) => acc + b.total, 0);
  const avgTicket = bills.length > 0 ? totalRevenue / bills.length : 0;
  
  // Aggregate data for chart (by date)
  const dailySales = bills.reduce((acc: any, b) => {
    const date = new Date(b.date).toLocaleDateString();
    acc[date] = (acc[date] || 0) + b.total;
    return acc;
  }, {});

  const chartData = Object.keys(dailySales).map(date => ({
    name: date,
    amount: dailySales[date]
  })).slice(-10);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-emerald-600 p-6 rounded-2xl text-white shadow-lg shadow-emerald-600/20">
          <DollarSign className="mb-4 opacity-50" size={32} />
          <p className="text-emerald-100 text-xs font-bold uppercase tracking-wider">Total Sales Revenue</p>
          <h3 className="text-3xl font-black">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <Receipt className="mb-4 text-gray-300" size={32} />
          <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Invoices Generated</p>
          <h3 className="text-3xl font-black text-gray-800">{bills.length}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <ShoppingBag className="mb-4 text-gray-300" size={32} />
          <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Avg. Transaction Value</p>
          <h3 className="text-3xl font-black text-gray-800">${avgTicket.toFixed(2)}</h3>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-bold text-gray-800">Sales Trends (Last 10 Days)</h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
             <Calendar size={16} />
             Live Analytics
          </div>
        </div>
        <div className="h-[400px]">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} 
                />
                <Line type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={4} dot={{fill: '#10b981', strokeWidth: 2, r: 4}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-300 italic">
               Insufficient data for trending
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesReport;
