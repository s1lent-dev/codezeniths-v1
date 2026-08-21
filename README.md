# CodeZeniths — Product Context

CodeZeniths is a unified Computer Science education and developer tooling platform. It is not a single product but an ecosystem of interconnected sub-products ("features"), each with a distinct purpose, but sharing content, users, and infrastructure across the platform.

This document exists so that any engineer (human or AI) working on a feature landing/detail page has full context on **what each sub-product is, what makes it distinctive, and how it connects to the rest of the ecosystem** — without needing to guess or invent capabilities.

Each section below should map to a route off the landing page, e.g. `/algozenith`, `/archivis`, `/zenlab`, etc.

---

## 1. AlgoZenith
**Route:** `/algozenith`

The primary learning and assessment platform of CodeZeniths — a comprehensive Computer Science practice platform, not just DSA. Covers programming languages (C, C++, Java, Python, JS, TS, Go, Rust, Kotlin, etc.), DSA, databases, SQL, OS, computer networks, OOP, design patterns, concurrency, LLD, HLD, system design, frontend, backend, cloud computing, DevOps, AI, ML, LLMs, blockchain, cryptography, distributed systems, compiler design, computer architecture, and more.

**What makes it distinctive:** it doesn't force every subject into the same problem format. Each CS domain gets the assessment experience best suited to it:
- **DSA / algorithmic problems:** LeetCode-style code editor — driver code, hidden test cases, multi-language support, custom test cases, runtime/memory stats, AI-assisted debugging, editorials, hints, discussions, notes, video + AI explanations, whiteboarding, complexity analysis, pattern recognition, deep CodeFlow integration for interactive execution visualization and dry runs.
- **SQL/database queries:** interactive SQL editor against real datasets/schemas — evaluates correctness, performance, query plans, optimization; multiple SQL dialects.
- **Machine coding, frontend, backend, full-stack:** launches full ZenLab cloud IDE workspaces with starter templates; evaluated via automated tests, UI validation, API verification, architecture checks, AI code review.
- **System design / HLD / LLD:** integrates with ZenDraw's whiteboard; evaluated via rubrics + AI architectural analysis + manual review; CodeFlow simulates the underlying distributed systems concepts.
- **Theory topics** (OS, networking, DB theory, OOP, patterns, cryptography, compiler design, computer architecture, AI): MCQ, multi-select, fill-in-the-blanks, code tracing, output prediction, drag-and-drop, matching, scenario-based reasoning, diagram questions, short/long-form answers, AI-evaluated subjective responses.

**Every problem also has:** hints, editorials, AI/video explanations, discussions, notes, bookmarks, revision reminders, related concepts, prerequisites, recommended follow-ups, company tags, interview frequency, difficulty progression, solution comparisons, AI-generated learning recommendations.

**Also provides:** extensive per-domain roadmaps (roadmap.sh-level detail or beyond) with prerequisites, milestones, linked content; official + user/org-created playlists and interview-prep sheets; heatmaps, activity/progress graphs, problem-of-the-day per domain, streaks, revision reminders, favourites, company-based questions.

**Roles:** individual learners, educators, mentors, organizations, universities, companies — each with tailored surfaces (instructor assignments, org interview-prep tracks tied to Intervyn, university semester tracking).

**Vision:** the central knowledge graph of CodeZeniths — every problem, concept, article, animation, project, course, whiteboard, interview question, and roadmap is interconnected, so a learner studying e.g. database indexing can navigate seamlessly to related SQL exercises, CodeFlow visualizations, Archivis articles, Algodemy lessons, ZenDraw diagrams, and interview questions. Not a LeetCode competitor — the educational core of the ecosystem, leveraging CodeFlow, ZenLab, ZenDraw, Algodemy, Archivis, AlgoWars, and Intervyn.

---

## 2. AlgoWars
**Route:** `/algowars`

The competitive programming platform of CodeZeniths. Where AlgoZenith is about structured learning and interview prep, AlgoWars is about speed, accuracy, rankings, and head-to-head competition.

**Supports:** beginner contests, advanced competitions, organization contests, virtual contests, educational contests, marathon contests, team competitions, global ranked events.

