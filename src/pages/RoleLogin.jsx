const RoleButton = ({label, onClick}) => {
  return (
  <button 
      onClick={onClick}
      className="w-full py-4 bg-[#E2D6C5] hover:bg-[#D4C4B0] text-[#4A4A4A] font-medium
                rounded-sm shadow-sm transition-all duration-300 tracking-wide uppercase text-sm">
      {label}
    </button>
  );
};


const RoleLogin = ({ onSelect }) => {
  const roles = [
    { id: 'Cashier', label: 'Login as Cashier' },
    { id: 'Inventory', label: 'Login as Inventory' },
    { id: 'Manager', label: 'Login as Manager' },
    { id: 'Admin', label: 'Login as Admin' },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center relative overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-black" style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-black" style={{ clipPath: 'polygon(100% 0, 0 50%, 100% 100%)' }} />

      <div className="flex flex-col gap-4 w-full max-w-sm px-6">
        {roles.map((role) => (
          <RoleButton
            key={role.id}
            label={role.label}
            onClick={() => onSelect(role.id)}
          />
        ))}
      </div>
    </div>
  );
};



export default RoleLogin;