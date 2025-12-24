
import React from 'react';
import { 
  TrendingUp, 
  Package, 
  AlertTriangle, 
  ShoppingCart, 
  PlusCircle, 
  Search, 
  History,
  Truck,
  BarChart3
} from 'lucide-react';
import { AppState, ViewType } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  state: AppState;
  onNavigate: (view: ViewType) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ state, onNavigate }) => {
  const totalSales = state.bills.reduce((acc, b) => acc + b.total, 0);
  const lowStockCount = state.medicines.filter(m => m.stock < 10).length;
  const totalMeds = state.medicines.length;
  const recentBills = state.bills.slice(0, 5);

  // Simple chart data from last few bills
  const chartData = state.bills.slice(-7).map(b => ({
    name: b.billNo.split('-').pop(),
    amount: b.total
  }));

  return (
    <div className="space-y-8 pb-10">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Sales" 
          value={`$${totalSales.toLocaleString()}`} 
          icon={<TrendingUp className="text-emerald-500" />} 
          trend="+12% from last month"
          color="emerald"
        />
        <StatCard 
          label="Medicines" 
          value={totalMeds.toString()} 
          icon={<Package className="text-blue-500" />} 
          trend={`${state.suppliers.length} Active Suppliers`}
          color="blue"
        />
        <StatCard 
          label="Low Stock Alert" 
          value={lowStockCount.toString()} 
          icon={<AlertTriangle className="text-amber-500" />} 
          trend="Action required immediately"
          color="amber"
          isAlert={lowStockCount > 0}
        />
        <StatCard 
          label="Transactions" 
          value={state.bills.length.toString()} 
          icon={<ShoppingCart className="text-purple-500" />} 
          trend="Total invoices generated"
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-emerald-500" />
            Recent Sales Performance
          </h3>
          <div className="h-[300px] w-full">
            {chartData.length > 0 ? (
               <ResponsiveContainer width="100%" height="100%">
               <BarChart data={chartData}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                 <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                 <Tooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} 
                    cursor={{fill: '#f8fafc'}}
                 />
                 <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
               </BarChart>
             </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <History size={48} className="mb-2 opacity-20" />
                <p>No sales data to visualize yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <PlusCircle size={20} className="text-blue-500" />
            Quick Actions
          </h3>
          <div className="space-y-3">
            <ActionButton 
              icon={<PlusCircle size={20} />} 
              label="Generate New Bill" 
              color="bg-emerald-600" 
              onClick={() => onNavigate(ViewType.CREATE_BILL)}
            />
            <ActionButton 
              icon={<Package size={20} />} 
              label="Add Medicine" 
              color="bg-blue-600" 
              onClick={() => onNavigate(ViewType.MEDICINES)}
            />
            <ActionButton 
              icon={<Truck size={20} />} 
              label="Manage Suppliers" 
              color="bg-indigo-600" 
              onClick={() => onNavigate(ViewType.SUPPLIERS)}
            />
            <ActionButton 
              icon={<BarChart3 size={20} />} 
              label="View Inventory Report" 
              color="bg-slate-700" 
              onClick={() => onNavigate(ViewType.STOCK)}
            />
          </div>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800">Recent Transactions</h3>
          <button 
            onClick={() => onNavigate(ViewType.VIEW_BILLS)}
            className="text-emerald-600 text-sm font-semibold hover:underline"
          >
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Bill No</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {recentBills.length > 0 ? recentBills.map(bill => (
                <tr key={bill.billNo} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-emerald-700">{bill.billNo}</td>
                  <td className="px-6 py-4">{bill.customerName}</td>
                  <td className="px-6 py-4 text-gray-500">{new Date(bill.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right font-semibold">${bill.total.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">Paid (Cash)</span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon, trend, color, isAlert = false }: any) => (
  <div className={`bg-white p-6 rounded-2xl shadow-sm border ${isAlert ? 'border-amber-200 bg-amber-50/30' : 'border-gray-100'} hover:shadow-md transition-shadow`}>
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl bg-${color}-50`}>
        {icon}
      </div>
      {isAlert && <span className="animate-pulse flex h-2 w-2 rounded-full bg-amber-500"></span>}
    </div>
    <div className="space-y-1">
      <p className="text-gray-500 text-sm font-medium">{label}</p>
      <h4 className="text-2xl font-bold text-gray-900">{value}</h4>
    </div>
    <p className="text-xs text-gray-400 mt-3 flex items-center gap-1 font-medium italic">
      {trend}
    </p>
  </div>
);

const ActionButton = ({ icon, label, color, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 p-4 ${color} text-white rounded-xl shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] font-semibold text-sm`}
  >
    {icon}
    {label}
  </button>
);

export default Dashboard;
