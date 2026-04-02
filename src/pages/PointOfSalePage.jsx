import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import logo from '../assets/FrancoPerfumeLogo.png';
import DiscountModal from '../components/cashier_components/DiscountModal';
import ProductCard from '../components/cashier_components/ProductCard';
import ProductModal from '../components/cashier_components/ProductModal';
import ProfileDropdown from '../components/general_components/ProfileDropdown';

const POS = ({ userEmail, onLogout, canSwitchAccess, onSwitchAccess }) => {
  const [cart, setCart] = useState([]);
  const [activeType, setActiveType] = useState('ALL'); 
  const [activeGender, setActiveGender] = useState('ALL'); 
  const [searchQuery, setSearchQuery] = useState('');
  const [currentDateTime, setCurrentDateTime] = useState('');

  // Discount Modal States
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [appliedDiscountRate, setAppliedDiscountRate] = useState(0); 
  
  // Cancel Confirm State
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  
  // Product Modal States
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentDateTime(now.toISOString().split('T')[0] + ' ' + now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const products = [
    { id: 1, name: 'Apricot Spray', type: 'PREMIUM', gender: 'MALE', price: 1500 },
    { id: 2, name: 'Apricot Spray', type: 'PREMIUM', gender: 'FEMALE', price: 1500 },
    { id: 3, name: 'Apricot Spray', type: 'PREMIUM', gender: 'UNISEX', price: 1500 },
    { id: 4, name: 'Ocean Breeze', type: 'CLASSIC', gender: 'FEMALE', price: 900 },
    { id: 5, name: 'Midnight Wood', type: 'CLASSIC', gender: 'MALE', price: 950 },
    { id: 6, name: 'Citrus Bloom', type: 'CLASSIC', gender: 'MALE', price: 900 },
  ];

  const handleAddToCart = (product, quantityToAdd) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + quantityToAdd } : item));
    } else {
      setCart([...cart, { ...product, qty: quantityToAdd }]);
    }
    setShowProductModal(false); 
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const discountAmount = subtotal * appliedDiscountRate; 
  const grandTotal = subtotal - discountAmount;

  const handleRemoveDiscount = () => {
    setAppliedDiscountRate(0); 
  };

  const filteredProducts = products.filter(p => {
    const matchesType = activeType === 'ALL' || p.type === activeType;
    const matchesGender = activeGender === 'ALL' || p.gender === activeGender;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesGender && matchesSearch;
  });

  const FilterBtn = ({ label, activeState, setCategory, currentActive }) => (
    <button 
      onClick={() => setCategory(currentActive === label ? 'ALL' : label)}
      className={`px-4 py-1.5 text-xs font-bold border transition-colors rounded-sm ${
        currentActive === label 
          ? 'bg-white text-black border-white' 
          : 'bg-transparent text-gray-300 border-gray-600 hover:border-white hover:text-white'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex flex-col h-screen w-full bg-[#2A2B2A] font-montserrat overflow-hidden relative">
      
      {/* HEADER */}
      <header className="flex justify-between items-start px-8 pt-6 pb-4 shrink-0 relative">
        <div className="flex flex-col gap-4">
          <span className="text-custom-gray font-bold tracking-widest text-xs uppercase">
            {canSwitchAccess ? 'MANAGER - CASHIER' : 'CASHIER'}
          </span>
          <div className="flex items-center gap-4">
            <div className="relative w-72">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-white" size={24} />
              <input 
                type="text" placeholder="Search a product..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-b border-gray-500 text-white pl-10 py-1 text-lg focus:outline-none focus:border-white transition-colors placeholder-gray-500"
              />
            </div>
            <button className="bg-white text-black px-6 py-2 font-bold text-sm rounded shadow hover:bg-gray-200 transition-colors">
              Filter
            </button>
          </div>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 top-4">
           <img src={logo} alt="Logo" className="h-12 w-auto object-contain brightness-0 invert opacity-50" />
        </div>

        {/* PROFILEDROPDOWN COMPONENT */}
        <ProfileDropdown 
          userEmail={userEmail} 
          onLogout={onLogout} 
          canSwitchAccess={canSwitchAccess} 
          onSwitchAccess={onSwitchAccess} 
          theme="dark" 
        />
      </header>

      {/* MAIN POS AREA */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left: Product Grid */}
        <div className="flex-1 flex flex-col px-8 pb-6 overflow-hidden">
          <div className="flex flex-col gap-3 mb-6 mt-2">
            <div className="flex items-center gap-4 text-white text-sm">
              <span className="text-gray-400 w-16">Type:</span>
              <FilterBtn label="PREMIUM" activeState={activeType} setCategory={setActiveType} currentActive={activeType} />
              <FilterBtn label="CLASSIC" activeState={activeType} setCategory={setActiveType} currentActive={activeType} />
            </div>
            <div className="flex items-center gap-4 text-white text-sm">
              <span className="text-gray-400 w-16">Gender:</span>
              <FilterBtn label="MALE" activeState={activeGender} setCategory={setActiveGender} currentActive={activeGender} />
              <FilterBtn label="FEMALE" activeState={activeGender} setCategory={setActiveGender} currentActive={activeGender} />
              <FilterBtn label="UNISEX" activeState={activeGender} setCategory={setActiveGender} currentActive={activeGender} />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map(product => (
                <ProductCard 
                  key={product.id} name={product.name} type={product.type} gender={product.gender} price={product.price}
                  onAddToCart={() => {
                    setSelectedProduct(product);
                    setShowProductModal(true);
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right: Checkout Sidebar */}
        <div className="w-[360px] bg-[#F5F5FA] flex flex-col shrink-0 z-10 p-4 border-l border-[#444]">
          <div className="text-center text-gray-500 text-lg mb-2 font-medium tracking-wide">
            {currentDateTime}
          </div>

          <div className="flex-1 bg-white border border-gray-800 flex flex-col overflow-hidden mb-4 shadow-sm">
            <div className="grid grid-cols-4 px-4 py-3 text-xs font-semibold text-gray-500">
              <div className="col-span-2">ITEM</div>
              <div className="text-center">QTY</div>
              <div className="text-right">PRICE</div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {cart.map((item, index) => (
                <div 
                  key={item.id} 
                  className={`grid grid-cols-4 px-4 py-3 text-sm items-center border-b border-gray-100 ${
                    index === cart.length - 1 ? 'bg-[#A3E4F5] border-r-[6px] border-[#008998]' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="col-span-2 font-bold text-gray-800 leading-tight">
                    {item.name}<br/>
                    <span className="text-[10px] text-gray-500 font-normal uppercase">{item.type}</span>
                  </div>
                  <div className="text-center font-medium text-gray-700">{item.qty}</div>
                  <div className="text-right font-medium text-gray-700">P{(item.price * item.qty).toLocaleString()}</div>
                </div>
              ))}
              {cart.length === 0 && <div className="p-8 text-center text-gray-400 text-sm">Cart is empty.</div>}
            </div>

            <div className="px-5 py-4 border-t border-gray-800">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[15px] font-bold text-gray-700">SUB TOTAL</span>
                <span className="font-bold text-[15px] text-gray-800">P{subtotal.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[15px] font-bold text-gray-700 block">DISCOUNT</span>
                  <button onClick={() => setShowDiscountModal(true)} className="text-[11px] font-medium text-[#6FBA7B] hover:underline block mt-1">
                    Add Discount {'>'}
                  </button>
                  <button onClick={handleRemoveDiscount} className="text-[11px] font-medium text-[#C16D81] hover:underline block mt-0.5">
                    Remove Discount {'>'}
                  </button>
                </div>
                <div className="text-right">
                  <span className="font-bold text-[15px] text-gray-800 block">P{discountAmount.toLocaleString()}</span>
                  <span className="text-[11px] text-gray-500">({appliedDiscountRate * 100}% discount)</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-lg font-extrabold text-gray-800 tracking-wide">GRAND TOTAL</span>
                <span className="text-xl font-extrabold text-gray-800">P{grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
           <button 
              onClick={() => setShowCancelConfirm(true)} 
              className="flex-1 bg-[#C18897] text-white py-3 rounded-md font-bold text-lg hover:bg-[#a87482] transition-colors shadow-sm tracking-wide"
            >
              CANCEL
            </button>
            <button className="flex-1 bg-[#94BE9F] text-white py-3 rounded-md font-bold text-lg hover:bg-[#7fa78a] transition-colors shadow-sm tracking-wide">
              CHECKOUT
            </button>
          </div>
        </div>
      </div>

      <DiscountModal 
        isOpen={showDiscountModal} 
        onClose={() => setShowDiscountModal(false)} 
        onApply={(rate) => {
          setAppliedDiscountRate(rate);
          setShowDiscountModal(false);
        }} 
      />

      <ProductModal 
        product={selectedProduct}
        isOpen={showProductModal}
        onClose={() => setShowProductModal(false)}
        onAdd={handleAddToCart}
      />

      {/* --- INLINE: CANCEL CONFIRMATION MODAL --- */}
      {showCancelConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm transition-all p-4">
          <div className="bg-white rounded-md shadow-2xl w-full max-w-[400px] overflow-hidden animate-fade-in border border-gray-200 p-8 text-center">
            
            <h3 className="text-2xl font-bold text-gray-700 mb-8 leading-tight">
              Are you sure you want to<br/>cancel the current order?
            </h3>
            
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => {
                  setCart([]); 
                  setAppliedDiscountRate(0); 
                  setShowCancelConfirm(false); 
                }}
                className="w-32 bg-[#529E58] text-white font-extrabold py-2.5 rounded hover:bg-[#438748] transition-colors tracking-widest text-[16px] shadow-sm"
              >
                YES
              </button>
              <button 
                onClick={() => setShowCancelConfirm(false)}
                className="w-32 bg-[#7D162E] text-white font-extrabold py-2.5 rounded hover:bg-[#631124] transition-colors tracking-widest text-[16px] shadow-sm"
              >
                NO
              </button>
            </div>

          </div>
        </div>
      )}
      
    </div>
  );
};

export default POS;