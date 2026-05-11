import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import AddSubjectDialog from "@/components/Subject/AddSubjectDialog";

import toast from "react-hot-toast";

import {
  useGetSubjectsQuery,
  useDeleteSubjectMutation,
} from "@/services/subjectAPI";

export default function Subjects() {
  const { data, isLoading, error } = useGetSubjectsQuery();

  const [deleteSubject] = useDeleteSubjectMutation();

  const subjects = data?.data?.subjects || [];
  const stats = data?.data?.stats || {};
  console.log("Subjects data:", data);
  const handleDelete = async (id) => {
    try {
      await deleteSubject(id).unwrap();
      toast.success("Subject deleted");
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
            Subject Management
          </h2>
          <p className="text-muted-foreground text-sm max-w-xl">
            Assign and organize subjects with teachers and classes.
          </p>
        </div>

        <AddSubjectDialog />
      </div>

      {/* STATS (REAL DATA) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <span className="text-xs uppercase text-muted-foreground">
              Total Subjects
            </span>
          </CardHeader>
          <CardContent>
            <h3 className="text-3xl font-bold">{stats.totalSubjects || 0}</h3>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <span className="text-xs uppercase text-muted-foreground">
              Active
            </span>
          </CardHeader>
          <CardContent>
            <h3 className="text-3xl font-bold text-green-600">
              {stats.activeSubjects || 0}
            </h3>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <span className="text-xs uppercase text-muted-foreground">
              Inactive
            </span>
          </CardHeader>
          <CardContent>
            <h3 className="text-3xl font-bold text-gray-500">
              {stats.inactiveSubjects || 0}
            </h3>
          </CardContent>
        </Card>
      </div>

      {/* TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>Subjects</CardTitle>
        </CardHeader>

        <Separator />

        <CardContent className="overflow-auto">
          {isLoading ? (
            <p className="p-4">Loading subjects...</p>
          ) : error ? (
            <p className="p-4 text-red-500">Failed to load subjects</p>
          ) : subjects.length === 0 ? (
            <p className="p-4 text-muted-foreground">No subjects found</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-muted-foreground">
                <tr className="text-left border-b">
                  <th className="py-3">Subject</th>
                  <th>Class</th>
                  <th>Teacher</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {subjects.map((sub) => (
                  <tr key={sub._id} className="border-b hover:bg-muted/40">
                    <td className="py-4 font-medium">{sub.name}</td>

                    <td>
                      <Badge variant="secondary">
                        {sub.classId?.degree?.toUpperCase()} - Sem{" "}
                        {sub.classId?.semester} ({sub.classId?.batchStart}-
                        {sub.classId?.batchEnd})
                      </Badge>
                    </td>

                    <td>{sub.teacher?.user?.name || "Unassigned"}</td>

                    <td>
                      {sub.status === "active" ? (
                        <Badge className="bg-green-500">Active</Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </td>

                    <td className="text-right space-x-2">
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(sub._id)}
                      >
                        Delete
                      </Button>
                    </td>
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
