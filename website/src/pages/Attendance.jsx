import React from 'react'
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Square, TrendingUp, Users } from "lucide-react";
const Attendance = () => {
  return (
    <div className="grid grid-cols-12 gap-6">

      {/* LEFT SIDE */}
      <div className="col-span-12 lg:col-span-8 space-y-6">

        {/* LIVE PANEL */}
        <Card className="overflow-hidden">
          <CardContent className="p-6 space-y-4">

            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">
                  Live Attendance Panel
                </h2>
                <p className="text-sm text-muted-foreground">
                  Class: Advanced Computer Science • Section B
                </p>
              </div>

              <div className="flex gap-3">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Play className="w-4 h-4 mr-2" />
                  Start
                </Button>

                <Button variant="outline" className="text-red-600 border-red-200">
                  <Square className="w-4 h-4 mr-2" />
                  Stop
                </Button>
              </div>
            </div>

            {/* VIDEO AREA */}
            <div className="aspect-video bg-black rounded-lg relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1588072432836-e10032774350"
                alt="class"
                className="w-full h-full object-cover opacity-60"
              />

              {/* overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black/50 px-6 py-2 rounded-full text-white text-sm flex items-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Scanning...
                </div>
              </div>
            </div>

          </CardContent>
        </Card>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-4">

          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Total Students</p>
              <h3 className="text-2xl font-bold text-blue-600">32</h3>
              <div className="flex items-center text-green-600 text-xs mt-2">
                <TrendingUp className="w-3 h-3 mr-1" />
                100% Enrollment
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Present Now</p>
              <h3 className="text-2xl font-bold text-green-600">28</h3>
              <div className="flex items-center text-xs mt-2">
                <Users className="w-3 h-3 mr-1" />
                87.5% Attendance
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Unrecognized</p>
              <h3 className="text-2xl font-bold text-red-600">1</h3>
              <p className="text-xs text-red-500 mt-2">
                Flagged for review
              </p>
            </CardContent>
          </Card>

        </div>

      </div>

      {/* RIGHT SIDE */}
      <div className="col-span-12 lg:col-span-4">

        <Card className="h-full">
          <CardContent className="p-0 flex flex-col h-full">

            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-semibold">Real-time Recognition</h3>
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                Live
              </span>
            </div>

            {/* LIST */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">

              {/* ITEM */}
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                <img
                  src="https://i.pravatar.cc/100"
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold">Alice Johnson</p>
                  <p className="text-xs text-muted-foreground">
                    09:01 AM
                  </p>
                </div>
                <span className="text-xs text-green-700 bg-green-200 px-2 py-1 rounded">
                  Present
                </span>
              </div>

              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                <img
                  src="https://i.pravatar.cc/101"
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold">Bob Smith</p>
                  <p className="text-xs text-muted-foreground">
                    09:05 AM
                  </p>
                </div>
                <span className="text-xs text-green-700 bg-green-200 px-2 py-1 rounded">
                  Present
                </span>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border-l-4 border-slate-300">
                <img
                  src="https://i.pravatar.cc/102"
                  className="w-10 h-10 rounded-full grayscale"
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold">Dana White</p>
                  <p className="text-xs text-muted-foreground">
                    Awaiting Recognition
                  </p>
                </div>
                <span className="text-xs text-slate-500 bg-slate-200 px-2 py-1 rounded">
                  Pending
                </span>
              </div>

            </div>

          </CardContent>
        </Card>

      </div>

    </div>
  )
}

export default Attendance
