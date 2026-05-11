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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { format } from "date-fns";

import {
  useCreateClassMutation,
  useUpdateClassMutation,
} from "@/services/classAPI";

const initialState = {
  degree: "",
  semester: "",
  batchStart: "",
  batchEnd: "",
  session: "",
  startDate: null,
  endDate: null,
};

export default function CreateClassDialog({
  editData = null,
  trigger,
  open,
  setOpen,
}) {
  const isEdit = !!editData;

  const [form, setForm] = useState(initialState);

  const [createClass, { isLoading }] = useCreateClassMutation();
  const [updateClass, { isLoading: isUpdating }] =
    useUpdateClassMutation();

  // fill form when editing
  useEffect(() => {
    if (editData) {
      setForm({
        degree: editData.degree || "",
        semester: String(editData.semester || ""),
        batchStart: editData.batchStart || "",
        batchEnd: editData.batchEnd || "",
        session: editData.session || "",
        startDate: editData.startDate
          ? new Date(editData.startDate)
          : null,
        endDate: editData.endDate
          ? new Date(editData.endDate)
          : null,
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

    if (!val) {
      resetForm();
    }
  };

  const handleSubmit = async () => {
    try {
      if (!form.degree || !form.semester) {
        return toast.error("Please fill required fields");
      }

      if (isEdit) {
        await updateClass({
          id: editData._id,
          body: form,
        }).unwrap();

        toast.success("Class updated successfully!");
      } else {
        await createClass(form).unwrap();
        toast.success("Class created successfully!");
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
        {trigger || <Button>+ Create Class</Button>}
      </DialogTrigger>

      {/* CONTENT */}
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">

        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Update Class" : "Create New Class"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">

          {/* DEGREE */}
          <div>
            <label className="text-sm font-medium mb-1 block">
              Degree
            </label>
            <Select
              value={form.degree}
              onValueChange={(val) =>
                handleChange("degree", val)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select degree" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bs">BS</SelectItem>
                <SelectItem value="ms">MS</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* SEMESTER */}
          <div>
            <label className="text-sm font-medium mb-1 block">
              Semester
            </label>
            <Select
              value={form.semester}
              onValueChange={(val) =>
                handleChange("semester", val)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select semester" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <SelectItem key={s} value={String(s)}>
                    Semester {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* BATCH */}
          <div className="grid grid-cols-2 gap-3">
            <Input
              type="number"
              placeholder="Start Year"
              value={form.batchStart}
              onChange={(e) =>
                handleChange("batchStart", e.target.value)
              }
            />
            <Input
              type="number"
              placeholder="End Year"
              value={form.batchEnd}
              onChange={(e) =>
                handleChange("batchEnd", e.target.value)
              }
            />
          </div>

          {/* SESSION */}
          <Select
            value={form.session}
            onValueChange={(val) =>
              handleChange("session", val)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Session" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="morning">Morning</SelectItem>
              <SelectItem value="evening">Evening</SelectItem>
              <SelectItem value="bridging">Bridging</SelectItem>
              <SelectItem value="shifted">Shifted</SelectItem>
            </SelectContent>
          </Select>

          {/* START DATE */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full">
                {form.startDate
                  ? format(form.startDate, "PPP")
                  : "Semester Start Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={form.startDate}
                onSelect={(d) =>
                  handleChange("startDate", d)
                }
              />
            </PopoverContent>
          </Popover>

          {/* END DATE */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full">
                {form.endDate
                  ? format(form.endDate, "PPP")
                  : "Semester End Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={form.endDate}
                onSelect={(d) =>
                  handleChange("endDate", d)
                }
              />
            </PopoverContent>
          </Popover>

        </div>

        {/* ACTIONS */}
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleClose(false)}
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={isLoading || isUpdating}
          >
            {isEdit
              ? isUpdating
                ? "Updating..."
                : "Update"
              : isLoading
              ? "Saving..."
              : "Save"}
          </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}