import { flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronsUpDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const DataTable = ({ data, columns }) => {

    const [sorting, setSorting] = useState([
        { id: 'id', desc: true },
    ])

    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10});

    const statusOrder = { "PENDING": 0, "RECEIVED": 1, "DENIED": 2, "CANCELLED": 3};

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        state: {
            sorting,
            pagination
        },
        sortingFns: {
            statusSort: (rowA, rowB, columnID) => {
                const a = statusOrder[rowA.getValue(columnID)] ?? 99;
                const b = statusOrder[rowB.getValue(columnID)]?? 99;
                console.log(columnID, rowA.getValue(columnID), rowB.getValue(columnID), '->', a, b);
                return a - b;
            }
        },
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onPaginationChange: setPagination,
        getPaginationRowModel: getPaginationRowModel(),
        enableSortingRemoval: false,
    });

    return (
        <div className="rounded-md border bg-white">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup)=> (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (    
                                <TableHead
                                className={header.id !== "actions" ? "cursor-pointer" : ""}
                                onClick={header.column.getToggleSortingHandler()}
                                key={header.id}>
                                    <div className="flex items-center gap-2">
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                        {header.column.getCanSort() && (
                                        header.column.getIsSorted() === 'asc' ? <ChevronUp size={16} />
                                        : header.column.getIsSorted() === 'desc' ? <ChevronDown size={16} />
                                        : <ChevronsUpDown size={16}/>)}
                                    </div>
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>

                <TableBody>
                    {table.getRowModel().rows.map((row, index)=> (
                    <TableRow className={index % 2 === 0 ? "bg-custom-white" : "bg-custom-gray-2"}key={row.id}>
                        {row.getVisibleCells().map((cell)=>(
                            <TableCell key={cell.id}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                        ))}
                    </TableRow>  
                    ))}
                </TableBody>
            </Table>

            <div className="flex justify-between items-center mt-4 text-sm text-custom-gray">
                <span className="text-custom-gray"> Showing {table.getRowModel().rows.length} out of {table.getRowCount()} </span>
                <div className="flex gap-2">
                    <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}><ChevronLeft size={16}/></button>
                    <span>{table.getState().pagination.pageIndex + 1} / {table.getPageCount()}</span>
                    <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}><ChevronRight size={16}/></button>
                </div>
            </div>
        </div>
    )
}

export default DataTable;