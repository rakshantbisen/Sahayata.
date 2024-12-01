const express = require("express");
const app = express();
const port = 5000;
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { log } = require("console");

app.use(cors({ origin: "http://localhost:3000" }));

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));


const mongoURI = "mongodb://127.0.0.1:27017/eventsdb";
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

  const eventSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    month: { type: String, required: true },
    date: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    details: { type: String, required: true },
  });
  
  const Event = mongoose.model("Event", eventSchema);

// const events = [
//     {
//         id: 1,
//         month: "Jan",
//         date: "2024-12-01",
//         subtitle: "Ocean Water",
//         title: "Far from the countries Vokalia and Consonantia 2022",
//         details: "Sit amet consectetur adipiscing elit sed do eiusmod tempor",
//       },
//       {
//         id: 2,
//         month: "Feb",
//         date: "2024-14-02",
//         subtitle: "Mountain Peaks",
//         title: "Exploring the highlands of solitude",
//         details: "A beautiful journey through the mountains.",
//       },
// ];

app.listen(port, () => {
  console.log(`listening to port ${port}`);
});

// app.get("/events/new", (req, res) => {
//   res.render("form.ejs");
//   console.log("form page");
// });

app.get("/events", async(req, res) => {
    try {
      const events = await Event.find();
      res.status(200).json(events); // Send all events as JSON
    } catch (err) {
      console.error("Error retrieving events:", err);
      res.status(500).json({ error: "Failed to retrieve events" });
    }
  });

app.post("/events", async(req, res) => {
  //console.log("Received event data:", req.body);

  const { id, month, date, title, subtitle, details } = req.body;


  // Basic validation (you can customize this as needed)
  if (!id || !month || !date || !title || !subtitle || !details) {
    return res.status(400).json({ error: "Please fill out all fields." });
  }

  const newEvent = new Event({ id, month, date, title, subtitle, details });
  await newEvent.save();
  console.log("Event saved to MongoDB:", newEvent);
  //events.push(newEvent); // Assuming `events` is an array storing your events

  //console.log("Event Data Stored:", newEvent);

  // Here, you would save the event data to a database or process it as needed.
  // For demonstration, we'll just log it.
  // console.log("Event Data:", { id, title, subtitle, description, date });

  // Respond back to the frontend
  res.status(201).json({ message: "Event added successfully!" });
});

app.delete("/events/:id", async(req, res) => {
  const { id } = req.params;

  try {
    const deletedEvent = await Event.findOneAndDelete({ id: parseInt(id) });
    if (deletedEvent) {
      return res.status(200).json({ message: "Event deleted successfully" });
    } else {
      return res.status(404).json({ error: "Event not found" });
    }
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ error: "Failed to delete event" });
  }

});

// app.get("/events", (req, res) => {
//   res.status(200).json(events); // Send all events as JSON to the frontend
// });

console.log("hello");
console.log("from backend");
