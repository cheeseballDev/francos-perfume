import { Search } from 'lucide-react';

const SearchBar = ({ value, onChange, placeholder = "Search by name or id..."}) => {
  return (
    <div className="relative w-64">
      <div className="absolute inset-y-0 left-0 pl-3 0 flex items-center pointer-events-none">
      <Search className="h-4 w-4 text-custom-gray" size={18} />
      </div>
      <input 
        type="text" 
        placeholder={placeholder}
        value={value} 
        onChange={onChange} // This triggers the parent's state update!
        className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-gray-400"
      />
    </div>
  );
};

export default SearchBar;