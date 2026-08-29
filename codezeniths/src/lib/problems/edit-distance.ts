import { editDistanceTestCases } from './edit-distance-test-cases';

export const editDistanceProblem = {
  slug: 'edit-distance',
  number: 72,
  title: 'Edit Distance',
  difficulty: 'Medium' as const,
  status: 'Solved' as const,
  topics: ['Dynamic Programming', 'String'],
  companies: ['Google', 'Amazon', 'Microsoft', 'Adobe'],

  description:
    'Given two strings `word1` and `word2`, return the minimum number of operations required to convert `word1` to `word2`.\n\nYou have the following three operations permitted on a word:\n- Insert a character\n- Delete a character\n- Replace a character',

  examples: [
    {
      input: 'word1 = "horse", word2 = "ros"',
      output: '3',
      explanation:
        "horse -> rorse (replace 'h' with 'r')\nrorse -> rose (remove 'r')\nrose -> ros (remove 'e')",
    },
    {
      input: 'word1 = "intention", word2 = "execution"',
      output: '5',
      explanation:
        "intention -> inention (remove 't')\ninention -> enention (replace 'i' with 'e')\nenention -> exention (replace 'n' with 'x')\nexention -> execution (replace 'n' with 'c')\nexection -> execution (insert 'u')",
    },
  ],

  constraints: [
    '0 <= word1.length, word2.length <= 500',
    'word1 and word2 consist of lowercase English letters.',
  ],

  boilerplate: {
    cpp: `class Solution {\npublic:\n    int minDistance(string word1, string word2) {\n        \n    }\n};`,
    typescript: `class Solution {\n    minDistance(word1: string, word2: string): number {\n        \n    }\n}`,
  },

  driverTemplate: {
    cpp: `#include <iostream>\n#include <string>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\n{{USER_CODE}}\n\nint main() {\n    string word1, word2;\n    if (!getline(cin, word1)) word1 = "";\n    if (!getline(cin, word2)) word2 = "";\n    if (!word1.empty() && word1.back() == '\\r') word1.pop_back();\n    if (!word2.empty() && word2.back() == '\\r') word2.pop_back();\n\n    Solution sol;\n    cout << sol.minDistance(word1, word2) << endl;\n    return 0;\n}\n`,
    typescript: `{{USER_CODE}}\n\nconst fs = require('fs');\nconst input = fs.readFileSync(0, 'utf8');\nconst lines = input.split(/\\r?\\n/);\nconst word1 = lines[0] !== undefined ? lines[0] : '';\nconst word2 = lines[1] !== undefined ? lines[1] : '';\n\nconst sol = new Solution();\nconsole.log(sol.minDistance(word1, word2));\n`,
  },
  testCases: editDistanceTestCases,
};
