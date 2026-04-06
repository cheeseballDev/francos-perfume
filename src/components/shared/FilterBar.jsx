const FilterBar = ({ filters, setFilters, filterSelections }) => {
  
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }

    return (
      <div className="flex items-center gap-6">
        {filterSelections?.map((option) => (
          <select
            key={option.key}
            value={filters[option.key]}
            onChange={(e) => handleFilterChange(option.key, e.target.value )}
            className="w-auto border border-gray-200 rounded px-4 py-2 text-sm text-gray-600 focus:outline-none cursor-pointer"
          >
            {option.options?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        ))}
    </div>
    )
}

export default FilterBar;