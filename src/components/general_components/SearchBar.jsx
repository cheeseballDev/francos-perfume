import { Search } from 'lucide-react';

const SearchBar = ({ value, onChange, placeholder = "Search..." }) => {
  return (
    <div className="relative flex-1 max-w-xs">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
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