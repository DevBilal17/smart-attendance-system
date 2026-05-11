import { useState } from "react";
import toast from "react-hot-toast";

import { useGetTeachersQuery } from "@/services/teacherAPI";
import { useGetClassesQuery } from "@/services/classAPI";
import { useCreateSubjectMutation } from "@/services/subjectAPI";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AddSubjectDialog() {
  const [open, setOpen] = useState(false);

  // APIs
  const { data: teacherData } = useGetTeachersQuery({ page: 1, limit: 100 });
  const { data: classData } = useGetClassesQuery({ page: 1, limit: 100 });

  const teachers = teacherData?.data?.teachers || [];
  const classes = classData?.data?.classes || [];
  console.log(teachers);
  const [createSubject, { isLoading }] = useCreateSubjectMutation();

  const [form, setForm] = useState({
    name: "",
    code: "",
    credits: "",
    teacher: "",
    classId: "",
  });

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (!form.name || !form.code || !form.teacher || !form.classId) {
        return toast.error("Please fill all required fields");
      }
      console.log("Form Data:", form);
      await createSubject(form).unwrap();

      toast.success("Subject created successfully");

      setOpen(false);

      setForm({
        name: "",
        code: "",
        credits: "",
        teacher: "",
        classId: "",
      });
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl shadow-md">
          + Add Subject
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-6">

        <DialogHeader>
          <DialogTitle>Add New Subject</DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-5">

          {/* SUBJECT NAME */}
          <Input
            placeholder="Subject Name"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />

          {/* CODE + CREDITS */}
          <div className="grid grid-cols-2 gap-3">
            <Input
              placeholder="Code"
              value={form.code}
              onChange={(e) => handleChange("code", e.target.value)}
            />

            <Input
              placeholder="Credits"
              value={form.credits}
              onChange={(e) => handleChange("credits", e.target.value)}
            />
          </div>

          {/* CLASS DROPDOWN */}
          <div className="space-y-1">
            <Label>Assign Class</Label>

            <Select
              value={form.classId}
              onValueChange={(val) => handleChange("classId", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select class" />
              </SelectTrigger>

              <SelectContent>
                {classes.map((c) => (
                  <SelectItem key={c._id} value={c._id}>
                    {c.degree.toUpperCase()} - Sem {c.semester} (
                    {c.batchStart}-{c.batchEnd})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* TEACHER DROPDOWN */}
          <div className="space-y-1">
            <Label>Assign Teacher</Label>

            <Select
              value={form.teacher}
              onValueChange={(val) => handleChange("teacher", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select teacher" />
              </SelectTrigger>

              <SelectContent>
                {teachers.map((t) => (
                  <SelectItem key={t._id} value={t._id}>
                    {t.user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* PREVIEW */}
          {(form.name || form.classId || form.teacher) && (
            <div className="flex flex-wrap gap-2 pt-2">
              {form.name && <Badge>{form.name}</Badge>}
              {form.code && <Badge variant="secondary">{form.code}</Badge>}
            </div>
          )}
        </div>

        {/* ACTIONS */}
        <div className="px-6 py-4 border-t flex justify-end gap-2">

          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Subject"}
          </Button>

        </div>

      </DialogContent>
    </Dialog>
  );
}