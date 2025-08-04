const mongoose = require("mongoose");

const donorCapacitySchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Donor is required"],
      unique: true, // One capacity record per donor
    },
    bloodGroup: {
      type: String,
      required: [true, "Blood group is required"],
      enum: ["O+", "O-", "AB+", "AB-", "A+", "A-", "B+", "B-"],
    },
    totalCapacity: {
      type: Number,
      required: [true, "Total capacity is required"],
      min: [100, "Minimum capacity is 100ml"],
      max: [2000, "Maximum capacity is 2000ml"],
    },
    availableCapacity: {
      type: Number,
      required: [true, "Available capacity is required"],
      min: [0, "Available capacity cannot be negative"],
    },
    lastDonationDate: {
      type: Date,
      default: null,
    },
    nextEligibleDate: {
      type: Date,
      default: null,
    },
    donationFrequency: {
      type: String,
      enum: ["monthly", "quarterly", "biannual", "annual"],
      default: "quarterly",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Health and eligibility info
    healthStatus: {
      type: String,
      enum: ["excellent", "good", "fair", "restricted"],
      default: "good",
    },
    restrictions: {
      type: [String],
      default: [],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, "Notes cannot exceed 500 characters"],
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for better query performance
donorCapacitySchema.index({ donor: 1 });
donorCapacitySchema.index({ bloodGroup: 1 });
donorCapacitySchema.index({ isActive: 1 });
donorCapacitySchema.index({ nextEligibleDate: 1 });

// Virtual for capacity utilization percentage
donorCapacitySchema.virtual('utilizationPercentage').get(function() {
  if (this.totalCapacity === 0) return 0;
  return Math.round(((this.totalCapacity - this.availableCapacity) / this.totalCapacity) * 100);
});

// Virtual for donated amount
donorCapacitySchema.virtual('donatedAmount').get(function() {
  return this.totalCapacity - this.availableCapacity;
});

// Virtual for eligibility status
donorCapacitySchema.virtual('isEligible').get(function() {
  if (!this.isActive) return false;
  if (this.availableCapacity <= 0) return false;
  if (this.nextEligibleDate && new Date() < this.nextEligibleDate) return false;
  return true;
});

// Virtual for days until next eligible donation
donorCapacitySchema.virtual('daysUntilEligible').get(function() {
  if (!this.nextEligibleDate) return 0;
  const today = new Date();
  const eligible = new Date(this.nextEligibleDate);
  const diffTime = eligible - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
});

// Method to calculate next eligible date based on frequency
donorCapacitySchema.methods.calculateNextEligibleDate = function() {
  if (!this.lastDonationDate) return null;
  
  const lastDonation = new Date(this.lastDonationDate);
  let nextEligible = new Date(lastDonation);
  
  switch (this.donationFrequency) {
    case 'monthly':
      nextEligible.setMonth(nextEligible.getMonth() + 1);
      break;
    case 'quarterly':
      nextEligible.setMonth(nextEligible.getMonth() + 3);
      break;
    case 'biannual':
      nextEligible.setMonth(nextEligible.getMonth() + 6);
      break;
    case 'annual':
      nextEligible.setFullYear(nextEligible.getFullYear() + 1);
      break;
    default:
      nextEligible.setMonth(nextEligible.getMonth() + 3); // Default to quarterly
  }
  
  return nextEligible;
};

// Method to update capacity after donation
donorCapacitySchema.methods.updateAfterDonation = function(donatedAmount) {
  this.availableCapacity = Math.max(0, this.availableCapacity - donatedAmount);
  this.lastDonationDate = new Date();
  this.nextEligibleDate = this.calculateNextEligibleDate();
  return this.save();
};

// Method to reset capacity (e.g., after recovery period)
donorCapacitySchema.methods.resetCapacity = function() {
  this.availableCapacity = this.totalCapacity;
  this.lastDonationDate = null;
  this.nextEligibleDate = null;
  return this.save();
};

// Pre-save middleware to ensure available capacity doesn't exceed total
donorCapacitySchema.pre('save', function(next) {
  if (this.availableCapacity > this.totalCapacity) {
    this.availableCapacity = this.totalCapacity;
  }
  next();
});

module.exports = mongoose.model("DonorCapacity", donorCapacitySchema);