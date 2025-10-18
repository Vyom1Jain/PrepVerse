const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Load GATE papers from data directory
const gatePapersPath = path.join(__dirname, '../data/gate_papers.json');

let gatePapers = [];

// Read GATE papers on startup
if (fs.existsSync(gatePapersPath)) {
  const data = fs.readFileSync(gatePapersPath, 'utf8');
  gatePapers = JSON.parse(data);
}

// GET all GATE papers
router.get('/papers', (req, res) => {
  try {
    res.json({
      success: true,
      count: gatePapers.length,
      data: gatePapers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch GATE papers'
    });
  }
});

// GET GATE papers by year
router.get('/papers/year/:year', (req, res) => {
  try {
    const year = parseInt(req.params.year);
    const filtered = gatePapers.filter(p => p.year === year);
    res.json({
      success: true,
      count: filtered.length,
      data: filtered
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch papers by year'
    });
  }
});

// GET GATE papers by subject
router.get('/papers/subject/:subject', (req, res) => {
  try {
    const subject = req.params.subject;
    const filtered = gatePapers.filter(p => 
      p.subject && p.subject.toLowerCase() === subject.toLowerCase()
    );
    res.json({
      success: true,
      count: filtered.length,
      data: filtered
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch papers by subject'
    });
  }
});

// GET single GATE paper by ID
router.get('/papers/:id', (req, res) => {
  try {
    const paper = gatePapers.find(p => p.id === req.params.id);
    if (!paper) {
      return res.status(404).json({
        success: false,
        error: 'Paper not found'
      });
    }
    res.json({
      success: true,
      data: paper
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch paper'
    });
  }
});

module.exports = router;
