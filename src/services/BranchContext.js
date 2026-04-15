import { createContext, useContext, useState } from 'react';

const BranchContext = createContext();

export const BranchProvider = ({ children }) => {
    const [branchId, setBranchId] = useState(null);
    return (
        <BranchContext.Provider value={{ branchId, setBranchId }}>
            {children}
        </BranchContext.Provider>
    );
};

export const useBranch = () => useContext(BranchContext);