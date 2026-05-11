import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  useGetTeachersQuery,
  useDeleteTeacherMutation,
  useGetTeacherAssignmentsQuery,
} from "@/services/teacherAPI";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import AddTeacherDialog from "@/components/Teachers/AddTeacherDialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Teachers() {
  const [page] = useState(1);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTeacher, setEditTeacher] = useState(null);
  const { data, isLoading, error } = useGetTeachersQuery({
    page,
    status,
    search,
  });
  useEffect(() => {
    if (!dialogOpen) {
      setEditTeacher(null);
    }
  }, [dialogOpen]);

  const [deleteTeacher, { isLoading: deleting }] = useDeleteTeacherMutation();
  const teachers = data?.data?.teachers || [];
  console.log("Teachers data:", data);
  const stats = data?.data?.stats || {};
  // console.log("Teachers data:", data);
  const handleDelete = async () => {
    try {
      await deleteTeacher(deleteId).unwrap();
      toast.success("Teacher deleted successfully");
      setDeleteOpen(false);
    } catch (err) {
      toast.error(err?.data?.message || "Delete failed");
    }
  };
  return (
    <div className="p-6 space-y-6 bg-background">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground">
            Teacher Directory
          </h2>
          <p className="text-muted-foreground text-sm max-w-xl">
            Manage faculty profiles, credentials, and subject assignments.
          </p>
        </div>

        <AddTeacherDialog
          open={dialogOpen}
          setOpen={setDialogOpen}
          editData={editTeacher}
        />
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between">
        <Input
          placeholder="Search by name, email, or teacher ID..."
          className="md:max-w-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setStatus("")}>
            All
          </Button>

          <Button variant="ghost" onClick={() => setStatus("active")}>
            Active
          </Button>

          <Button variant="ghost" onClick={() => setStatus("inactive")}>
            Inactive
          </Button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-5 rounded-xl">
          <p className="text-xs uppercase text-muted-foreground">
            Total Faculty
          </p>
          <h3 className="text-3xl font-bold">{stats.totalTeachers || 0}</h3>
        </Card>

        <Card className="p-5 rounded-xl">
          <p className="text-xs uppercase text-muted-foreground">Active</p>
          <h3 className="text-3xl font-bold text-green-600">
            {stats.activeTeachers || 0}
          </h3>
        </Card>

        <Card className="p-5 rounded-xl">
          <p className="text-xs uppercase text-muted-foreground">Inactive</p>
          <h3 className="text-3xl font-bold text-gray-500">
            {stats.inactiveTeachers || 0}
          </h3>
        </Card>
        {/* 
        <Card className="p-5 rounded-xl">
          <p className="text-xs uppercase text-muted-foreground">
            Avg Attendance
          </p>
          <h3 className="text-3xl font-bold text-blue-600">98.2%</h3>
        </Card> */}
      </div>

      {/* TABLE */}
      <Card className="rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="text-left p-4">Teacher</th>
                <th className="text-left p-4">Email</th>
                <th className="text-left p-4">Subjects</th>
                <th className="text-left p-4">Status</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="text-center p-6">
                    Loading teachers...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="5" className="text-center p-6 text-red-500">
                    Failed to load teachers
                  </td>
                </tr>
              ) : teachers.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center p-6 text-muted-foreground"
                  >
                    No teachers found
                  </td>
                </tr>
              ) : (
                teachers.map((t) => (
                  <tr key={t._id} className="border-t hover:bg-muted/40">
                    <td className="p-4 font-medium">{t.user.name}</td>

                    <td className="p-4 text-muted-foreground">
                      {t.user.email}
                    </td>

                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        {t.subjects && t.subjects.length > 0 ? (
                          <>
                            <div className="flex flex-wrap gap-1">
                              {t.subjects.map((sub) => (
                                <Badge key={sub._id} variant="secondary">
                                  {sub.name}
                                </Badge>
                              ))}
                            </div>

                            <span className="text-xs text-muted-foreground">
                              ID: {t.teacherId}
                            </span>
                          </>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            No subjects
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-4">
                      {t.user.status === "active" ? (
                        <Badge className="bg-green-500 text-white">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </td>

                    <td className="p-4 text-right space-x-2">
                      {/* EDIT (hook ready) */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditTeacher({
                            _id: t._id,
                            name: t.user.name,
                            email: t.user.email,
                            teacherId: t.teacherId,
                            subject: t.subject,
                            experience: t.experience,
                            status: t.user.status,
                          });
                          setDialogOpen(true);
                        }}
                      >
                        Edit
                      </Button>

                      {/* DELETE */}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setDeleteId(t._id);
                          setDeleteOpen(true);
                        }}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>

            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              teacher.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <AlertDialogAction onClick={handleDelete} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
