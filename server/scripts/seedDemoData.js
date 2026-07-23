"use strict";

require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../src/models/User");
const Problem = require("../src/models/Problem");
const StudyList = require("../src/models/StudyList");

const DEMO_EMAIL = "demo@preppilot.com";
const DEMO_PASSWORD = "Demo@123";

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI not set in .env");
    process.exit(1);
  }
  await mongoose.connect(uri);
  console.log("Connected to MongoDB");
}

async function createDemoUser() {
  let user = await User.findOne({ email: DEMO_EMAIL });

  if (user) {
    console.log("Demo user already exists, reusing...");
    return user;
  }

  user = new User({
    name: "Demo User",
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
  });

  await user.save();
  console.log("Created demo user");
  return user;
}

function generateToken(user) {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

const PROBLEMS = [
  {
    title: "Two Sum",
    leetcodeLink: "https://leetcode.com/problems/two-sum",
    difficulty: "Easy", topic: "Arrays", status: "Solved",
    attemptCount: 1, revisionCount: 3, timeSpentMinutes: 20,
    solvedAt: new Date("2026-01-15"), language: "JavaScript",
    notes: "Classic hash map approach. O(n) time and space.",
  },
  {
    title: "Longest Substring Without Repeating Characters",
    leetcodeLink: "https://leetcode.com/problems/longest-substring-without-repeating-characters",
    difficulty: "Medium", topic: "Sliding Window", status: "Solved",
    attemptCount: 2, revisionCount: 2, timeSpentMinutes: 35,
    solvedAt: new Date("2026-01-18"), language: "Python",
    notes: "Sliding window with set to track chars. Edge case: empty string.",
  },
  {
    title: "3Sum",
    leetcodeLink: "https://leetcode.com/problems/3sum",
    difficulty: "Medium", topic: "Two Pointers", status: "In Progress",
    attemptCount: 3, revisionCount: 1, timeSpentMinutes: 45,
    solvedAt: null, language: "JavaScript",
    notes: "Sort + two pointers. Need to handle duplicate triplets.",
  },
  {
    title: "Valid Parentheses",
    leetcodeLink: "https://leetcode.com/problems/valid-parentheses",
    difficulty: "Easy", topic: "Stack", status: "Solved",
    attemptCount: 1, revisionCount: 4, timeSpentMinutes: 15,
    solvedAt: new Date("2026-01-10"), language: "JavaScript",
    notes: "Stack mapping closing to opening brackets.",
  },
  {
    title: "Merge k Sorted Lists",
    leetcodeLink: "https://leetcode.com/problems/merge-k-sorted-lists",
    difficulty: "Hard", topic: "Heaps / Priority Queue", status: "In Progress",
    attemptCount: 4, revisionCount: 1, timeSpentMinutes: 60,
    solvedAt: null, language: "Python",
    notes: "Min-heap approach. Also try divide & conquer.",
  },
  {
    title: "Maximum Subarray",
    leetcodeLink: "https://leetcode.com/problems/maximum-subarray",
    difficulty: "Medium", topic: "Dynamic Programming", status: "Solved",
    attemptCount: 2, revisionCount: 3, timeSpentMinutes: 25,
    solvedAt: new Date("2026-02-01"), language: "JavaScript",
    notes: "Kadane's algorithm. DP is just max ending here.",
  },
  {
    title: "Binary Tree Level Order Traversal",
    leetcodeLink: "https://leetcode.com/problems/binary-tree-level-order-traversal",
    difficulty: "Medium", topic: "BFS", status: "Solved",
    attemptCount: 1, revisionCount: 2, timeSpentMinutes: 20,
    solvedAt: new Date("2026-02-05"), language: "Python",
    notes: "Standard BFS using queue. Track level size.",
  },
  {
    title: "Clone Graph",
    leetcodeLink: "https://leetcode.com/problems/clone-graph",
    difficulty: "Medium", topic: "DFS", status: "Not Started",
    attemptCount: 1, revisionCount: 0, timeSpentMinutes: 0,
    solvedAt: null, language: "",
    notes: "Need to learn this. HashMap for old->new node mapping.",
  },
  {
    title: "Word Search II",
    leetcodeLink: "https://leetcode.com/problems/word-search-ii",
    difficulty: "Hard", topic: "Trie", status: "Not Started",
    attemptCount: 1, revisionCount: 0, timeSpentMinutes: 0,
    solvedAt: null, language: "",
    notes: "Trie + backtracking. Optimize with pruning.",
  },
  {
    title: "LRU Cache",
    leetcodeLink: "https://leetcode.com/problems/lru-cache",
    difficulty: "Medium", topic: "Design", status: "Solved",
    attemptCount: 3, revisionCount: 2, timeSpentMinutes: 50,
    solvedAt: new Date("2026-02-10"), language: "JavaScript",
    notes: "HashMap + doubly linked list. get and put O(1).",
  },
  {
    title: "Number of Islands",
    leetcodeLink: "https://leetcode.com/problems/number-of-islands",
    difficulty: "Medium", topic: "DFS", status: "Solved",
    attemptCount: 1, revisionCount: 3, timeSpentMinutes: 25,
    solvedAt: new Date("2026-02-12"), language: "Python",
    notes: "DFS on each '1', mark visited. O(mn).",
  },
  {
    title: "Trapping Rain Water",
    leetcodeLink: "https://leetcode.com/problems/trapping-rain-water",
    difficulty: "Hard", topic: "Two Pointers", status: "In Progress",
    attemptCount: 5, revisionCount: 2, timeSpentMinutes: 75,
    solvedAt: null, language: "JavaScript",
    notes: "Two pointers from both ends. Maintain leftMax and rightMax.",
  },
  {
    title: "Group Anagrams",
    leetcodeLink: "https://leetcode.com/problems/group-anagrams",
    difficulty: "Medium", topic: "Strings", status: "Solved",
    attemptCount: 1, revisionCount: 2, timeSpentMinutes: 20,
    solvedAt: new Date("2026-02-15"), language: "Python",
    notes: "Sort each word or use char count as key.",
  },
  {
    title: "Find Median from Data Stream",
    leetcodeLink: "https://leetcode.com/problems/find-median-from-data-stream",
    difficulty: "Hard", topic: "Heaps / Priority Queue", status: "Not Started",
    attemptCount: 1, revisionCount: 0, timeSpentMinutes: 0,
    solvedAt: null, language: "",
    notes: "Two heaps: max-heap for left, min-heap for right.",
  },
  {
    title: "Longest Palindromic Substring",
    leetcodeLink: "https://leetcode.com/problems/longest-palindromic-substring",
    difficulty: "Medium", topic: "Strings", status: "In Progress",
    attemptCount: 2, revisionCount: 1, timeSpentMinutes: 40,
    solvedAt: null, language: "JavaScript",
    notes: "Expand around center. O(n^2). Manacher's for O(n).",
  },
  {
    title: "Serialize and Deserialize Binary Tree",
    leetcodeLink: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree",
    difficulty: "Hard", topic: "Trees", status: "Not Started",
    attemptCount: 1, revisionCount: 0, timeSpentMinutes: 0,
    solvedAt: null, language: "",
    notes: "Preorder traversal with null markers. Use queue for deserialize.",
  },
  {
    title: "Search in Rotated Sorted Array",
    leetcodeLink: "https://leetcode.com/problems/search-in-rotated-sorted-array",
    difficulty: "Medium", topic: "Binary Search", status: "Solved",
    attemptCount: 2, revisionCount: 3, timeSpentMinutes: 30,
    solvedAt: new Date("2026-02-20"), language: "Python",
    notes: "Find pivot first, then binary search on appropriate half.",
  },
  {
    title: "Reverse Linked List",
    leetcodeLink: "https://leetcode.com/problems/reverse-linked-list",
    difficulty: "Easy", topic: "Linked List", status: "Solved",
    attemptCount: 1, revisionCount: 5, timeSpentMinutes: 10,
    solvedAt: new Date("2026-01-08"), language: "JavaScript",
    notes: "Iterative with prev pointer. Recursive is also clean.",
  },
  {
    title: "Subtree of Another Tree",
    leetcodeLink: "https://leetcode.com/problems/subtree-of-another-tree",
    difficulty: "Easy", topic: "Trees", status: "Solved",
    attemptCount: 1, revisionCount: 2, timeSpentMinutes: 20,
    solvedAt: new Date("2026-01-12"), language: "Python",
    notes: "DFS check if identical at each node.",
  },
  {
    title: "Coin Change",
    leetcodeLink: "https://leetcode.com/problems/coin-change",
    difficulty: "Medium", topic: "Dynamic Programming", status: "In Progress",
    attemptCount: 3, revisionCount: 2, timeSpentMinutes: 45,
    solvedAt: null, language: "JavaScript",
    notes: "DP bottom-up. DP[i] = min coins for amount i.",
  },
  {
    title: "Top K Frequent Elements",
    leetcodeLink: "https://leetcode.com/problems/top-k-frequent-elements",
    difficulty: "Medium", topic: "Hashing", status: "Solved",
    attemptCount: 1, revisionCount: 2, timeSpentMinutes: 25,
    solvedAt: new Date("2026-02-22"), language: "Python",
    notes: "Bucket sort by frequency. O(n).",
  },
  {
    title: "Sliding Window Maximum",
    leetcodeLink: "https://leetcode.com/problems/sliding-window-maximum",
    difficulty: "Hard", topic: "Sliding Window", status: "Not Started",
    attemptCount: 1, revisionCount: 0, timeSpentMinutes: 0,
    solvedAt: null, language: "",
    notes: "Deque approach. Maintain indices of max candidates.",
  },
  {
    title: "Kth Smallest Element in a BST",
    leetcodeLink: "https://leetcode.com/problems/kth-smallest-element-in-a-bst",
    difficulty: "Medium", topic: "Binary Search Trees", status: "Solved",
    attemptCount: 1, revisionCount: 1, timeSpentMinutes: 20,
    solvedAt: new Date("2026-02-18"), language: "JavaScript",
    notes: "Inorder traversal. Iterative stack or recursion.",
  },
  {
    title: "Pacific Atlantic Water Flow",
    leetcodeLink: "https://leetcode.com/problems/pacific-atlantic-water-flow",
    difficulty: "Medium", topic: "Graphs", status: "Not Started",
    attemptCount: 1, revisionCount: 0, timeSpentMinutes: 0,
    solvedAt: null, language: "",
    notes: "Reverse DFS from both oceans. Track reachable cells.",
  },
  {
    title: "Alien Dictionary",
    leetcodeLink: "https://leetcode.com/problems/alien-dictionary",
    difficulty: "Hard", topic: "Graphs", status: "Not Started",
    attemptCount: 1, revisionCount: 0, timeSpentMinutes: 0,
    solvedAt: null, language: "",
    notes: "Topological sort using DFS or Kahn's algorithm.",
  },
];

const STUDY_LISTS = [
  {
    name: "Blind 75",
    description: "The essential 75 LeetCode questions covering all major DSA patterns. A must-solve for any coding interview.",
    color: "cyan",
    icon: "Bookmark",
    problemIndices: [0, 1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 17, 18, 19, 20, 21, 22],
  },
  {
    name: "NeetCode 150",
    description: "A comprehensive collection of 150 problems recommended by NeetCode. Covers every important topic in depth.",
    color: "violet",
    icon: "Bookmark",
    problemIndices: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
  },
  {
    name: "Graph Revision",
    description: "Graph algorithms including BFS, DFS, topological sort, and connected components. Good for last-minute revision.",
    color: "emerald",
    icon: "GitBranch",
    problemIndices: [7, 8, 10, 23, 24],
  },
  {
    name: "DP Mastery",
    description: "Dynamic Programming problems from basic to advanced. Includes 1D DP, 2D DP, and optimization techniques.",
    color: "rose",
    icon: "Zap",
    problemIndices: [5, 13, 19],
  },
  {
    name: "Amazon Interview",
    description: "Frequently asked Amazon interview problems. Focus on arrays, strings, and OOD.",
    color: "amber",
    icon: "Briefcase",
    problemIndices: [0, 1, 3, 9, 10, 12, 14, 20],
  },
  {
    name: "Google Interview",
    description: "Google's favorite problem patterns: graphs, DP, hard arrays, and system design fundamentals.",
    color: "blue",
    icon: "Briefcase",
    problemIndices: [2, 4, 6, 8, 11, 13, 15, 16, 21, 23, 24],
  },
  {
    name: "Top Medium Problems",
    description: "Curated list of Medium difficulty problems that appear most frequently in coding interviews.",
    color: "slate",
    icon: "TrendingUp",
    problemIndices: [1, 2, 5, 7, 9, 10, 12, 14, 16, 17, 19, 20, 22],
  },
];

async function createProblems(user) {
  const created = [];

  for (const p of PROBLEMS) {
    const existing = await Problem.findOne({
      user: user._id,
      leetcodeLink: p.leetcodeLink,
    });
    if (existing) {
      created.push(existing);
      continue;
    }

    const problem = new Problem({
      ...p,
      user: user._id,
    });
    await problem.save();
    created.push(problem);
  }

  return created;
}

async function createStudyLists(user, problems) {
  const created = [];

  for (const sl of STUDY_LISTS) {
    const existing = await StudyList.findOne({
      user: user._id,
      name: sl.name,
    });
    if (existing) {
      created.push(existing);
      continue;
    }

    const listProblems = sl.problemIndices.map((i) => problems[i]._id);

    const studyList = new StudyList({
      name: sl.name,
      description: sl.description,
      color: sl.color,
      icon: sl.icon,
      user: user._id,
      problems: listProblems,
    });
    await studyList.save();
    created.push(studyList);
  }

  return created;
}

async function main() {
  try {
    await connectDB();

    const user = await createDemoUser();
    const token = generateToken(user);

    const problems = await createProblems(user);
    const studyLists = await createStudyLists(user, problems);

    const problemIds = problems.map((p) => p._id);
    const listIds = studyLists.map((l) => l._id);

    const allProblemsSameUser = problems.every((p) =>
      p.user.equals(user._id)
    );
    const allListsSameUser = studyLists.every((l) =>
      l.user.equals(user._id)
    );

    if (!allProblemsSameUser || !allListsSameUser) {
      console.error("ERROR: Ownership mismatch detected");
    }

    console.log("");
    console.log("=====================================");
    console.log("Demo Login");
    console.log("Email:    " + DEMO_EMAIL);
    console.log("Password: " + DEMO_PASSWORD);
    console.log("JWT:      " + token);
    console.log("Problems Created: " + problems.length);
    console.log("Study Lists Created: " + studyLists.length);
    console.log("=====================================");
    console.log("");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Seed script error:", err);
    await mongoose.disconnect();
    process.exit(1);
  }
}

main();
