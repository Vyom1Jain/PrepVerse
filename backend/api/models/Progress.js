/**
 * Progress Model
 * TODO: Implement database model for user progress tracking
 * 
 * This model should track:
 * - User question attempts and results
 * - Study streak and consistency
 * - Topic-wise progress
 * - Daily/weekly study time
 * - Achievement milestones
 */

const mongoose = require('mongoose');

/**
 * TODO: Define Progress Schema
 * Fields to include:
 * - userId: ObjectId (ref: 'User')
 * - questionId: ObjectId (ref: 'Question')
 * - status: String (enum: 'not_attempted', 'in_progress', 'completed', 'skipped')
 * - isCorrect: Boolean
 * - attempts: Number
 * - timeSpent: Number (in seconds)
 * - lastAttemptDate: Date
 * - difficulty: String
 * - topic: String
 * - notes: String (user's personal notes)
 * - bookmarked: Boolean
 * - createdAt: Date
 * - updatedAt: Date
 */

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  status: {
    type: String,
    enum: ['not_attempted', 'in_progress', 'completed', 'skipped', 'reviewing'],
    default: 'not_attempted'
  },
  isCorrect: {
    type: Boolean,
    default: false
  },
  attempts: {
    type: Number,
    default: 0
  },
  timeSpent: {
    type: Number, // in seconds
    default: 0
  },
  lastAttemptDate: {
    type: Date,
    default: Date.now
  },
  submittedAnswer: mongoose.Schema.Types.Mixed,
  difficulty: String,
  topic: String,
  notes: String,
  bookmarked: {
    type: Boolean,
    default: false
  },
  // Detailed attempt history
  attemptHistory: [{
    attemptDate: Date,
    isCorrect: Boolean,
    timeSpent: Number,
    answer: mongoose.Schema.Types.Mixed
  }]
}, {
  timestamps: true
});

// TODO: Add compound indexes for efficient queries
progressSchema.index({ userId: 1, questionId: 1 }, { unique: true });
progressSchema.index({ userId: 1, status: 1 });
progressSchema.index({ userId: 1, topic: 1 });
progressSchema.index({ userId: 1, lastAttemptDate: -1 });

/**
 * TODO: Schema for daily/weekly statistics
 */
const userStatsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  totalQuestionsAttempted: {
    type: Number,
    default: 0
  },
  totalQuestionsCompleted: {
    type: Number,
    default: 0
  },
  correctAnswers: {
    type: Number,
    default: 0
  },
  totalTimeSpent: {
    type: Number, // in minutes
    default: 0
  },
  currentStreak: {
    type: Number,
    default: 0
  },
  longestStreak: {
    type: Number,
    default: 0
  },
  lastStudyDate: Date,
  // Topic-wise breakdown
  topicProgress: [{
    topic: String,
    attempted: Number,
    completed: Number,
    correct: Number
  }],
  // Weekly activity
  weeklyActivity: [{
    week: String, // ISO week number
    questionsCompleted: Number,
    timeSpent: Number
  }]
}, {
  timestamps: true
});

// TODO: Add instance methods
progressSchema.methods.markAsCompleted = function(isCorrect, timeSpent) {
  this.status = 'completed';
  this.isCorrect = isCorrect;
  this.attempts += 1;
  this.timeSpent += timeSpent;
  this.lastAttemptDate = new Date();
  return this.save();
};

// TODO: Add static methods
progressSchema.statics.getUserProgress = function(userId) {
  return this.find({ userId }).populate('questionId');
};

progressSchema.statics.getTopicProgress = function(userId, topic) {
  return this.find({ userId, topic });
};

const Progress = mongoose.model('Progress', progressSchema);
const UserStats = mongoose.model('UserStats', userStatsSchema);

module.exports = {
  Progress,
  UserStats
};
