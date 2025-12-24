
import React, { useState } from 'react';
import { Medicine, Supplier } from '../types';
import { Plus, Search, Edit2, Trash2, X, Package, Filter } from 'lucide-react';

interface Props {
  medicines: Medicine[];
  suppliers: Supplier[];
  onUpdate: (meds: Medicine[]) => void;
}

const MedicineManager: React.FC<Props> = ({ medicines, suppliers, onUpdate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMed, setEditingMed] = useState<Medicine | null>(null);

  const [formData, setFormData] = useState<Partial<Medicine>>({
    name: '',
    genericName: '',
    category: '',
    price: 0,
    costPrice: 0,
    stock: 0,
    expiryDate: '',
    supplierId: ''
  });

  const filteredMedicines = medicines.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.genericName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newMed: Medicine = {
      id: editingMed ? editingMed.id : `MED-${Date.now()}`,
      name: formData.name || '',
      genericName: formData.genericName || '',
      category: formData.category || '',
      price: Number(formData.price) || 0,
      costPrice: Number(formData.costPrice) || 0,
      stock: Number(formData.stock) || 0,
      expiryDate: formData.expiryDate || '',
      supplierId: formData.supplierId || ''
    };

    if (editingMed) {
      onUpdate(medicines.map(m => m.id === editingMed.id ? newMed : m));
    } else {
      onUpdate([newMed, ...medicines]);
    }
    closeModal();
  };

  const openModal = (med?: Medicine) => {
    if (med) {
      setEditingMed(med);
      setFormData(med);
    } else {
      setEditingMed(null);
      setFormData({
        name: '', genericName: '', category: '', price: 0, costPrice: 0, stock: 0, expiryDate: '', supplierId: ''
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingMed(null);
  };

  const deleteMed = (id: string) => {
    if (window.confirm('Delete this medicine?')) {
      onUpdate(medicines.filter(m => m.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Inventory Management</h2>
          <p className="text-sm text-gray-500">Track and manage your medical stock</p>
        </div>
        <div className="flex items-center gap-3">
           <button 
             onClick={() => openModal()}
             className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/10"
           >
             <Plus size={20} />
             Add Medicine
           </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Search by name, generic name..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-2 border border-gray-200 rounded-xl bg-white text-gray-600 hover:bg-gray-50">
            <Filter size={18} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Medicine Name</th>
                <th className="px-6 py-4">Generic</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Expiry</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredMedicines.length > 0 ? filteredMedicines.map(med => (
                <tr key={med.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-900">{med.name}</td>
                  <td className="px-6 py-4 text-gray-500">{med.genericName}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium">
                      {med.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-bold ${med.stock < 10 ? 'text-red-500' : 'text-gray-700'}`}>
                      {med.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-emerald-600">${med.price.toFixed(2)}</td>
                  <td className="px-6 py-4 text-gray-500">{med.expiryDate}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => openModal(med)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => deleteMed(med.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <Package size={48} className="mb-2 opacity-20" />
                      <p>No medicines found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">
                {editingMed ? 'Edit Medicine' : 'Add New Medicine'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Brand Name</label>
                  <input 
                    required 
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Generic Name</label>
                  <input 
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={formData.genericName}
                    onChange={(e) => setFormData({...formData, genericName: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Category</label>
                  <select 
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="">Select Category</option>
                    <option value="Tablet">Tablet</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Syrup">Syrup</option>
                    <option value="Injection">Injection</option>
                    <option value="Topical">Topical</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Expiry Date</label>
                  <input 
                    type="date" 
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Selling Price</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Cost Price</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={formData.costPrice}
                    onChange={(e) => setFormData({...formData, costPrice: Number(e.target.value)})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Stock Quantity</label>
                  <input 
                    type="number" 
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Supplier</label>
                  <select 
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={formData.supplierId}
                    onChange={(e) => setFormData({...formData, supplierId: e.target.value})}
                  >
                    <option value="">Select Supplier</option>
                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 flex gap-4">
                <button 
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/20"
                >
                  {editingMed ? 'Save Changes' : 'Add Medicine'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicineManager;
