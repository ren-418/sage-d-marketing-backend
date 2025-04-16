const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  company: {
    type: String,
    trim: true
  },
  interestedServices: [{
    type: String,
    enum: ['Digital Marketing', 'Media Production', 'Interactive', 'Technology', 'Events']
  }],
  budget: {
    type: String,
    enum: ['Under R50,000', 'R50,000 - R100,000', 'R100,000 - R500,000', 'Over R500,000', 'Not Specified']
  },
  timeline: {
    type: String,
    enum: ['Immediate', '1-3 months', '3-6 months', '6+ months', 'Not Specified']
  },
  requirements: {
    type: String
  },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Negotiating', 'Closed Won', 'Closed Lost'],
    default: 'New'
  },
  notes: [{
    text: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  bookingDetails: {
    preferredDate: Date,
    preferredTime: String,
    meetingType: {
      type: String,
      enum: ['Online', 'In-person', 'Phone']
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
leadSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Lead', leadSchema); 