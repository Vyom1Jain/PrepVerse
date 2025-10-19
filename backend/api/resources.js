const express = require('express');
const router = express.Router();

// Get all study resources
router.get('/', async (req, res) => {
  try {
    // TODO: Implement database query for resources
    const resources = [
      {
        id: '1',
        title: 'Data Structures and Algorithms Made Easy',
        description: 'Comprehensive guide to DSA concepts with examples',
        type: 'book',
        category: 'Data Structures',
        url: 'https://example.com/dsa-book',
        difficulty: 'Intermediate',
        duration: '40 hours',
        rating: 4.5,
        views: 1200,
        isFavorite: false
      },
      {
        id: '2',
        title: 'Dynamic Programming Tutorial',
        description: 'Complete video series on DP patterns and problems',
        type: 'video',
        category: 'Algorithms',
        url: 'https://example.com/dp-tutorial',
        difficulty: 'Advanced',
        duration: '15 hours',
        rating: 4.8,
        views: 2500,
        isFavorite: false
      },
      {
        id: '3',
        title: 'System Design Primer',
        description: 'Learn system design concepts for technical interviews',
        type: 'article',
        category: 'System Design',
        url: 'https://example.com/system-design',
        difficulty: 'Advanced',
        rating: 4.7,
        views: 3000,
        isFavorite: false
      }
    ];
    res.json({ resources });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
});

// Get resource by ID
router.get('/:resourceId', async (req, res) => {
  try {
    const { resourceId } = req.params;
    // TODO: Implement database query for specific resource
    const resource = {
      id: resourceId,
      title: 'Sample Resource',
      description: 'Description of the resource',
      type: 'tutorial',
      category: 'Programming',
      url: 'https://example.com/resource',
      difficulty: 'Beginner',
      rating: 4.0,
      views: 500
    };
    res.json(resource);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch resource' });
  }
});

// Toggle resource favorite
router.post('/:resourceId/favorite', async (req, res) => {
  try {
    const { resourceId } = req.params;
    // TODO: Implement database update for favorite status
    res.json({ success: true, message: 'Favorite status updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update favorite' });
  }
});

// Add new resource (admin only)
router.post('/', async (req, res) => {
  try {
    const resourceData = req.body;
    // TODO: Implement database insert for new resource
    res.status(201).json({ success: true, message: 'Resource added', id: 'new-id' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add resource' });
  }
});

// Update resource (admin only)
router.put('/:resourceId', async (req, res) => {
  try {
    const { resourceId } = req.params;
    const updates = req.body;
    // TODO: Implement database update for resource
    res.json({ success: true, message: 'Resource updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update resource' });
  }
});

// Delete resource (admin only)
router.delete('/:resourceId', async (req, res) => {
  try {
    const { resourceId } = req.params;
    // TODO: Implement database delete for resource
    res.json({ success: true, message: 'Resource deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete resource' });
  }
});

module.exports = router;
