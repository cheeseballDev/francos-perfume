import { ChevronDown, ChevronUp } from "lucide-react";

const DataTable = ({headers, data, renderActions, onSort, sortConfig}) => {
    return(
        <div className="flex-1 bg-white overflow-auto border border-gray-100 rounded-t-md shadow-sm custom-scrollbar">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead className="sticky top-0 bg-white z-10 border-b border-gray-200">
            <tr>
                {headers.map((header) => (
                    <th key={header.key}
                      onClick={() => header.sortable !== false && onSort(header.key)}
                      className={`py-3 px-4 text-xs font-semibold text-custom-gray uppercase tracking-wider ${header.sortable !== false ? 'cursor-pointer hover:bg-gray-50' : ''}`}
                    >
                      <div className="flex items-center gap-1">
                        {header.label}
                        {header.sortable !== false && (
                          sortConfig?.key === header.key
                            ? <span><ChevronUp size={16} /></span>
                            : <span><ChevronDown size={16} /></span>
                        )}
                      </div>
                    </th>
                ))}
                {renderActions && <th className="py-3 px-4 text-xs font-semibold text-custom-gray uppercase tracking-wider">Actions</th>}
            </tr>
          </thead>

            {
              /*
                THE FUCKING ITEMS
              */
            }
          <tbody>
          {data.map((item, index) => (
            <tr key={item.id} className={index % 2 === 0 ? 'bg-custom-gray-2' : 'bg-custom-white hover:bg-gray-50 transition-colors'}>
              
              {/* DYNAMIC DATA CELLS */}
              {headers.map((header) => (
                <td key={header.key} className="py-3 px-4 text-sm text-gray-600">
                    {item[header.key]} 
                </td>
              ))}

              {/* DYNAMIC ACTIONS */}
              {renderActions && (
                <td className="py-3 px-4 flex justify-center gap-1.5">
                  {renderActions(item)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
        </table>
      </div>
    )
}

export default DataTable;