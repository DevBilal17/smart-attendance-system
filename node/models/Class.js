import mongoose from "mongoose";

const classSchema = new mongoose.Schema(
  {
    degree: {
      type: String,
      enum: ["bs", "ms"],
      required: true,
    },

    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
    },

    batchStart: {
      type: Number,
      required: true,
    },

    batchEnd: {
      type: Number,
      required: true,
    },

    session: {
      type: String,
      enum: ["morning", "evening", "bridging", "shifted"],
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// Optional: validation rule (important)
classSchema.pre("save", function () {
  if (this.batchEnd < this.batchStart) {
    throw new Error("Batch end year cannot be less than start year");
  }

  if (this.startDate && this.endDate && this.endDate < this.startDate) {
    throw new Error("End date must be after start date");
  }
});

export default mongoose.model("Class", classSchema);