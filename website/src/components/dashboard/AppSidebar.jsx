import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useLocation } from "react-router-dom";
import { Home, Users, Book, BarChart } from "lucide-react";
import { NavLink } from "react-router-dom";

import { sidebarConfig } from "@/config/sidebarConfig";
import { useSelector } from "react-redux";
import { useGetProfileQuery } from "@/services/authAPI";
const AppSidebar = () => {
  const location = useLocation();
  const role = useSelector((state) => state.auth.user?.role);
  const id = useSelector((state) => state.auth.user?.id);
  const { data } = useGetProfileQuery(id);
  const profile = data?.data || {};
  // console.log("Profile Data:", data);
  const menuItems = sidebarConfig[role] || [];
  return (
    <Sidebar className="bg-white text-slate-900 border-r border-slate-200">
      {/* HEADER */}
      <div className="flex items-center gap-3 px-4 py-6">
        <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
          <span className="material-symbols-outlined text-white">
            auto_videocam
          </span>
        </div>

        <div>
          <h1 className="text-lg font-bold tracking-tight">Attendance AI</h1>
          <p className="text-[10px] uppercase tracking-widest text-slate-500">
            Enterprise Admin
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-500 px-4">
            Dashboard
          </SidebarGroupLabel>

          <SidebarMenu>
            {menuItems.map((item, index) => {
              const Icon = item.icon;

              return (
          <SidebarMenuItem key={index}>
  <SidebarMenuButton asChild>
   <NavLink
  to={item.path}
  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
    location.pathname === item.path
      ? "bg-blue-600 text-white shadow-md"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
  }`}
>
  <Icon
    className={`w-4 h-4 ${
      location.pathname === item.path
        ? "text-white"
        : "text-slate-500"
    }`}
  />
  <span>{item.label}</span>
</NavLink>
  </SidebarMenuButton>
</SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter>
        <div className="p-4 m-2 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex items-center gap-3">
            {/* <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-blue-500">
              <img
                src="https://i.pravatar.cc/100"
                alt="user"
                className="h-full w-full object-cover"
              />
            </div> */}

            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate">{profile.name}</p>
              <p className="text-xs text-slate-500">{profile.email}</p>
              <p className="text-xs text-slate-500">
                {profile?.role?.toUpperCase() || ""}
              </p>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
