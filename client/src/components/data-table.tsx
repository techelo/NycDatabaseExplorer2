import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { ChevronDown, Download, Search } from "lucide-react";

interface DataTableProps<T> {
  data: T[];
  columns: {
    key: keyof T;
    header: string;
    render?: (value: any, item: T) => React.ReactNode;
  }[];
  pagination?: boolean;
  itemsPerPage?: number;
  searchable?: boolean;
  searchKeys?: Array<keyof T>;
  exportable?: boolean;
}

export default function DataTable<T>({
  data,
  columns,
  pagination = true,
  itemsPerPage = 10,
  searchable = true,
  searchKeys,
  exportable = true,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });

  // Filter data based on search query
  const filteredData = searchable
    ? data.filter((item) => {
        if (!searchQuery.trim()) return true;
        
        // If searchKeys is specified, only search in those keys
        if (searchKeys && searchKeys.length > 0) {
          return searchKeys.some((key) => {
            const value = item[key];
            return value !== null && 
              value !== undefined && 
              String(value).toLowerCase().includes(searchQuery.toLowerCase());
          });
        }
        
        // Otherwise, search in all columns
        return Object.values(item).some(
          (value) =>
            value !== null &&
            value !== undefined &&
            String(value).toLowerCase().includes(searchQuery.toLowerCase())
        );
      })
    : data;

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (aValue === bValue) return 0;
    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;
    
    const comparison = String(aValue).localeCompare(String(bValue));
    return sortConfig.direction === "asc" ? comparison : -comparison;
  });

  // Paginate data
  const totalPages = pagination
    ? Math.ceil(sortedData.length / itemsPerPage)
    : 1;
  const paginatedData = pagination
    ? sortedData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    : sortedData;

  // Handle sort toggle
  const handleSort = (key: keyof T) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  // Export data as CSV
  const exportToCSV = () => {
    if (!exportable || filteredData.length === 0) return;
    
    const headers = columns.map((col) => col.header);
    const rows = filteredData.map((item) =>
      columns.map((col) => {
        const value = item[col.key];
        return typeof value === 'string' ? `"${value}"` : value;
      })
    );
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      {(searchable || exportable) && (
        <div className="flex flex-col sm:flex-row gap-2 justify-between">
          {searchable && (
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 w-full sm:w-64"
              />
            </div>
          )}
          
          {exportable && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-1">
                  <Download className="h-4 w-4 mr-1" />
                  Export
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={exportToCSV}>
                  CSV
                </DropdownMenuItem>
                <DropdownMenuItem>Excel</DropdownMenuItem>
                <DropdownMenuItem>PDF</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      )}
      
      {/* Table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead 
                  key={String(column.key)}
                  className="cursor-pointer"
                  onClick={() => handleSort(column.key)}
                >
                  <div className="flex items-center">
                    {column.header}
                    {sortConfig.key === column.key && (
                      <span className="ml-1">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={String(column.key)}>
                      {column.render
                        ? column.render(item[column.key], item)
                        : String(item[column.key] || "")}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              />
            </PaginationItem>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNumber: number;
              
              if (totalPages <= 5) {
                pageNumber = i + 1;
              } else if (currentPage <= 3) {
                pageNumber = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + i;
              } else {
                pageNumber = currentPage - 2 + i;
              }
              
              return (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    isActive={pageNumber === currentPage}
                    onClick={() => setCurrentPage(pageNumber)}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
      
      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredData.length ? (currentPage - 1) * itemsPerPage + 1 : 0}-
        {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} results
      </div>
    </div>
  );
}
