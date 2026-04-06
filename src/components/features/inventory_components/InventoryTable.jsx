import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table";
import { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@radix-ui/themes";
import { Edit, Minus, Plus } from "lucide-react";




const InventoryTable = ({data, columns, role, onIncrease, onDecrease, onEdit}) => {

  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
  })


    return (
      <div className="space y-4">
        <div className="rounded-md border border-gray-200 bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Perfume Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Note</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Date Created</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="py-3 px-4 flex justify-center gap-1.5">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{item.branch}</TableCell>
                  <TableCell>{item.note}</TableCell>
                  <TableCell>{item.gender}</TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell className="text-right font-bold">{item.qty}</TableCell>

                  <TableCell className="text-center">
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="outline" 
                        size="sm" 
                        onClick={() => onIncrease(item.id)}
                        className="bg-[#E3D7C6] hover:bg-[#D6C9B8]"
                      >
                        <Plus size={16} />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => onDecrease(item.id)}
                        className="bg-[#E3D7C6] hover:bg-[#D6C9B8]"
                      >
                        <Minus size={16} />
                      </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => onEdit(item.id, role)}
                        >
                          <Edit size={16} />
                        </Button>
                        </div>
                    </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
      </div>
    </div>
  )
} 

export default InventoryTable;