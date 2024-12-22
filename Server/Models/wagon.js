import mongoose from "mongoose";

const hourlyProgressSchema = new mongoose.Schema(
  {
    hour: Number,
    completedWagons: { type: Number, default: 0 },
    detectTime: { type: String },
    systemStartTime: { type: String },
    reasons: { type: String, default: '' },
  },
  { _id: false }
);

const wtSchema = new mongoose.Schema(
  {
    assignedWagons: { type: Number, required: true },
    progress: [hourlyProgressSchema],
  },
  { _id: false }
);

const wagonAssignmentSchema = new mongoose.Schema({
  rakeNo: { type: String, required: true, unique: true },
  wt1: wtSchema,
  wt2: wtSchema,
  wt3: wtSchema,
  wt4: wtSchema,
  createdAt: { type: Date, default: Date.now },
});

const Wagon = mongoose.model("WagonAssignment", wagonAssignmentSchema);
export default Wagon;