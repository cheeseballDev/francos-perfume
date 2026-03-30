import { useState } from 'react';

// WE ADD 'onLoginSuccess' TO THE PROPS HERE
const StaffLogin = ({ role, onBack, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      alert("Please fill in both fields.");
      return;
    }
    
    //If fields are filled, trigger the routing!
    onLoginSuccess(email); // Pass the email up to the App component for dashboard display
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-[#F7F7F9] overflow-hidden">
      
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-black" style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-black" style={{ clipPath: 'polygon(100% 0, 0 50%, 100% 100%)' }} />

      <div onClick={onBack} className="absolute top-12 left-32 flex items-center gap-2 cursor-pointer group">
        <div className="w-6 h-6 flex items-center justify-center border-2 border-[#8E8E8E] rounded-full group-hover:border-black transition-colors">
            <span className="text-[#8E8E8E] group-hover:text-black mb-0.5 ml-1 text-sm">{"<"}</span>
        </div>
        <span className="text-[#8E8E8E] font-medium group-hover:text-black transition-colors">Go Back</span>
      </div>

      <div className="flex flex-col items-center w-full max-w-[400px] z-10 px-6">
        <h1 className="text-4xl font-bold text-[#333] mb-12 tracking-tight text-center capitalize">
          Login as {role}
        </h1>

        <div className="w-full flex flex-col gap-4">
          <input 
            type="email" 
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-[#C0C0C0] rounded-md focus:outline-none focus:ring-1 focus:ring-[#D4C4B0]"
          />
          <input 
            type="password" 
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-[#C0C0C0] rounded-md focus:outline-none focus:ring-1 focus:ring-[#D4C4B0]"
          />
          
          <button 
            onClick={handleLogin} // THIS BUTTON NOW FIRES THE FUNCTION
            className="w-full py-3 bg-[#E3D7C6] hover:bg-[#D6C9B8] text-[#4A4A4A] font-semibold rounded-md shadow-sm transition-all mt-4 uppercase tracking-wider"
          >
            Login
          </button>

          {role !== 'Manager' && role !== 'Admin' && (
            <button className="w-full py-3 bg-[#7D162E] hover:bg-[#631124] text-white font-medium rounded-md shadow-sm transition-all mt-2 tracking-wide">
              Forgot Password
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffLogin;