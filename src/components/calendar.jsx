import { useState, useEffect } from "react";
import moment from "moment";
import Api from "../helper/api";
const api = new Api();

function Calendar() {
    const [today, setToday] = useState(moment());
    const [view, setView] = useState("month");
    const [selectedDate, setSelectedDate] = useState(moment().startOf("day"));
    const [newEvent, setNewEvent] = useState({title: "", time: ""});
    const [events, setEvents] = useState([]);

    const fetchEvents = () => {
        api
            .getEvents()
            .then((response) => {
                setEvents(response.data)
            })
            .catch((err) => console.log(err));
    };
    useEffect(fetchEvents, []);

    const handleNewEventChange = (event) => {
        setNewEvent({...newEvent, [event.target.name]: event.target.value});
    };

    const handleNewEventSubmit = async (event) => {
        event.preventDefault();
        const { title, time } = newEvent;
        if (title && time) {
            try {
                const selectedDateString = selectedDate.format("YYYY-MM-DD");
                const payload = {
                    date: selectedDateString,
                    title,
                    time
                };
                const response = await api.addEvent(payload)
                setEvents([...events, response.data]);
                setNewEvent({ title: '', time: '' });
            } catch (error) {
                console.error(error);
                // Display error message to user
            }
        }
    };

    const handleMonthChange = (event) => {
        const newDate = today.clone().month(parseInt(event.target.value)).startOf("month");
        setToday(newDate);
    };

    const handlePrev = () => {
        const newDate = today.clone().subtract(1, view);
        setToday(newDate);
    };

    const handleNext = () => {
        const newDate = today.clone().add(1, view);
        setToday(newDate);
    };

    const getDaysInMonth = () => {
        const monthStart = today.clone().startOf("month");
        const monthEnd = monthStart.clone().endOf("month");
        const diffDays = monthEnd.diff(monthStart, "days") + 1;
        return Array.from({length: diffDays}, (_, i) => monthStart.clone().add(i, "days"));
    };

    const getEventsForSelectedDate = (date) => {
        const dateHandle = date || selectedDate;
        return events.filter((event) => moment(dateHandle).isSame(event.date, 'day')) ?? [];
    };

    return (
        <div className="calendar">
            <div className="calendar-header">
                <button onClick={handlePrev}>{"<"}</button>
                <select value={today.month()} onChange={handleMonthChange}>
                    <option value="0">January</option>
                    <option value="1">February</option>
                    <option value="2">March</option>
                    <option value="3">April</option>
                    <option value="4">May</option>
                    <option value="5">June</option>
                    <option value="6">July</option>
                    <option value="7">August</option>
                    <option value="8">September</option>
                    <option value="9">October</option>
                    <option value="10">November</option>
                    <option value="11">December</option>
                </select>
                <button onClick={handleNext}>{">"}</button>
            </div>
            {view === "month" && (
                <div className="calendar-grid">
                    {getDaysInMonth().map((day) => (
                        <div
                            key={day.format("D")}
                            className={`calendar-day ${day.isSame(selectedDate, "day") ? "selected" : ""}`}
                            onClick={() => setSelectedDate(day.startOf("day"))}
                        >
                            <div className="calendar-day-number">{day.format("D")}</div>
                            {
                                getEventsForSelectedDate(day).length > 0 && <div className="calendar-event-counter">
                                    {getEventsForSelectedDate(day).length}
                                </div>
                            }
                        </div>
                    ))}
                </div>
            )}
            {view === "day" && (
                <div className="calendar-day-view">
                    <div className="calendar-day-header">
                        <button onClick={() => setView("month")}>Back to Month View</button>
                        <div>{selectedDate.format("dddd, MMMM D, YYYY")}</div>
                    </div>
                    <div className="calendar-day-events">
                        {getEventsForSelectedDate().map((event, index) => (
                            <div key={index} className="calendar-event">
                                {event.title} - {event.time}
                            </div>
                        ))}
                    </div>
                    <form onSubmit={handleNewEventSubmit}>
                        <input
                            type="text"
                            placeholder="Title"
                            name="title"
                            value={newEvent.title}
                            onChange={handleNewEventChange}
                        />
                        <input
                            type="text"
                            placeholder="Time"
                            name="time"
                            value={newEvent.time}
                            onChange={handleNewEventChange}
                        />
                        <button type="submit">Add Event</button>
                    </form>
                </div>
            )}
            <div className="calendar-view-toggle">
                <button onClick={() => setView("month")}>Month View</button>
                <button onClick={() => setView("day")}>Day View</button>
            </div>
        </div>
    );
}

    export default Calendar;
