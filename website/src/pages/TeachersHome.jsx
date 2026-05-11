import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetTeacherProfileQuery } from "@/services/teacherAPI";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
export default function TeachersHome() {
  const  user  = useSelector((state) => state.auth.user);
  console.log(user);
  const { data: teacherProfile, isLoading } = useGetTeacherProfileQuery(user?.id);
  console.log(teacherProfile);
  const profile = teacherProfile?.data?.teacher;
  const subjects = teacherProfile?.data?.subjects || [];
  const stats = teacherProfile?.data?.stats || [];
  const navigate = useNavigate();
  if (isLoading) {
  return <p className="p-6">Loading profile...</p>;
}
  return (
    <div className=" max-w-7xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">
  Welcome back, {profile?.user?.name || "Teacher"}!
</h2>

        {/* <div className="flex gap-3">
          <Input placeholder="Search students..." className="w-64" />
          <Button variant="outline">Export</Button>
        </div> */}
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <Card>
          <CardHeader>
            <CardTitle>Total Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="text-4xl font-bold">{stats.totalClasses || 0}</h3>
            {/* <p className="text-muted-foreground text-sm">
              Next class in 45 mins
            </p> */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="text-4xl font-bold">{stats.totalStudents || 0}</h3>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Subjects</CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="text-4xl font-bold">{stats.totalSubjects || 0}</h3>
          </CardContent>
        </Card>

      </div>

      {/* Subjects */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Your Assigned Subjects</h3>
          <Button variant="link" onClick={() => navigate("/teacher/classes")}>
            View All
          </Button>
        </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

  {subjects.length > 0 ? (
    subjects.slice(0, 4).map((sub) => (
      <Card
        key={sub._id}
        className="hover:border-primary cursor-pointer"
      >
        <CardContent className="p-5 space-y-2">

          <h4 className="font-semibold">{sub.name}</h4>

          <p className="text-sm text-muted-foreground">
            {sub.code}
          </p>

          {/* CLASS INFO */}
          <p className="text-sm">
            Class: {sub.class?.degree?.toUpperCase()} - Sem{" "}
                        {sub.class?.semester} ({sub.class?.batchStart}-
                        {sub.class?.batchEnd})
          </p>

          {/* STUDENTS COUNT */}
          <p className="text-xs text-muted-foreground">
            Students: {sub.studentCount || 0}
          </p>

        </CardContent>
      </Card>
    ))
  ) : (
    <p className="text-muted-foreground">No subjects assigned</p>
  )}

</div>
      </div>

      {/* Upcoming Sessions */}
      {/* <div>
        <h3 className="text-xl font-semibold mb-4">Upcoming Sessions</h3>

        <Card>
          <CardContent className="p-5 space-y-4">

            <div className="border-l-4 border-primary pl-4">
              <p className="text-sm text-muted-foreground">Now</p>
              <h4 className="font-semibold">Applied Cryptography</h4>
              <p className="text-sm">Lecture Hall A • 42 Students</p>

              <Button className="mt-3 w-full">
                Start Attendance
              </Button>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-semibold">Network Security</h4>
              <p className="text-sm">11:30 AM • Room 105</p>
            </div>

          </CardContent>
        </Card>
      </div> */}

      {/* Table */}
      {/* <div>
        <h3 className="text-xl font-semibold mb-4">
          Recent Attendance Flags
        </h3>

        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="p-4 text-left">Student</th>
                  <th className="p-4 text-left">Subject</th>
                  <th className="p-4 text-left">Flag</th>
                  <th className="p-4 text-left">Confidence</th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-t">
                  <td className="p-4">Julian Schmidt</td>
                  <td className="p-4">CS-101</td>
                  <td className="p-4 text-red-500">Missing Persona</td>
                  <td className="p-4">45%</td>
                </tr>

                <tr className="border-t">
                  <td className="p-4">Amara Miller</td>
                  <td className="p-4">Math</td>
                  <td className="p-4 text-yellow-500">Early Departure</td>
                  <td className="p-4">78%</td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div> */}

    </div>
  );
}