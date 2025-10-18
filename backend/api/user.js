const express = require('express');
const router = express.Router();
const userDataService = require('../services/userData');

// GET user profile
router.get('/profile/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const profile = await userDataService.getUserProfile(userId);
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user profile'
    });
  }
});

// GET user progress
router.get('/progress/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const progress = await userDataService.getUserProgress(userId);
    
    res.json({
      success: true,
      data: progress
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user progress'
    });
  }
});

// POST update user progress
router.post('/progress/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const progressData = req.body;
    
    const updated = await userDataService.updateUserProgress(userId, progressData);
    
    res.json({
      success: true,
      data: updated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update user progress'
    });
  }
});

// GET user study plans
router.get('/study-plans/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const studyPlans = await userDataService.getUserStudyPlans(userId);
    
    res.json({
      success: true,
      data: studyPlans
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch study plans'
    });
  }
});

// POST create study plan
router.post('/study-plans/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const planData = req.body;
    
    const newPlan = await userDataService.createStudyPlan(userId, planData);
    
    res.json({
      success: true,
      data: newPlan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create study plan'
    });
  }
});

// PUT update study plan
router.put('/study-plans/:userId/:planId', async (req, res) => {
  try {
    const { userId, planId } = req.params;
    const planData = req.body;
    
    const updated = await userDataService.updateStudyPlan(userId, planId, planData);
    
    res.json({
      success: true,
      data: updated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update study plan'
    });
  }
});

module.exports = router;
