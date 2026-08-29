import { NextRequest, NextResponse } from 'next/server';
import { editDistanceProblem } from '@/lib/problems/edit-distance';
import { transpileTs } from '@/lib/transpile';
import { submitBatch, pollBatch, LANGUAGE_IDS } from '@/lib/judge0';

const CHUNK_SIZE = 20;
function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not Found' }, { status: 404 });
  }

  try {
    const { language, code, mode } = await req.json();
    const problem = editDistanceProblem;
    const testCases = problem.testCases.filter((tc) => (mode === 'run' ? tc.isSample : true));

    let finalSource: string;
    let languageId: number;
    if (language === 'cpp') {
      finalSource = problem.driverTemplate.cpp.replace('{{USER_CODE}}', code);
      languageId = LANGUAGE_IDS.cpp;
    } else {
      finalSource = problem.driverTemplate.typescript.replace('{{USER_CODE}}', transpileTs(code));
      languageId = LANGUAGE_IDS.javascript;
    }

    const payloads = testCases.map((tc) => ({
      source_code: finalSource,
      language_id: languageId,
      stdin: tc.input,
      expected_output: tc.expectedOutput,
    }));
    const allResults = [];
    for (const batch of chunk(payloads, CHUNK_SIZE)) {
      allResults.push(...(await pollBatch(await submitBatch(batch))));
    }

    const verdicts = allResults.map((r, i) => {
      const passed = r.status.id === 3;
      const isSample = testCases[i].isSample;
      return {
        index: i,
        passed,
        status: r.status.description,
        stdout: isSample || !passed ? r.stdout : undefined,
        compileOutput: r.compile_output,
        stderr: r.stderr,
        input: isSample ? testCases[i].input : undefined, // NEVER leak hidden
        expected: isSample ? testCases[i].expectedOutput : undefined, // NEVER leak hidden
        time: r.time,
      };
    });

    const allPassed = verdicts.every((v) => v.passed);
    return NextResponse.json({
      mode,
      verdict: allPassed ? 'Accepted' : verdicts.find((v) => !v.passed)!.status,
      runtimeMs: allResults
        .reduce((max, r) => Math.max(max, Number(r.time ?? 0) * 1000), 0)
        .toFixed(0),
      results: verdicts,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
