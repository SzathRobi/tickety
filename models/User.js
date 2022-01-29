import mongoose from "mongoose";

const MetadataSchema = new mongoose.Schema({
  role: {
    type: String,
    default: "",
  },
});

const UserSchema = new mongoose.Schema({
  _id: {
    type: String,
  },
  tenant: {
    type: String,
  },
  connection: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  debug: {
    type: Boolean,
  },
  email_verified: {
    type: Boolean,
  },
  user_metadata: MetadataSchema,
  created_at: {
    type: Date,
    default: Date.now(),
  },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
