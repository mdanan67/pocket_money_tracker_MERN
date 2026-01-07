import mongoose from "mongoose";
const { Schema } = mongoose;

const parentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },
});

export const Parent = mongoose.model("Parent", parentSchema);
