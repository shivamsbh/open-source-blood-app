const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Donor is required"],
    },
    organisation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: [true, "Organisation is required"],
    },
    status: {
      type: String,
      enum: ["active", "inactive", "pending"],
      default: "active",
    },
    subscribedAt: {
      type: Date,
      default: Date.now,
    },
    // Optional: Add notification preferences
    notificationPreferences: {
      emailNotifications: {
        type: Boolean,
        default: true,
      },
      urgentRequests: {
        type: Boolean,
        default: true,
      },
      monthlyUpdates: {
        type: Boolean,
        default: false,
      },
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Compound index to ensure one subscription per donor-organisation pair
subscriptionSchema.index({ donor: 1, organisation: 1 }, { unique: true });

// Index for better query performance
subscriptionSchema.index({ donor: 1 });
subscriptionSchema.index({ organisation: 1 });
subscriptionSchema.index({ status: 1 });

// Virtual for subscription duration
subscriptionSchema.virtual('subscriptionDuration').get(function() {
  return Date.now() - this.subscribedAt;
});

module.exports = mongoose.model("Subscription", subscriptionSchema);