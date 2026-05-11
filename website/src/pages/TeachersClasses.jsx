import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGetTeacherProfileQuery } from "@/services/teacherAPI";
import React from "react";
import { useSelector } from "react-redux";

const TeachersClasses = () => {
      const  user  = useSelector((state) => state.auth.user);
    //   console.log(user);
      const { data: teacherProfile, isLoading } = useGetTeacherProfileQuery(user?.id);
    //   console.log(teacherProfile);

      const subjects = teacherProfile?.data?.subjects || [];

      if (isLoading) {
      return <p className="p-6">Loading profile...</p>;
    }
  return (
    <div className=" max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">My Classes</h2>
      </div>

        {/* Subjects */}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      
        {subjects.length > 0 ? (
          subjects.map((sub) => (
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

  );
};

export default TeachersClasses;
