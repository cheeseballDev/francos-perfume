import { ChevronLeft } from 'lucide-react';
import { useState } from 'react';
import logo from '../../assets/FrancoPerfumeLogo.png';

const StaffLogin = ({ onLogin }) => {
  // --- STATE ---
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isManagerSelection, setIsManagerSelection] = useState(false); // NEW STATE

  // Form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // --- HANDLERS ---
  const handleLogin = (e) => {
    e.preventDefault();
    
    let simulatedRole = 'manager'; 
    if (email.toLowerCase().includes('cashier')) simulatedRole = 'cashier staff';
    if (email.toLowerCase().includes('inventory')) simulatedRole = 'inventory staff';
    
    if (simulatedRole === 'manager') {
      setIsManagerSelection(true);
    } else {
      // Normal staff login: True role and Active role are the same
      onLogin({ trueRole: simulatedRole, activeRole: simulatedRole, email: email });
    }
  };

  const handleManagerModuleSelect = (moduleName) => {
    if (moduleName === 'Cashier') {
      // True Role = Manager. Active Role = Cashier.
      onLogin({ trueRole: 'manager', activeRole: 'cashier staff', email: email });
    } else if (moduleName === 'Inventory') {
      // True Role = Manager. Active Role = Manager.
      onLogin({ trueRole: 'manager', activeRole: 'manager', email: email });
    }
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    alert("Password reset simulation! Sending you back to login...");
    setIsForgotPassword(false);
    setPassword('');
    setOtp('');
    setConfirmPassword('');
  };

  const displayName = email ? email.split('@')[0] : 'User';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7F7F9] font-montserrat p-4 relative">
      
      {/* GO BACK BUTTON (Visible for Forgot Password OR Manager Selection) */}
      {(isForgotPassword || isManagerSelection) && (
        <div 
          onClick={() => {
            setIsForgotPassword(false);
            setIsManagerSelection(false);
          }}
          className="absolute top-8 left-8 flex items-center gap-1 cursor-pointer text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ChevronLeft size={20} />
          <span className="text-sm font-medium">Go Back</span>
        </div>
      )}

      <div className="w-full max-w-sm flex flex-col items-center">
        
        {/* --- SCREEN 3: MANAGER MODULE SELECTION --- */}
        {isManagerSelection ? (
          <div className="w-full flex flex-col items-center mt-8">
            <h2 className="text-[24px] font-bold text-[#333] mb-1 tracking-tight">Select A Module</h2>
            <p className="text-gray-500 mb-10 text-sm">Welcome back {displayName}.</p>
            
            <button 
              onClick={() => handleManagerModuleSelect('Cashier')}
              className="w-full bg-[#D4C4B0] text-[#333] rounded py-3 font-medium hover:bg-[#c2b09a] transition-colors text-sm shadow-sm mb-4"
            >
              Access POS
            </button>
            
            <button 
              onClick={() => handleManagerModuleSelect('Inventory')}
              className="w-full bg-[#D4C4B0] text-[#333] rounded py-3 font-medium hover:bg-[#c2b09a] transition-colors text-sm shadow-sm"
            >
              Access Dashboard
            </button>
          </div>
        ) : (
          
          /* --- SCREENS 1 & 2: LOGIN & FORGOT PASSWORD --- */
          <>
            <img src={logo} alt="Franco's Logo" className="h-24 w-auto object-contain mb-4" />
            <h1 className="text-[28px] font-bold text-[#333] mb-1 tracking-tight">OneFrancoScentHub</h1>
            
            {!isForgotPassword ? (
              <p className="text-gray-500 mb-8 text-sm">Welcome back!</p>
            ) : (
              <div className="mb-8"></div> 
            )}

            {!isForgotPassword ? (
              /* SCREEN 1: NORMAL LOGIN */
              <form onSubmit={handleLogin} className="w-full flex flex-col gap-3">
                <input 
                  type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  className="w-full border border-gray-300 rounded px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#7D162E] transition-colors bg-white"
                />
                <input 
                  type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} required
                  className="w-full border border-gray-300 rounded px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#7D162E] transition-colors bg-white"
                />

                <button 
                  type="button" onClick={() => setIsForgotPassword(true)}
                  className="w-full bg-[#7D162E] text-white rounded py-2.5 font-medium hover:bg-[#631124] transition-colors text-sm mt-2 shadow-sm"
                >
                  Forgot Password
                </button>
                <button 
                  type="submit" 
                  className="w-full bg-[#D4C4B0] text-[#333] rounded py-2.5 font-medium hover:bg-[#c2b09a] transition-colors text-sm shadow-sm"
                >
                  Login
                </button>
              </form>
            ) : (
              /* SCREEN 2: FORGOT PASSWORD */
              <form onSubmit={handleResetPassword} className="w-full flex flex-col gap-3">
                <input 
                  type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  className="w-full border border-gray-300 rounded px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#7D162E] transition-colors bg-white"
                />
                <input 
                  type="text" placeholder="Enter generated password" value={otp} onChange={(e) => setOtp(e.target.value)} required
                  className="w-full border border-gray-300 rounded px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#7D162E] transition-colors bg-white"
                />
                <input 
                  type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} required
                  className="w-full border border-gray-300 rounded px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#7D162E] transition-colors bg-white"
                />
                <input 
                  type="password" placeholder="Enter confirmation password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
                  className="w-full border border-gray-300 rounded px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#7D162E] transition-colors bg-white"
                />
                
                <div className="w-full bg-[#7D162E] text-white text-center rounded p-4 mt-2 shadow-sm text-xs leading-relaxed">
                  <p className="font-semibold mb-2">Please check your email for the<br/>one-time generated password</p>
                  <p className="text-[10px]">If you have not received an email,<br/>notify your manager to reset your<br/>password.</p>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-[#D4C4B0] text-[#333] rounded py-2.5 font-medium hover:bg-[#c2b09a] transition-colors text-sm shadow-sm mt-1"
                >
                  Login
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StaffLogin;