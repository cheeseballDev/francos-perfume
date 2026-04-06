import { useState } from "react";
import FilterBar from "../../components/shared/FilterBar";
import SearchBar from "../../components/shared/SearchBar";

const RequestPage = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const [filters, setFilters] = useState({perfume: 'Perfume', status: 'Status', requested_from: 'Requested From', sent_to: 'Sent To', date_created: '2026-04-11'});
  
    {/*
    TEMP DATA 
    */
    }

    const filterSelections = [
        { key: 'perfume', label: 'Perfume', options: ['Perfume']},
        { key: 'status', label: 'Status', options: ['Pending', 'Denied', 'Cancelled', 'Received']},
        { key: 'requested_from', label: 'Requested From', options: ['Requested From']},
        { key: 'sent_to', label: 'Sent To', options: ['Sent To']}
    ];

    return(
        <div className="flex flex-col h-full animate-fade-in relative">
            <h1 className="text-[32px] font-bold text-custom-black mb-2 leading-none tracking-tight"> Request </h1>
            <p className="text-custom-gray text-sm mb-8">Check requests and confirm</p>

            <div className="flex items-center gap-4 mb-6">
                <SearchBar
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                />

                <FilterBar
                filters={filters}
                setFilters={setFilters}
                filterSelections={filterSelections}
                />
            </div>
            
        </div>
    )
}

export default RequestPage;