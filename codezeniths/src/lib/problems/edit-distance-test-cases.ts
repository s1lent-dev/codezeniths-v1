export interface EditDistanceTestCase {
  input: string;
  expectedOutput: string;
  isSample: boolean;
  note: string;
}

function computeEditDistance(word1: string, word2: string): string {
  const m = word1.length, n = word2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) dp[i][j] = dp[i - 1][j - 1];
      else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n].toString();
}

function generateCases(): EditDistanceTestCase[] {
  const cases: EditDistanceTestCase[] = [
    { input: "horse\nros", expectedOutput: "3", isSample: true, note: "leetcode example 1" },
    { input: "intention\nexecution", expectedOutput: "5", isSample: true, note: "leetcode example 2" },
    { input: "\n", expectedOutput: "0", isSample: true, note: "both empty" },
  ];
  const addCase = (w1: string, w2: string, note: string) =>
    cases.push({ input: `${w1}\n${w2}`, expectedOutput: computeEditDistance(w1, w2), isSample: false, note });

  addCase("", "a", "empty to single char");
  addCase("a", "", "single char to empty");
  addCase("a", "a", "single identical char");

  const repA = "a".repeat(500), repB = "b".repeat(500);
  addCase(repA, repA, "max length identical");
  addCase(repA, repB, "max length all different");
  addCase(repA, "", "max length to empty");

  const pairs = [["kitten", "sitting"], ["sunday", "saturday"], ["flaw", "lawn"], ["gumbo", "gambol"]];
  pairs.forEach(([w1, w2]) => addCase(w1, w2, `dict pair`));

  while (cases.length < 119) {
    const len1 = Math.floor(Math.random() * 200) + 50, len2 = Math.floor(Math.random() * 200) + 50;
    const genStr = (len: number) =>
      Array.from({ length: len }, () => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('');
    addCase(genStr(len1), genStr(len2), `random`);
  }
  return cases.slice(0, 119);
}

export const editDistanceTestCases = generateCases();
