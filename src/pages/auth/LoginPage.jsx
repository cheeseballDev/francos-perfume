import { login } from '@/services/LoginService';
import { ChevronLeft } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/FrancoPerfumeLogo.png';

const LoginPage = ({ onLogin }) => {
  const navigate = useNavigate();
  const [view, setView] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [trueRole, setTrueRole] = useState('');
  const [branch, setBranch] = useState('');

  //const [errorMessage, setErrorMessage] = useState('');

  // --- STATE ---
  
  // --- HANDLERS ---
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const result = await login(email, password);
      setTrueRole(result.role);
      setBranch(result.branch);

      if (result.role === 'manager') {
        setView('module');
      } else {
        onLogin({
          email,
          token: result.token,
          trueRole: result.role,
          activeRole: result.role,
          branch: result.branch
        });
        navigate(result.role === 'cashier' ? '/pos' : '/home');
      } 

    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  const handleModuleSelect = (module) => {
    onLogin({
      email,
      token: sessionStorage.getItem('token'),
      trueRole,
      activeRole: module,
      branch
    })
  };

  

  const displayName = email ? email.split('@')[0] : 'User';

  if (view === 'module') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7F7F9] font-montserrat p-4 relative">
        <div 
          onClick={() => { setView('login') }}
          className="absolute top-8 left-8 flex items-center gap-1 cursor-pointer text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ChevronLeft size={20} />
          <span className="text-sm font-medium">Go Back</span>
        </div>

          <h2 className="text-[24px] font-bold text-[#333] mb-1 tracking-tight">Select A Module</h2>
          <p className="text-gray-500 mb-10 text-sm">Welcome back {displayName}.</p>
        <div className="w-full max-w-sm flex flex-col gap-4">
          <button 
            onClick={() => handleModuleSelect('cashier')}
            className="w-full bg-[#D4C4B0] text-[#333] rounded py-3 font-medium hover:bg-[#c2b09a] transition-colors text-sm shadow-sm mb-4"
          >
            Access POS
          </button>
          
          <button 
            onClick={() => handleModuleSelect('inventory')}
            className="w-full bg-[#D4C4B0] text-[#333] rounded py-3 font-medium hover:bg-[#c2b09a] transition-colors text-sm shadow-sm"
          >
            Access Dashboard
          </button>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7F7F9] font-montserrat p-4">
      <div className="w-full max-w-sm flex flex-col items-center">
        <img src={logo} alt="Franco Perfume" className="h-24 w-auto object-contain mb-4"/>
        <h1 className="text-[28px] font-bold text-[#333] mb-1 tracking-tight">OneFrancoScentHub</h1>
        <p className="text-gray-500 mb-8 text-sm">Welcome back!</p>
        <form onSubmit={handleLogin} className="w-full flex flex-col gap-3">
            <input type="email" placeholder="Enter email" value={email}
                onChange={(e) => setEmail(e.target.value)} required
                className="w-full border border-gray-300 rounded px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#7D162E] bg-white" />
            <input type="password" placeholder="Enter password" value={password}
                onChange={(e) => setPassword(e.target.value)} required
                className="w-full border border-gray-300 rounded px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#7D162E] bg-white" />
            <button type="submit"
                className="w-full bg-[#D4C4B0] text-[#333] rounded py-2.5 font-medium hover:bg-[#c2b09a] transition-colors text-sm shadow-sm mt-2">
                Login
            </button>
        </form>
      </div>
    </div>
  )
};

export default LoginPage;