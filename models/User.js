import mongoose from "mongoose";

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
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
