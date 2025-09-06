import mongoose from "mongoose";

const pointSchema = new mongoose.Schema({
  type: { type: String, enum: ["Point"], default: "Point", required: true },
  coordinates: {
    type: [Number],
    required: true,
    validate: {
      validator: (coords) => Array.isArray(coords) && coords.length === 2,
      message: "Coordinates must be an array of [longitude, latitude]",
    },
  },
}, { _id: false });

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  rideType: { type: String, enum: ["hourly", "outstation"], required: true, index: true },
  carType: { type: String, enum: ["3-seater", "5-seater"], required: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: "Driver", default: null },
  passengerCount: { type: Number, required: true, min: 1, max: 5 },
  luggageCount: { type: Number, required: true, min: 0 },
  pickUp: {
    address: { type: String, required: true, trim: true, default: "" },
    location: { type: pointSchema, required: true },
  },
  dropOff: {
    address: { type: String, required: true, trim: true, default: "" },
    location: { type: pointSchema, required: true },
  },
  stops: [{
    address: { type: String, trim: true, default: "" },
    location: pointSchema,
  }],
  addOns: {
    airportToll: { type: Boolean, default: false },
    placard: {
      required: { type: Boolean, default: false },
      text: { type: String, trim: true },
    },
    pets: {
      dogs: { type: Boolean, default: false },
      cats: { type: Boolean, default: false },
    },
    bookForOther: {
      isBooking: { type: Boolean, default: false },
      otherGuestInfo: { type: String, trim: true },
    },
    childSeat: { type: Boolean, default: false },
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "ongoing", "completed", "cancelled"],
    default: "pending",
    index: true,
  },
  payment: {
    orderId: { type: String, index: true },
    paymentId: { type: String },
    signature: { type: String },
    receipt: { type: String },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["card", "cash", "upi", "netbanking", "wallet", "razorpay"],
      required: true,
      default: "razorpay",
    },
    amount: { type: Number, required: true, min: 0 },
  },
}, {
  timestamps: true,
  discriminatorKey: "rideType",
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      if (ret.payment) {
        delete ret.payment.paymentId;
        delete ret.payment.signature;
        delete ret.payment.orderId;
      }
      if (ret.createdAt) ret.createdAt = ret.createdAt.toISOString();
      if (ret.updatedAt) ret.updatedAt = ret.updatedAt.toISOString();
      if (ret.startTime) ret.startTime = ret.startTime.toISOString();
      if (ret.returnTime) ret.returnTime = ret.returnTime.toISOString();
      return ret;
    },
  },
  toObject: { virtuals: true },
});

bookingSchema.index({ "pickUp.location": "2dsphere" });
bookingSchema.index({ "dropOff.location": "2dsphere" });

export const Booking = mongoose.model("Booking", bookingSchema);
