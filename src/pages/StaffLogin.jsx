import React, { useState } from 'react';
import logo from '../assets/FrancoPerfumeLogo.png';
import { ChevronLeft } from 'lucide-react'; // Bringing in the back arrow icon

const StaffLogin = ({ onLogin }) => {
  // --- STATE ---
  // This boolean acts as our toggle switch between the two screens
  const [isForgotPassword, setIsForgotPassword] = useState(false);

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
    onLogin(simulatedRole, email);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    // Simulate what happens when they successfully submit the reset form
    alert("Password reset simulation! Sending you back to login...");
    setIsForgotPassword(false); // Send them back to the normal login screen
    setPassword('');
    setOtp('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7F7F9] font-montserrat p-4 relative">
      
      {/* GO BACK BUTTON (Only visible when isForgotPassword is true) */}
      {isForgotPassword && (
        <div 
          onClick={() => setIsForgotPassword(false)}
          className="absolute top-8 left-8 flex items-center gap-1 cursor-pointer text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ChevronLeft size={20} />
          <span className="text-sm font-medium">Go Back</span>
        </div>
      )}

      <div className="w-full max-w-sm flex flex-col items-center">
        
        {/* LOGO & HEADERS (Shared between both screens) */}
        <img src={logo} alt="Franco's Logo" className="h-24 w-auto object-contain mb-4" />
        <h1 className="text-[28px] font-bold text-[#333] mb-1 tracking-tight">OneFrancoScentHub</h1>
        
        {/* Only show "Welcome back!" on the main login screen */}
        {!isForgotPassword ? (
          <p className="text-gray-500 mb-8 text-sm">Welcome back!</p>
        ) : (
          <div className="mb-8"></div> // Empty spacer so the forms don't jump up
        )}

        {/* --- DYNAMIC FORM RENDERING --- */}
        {!isForgotPassword ? (
          
          /* === SCREEN 1: NORMAL LOGIN FORM === */
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
              type="button" 
              onClick={() => setIsForgotPassword(true)} // This triggers the toggle!
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
          
          /* === SCREEN 2: FORGOT PASSWORD FORM === */
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
            
            {/* The Maroon Instruction Box */}
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

      </div>
    </div>
  );
};

export default StaffLogin;