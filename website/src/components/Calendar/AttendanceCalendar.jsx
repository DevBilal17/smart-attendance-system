import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import * as enUS from "date-fns/locale/en-US";
const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function AttendanceCalendar({ attendance }) {
  const events = attendance.map((a) => ({
    title: a.status === "present" ? "Present" : "Absent",
    start: new Date(a.date),
    end: new Date(a.date),
    allDay: true,
    status: a.status,
  }));

  return (
    <div className="h-[500px]">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView="month"
        style={{ height: "100%" }}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor:
              event.status === "present" ? "#22c55e" : "#ef4444",
            color: "white",
            borderRadius: "6px",
          },
        })}
      />
    </div>
  );
}