import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const ProductModal = ({ product, isOpen, onClose, onAdd }) => {
  const [quantity, setQuantity] = useState(1);

  // Every time the modal opens for a new product, reset the quantity to 1
  useEffect(() => {
    if (isOpen) setQuantity(1);
  }, [isOpen, product]);

  // If the modal shouldn't be open, or there's no product selected, render nothing
  if (!isOpen || !product) return null;

  const handleAddClick = () => {
    onAdd(product, quantity);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm transition-all p-4">
      <div className="bg-white rounded-md shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in border border-gray-200 relative p-8">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors">
          <X size={26} />
        </button>

        <div className="flex gap-6 mb-8 mt-2">
          
          {/* Left Side: Product Info & Quantity */}
          <div className="flex-1 flex flex-col justify-center">
            <h2 className="text-[22px] font-extrabold text-gray-800 uppercase leading-tight mb-4 pr-6 tracking-wide">
              {product.name}
            </h2>
            <p className="text-lg font-bold text-gray-700 mb-6">
              Price: P{product.price.toLocaleString()}
            </p>

            <div className="flex items-center gap-4">
              <label className="text-[16px] text-gray-800 font-bold">Quantity:</label>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center bg-[#E5D5C5] text-gray-800 font-bold rounded hover:bg-[#d6c4b2] transition-colors text-xl"
                >
                  -
                </button>
                <div className="w-16 h-10 flex items-center justify-center border border-gray-400 rounded bg-white font-bold text-[18px]">
                  {quantity}
                </div>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center bg-[#E5D5C5] text-gray-800 font-bold rounded hover:bg-[#d6c4b2] transition-colors text-xl"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Right Side: Product Image Area */}
          <div className="w-40 h-40 shrink-0 rounded-md overflow-hidden bg-[#E5D5C5] shadow-inner flex items-center justify-center relative">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              // Placeholder bottle shape if no image is provided
              <div className="w-20 h-28 bg-gradient-to-b from-yellow-300 to-yellow-600 rounded-t-full shadow-2xl opacity-80"></div>
            )}
          </div>

        </div>

        {/* Action Button */}
        <button 
          onClick={handleAddClick}
          className="w-full bg-[#529E58] text-white font-extrabold py-3.5 rounded hover:bg-[#438748] transition-colors tracking-widest text-[16px] shadow-sm"
        >
          ADD TO CHECKOUT
        </button>

      </div>
    </div>
  );
};

export default ProductModal;