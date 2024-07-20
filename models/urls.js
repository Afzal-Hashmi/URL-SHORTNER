const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const urlSchema = new Schema(
  {
    originalUrl: {
      type: String,
      required: true,
    },
    shortId: {
      type: String,
      required: true,
      unique: true,
    },
    analytics: [{ timestamps: { type: Number } }],
  },
  { timestamps: true }
);

const URL = mongoose.model("Url", urlSchema);

module.exports = URL;
