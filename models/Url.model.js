const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const urlSchema = new Schema(
  {
    email: { type: String, required: true },
    origin: { type: String, required: true },
    tiny: { type: String, required: true, unique: true, dropDups: true },
    duration: { type: Number, required: true }
  },
  {
    timestamps: true
  }
);

// 자동으로 collection name이 소문자가 되고 뒤에 s가 붙음 (Url -> urls)
module.exports = mongoose.model("Url", urlSchema);
