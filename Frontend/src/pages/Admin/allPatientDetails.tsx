import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../../Database/FirebaseConfig"; 
import { doc, getDoc } from "firebase/firestore";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import axios from 'axios'; // Import axios for API calls
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    url: string;
}

const DocumentViewerModal = ({ isOpen, onClose, url }: ModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded shadow-lg max-w-lg w-full relative">
                <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                    onClick={onClose}
                    aria-label="Close"
                >
                    ×
                </button>
                <iframe src={url} width="100%" height="600" style={{ border: "none" }} title="Document Viewer" />
                <div className="text-right mt-2">
                    <a href={url} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline">Download Document</Button>
                    </a>
                </div>
            </div>
        </div>
    );
};

// Modal for displaying the summary
const SummaryModal = ({ isOpen, onClose, summary }: { isOpen: boolean; onClose: () => void; summary: string; }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded shadow-lg max-w-lg w-full relative h-96 overflow-y-auto">
                <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                    onClick={onClose}
                    aria-label="Close"
                >
                    ×
                </button>
                <div className="max-h-full overflow-y-auto">
                    <h2 className="text-xl font-semibold mb-2">Generated Summary</h2>
                    <pre className="whitespace-pre-wrap">{summary}</pre> {/* Use <pre> for better formatting */}
                </div>
            </div>
        </div>
    );
};

export function AllPatient() {
    const navigate = useNavigate();
    const location = useLocation();
    const [data, setData] = useState<{ id: string; date: string; doctor: string; url: string; type: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedDocumentUrl, setSelectedDocumentUrl] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isSummaryModalOpen, setIsSummaryModalOpen] = useState<boolean>(false);
    const [selectedRows, setSelectedRows] = useState<string[]>([]); 
    const [generatedSummary, setGeneratedSummary] = useState<string | null>(null);  // New state for generated summary
    const AadharId = location.state?.aadhaar || '';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const docRef = doc(db, "patients", AadharId); 
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const fileUrls = docSnap.data().fileUrls || [];
                    const formattedData = fileUrls.map((file: any, index: number) => ({
                        id: `file-${index}`,
                        date: file.date || "N/A",
                        doctor: file.doctor || "Unknown",
                        url: file.url || "#",
                        type: file.type || "Unknown",
                    }));
                    setData(formattedData);
                } else {
                    setError("No patient data found");
                }
            } catch (err) {
                setError("Error fetching data");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [AadharId]);
    const columns: ColumnDef<any>[] = [
        {
            id: "select",
            header: ({ }) => (
                <Checkbox
                    onCheckedChange={(isChecked) => {
                        setSelectedRows(isChecked ? data.map((row) => row.id) : []);
                    }}
                    checked={selectedRows.length === data.length}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={selectedRows.includes(row.original.id)}
                    onCheckedChange={() => {
                        const isSelected = selectedRows.includes(row.original.id);
                        setSelectedRows((prev) => 
                            isSelected 
                                ? prev.filter(id => id !== row.original.id) 
                                : [...prev, row.original.id]
                        );
                    }}
                    aria-label={`Select row ${row.original.id}`}
                />
            ),
        },
        { accessorKey: "date", header: "Date" },
        { accessorKey: "doctor", header: "Doctor" },
        { accessorKey: "type", header: "Type" },
        {
            id: "view",
            header: "View",
            cell: ({ row }) => (
                <Button variant="ghost" onClick={() => {
                    setSelectedDocumentUrl(row.original.url);
                    setIsModalOpen(true);
                }}>
                    <Eye />
                </Button>
            ),
        },
        {
            id: "generateSummary",
            header: "Generate Summary",
            cell: ({ row }) => (
                <Button variant="outline" onClick={() => generateSummary([row.original.url])}>
                    Generate Summary
                </Button>
            ),
        },
    ];

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    const generateSummary = async (urls: string[]) => {
        const dataToSend = { pdf_urls: urls };
    
        try {
            const response = await axios.post(`${import.meta.env.VITE_MODEL_API_URL}/summarize`, dataToSend);
            console.log("Summaries generated:", response.data);
            // Here you might need to adjust this based on the actual response structure
            setGeneratedSummary(response.data.summary || ""); // Update this based on your actual API response
            setIsSummaryModalOpen(true); // Open the summary modal
        } catch (error) {
            console.error("Error generating summaries:", error.response ? error.response.data : error.message);
            alert("Failed to generate summaries. Please try again. " + (error.response ? error.response.data : ""));
        }
    };

    return (
        <div className="w-full">
            {/* Back Button */}
            <button className="mt-4 ml-4 p-2 bg-gray-300 hover:bg-gray-500 rounded" onClick={() => navigate(-1)}>
                🔙 Back
            </button>
            <div className="flex items-center py-4 px-10">
                <Input placeholder="Filter by doctor..." className="max-w-sm" />
            </div>
            <div className="rounded-md px-10">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Generate Summary Button for Selected */}
            <div className="flex justify-end p-4 pr-10 mr-20">
                <Button 
                    variant="outline" 
                    onClick={() => {
                        const urls = selectedRows.map(id => data.find(row => row.id === id)?.url).filter(Boolean);
                        generateSummary(urls);
                    }} 
                    disabled={selectedRows.length === 0}
                >
                    Generate Summary for Selected
                </Button>
            </div>

            {/* Modal for displaying iframe */}
            <DocumentViewerModal 
                isOpen={isModalOpen} 
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedDocumentUrl(null);
                }} 
                url={selectedDocumentUrl} 
            />

            {/* Modal for displaying summary */}
            <SummaryModal 
                isOpen={isSummaryModalOpen} 
                onClose={() => {
                    setIsSummaryModalOpen(false);
                    setGeneratedSummary(null);
                }} 
                summary={generatedSummary || ""} 
            />
        </div>
    );
}