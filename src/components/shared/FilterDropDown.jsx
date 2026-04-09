import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const FilterBar = ({ filters, setFilters, filterSelections }) => {
  
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }

    return (
      <div className="flex items-center gap-6">
        {filterSelections?.map((option) => (
          <Select value={
            filters[option.key]}
            onValueChange={(val) => handleFilterChange(option.key, val)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder={option.label} />
            </SelectTrigger>
              <SelectContent>
                {option.options.map((opt) => (
                <SelectItem value={opt}>{opt}</SelectItem>
                ))}
              </SelectContent>
          </Select>
        ))}
    </div>
    )
}

export default FilterBar;