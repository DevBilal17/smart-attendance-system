import React from "react";
import Login from "./pages/Login";
import { Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import Home from "./pages/Home";
import Students from "./pages/Students";
import Teachers from "./pages/Teachers";
import Classes from "./pages/Classes";
import Reports from "./pages/Reports";
import Subjects from "./pages/Subjects";
import TeachersHome from "./pages/TeachersHome";
import AttendancePage from "./pages/AttendancePage";
import ProtectedRoutes from "./pages/ProtectedRoutes";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/slices/authSlice";
import { useSelector } from "react-redux";
import TeacherReports from "./pages/TeacherReports";
import TeachersStudents from "./pages/TeachersStudents";
import TeachersClasses from "./pages/TeachersClasses";
import TimetablePage from "./pages/TimeTable";
import AdminReports from "./pages/AdminReports";

const App = () => {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.user?.role);
  // 🔐 Rehydrate auth on refresh
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    const userId = localStorage.getItem("userId");
    if (token && storedRole) {
      dispatch(
        setCredentials({
          token,
          user: { role: storedRole, id: userId },
        }),
      );
    }
  }, [dispatch]);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            role === "admin" ? (
              <Navigate to="/dashboard" />
            ) : role === "teacher" ? (
              <Navigate to="/teacher" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/login" element={<Login />} />

        {/* Dashboard (Protected Layout) */}
        {/* ADMIN ROUTES */}
        <Route element={<ProtectedRoutes allowedRoles={["admin"]} />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Home />} />
            <Route path="students" element={<Students />} />
            <Route path="teachers" element={<Teachers />} />
            <Route path="subjects" element={<Subjects />} />
            <Route path="classes" element={<Classes />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="timetable" element={<TimetablePage />} />
          </Route>
        </Route>

        {/* TEACHER ROUTES */}

        <Route element={<ProtectedRoutes allowedRoles={["teacher"]} />}>
          <Route path="/teacher" element={<DashboardLayout />}>
            <Route index element={<TeachersHome />} />
            <Route path="attendance" element={<AttendancePage />} />
            <Route path="classes" element={<TeachersClasses />} />

            <Route path="students" element={<TeachersStudents />} />
            <Route path="reports" element={<TeacherReports />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </>
  );
};

export default App;
