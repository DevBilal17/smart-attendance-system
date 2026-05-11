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
import {
  useCreateTimetableMutation,
  useUpdateTimetableMutation,
} from "@/services/timetableAPI";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// import {
//   useCreateTimetableMutation,
//   useUpdateTimetableMutation,
// } from "@/services/timetableAPI";

// 🔥 INITIAL STATE
const initialState = {
  classId: "",
  subjectId: "",
  teacherId: "",
  room: "",
  sessions: [],
};

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function AddTimeTableDialog({
  editData = null,
  trigger,
  open,
  setOpen,
  classes = [],
  subjects = [],
  teachers = [],
}) {
  const isEdit = !!editData;

  const [form, setForm] = useState(initialState);
  const [createTimetable, { isLoading }] = useCreateTimetableMutation();
  const [updateTimetable, { isLoading: isUpdating }] =
    useUpdateTimetableMutation();

  // 🔁 fill edit data
useEffect(() => {
  if (editData) {
    setForm({
      classId: editData.classId?._id || "",
      subjectId: editData.subject?._id || "",
      teacherId: editData.teacher?._id || "",
      room: editData.room || "",
      sessions: editData.sessions || [],   // 🔥 FIX HERE
    });

    setOpen?.(true);
  }
}, [editData]);
const handleSubjectChange = (subjectId) => {
  handleChange("subjectId", subjectId);

  const subject = subjects.find((s) => s._id === subjectId);

  // SAFE teacher handling
  const teacherId =
    subject?.teacher?._id || subject?.teacher || "";

  if (teacherId) {
    handleChange("teacherId", teacherId);
  }

  if (subject?.creditHours) {
    const slots = Array.from({ length: subject.creditHours }, () => ({
      day: "",
      startTime: "",
      endTime: "",
    }));

    handleChange("sessions", slots);
  }
};
  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const resetForm = () => setForm(initialState);

  const handleClose = (val) => {
    setOpen?.(val);
    if (!val) resetForm();
  };

 const handleSubmit = async () => {
  if (isLoading || isUpdating) return;

  try {
    const { classId, subjectId, teacherId, sessions, room } = form;
console.log("FORM DATA:", form);
    // 🔥 basic validation
  if (!classId?.trim() || !subjectId?.trim() || !teacherId?.trim()) {
  return toast.error("Please select class, subject and teacher");
}

    if (!sessions || sessions.length === 0) {
      return toast.error("No sessions generated from credit hours");
    }

    // 🔥 session validation
    for (let i = 0; i < sessions.length; i++) {
      const s = sessions[i];

      if (!s.day || !s.startTime || !s.endTime) {
        return toast.error(`Session ${i + 1}: incomplete fields`);
      }

      if (s.startTime >= s.endTime) {
        return toast.error(`Session ${i + 1}: invalid time range`);
      }
    }

    const payload = {
      classId,
      subject: subjectId,
      teacher: teacherId,
      room: room || "N/A",
      sessions,
    };

    // 🔥 CREATE
    if (!isEdit) {
      await createTimetable(payload).unwrap();
      toast.success("Timetable created successfully!");
    }

    // 🔥 UPDATE
    else {
      await updateTimetable({
        id: editData._id,
        body: payload,
      }).unwrap();

      toast.success("Timetable updated successfully!");
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
          <Button className="rounded-xl shadow-lg">+ Add Timetable</Button>
        )}
      </DialogTrigger>

      {/* CONTENT */}
   <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">

  <DialogHeader>
    <DialogTitle className="text-xl font-semibold">
      {isEdit ? "Update Timetable" : "Create New Timetable"}
    </DialogTitle>
  </DialogHeader>

  <div className="space-y-6 mt-4">

    {/* TOP SECTION */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      {/* CLASS */}
      <Select
        value={form.classId}
        onValueChange={(val) => handleChange("classId", val)}
      >
        <SelectTrigger className="h-11">
          <SelectValue placeholder="Select Class" />
        </SelectTrigger>

        <SelectContent>
          {classes.map((c) => (
            <SelectItem key={c._id} value={c._id}>
              {c.degree.toUpperCase()} - Sem {c.semester}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* SUBJECT */}
      <Select value={form.subjectId} onValueChange={handleSubjectChange}>
        <SelectTrigger className="h-11">
          <SelectValue placeholder="Select Subject" />
        </SelectTrigger>

        <SelectContent>
          {subjects.map((s) => (
            <SelectItem key={s._id} value={s._id}>
              {s.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* TEACHER */}
      <Select
        value={form.teacherId}
        onValueChange={(val) => handleChange("teacherId", val)}
      >
        <SelectTrigger className="h-11">
          <SelectValue placeholder="Select Teacher" />
        </SelectTrigger>

        <SelectContent>
          {teachers.map((t) => (
            <SelectItem key={t._id} value={t._id}>
              {t.user?.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* ROOM */}
      <Input
        placeholder="Room (e.g. Lab 1, Room 205)"
        value={form.room}
        onChange={(e) => handleChange("room", e.target.value)}
        className="h-11"
      />

    </div>

    {/* SESSIONS SECTION */}
    <div className="border rounded-xl p-4 space-y-4 bg-muted/30">

      <div className="flex justify-between items-center">
        <h3 className="font-semibold">Class Sessions</h3>
      </div>

      {form.sessions.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Select subject to generate sessions
        </p>
      )}

      {form.sessions.map((session, index) => (
        <div
          key={index}
          className="grid grid-cols-1 md:grid-cols-4 gap-2 bg-white p-3 rounded-lg border"
        >

          {/* DAY */}
          <Select
            value={session.day}
            onValueChange={(val) => {
              const updated = [...form.sessions];
              updated[index].day = val;
              handleChange("sessions", updated);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Day" />
            </SelectTrigger>

            <SelectContent>
              {days.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* START */}
          <Input
            type="time"
            value={session.startTime}
            onChange={(e) => {
              const updated = [...form.sessions];
              updated[index].startTime = e.target.value;
              handleChange("sessions", updated);
            }}
          />

          {/* END */}
          <Input
            type="time"
            value={session.endTime}
            onChange={(e) => {
              const updated = [...form.sessions];
              updated[index].endTime = e.target.value;
              handleChange("sessions", updated);
            }}
          />

          {/* REMOVE */}
          <Button
            variant="destructive"
            onClick={() => {
              const updated = form.sessions.filter((_, i) => i !== index);
              handleChange("sessions", updated);
            }}
          >
            Remove
          </Button>

        </div>
      ))}

    </div>
  </div>

  {/* ACTIONS */}
  <DialogFooter className="mt-6 flex gap-2">
    <Button variant="outline" onClick={() => handleClose(false)}>
      Cancel
    </Button>

    <Button
      onClick={handleSubmit}
      disabled={isLoading || isUpdating}
      className="min-w-[120px]"
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
