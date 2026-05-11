import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import {
  useCreateTeacherMutation,
  useUpdateTeacherMutation,
} from "@/services/teacherAPI";

const initialState = {
  name: "",
  email: "",
  password: "",
  teacherId: "",
  subject: "",
  experience: "",
  status: "active", // optional if updating user
};

export default function AddTeacherDialog({
  editData = null,
  trigger,
  open,
  setOpen,
}) {
  const isEdit = !!editData;

  const [form, setForm] = useState(initialState);

  const [createTeacher, { isLoading }] = useCreateTeacherMutation();
  const [updateTeacher, { isLoading: isUpdating }] = useUpdateTeacherMutation();

  // fill data when editing
  useEffect(() => {
    if (editData) {
      setForm({
        name: editData.name || "",
        email: editData.email || "",
        teacherId: editData.teacherId || "",
        subject: editData.subject || "",
        experience: editData.experience || "",
        password: "",
        status: editData.status || "active",
      });

      setOpen?.(true);
    }
  }, [editData]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const resetForm = () => setForm(initialState);

  const handleClose = (val) => {
    setOpen?.(val);
    if (!val) resetForm();
  };

  const handleSubmit = async () => {
    try {
      if (
        !form.name ||
        !form.email ||
        !form.teacherId ||
        (!isEdit && !form.password)
      ) {
        return toast.error("Please fill required fields");
      }
      const payload = {
        name: form.name,
        email: form.email,
        teacherId: form.teacherId,
        subject: form.subject,
        experience: form.experience,
        status: form.status,
      };

      if (!isEdit) {
        payload.password = form.password;
      }
      if (isEdit) {
        await updateTeacher({
          id: editData._id,
          body: payload,
        }).unwrap();

        toast.success("Teacher updated successfully!");
      } else {
        await createTeacher(payload).unwrap();

        toast.success("Teacher created successfully!");
      }

      setOpen(false);
      resetForm();
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      {/* TRIGGER */}
      <DialogTrigger asChild>
        {trigger || (
          <Button className="rounded-xl shadow-lg">+ Add Teacher</Button>
        )}
      </DialogTrigger>

      {/* CONTENT */}
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Update Teacher" : "Add New Teacher"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <Input
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />

          <Input
            placeholder="Email Address"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
          {/* <Input
            placeholder="Subject"
            value={form.subject}
            onChange={(e) => handleChange("subject", e.target.value)}
          /> */}

          <Input
            type="number"
            placeholder="Experience (years)"
            value={form.experience}
            onChange={(e) => handleChange("experience", e.target.value)}
          />
          <Input
            placeholder="Teacher ID"
            value={form.teacherId}
            onChange={(e) => handleChange("teacherId", e.target.value)}
          />

          {/* only required on CREATE */}
          {!isEdit && (
            <Input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
            />
          )}

          {/* STATUS */}
          {/* STATUS */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant={form.status === "active" ? "default" : "outline"}
              className={`flex-1 ${
                form.status === "active"
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : ""
              }`}
              onClick={() => handleChange("status", "active")}
            >
              Active
            </Button>

            <Button
              type="button"
              variant={form.status === "inactive" ? "default" : "outline"}
              className={`flex-1 ${
                form.status === "inactive"
                  ? "bg-gray-600 hover:bg-gray-700 text-white"
                  : ""
              }`}
              onClick={() => handleChange("status", "inactive")}
            >
              Inactive
            </Button>
          </div>
        </div>

        {/* ACTIONS */}
        <DialogFooter>
          <Button variant="outline" onClick={() => handleClose(false)}>
            Cancel
          </Button>

          <Button onClick={handleSubmit} disabled={isLoading || isUpdating}>
            {isEdit
              ? isUpdating
                ? "Updating..."
                : "Update"
              : isLoading
                ? "Saving..."
                : "Save Teacher"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
