import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name for this project"],
  },
  owner: {
    type: String,
  },
  devs_assigned: {
    type: Array,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Project ||
  mongoose.model("Project", ProjectSchema);
