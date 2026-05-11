import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function Reports() {
  return (
    <div className="p-6 space-y-8 bg-background">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Attendance Reports
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Generate and analyze student presence data with AI insights.
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl">
            PDF Report
          </Button>
          <Button className="rounded-xl">
            Export CSV
          </Button>
        </div>

      </div>

      {/* FILTERS */}
      <Card className="rounded-2xl border shadow-sm">
        <CardContent className="p-5 grid md:grid-cols-3 gap-6">

          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Class
            </p>
            <Select>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10a">Grade 10-A</SelectItem>
                <SelectItem value="10b">Grade 10-B</SelectItem>
                <SelectItem value="11a">Grade 11-A</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Subject
            </p>
            <Select>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="math">Mathematics</SelectItem>
                <SelectItem value="cs">Computer Science</SelectItem>
                <SelectItem value="phy">Physics</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Date Range
            </p>
            <Input
              className="rounded-xl"
              placeholder="Oct 01 - Oct 31"
            />
          </div>

        </CardContent>
      </Card>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-5">

        <Card className="rounded-2xl shadow-sm hover:shadow-md transition">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Average Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h2 className="text-3xl font-bold">87.4%</h2>
            <p className="text-xs text-emerald-600 mt-1">
              +2.4% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm hover:shadow-md transition">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Flagged Anomalies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h2 className="text-3xl font-bold text-red-500">12</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Students below 75% attendance
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm hover:shadow-md transition">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Total Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h2 className="text-3xl font-bold">48</h2>
            <p className="text-xs text-muted-foreground mt-1">
              This month activity
            </p>
          </CardContent>
        </Card>

      </div>

      {/* TABLE */}
      <Card className="rounded-2xl overflow-hidden shadow-sm">

        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Student Attendance</CardTitle>
        </CardHeader>

        <Separator />

        <CardContent className="p-0">

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead className="bg-muted/40 text-muted-foreground">
                <tr className="text-left">
                  <th className="py-4 px-6">Student</th>
                  <th>Total</th>
                  <th>Present</th>
                  <th>Absent</th>
                  <th>Attendance</th>
                  <th className="text-right px-6">Action</th>
                </tr>
              </thead>

              <tbody>

                <tr className="border-b hover:bg-muted/40 transition">
                  <td className="py-4 px-6 font-medium">Julianne Smith</td>
                  <td>48</td>
                  <td>46</td>
                  <td>2</td>
                  <td>
                    <Badge className="bg-emerald-500 hover:bg-emerald-600">
                      96%
                    </Badge>
                  </td>
                  <td className="text-right px-6">
                    <Button size="sm" variant="outline" className="rounded-lg">
                      View
                    </Button>
                  </td>
                </tr>

                <tr className="border-b hover:bg-muted/40 transition">
                  <td className="py-4 px-6 font-medium">Marcus Thorne</td>
                  <td>48</td>
                  <td>32</td>
                  <td>16</td>
                  <td>
                    <Badge variant="destructive">66%</Badge>
                  </td>
                  <td className="text-right px-6">
                    <Button size="sm" variant="outline" className="rounded-lg">
                      Alert
                    </Button>
                  </td>
                </tr>

                <tr className="hover:bg-muted/40 transition">
                  <td className="py-4 px-6 font-medium">Elena Lopez</td>
                  <td>48</td>
                  <td>39</td>
                  <td>9</td>
                  <td>
                    <Badge className="bg-yellow-500 hover:bg-yellow-600">
                      81%
                    </Badge>
                  </td>
                  <td className="text-right px-6">
                    <Button size="sm" variant="outline" className="rounded-lg">
                      View
                    </Button>
                  </td>
                </tr>

              </tbody>

            </table>

          </div>

        </CardContent>

      </Card>

    </div>
  );
}