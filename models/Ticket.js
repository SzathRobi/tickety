import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  commenter: {
    type: String,
  },
  msg: {
    type: String,
    required: [true, "Please provide a message for this comment"],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const HistorySchema = new mongoose.Schema({
  modifier: {
    type: String,
  },
  value_keys: {
    type: Array,
  },
  old_values: {
    type: Array,
  },
  new_values: {
    type: Array,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const FileSchema = new mongoose.Schema({
  file: {
    type: String,
  },
  Uploader: {
    type: String,
  },
  Notes: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

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
    default: [],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: null,
  },
  history: {
    type: [HistorySchema],
    default: [],
  },
  comments: {
    type: [CommentSchema],
    default: [],
  },
  files: {
    type: [FileSchema],
    default: [],
  },
});

export default mongoose.models.Ticket || mongoose.model("Ticket", TicketSchema);
