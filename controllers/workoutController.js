const mongoose = require("mongoose");
const Workout = require("../models/WorkoutModel");

//gets all workouts
const getWorkouts = async (req, resp) => {
  const workouts = await Workout.find({}).sort({ createdAt: -1 });
  resp.status(200).json(workouts);
};

//get a single wokout
const getWorkout = async (req, resp) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return resp.status(404).json({ error: "No such workout." });
  }

  const workout = await Workout.findById(id);

  if (!workout) {
    return resp.status(404).json({ error: "No such workout." });
  }

  resp.status(200).json(workout);
};

//create new workout
const createWorkout = async (req, resp) => {
  const { title, load, reps } = req.body;

  let emptyFields = [];

  if (!title) {
    emptyFields.push("title");
  }

  if (!load) {
    emptyFields.push("load");
  }

  if (!reps) {
    emptyFields.push("reps");
  }

  if (emptyFields.length > 0) {
    return resp
      .status(400)
      .json({ error: "Please fill in all fields.", emptyFields });
  }

  try {
    const workout = await Workout.create({ title, load, reps });
    resp.status(200).json(workout);
  } catch (error) {
    resp.status(400).json({ error: error.message });
  }
};

//delete workout
const deleteWorkout = async (req, resp) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return resp.status(404).json({ error: "No such workout." });
  }

  const workout = await Workout.findOneAndDelete({ _id: id });

  if (!workout) {
    return resp.status(404).json({ error: "No such workout." });
  }

  resp.status(200).json(workout);
};

//update a workout
const updateWorkout = async (req, resp) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return resp.status(404).json({ error: "No such workout." });
  }

  const wokout = await Workout.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    }
  );

  if (!workout) {
    return resp.status(404).json({ error: "No such workout." });
  }

  resp.status(200).json(workout);
};

module.exports = {
  createWorkout,
  getWorkouts,
  getWorkout,
  deleteWorkout,
  updateWorkout,
};
