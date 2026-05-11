import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/dashboard/AppSidebar";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/slices/authSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
const DashboardLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const role = useSelector((state) => state.auth.user?.role);
  const handleLogout = () => {
    // 1. clear redux state
    dispatch(logout());

    // 2. clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    // 3. redirect to login
    navigate("/login");

    // optional toast
    toast.success("Logged out successfully");
  };
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {/* Sidebar */}
        <AppSidebar />

        {/* Main */}
        <div className="flex-1">
          {/* Topbar */}
          <div
            className="h-16 border-b flex items-center justify-between px-6 
                          bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40"
          >
            {/* LEFT SIDE */}
            <div className="flex items-center">
              <SidebarTrigger />
              <h2 className="ml-4 font-black text-lg text-slate-900">
                {role === "admin" ? "Admin" : "Teacher"} Console
              </h2>

              {/* <div className="h-6 w-px bg-slate-200 ml-4"></div> */}

              {/* <div className="ml-4 flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-100">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-xs font-semibold">
                  Camera Connected (ESP32-CAM-01)
                </span>
              </div> */}
            </div>

            {/* RIGHT SIDE */}
            <div className="flex items-center gap-6">
              {/* <div className="flex items-center gap-4 text-slate-500">
                <span className="material-symbols-outlined cursor-pointer hover:text-blue-600 transition">
                  videocam
                </span>
                <span className="material-symbols-outlined cursor-pointer hover:text-blue-600 transition">
                  notifications
                </span>
                <span className="material-symbols-outlined cursor-pointer hover:text-blue-600 transition">
                  settings
                </span>
              </div> */}
              <button
                onClick={handleLogout}
                className="bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold px-4 py-2 rounded-lg text-sm transition"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Content */}
          <main className="p-6 bg-slate-50 min-h-[calc(100vh-64px)]">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
