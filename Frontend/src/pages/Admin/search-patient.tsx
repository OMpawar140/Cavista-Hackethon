import { useState  } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// Sample Data
const users = [
    {
        aadhaar: "123456789012",
        name: "Rajesh Kumar",
        age: 45,
        city: "Mumbai",
        dob: "1979-04-15",
        mobile: "9876543210",
        bloodType: "O+",
        pastDiseases: ["Diabetes", "Hypertension"],
        allergies: ["Penicillin"],
        ongoingMedication: ["Metformin", "Amlodipine"],
        bloodTests: [
            { test: "Glucose", value: "180 mg/dL", normalRange: "70-140 mg/dL" },
            { test: "Cholesterol", value: "220 mg/dL", normalRange: "<200 mg/dL" },
        ],
        scans: [
            { type: "Chest X-Ray", date: "2024-01-12", result: "Mild lung infection detected" },
            { type: "MRI Brain", date: "2023-12-05", result: "No abnormalities detected" },
        ],
        upcomingAppointments: [
            { doctor: "Dr. A. Mehta", specialty: "Cardiologist", date: "2024-03-10", nextStep: "Further ECG test advised" },
            { doctor: "Dr. R. Gupta", specialty: "Endocrinologist", date: "2024-03-18", nextStep: "Adjust diabetes medication" },
        ],
    },
    {
        aadhaar: "987654321098",
        name: "Priya Sharma",
        age: 32,
        city: "Delhi",
        dob: "1992-08-22",
        mobile: "9871234567",
        bloodType: "A-",
        pastDiseases: ["Asthma"],
        allergies: ["Peanuts"],
        ongoingMedication: ["Salbutamol"],
        bloodTests: [
            { test: "Hemoglobin", value: "12 g/dL", normalRange: "12-16 g/dL" },
            { test: "Vitamin D", value: "15 ng/mL", normalRange: "30-100 ng/mL (Low)" },
        ],
        scans: [
            { type: "CT Scan - Sinus", date: "2024-02-10", result: "Minor sinus congestion" },
        ],
        upcomingAppointments: [
            { doctor: "Dr. S. Verma", specialty: "Pulmonologist", date: "2024-03-15", nextStep: "Spirometry test recommended" },
        ],
    },
];

export default function PatientSearch() {
    const [searchAadhaar, setSearchAadhaar] = useState("");
    const [selectedUser, setSelectedUser] = useState<any | null>(null);
    const [error, setError] = useState<String | null>(null);
    const navigate = useNavigate();

    const handleSearch = () => {
        const user = users.find((u) => u.aadhaar === searchAadhaar);
        setSelectedUser(user || null);
        setError(user ? null : "No user found with this Aadhaar number");
        // navigate("/all-patient-details");

    };

    return (
        <div className="flex flex-col items-center min-h-screen p-6 bg-gray-100 dark:bg-black text-black dark:text-white">
            <Card className="w-full max-w-2xl bg-white dark:bg-gray-900 shadow-lg rounded-xl p-6">
                <h1 className="text-2xl font-semibold text-center mb-4">🔍 Patient Search</h1>
                {/* Search Bar */}
                <div className="relative flex items-center mb-4">
                    <Input
                        type="text"
                        placeholder="Enter Aadhaar Number"
                        value={searchAadhaar}
                        onChange={(e) => setSearchAadhaar(e.target.value)}
                        className="w-full p-3 text-sm border rounded-md bg-gray-200 border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-white pr-10"
                    />
                    <button
                        onClick={handleSearch}
                        className="absolute right-3 text-gray-600 dark:text-gray-300"
                    >
                        <Search size={20} />
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-100 text-red-600 border border-red-400 rounded-md p-2 mb-4">
                        {error}
                    </div>
                )}
                {/* User Info */}
                {selectedUser && (
                    <CardContent className="mt-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-medium mb-2">🧑‍⚕️ Patient Details</h2>
                                <div className="space-y-2">
                                    <p><strong>Name:</strong> {selectedUser.name}</p>
                                    <p><strong>Age:</strong> {selectedUser.age}</p>
                                    <p><strong>City:</strong> {selectedUser.city}</p>
                                    <p><strong>Date of Birth:</strong> {selectedUser.dob}</p>
                                    <p><strong>Mobile No:</strong> {selectedUser.mobile}</p>
                                    <p><strong>Blood Type:</strong> {selectedUser.bloodType}</p>
                                </div>
                            </div>
                            <Button 
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                onClick={() => navigate("/all-patient-details")}
                            >
                                View All Details
                            </Button>
                        </div>

                        {/* Medical History */}
                        <h3 className="mt-4 text-lg font-medium">📋 Medical History</h3>
                        <Table className="mt-2 border rounded-md">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Details</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Past Diseases</TableCell>
                                    <TableCell>{selectedUser.pastDiseases.join(", ") || "None"}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Allergies</TableCell>
                                    <TableCell>{selectedUser.allergies.join(", ") || "None"}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Ongoing Medication</TableCell>
                                    <TableCell>{selectedUser.ongoingMedication.join(", ") || "None"}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>

                        {/* Blood Test Results */}
                        <h3 className="mt-4 text-lg font-medium">🩸 Blood Test Results</h3>
                        <Table className="mt-2 border rounded-md">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Test</TableHead>
                                    <TableHead>Result</TableHead>
                                    <TableHead>Normal Range</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {selectedUser.bloodTests.map((test: any, index: number) => (
                                    <TableRow key={index}>
                                        <TableCell>{test.test}</TableCell>
                                        <TableCell>{test.value}</TableCell>
                                        <TableCell>{test.normalRange}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {/* Scans & Imaging */}
                        <h3 className="mt-4 text-lg font-medium">🖼️ Scans & Imaging</h3>
                        <ul className="mt-2 list-disc pl-5">
                            {selectedUser.scans.map((scan: any, index: number) => (
                                <li key={index}>
                                    <strong>{scan.type}</strong> - {scan.date} ({scan.result})
                                </li>
                            ))}
                        </ul>

                        {/* Upcoming Appointments */}
                        <h3 className="mt-4 text-lg font-medium">📅 Upcoming Appointments</h3>
                        <ul className="mt-2 list-disc pl-5">
                            {selectedUser.upcomingAppointments.map((appt: any, index: number) => (
                                <li key={index}>
                                    <strong>{appt.doctor} ({appt.specialty})</strong> - {appt.date}  
                                    <br />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Next Step: {appt.nextStep}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                )}
            </Card>
        </div>
    );
}
