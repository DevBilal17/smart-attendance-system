import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";

import AddTimeTableDialog from "@/components/TimeTable/AddTImeTableDialog";

import { useGetTeachersQuery } from "@/services/teacherAPI";
import { useGetSubjectsQuery } from "@/services/subjectAPI";
import { useGetClassesQuery } from "@/services/classAPI";
import { useGetTimetablesQuery } from "@/services/timetableAPI";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TimetablePage() {
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [classId, setClassId] = useState("");

  const { data: timetablesData, isLoading, error } =
    useGetTimetablesQuery({ classId }, { skip: false });

  const { data: teachersData } = useGetTeachersQuery();
  const { data: subjectsData } = useGetSubjectsQuery();
  const { data: classesData } = useGetClassesQuery();

  const teachers = teachersData?.data?.teachers || [];
  const subjects = subjectsData?.data?.subjects || [];
  const classes = classesData?.data?.classes || [];

  const timetable = timetablesData?.data || [];

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  // 🔥 FLATTEN ALL SESSIONS INTO GRID FRIENDLY FORMAT
  const gridData = useMemo(() => {
    const map = {};

    timetable.forEach((t) => {
      t.sessions?.forEach((s) => {
        const key = `${s.startTime}-${s.endTime}`;

        if (!map[key]) {
          map[key] = {
            time: key,
            days: {},
          };
        }

        map[key].days[s.day] = {
          subject: t.subject?.name,
          teacher: t.teacher?.user?.name,
          room: t.room,
        };
      });
    });

    return Object.values(map);
  }, [timetable]);

  if (isLoading) {
    return <div className="p-6 font-semibold">Loading Timetable...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Failed to load timetable</div>;
  }

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">

      {/* HEADER */}
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

  <div>
    <h1 className="text-3xl font-bold tracking-tight">
      Timetable Management
    </h1>
    <p className="text-sm text-muted-foreground">
      Weekly class schedule overview
    </p>
  </div>

  <AddTimeTableDialog
    open={open}
    setOpen={setOpen}
    editData={editData}
    classes={classes}
    subjects={subjects}
    teachers={teachers}
    trigger={
      <Button className="shadow-sm">
        + Add Timetable
      </Button>
    }
  />
</div>

      {/* CLASS SELECT */}
  <Card className="shadow-sm border">
  <CardContent className="p-4 flex items-center gap-4">
         <Select value={classId} onValueChange={setClassId}>
  <SelectTrigger className="w-[280px]">
    <SelectValue placeholder="Select Class" />
  </SelectTrigger>

  <SelectContent>
    {classes.map((c) => (
      <SelectItem key={c._id} value={c._id}>
        {c.degree.toUpperCase()} - Sem {c.semester} ({c.session[0].toUpperCase()})
      </SelectItem>
    ))}
  </SelectContent>
</Select>
        </CardContent>
      </Card>

      {/* GRID TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Timetable</CardTitle>
        </CardHeader>

        <CardContent className="overflow-x-auto">

          {!classId ? (
            <div className="text-center py-10 text-gray-500">
              Select a class to view timetable
            </div>
          ) : gridData.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No timetable found
            </div>
          ) : (
            <table className="w-full border-separate border-spacing-0">

              {/* HEADER */}
             <thead>
  <tr className="bg-gray-100 text-gray-700">
    <th className="p-3 text-left font-semibold rounded-tl-lg">Time</th>

    {days.map((day) => (
      <th key={day} className="p-3 text-center font-semibold">
        {day}
      </th>
    ))}
  </tr>
</thead>

              {/* BODY */}
              <tbody>
                {gridData.map((row, idx) => (
                 <tr key={idx} className="border-t hover:bg-gray-50 transition ">

                    {/* TIME SLOT */}
                   <td className="p-3 font-semibold text-gray-700 whitespace-nowrap">
  {row.time}
</td>

                    {/* DAYS */}
                    {days.map((day) => {
                      const cell = row.days[day];

                      return (
                        <td key={day} className="p-3 text-center">

                          {cell ? (
                          <div className="bg-white border rounded-lg p-2 shadow-sm hover:shadow-md transition">

  <div className="font-semibold text-blue-600 text-sm">
    {cell.subject}
  </div>

  <div className="text-xs text-gray-500 mt-1">
    👨‍🏫 {cell.teacher}
  </div>

  <div className="text-xs text-gray-400">
    📍 {cell.room}
  </div>

</div>
                          ) : (
                            <span className="text-gray-300 text-xs">—</span>
                          )}

                        </td>
                      );
                    })}

                  </tr>
                ))}
              </tbody>

            </table>
          )}

        </CardContent>
      </Card>

    </div>
  );
}