const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Load DSA questions from seed file
const dsaQuestionsPath = path.join(__dirname, '../data/dsa_questions_seed.json');

let dsaQuestions = [];

// Read DSA questions on startup
if (fs.existsSync(dsaQuestionsPath)) {
  const data = fs.readFileSync(dsaQuestionsPath, 'utf8');
  dsaQuestions = JSON.parse(data);
}

// GET all DSA questions
router.get('/questions', (req, res) => {
  try {
    res.json({
      success: true,
      count: dsaQuestions.length,
      data: dsaQuestions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch DSA questions'
    });
  }
});

// GET DSA questions by topic
router.get('/questions/topic/:topic', (req, res) => {
  try {
    const topic = req.params.topic;
    const filtered = dsaQuestions.filter(q => 
      q.topic && q.topic.toLowerCase() === topic.toLowerCase()
    );
    res.json({
      success: true,
      count: filtered.length,
      data: filtered
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch questions by topic'
    });
  }
});

// GET DSA questions by difficulty
router.get('/questions/difficulty/:level', (req, res) => {
  try {
    const level = req.params.level;
    const filtered = dsaQuestions.filter(q => 
      q.difficulty && q.difficulty.toLowerCase() === level.toLowerCase()
    );
    res.json({
      success: true,
      count: filtered.length,
      data: filtered
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch questions by difficulty'
    });
  }
});

// GET single DSA question by ID
router.get('/questions/:id', (req, res) => {
  try {
    const question = dsaQuestions.find(q => q.id === req.params.id);
    if (!question) {
      return res.status(404).json({
        success: false,
        error: 'Question not found'
      });
    }
    res.json({
      success: true,
      data: question
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch question'
    });
  }
});

module.exports = router;
