# Admin Import Templates

This document describes CSV/JSON import templates for seeding PrepVerse with DSA questions, GATE CSE papers, and resources. Use these as reference for admin panel bulk-import.

## 1) DSA Questions (JSON or CSV)
- File: backend/data/dsa_questions_seed.json or dsa_questions_seed.csv
- Required fields:
  - id (number)
  - title (string)
  - difficulty (Easy|Medium|Hard)
  - tags (array or comma-separated)
  - source (LeetCode|GFG|Kaggle|Sheet|Other)
  - problem_url (string URL)
  - pattern (string)
  - description (string)

CSV Header:
```
id,title,difficulty,tags,source,problem_url,pattern,description
```
Example row:
```
1,Two Sum,Easy,"Array;Hash Table",LeetCode,https://leetcode.com/problems/two-sum/,Hash Map,Return indices of two numbers summing to target
```

## 2) GATE CSE Papers (JSON)
- File: backend/data/gate_cse_papers_seed.json
- Structure:
```
{
  "gate_cse_papers": [
    {
      "year": 2024,
      "paper_type": "GATE CS",
      "subjects": [
        {
          "subject": "Operating Systems",
          "questions": [
            {
              "question_id": "2024_OS_1",
              "question": "...",
              "options": ["A","B","C","D"],
              "correct_answer": "A",
              "explanation": "...",
              "marks": 1
            }
          ]
        }
      ],
      "sources": ["Collegedunia","JagranJosh","GeeksforGeeks"]
    }
  ],
  "metadata": {"years_covered": "2005-2024"}
}
```

## 3) GATE CSE Resources (CSV)
- File: backend/data/gate_cse_resources.csv
- CSV Header:
```
subject,topic,type,title,creator/provider,url,notes
```
- type: Playlist | Notes | YouTube Playlist | Article | Book

## Import Notes
- Encoding: UTF-8, newline as \n
- CSV delimiter: comma, escape internal commas with quotes
- Tags field in CSV can be semicolon-separated
- Validate URLs before import
- Idempotency: Prefer upsert on (year, question_id) and (title, url)
- Keep backups of previous seeds

## Source Attributions
- LeetCode Pattern 500
- GeeksforGeeks DSA
- Striver/NeetCode/Blind 75
- Kaggle datasets for coding problems
- Collegedunia/JagranJosh/GFG for GATE past papers
- NPTEL, Gate Smashers, Neso Academy, Abdul Bari, William Fiset for resources
