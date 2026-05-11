import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    rollNumber: {
      type: Number,
      required: true,
    },

    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },

  images: [
  {
    url: String,
    source: {
      type: String,
      enum: ["pc", "esp32"],
    },
  },
],

    // 🔥 AI FACE DATA (NEW)
    embeddings: [
      {
        vector: {
          type: [Number],
          required: true,
        },
        imageUrl: String,
        source: {
          type: String,
          enum: ["pc", "esp32"],
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);