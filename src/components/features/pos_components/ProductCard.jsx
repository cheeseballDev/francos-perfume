import React from 'react';

const ProductCard = ({ name, type, gender, imageUrl, price, onAddToCart }) => {
  return (
    <div 
      onClick={onAddToCart} 
      className="flex flex-col cursor-pointer transition-transform hover:scale-[1.02] shadow-md border border-[#333] overflow-hidden"
    >
      {/* White Title Bar */}
      <div className="bg-white text-black font-extrabold text-center py-2 text-sm uppercase tracking-wider">
        {name}
      </div>
      
      {/* Image Area (Beige Background) */}
      <div className="h-40 bg-[#E5D5C5] w-full flex items-center justify-center p-2 relative">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="h-full object-contain drop-shadow-xl" />
        ) : (
          // A placeholder shape just in case you don't have the bottle images yet
          <div className="w-16 h-24 bg-gradient-to-b from-yellow-300 to-yellow-600 rounded-t-full shadow-2xl opacity-80"></div>
        )}
      </div>
      
      {/* Dark Footer Area */}
      <div className="bg-[#1A1A1A] text-white text-center py-2 text-xs font-semibold tracking-widest">
        {type} / {gender}
      </div>
    </div>
  );
};

export default ProductCard;