import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { format, subDays } from "date-fns";

export default function AttendanceHeatmap({ attendance }) {
  // Convert API data → heatmap format
  const values = attendance.map((a) => ({
    date: format(new Date(a.date), "yyyy-MM-dd"),
    count: a.status === "present" ? 1 : 0,
  }));

  const startDate = subDays(new Date(), 180); // last 6 months
  const endDate = new Date();

  return (
    <div className="bg-white p-4 rounded-lg">
      
      <h2 className="text-sm font-semibold mb-3">
        Attendance Heatmap (Last 6 Months)
      </h2>

      <CalendarHeatmap
        startDate={startDate}
        endDate={endDate}
        values={values}
        classForValue={(value) => {
          if (!value) return "color-empty";
          return value.count === 1
            ? "color-github-green"
            : "color-github-red";
        }}
        tooltipDataAttrs={(value) => {
          if (!value || !value.date) return null;
          return {
            "data-tip": `${value.date} - ${
              value.count ? "Present" : "Absent"
            }`,
          };
        }}
        showWeekdayLabels
      />

      {/* Simple legend */}
      <div className="flex gap-2 mt-3 text-xs">
        <span className="text-green-600">■ Present</span>
        <span className="text-red-500">■ Absent</span>
      </div>
    </div>
  );
}