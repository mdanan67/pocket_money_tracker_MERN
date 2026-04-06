import mongoose from "mongoose";
const { Schema } = mongoose;

const parentBalances = new Schema({
  parentId: {
    type: String,
  },
  amount: {
    type: String,
  },
  monthlySpend: {
    type: String,
  },
  chieldSpend: {
    type: String,
  },
  method: {
    type: [
      {
        method: { type: String, required: true },
        amount: { type: String, required: true },
        time: { type: Date, default: Date.now },
      },
    ],
    default: [],
  },
});

export const parentBalance = mongoose.model("parentBalance", parentBalances);
