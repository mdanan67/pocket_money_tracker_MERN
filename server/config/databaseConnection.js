import mongoose from "mongoose";

export default async function databaseConnection(link) {
  return await mongoose.connect(link);
}
