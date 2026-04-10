import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

const EditProductModal = ({ isOpen, onClose, product, onSave, role}) => {
  const [formData, setFormData] = useState({
    name: '', type: '', branch: '', note: '', gender: '', qty: 0
  });

  useEffect(() => {
    if (product && isOpen) {
      setFormData(product);
    }
  }, [product, isOpen]);

  if (!isOpen || !product) return null;

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 animate-fade-in">

      <div className="bg-custom-white rounded-2xl shadow-xl w-full max-w-112.5 p-8 relative">

        <button onClick={onClose} className="absolute top-4 right-5 text-custom-gray hover:text-custom-black text-2xl font-bold">
          ✕
        </button>

        <h2 className="text-3xl font-extrabold text-custom-black text-center mb-6 tracking-tight">Edit Perfume</h2>

        <div className="flex justify-center mb-8">
          <div className="w-32 h-32 border border-custom-gray rounded-full flex items-center justify-center relative bg-custom-white">
            <svg className="w-12 h-12 text-custom-gray" fill="currentColor" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
            <div className="absolute bottom-0 right-0 bg-custom-white p-1">
              <svg className="w-6 h-6 text-custom-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[110px_1fr] gap-y-4 items-center">

          <span className="text-custom-gray text-sm">Perfume Name:</span>
          <input
            type="text"
            placeholder="Enter New Perfume Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="border border-custom-gray p-2 rounded-md w-full focus:outline-none text-sm text-custom-black"
          />

          <span className="text-custom-gray text-sm">Perfume Type:</span>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="border border-custom-gray p-2 rounded-md w-full focus:outline-none text-sm text-custom-gray bg-white"
          >
            <option value="" disabled>Select perfume type</option>
            <option value="Premium" className="text-custom-black">Premium</option>
            <option value="Standard" className="text-custom-black">Standard</option>
            <option value="Limited" className="text-custom-black">Limited</option>
          </select>

          <span className="text-custom-gray text-sm">Gender:</span>
          <select
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            className="border border-custom-gray p-2 rounded-md w-full focus:outline-none text-sm text-custom-gray bg-white"
          >
            <option value="" disabled>Select gender</option>
            <option value="Male" className="text-custom-black">Male</option>
            <option value="Female" className="text-custom-black">Female</option>
            <option value="Unisex" className="text-custom-black">Unisex</option>
          </select>

          <span className="text-custom-gray text-sm">Note:</span>
          <select
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            className="border border-custom-gray p-2 rounded-md w-full focus:outline-none text-sm text-custom-gray bg-white"
          >
            <option value="" disabled>Select note</option>
            <option value="Karat" className="text-custom-black">Karat</option>
            <option value="Apricot" className="text-custom-black">Apricot</option>
            <option value="Placeholder 3" className="text-custom-black">Placeholder 3</option>
          </select>

          <span className="text-custom-gray text-sm">Quantity:</span>
          <div className="flex items-center gap-2">
            <Button variant="primary" size="icon-sm" onClick={() => setFormData({ ...formData, qty: formData.qty + 1 })}>+</Button>
            <div className="w-16 h-8 border border-custom-gray rounded-md flex items-center justify-center bg-white text-sm font-medium">
              {formData.qty}
            </div>
            <Button variant="primary" size="icon-sm" onClick={() => setFormData({ ...formData, qty: Math.max(0, formData.qty - 1) })}>—</Button>
          </div>

        </div>

        <div className="flex gap-3 justify-center mt-8">
          <Button variant="primary" onClick={onClose}><span className="text-lg">✕</span> Cancel</Button>
          <Button variant="primary" onClick={handleSubmit}><span className="text-lg">✓</span> Save</Button>
          <Button variant="destructive-outline"><span className="text-lg font-bold">✕</span> Archive Perfume</Button>
        </div>

      </div>
    </div>
  );
};

export default EditProductModal;
