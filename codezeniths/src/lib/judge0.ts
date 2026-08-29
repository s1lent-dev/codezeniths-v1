const JUDGE0_URL = process.env.JUDGE0_URL || 'http://localhost:2358';

export const LANGUAGE_IDS = { cpp: 54, javascript: 63 } as const;

export interface Judge0Submission {
  source_code: string;
  language_id: number;
  stdin: string;
  expected_output: string;
}

export interface Judge0Result {
  token: string;
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  message: string | null;
  status: { id: number; description: string };
  time: string | null;
  memory: number | null;
}

export async function submitBatch(submissions: Judge0Submission[]): Promise<string[]> {
  const res = await fetch(`${JUDGE0_URL}/submissions/batch?base64_encoded=false`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ submissions }),
  });
  if (!res.ok) throw new Error(`Judge0 submit failed: ${await res.text()}`);
  const data: { token: string }[] = await res.json();
  return data.map((d) => d.token);
}

export async function pollBatch(
  tokens: string[],
  { intervalMs = 1000, maxAttempts = 30 } = {}
): Promise<Judge0Result[]> {
  const fields = 'token,stdout,stderr,compile_output,message,status,time,memory';
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const res = await fetch(
      `${JUDGE0_URL}/submissions/batch?tokens=${tokens.join(',')}&base64_encoded=false&fields=${fields}`
    );
    if (!res.ok) throw new Error(`Judge0 poll failed: ${await res.text()}`);
    const data: { submissions: Judge0Result[] } = await res.json();
    if (!data.submissions.some((r) => r.status.id === 1 || r.status.id === 2)) return data.submissions;
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error('Judge0 polling timed out');
}
