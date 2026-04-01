import React, { useState } from 'react';

const AddProductModal = ({isOpen, onlose}) => {

if (!isOpen) return null;

return(
<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm transition-all">
<div className="bg-white p-8 rounded-md shadow-xl flex flex-col items-center">
        <h1 className="text-2xl font-bold text-gray-800">Add Product Form</h1>
        <button onClick={onClose} className="...">
          CLOSE
        </button>
      </div>
  </div> 
);
}
