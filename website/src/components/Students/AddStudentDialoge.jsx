import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useCreateStudentMutation } from "@/services/studentAPI";
import { useGetClassesQuery } from "@/services/classAPI";
import toast from "react-hot-toast";

export default function AddStudentDialoge({ refetch }) {

  // 🔥 dialog control (FIXED)
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [studentClass, setStudentClass] = useState("");

  // 🔥 NEW FIELDS
  const [rollNumber, setRollNumber] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");

  const [images, setImages] = useState([]);
  // const [capturedImage, setCapturedImage] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const { data: classData } = useGetClassesQuery({
    page: 1,
    limit: 100,
  });

  const classes = classData?.data?.classes || [];
  const [createStudent, { isLoading }] = useCreateStudentMutation();
const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setImages((prev) => [
    ...prev,
    {
      file,
      url: URL.createObjectURL(file),
    },
  ]);
};

  const handleCaptureFromESP = async () => {
    setIsCapturing(true);

    try {
      document.getElementById("esp-stream").src = "";
      await new Promise((res) => setTimeout(res, 500));

      const response = await axios.get("http://10.207.110.213/capture", {
        responseType: "blob",
        timeout: 10000,
      });

      const blob = response.data;

      const file = new File([blob], `esp32-${Date.now()}.jpg`, {
        type: "image/jpeg",
      });

     setImages((prev) => [
  ...prev,
  {
    file,
    url: URL.createObjectURL(blob),
  },
]);

      setTimeout(() => {
        document.getElementById("esp-stream").src =
          "http://10.207.110.213/stream";
      }, 500);

    } catch (err) {
      console.error(err);
    } finally {
      setIsCapturing(false);
    }
  };

const removeImage = (index) => {
  setImages((prev) => prev.filter((_, i) => i !== index));
};

  // 🔥 SUBMIT UPDATED
  const handleSubmit = async () => {

if (
  !name ||
  !studentClass ||
  !rollNumber ||
  !registrationNumber
) {
  toast.error("Please provide all required details");
  return;
}
if (images.length < 5) {
  toast.error("Please upload/capture at least 5 images");
  return;
}

    const formData = new FormData();
    formData.append("name", name);
    formData.append("class", studentClass);

    // 🔥 NEW FIELDS ADDED
    formData.append("rollNumber", rollNumber);
    formData.append("registrationNumber", registrationNumber);

const allImages = images.map((img) => img.file);

allImages.forEach((img) => {
  formData.append("images", img);
});

    const toastId = toast.loading("Saving student...");

    try {
      await createStudent(formData).unwrap();

      toast.success("Student added successfully", { id: toastId });

      refetch?.();

      // reset state
      setName("");
      setStudentClass("");
      setRollNumber("");
      setRegistrationNumber("");
      setImages([]);
      
      // setCapturedImage(null);

      // 🔥 PROPER CLOSE
      setOpen(false);

    } catch (err) {
      toast.error(err?.data?.message || "Failed to add student", {
        id: toastId,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary text-white px-5 py-2 rounded-xl shadow-lg">
          + Add Student
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 mt-4">

          {/* NAME */}
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          {/* ROLL NUMBER (NEW) */}
          <div>
            <Label>Roll Number</Label>
            <Input
              type="number"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
            />
          </div>

          {/* REG NUMBER (NEW) */}
          <div>
            <Label>Registration Number</Label>
            <Input
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
            />
          </div>

          {/* CLASS (UNCHANGED UI) */}
          <div className="space-y-1">
            <Label>Assign Class</Label>

            <Select
              value={studentClass}
              onValueChange={(val) => setStudentClass(val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select class" />
              </SelectTrigger>

              <SelectContent>
                {classes.map((c) => (
                  <SelectItem key={c._id} value={c._id}>
                    {c.degree.toUpperCase()} - Sem {c.semester} ({c.batchStart}-{c.batchEnd})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* STREAM (UNCHANGED) */}
          <div className="rounded-xl overflow-hidden border bg-black">
            <img
              id="esp-stream"
              src="http://10.207.110.213/stream"
              className="w-full h-64 object-cover"
            />
          </div>

          {/* IMAGE (UNCHANGED) */}
         {/* IMAGES PREVIEW */}
{images.length > 0 ? (
  <div className="flex flex-wrap gap-2">
    {images.map((img, index) => (
      <div
        key={index}
        className="relative w-32 h-32 border rounded-lg overflow-hidden"
      >
        <img src={img.url} className="w-full h-full object-cover" />

        <button
          onClick={() => removeImage(index)}
          className="absolute top-1 right-1 bg-red-500 text-white px-1 rounded"
        >
          ✕
        </button>
      </div>
    ))}
  </div>
) : (
  <label className="border-2 border-dashed h-32 flex items-center justify-center cursor-pointer">
    <input type="file" multiple hidden onChange={handleFileChange} />
    <span className="text-sm text-muted-foreground">
      Upload Images
    </span>
  </label>
)}

          {/* ACTIONS (UNCHANGED UI) */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleCaptureFromESP}
              disabled={isCapturing}
            >
              {isCapturing ? "⏳ Capturing..." : "📷 Capture from ESP32"}
            </Button>

            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Student"}
            </Button>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}