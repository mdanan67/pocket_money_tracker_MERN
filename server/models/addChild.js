import mongoose from "mongoose";
const { Schema } = mongoose;

const childSchema = new Schema({
  parentId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  age: {
    type: String,
  },
  gender: {
    type: String,
  },

  email: {
    type: String,
    required: true,
  },
  balance: {
    type: String,
  },

  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  montlySpend: {
    type: String,
  },
});

export const Child = mongoose.model("Child", childSchema);
