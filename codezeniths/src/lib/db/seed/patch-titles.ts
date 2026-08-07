import { prisma } from '../prisma.client';
import fs from 'fs/promises';
import path from 'path';

async function main() {
  console.log('🔄 Starting database title patch...');
  const start = Date.now();

  try {
    const dataPath = path.join(process.cwd(), 'src/lib/db/seed/data/problems.json');
    const problemsData = JSON.parse(await fs.readFile(dataPath, 'utf-8'));

    console.log(`📂 Loaded ${problemsData.length} problems from problems.json`);

    let updatedCount = 0;

    // Process in small concurrent batches without transaction wrapping to avoid pooled DB timeouts
    const BATCH_SIZE = 15;
    for (let i = 0; i < problemsData.length; i += BATCH_SIZE) {
      const batch = problemsData.slice(i, i + BATCH_SIZE);

      await Promise.all(
        batch.map((p: any) =>
          prisma.problem.updateMany({
            where: { slug: p.slug },
            data: { title: p.title },
          })
        )
      );

      updatedCount += batch.length;
      if (updatedCount % 200 === 0 || updatedCount === problemsData.length) {
        console.log(`  ✔ Processed ${updatedCount} / ${problemsData.length} problems...`);
      }
    }

    const duration = ((Date.now() - start) / 1000).toFixed(2);
    console.log(`\n✅ Database title patch completed successfully in ${duration}s!`);
    console.log(`Total problem titles synchronized in DB: ${updatedCount}`);
  } catch (error) {
    console.error('❌ Error updating database titles:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