**Features:** live leaderboards, rating systems, achievements, performance analytics, contest replays, editorial access, anti-cheating mechanisms, hack phases (post-contest challenge windows), custom contests, organization-hosted competitions, university contests, seasonal championships, problem archives.

**Key connection:** shares its underlying question bank with AlgoZenith — users move naturally between practicing concepts and competing, with unified progress, achievements, and analytics across the ecosystem.

---

## 3. ZenLab
**Route:** `/zenlab`

The cloud-based development environment of CodeZeniths. Initially powers Machine Coding, Frontend, Backend, and Full Stack assessments inside AlgoZenith — long-term vision is a complete browser-based dev workspace comparable to VS Code, StackBlitz, CodeSandbox, Replit, and GitHub Codespaces.

**Provides:** complete project workspaces — file explorers, terminals, package managers, version control, debugging tools, live previews, database connections, Docker support, environment variables, API testing, collaborative editing, AI-assisted coding, code reviews, automated project evaluation.

**Supports:** React, Next.js, Angular, Vue, Node.js, Express, NestJS, Spring Boot, Django, FastAPI, Go, Rust, Java, Python, C++, databases, containerized applications.

**Role in the ecosystem:** execution environment for Machine Coding / Frontend / Backend / project-based assessments — starter projects, automated evaluation (tests, UI validation, API verification, architecture checks, performance benchmarks, AI code analysis). Beyond assessments: a standalone dev environment for learning, experimentation, collaborative programming, technical interviews, courses, hackathons, and personal projects.

---

## 4. ZenDraw
**Route:** `/zendraw`

The collaborative engineering whiteboard of CodeZeniths — Excalidraw-inspired but built specifically for CS education, interviews, architecture, and software design. Meant to be the default workspace for visual thinking across the platform.

**Supports:** system design diagrams, LLD, HLD/architecture diagrams, UML, ER diagrams, sequence diagrams, class diagrams, flowcharts, cloud infrastructure diagrams, API flows, database schemas, state machines, graphs, trees, networking layouts, wireframes.

**Component libraries:** cloud providers, databases, queues, caches, load balancers, servers, microservices, Kubernetes resources, networking components, frontend/backend architectures, distributed systems — built specifically for software engineering diagramming.

**Integrates deeply into:** AlgoZenith (system design submissions), Intervyn (live interview whiteboarding), Algodemy (teaching diagrams), Archivis (embedded article diagrams), Roadmaps.

**Core capabilities:** real-time collaboration, commenting, version history, presentation mode, exports, AI-assisted diagram generation, AI feedback, seamless embedding everywhere.

---

## 5. Intervyn
**Route:** `/intervyn`

The interview and assessment platform of CodeZeniths — both a practice platform for learners and a hiring platform for companies. Built entirely on top of existing CodeZeniths capabilities (AlgoZenith's question bank, ZenLab's dev environment, ZenDraw's whiteboard, CodeFlow's visualization engine) rather than being standalone.

**Supports:** coding interviews, machine coding interviews, frontend/backend assessments, system design interviews, LLD, HLD, database interviews, SQL challenges, behavioral interviews, AI interviews, take-home assignments, campus hiring, certification exams, organization-specific evaluation pipelines.

**How it works:** recruiters build custom interview rounds using AlgoZenith problems; candidates solve them in whichever environment fits — coding editor, ZenLab workspace, ZenDraw whiteboard, SQL environment, or theoretical assessment.

**Platform features:** scheduling, video conferencing, screen sharing, collaborative editing, recording, interviewer notes, replay, automated evaluation, AI-generated interview summaries, candidate analytics, organization dashboards, interview templates, question banks, role-based assessments, plagiarism detection, performance reports.

---

## 6. Algodemy
**Route:** `/algodemy`

The structured education platform within CodeZeniths — courses, bootcamps, guided learning paths, certifications, instructor-led classes, workshops, long-form educational content, rather than isolated problems.

**Every course integrates:** interactive problems from AlgoZenith, visual explanations from CodeFlow, practical projects from ZenLab, diagrams from ZenDraw — combining theory, visualization, coding, and project-based learning into one continuous experience.

**Supports:** recorded courses, live classes, assignments, quizzes, coding exercises, machine coding projects, collaborative learning, instructor dashboards, progress tracking, certifications, discussion forums, AI tutors, personalized learning plans, interactive course content.

