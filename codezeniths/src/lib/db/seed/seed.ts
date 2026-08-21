import { prisma } from '@codezeniths/lib/db/prisma.client';
import fs from 'fs/promises';
import path from 'path';
import { Difficulty } from '@prisma/client';

async function main() {
  console.log('🚀 Starting high-performance bulk seeding...');
  const start = Date.now();

  try {
    const dataPath = path.join(process.cwd(), 'src/lib/db/seed/data');
    const productsData = JSON.parse(await fs.readFile(path.join(dataPath, 'products.json'), 'utf-8'));
    const modulesData = JSON.parse(await fs.readFile(path.join(dataPath, 'modules.json'), 'utf-8'));
    const skillsData = JSON.parse(await fs.readFile(path.join(dataPath, 'skills.json'), 'utf-8'));
    const tagsData = JSON.parse(await fs.readFile(path.join(dataPath, 'tags.json'), 'utf-8'));
    const problemsData = JSON.parse(await fs.readFile(path.join(dataPath, 'problems.json'), 'utf-8'));
    const topicsData = JSON.parse(await fs.readFile(path.join(dataPath, 'topics.json'), 'utf-8'));

    console.log('📂 Data files loaded.');

    const problemMetadataMap = new Map();
    problemsData.forEach((p: any) => problemMetadataMap.set(p.slug, p));

    const mapDifficulty = (d: string): Difficulty => {
      const lower = d?.toLowerCase() || '';
      if (lower === 'hard') return Difficulty.hard;
      if (lower === 'medium') return Difficulty.medium;
      return Difficulty.easy;
    };

    await prisma.$transaction(async (tx) => {
      
      // PHASE 0: Products
      console.log('🏗️ Phase 0: Seeding Products...');
      for (const prod of productsData) {
        await tx.product.upsert({
          where: { slug: prod.slug },
          update: { title: prod.title, description: prod.description },
          create: { title: prod.title, slug: prod.slug, description: prod.description },
        });
      }

      // PHASE 1: Foundations (Modules, Skills, Tags, Topics)
      console.log('🏗️ Phase 1: Seeding Foundations...');
      
      const moduleSlugToId = new Map<string, string>();
      for (const mod of modulesData) {
        const m = await tx.module.upsert({
          where: { slug: mod.slug },
          update: { title: mod.title, description: mod.description },
          create: { title: mod.title, slug: mod.slug, description: mod.description },
        });
        moduleSlugToId.set(mod.slug, m.id);
      }

      console.log('🏗️ Seeding Skills...');
      for (const skill of skillsData) {
        const moduleId = moduleSlugToId.get(skill.moduleSlug);
        if (!moduleId) {
          console.warn(`Warning: Module ${skill.moduleSlug} not found for skill ${skill.slug}`);
          continue;
        }
        await tx.skill.upsert({
          where: { slug: skill.slug },
          update: { title: skill.title, moduleId },
          create: { title: skill.title, slug: skill.slug, moduleId },
        });
      }

      const tagSlugToId = new Map<string, string>();
      for (const tag of tagsData) {
        const moduleId = moduleSlugToId.get(tag.module);
        if (!moduleId) {
            console.warn(`Warning: Module ${tag.module} not found for tag ${tag.slug}`);
            continue;
        }
        const t = await tx.tag.upsert({
          where: { slug: tag.slug },
          update: { name: tag.title, description: tag.description, moduleId, level: tag.level },
          create: { name: tag.title, slug: tag.slug, description: tag.description, moduleId, level: tag.level },
        });
        tagSlugToId.set(tag.slug, t.id);
      }

      const topicSlugToId = new Map<string, string>();
      for (const moduleGroup of topicsData) {
        const moduleId = moduleSlugToId.get(moduleGroup.slug);
        if (!moduleId) continue;

        for (const topicData of moduleGroup.topics) {
          const topic = await tx.topic.upsert({
            where: { slug: topicData.slug },
            update: { title: topicData.title, description: topicData.description, order: topicData.order, moduleId, level: topicData.level },
            create: { title: topicData.title, description: topicData.description, slug: topicData.slug, order: topicData.order, moduleId, level: topicData.level },
          });
          topicSlugToId.set(topic.slug, topic.id);
        }
      }

      // PHASE 2: Bulk Problems
      console.log('📝 Phase 2: Preparing Problem Data...');
      const problemList: any[] = [];
      const seenProblemSlugs = new Set<string>();

      for (const moduleGroup of topicsData) {
        for (const topicData of moduleGroup.topics) {
          const topicId = topicSlugToId.get(topicData.slug);
          if (!topicId) continue;

          (topicData.problems || []).forEach((probSlug: string, index: number) => {
            if (seenProblemSlugs.has(probSlug)) return; // Ensure slug uniqueness
            
            const meta = problemMetadataMap.get(probSlug);
            if (meta) {
              problemList.push({
                slug: probSlug,
                title: meta.title,
                difficulty: mapDifficulty(meta.difficulty),
                articleUrl: meta.articleUrl,
                problemUrl: meta.problemUrl,
                order: meta.order ?? index, // using the order key we just generated
                topicId: topicId,
              });
              seenProblemSlugs.add(probSlug);
            }
          });
        }
      }

      console.log(`🚀 Bulk inserting ${problemList.length} problems...`);
      // createMany is available in Prisma for PostgreSQL
      // We use skipDuplicates to handle existing problems if re-running
      await tx.problem.createMany({
        data: problemList,
        skipDuplicates: true,
      });

      // Fetch all problems to get their actual IDs (including existing ones)
      console.log('🔍 Mapping Problem IDs...');
      const allDbProblems = await tx.problem.findMany({
        select: { id: true, slug: true }
      });
      const dbProblemSlugToId = new Map<string, string>();
      allDbProblems.forEach(p => dbProblemSlugToId.set(p.slug, p.id));

      // PHASE 3: Bulk ProblemTags
      console.log('🔗 Phase 3: Preparing Problem-Tag Relations...');
      const problemTagList: any[] = [];
      
      // We iterate through our initial problemList because it has the tag slugs
      for (const p of problemList) {
        const problemId = dbProblemSlugToId.get(p.slug);
        const meta = problemMetadataMap.get(p.slug);
        
        if (problemId && meta && meta.tags) {
          for (const tagSlug of meta.tags) {
            const tagId = tagSlugToId.get(tagSlug);
            if (tagId) {
              problemTagList.push({
                problemId: problemId,
                tagId: tagId,
              });
            }
          }
        }
      }

      console.log(`🚀 Bulk inserting ${problemTagList.length} relations...`);
      // Batch the ProblemTag insertions to avoid potentially hitting parameter limits (though createMany is efficient)
      const PT_CHUNK_SIZE = 5000;
      for (let i = 0; i < problemTagList.length; i += PT_CHUNK_SIZE) {
        const chunk = problemTagList.slice(i, i + PT_CHUNK_SIZE);
        await tx.problemTag.createMany({
          data: chunk,
          skipDuplicates: true,
        });
        console.log(`  ✔ Inserted relations ${i + 1} to ${Math.min(i + PT_CHUNK_SIZE, problemTagList.length)}`);
      }

    }, {
      maxWait: 60000, 
      timeout: 1200000 // 20 minutes
    });

    const duration = ((Date.now() - start) / 1000).toFixed(2);
    console.log(`✅ Bulk seeding completed successfully in ${duration}s!`);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
