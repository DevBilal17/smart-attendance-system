import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { skipToken } from "@reduxjs/toolkit/query";
import {
  useStartSessionMutation,
  useStopSessionMutation,
  useMarkAttendanceMutation,
} from "@/services/attendanceAPI";
import { useGetClassesQuery } from "@/services/classAPI";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useGetTimetablesQuery } from "@/services/timetableAPI";
import { ESP_URL } from "@/utils/constant";

export default function AttendancePage() {
  const user = useSelector((state) => state.auth.user);

  const [selectedClass, setSelectedClass] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [streamOn, setStreamOn] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);

  const [activeLecture, setActiveLecture] = useState(null);

  // APIs
  const { data: classesData } = useGetClassesQuery();

  const {
    data: timetableData,
    isLoading,
  } = useGetTimetablesQuery(
    selectedClass ? { classId: selectedClass } : skipToken
  );

  const [startSession] = useStartSessionMutation();
  const [stopSession] = useStopSessionMutation();
  const [markAttendance, { isLoading: marking }] =
    useMarkAttendanceMutation();

  const classes = classesData?.data?.classes || [];

  // 📅 Today day
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });

  // 🎯 Today's lectures from timetable
  const todayLectures =
    timetableData?.data?.filter((t) =>
      t.sessions.some((s) => s.day === today)
    ) || [];

  // reset
  const resetAll = () => {
    setSessionId(null);
    setStreamOn(false);
    setSessionStarted(false);
    setActiveLecture(null);

    const stream = document.getElementById("camera-stream");
    if (stream) stream.src = "";
  };

  // ▶ START SESSION (from timetable lecture)
const handleStartSession = async (lecture, session, index) => {
  try {
    const res = await startSession({
      timetable: lecture._id,        // ✅ IMPORTANT
      sessionIndex: index,           // ✅ which slot in array
      date: new Date(),              // ✅ today
    }).unwrap();

    setSessionId(res.data._id);
    setActiveLecture({ lecture, session, index });
    setSessionStarted(true);
    setStreamOn(true);

    toast.success(`Started ${lecture.subject.name}`);
  } catch (err) {
    toast.error(err?.data?.message || "Failed to start session");
  }
};

  // ⏹ STOP SESSION
  const handleStopSession = async () => {
    try {
      await stopSession({ sessionId }).unwrap();

      toast.success("Session stopped");
      resetAll();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to stop session");
    }
  };

  // 📸 MARK ATTENDANCE
  const handleMarkAttendance = async () => {
    try {
      const stream = document.getElementById("camera-stream");
      if (stream) stream.src = "";
      setStreamOn(false);

      const response = await fetch(`http://${ESP_URL}/capture`);
      const blob = await response.blob();

      const file = new File([blob], "attendance.jpg", {
        type: "image/jpeg",
      });

      const formData = new FormData();
      formData.append("image", file);
      formData.append("classId", selectedClass);
      formData.append("subjectId", activeLecture.lecture.subject._id);
      formData.append("teacherId", user.id);

      const res = await markAttendance(formData).unwrap();

      toast.success(res.message);

      setTimeout(() => setStreamOn(true), 500);
    } catch (err) {
      toast.error(err?.data?.message || "Error marking attendance");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold">Attendance System</h2>
          <p className="text-muted-foreground">
            Timetable-based attendance marking
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleStopSession}
            disabled={!sessionStarted}
          >
            ⏹ Stop Session
          </Button>
        </div>
      </div>

      {/* CLASS SELECT */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger>
              <SelectValue placeholder="Select Class" />
            </SelectTrigger>

            <SelectContent>
              {classes.map((c) => (
                <SelectItem key={c._id} value={c._id}>
                  {c.degree} - Sem {c.semester}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* TODAY LECTURES */}
      {selectedClass && (
        <Card className="mb-6">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-bold text-lg">
              Today's Lectures ({today})
            </h3>

            {isLoading && <p>Loading timetable...</p>}

            {!isLoading && todayLectures.length === 0 && (
              <p className="text-gray-500">No lectures today</p>
            )}

          {todayLectures.map((lecture) =>
  lecture.sessions
    .map((session, index) => {
      if (session.day !== today) return null;

      return (
        <div key={index} className="border p-4 flex justify-between">
          
          <div>
            <p className="font-bold">{lecture.subject?.name}</p>
            <p className="text-sm">
              {session.startTime} - {session.endTime}
            </p>
          </div>

          <Button
            disabled={sessionStarted}
            onClick={() =>
              handleStartSession(lecture, session, index)
            }
          >
            ▶ Start
          </Button>

        </div>
      );
    })
)}
          </CardContent>
        </Card>
      )}

      {/* CAMERA */}
      <Card>
        <CardContent className="p-6">
          <div className="bg-black h-[450px] flex items-center justify-center rounded-lg">
            {streamOn ? (
              <img
                id="camera-stream"
                src={`http://${ESP_URL}/stream`}
                className="w-full h-full object-cover"
              />
            ) : (
              <p className="text-white opacity-60">
                Camera Off
              </p>
            )}
          </div>

          <div className="mt-4 flex justify-center">
            <Button
              onClick={handleMarkAttendance}
              disabled={!sessionStarted || marking}
            >
              {marking ? "Processing..." : "📸 Mark Attendance"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}