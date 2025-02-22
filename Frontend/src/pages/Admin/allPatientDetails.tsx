"use client";

import * as React from "react";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal, Eye } from "lucide-react";

// Import your UI components
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

// Define your Document type
export type Document = {
    id: string;
    date: string;
    type: string;
    doctor: string;
    url: string;
};

// Sample data
const initialData: Document[] = [
    {
        id: "doc1",
        date: "2023-01-01",
        type: "Prescription",
        doctor: "Dr. Joshi",
        url: "https://firebasestorage.googleapis.com/v0/b/cavista-hackethon.firebasestorage.app/o/Sasoon%20Pune%2FSample-filled-in-MR.pdf?alt=media&token=5f95fcbb-b411-40b0-ae0e-168953373f7a",
    },
    {
        id: "doc2",
        date: "2023-02-01",
        type: "Lab Report",
        doctor: "Dr. Verma",
        url: "https://firebasestorage.googleapis.com/v0/b/cavista-hackethon.firebasestorage.app/o/Sasoon%20Pune%2FSample-filled-in-MR.pdf?alt=media&token=5f95fcbb-b411-40b0-ae0e-168953373f7a",
    },
];



// Modal component for displaying the iframe
const Modal = ({ children, onClose, isOpen }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded shadow-lg max-w-lg w-full relative">
                <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                    onClick={onClose}
                    aria-label="Close"
                >
                    &times;
                </button>
                {children}
            </div>
        </div>
    );
};

// Modal for adding a new document
const AddDocumentModal = ({ isOpen, onClose, addDocument }) => {
    const [formData, setFormData] = React.useState({
        id: '',
        date: '',
        type: '',
        doctor: '',
        url: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        addDocument(formData);
        onClose(); // Close the modal after submitting
        setFormData({ id: '', date: '', type: '', doctor: '', url: '' }); // Reset form
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2 className="text-lg font-semibold">Add New Document</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input name="id" placeholder="Document ID" value={formData.id} onChange={handleChange} required />
                <Input name="date" placeholder="Date" value={formData.date} onChange={handleChange} required />
                <Input name="type" placeholder="Type" value={formData.type} onChange={handleChange} required />
                <Input name="doctor" placeholder="Doctor" value={formData.doctor} onChange={handleChange} required />
                <Input name="url" placeholder="Document URL" value={formData.url} onChange={handleChange} required />
                <div className="text-right">
                    <Button type="submit">Add Document</Button>
                </div>
            </form>
        </Modal>
    );
};

export function AllPatient() {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [selectedDocumentUrl, setSelectedDocumentUrl] = React.useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = React.useState(false); // State for document view modal
    const [isAddDocumentModalOpen, setIsAddDocumentModalOpen] = React.useState(false); // State for add document modal
    
    // Use state to manage document data
    const [data, setData] = React.useState<Document[]>(initialData);

    const columns: ColumnDef<Document>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "date",
            header: "Date",
            cell: ({ row }) => <div>{row.getValue("date")}</div>,
        },
        {
            accessorKey: "type",
            header: "Type",
            cell: ({ row }) => <div>{row.getValue("type")}</div>,
        },
        {
            accessorKey: "doctor",
            header: "Doctor",
            cell: ({ row }) => <div>{row.getValue("doctor")}</div>,
        },
        {
            id: "view",
            header: "View",
            cell: ({ row }) => {
                const document = row.original;
                return (
                    <Button variant="ghost" onClick={() => {
                        setSelectedDocumentUrl(document.url);
                        setIsModalOpen(true); 
                    }}>
                        <Eye />
                    </Button>
                );
            },
        },
        {
            id: "summary",
            header: "Summary",
            cell: ({ row }) => {
                const document = row.original;
                return (
                    <Button variant="ghost" onClick={() => generateSummary(document.id)}>
                        Generate Summary
                    </Button>
                );
            },
        },
    ];

    function generateSummary(documentId: string) {
        console.log(`Generating summary for document ID: ${documentId}`);
    }

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    const selectedDocuments = table.getSelectedRowModel().rows.map((row) => row.original);

    const addDocument = (newDocument: Document) => {
        setData((prevData) => [...prevData, { ...newDocument, id: String(prevData.length + 1) }]);
    };

    return (
        <div className="w-full">
            <div className="flex items-center py-4 px-10">
                <Button variant="outline" onClick={() => setIsAddDocumentModalOpen(true)} className="mr-4">
                    Add Document
                </Button>
                <Input
                    placeholder="Filter by doctor..."
                    value={(table.getColumn("doctor")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("doctor")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <div>
                    <Button
                        className=""
                        variant="outline"
                        onClick={() => {
                            table.clearFilters();
                        }}
                    >
                        Clear Filters
                    </Button>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDown />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    className="capitalize"
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(value) =>
                                        column.toggleVisibility(!!value)
                                    }
                                >
                                    {column.id}
                                </DropdownMenuCheckboxItem>
                            ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="rounded-md  px-10">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Modal for displaying iframe */}
            <Modal isOpen={isModalOpen} onClose={() => {
                setIsModalOpen(false);
                setSelectedDocumentUrl(null); // Clear URL on close
            }}>
                {selectedDocumentUrl && (
                    <>
                        <iframe
                            src={selectedDocumentUrl}
                            width="100%"
                            height="600"
                            style={{ border: "none" }}
                            title="Document Viewer"
                        />
                        <div className="text-right mt-2">
                            <a href={selectedDocumentUrl} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline">Download Document</Button>
                            </a>
                        </div>
                    </>
                )}
            </Modal>

            {/* Modal for adding a new document */}
            <AddDocumentModal 
                isOpen={isAddDocumentModalOpen} 
                onClose={() => setIsAddDocumentModalOpen(false)} 
                addDocument={addDocument} 
            />

            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => generateSummariesForSelectedDocuments(selectedDocuments)}
                    disabled={selectedDocuments.length === 0}
                >
                    Generate Summaries for Selected
                </Button>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}