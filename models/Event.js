import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  organizerName: { type: String, required: true, trim: true },
  organizerPhone: { type: String, required: true },
  eventType: {
    type: String,
    required: true,
    enum: ["corporate event", "concert/exhibition", "conference", "wedding", "other"],
  },
  desc: {
    type: String,
    required: true,
    minlength: 50,
    maxlength: 500,
    trim: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["pending", "approved", "rejected", "cancelled", "contacted", "completed"],
    default: "pending",
  },
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function (doc, ret) {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      ret.createdAt = ret.createdAt.toISOString();
      ret.updatedAt = ret.updatedAt.toISOString();
      return ret;
    },
  },
  toObject: { virtuals: true },
});

eventSchema.methods.getStatus = function () {
  return this.status;
};

eventSchema.methods.updateStatus = function (newStatus) {
  if (!this.schema.path("status").enumValues.includes(newStatus)) {
    throw new Error(`Invalid status: ${newStatus}`);
  }
  this.status = newStatus;
  return this.save();
};

eventSchema.methods.requestContact = function () {
  if (this.status !== "contacted") {
    this.status = "contacted";
    return this.save();
  }
  return Promise.resolve(this);
};

eventSchema.virtual("duration").get(function () {
  return "N/A";
});

export const Event = mongoose.model("Event", eventSchema);
