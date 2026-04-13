import { Button } from '@/components/ui/button';
import { useState } from 'react';

const CreateRequestModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    perfume: '',
    qty: 0,
    requestedFrom: '',
    sentTo: ''
  });

  const handleSubmit = async () => {
    // 1. Give it a temporary ID and current timestamp for the frontend table
    const newRequest = {
      ...formData,
      id: `REQ-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      date: new Date().toLocaleDateString('en-CA').replace(/-/g, '/'), // YYYY/MM/DD
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'PENDING'
    };

    /* // 🔌 BACKEND CONNECTION: UNCOMMENT WHEN .NET API IS READY
    try {
      const response = await fetch('https://localhost:5001/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData) // Only send the raw form data, DB generates ID/Time
      });

      if (!response.ok) throw new Error('Failed to create request');

      const savedRequest = await response.json();
      onSave(savedRequest); // Update frontend with the real DB object

    } catch (error) {
      console.error("Error creating request:", error);
      alert("Failed to connect to the server.");
      return; // Stop the modal from closing if it failed
    }
    */

    // 2. TEMPORARY LOCAL SAVE (Remove this when backend is connected)
    onSave(newRequest);

    // 3. Reset form and close
    setFormData({ perfume: '', qty: 0, requestedFrom: '', sentTo: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 animate-fade-in">
      <div className="bg-custom-white rounded-2xl shadow-xl w-full max-w-125 p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-5 text-custom-gray hover:text-custom-black text-2xl font-bold">✕</button>
        <h2 className="text-3xl font-extrabold text-custom-black text-center mb-8 tracking-tight">Create Request</h2>

        <div className="grid grid-cols-[130px_1fr] gap-y-5 items-center">

          <span className="text-custom-gray text-sm font-medium">Perfume:</span>
          <select value={formData.perfume} onChange={(e) => setFormData({ ...formData, perfume: e.target.value })} className="border border-custom-gray p-2.5 rounded-md w-full focus:outline-none text-sm text-custom-black bg-white shadow-sm">
            <option value="" disabled>Select perfume</option>
            <option value="Apricot Spray">Apricot Spray</option>
            <option value="Ocean Breeze">Ocean Breeze</option>
            <option value="Midnight Wood">Midnight Wood</option>
            <option value="Citrus Bloom">Citrus Bloom</option>
            <option value="Velvet Rose">Velvet Rose</option>
          </select>

          <span className="text-custom-gray text-sm font-medium">Quantity:</span>
          <div className="flex items-center gap-2">
            <Button variant="primary" size="icon-sm" onClick={() => setFormData({ ...formData, qty: formData.qty + 1 })}>+</Button>
            <div className="w-20 h-10 border border-custom-gray rounded-md flex items-center justify-center bg-white text-sm font-medium shadow-sm">{formData.qty}</div>
            <Button variant="primary" size="icon-sm" onClick={() => setFormData({ ...formData, qty: Math.max(0, formData.qty - 1) })}>—</Button>
          </div>

          <span className="text-custom-gray text-sm font-medium">Requested From:</span>
          <select value={formData.requestedFrom} onChange={(e) => setFormData({ ...formData, requestedFrom: e.target.value })} className="border border-custom-gray p-2.5 rounded-md w-full focus:outline-none text-sm text-custom-black bg-white shadow-sm">
            <option value="" disabled>Select origin branch</option>
            <option value="Sta. Lucia">Sta. Lucia</option>
            <option value="Riverbanks">Riverbanks</option>
          </select>

          <span className="text-custom-gray text-sm font-medium">Sent To:</span>
          <select value={formData.sentTo} onChange={(e) => setFormData({ ...formData, sentTo: e.target.value })} className="border border-custom-gray p-2.5 rounded-md w-full focus:outline-none text-sm text-custom-black bg-white shadow-sm">
            <option value="" disabled>Select destination branch</option>
            <option value="Sta. Lucia">Sta. Lucia</option>
            <option value="Riverbanks">Riverbanks</option>
          </select>

        </div>

        <div className="flex gap-3 justify-center mt-10">
          <Button variant="primary" onClick={onClose}><span className="text-lg">✕</span> Cancel</Button>
          <Button variant="primary" onClick={handleSubmit}><span className="text-lg">✓</span> Submit Request</Button>
        </div>
      </div>
    </div>
  );
};

export default CreateRequestModal;
