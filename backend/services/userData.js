// User Data Service - Persistent Data Management for PrepVerse
// Handles all user progress, study plans, bookmarks, and settings with automatic save/fetch

const pool = require('../config/database');

/**
 * Save or update user progress for a specific topic
 * @param {Number} userId - User ID
 * @param {Object} progressData - Progress data to save
 * @returns {Object} Saved progress record
 */
async function saveProgress(userId, progressData) {
  const {
    category,
    topic,
    questionsAttempted = 0,
    questionsCorrect = 0,
    timeSpent = 0
  } = progressData;

  try {
    const result = await pool.query(
      `INSERT INTO user_progress 
       (user_id, category, topic, questions_attempted, questions_correct, time_spent, last_accessed)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       ON CONFLICT (user_id, category, topic) 
       DO UPDATE SET 
         questions_attempted = user_progress.questions_attempted + $4,
         questions_correct = user_progress.questions_correct + $5,
         time_spent = user_progress.time_spent + $6,
         last_accessed = NOW()
       RETURNING *`,
      [userId, category, topic, questionsAttempted, questionsCorrect, timeSpent]
    );

    return {
      success: true,
      progress: result.rows[0]
    };
  } catch (error) {
    console.error('Save progress error:', error);
    throw error;
  }
}

/**
 * Fetch all progress for a user
 * @param {Number} userId - User ID
 * @returns {Array} User progress records
 */
async function fetchUserProgress(userId) {
  try {
    const result = await pool.query(
      `SELECT * FROM user_progress 
       WHERE user_id = $1 
       ORDER BY last_accessed DESC`,
      [userId]
    );

    return {
      success: true,
      progress: result.rows
    };
  } catch (error) {
    console.error('Fetch progress error:', error);
    throw error;
  }
}

/**
 * Get progress for a specific category
 * @param {Number} userId - User ID
 * @param {String} category - Category name
 * @returns {Array} Progress records for category
 */
async function fetchProgressByCategory(userId, category) {
  try {
    const result = await pool.query(
      `SELECT * FROM user_progress 
       WHERE user_id = $1 AND category = $2 
       ORDER BY last_accessed DESC`,
      [userId, category]
    );

    return {
      success: true,
      progress: result.rows
    };
  } catch (error) {
    console.error('Fetch category progress error:', error);
    throw error;
  }
}

/**
 * Create or update a study plan
 * @param {Number} userId - User ID
 * @param {Object} planData - Study plan data
 * @returns {Object} Created/updated study plan
 */
async function saveStudyPlan(userId, planData) {
  const {
    id,
    planName,
    targetExam,
    startDate,
    endDate,
    dailyGoalMinutes = 120,
    topics = []
  } = planData;

  try {
    if (id) {
      // Update existing plan
      const result = await pool.query(
        `UPDATE study_plans 
         SET plan_name = $1, target_exam = $2, start_date = $3, 
             end_date = $4, daily_goal_minutes = $5, topics = $6, 
             updated_at = NOW()
         WHERE id = $7 AND user_id = $8
         RETURNING *`,
        [planName, targetExam, startDate, endDate, dailyGoalMinutes, 
         JSON.stringify(topics), id, userId]
      );

      return {
        success: true,
        plan: result.rows[0]
      };
    } else {
      // Create new plan
      const result = await pool.query(
        `INSERT INTO study_plans 
         (user_id, plan_name, target_exam, start_date, end_date, 
          daily_goal_minutes, topics, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
         RETURNING *`,
        [userId, planName, targetExam, startDate, endDate, 
         dailyGoalMinutes, JSON.stringify(topics)]
      );

      return {
        success: true,
        plan: result.rows[0]
      };
    }
  } catch (error) {
    console.error('Save study plan error:', error);
    throw error;
  }
}

/**
 * Fetch all study plans for a user
 * @param {Number} userId - User ID
 * @returns {Array} User study plans
 */
async function fetchStudyPlans(userId) {
  try {
    const result = await pool.query(
      `SELECT * FROM study_plans 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [userId]
    );

    return {
      success: true,
      plans: result.rows
    };
  } catch (error) {
    console.error('Fetch study plans error:', error);
    throw error;
  }
}

/**
 * Delete a study plan
 * @param {Number} userId - User ID
 * @param {Number} planId - Plan ID
 * @returns {Boolean} Success status
 */
async function deleteStudyPlan(userId, planId) {
  try {
    await pool.query(
      'DELETE FROM study_plans WHERE id = $1 AND user_id = $2',
      [planId, userId]
    );

    return {
      success: true,
      message: 'Study plan deleted successfully'
    };
  } catch (error) {
    console.error('Delete study plan error:', error);
    throw error;
  }
}

/**
 * Add a bookmark
 * @param {Number} userId - User ID
 * @param {Object} bookmarkData - Bookmark data
 * @returns {Object} Created bookmark
 */
async function addBookmark(userId, bookmarkData) {
  const { questionId, category, notes = '' } = bookmarkData;

  try {
    const result = await pool.query(
      `INSERT INTO bookmarks (user_id, question_id, category, notes, created_at)
       VALUES ($1, $2, $3, $4, NOW())
       ON CONFLICT (user_id, question_id) 
       DO UPDATE SET notes = $4, created_at = NOW()
       RETURNING *`,
      [userId, questionId, category, notes]
    );

    return {
      success: true,
      bookmark: result.rows[0]
    };
  } catch (error) {
    console.error('Add bookmark error:', error);
    throw error;
  }
}

/**
 * Fetch all bookmarks for a user
 * @param {Number} userId - User ID
 * @returns {Array} User bookmarks
 */
async function fetchBookmarks(userId) {
  try {
    const result = await pool.query(
      `SELECT * FROM bookmarks 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [userId]
    );

    return {
      success: true,
      bookmarks: result.rows
    };
  } catch (error) {
    console.error('Fetch bookmarks error:', error);
    throw error;
  }
}

