import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import AddStudentDialoge from "@/components/Students/AddStudentDialoge";
import { useGetStudentsQuery } from "@/services/studentAPI";
import { useState } from "react";
import { BASE_URL } from "@/utils/constant";

export default function StudentsPage() {
  const [page, setPage] = useState(1);
  // 🔥 RTK QUERY
  const { data, isLoading, isError, refetch  } = useGetStudentsQuery({
    page,
    limit: 10,
  });
  console.log("📊Student Data:", data);
  const students = data?.data?.students || [];
  const pagination = data?.data?.pagination;
  console.log("📊Students:", students);
  // LOADING STATE
  if (isLoading) {
    return (
      <div className="p-container-margin flex items-center justify-center h-screen">
        <p className="text-lg text-muted-foreground">Loading students...</p>
      </div>
    );
  }

  // ERROR STATE
  if (isError) {
    return (
      <div className="p-container-margin flex items-center justify-center h-screen text-red-500">
        Failed to load students
      </div>
    );
  }

  return (
    <div className="p-container-margin space-y-stack-lg bg-background min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">
            Student Directory
          </h1>
          <p className="text-sm text-on-surface-variant">
            Manage enrollments, biometric data, and academic records
          </p>
        </div>

        <div className="flex gap-2 items-center">
          <Button variant="outline" className="rounded-lg">
            Last 7 Days
          </Button>

          <Button
            variant="outline"
            className="rounded-lg border-primary text-primary hover:bg-primary/10"
          >
            Export Data
          </Button>

          <AddStudentDialoge refetch={refetch} />
        </div>
      </div>

      {/* SEARCH */}
      <div className="relative max-w-md my-4">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
          search
        </span>
        <Input
          placeholder="Search student records..."
          className="pl-10 rounded-full border bg-surface-container-low focus:ring-2 focus:ring-primary-container"
        />
      </div>

      {/* GRID */}
      <div className="grid gap-gutter">
        <div className="col-span-12 xl:col-span-8">
          <Card className="bg-surface-container-lowest border border-slate-200 rounded-xl shadow-[0_4px_6px_rgba(59,130,246,0.08)] overflow-hidden">
            {/* HEADER */}
            <CardHeader className="flex flex-row items-center justify-between bg-white border-b border-slate-100 px-6 py-4">
              <CardTitle className="text-title-md text-on-surface">
                Registered Students
              </CardTitle>

              <div className="flex gap-2">
                <Button className="p-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600">
                  <span className="material-symbols-outlined text-[18px]">
                    filter_list
                  </span>
                </Button>

                <Button className="p-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600">
                  <span className="material-symbols-outlined text-[18px]">
                    download
                  </span>
                </Button>
              </div>
            </CardHeader>

            {/* TABLE */}
            <CardContent className="p-0">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low/50">
                    <th className="px-6 py-4 text-label-caps text-on-surface-variant">
                      Student Name
                    </th>
                    <th className="px-6 py-4 text-label-caps text-on-surface-variant">
                      Class
                    </th>
                        <th className="px-6 py-4 text-label-caps text-on-surface-variant">
                      Roll Number
                    </th>
                    <th className="px-6 py-4 text-label-caps text-on-surface-variant">
                      Registration Date
                    </th>
                    <th className="px-6 py-4 text-right text-label-caps text-on-surface-variant">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {students.map((s) => (
                    <tr
                      key={s._id}
                      className="group hover:bg-slate-50 transition"
                    >
                      {/* NAME */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={`${BASE_URL}/${s.images[0]?.url}`}
                            className="w-8 h-8 rounded-full"
                            alt="student"
                          />
                          <span className="text-sm font-medium text-on-surface">
                            {s.name}
                          </span>
                        </div>
                      </td>

                      {/* CLASS */}
                      <td className="px-6 py-4 text-sm text-on-surface-variant">
                        {s.class?.degree?.toUpperCase()} - Sem{" "}
                        {s.class?.semester} ({s.class?.batchStart}-{s.class?.batchEnd})
                      </td>

                        {/* ROLL NUMBER */}
                      <td className="px-6 py-4 text-sm text-on-surface-variant">
                        {s.rollNumber}
                      </td>

                      {/* DATE */}
                      <td className="px-6 py-4 text-sm text-on-surface-variant">
                        {new Date(s.createdAt).toLocaleDateString()}
                      </td>

                      {/* ACTION */}
                       <td className="text-right space-x-2">
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                       
                      >
                        Delete
                      </Button>
                    </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* FOOTER */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between">
                <span className="text-body-sm text-on-surface-variant">
                  Showing {students.length} students
                </span>

                <div className="flex gap-2">
                  <Button className="border border-slate-200 bg-white hover:bg-slate-50 text-sm">
                    Previous
                  </Button>
                  <Button className="border border-slate-200 bg-white hover:bg-slate-50 text-sm">
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


//  i think you forget that we already made the sidebar just to make the content of main page inside this and also make this with the shadcn components