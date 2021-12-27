import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a title for this ticket"],
  },
  desc: {
    type: String,
  },
  project: {
    type: String,
  },
  status: {
    type: String,
    enum: ["new", "open", "in progress", "closed", "additional info required"],
    default: "new",
  },
  type: {
    type: String,
    enum: ["error/bug", "feature request", "other"],
    default: "error/bug",
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high", "critical"],
  },
  submitter: {
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

export default mongoose.models.Ticket || mongoose.model("Ticket", TicketSchema);
