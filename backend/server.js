const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Connect MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Schema
const Task = mongoose.model("Task", new mongoose.Schema({
  text: {
    type: String,
    required: true
  }
}));

// POST - Add Task
app.post("/add", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Task cannot be empty" });
    }

    const newTask = new Task({ text });
    await newTask.save();

    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE task
app.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await Task.findByIdAndDelete(id);

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - All Tasks
app.get("/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { text },
      { new: true }
    );

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
