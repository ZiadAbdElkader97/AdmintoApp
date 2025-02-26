import "./Calendar.css";
import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";

export default function Calendar() {
  const [events, setEvents] = useState([
    { title: "Meeting with CT Team", date: "2025-02-19", color: "#FEC107" },
    {
      title: "Interview - Frontend Engineer",
      date: "2025-02-20",
      color: "#6366F1",
    },
    { title: "Phone Screen - Frontend", date: "2025-02-21", color: "#22C55E" },
    { title: "Meeting with Mr. A", date: "2025-02-23", color: "#0EA5E9" },
    { title: "Buy Design Assets", date: "2025-02-23", color: "#0EA5E9" },
  ]);

  const handleDateClick = (info) => {
    const title = prompt("Enter event title:");
    if (title) {
      setEvents([...events, { title, date: info.dateStr, color: "#FF5733" }]);
    }
  };

  return (
    <>
      <div className="container">
        <div className="calendar">
          <div className="calendar-container">
            <div className="sidebar_calendar">
              <button className="create-event-btn">+ Create New Event</button>
              <p className="calendar_p">
                Drag and drop your event or click in the calendar
              </p>
              <div className="event-type new-event">New Event Planning</div>
              <div className="event-type meeting">Meeting</div>
              <div className="event-type reports">Generating Reports</div>
              <div className="event-type theme">Create New Theme</div>
            </div>
            <div className="calendar-content">
              <div className="calendar-wrapper">
                <FullCalendar
                  plugins={[
                    dayGridPlugin,
                    timeGridPlugin,
                    listPlugin,
                    interactionPlugin,
                  ]}
                  initialView="dayGridMonth"
                  headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
                  }}
                  events={events}
                  eventContent={(eventInfo) => (
                    <div
                      className="event-item"
                      style={{
                        backgroundColor: eventInfo.event.extendedProps.color,
                      }}
                    >
                      {eventInfo.event.title}
                    </div>
                  )}
                  dateClick={handleDateClick}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
