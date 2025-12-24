
import React, { useState, useEffect, useCallback } from 'react';
import { 
  LayoutDashboard, 
  Pill, 
  ShoppingCart, 
  FileText, 
  BarChart3, 
  Users, 
  Truck, 
  PlusCircle, 
  LogOut,
  Receipt,
  Search,
  PackageCheck
} from 'lucide-react';
import { AppState, ViewType, Medicine, Supplier, Customer, Bill } from './types';
import { storageService } from './services/storage';

// Component Imports
import Dashboard from './components/Dashboard';
import MedicineManager from './components/MedicineManager';
import SupplierManager from './components/SupplierManager';
import CustomerManager from './components/CustomerManager';
import BillingSystem from './components/BillingSystem';
import BillList from './components/BillList';
import StockReport from './components/StockReport';
import SalesReport from './components/SalesReport';
import Login from './components/Login';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(storageService.loadData());
  const [currentView, setCurrentView] = useState<ViewType>(ViewType.DASHBOARD);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);

  // Persistence effect
  useEffect(() => {
    storageService.saveData(state);
  }, [state]);

  const handleLogin = (username: string) => {
    setState(prev => ({ ...prev, user: { username, isLoggedIn: true } }));
  };

  const handleLogout = () => {
    setState(prev => ({ ...prev, user: null }));
    setCurrentView(ViewType.DASHBOARD);
  };

  const updateState = <K extends keyof AppState>(key: K, value: AppState[K]) => {
    setState(prev => ({ ...prev, [key]: value }));
  };

  if (!state.user?.isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  const renderView = () => {
    switch (currentView) {
      case ViewType.DASHBOARD:
        return <Dashboard state={state} onNavigate={setCurrentView} />;
      case ViewType.MEDICINES:
        return <MedicineManager 
          medicines={state.medicines} 
          suppliers={state.suppliers}
          onUpdate={(m) => updateState('medicines', m)} 
        />;
      case ViewType.SUPPLIERS:
        return <SupplierManager 
          suppliers={state.suppliers} 
          onUpdate={(s) => updateState('suppliers', s)} 
        />;
      case ViewType.CUSTOMERS:
        return <CustomerManager 
          customers={state.customers} 
          onUpdate={(c) => updateState('customers', c)} 
        />;
      case ViewType.CREATE_BILL:
        return <BillingSystem 
          state={state}
          onBillComplete={(bill, newMedicines) => {
            setState(prev => ({
              ...prev,
              bills: [bill, ...prev.bills],
              medicines: newMedicines
            }));
            setSelectedBill(bill);
            setCurrentView(ViewType.VIEW_BILLS);
          }}
        />;
      case ViewType.VIEW_BILLS:
        return <BillList 
          bills={state.bills} 
          selectedBill={selectedBill}
          onSelectBill={setSelectedBill}
        />;
      case ViewType.STOCK:
        return <StockReport medicines={state.medicines} />;
      case ViewType.REPORTS:
        return <SalesReport bills={state.bills} />;
      default:
        return <Dashboard state={state} onNavigate={setCurrentView} />;
    }
  };

  const menuItems = [
    { id: ViewType.DASHBOARD, label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: ViewType.CREATE_BILL, label: 'New Bill', icon: <PlusCircle size={20} /> },
    { id: ViewType.MEDICINES, label: 'Inventory', icon: <Pill size={20} /> },
    { id: ViewType.VIEW_BILLS, label: 'Invoices', icon: <Receipt size={20} /> },
    { id: ViewType.STOCK, label: 'Stock Levels', icon: <PackageCheck size={20} /> },
    { id: ViewType.REPORTS, label: 'Reports', icon: <BarChart3 size={20} /> },
    { id: ViewType.SUPPLIERS, label: 'Suppliers', icon: <Truck size={20} /> },
    { id: ViewType.CUSTOMERS, label: 'Customers', icon: <Users size={20} /> },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-800">
      {/* Sidebar - Hidden on mobile, shown via menu button later */}
      <aside className="w-64 bg-slate-900 text-white flex-shrink-0 hidden md:flex flex-col border-r border-slate-800">
        <div className="p-6">
          <h1 className="text-xl font-bold text-emerald-400 flex items-center gap-2">
            <LayoutDashboard />
            KMC Manager
          </h1>
          <p className="text-xs text-slate-400 mt-1">Khan Medical Complex</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentView(item.id);
                setSelectedBill(null);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                currentView === item.id 
                  ? 'bg-emerald-600 text-white' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-10 no-print">
          <div className="flex items-center gap-4">
             {/* Mobile Menu Button can go here */}
             <h2 className="text-lg font-semibold text-gray-700">
               {menuItems.find(i => i.id === currentView)?.label}
             </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-sm font-medium text-gray-900 capitalize">{state.user?.username}</span>
              <span className="text-xs text-gray-500">Administrator</span>
            </div>
            <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold border border-emerald-200">
              {state.user?.username.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Viewport */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto h-full">
            {renderView()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
