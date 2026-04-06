import mongoose from "mongoose";
const { Schema } = mongoose;

const spendingLimitSetting = new Schema({
  parentId: { type: String },
  shopping: {
    type: String,
  },
  food: {
    type: String,
  },

  travels: {
    type: String,
  },

  mobile: {
    type: String,
  },
  gift: {
    type: String,
  },
  phone: {
    type: String,
  },
  entertainment: {
    type: String,
  },
  other: {
    type: String,
  },
});

export const spendLimit = mongoose.model("spendLimit", spendingLimitSetting);
