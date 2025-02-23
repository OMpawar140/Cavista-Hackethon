import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { db, imgDB } from "../../Database/FirebaseConfig";
import { ref, uploadString, getDownloadURL } from "firebase/storage"; // Import getDownloadURL to fetch the file URL
import { doc, updateDoc, getDoc } from "firebase/firestore";
import CryptoJS from "crypto-js";
import jsPDF from "jspdf"; 
import Swal from "sweetalert2"; 

export default function NewPrescription() {
    const navigate = useNavigate();
    const location = useLocation();

    const aadhaarFromState = location.state?.aadhaar || '';
    const aadhaarEncrypted = aadhaarFromState;
    const decryptedAadhaar = CryptoJS.SHA256(aadhaarEncrypted).toString();

    const maskedAadhaar = () => {
        const lastFour = aadhaarEncrypted.slice(-4);
        return "xxxxxxxx" + lastFour;
    };

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
        const { name, value } = e.target;
        setPrescription((prev) => ({ ...prev, [name]: value }));
    };

    const handleMedicationChange = (index: number, field: keyof typeof prescription.medications[number], value: string) => {
        const updatedMeds = [...prescription.medications];
        updatedMeds[index][field] = value;
        setPrescription((prev) => ({ ...prev, medications: updatedMeds }));
    };

    const addMedication = () => {
        setPrescription((prev) => ({
            ...prev,
            medications: [...prev.medications, { name: "", dose: "", timeToEat: "" }],
        }));
    };

    const removeMedication = (index: number) => {
        const updatedMeds = prescription.medications.filter((_, i) => i !== index);
        setPrescription((prev) => ({ ...prev, medications: updatedMeds }));
    };

    const generateAndUploadPDF = async () => {
        const doc = new jsPDF();

        // PDF content
        doc.text(`Aadhaar No: ${maskedAadhaar()}`, 10, 10);
        doc.text(`Symptoms: ${prescription.symptoms}`, 10, 20);
        doc.text(`Diagnosis: ${prescription.diagnosis}`, 10, 30);
        doc.text(`Height: ${prescription.height}`, 10, 40);
        doc.text(`Weight: ${prescription.weight}`, 10, 50);
        doc.text(`Blood Group: ${prescription.bloodGroup}`, 10, 60);
        prescription.medications.forEach((med, index) => {
            doc.text(`Medication ${index + 1}: ${med.name}, Dose: ${med.dose}, Time: ${med.timeToEat}`, 10, 70 + (index * 10));
        });
        doc.text(`Next Appointment with ${prescription.nextAppointment.doctor} (${prescription.nextAppointment.specialty}) on ${prescription.nextAppointment.date}`, 10, 90);
        doc.text(`Doctor Notes: ${prescription.doctorNotes}`, 10, 100);

        const pdfData = doc.output('datauristring');
        const pdfBlob = pdfData.split(',')[1];
        const pdfRef = ref(imgDB, `Sasoon Pune/prescription_${aadhaarEncrypted}_${Date.now()}.pdf`);

        // Upload the PDF data to Firebase Storage
        await uploadString(pdfRef, pdfBlob, 'base64', { contentType: 'application/pdf' });

        // Fetch the download URL of the uploaded PDF
        const downloadURL = await getDownloadURL(pdfRef);
        return downloadURL; // This will return the URL for the uploaded PDF
    };

    const handleSubmit = async () => {
        try {
            const pdfUrl = await generateAndUploadPDF(); // Store the returned PDF URL
            const patientDocRef = doc(db, "patients", decryptedAadhaar);
            const patientDoc = await getDoc(patientDocRef);

            const doctorName = prescription.nextAppointment.doctor;
            const prescriptionType = `Prescription_${Date.now()}_${doctorName}`;
            const date = prescription.nextAppointment.date;

            const fileDetails = {
                url: pdfUrl, // Use the pdfUrl here
                doctor: doctorName,
                type: prescriptionType,
                date,
            };

            // Update the patient document with the new file URL
            await updateDoc(patientDocRef, {
                fileUrls: [...(patientDoc.data()?.fileUrls ?? []), fileDetails],
            });

            await Swal.fire({
                icon: 'success',
                title: 'Uploaded!',
                text: 'File has been uploaded successfully.',
                confirmButtonText: 'OK'
            });
            console.log("Prescription submitted:", prescription);
            navigate(`/all-patient-details/${decryptedAadhaar}` , { state: { aadhaar: decryptedAadhaar } });
        } catch (error) {
            console.error("Error uploading PDF:", error);
            await Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to upload the prescription. Please try again.',
                confirmButtonText: 'OK'
            });
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen p-6 bg-gray-100 dark:bg-black text-black dark:text-white">
            <Card className="w-full max-w-2xl bg-white dark:bg-gray-900 shadow-lg rounded-xl p-6">
                <h1 className="text-2xl font-semibold text-center mb-4">📝 New Prescription</h1>

                <CardContent className="space-y-4">
                    <p className="text-lg font-medium">Aadhaar No: {maskedAadhaar()}</p>

                    <Input
                        type="text"
                        name="symptoms"
                        placeholder="Enter Symptoms"
                        value={prescription.symptoms}
                        onChange={handleChange}
                        className="p-3 border rounded-md bg-gray-200 dark:bg-gray-800 dark:border-gray-700"
                    />

                    <Input
                        type="text"
                        name="diagnosis"
                        placeholder="Enter Diagnosis"
                        value={prescription.diagnosis}
                        onChange={handleChange}
                        className="p-3 border rounded-md bg-gray-200 dark:bg-gray-800 dark:border-gray-700"
                    />

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

                    <Select onValueChange={(value) => setPrescription((prev) => ({ ...prev, bloodGroup: value }))}>
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

                    <h3 className="text-lg font-medium">📅 Next Appointment</h3>
                    <div className="flex gap-4">
                        <Input
                            type="text"
                            name="doctor"
                            placeholder="Doctor's Name"
                            value={prescription.nextAppointment.doctor}
                            onChange={(e) => setPrescription((prev) => ({ ...prev, nextAppointment: { ...prev.nextAppointment, doctor: e.target.value } }))}
                            className="p-3 border rounded-md bg-gray-200 dark:bg-gray-800 dark:border-gray-700"
                        />
                        <Input
                            type="text"
                            name="specialty"
                            placeholder="Specialty (e.g., Cardiologist)"
                            value={prescription.nextAppointment.specialty}
                            onChange={(e) => setPrescription((prev) => ({ ...prev, nextAppointment: { ...prev.nextAppointment, specialty: e.target.value } }))}
                            className="p-3 border rounded-md bg-gray-200 dark:bg-gray-800 dark:border-gray-700"
                        />
                    </div>
                    <Input
                        type="date"
                        name="date"
                        value={prescription.nextAppointment.date}
                        onChange={(e) => setPrescription((prev) => ({ ...prev, nextAppointment: { ...prev.nextAppointment, date: e.target.value } }))}
                        className="p-3 border rounded-md bg-gray-200 dark:bg-gray-800 dark:border-gray-700"
                    />

                    <h3 className="text-lg font-medium">📝 Doctor Notes</h3>
                    <Textarea name="doctorNotes" value={prescription.doctorNotes} onChange={handleChange} placeholder="Enter Notes" className="p-3 border rounded-md bg-gray-200 dark:bg-gray-800 dark:border-gray-700" />

                    <Button className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={handleSubmit}>✅ Submit Prescription</Button>
                </CardContent>
            </Card>
        </div>
    );
}