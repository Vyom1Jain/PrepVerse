/**
 * Question Model
 * TODO: Implement database model for questions/problems
 * 
 * This model should define:
 * - Question schema/structure
 * - Question types (MCQ, coding, subjective)
 * - Difficulty levels
 * - Tags and categories
 * - Topic associations
 */

const mongoose = require('mongoose');

/**
 * TODO: Define Question Schema
 * Fields to include:
 * - title: String (required)
 * - description: String (required)
 * - type: String (enum: 'mcq', 'coding', 'subjective')
 * - difficulty: String (enum: 'easy', 'medium', 'hard')
 * - topics: Array of Strings
 * - tags: Array of Strings
 * - options: Array (for MCQ type)
 * - correctAnswer: Mixed (depends on type)
 * - explanation: String
 * - solutionCode: String (for coding type)
 * - points: Number
 * - timeLimit: Number (in minutes)
 * - companies: Array of Strings (companies that asked this)
 * - source: String (source of the question)
 * - createdBy: ObjectId (ref: 'User')
 * - createdAt: Date
 * - updatedAt: Date
 */

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['mcq', 'coding', 'subjective'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  topics: [{
    type: String,
    trim: true
  }],
  tags: [{
    type: String,
    trim: true
  }],
  // For MCQ questions
  options: [{
    text: String,
    isCorrect: Boolean
  }],
  correctAnswer: mongoose.Schema.Types.Mixed,
  explanation: String,
  solutionCode: String,
  hints: [String],
  points: {
    type: Number,
    default: 10
  },
  timeLimit: {
    type: Number, // in minutes
    default: 30
  },
  companies: [String],
  source: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // Statistics
  attemptCount: {
    type: Number,
    default: 0
  },
  successRate: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// TODO: Add indexes for better query performance
questionSchema.index({ topics: 1, difficulty: 1 });
questionSchema.index({ tags: 1 });

// TODO: Add instance methods
questionSchema.methods.incrementAttempts = function() {
  this.attemptCount += 1;
  return this.save();
};

// TODO: Add static methods for complex queries
questionSchema.statics.findByDifficulty = function(difficulty) {
  return this.find({ difficulty });
};

questionSchema.statics.findByTopic = function(topic) {
  return this.find({ topics: topic });
};

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
