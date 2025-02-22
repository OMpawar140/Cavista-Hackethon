import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function NewPrescription() {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const aadhaar = queryParams.get("aadhaar");

    const [prescription, setPrescription] = useState({
        symptoms: "",
        diagnosis: "",
        height: "",
        weight: "",
        bloodGroup: "",
        medications: [{ name: "", dose: "", timeToEat: "" }],
        nextAppointment: { doctor: "", specialty: "", date: "" },
        doctorNotes: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setPrescription({ ...prescription, [e.target.name]: e.target.value });
    };

    type MedicationField = "name" | "dose" | "timeToEat";

    const handleMedicationChange = (index: number, field: MedicationField, value: string) => {
        const updatedMeds = [...prescription.medications];
        updatedMeds[index][field] = value;
        setPrescription({ ...prescription, medications: updatedMeds });
    };

    const addMedication = () => {
        setPrescription({
            ...prescription,
            medications: [...prescription.medications, { name: "", dose: "", timeToEat: "" }],
        });
    };

    const removeMedication = (index: number) => {
        const updatedMeds = prescription.medications.filter((_, i) => i !== index);
        setPrescription({ ...prescription, medications: updatedMeds });
    };

    const handleSubmit = () => {
        console.log("Prescription submitted:", prescription);
        navigate("/patient-search"); // Redirecting back after submission
    };

    return (
        <div className="flex flex-col items-center min-h-screen p-6 bg-gray-100 dark:bg-black text-black dark:text-white">
            <Card className="w-full max-w-2xl bg-white dark:bg-gray-900 shadow-lg rounded-xl p-6">
                <h1 className="text-2xl font-semibold text-center mb-4">📝 New Prescription</h1>

                <CardContent className="space-y-4">
                    <p className="text-lg font-medium">Aadhaar No: {aadhaar}</p>

                    {/* Symptoms */}
                    <Input
                        type="text"
                        name="symptoms"
                        placeholder="Enter Symptoms"
                        value={prescription.symptoms}
                        onChange={handleChange}
                        className="p-3 border rounded-md bg-gray-200 dark:bg-gray-800 dark:border-gray-700"
                    />

                    {/* Diagnosis */}
                    <Input
                        type="text"
                        name="diagnosis"
                        placeholder="Enter Diagnosis"
                        value={prescription.diagnosis}
                        onChange={handleChange}
                        className="p-3 border rounded-md bg-gray-200 dark:bg-gray-800 dark:border-gray-700"
                    />

                    {/* Height & Weight */}
                    <div className="flex gap-4">
                        <Input
                            type="text"
                            name="height"
                            placeholder="Height (cm)"
                            value={prescription.height}
                            onChange={handleChange}
                            className="p-3 border rounded-md bg-gray-200 dark:bg-gray-800 dark:border-gray-700"
                        />
                        <Input
                            type="text"
                            name="weight"
                            placeholder="Weight (kg)"
                            value={prescription.weight}
                            onChange={handleChange}
                            className="p-3 border rounded-md bg-gray-200 dark:bg-gray-800 dark:border-gray-700"
                        />
                    </div>

                    {/* Blood Group */}
                    <Select onValueChange={(value) => setPrescription({ ...prescription, bloodGroup: value })}>
                        <SelectTrigger className="w-full p-3 border rounded-md bg-gray-200 dark:bg-gray-800 dark:border-gray-700">
                            <SelectValue placeholder="Select Blood Group" />
                        </SelectTrigger>
                        <SelectContent>
                            {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((group) => (
                                <SelectItem key={group} value={group}>
                                    {group}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Medications List */}
                    <h3 className="text-lg font-medium">💊 Medications</h3>
                    {prescription.medications.map((med, index) => (
                        <div key={index} className="flex gap-2 items-center">
                            <Input
                                type="text"
                                placeholder="Medicine Name"
                                value={med.name}
                                onChange={(e) => handleMedicationChange(index, "name", e.target.value)}
                                className="p-3 border rounded-md bg-gray-200 dark:bg-gray-800 dark:border-gray-700"
                            />
                            <Input
                                type="text"
                                placeholder="Dose (mg)"
                                value={med.dose}
                                onChange={(e) => handleMedicationChange(index, "dose", e.target.value)}
                                className="p-3 border rounded-md bg-gray-200 dark:bg-gray-800 dark:border-gray-700"
                            />
                            <Input
                                type="text"
                                placeholder="Time to Eat (e.g., Morning)"
                                value={med.timeToEat}
                                onChange={(e) => handleMedicationChange(index, "timeToEat", e.target.value)}
                                className="p-3 border rounded-md bg-gray-200 dark:bg-gray-800 dark:border-gray-700"
                            />
                            <Button className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded" onClick={() => removeMedication(index)}>❌</Button>
                        </div>
                    ))}
                    <Button className="mt-2 bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded" onClick={addMedication}>➕ Add Medication</Button>

                    {/* Next Appointment */}
                    <h3 className="text-lg font-medium">📅 Next Appointment</h3>
                    <div className="flex gap-4">
                        <Input
                            type="text"
                            name="doctor"
                            placeholder="Doctor's Name"
                            value={prescription.nextAppointment.doctor}
                            onChange={(e) => setPrescription({ ...prescription, nextAppointment: { ...prescription.nextAppointment, doctor: e.target.value } })}
                            className="p-3 border rounded-md bg-gray-200 dark:bg-gray-800 dark:border-gray-700"
                        />
                        <Input
                            type="text"
                            name="specialty"
                            placeholder="Specialty (e.g., Cardiologist)"
                            value={prescription.nextAppointment.specialty}
                            onChange={(e) => setPrescription({ ...prescription, nextAppointment: { ...prescription.nextAppointment, specialty: e.target.value } })}
                            className="p-3 border rounded-md bg-gray-200 dark:bg-gray-800 dark:border-gray-700"
                        />
                    </div>
                    <Input
                        type="date"
                        name="date"
                        value={prescription.nextAppointment.date}
                        onChange={(e) => setPrescription({ ...prescription, nextAppointment: { ...prescription.nextAppointment, date: e.target.value } })}
                        className="p-3 border rounded-md bg-gray-200 dark:bg-gray-800 dark:border-gray-700"
                    />

                    {/* Doctor Notes */}
                    <h3 className="text-lg font-medium">📝 Doctor Notes</h3>
                    <Select onValueChange={(value) => setPrescription({ ...prescription, doctorNotes: value })}>
                        <SelectTrigger className="w-full p-3 border rounded-md bg-gray-200 dark:bg-gray-800 dark:border-gray-700">
                            <SelectValue placeholder="Select N/A or enter manually" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="N/A">N/A</SelectItem>
                        </SelectContent>
                    </Select>
                    <Textarea name="doctorNotes" value={prescription.doctorNotes} onChange={handleChange} placeholder="Enter Notes" className="p-3 border rounded-md bg-gray-200 dark:bg-gray-800 dark:border-gray-700" />

                    <Button className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={handleSubmit}>✅ Submit Prescription</Button>
                </CardContent>
            </Card>
        </div>
    );
}