/**
 * Remove a bookmark
 * @param {Number} userId - User ID
 * @param {String} questionId - Question ID
 * @returns {Boolean} Success status
 */
async function removeBookmark(userId, questionId) {
  try {
    await pool.query(
      'DELETE FROM bookmarks WHERE user_id = $1 AND question_id = $2',
      [userId, questionId]
    );

    return {
      success: true,
      message: 'Bookmark removed successfully'
    };
  } catch (error) {
    console.error('Remove bookmark error:', error);
    throw error;
  }
}

/**
 * Update user settings
 * @param {Number} userId - User ID
 * @param {Object} settings - Settings data
 * @returns {Object} Updated settings
 */
async function updateSettings(userId, settings) {
  const {
    theme,
    notificationEnabled,
    difficultyPreference,
    preferences = {}
  } = settings;

  try {
    const result = await pool.query(
      `INSERT INTO user_settings 
       (user_id, theme, notification_enabled, difficulty_preference, 
        preferences, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       ON CONFLICT (user_id) 
       DO UPDATE SET 
         theme = COALESCE($2, user_settings.theme),
         notification_enabled = COALESCE($3, user_settings.notification_enabled),
         difficulty_preference = COALESCE($4, user_settings.difficulty_preference),
         preferences = COALESCE($5, user_settings.preferences),
         updated_at = NOW()
       RETURNING *`,
      [userId, theme, notificationEnabled, difficultyPreference, 
       JSON.stringify(preferences)]
    );

    return {
      success: true,
      settings: result.rows[0]
    };
  } catch (error) {
    console.error('Update settings error:', error);
    throw error;
  }
}

/**
 * Fetch user settings
 * @param {Number} userId - User ID
 * @returns {Object} User settings
 */
async function fetchSettings(userId) {
  try {
    const result = await pool.query(
      'SELECT * FROM user_settings WHERE user_id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      // Return default settings if none exist
      return {
        success: true,
        settings: {
          theme: 'light',
          notificationEnabled: true,
          difficultyPreference: 'medium',
          preferences: {}
        }
      };
    }

    return {
      success: true,
      settings: result.rows[0]
    };
  } catch (error) {
    console.error('Fetch settings error:', error);
    throw error;
  }
}

/**
 * Get comprehensive user dashboard data
 * Fetches all user data in a single call for dashboard
 * @param {Number} userId - User ID
 * @returns {Object} Complete user data
 */
async function fetchDashboardData(userId) {
  try {
    const [progress, plans, bookmarks, settings] = await Promise.all([
      fetchUserProgress(userId),
      fetchStudyPlans(userId),
      fetchBookmarks(userId),
      fetchSettings(userId)
    ]);

    return {
      success: true,
      data: {
        progress: progress.progress,
        plans: plans.plans,
        bookmarks: bookmarks.bookmarks,
        settings: settings.settings
      }
    };
  } catch (error) {
    console.error('Fetch dashboard data error:', error);
    throw error;
  }
}

/**
 * Calculate user statistics
 * @param {Number} userId - User ID
 * @returns {Object} User statistics
 */
async function calculateStats(userId) {
  try {
    const result = await pool.query(
      `SELECT 
         COUNT(DISTINCT category) as categories_practiced,
         SUM(questions_attempted) as total_questions_attempted,
         SUM(questions_correct) as total_questions_correct,
         SUM(time_spent) as total_time_spent,
         COUNT(*) as topics_practiced
       FROM user_progress 
       WHERE user_id = $1`,
      [userId]
    );

    const stats = result.rows[0];
    const accuracy = stats.total_questions_attempted > 0 
      ? ((stats.total_questions_correct / stats.total_questions_attempted) * 100).toFixed(2)
      : 0;

    return {
      success: true,
      stats: {
        ...stats,
        accuracy: parseFloat(accuracy)
      }
    };
  } catch (error) {
    console.error('Calculate stats error:', error);
    throw error;
  }
}

module.exports = {
  saveProgress,
  fetchUserProgress,
  fetchProgressByCategory,
  saveStudyPlan,
  fetchStudyPlans,
  deleteStudyPlan,
  addBookmark,
  fetchBookmarks,
  removeBookmark,
  updateSettings,
  fetchSettings,
  fetchDashboardData,
  calculateStats
};
