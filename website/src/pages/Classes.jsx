import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import CreateClassDialog from "@/components/Classes/CreateClassDialog";

import {
  useGetClassesQuery,
  useDeleteClassMutation,
} from "@/services/classAPI";
import toast from "react-hot-toast";

export default function Classes() {
  const [page, setPage] = useState(1);
  const [session, setSession] = useState("");
  const [degree, setDegree] = useState("");
  const [editClass, setEditClass] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const { data, isLoading, error } = useGetClassesQuery({
    page,
    session,
    degree,
  });
  console.log("Classes data:", data);
  useEffect(() => {
    if (!dialogOpen) {
      setEditClass(null);
    }
  }, [dialogOpen]);
  const [deleteClass] = useDeleteClassMutation();

  const handleDelete = async (id) => {
    try {
      await deleteClass(id).unwrap();
      toast.success("Deleted successfully");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const classes = data?.data?.classes || [];
  const stats = data?.data?.stats || {};
  const pagination = data?.data?.pagination || {};

  return (
    <div className="p-6 space-y-6 bg-background">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Class Management
          </h1>
          <p className="text-muted-foreground text-sm">
            Organize and manage academic sessions with smart analytics.
          </p>
        </div>

        <CreateClassDialog
          open={dialogOpen}
          setOpen={setDialogOpen}
          editData={editClass}
        />
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <h2 className="text-3xl font-bold">{stats.totalClasses || 0}</h2>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <h2 className="text-3xl font-bold">{stats.activeSessions || 0}</h2>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Semesters</CardTitle>
          </CardHeader>
          <CardContent>
            <h2 className="text-3xl font-bold">{stats.totalSemesters || 0}</h2>
          </CardContent>
        </Card>
      </div>

      {/* FILTERS */}
      <Card>
        <CardContent className="p-4 grid md:grid-cols-3 gap-4">
          <Select onValueChange={setDegree}>
            <SelectTrigger>
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bs">BS</SelectItem>
              <SelectItem value="ms">MS</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={setSession}>
            <SelectTrigger>
              <SelectValue placeholder="Morning / Evening / Bridging / Shifted" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="morning">Morning</SelectItem>
              <SelectItem value="evening">Evening</SelectItem>
              <SelectItem value="bridging">Bridging</SelectItem>
              <SelectItem value="shifted">Shifted</SelectItem>
            </SelectContent>
          </Select>

          <Input placeholder="Search class..." />
        </CardContent>
      </Card>

      {/* TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>Class Directory</CardTitle>
        </CardHeader>

        <Separator />

        <CardContent className="overflow-auto">
          {isLoading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error loading classes</p>
          ) : classes.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No classes found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Class</TableHead>
                  <TableHead>Session</TableHead>
                  <TableHead>Semester</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {classes.map((cls) => (
                  <TableRow key={cls._id}>
                    <TableCell className="font-medium">
                      {cls.degree.toUpperCase()} Class
                    </TableCell>

                    <TableCell>
                      <Badge>{cls.session}</Badge>
                    </TableCell>

                    <TableCell>{cls.semester}</TableCell>

                    <TableCell>
                      <Badge className="bg-green-500">Active</Badge>
                    </TableCell>

                    <TableCell className="text-right space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditClass(cls);
                          setDialogOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setDeleteId(cls._id)}
                          >
                            Delete
                          </Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>

                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete this class.
                            </AlertDialogDescription>
                          </AlertDialogHeader>

                          <AlertDialogFooter>
                            <AlertDialogCancel
                              onClick={() => setDeleteId(null)}
                            >
                              Cancel
                            </AlertDialogCancel>

                            <AlertDialogAction
                              onClick={() => {
                                handleDelete(deleteId);
                                setDeleteId(null);
                              }}
                            >
                              Yes, Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
