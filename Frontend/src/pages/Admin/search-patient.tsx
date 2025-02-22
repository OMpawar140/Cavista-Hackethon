import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";

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
  },
];

export default function PatientSearch() {
  const [searchAadhaar, setSearchAadhaar] = useState("");
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  const handleSearch = () => {
    const user = users.find((u) => u.aadhaar === searchAadhaar);
    setSelectedUser(user || null);
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-6 bg-gray-100 dark:bg-black text-black dark:text-white">
      <Card className="w-full max-w-2xl bg-white dark:bg-gray-900 shadow-lg rounded-xl p-6">
        <h1 className="text-2xl font-semibold text-center mb-4">🔍 Patient Search</h1>
        
        {/* Search Bar */}
        <div className="relative flex items-center">
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

        {/* User Info */}
        {selectedUser && (
          <CardContent className="mt-6">
            <h2 className="text-xl font-medium mb-2">🧑‍⚕️ Patient Details</h2>
            <div className="space-y-2">
              <p><strong>Name:</strong> {selectedUser.name}</p>
              <p><strong>Age:</strong> {selectedUser.age}</p>
              <p><strong>City:</strong> {selectedUser.city}</p>
              <p><strong>Date of Birth:</strong> {selectedUser.dob}</p>
              <p><strong>Mobile No:</strong> {selectedUser.mobile}</p>
              <p><strong>Blood Type:</strong> {selectedUser.bloodType}</p>
            </div>

            {/* Medical Records */}
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
          </CardContent>
        )}

        {/* No results */}
        {searchAadhaar && !selectedUser && (
          <p className="mt-4 text-red-500 text-center">No patient found for this Aadhaar number.</p>
        )}
      </Card>
    </div>
  );
}
