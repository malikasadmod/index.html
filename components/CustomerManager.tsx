
import React, { useState } from 'react';
import { Customer } from '../types';
import { Plus, Trash2, Edit2, Search, User, X } from 'lucide-react';

interface Props {
  customers: Customer[];
  onUpdate: (c: Customer[]) => void;
}

const CustomerManager: React.FC<Props> = ({ customers, onUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Customer>>({ name: '', phone: '', address: '' });
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCustomer: Customer = {
      id: editingId || `CUS-${Date.now()}`,
      name: formData.name || '',
      phone: formData.phone || '',
      address: formData.address || ''
    };

    if (editingId) {
      onUpdate(customers.map(c => c.id === editingId ? newCustomer : c));
    } else {
      onUpdate([...customers, newCustomer]);
    }
    closeModal();
  };

  const openModal = (c?: Customer) => {
    if (c) {
      setEditingId(c.id);
      setFormData(c);
    } else {
      setEditingId(null);
      setFormData({ name: '', phone: '', address: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Customer Records</h2>
          <p className="text-sm text-gray-500">Registered patients and customers</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-600/20"
        >
          <Plus size={20} /> Add Customer
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4">Customer Name</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4">Address</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {customers.length > 0 ? customers.map(c => (
              <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-bold text-gray-800 flex items-center gap-3">
                   <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                     {c.name.charAt(0)}
                   </div>
                   {c.name}
                </td>
                <td className="px-6 py-4 text-gray-600">{c.phone}</td>
                <td className="px-6 py-4 text-gray-500 text-xs italic">{c.address}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => openModal(c)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit2 size={16}/></button>
                    <button onClick={() => onUpdate(customers.filter(x => x.id !== c.id))} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16}/></button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-400 italic">No customers registered</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in slide-in-from-bottom-4 duration-200">
             <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-xl font-bold">{editingId ? 'Edit Customer' : 'Add Customer'}</h3>
                <button onClick={closeModal}><X/></button>
             </div>
             <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <input required placeholder="Customer Name" className="w-full px-4 py-2.5 border rounded-xl" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                <input required placeholder="Phone Number" className="w-full px-4 py-2.5 border rounded-xl" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                <textarea placeholder="Address Details" className="w-full px-4 py-2.5 border rounded-xl h-24" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold">
                   {editingId ? 'Save Changes' : 'Register Customer'}
                </button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerManager;
