const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const urlSchema = new Schema(
  {
    email: { type: String, required: true },
    origin: { type: String, required: true },
    tiny: { type: String, required: true },
    duration: { type: Number, required: true },
    createdAt: { type: Date, required: true }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Url", urlSchema);