---

## 7. Archivis
**Route:** `/archivis`

The knowledge and documentation platform of CodeZeniths — the central repository for articles, documentation, tutorials, interview experiences, engineering blogs, technical notes, API references, cheat sheets, and educational content.

**What makes it distinctive:** not a traditional blog. Articles embed CodeFlow animations, ZenDraw diagrams, ZenLab projects, quizzes, interactive playgrounds, and related AlgoZenith problems directly in the reading experience — every article is an interactive learning resource, not static documentation. Readers can experiment with examples, modify code, visualize concepts, and practice related problems without leaving the article.

**Also supports:** community contributions, version history, collaborative editing, content moderation, AI-assisted writing, multilingual documentation, semantic linking between articles, problems, courses, and roadmaps.

---

## 8. ZenDraw's sibling: CodeFlow
**Route:** `/codeflow`

The shared interactive visualization engine powering the rest of CodeZeniths — not an independent learning destination, but embedded infrastructure that appears inside AlgoZenith, Algodemy, Archivis, ZenDraw, Intervyn, and ZenLab.

**Core capabilities:**
- Handcrafted interactive animation library across DSA, OS, networks, databases, compilers, languages, browser internals, JS, React, cloud, distributed systems, AI/ML, blockchain, cryptography, system design, LLD, HLD.
- Interactive playgrounds for building/manipulating data structures (trees, graphs, tries, heaps, segment trees, etc.) and running algorithms on custom input.
- **Intelligent code visualization:** on an accepted AlgoZenith solution, automatically detects the algorithmic pattern used (binary search, sliding window, DP, graph traversal, etc.) and generates an interactive execution trace of the user's *own* code — replayable on custom test cases with variable/memory/stack inspection.
- Interactive dry-run mode: manually execute algorithms on custom input without writing code — timeline controls, frame-by-frame navigation, breakpoints.
- System simulators: process scheduling, memory allocation, virtual memory, networking protocols, database transactions, caching, distributed consensus, container orchestration, cloud infra, load balancing, compiler pipelines, browser rendering.
- Side-by-side comparison mode for competing algorithms/architectures/data structures.
- Internal animation studio for the CodeZeniths team to author/version/publish new animations.
- Long-term vision: AI-assisted — generating explanations, quizzes, summaries, narration, and trade-off analysis directly from any visualization.

---

## 9. ZenHub
**Route:** `/zenhub`

The social and collaborative layer of CodeZeniths — an engineering-focused community (not a traditional forum) connecting learners, educators, mentors, interviewers, organizations, and companies.

**Enables:** professional profiles, showcasing achievements, publishing projects, study groups, discussions, mentoring, organizing events, collaborating on technical content.

**Integrates with everything:** surfaces user achievements, progress, certifications, AlgoWars contest rankings, Intervyn interview experiences, published roadmaps, Archivis articles, CodeFlow visualizations, and ZenLab projects — all on one profile.

**Also supports:** organizations, university communities, team workspaces, messaging, notifications, mentorship programs, collaborative learning spaces, knowledge sharing.

**Vision:** turn CodeZeniths from a collection of educational tools into an active engineering community where learning, collaboration, competition, and professional growth coexist.

---

## Cross-Product Patterns (keep in mind while designing feature pages)

- **CodeFlow, ZenLab, and ZenDraw are shared engines** — embedded inside AlgoZenith, Algodemy, Archivis, and Intervyn rather than being isolated destinations. Feature pages for these three should emphasize "powers X, Y, Z across the platform" rather than a standalone product pitch.
- **AlgoZenith is the content/knowledge core** — the question bank and concept graph that AlgoWars, Intervyn, Algodemy, and Archivis all reference.
- **Every product is designed to interconnect** — feature pages should reflect this by cross-linking to related sub-products where relevant (e.g. the AlgoZenith page should mention ZenLab/ZenDraw/CodeFlow integration; the CodeFlow page should mention where it shows up).
- **Recurring sub-systems** worth being consistent about in messaging: AI-assisted feedback/explanations (appears in nearly every product), roadmaps/progress tracking, organization & university support, anti-cheat/integrity (AlgoWars, Intervyn, Algodemy certifications).

---
