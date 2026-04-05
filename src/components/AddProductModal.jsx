const AddProductModal = ({ isOpen, onClose, onSave }) => {
  

  const [formData, setFormData] = useState({
    name: '', type: '', branch: '', note: '', gender: '', qty: 0
  });

const handleSubmit = () => {
  
  onSave(formData);
  
  setFormData({
    name: '',
    type: '',
    branch: '',
    note: '',
    gender: '',
    qty: 0
  });
  
  // 3. Close the modal
  onClose();
};


  if (!isOpen) return null;
  return (
    <div>
      
      <button onClick={handleSubmit}>Save Product</button>
    </div>
  );
};