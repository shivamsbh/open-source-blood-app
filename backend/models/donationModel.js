const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
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
    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
      required: [true, "Active subscription is required to donate"],
    },
    bloodGroup: {
      type: String,
      required: [true, "Blood group is required"],
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [100, "Minimum donation is 100ml"],
      max: [500, "Maximum donation is 500ml"],
    },
    donationType: {
      type: String,
      enum: ["whole_blood", "plasma", "platelets", "red_cells"],
      default: "whole_blood",
    },
    donationDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["completed", "pending", "cancelled"],
      default: "completed",
    },
    notes: {
      type: String,
      maxlength: [500, "Notes cannot exceed 500 characters"],
    },
    // Medical screening results
    screening: {
      hemoglobin: {
        type: Number,
        min: [12, "Hemoglobin too low"],
        max: [20, "Hemoglobin too high"],
      },
      bloodPressure: {
        systolic: Number,
        diastolic: Number,
      },
      temperature: {
        type: Number,
        min: [36, "Temperature too low"],
        max: [37.5, "Temperature too high"],
      },
      weight: {
        type: Number,
        min: [50, "Weight too low for donation"],
      },
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for better query performance
donationSchema.index({ donor: 1 });
donationSchema.index({ organisation: 1 });
donationSchema.index({ subscription: 1 });
donationSchema.index({ bloodGroup: 1 });
donationSchema.index({ donationDate: -1 });
donationSchema.index({ status: 1 });

// Compound index for organization-specific queries
donationSchema.index({ organisation: 1, donationDate: -1 });
donationSchema.index({ donor: 1, donationDate: -1 });

// Virtual for donation age
donationSchema.virtual('donationAge').get(function() {
  return Date.now() - this.donationDate;
});

// Pre-save middleware to validate subscription exists and is active
donationSchema.pre('save', async function(next) {
  if (this.isNew) {
    const Subscription = mongoose.model('Subscription');
    const subscription = await Subscription.findOne({
      _id: this.subscription,
      donor: this.donor,
      organisation: this.organisation,
      status: 'active'
    });
    
    if (!subscription) {
      return next(new Error('Active subscription required to make a donation'));
    }
  }
  next();
});

module.exports = mongoose.model("Donation", donationSchema);