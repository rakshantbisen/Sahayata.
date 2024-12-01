import React from "react";
import "./style.css";
import { Link } from "react-router-dom";
import { useState } from "react";

const EventCard = ({ event }) => {
  const month = event.date.split("-")[1];
  const [events, setEvents] = useState([]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/events/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Event deleted successfully");
        setEvents((prevEvents) =>
          prevEvents.filter((event) => event.id !== id)
        );
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to delete the event.");
      }
    } catch (error) {
      console.error("Error deleting the event:", error);
      alert("An error occurred while deleting the event.");
    }
  };
  return (
    <li>
      <div className="event-card">
        <img src="/images/event1.jpg" alt="sahayata" className="event-poster" />
        <time className="card-time" datetime="01-05">
          <span className="month">{event.month}</span>
          <span className="date">{month}</span>
        </time>

        <div className="wrapper">
          <div className="card-content">
            <p className="card-subtitle">{event.subtitle}</p>

            <h3 className="card-title">{event.title}</h3>

            <p className="card-text">{event.details}</p>
          </div>

          {/* <Link to={`/event/${event.id}`}>
            <button className="btn btn-white">
              <span>View Events</span>

              <ion-icon name="arrow-forward" aria-hidden="true"></ion-icon>
            </button>
          </Link> */}

          <button
            className="btn btn-white"
            onClick={() => handleDelete(event.id)}
          >
            <span>Delete Event</span>
            <ion-icon name="arrow-forward" aria-hidden="true"></ion-icon>
          </button>
        </div>
      </div>
    </li>
  );
};

export default EventCard;
