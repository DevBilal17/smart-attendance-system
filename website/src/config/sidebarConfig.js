import {
  Home,
  Users,
  BookOpen,
  BookMarked,
  ClipboardList,
  BarChart3,
  GraduationCap,
  Calendar,
  FileText,
} from "lucide-react";

export const sidebarConfig = {
  admin: [
    { label: "Dashboard", path: "/dashboard", icon: Home },

    { label: "Students", path: "/dashboard/students", icon: Users },

    { label: "Subjects", path: "/dashboard/subjects", icon: BookMarked },

    { label: "Teachers", path: "/dashboard/teachers", icon: GraduationCap },

    { label: "Classes", path: "/dashboard/classes", icon: BookOpen },

    { label: "Reports", path: "/dashboard/reports", icon: BarChart3 },

    { label: "Timetable", path: "/dashboard/timetable", icon: Calendar }
  ],

  teacher: [
    { label: "Dashboard", path: "/teacher", icon: Home },

    { label: "My Classes", path: "/teacher/classes", icon: BookOpen },

    { label: "Students", path: "/teacher/students", icon: Users },

     { label: "Attendance", path: "/teacher/attendance", icon: Calendar },
     { label: "Reports", path: "/teacher/reports", icon: FileText },
  ],
};