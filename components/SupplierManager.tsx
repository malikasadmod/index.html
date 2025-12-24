
import React, { useState } from 'react';
import { Supplier } from '../types';
import { Plus, Trash2, Edit2, Search, Truck, X } from 'lucide-react';

interface Props {
  suppliers: Supplier[];
  onUpdate: (s: Supplier[]) => void;
}

const SupplierManager: React.FC<Props> = ({ suppliers, onUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Supplier>>({ name: '', phone: '', email: '', address: '' });
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSupplier: Supplier = {
      id: editingId || `SUP-${Date.now()}`,
      name: formData.name || '',
      phone: formData.phone || '',
      email: formData.email || '',
      address: formData.address || ''
    };

    if (editingId) {
      onUpdate(suppliers.map(s => s.id === editingId ? newSupplier : s));
    } else {
      onUpdate([...suppliers, newSupplier]);
    }
    closeModal();
  };

  const openModal = (s?: Supplier) => {
    if (s) {
      setEditingId(s.id);
      setFormData(s);
    } else {
      setEditingId(null);
      setFormData({ name: '', phone: '', email: '', address: '' });
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
          <h2 className="text-xl font-bold text-gray-800">Supplier Management</h2>
          <p className="text-sm text-gray-500">Authorized medical distributors</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-600/20"
        >
          <Plus size={20} /> Add Supplier
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suppliers.length > 0 ? suppliers.map(s => (
          <div key={s.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative group hover:border-indigo-200 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                <Truck size={24} />
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openModal(s)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit2 size={16}/></button>
                <button onClick={() => onUpdate(suppliers.filter(x => x.id !== s.id))} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16}/></button>
              </div>
            </div>
            <h3 className="font-bold text-gray-800 text-lg">{s.name}</h3>
            <div className="mt-4 space-y-2 text-sm text-gray-500">
              <p className="flex items-center gap-2"><strong>PH:</strong> {s.phone}</p>
              <p className="flex items-center gap-2"><strong>EM:</strong> {s.email}</p>
              <p className="text-xs italic">{s.address}</p>
            </div>
          </div>
        )) : (
          <div className="col-span-full p-12 bg-white rounded-2xl border border-dashed border-gray-200 text-center text-gray-400">
             No suppliers registered yet
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-bold">{editingId ? 'Edit Supplier' : 'Add Supplier'}</h3>
              <button onClick={closeModal}><X/></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-4">
                <input required placeholder="Supplier Name" className="w-full px-4 py-2.5 border rounded-xl" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                <input required placeholder="Phone Number" className="w-full px-4 py-2.5 border rounded-xl" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                <input type="email" placeholder="Email Address" className="w-full px-4 py-2.5 border rounded-xl" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                <textarea placeholder="Full Address" className="w-full px-4 py-2.5 border rounded-xl h-24" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              </div>
              <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20">
                {editingId ? 'Save Changes' : 'Add Supplier'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierManager;
