const fs = require('fs');
const path = require('path');

const dataPath = path.join(process.cwd(), 'src/lib/db/seed/data');
const tagsData = JSON.parse(fs.readFileSync(path.join(dataPath, 'tags.json'), 'utf8'));
const topicsData = JSON.parse(fs.readFileSync(path.join(dataPath, 'topics.json'), 'utf8'));
const problemsData = JSON.parse(fs.readFileSync(path.join(dataPath, 'problems.json'), 'utf8'));

// Build allowed tags per module
const allowedTagsByModule = new Map();
const allTagSlugs = new Set();
tagsData.forEach(t => {
  if (!allowedTagsByModule.has(t.module)) {
    allowedTagsByModule.set(t.module, new Set());
  }
  allowedTagsByModule.get(t.module).add(t.slug);
  allTagSlugs.add(t.slug);
});

// Map problem slug -> topic info
const probToTopic = new Map();
topicsData.forEach(m => {
  (m.topics || []).forEach(t => {
    (t.problems || []).forEach(pSlug => {
      probToTopic.set(pSlug, {
        moduleSlug: m.slug,
        topicSlug: t.slug,
        topicTitle: t.title,
        topicDesc: t.description || ''
      });
    });
  });
});

// Helper tokenizer & matcher
function makeMatcher(title, slug) {
  const normTitle = (title || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ');
  const normSlug = (slug || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ');
  const rawText = `${title || ''} ${slug || ''}`.toLowerCase();
  const tokenSet = new Set([...normTitle.split(/\s+/).filter(Boolean), ...normSlug.split(/\s+/).filter(Boolean)]);
  
  return {
    raw: rawText,
    tokens: tokenSet,
    hasToken: (...words) => words.some(w => tokenSet.has(w.toLowerCase())),
    hasSubstr: (...phrases) => phrases.some(p => rawText.includes(p.toLowerCase()))
  };
}

// Helper to sanitize and sort tags
function sanitizeTags(moduleSlug, derivedTags) {
  const allowed = allowedTagsByModule.get(moduleSlug) || new Set();
  const tagSet = new Set();
  
  // Always include module tag first
  tagSet.add(moduleSlug);

  // Add newly derived tags if valid for this module
  (derivedTags || []).forEach(t => {
    if (allowed.has(t)) {
      tagSet.add(t);
    }
  });

  const arr = Array.from(tagSet);
  const others = arr.filter(t => t !== moduleSlug).sort();
  return [moduleSlug, ...others];
}

// -------------------------------------------------------------
// 1. DATA STRUCTURES & ALGORITHMS (module-dsa)
// -------------------------------------------------------------
function tagDSA(prob, topicInfo) {
  const tSlug = topicInfo ? topicInfo.topicSlug : '';
  const m = makeMatcher(prob.title, prob.slug);
  const tags = new Set();

  const isTopic = (...ts) => ts.some(t => tSlug === t);

  // 1. Arrays & Strings
  if (isTopic('topic-arrays-strings')) {
    tags.add('array');
    if (m.hasToken('string', 'strings', 'anagram', 'roman', 'atoi', 'encode', 'decode', 'substring', 'substrings', 'character', 'characters', 'word', 'words', 'prefix', 'suffix', 'vowel', 'vowels', 'palindrome')) {
      tags.add('string');
    }
    if (m.hasToken('matrix', 'sudoku', 'grid', 'submatrix', 'skyline', 'transpose', 'spiral', 'squares')) {
      tags.add('matrix');
    }
    if (m.hasToken('sort', 'sorted', 'sorting', 'inversion', 'inversions', 'pairs', 'frequency')) tags.add('sorting');
    if (m.hasToken('search', 'searching')) tags.add('searching'), tags.add('binary-search');
    if (m.hasToken('hash', 'hashmap', 'hashset', 'duplicate', 'duplicates', 'frequency', 'distinct', 'bad', 'pairs', 'majority', 'anagram', 'isomorphic', 'consecutive')) {
      tags.add('hash-table');
    }
    if (m.hasToken('math', 'prime', 'primes', 'ugly', 'pascal', 'integer', 'candies', 'atoi')) tags.add('math');
    if (m.hasSubstr('kadane', 'maximum-subarray-sum', 'pascals-triangle')) tags.add('dynamic-programming');
    if (m.hasToken('rotate', 'reverse') || m.hasSubstr('two-pointer', 'two-sum')) tags.add('two-pointers');
    if (m.hasSubstr('count-inversions', 'reverse-pairs')) tags.add('divide-and-conquer');
  }

  // 2. Prefix Sum & Intervals
  if (isTopic('topic-prefix-sum-intervals')) {
    tags.add('array');
    tags.add('prefix-sum');
    if (m.hasToken('meeting', 'meetings', 'interval', 'intervals', 'range', 'overlap', 'arrows', 'balloons', 'query')) {
      tags.add('intervals');
      tags.add('sorting');
      tags.add('greedy');
      tags.add('two-pointers');
      if (m.hasSubstr('meeting-rooms-ii', 'meeting-rooms-iii', 'query')) tags.add('heap');
    }
    if (m.hasToken('matrix', 'submatrices')) tags.add('matrix');
    if (m.hasSubstr('zero-sum', 'equals-k', 'divisible', 'zeros-ones', 'target', 'product-of-array-except-self', 'longest-subarray')) tags.add('hash-table');
    if (m.hasToken('cards', 'bomb', 'defuse', 'window')) tags.add('sliding-window');
  }

  // 3. Two Pointers
  if (isTopic('topic-two-pointers')) {
    tags.add('two-pointers');
    tags.add('array');
    if (m.hasToken('palindrome', 'vowel', 'vowels', 'string', 'reverse', 'words')) tags.add('string');
    if (m.hasToken('sort', 'sorted', 'merge', '3sum', '4sum', 'triplet', 'triplets') || m.hasSubstr('0s-1s-and-2s')) tags.add('sorting');
    if (m.hasToken('container', 'water', 'trapping') || m.hasSubstr('trapping-rain-water')) {
      tags.add('greedy');
      if (m.hasSubstr('trapping-rain-water')) {
        tags.add('dynamic-programming');
        tags.add('stack');
        tags.add('monotonic-stack');
      }
    }
    if (m.hasToken('3sum', '4sum', 'triplet', 'pair')) tags.add('hash-table');
  }

  // 4. Sliding Window
  if (isTopic('topic-sliding-window')) {
    tags.add('sliding-window');
    tags.add('two-pointers');
    tags.add('hash-table');
    if (m.hasToken('string', 'substring', 'character', 'characters', 'anagram', 'prefix') || m.hasSubstr('window-substring', 'repeating-character', 'longest-common-prefix')) {
      tags.add('string');
    } else {
      tags.add('array');
    }
    if (m.hasToken('binary') || m.hasSubstr('k-closest')) tags.add('binary-search');
    if (m.hasSubstr('sliding-window-maximum')) {
      tags.add('deque');
      tags.add('monotonic-queue');
      tags.add('queue');
      tags.add('heap');
    }
    if (m.hasSubstr('longest-common-prefix')) tags.add('trie');
  }

  // 5. Binary Search
  if (isTopic('topic-binary-search')) {
    tags.add('binary-search');
    tags.add('array');
    if (m.hasToken('matrix', '2d', 'row', 'grid') || m.hasSubstr('row-wise')) tags.add('matrix');
    if (m.hasSubstr('koko', 'ship', 'capacity', 'split-array', 'aggressive', 'painter', 'book', 'banana', 'min-max', 'bouquet', 'divisor', 'gas-station', 'median-of-two', 'kth-element', 'nth-root', 'square-root', 'magnetic-force')) {
      tags.add('parametric-search');
    }
    if (m.hasToken('median', 'kth', 'divide') || m.hasSubstr('rotated')) tags.add('divide-and-conquer');
    if (m.hasToken('floor', 'ceil', 'insert', 'occurrences', 'peak') || m.hasSubstr('first-and-last', 'single-element')) {
      tags.add('searching');
    }
  }

  // 6. Linked List
  if (isTopic('topic-linked-list')) {
    tags.add('linked-list');
    if (m.hasToken('doubly', 'dll') || m.hasSubstr('browser-history')) tags.add('doubly-linked-list');
    if (m.hasToken('reverse', 'palindrome', 'middle', 'cycle', 'intersection', 'rotate', 'reorder', 'delete', 'swap') || m.hasSubstr('remove-nth', 'two-pointer')) {
      tags.add('two-pointers');
    }
    if (m.hasSubstr('merge-k', 'sort-list', 'copy-list', 'clone', 'random-pointer', 'add-two-numbers')) {
      if (m.hasSubstr('merge-k')) tags.add('heap');
      if (m.hasSubstr('sort-list')) tags.add('sorting'), tags.add('divide-and-conquer');
      if (m.hasSubstr('copy', 'clone', 'random', 'intersection')) tags.add('hash-table');
      if (m.hasSubstr('add-two-numbers')) tags.add('math');
    }
    if (m.hasToken('implement', 'design') || m.hasSubstr('browser-history', 'lru', 'lfu')) tags.add('design');
    if (m.hasToken('reverse', 'swap', 'flatten') || m.hasSubstr('k-group')) tags.add('recursion');
  }

  // 7. Stack & Queue
  if (isTopic('topic-stack-queue')) {
    tags.add('stack');
    if (m.hasToken('queue', 'deque', 'circular')) tags.add('queue');
    if (m.hasToken('deque')) tags.add('deque');
    if (m.hasSubstr('next-greater', 'next-smaller', 'daily-temperatures', 'largest-rectangle', 'histogram', 'maximal-rectangle', 'stock-span', 'asteroid', 'online-stock', 'subarray-minimums', 'subarray-ranges', 'trapping-rain-water', 'remove-k-digits', '132-pattern')) {
      tags.add('monotonic-stack');
      tags.add('array');
    }
    if (m.hasSubstr('sliding-window-maximum', 'constrained-subsequence')) {
      tags.add('monotonic-queue');
      tags.add('deque');
      tags.add('sliding-window');
      tags.add('queue');
      tags.add('array');
    }
    if (m.hasToken('matrix') || m.hasSubstr('maximal-rectangle')) tags.add('matrix');
    if (m.hasToken('parentheses', 'polish', 'calculator', 'decode', 'simplify') || m.hasSubstr('decode-string', 'simplify-path')) {
      tags.add('string');
      if (m.hasToken('calculator', 'decode')) tags.add('recursion'), tags.add('math');
    }
    if (m.hasToken('implement', 'design') || m.hasSubstr('min-stack', 'lru', 'lfu')) tags.add('design');
    if (m.hasSubstr('implement-stack-using-array', 'implement-queue-using-array')) tags.add('array');
    if (m.hasSubstr('implement-stack-using-linked-list', 'implement-queue-using-linked-list')) tags.add('linked-list');
  }

  // 8. Greedy
  if (isTopic('topic-greedy')) {
    tags.add('greedy');
    tags.add('array');
    if (m.hasToken('cookie', 'lemonade', 'fractional', 'knapsack', 'job', 'platforms', 'interval', 'meetings', 'candy', 'gas', 'jump', 'task') || m.hasSubstr('shortest-job-first', 'assign-cookies')) {
      tags.add('sorting');
    }
    if (m.hasSubstr('fractional-knapsack')) {
      tags.add('greedy');
      tags.add('sorting');
      tags.add('array');
    }
    if (m.hasSubstr('task-scheduler', 'job-sequencing', 'reorganize-string', 'shortest-job-first')) {
      tags.add('heap');
    }
    if (m.hasSubstr('jump-game', 'gas-station', 'candy', 'assign-cookies')) {
      tags.add('two-pointers');
      tags.add('dynamic-programming');
    }
    if (m.hasSubstr('lru', 'page-faults')) tags.add('hash-table');
  }

  // 9. Bit Manipulation
  if (isTopic('topic-bit-manipulation')) {
    tags.add('bit-manipulation');
    tags.add('bitmask');
    tags.add('math');
    if (m.hasToken('array', 'subsets', 'triplets') || m.hasSubstr('single-number', 'two-numbers', 'xor-queries')) tags.add('array');
    if (m.hasToken('subsets', 'combinations', 'permutations')) tags.add('backtracking'), tags.add('recursion');
    if (m.hasToken('divide', 'multiply', 'pow') || m.hasSubstr('divide-two-integers', 'power-of')) tags.add('divide-and-conquer');
  }

  // 10. Recursion & Backtracking
  if (isTopic('topic-recursion-backtracking')) {
    tags.add('recursion');
    tags.add('backtracking');
    if (m.hasToken('sudoku', 'maze', 'grid', 'knight') || m.hasSubstr('n-queens', 'word-search', 'rat-in-a-maze', 'm-coloring')) {
      tags.add('matrix');
    }
    if (m.hasToken('string') || m.hasSubstr('word-break', 'word-search', 'palindrome-partitioning', 'letter-combinations', 'restore-ip', 'generate-parentheses')) {
      tags.add('string');
    }
    if (m.hasToken('subsets', 'permutations') || m.hasSubstr('combination-sum', 'subset-sums', 'sort-a-stack', 'reverse-a-stack')) {
      tags.add('array');
      if (m.hasToken('stack')) tags.add('stack');
    }
    if (m.hasSubstr('word-break', 'palindrome-partitioning')) {
      tags.add('dynamic-programming');
      tags.add('memoization');
      tags.add('tabulation');
    }
    if (m.hasSubstr('tower-of-hanoi', 'count-good-numbers') || m.hasToken('pow')) tags.add('math');
  }

  // 11. Tree
  if (isTopic('topic-tree')) {
    tags.add('tree');
    tags.add('binary-tree');
    tags.add('dfs');
    tags.add('bfs');
    tags.add('recursion');
    tags.add('queue');
    if (m.hasToken('bst') || m.hasSubstr('binary-search-tree', 'search-in-a-binary-search-tree', 'validate-binary-search-tree', 'kth-smallest', 'lowest-common-ancestor-of-a-binary-search-tree', 'insert-into-a-binary-search-tree', 'delete-node-in-a-bst', 'two-sum-iv', 'inorder-successor', 'inorder-predecessor', 'recover-binary-search-tree', 'bst-iterator', 'floor-in-bst', 'ceil-in-bst')) {
      tags.add('binary-search-tree');
      tags.add('binary-search');
    }
    if (m.hasToken('construct', 'preorder', 'inorder', 'postorder', 'flatten', 'serialize', 'codec', 'path', 'diameter') || m.hasSubstr('max-path-sum', 'cameras', 'burning-tree', 'nodes-at-distance-k')) {
      tags.add('hash-table');
      if (m.hasToken('cameras') || m.hasSubstr('house-robber')) tags.add('dynamic-programming');
    }
    if (m.hasToken('iterator', 'codec')) tags.add('design'), tags.add('stack');
  }

  // 12. Heap
  if (isTopic('topic-heap')) {
    tags.add('heap');
    tags.add('array');
    if (m.hasToken('kth', 'top', 'sort', 'median', 'stream', 'reorganize') || m.hasSubstr('task-scheduler', 'k-closest', 'top-k')) {
      tags.add('sorting');
      tags.add('hash-table');
    }
    if (m.hasToken('implement', 'design') || m.hasSubstr('median-finder', 'twitter')) tags.add('design');
    if (m.hasSubstr('merge-k', 'lists')) tags.add('linked-list');
    if (m.hasToken('string', 'characters', 'frequency')) tags.add('string');
  }

  // 13. Graph
  if (isTopic('topic-graph')) {
    tags.add('graph');
    tags.add('bfs');
    tags.add('dfs');
    tags.add('queue');
    if (m.hasToken('matrix', 'grid', 'islands', 'regions', 'enclaves', 'knight') || m.hasSubstr('rotting-oranges', 'flood-fill', 'surrounded-regions', 'pacific-atlantic', 'word-search', 'shortest-path-in-binary-matrix', 'cheapest-flights', 'swim-in-rising-water', 'alien-dictionary')) {
      tags.add('matrix');
      tags.add('array');
    }
    if (m.hasToken('topological', 'kahn') || m.hasSubstr('course-schedule', 'alien-dictionary', 'eventual-safe', 'directed-graph')) {
      tags.add('topological-sort');
    }
    if (m.hasToken('dijkstra', 'bellman', 'floyd') || m.hasSubstr('shortest-path', 'network-delay', 'cheapest-flights', 'min-cost', 'minimum-effort', 'path-with-minimum-effort', 'ways-to-arrive')) {
      tags.add('shortest-path');
      tags.add('heap');
    }
    if (m.hasToken('mst', 'kruskal', 'prim', 'provinces', 'disjoint') || m.hasSubstr('minimum-spanning-tree', 'min-cost-to-connect', 'connecting-cities', 'redundant-connection', 'union-find', 'accounts-merge', 'swim-in-rising-water', 'stones-removed', 'making-a-large-island')) {
      tags.add('union-find');
      if (m.hasToken('mst', 'kruskal', 'prim') || m.hasSubstr('minimum-spanning-tree', 'min-cost-to-connect', 'connecting-cities')) {
        tags.add('minimum-spanning-tree');
        tags.add('greedy');
        tags.add('heap');
      }
    }
    if (m.hasToken('kosaraju', 'tarjan', 'bridges', 'articulation') || m.hasSubstr('strongly-connected')) {
      tags.add('strongly-connected-components');
      tags.add('biconnected-components');
    }
    if (m.hasSubstr('word-ladder')) {
      tags.add('string');
      tags.add('hash-table');
    }
    if (m.hasSubstr('clone-graph')) tags.add('hash-table');
    if (m.hasToken('bipartite')) tags.add('recursion');
  }

  // 14. Dynamic Programming
  if (isTopic('topic-dynamic-programming')) {
    tags.add('dynamic-programming');
    tags.add('memoization');
    tags.add('tabulation');
    tags.add('recursion');
    tags.add('array');

    if (m.hasToken('knapsack', 'coin', 'rod') || m.hasSubstr('0-1-knapsack', 'unbounded-knapsack', 'subset-sum', 'partition-equal', 'target-sum', 'coin-change', 'rod-cutting')) {
      tags.add('array');
    }
    if (m.hasToken('lcs', 'palindrome', 'subsequence', 'string') || m.hasSubstr('longest-common-subsequence', 'edit-distance', 'wildcard', 'regular-expression', 'distinct-subsequences', 'interleaving', 'word-break')) {
      tags.add('string');
      tags.add('matrix');
    }
    if (m.hasToken('grid', 'matrix', 'triangle') || m.hasSubstr('unique-paths', 'min-path-sum', 'cherry-pickup', 'maximal-square', 'dungeon', 'chocolates-pickup')) {
      tags.add('matrix');
    }
    if (m.hasToken('stock', 'lis') || m.hasSubstr('buy-and-sell', 'jump-game', 'house-robber', 'longest-increasing-subsequence', 'russian-doll')) {
      if (m.hasToken('lis') || m.hasSubstr('longest-increasing-subsequence', 'russian-doll')) tags.add('binary-search'), tags.add('sorting');
    }
    if (m.hasToken('mcm') || m.hasSubstr('matrix-chain', 'burst-balloons', 'cut-a-stick', 'boolean-evaluation', 'palindrome-partitioning-ii')) {
      tags.add('intervals');
      tags.add('divide-and-conquer');
    }
    if (m.hasToken('bitmask') || m.hasSubstr('travelling-salesman', 'matchsticks', 'partition-k')) {
      tags.add('bit-manipulation');
      tags.add('bitmask');
    }
    if (m.hasToken('game', 'nim') || m.hasSubstr('stone-game', 'predict-the-winner')) {
      tags.add('game-theory');
      tags.add('math');
    }
    if (m.hasSubstr('digit-dp', 'count-of-integers')) tags.add('math');
  }

  // 15. Advanced Topics
  if (isTopic('topic-advanced-topics-dsa')) {
    if (m.hasToken('trie', 'prefix', 'word', 'words', 'suffix', 'autocomplete', 'substrings', 'lexicographical') || m.hasSubstr('replace-words', 'add-and-search', 'extra-characters', 'distinct-substrings')) {
      tags.add('trie');
      tags.add('string');
      tags.add('hash-table');
      if (m.hasToken('xor')) tags.add('bit-manipulation');
      if (m.hasToken('design', 'implement') || m.hasSubstr('add-and-search')) tags.add('design'), tags.add('dfs');
      if (m.hasSubstr('extra-characters')) tags.add('dynamic-programming'), tags.add('memoization'), tags.add('tabulation');
      if (m.hasSubstr('kth-smallest-in-lexicographical')) tags.add('tree'), tags.add('binary-search'), tags.add('math');
    }
    if (m.hasToken('fenwick', 'segment', 'squares') || m.hasSubstr('segment-tree', 'binary-indexed-tree', 'range-sum-query', 'smaller-numbers', 'count-of-range-sum', 'range-frequency', 'falling-squares', 'range-module', 'create-sorted-array')) {
      tags.add('segment-tree');
      tags.add('binary-indexed-tree');
      tags.add('array');
      tags.add('divide-and-conquer');
      if (m.hasToken('design') || m.hasSubstr('range-module', 'range-frequency')) tags.add('design');
      if (m.hasSubstr('falling-squares', 'range-module')) tags.add('intervals'), tags.add('ordered-set');
      if (m.hasSubstr('create-sorted-array')) tags.add('ordered-set');
    }
    if (m.hasToken('calendar') || m.hasSubstr('my-calendar')) {
      tags.add('intervals');
      tags.add('ordered-set');
      tags.add('binary-search');
      tags.add('design');
      tags.add('array');
      if (m.hasSubstr('my-calendar-iii')) tags.add('segment-tree'), tags.add('line-sweep');
    }
    if (m.hasToken('xor') || m.hasSubstr('maximum-xor')) {
      tags.add('trie');
      tags.add('bit-manipulation');
      tags.add('array');
      if (m.hasSubstr('maximum-xor-with-an-element')) tags.add('sorting'), tags.add('binary-search');
    }
    if (m.hasToken('kmp', 'suffix') || m.hasSubstr('rabin-karp', 'z-algorithm', 'string-matching', 'rolling-hash', 'suffix-array', 'repeated-string')) {
      tags.add('string-matching');
      tags.add('rolling-hash');
      tags.add('string');
      if (m.hasToken('suffix') || m.hasSubstr('suffix-array')) tags.add('suffix-array');
    }
    if (m.hasSubstr('mos-algorithm', 'mo-algorithm')) {
      tags.add('mos-algorithm');
      tags.add('array');
      tags.add('sorting');
    }
    if (m.hasSubstr('line-sweep', 'skyline', 'rectangle-area')) {
      tags.add('line-sweep');
      tags.add('intervals');
      tags.add('heap');
      tags.add('array');
    }
    if (m.hasSubstr('meet-in-the-middle', 'partition-array-into-two-arrays-to-minimize-sum-difference', 'closest-subsequence-sum')) {
      tags.add('meet-in-the-middle');
      tags.add('binary-search');
      tags.add('bit-manipulation');
      tags.add('recursion');
      tags.add('array');
      if (m.hasSubstr('closest-subsequence-sum')) tags.add('two-pointers');
    }
    if (m.hasSubstr('sum-of-subsequence-widths')) {
      tags.add('math');
      tags.add('sorting');
      tags.add('array');
      tags.add('combinatorics');
    }
    if (m.hasSubstr('binary-lifting', 'kth-ancestor', 'lca', 'minimum-edge-weight-equilibrium')) {
      tags.add('binary-lifting');
      tags.add('tree');
      tags.add('binary-tree');
      tags.add('dfs');
      tags.add('graph');
    }
  }

  // Exact Knapsack Overrides
  if (m.hasSubstr('fractional-knapsack')) {
    tags.clear();
    tags.add('greedy');
    tags.add('sorting');
    tags.add('array');
  } else if (m.hasSubstr('0-1-knapsack', 'unbounded-knapsack') || m.hasToken('knapsack')) {
    tags.add('dynamic-programming');
    tags.add('memoization');
    tags.add('tabulation');
    tags.add('recursion');
    tags.add('array');
  }

  if (m.hasSubstr('lru-cache', 'lfu-cache')) {
    tags.add('hash-table');
    tags.add('doubly-linked-list');
    tags.add('linked-list');
    tags.add('design');
  }

  return Array.from(tags);
}

// -------------------------------------------------------------
// 2. OPERATING SYSTEMS (module-os)
// -------------------------------------------------------------
function tagOS(prob, topicInfo) {
  const m = makeMatcher(prob.title, prob.slug);
  const tSlug = topicInfo ? topicInfo.topicSlug : '';
  const tags = new Set();

  if (tSlug === 'topic-os-fundamentals' || m.hasToken('kernel', 'bios', 'booting', 'interrupt', 'trap') || m.hasSubstr('dual-mode', 'system-call', '32-bit', '64-bit', 'monolithic', 'microkernel')) {
    tags.add('os-foundations');
    tags.add('cpu-memory-arch');
    if (m.hasToken('kernel', 'linux') || m.hasSubstr('system-call')) tags.add('linux');
  }
  if (tSlug === 'topic-process-management' || m.hasToken('process', 'pcb', 'fork', 'exec', 'zombie', 'orphan') || m.hasSubstr('context-switch', 'state-transition')) {
    tags.add('processes');
    tags.add('cpu-memory-arch');
    if (m.hasToken('ipc', 'pipe') || m.hasSubstr('message-queue', 'shared-memory')) tags.add('ipc');
  }
  if (tSlug === 'topic-cpu-scheduling' || m.hasToken('scheduling', 'fcfs', 'sjf', 'turnaround') || m.hasSubstr('round-robin', 'priority-scheduling', 'multilevel-queue', 'response-time', 'real-time-scheduling')) {
    tags.add('scheduling');
    tags.add('processes');
    tags.add('cpu-memory-arch');
  }
  if (tSlug === 'topic-process-synchronization' || m.hasToken('synchronization', 'semaphore', 'mutex', 'monitor') || m.hasSubstr('critical-section', 'peterson', 'spin-lock', 'dining-philosopher', 'producer-consumer', 'readers-writers')) {
    tags.add('synchronization');
    tags.add('processes');
    tags.add('threads');
    if (m.hasToken('deadlock') || m.hasSubstr('dining-philosopher')) tags.add('deadlocks');
  }
  if (tSlug === 'topic-deadlocks' || m.hasToken('deadlock', 'deadlocks', 'banker') || m.hasSubstr('resource-allocation-graph')) {
    tags.add('deadlocks');
    tags.add('synchronization');
    tags.add('processes');
  }
  if (tSlug === 'topic-memory-management' || m.hasToken('memory', 'paging', 'segmentation', 'tlb', 'lru', 'fifo', 'thrashing', 'fragmentation', 'mmu', 'swapping') || m.hasSubstr('virtual-memory', 'page-fault', 'page-replacement')) {
    tags.add('memory');
    tags.add('cpu-memory-arch');
    tags.add('os-foundations');
  }
  if (tSlug === 'topic-file-systems' || m.hasToken('inode', 'directory', 'ext4', 'fat', 'ntfs', 'journaling') || m.hasSubstr('file-system', 'hard-link', 'soft-link', 'symlink', 'file-allocation')) {
    tags.add('file-systems');
    tags.add('io');
    tags.add('linux');
  }
  if (tSlug === 'topic-io-disk-management' || m.hasToken('io', 'disk', 'dma', 'polling', 'scan', 'look', 'sstf', 'raid', 'spooling') || m.hasSubstr('c-scan', 'interrupt-driven', 'device-driver')) {
    tags.add('io');
    tags.add('cpu-memory-arch');
    tags.add('os-foundations');
  }
  if (tSlug === 'topic-concurrency-parallelism' || m.hasToken('thread', 'threads', 'concurrency', 'parallelism') || m.hasSubstr('multithreading', 'user-level-thread', 'kernel-level-thread', 'race-condition')) {
    tags.add('threads');
    tags.add('processes');
    tags.add('cpu-memory-arch');
  }
  if (tSlug === 'topic-security-protection' || m.hasToken('security', 'protection', 'spectre', 'meltdown', 'ring', 'privilege') || m.hasSubstr('access-control', 'buffer-overflow')) {
    tags.add('security');
    tags.add('os-foundations');
    tags.add('linux');
  }
  if (tSlug === 'topic-advanced-topics-os' || m.hasToken('virtualization', 'container', 'hypervisor', 'kvm', 'docker', 'cgroups', 'namespaces', 'ebpf') || m.hasSubstr('linux-internals')) {
    tags.add('virtualization');
    tags.add('linux');
    tags.add('os-foundations');
  }

  if (tags.size === 0) {
    tags.add('os-foundations');
    tags.add('linux');
  }
  return Array.from(tags);
}

// -------------------------------------------------------------
// 3. COMPUTER NETWORKS (module-cn)
// -------------------------------------------------------------
function tagCN(prob, topicInfo) {
  const m = makeMatcher(prob.title, prob.slug);
  const tSlug = topicInfo ? topicInfo.topicSlug : '';
  const tags = new Set();

  if (tSlug === 'topic-network-fundamentals' || m.hasToken('osi', 'layer', 'bandwidth', 'latency', 'topology') || m.hasSubstr('tcp/ip', 'encapsulation', 'decapsulation', 'packet-switching', 'circuit-switching')) {
    tags.add('osi-models');
  }
  if (tSlug === 'topic-data-link-layer' || m.hasToken('mac', 'ethernet', 'framing', 'crc', 'arp', 'switch') || m.hasSubstr('data-link', 'error-detection', 'csma/cd')) {
    tags.add('osi-models');
    tags.add('ip-subnetting');
  }
  if (tSlug === 'topic-network-layer' || m.hasToken('ip', 'ipv4', 'ipv6', 'cidr', 'subnet', 'routing', 'bgp', 'ospf', 'rip', 'icmp', 'nat', 'dhcp') || m.hasSubstr('network-layer')) {
    tags.add('ip-subnetting');
    tags.add('dns-routing');
    tags.add('osi-models');
  }
  if (tSlug === 'topic-transport-layer' || m.hasToken('tcp', 'udp', 'handshake', 'syn', 'ack', 'fin') || m.hasSubstr('transport-layer', 'flow-control', 'congestion', 'sliding-window', 'multiplexing', 'demultiplexing', 'window-scaling')) {
    tags.add('tcp-udp');
    tags.add('osi-models');
  }
  if (tSlug === 'topic-application-layer' || m.hasToken('http', 'https', 'http2', 'http3', 'quic', 'dns', 'tls', 'ssl', 'websocket', 'ftp', 'smtp', 'ssh', 'cookie', 'session', 'rest', 'graphql') || m.hasSubstr('application-layer')) {
    tags.add('http');
    tags.add('dns-routing');
    tags.add('tcp-udp');
    if (m.hasToken('proxy') || m.hasSubstr('load-balancer', 'reverse-proxy')) tags.add('load-balancing');
    if (m.hasToken('cdn', 'edge')) tags.add('cdn');
  }
  if (tSlug === 'topic-wireless-mobile-networks' || m.hasToken('wireless', 'wifi', 'bluetooth', 'cellular', '4g', '5g', 'mobile', 'wpa') || m.hasSubstr('802.11', 'csma/ca')) {
    tags.add('wireless');
    tags.add('osi-models');
  }
  if (tSlug === 'topic-network-security' || m.hasToken('security', 'firewall', 'vpn', 'ddos', 'mitm', 'tls', 'ssl', 'certificate', 'pki', 'cryptography', 'ipsec')) {
    tags.add('http');
    tags.add('tcp-udp');
    tags.add('osi-models');
  }
  if (tSlug === 'topic-advanced-networking-concepts' || m.hasToken('cdn', 'anycast', 'sdn', 'edge', 'proxy') || m.hasSubstr('load-balancing', 'overlay-network')) {
    tags.add('load-balancing');
    tags.add('cdn');
    tags.add('dns-routing');
  }

  if (tags.size === 0) {
    tags.add('osi-models');
    tags.add('http');
  }
  return Array.from(tags);
}

// -------------------------------------------------------------
// 4. DATABASES (module-database)
// -------------------------------------------------------------
function tagDatabase(prob, topicInfo) {
  const m = makeMatcher(prob.title, prob.slug);
  const tSlug = topicInfo ? topicInfo.topicSlug : '';
  const tags = new Set();

  if (tSlug === 'topic-database-fundamentals-architecture') {
    if (m.hasSubstr('cap-theorem', 'pacelc', 'acid-vs-base') || m.hasToken('base', 'cap')) {
      tags.add('distributed-systems');
      tags.add('nosql');
    } else {
      tags.add('sql');
      tags.add('schema-design');
      tags.add('indexing');
    }
  }

  if (tSlug === 'topic-relational-databases') {
    tags.add('sql');
    tags.add('keys-relationships');
    tags.add('schema-design');
  }

  if (tSlug === 'topic-sql' || tSlug === 'topic-sql-queries') {
    tags.add('sql');
    tags.add('query-optimization');
    if (m.hasToken('join', 'relationship', 'customers', 'orders', 'employees', 'department', 'manager', 'friend', 'students', 'project') || m.hasSubstr('foreign-key')) {
      tags.add('keys-relationships');
    }
  }

  if (tSlug === 'topic-nosql-databases-modern-data-access') {
    tags.add('nosql');
    tags.add('distributed-systems');
    if (m.hasToken('redis', 'cache', 'memcached')) tags.add('caching');
    if (m.hasToken('sharding', 'replica', 'partition', 'tombstones') || m.hasSubstr('hot-partitions')) tags.add('replication-sharding');
    if (m.hasToken('gsi', 'lsi') || m.hasSubstr('single-table', 'schema')) tags.add('schema-design');
    if (m.hasToken('index', 'gsi', 'lsi')) tags.add('indexing');
  }

  if (tSlug === 'topic-database-design-normalization') {
    tags.add('schema-design');
    tags.add('keys-relationships');
    tags.add('sql');
    if (m.hasToken('orm', 'prisma', 'mongoose') || m.hasSubstr('active-record', 'data-mapper', 'n-plus-1', 'lazy-loading', 'eager-loading')) {
      tags.add('orm');
      tags.add('query-optimization');
    }
  }

  if (tSlug === 'topic-transactions-concurrency-control') {
    tags.add('transactions');
    tags.add('distributed-systems');
    tags.add('sql');
  }

  if (tSlug === 'topic-storage-indexing-hashing') {
    tags.add('indexing');
    tags.add('query-optimization');
    tags.add('schema-design');
    tags.add('sql');
  }

  if (tSlug === 'topic-advanced-topics-database') {
    tags.add('distributed-systems');
    tags.add('replication-sharding');
    if (m.hasToken('cache', 'redis', 'leaderboard')) tags.add('caching');
    if (m.hasToken('design') || m.hasSubstr('url-shortener', 'social-media', 'booking', 'metrics')) {
      tags.add('schema-design');
      tags.add('sql');
    }
  }

  // Cross-cutting topic-independent triggers
  if (m.hasToken('redis', 'memcached') || m.hasSubstr('distributed-cache')) tags.add('caching');
  if (m.hasToken('transaction', 'transactions', 'acid', 'isolation', 'serializable', '2pl', 'mvcc', 'wal', 'saga') || m.hasSubstr('two-phase-commit', '2pc')) tags.add('transactions');
  if (m.hasToken('index', 'indexing', 'b-tree', 'b+tree', 'brin') || m.hasSubstr('composite-index', 'covering-index', 'bitmap-index', 'lsm-tree')) tags.add('indexing');
  if (m.hasToken('orm', 'prisma') || m.hasSubstr('active-record', 'data-mapper', 'n-plus-1')) tags.add('orm');
  if (m.hasToken('sharding', 'partitioning') || m.hasSubstr('read-replicas', 'multi-leader', 'single-leader', 'leaderless')) tags.add('replication-sharding');
  if (m.hasToken('sql', 'postgres', 'postgresql', 'mysql', 'sqlite')) tags.add('sql');
  if (m.hasToken('nosql', 'mongodb', 'cassandra', 'dynamodb', 'neo4j')) tags.add('nosql');

  if (tags.size === 0) {
    tags.add('sql');
    tags.add('schema-design');
  }
  return Array.from(tags);
}

// -------------------------------------------------------------
// 5. BACKEND DEVELOPMENT (module-backend)
// -------------------------------------------------------------
function tagBackend(prob, topicInfo) {
  const m = makeMatcher(prob.title, prob.slug);
  const tSlug = topicInfo ? topicInfo.topicSlug : '';
  const tags = new Set();

  if (tSlug === 'topic-backend-fundamentals' || m.hasToken('nodejs', 'libuv', 'cluster', 'v8', 'eventemitter') || m.hasSubstr('node.js', 'event-loop', 'stream', 'buffer', 'worker-thread', 'nexttick', 'setimmediate', 'garbage-collection')) {
    tags.add('nodejs');
    tags.add('performance');
    tags.add('infrastructure');
  }
  if (tSlug === 'topic-frameworks-api-design' || m.hasToken('rest', 'api', 'express', 'nestjs', 'fastify', 'route', 'middleware', 'controller', 'openapi', 'swagger', 'graphql', 'grpc', 'rpc', 'websocket') || m.hasSubstr('idempotency', 'versioning', 'pagination', 'rate-limit', 'status-code')) {
    tags.add('api-design');
    tags.add('frameworks');
    if (m.hasToken('graphql')) tags.add('graphql');
    if (m.hasToken('grpc', 'rpc', 'protobuf')) tags.add('rpc');
    if (m.hasToken('websocket', 'sse') || m.hasSubstr('socket.io', 'real-time')) tags.add('websockets');
  }
  if (tSlug === 'topic-databases-data-modeling' || m.hasToken('database', 'orm', 'prisma', 'typeorm', 'drizzle', 'mongoose', 'migration', 'dataloader', 'postgres', 'mongo', 'redis') || m.hasSubstr('connection-pool', 'n+1')) {
    tags.add('databases');
    tags.add('performance');
    tags.add('frameworks');
  }
  if (tSlug === 'topic-authentication-authorization-security' || m.hasToken('auth', 'jwt', 'oauth', 'oidc', 'session', 'cookie', 'cors', 'csrf', 'xss', 'rbac', 'abac', 'bcrypt', 'argon2', 'security', 'ssl', 'tls', 'encryption') || m.hasSubstr('sql-injection', 'rate-limiting')) {
    tags.add('auth');
    tags.add('api-design');
    tags.add('performance');
  }
  if (tSlug === 'topic-caching-performance-optimization' || m.hasToken('cache', 'caching', 'redis', 'memcached', 'cdn', 'performance', 'latency', 'profiling', 'compression', 'gzip') || m.hasSubstr('load-testing', 'memory-leak')) {
    tags.add('performance');
    tags.add('databases');
    tags.add('infrastructure');
  }
  if (tSlug === 'topic-async-processing-jobs' || m.hasToken('async', 'bullmq', 'kafka', 'rabbitmq', 'sqs', 'cron', 'celery') || m.hasSubstr('pub-sub', 'event-driven', 'background-job', 'redis-streams', 'dead-letter', 'idempotent-consumer')) {
    tags.add('messaging-queues');
    tags.add('distributed-patterns');
    tags.add('microservices');
  }
  if (tSlug === 'topic-backend-system-architecture-scalability' || m.hasToken('microservice', 'microservices', 'saga', 'cqrs', 'outbox', 'resilience', 'bulkhead', 'retry', 'scaling') || m.hasSubstr('distributed', 'event-sourcing', 'circuit-breaker', 'service-mesh', 'api-gateway', 'bff', 'load-balancer')) {
    tags.add('microservices');
    tags.add('distributed-patterns');
    tags.add('performance');
    tags.add('infrastructure');
  }
  if (tSlug === 'topic-deployment-devops-observability' || m.hasToken('deploy', 'docker', 'kubernetes', 'logging', 'winston', 'pino', 'prometheus', 'grafana', 'opentelemetry', 'tracing', 'apm', 'sentry', 'serverless', 'lambda', 'aws') || m.hasSubstr('ci-cd', 'health-check')) {
    tags.add('infrastructure');
    tags.add('performance');
    if (m.hasToken('serverless', 'lambda', 'faas')) tags.add('serverless');
  }
  if (tSlug === 'topic-lld-clean-architecture' || m.hasToken('solid', 'ddd', 'factory', 'strategy', 'singleton') || m.hasSubstr('clean-architecture', 'hexagonal', 'onion', 'repository-pattern', 'dependency-injection', 'domain-driven-design')) {
    tags.add('frameworks');
    tags.add('api-design');
    tags.add('distributed-patterns');
  }

  if (tags.size === 0) {
    tags.add('api-design');
    tags.add('nodejs');
  }
  return Array.from(tags);
}

// -------------------------------------------------------------
// 6. FRONTEND DEVELOPMENT (module-frontend)
// -------------------------------------------------------------
function tagFrontend(prob, topicInfo) {
  const m = makeMatcher(prob.title, prob.slug);
  const tSlug = topicInfo ? topicInfo.topicSlug : '';
  const tags = new Set();

  if (tSlug === 'topic-web-fundamentals' || m.hasToken('internet', 'browser', 'dom', 'cssom', 'repaint', 'reflow', 'http', 'cookie', 'cors') || m.hasSubstr('critical-rendering-path', 'event-loop', 'web-vitals', 'localstorage', 'sessionstorage', 'indexeddb')) {
    tags.add('browser');
    tags.add('web-apis');
    tags.add('html');
  }
  if (tSlug === 'topic-html-css-accessibility' || m.hasToken('html', 'semantic', 'aria', 'a11y', 'accessibility', 'wcag', 'css', 'flexbox', 'grid', 'bem', 'tailwind', 'animation', 'responsive') || m.hasSubstr('box-model', 'specificity', 'media-query', 'z-index')) {
    tags.add('html');
    tags.add('css');
    tags.add('accessibility');
  }
  if (tSlug === 'topic-javascript-typescript-fundamentals' || m.hasToken('javascript', 'typescript', 'closure', 'prototype', 'promise', 'async', 'debounce', 'throttle', 'currying', 'interface', 'generics') || m.hasSubstr('event-delegation')) {
    tags.add('browser');
    tags.add('web-apis');
  }
  if (tSlug === 'topic-frontend-frameworks' || m.hasToken('react', 'jsx', 'fiber', 'hook', 'usestate', 'useeffect', 'usememo', 'usecallback', 'useref', 'usecontext', 'reconciliation', 'suspense', 'nextjs', 'ssr', 'ssg', 'isr', 'rsc') || m.hasSubstr('virtual-dom', 'custom-hook', 'error-boundary', 'server-component', 'app-router')) {
    tags.add('react');
    if (m.hasToken('nextjs', 'ssr', 'ssg', 'isr', 'rsc') || m.hasSubstr('server-component', 'app-router')) tags.add('nextjs-ssr');
    tags.add('state-management');
  }
  if (tSlug === 'topic-state-management-data-fetching' || m.hasToken('redux', 'zustand', 'jotai', 'mobx', 'swr') || m.hasSubstr('context-api', 'react-query', 'tanstack-query', 'rtk-query', 'data-fetching', 'optimistic-update')) {
    tags.add('state-management');
    tags.add('react');
    tags.add('web-apis');
  }
  if (tSlug === 'topic-libraries-ecosystem' || m.hasToken('testing', 'jest', 'vitest', 'cypress', 'playwright', 'storybook', 'formik', 'zod', 'webpack', 'vite', 'bundler') || m.hasSubstr('react-testing-library', 'react-hook-form', 'framer-motion')) {
    tags.add('testing');
    tags.add('react');
    tags.add('micro-frontends');
  }
  if (tSlug === 'topic-frontend-system-design-machine-coding' || m.hasToken('autocomplete', 'typeahead', 'carousel', 'modal', 'accordion', 'toast', 'stepper', 'kanban', 'tabs') || m.hasSubstr('machine-coding', 'infinite-scroll', 'nested-comments', 'drag-drop', 'star-rating', 'file-explorer', 'virtualized-list', 'poll-widget', 'data-table', 'progress-bar')) {
    tags.add('react');
    tags.add('state-management');
    tags.add('web-apis');
    tags.add('css');
    tags.add('accessibility');
  }
  if (tSlug === 'topic-advanced-topics-frontend' || m.hasToken('pwa', 'webassembly', 'wasm', 'security', 'csp') || m.hasSubstr('micro-frontend', 'module-federation', 'web-worker', 'service-worker', 'web-components', 'shadow-dom')) {
    tags.add('micro-frontends');
    tags.add('web-apis');
    tags.add('browser');
  }

  if (tags.size === 0) {
    tags.add('react');
    tags.add('html');
    tags.add('css');
  }
  return Array.from(tags);
}

// -------------------------------------------------------------
// 7. JAVASCRIPT INTERNALS (module-javascript)
// -------------------------------------------------------------
function tagJS(prob, topicInfo) {
  const m = makeMatcher(prob.title, prob.slug);
  const tSlug = topicInfo ? topicInfo.topicSlug : '';
  const tags = new Set();

  if (tSlug === 'topic-javascript-internals' || m.hasToken('engine', 'v8', 'ignition', 'turbofan', 'ast', 'bytecode', 'jit', 'hoisting', 'tdz') || m.hasSubstr('hidden-classes', 'call-stack', 'memory-heap', 'garbage-collection', 'execution-context', 'scope-chain')) {
    tags.add('scopes-closures');
    tags.add('types');
  }
  if (tSlug === 'topic-arrays-objects-advanced-data-structures' || m.hasToken('proxy', 'reflect', 'symbol', 'iterator', 'generator', 'iterable', 'spread', 'destructuring', 'clone', 'flatten') || m.hasSubstr('weakmap', 'weakset', 'deep-clone', 'array-methods')) {
    tags.add('types');
    tags.add('prototypes');
  }
  if (tSlug === 'topic-functions-closures' || m.hasToken('closure', 'curry', 'currying', 'memoize', 'debounce', 'throttle', 'pipe', 'compose', 'iife') || m.hasSubstr('partial-application', 'higher-order-function', 'pure-function', 'arrow-function', 'lexical-scope')) {
    tags.add('scopes-closures');
    tags.add('async');
  }
  if (tSlug === 'topic-prototypes-inheritance' || m.hasToken('prototype', 'constructor', 'extends', 'super', 'instanceof') || m.hasSubstr('prototypal-inheritance', 'prototype-chain', 'object.create', '__proto__', 'this-binding', 'new-keyword')) {
    tags.add('prototypes');
    tags.add('scopes-closures');
  }
  if (tSlug === 'topic-async-javascript' || m.hasToken('async', 'microtask', 'macrotask', 'promise', 'callback', 'settimeout', 'setinterval', 'abortcontroller') || m.hasSubstr('event-loop', 'async-await', 'promise.all', 'promise.allsettled', 'promise.race', 'promise.any', 'queue-microtask')) {
    tags.add('async');
    tags.add('scopes-closures');
  }
  if (tSlug === 'topic-dom-manipulation-web-apis' || m.hasToken('dom', 'mutationobserver', 'intersectionobserver', 'resizeobserver', 'fetch', 'xhr') || m.hasSubstr('event-bubbling', 'event-capturing', 'event-delegation', 'custom-event', 'localstorage', 'sessionstorage', 'indexeddb', 'web-worker')) {
    tags.add('async');
    tags.add('scopes-closures');
  }
  if (tSlug === 'topic-advance-javascript-concepts' || m.hasToken('module', 'commonjs', 'stream', 'buffer', 'arraybuffer', 'typedarray', 'weakref', 'eventemitter') || m.hasSubstr('es-module', 'dynamic-import', 'memory-leak', 'finalizationregistry')) {
    tags.add('modules');
    tags.add('streams');
    tags.add('types');
  }
  if (tSlug === 'topic-javascript-machine-coding' || m.hasSubstr('implement-promise', 'implement-debounce', 'implement-throttle', 'implement-deep-clone', 'implement-curry', 'implement-flatten', 'implement-eventemitter', 'implement-pipe', 'implement-memoize', 'implement-bind', 'implement-call', 'implement-apply', 'implement-array-flat', 'implement-settimeout', 'implement-clearinterval', 'implement-async-series', 'implement-async-parallel', 'implement-lru-cache', 'implement-json-stringify', 'implement-json-parse')) {
    if (m.hasToken('promise', 'async', 'debounce', 'throttle', 'settimeout') || m.hasSubstr('series', 'parallel')) tags.add('async');
    if (m.hasToken('bind', 'call', 'apply', 'clone', 'prototype', 'class')) tags.add('prototypes');
    if (m.hasToken('curry', 'memoize', 'pipe', 'compose', 'eventemitter', 'closure')) tags.add('scopes-closures');
    if (m.hasToken('flat', 'stringify', 'parse', 'type') || m.hasSubstr('deep-clone')) tags.add('types');
  }

  if (tags.size === 0) {
    tags.add('scopes-closures');
    tags.add('async');
    tags.add('types');
  }
  return Array.from(tags);
}

// -------------------------------------------------------------
// 8. OBJECT-ORIENTED PROGRAMMING (module-oops)
// -------------------------------------------------------------
function tagOOPS(prob, topicInfo) {
  const m = makeMatcher(prob.title, prob.slug);
  const tSlug = topicInfo ? topicInfo.topicSlug : '';
  const tags = new Set();

  if (tSlug === 'topic-oop-fundamentals' || tSlug === 'topic-four-pillars-oop' || m.hasToken('class', 'object', 'constructor', 'destructor', 'abstraction', 'encapsulation', 'inheritance', 'polymorphism', 'interface', 'coupling', 'cohesion', 'static', 'final') || m.hasSubstr('abstract-class', 'method-overloading', 'method-overriding', 'access-specifier', 'multiple-inheritance', 'diamond-problem')) {
    tags.add('oop-fundamentals');
  }
  if (tSlug === 'topic-design-principles' || m.hasToken('solid', 'dry', 'kiss', 'yagni') || m.hasSubstr('single-responsibility', 'open-closed', 'liskov', 'interface-segregation', 'dependency-inversion', 'composition-over-inheritance', 'law-of-demeter')) {
    tags.add('oop-fundamentals');
    tags.add('design-patterns');
  }
  if (tSlug === 'topic-design-patterns' || m.hasToken('singleton', 'factory', 'builder', 'prototype', 'adapter', 'decorator', 'facade', 'proxy', 'composite', 'bridge', 'flyweight', 'strategy', 'observer', 'command', 'iterator', 'state', 'mediator', 'memento', 'visitor') || m.hasSubstr('abstract-factory', 'template-method', 'chain-of-responsibility')) {
    tags.add('design-patterns');
    tags.add('oop-fundamentals');
  }
  if (tSlug === 'topic-advanced-topics-oop' || m.hasToken('spaghetti') || m.hasSubstr('anti-pattern', 'god-object', 'shotgun-surgery', 'tight-coupling', 'premature-optimization', 'anemic-domain-model', 'code-smell')) {
    tags.add('anti-patterns');
    tags.add('oop-fundamentals');
  }

  if (tags.size === 0) {
    tags.add('oop-fundamentals');
    tags.add('design-patterns');
  }
  return Array.from(tags);
}

// -------------------------------------------------------------
// 9. SYSTEM DESIGN (module-system-design)
// -------------------------------------------------------------
function tagSystemDesign(prob, topicInfo) {
  const m = makeMatcher(prob.title, prob.slug);
  const tSlug = topicInfo ? topicInfo.topicSlug : '';
  const tags = new Set();

  tags.add('scalability');
  tags.add('storage');

  if (tSlug === 'topic-system-design-fundamentals' || m.hasToken('radio', 'framework', 'interview', 'estimation', 'cap', 'pacelc', 'caching', 'cdn', 'sharding', 'replication') || m.hasSubstr('back-of-the-envelope', 'high-availability', 'fault-tolerance', 'consistent-hashing', 'load-balancing')) {
    tags.add('scalability');
    tags.add('storage');
    tags.add('tools');
  }
  if (tSlug === 'topic-networking-api-design' || m.hasToken('rest', 'graphql', 'grpc', 'websocket', 'sse', 'tls', 'ssl', 'http2', 'http3') || m.hasSubstr('long-polling', 'api-gateway', 'reverse-proxy', 'rate-limiter', 'token-bucket', 'leaky-bucket')) {
    tags.add('tools');
    tags.add('scalability');
  }
  if (tSlug === 'topic-database-storage-design' || m.hasToken('sql', 'nosql', 'rdbms', 'document', 'columnar', 'graph', 'blob', 's3', 'replication', 'sharding', 'partitioning', 'acid', 'wal', 'cdc', 'debezium') || m.hasSubstr('key-value', 'eventual-consistency', 'lsm-tree', 'b-tree')) {
    tags.add('storage');
    tags.add('scalability');
  }
  if (tSlug === 'topic-caching-content-delivery' || m.hasToken('cache', 'caching', 'redis', 'memcached', 'cdn', 'lru', 'lfu') || m.hasSubstr('cache-aside', 'write-through', 'write-behind', 'cache-invalidation', 'edge-computing')) {
    tags.add('storage');
    tags.add('scalability');
    tags.add('tools');
  }
  if (tSlug === 'topic-async-processing-messaging' || m.hasToken('kafka', 'rabbitmq', 'sqs', 'cqrs', 'saga', 'flink', 'spark') || m.hasSubstr('message-queue', 'pub-sub', 'event-driven', 'event-sourcing', 'batch-processing', 'stream-processing', 'dead-letter-queue')) {
    tags.add('scalability');
    tags.add('tools');
  }
  if (tSlug === 'topic-system-architecture-distributed-systems' || m.hasToken('microservices', 'monolith', 'discovery', 'consensus', 'raft', 'paxos', 'resilience') || m.hasSubstr('service-mesh', 'distributed-lock', 'distributed-transaction', '2pc', 'vector-clock', 'gossip-protocol', 'virtual-nodes', 'circuit-breaker')) {
    tags.add('scalability');
    tags.add('tools');
    tags.add('storage');
  }
  if (tSlug === 'topic-reliability-observability-security' || m.hasToken('observability', 'monitoring', 'logging', 'tracing', 'opentelemetry', 'metrics', 'prometheus', 'grafana', 'sla', 'slo', 'sli', 'auth', 'ddos', 'security') || m.hasSubstr('circuit-breaker', 'rate-limiting')) {
    tags.add('observability');
    tags.add('tools');
    tags.add('scalability');
  }
  if (tSlug === 'topic-system-design-scenarios' || m.hasSubstr('design-url-shortener', 'design-rate-limiter', 'design-distributed-cache', 'design-twitter', 'design-instagram', 'design-whatsapp', 'design-chat', 'design-uber', 'design-ride-sharing', 'design-youtube', 'design-netflix', 'design-web-crawler', 'design-search-autocomplete', 'design-typeahead', 'design-payment-system', 'design-e-commerce', 'design-ticketmaster', 'design-notification-system', 'design-key-value-store', 'design-google-drive', 'design-dropbox', 'design-distributed-lock-manager', 'design-proximity-service', 'design-yelp', 'design-google-maps', 'design-stock-exchange', 'design-metrics-monitoring-system', 'design-logging-system', 'design-distributed-job-scheduler')) {
    tags.add('scalability');
    tags.add('storage');
    tags.add('tools');
    if (m.hasToken('search', 'elastic') || m.hasSubstr('autocomplete', 'typeahead', 'crawler', 'proximity', 'yelp', 'maps')) tags.add('search');
    if (m.hasToken('metrics', 'monitoring', 'logging', 'tracing', 'observability')) tags.add('observability');
  }

  return Array.from(tags);
}

// -------------------------------------------------------------
// 10. DEVOPS & CLOUD (module-devops)
// -------------------------------------------------------------
function tagDevOps(prob, topicInfo) {
  const m = makeMatcher(prob.title, prob.slug);
  const tSlug = topicInfo ? topicInfo.topicSlug : '';
  const tags = new Set();

  if (tSlug === 'topic-devops-fundamentals' || m.hasToken('devops', 'linux', 'sysadmin', 'bash', 'shell', 'systemd', 'cron', 'ssh', 'ssl', 'governance', 'sbom', 'security', 'troubleshoot')) {
    tags.add('architecture');
    tags.add('networking');
    if (m.hasToken('kubernetes', 'k8s', 'cluster', 'pod', 'opa')) tags.add('kubernetes');
    if (m.hasToken('docker', 'container')) tags.add('docker');
  }
  if (tSlug === 'topic-vcs-cicd' || m.hasToken('git', 'jenkins', 'pipeline', 'gitops', 'flux', 'branching', 'merge', 'rebase', 'sops', 'secret') || m.hasSubstr('github-actions', 'gitlab-ci', 'ci-cd', 'argo-cd', 'semantic-release')) {
    tags.add('git');
    tags.add('ci-cd');
    tags.add('architecture');
    if (m.hasToken('kubernetes', 'k8s')) tags.add('kubernetes');
  }
  if (tSlug === 'topic-containers-orchestration' || m.hasToken('docker', 'dockerfile', 'container', 'runc', 'containerd', 'kubernetes', 'k8s', 'pod', 'deployment', 'service', 'ingress', 'statefulset', 'daemonset', 'hpa', 'helm', 'operator', 'namespace') || m.hasSubstr('multi-stage')) {
    tags.add('docker');
    tags.add('kubernetes');
    tags.add('architecture');
    if (m.hasToken('ingress', 'network', 'service', 'port')) tags.add('networking');
  }
  if (tSlug === 'topic-cloud-iac' || m.hasToken('terraform', 'iac', 'cloudformation', 'pulumi', 'aws', 's3', 'ec2', 'iam', 'vpc', 'rds', 'lambda', 'eks', 'ecs', 'cloudwatch') || m.hasSubstr('route-53', 'cost-optimization', 'rightsizing')) {
    tags.add('terraform');
    tags.add('aws');
    tags.add('architecture');
    if (m.hasToken('vpc', 'subnet', 'nat', 'network') || m.hasSubstr('route-53')) tags.add('networking');
  }
  if (tSlug === 'topic-observability-monitoring-logging' || m.hasToken('prometheus', 'grafana', 'promql', 'elk', 'elasticsearch', 'logstash', 'kibana', 'fluentd', 'loki', 'jaeger', 'opentelemetry', 'tracing', 'apm', 'alerting', 'alertmanager', 'canary') || m.hasSubstr('argo-rollouts')) {
    tags.add('monitoring-observability');
    tags.add('architecture');
    tags.add('ci-cd');
    if (m.hasToken('kubernetes', 'k8s', 'pod')) tags.add('kubernetes');
  }
  if (tSlug === 'topic-devops-scenarios' || m.hasToken('canary', 'failover', 'jenkins') || m.hasSubstr('blue-green', 'disaster-recovery', 'multi-region', 'zero-downtime', 'chaos-engineering', 'incident-response', 'route-53', 'aurora')) {
    tags.add('architecture');
    tags.add('ci-cd');
    tags.add('aws');
    tags.add('networking');
    tags.add('monitoring-observability');
  }

  if (tags.size === 0) {
    tags.add('architecture');
    tags.add('ci-cd');
    tags.add('docker');
  }
  return Array.from(tags);
}

// -------------------------------------------------------------
// 11. ARTIFICIAL INTELLIGENCE & MACHINE LEARNING (module-ai)
// -------------------------------------------------------------
function tagAI(prob, topicInfo) {
  const m = makeMatcher(prob.title, prob.slug);
  const tSlug = topicInfo ? topicInfo.topicSlug : '';
  const tags = new Set();

  if (tSlug === 'topic-ml-core' || m.hasToken('svm', 'knn', 'pca', 'kaggle', 'fraud') || m.hasSubstr('linear-regression', 'logistic-regression', 'decision-tree', 'random-forest', 'gradient-boosting', 'xgboost', 'lightgbm', 'k-means', 'bias-variance', 'cross-validation', 'roc-auc', 'precision-recall', 'hyperparameter', 'feature-engineering')) {
    tags.add('machine-learning');
    tags.add('data-science');
  }
  if (tSlug === 'topic-deep-learning' || m.hasToken('perceptron', 'mlp', 'adam', 'sgd', 'rmsprop', 'dropout', 'convolution') || m.hasSubstr('neural-network', 'deep-learning', 'backpropagation', 'gradient-descent', 'activation-function', 'loss-function', 'cross-entropy', 'batch-norm', 'layer-norm', '1d-convolution', '2d-convolution')) {
    tags.add('deep-learning');
    tags.add('neural-networks');
    tags.add('machine-learning');
  }
  if (tSlug === 'topic-computer-vision' || m.hasToken('cnn', 'pooling', 'resnet', 'vgg', 'yolo', 'vit', 'shopee', 'pneumonia', 'lyft') || m.hasSubstr('computer-vision', 'convolutional', 'object-detection', 'image-segmentation', 'vision-transformer', 'image-classification')) {
    tags.add('computer-vision');
    tags.add('deep-learning');
    tags.add('neural-networks');
    tags.add('machine-learning');
  }
  if (tSlug === 'topic-nlp' || m.hasToken('nlp', 'word2vec', 'glove', 'fasttext', 'bpe', 'wordpiece', 'rnn', 'lstm', 'gru', 'seq2seq', 'attention', 'bert', 'toxic', 'jigsaw') || m.hasSubstr('natural-language-processing', 'tokenization', 'tf-idf', 'sentiment-analysis')) {
    tags.add('nlp');
    tags.add('deep-learning');
    tags.add('neural-networks');
    tags.add('machine-learning');
  }
  if (tSlug === 'topic-llms-generative-ai' || m.hasToken('llm', 'transformer', 'gpt', 'llama', 'rag', 'lora', 'qlora', 'rlhf', 'embeddings', 'langchain') || m.hasSubstr('large-language-model', 'generative-ai', 'self-attention', 'multi-head-attention', 'prompt-engineering', 'few-shot', 'zero-shot', 'retrieval-augmented', 'fine-tuning', 'vector-database', 'llama-index', 'hugging-face', 'tokenizer')) {
    tags.add('llm');
    tags.add('nlp');
    tags.add('deep-learning');
    tags.add('neural-networks');
    tags.add('hugging-face');
  }
  if (tSlug === 'topic-reinforcement-learning' || m.hasToken('dqn', 'ppo', 'mdp', 'atari', 'pegasos', 'svm') || m.hasSubstr('reinforcement-learning', 'q-learning', 'policy-gradient', 'actor-critic', 'markov-decision-process', 'bellman-equation')) {
    tags.add('machine-learning');
    tags.add('deep-learning');
    tags.add('neural-networks');
  }
  if (tSlug === 'topic-ml-lld' || m.hasToken('mlflow', 'triton', 'feast', 'kubeflow') || m.hasSubstr('recommendation-system', 'feature-store', 'model-serving', 'inference-server', 'ab-testing', 'model-monitoring', 'data-pipeline')) {
    tags.add('data-science');
    tags.add('machine-learning');
    tags.add('deep-learning');
  }

  if (tags.size === 0) {
    tags.add('machine-learning');
    tags.add('data-science');
  }
  return Array.from(tags);
}

// -------------------------------------------------------------
// 12. BLOCKCHAIN (module-blockchain)
// -------------------------------------------------------------
function tagBlockchain(prob, topicInfo) {
  const m = makeMatcher(prob.title, prob.slug);
  const tSlug = topicInfo ? topicInfo.topicSlug : '';
  const tags = new Set();

  if (tSlug === 'topic-blockchain-fundamentals' || m.hasToken('hash', 'pow', 'pos', 'slashing', 'bft', 'sybil', 'consensus', 'slither') || m.hasSubstr('blockchain-fundamentals', 'cryptography', 'sha-256', 'keccak-256', 'ecdsa', 'ed25519', 'merkle-tree', 'merkle-patricia', 'digital-signature', 'proof-of-work', 'proof-of-stake', '51-attack', 'long-range-attack')) {
    tags.add('cryptography');
    tags.add('consensus');
    if (m.hasToken('slither', 'security')) tags.add('solidity');
  }
  if (tSlug === 'topic-ethereum-evm' || m.hasToken('ethereum', 'evm', 'account', 'nonce', 'gas', 'opcode', 'calldata', 'memory', 'eip', 'erc') || m.hasSubstr('storage-slot', 'storage-packing', 'state-transition', 'bls-signature', 'beacon-chain')) {
    tags.add('ethereum');
    tags.add('solidity');
    tags.add('cryptography');
    tags.add('consensus');
  }
  if (tSlug === 'topic-smart-contracts-solidity' || m.hasToken('solidity', 'modifier', 'reentrancy', 'openzeppelin', 'foundry', 'hardhat', 'yul', 'huff', 'assembly') || m.hasSubstr('smart-contract', 'checks-effects-interactions', 'role-based-access')) {
    tags.add('solidity');
    tags.add('ethereum');
    if (m.hasToken('yul', 'huff', 'assembly') || m.hasSubstr('optimization')) tags.add('yul');
  }
  if (tSlug === 'topic-web3-integration' || m.hasToken('web3', 'ethers', 'viem', 'wagmi', 'wallet', 'metamask', 'rpc', 'oracle', 'chainlink', 'vrf', 'api') || m.hasSubstr('off-chain', 'event-listener')) {
    tags.add('web3');
    tags.add('ethereum');
    tags.add('solidity');
  }
  if (tSlug === 'topic-token-standards-nfts-storage' || m.hasToken('token', 'erc20', 'erc721', 'erc1155', 'nft', 'minting', 'metadata', 'ipfs', 'arweave', 'soulbound') || m.hasSubstr('dutch-auction')) {
    tags.add('nft');
    tags.add('solidity');
    tags.add('ethereum');
    tags.add('web3');
    if (m.hasToken('yul')) tags.add('yul');
  }
  if (tSlug === 'topic-defi-daos' || m.hasToken('defi', 'dex', 'amm', 'uniswap', 'aave', 'compound', 'lending', 'borrowing', 'staking', 'dao', 'governance', 'timelock') || m.hasSubstr('constant-product', 'liquidity-pool', 'impermanent-loss', 'flash-loan', 'yield-farming', 'token-voting')) {
    tags.add('defi');
    tags.add('solidity');
    tags.add('ethereum');
    tags.add('web3');
    if (m.hasToken('nft')) tags.add('nft');
  }
  if (tSlug === 'topic-scaling-l2s' || m.hasToken('zk', 'snark', 'stark', 'circom', 'groth16', 'poseidon', 'iszero', 'eddsa', 'rollup', 'arbitrum', 'optimism', 'zksync', 'starknet', 'validium', 'solana', 'anchor', 'pda', 'cpi', 'borsh') || m.hasSubstr('zero-knowledge', 'optimistic-rollup', 'zk-rollup', 'rust-smart-contract')) {
    if (m.hasToken('zk', 'snark', 'stark', 'circom', 'groth16', 'poseidon', 'iszero', 'eddsa') || m.hasSubstr('zero-knowledge')) {
      tags.add('zk');
      tags.add('cryptography');
    }
    if (m.hasToken('solana', 'anchor', 'pda', 'cpi', 'borsh')) {
      tags.add('solana');
      tags.add('web3');
    }
    tags.add('ethereum');
  }
  if (tSlug === 'topic-blockchain-scenarios' || m.hasToken('reentrancy', 'ethernaut', 'damnvulnerabledefi', 'mev', 'multisig') || m.hasSubstr('flash-loan-attack', 'oracle-manipulation', 'sandwich-attack', 'front-running', 'social-recovery', 'gnosis-safe', 'bridge-hack', 'signature-replay')) {
    tags.add('solidity');
    tags.add('ethereum');
    tags.add('defi');
    tags.add('web3');
    tags.add('cryptography');
  }

  if (tags.size === 0) {
    tags.add('solidity');
    tags.add('ethereum');
    tags.add('cryptography');
  }
  return Array.from(tags);
}

// -------------------------------------------------------------
// MAIN PROCESSOR & AUDITOR
// -------------------------------------------------------------

function runEnrichment(save = false) {
  let updatedCount = 0;
  const tagCountDistBefore = {};
  const tagCountDistAfter = {};

  const enrichedProblems = problemsData.map(prob => {
    const existingTags = prob.tags || [];
    const moduleTag = existingTags.find(t => t.startsWith('module-')) || 'module-dsa';
    const topicInfo = probToTopic.get(prob.slug);

    tagCountDistBefore[existingTags.length] = (tagCountDistBefore[existingTags.length] || 0) + 1;

    let newTags = [];
    switch (moduleTag) {
      case 'module-dsa':
        newTags = tagDSA(prob, topicInfo);
        break;
      case 'module-os':
        newTags = tagOS(prob, topicInfo);
        break;
      case 'module-cn':
        newTags = tagCN(prob, topicInfo);
        break;
      case 'module-database':
        newTags = tagDatabase(prob, topicInfo);
        break;
      case 'module-backend':
        newTags = tagBackend(prob, topicInfo);
        break;
      case 'module-frontend':
        newTags = tagFrontend(prob, topicInfo);
        break;
      case 'module-javascript':
        newTags = tagJS(prob, topicInfo);
        break;
      case 'module-oops':
        newTags = tagOOPS(prob, topicInfo);
        break;
      case 'module-system-design':
        newTags = tagSystemDesign(prob, topicInfo);
        break;
      case 'module-devops':
        newTags = tagDevOps(prob, topicInfo);
        break;
      case 'module-ai':
        newTags = tagAI(prob, topicInfo);
        break;
      case 'module-blockchain':
        newTags = tagBlockchain(prob, topicInfo);
        break;
      default:
        newTags = [];
    }

    const finalTags = sanitizeTags(moduleTag, newTags);
    tagCountDistAfter[finalTags.length] = (tagCountDistAfter[finalTags.length] || 0) + 1;

    if (JSON.stringify(existingTags) !== JSON.stringify(finalTags)) {
      updatedCount++;
    }

    return {
      ...prob,
      tags: finalTags
    };
  });

  console.log(`\n========================================`);
  console.log(`ENRICHMENT SUMMARY:`);
  console.log(`Total Problems Processed: ${enrichedProblems.length}`);
  console.log(`Total Problems Updated:   ${updatedCount}`);
  console.log(`\nTag Count Distribution BEFORE:`, tagCountDistBefore);
  console.log(`\nTag Count Distribution AFTER: `, tagCountDistAfter);

  // VALIDATION & INVARIANTS CHECK
  console.log(`\n========================================`);
  console.log(`VALIDATION CHECKS:`);
  let invalidTagCount = 0;
  let crossModuleCount = 0;
  let onlyModuleTagCount = 0;

  enrichedProblems.forEach(p => {
    const mod = p.tags[0];
    const allowed = allowedTagsByModule.get(mod);

    if (p.tags.length === 1) {
      onlyModuleTagCount++;
      console.warn(`Problem has only 1 tag: [${p.slug}] (${mod})`);
    }

    p.tags.forEach(t => {
      if (!allTagSlugs.has(t)) {
        invalidTagCount++;
        console.error(`Invalid tag '${t}' on problem '${p.slug}'`);
      }
      if (allowed && !allowed.has(t)) {
        crossModuleCount++;
        console.error(`Cross-module tag '${t}' on problem '${p.slug}' (Module: ${mod})`);
      }
    });
  });

  console.log(`- Invalid tag errors:       ${invalidTagCount}`);
  console.log(`- Cross-module tag errors:  ${crossModuleCount}`);
  console.log(`- Only-module-tag problems: ${onlyModuleTagCount}`);

  // Test cases sample checks
  console.log(`\n========================================`);
  console.log(`SAMPLE PROBLEM VERIFICATION:`);
  const checkSlugs = [
    '0-1-knapsack-problem',
    'fractional-knapsack',
    'unbounded-knapsack',
    'longest-common-subsequence',
    'trapping-rain-water',
    'course-schedule',
    'word-ladder',
    'implement-trie-prefix-tree',
    'lru-cache-implementation',
    'explain-cap-theorem-with-examples',
    'database-normalization-explained',
    'b-tree-index-structure-performance',
    'n-plus-1-query-problem',
    'sql-isolation-levels-anomalies',
    'nodejs-event-loop-phases',
    'semantic-html-elements',
    'zk-iszero',
    'long-range-attack-simulation-pos'
  ];

  checkSlugs.forEach(slug => {
    const p = enrichedProblems.find(item => item.slug === slug);
    if (p) {
      console.log(`- ${p.slug.padEnd(40)} -> [ ${p.tags.join(', ')} ]`);
    } else {
      console.warn(`- ${slug} NOT FOUND`);
    }
  });

  if (save) {
    fs.writeFileSync(path.join(dataPath, 'problems.json'), JSON.stringify(enrichedProblems, null, 2), 'utf8');
    console.log(`\n✅ Successfully updated problems.json!`);
  }
}

const shouldSave = process.argv.includes('--save');
runEnrichment(shouldSave);
