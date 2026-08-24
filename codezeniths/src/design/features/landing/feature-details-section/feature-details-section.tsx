'use client';

import React, { useState } from 'react';
import { Container, Typography, TypographyVariant, TypographyAlign, Background, BackgroundVariant, Section } from '@codezeniths/components';
import { useTheme } from '@codezeniths/modules';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import algozenithDark from '@/assets/landing/features/algozenith_dark.svg';
import algozenithLight from '@/assets/landing/features/algozenith_light.svg';
import codeflowDark from '@/assets/landing/features/codeflow_dark.svg';
import codeflowLight from '@/assets/landing/features/codeflow_light.svg';

const FEATURES = [
    { 
        id: 'algozenith', label: 'AlgoZenith', number: '01',
        title1: 'The Primary Learning Platform',
        desc1: 'A comprehensive CS practice platform covering DSA, databases, SQL, OS, networking, system design, and more. It goes beyond simple competitive programming by offering targeted experiences for each CS domain.',
        desc2: 'Features a LeetCode-style code editor with driver code, hidden test cases, multi-language support, AI-assisted debugging, and deep CodeFlow integration for interactive execution visualization.',
        title2: 'The Central Knowledge Graph',
        desc3: 'Every problem, concept, article, animation, and project is interconnected. Navigate seamlessly to related exercises and visual lessons.',
        highlights: [
            { title: 'Theory & Assessments', desc: 'AI-evaluated subjective responses, MCQ, and diagram questions for OS, networking, and architecture.' },
            { title: 'Detailed Roadmaps', desc: 'Extensive per-domain progression paths with prerequisites, milestones, and linked learning content.' },
            { title: 'Performance Analytics', desc: 'Heatmaps, activity graphs, company tags, and AI-generated personalized learning recommendations.' }
        ]
    },
    { 
        id: 'algowars', label: 'AlgoWars', number: '02',
        title1: 'Competitive Programming Arena',
        desc1: 'Where AlgoZenith is about structured learning, AlgoWars is focused on speed, accuracy, rankings, and head-to-head competition across the globe.',
        desc2: 'Host or participate in beginner contests, advanced competitions, virtual contests, educational marathons, and organization-hosted championships.',
        title2: 'Unified Ecosystem Integration',
        desc3: 'Built directly on top of the shared CodeZeniths infrastructure, seamlessly sharing the question bank with AlgoZenith.',
        highlights: [
            { title: 'Live Leaderboards', desc: 'Dynamic rating systems, achievements, and detailed performance analytics post-contest.' },
            { title: 'Hack Phases', desc: 'Post-contest challenge windows for participants to find edge cases in competitors\' code.' },
            { title: 'Anti-cheating Mechanisms', desc: 'Robust detection systems ensuring fair play during official championships and evaluations.' }
        ]
    },
    { 
        id: 'zenlab', label: 'ZenLab', number: '03',
        title1: 'Cloud-Based Dev Environment',
        desc1: 'A complete browser-based cloud development environment comparable to VS Code, StackBlitz, and GitHub Codespaces.',
        desc2: 'Provides full project workspaces with file explorers, terminals, package managers, version control, live previews, and automated project evaluation.',
        title2: 'Beyond Standard Assessments',
        desc3: 'Initially powers Machine Coding and Full Stack assessments, but scales to serve as a standalone environment for experimentation.',
        highlights: [
            { title: 'Multi-Framework Support', desc: 'First-class support for React, Node.js, Spring Boot, Go, Rust, and containerized databases.' },
            { title: 'Automated Evaluation', desc: 'Evaluated via automated tests, UI validation, API verification, and AI code review.' },
            { title: 'Collaborative Programming', desc: 'Real-time collaborative editing for technical interviews, hackathons, and group projects.' }
        ]
    },
    { 
        id: 'zendraw', label: 'ZenDraw', number: '04',
        title1: 'Collaborative Engineering Whiteboard',
        desc1: 'The collaborative engineering whiteboard inspired by Excalidraw, built specifically for CS education, architecture, and software design.',
        desc2: 'Supports system design diagrams, LLD, HLD, UML, ER diagrams, sequence diagrams, cloud infrastructure, API flows, and database schemas.',
        title2: 'Deep Platform Integration',
        desc3: 'The default workspace for visual thinking across the ecosystem, integrating natively into AlgoZenith, Intervyn, and Archivis.',
        highlights: [
            { title: 'Component Libraries', desc: 'Built-in nodes for cloud providers, databases, queues, load balancers, and microservices.' },
            { title: 'AI-Assisted Diagramming', desc: 'Generate architectures via AI and receive automated feedback on system design submissions.' },
            { title: 'Real-Time Collaboration', desc: 'Live multiplayer commenting, version history, and presentation modes.' }
        ]
    },
    { 
        id: 'intervyn', label: 'Intervyn', number: '05',
        title1: 'Interview and Assessment Platform',
        desc1: 'The comprehensive interview and assessment platform, serving both as a practice platform for learners and a hiring tool for companies.',
        desc2: 'Supports coding interviews, system design interviews, SQL challenges, AI interviews, take-home assignments, and campus hiring pipelines.',
        title2: 'Custom Evaluation Pipelines',
        desc3: 'Recruiters build custom interview rounds using existing high-quality AlgoZenith problems.',
        highlights: [
            { title: 'Flexible Environments', desc: 'Candidates solve problems in a coding editor, ZenLab workspace, or ZenDraw whiteboard.' },
            { title: 'Advanced Features', desc: 'Includes scheduling, video conferencing, collaborative editing, and automated plagiarism detection.' },
            { title: 'AI-Generated Summaries', desc: 'Automated performance reports and AI interviewer notes for organization dashboards.' }
        ]
    },
    { 
        id: 'algodemy', label: 'Algodemy', number: '06',
        title1: 'Structured Education Platform',
        desc1: 'The structured education platform delivering courses, bootcamps, guided learning paths, certifications, and instructor-led classes.',
        desc2: 'Every course integrates interactive problems from AlgoZenith, visual explanations from CodeFlow, practical projects from ZenLab, and diagrams from ZenDraw.',
        title2: 'Comprehensive Learning Experience',
        desc3: 'Combines theory, visualization, coding, and project-based learning into one continuous journey.',
        highlights: [
            { title: 'Interactive Content', desc: 'Embeds CodeFlow animations and ZenLab projects natively in the core curriculum.' },
            { title: 'Instructor Dashboards', desc: 'Advanced progress tracking, collaborative learning spaces, and personalized learning plans.' },
            { title: 'Verified Certifications', desc: 'Completion certificates backed by rigorous anti-cheat evaluations and project reviews.' }
        ]
    },
    { 
        id: 'archivis', label: 'Archivis', number: '07',
        title1: 'Knowledge and Documentation',
        desc1: 'The knowledge and documentation platform serving as the central repository for articles, tutorials, interview experiences, and technical notes.',
        desc2: 'Not a traditional static blog. Articles embed CodeFlow animations, ZenDraw diagrams, ZenLab projects, and interactive playgrounds directly in the reading experience.',
        title2: 'Interactive Reading',
        desc3: 'Transforms static documentation into hands-on learning resources.',
        highlights: [
            { title: 'Experiment In-Place', desc: 'Readers can modify code, execute examples, and practice problems without leaving the article.' },
            { title: 'Semantic Linking', desc: 'Smart connections between articles, problems, courses, and engineering roadmaps.' },
            { title: 'Collaborative Editing', desc: 'Community contributions, version history, content moderation, and AI-assisted writing.' }
        ]
    },
    { 
        id: 'codeflow', label: 'CodeFlow', number: '08',
        title1: 'Interactive Visualization Engine',
        desc1: 'The shared interactive visualization engine powering the rest of CodeZeniths, appearing seamlessly across the entire ecosystem.',
        desc2: 'Features handcrafted interactive animations across DSA, OS, databases, and simulators for process scheduling and virtual memory.',
        title2: 'Intelligent Code Visualization',
        desc3: 'Automatically detects algorithmic patterns and generates an interactive execution trace of the user\'s own code.',
        highlights: [
            { title: 'Execution Replay', desc: 'Replayable on custom test cases with complete variable, memory, and stack inspection.' },
            { title: 'System Simulators', desc: 'Simulate database transactions, distributed consensus, load balancing, and network protocols.' },
            { title: 'Interactive Dry-Runs', desc: 'Manually execute algorithms on custom input with frame-by-frame navigation and breakpoints.' }
        ]
    },
    { 
        id: 'zenhub', label: 'ZenHub', number: '09',
        title1: 'The Engineering Social Network',
        desc1: 'The social and professional identity layer connecting everything in CodeZeniths. Every problem solved in AlgoZenith, contest won in AlgoWars, workspace created in ZenLab, and article published in Archivis is aggregated into your profile.',
        desc2: 'A verified developer portfolio showcasing verified coding skill ratings, architecture showcases, open-source project sandboxes, and community contributions.',
        title2: 'Reputation That Speaks',
        desc3: 'Replace traditional resumes with live proof of work, verifiable skill graphs, and peer endorsements.',
        highlights: [
            { title: 'Proof of Work', desc: 'Verified problem solve history, contest ratings, and live deployed apps.' },
            { title: 'Mentorship Network', desc: 'Connect with senior engineers for mock rounds and code reviews.' },
            { title: 'Recruiter Showcase', desc: 'Allow top tech companies to discover and reach out directly to you.' }
        ]
    }
];

export const FeatureDetailsSection = () => {
    const [startIndex, setStartIndex] = useState(0);
    const [activeTab, setActiveTab] = useState(FEATURES[0].id);
    const { isDark } = useTheme();

    const visibleTabs = FEATURES.slice(startIndex, startIndex + 3);
    const activeFeature = FEATURES.find(f => f.id === activeTab) || FEATURES[0];

    const handleNext = () => {
        if (startIndex + 3 < FEATURES.length) {
            const newIndex = startIndex + 3;
            setStartIndex(newIndex);
            setActiveTab(FEATURES[newIndex].id);
        }
    };

    const handlePrev = () => {
        if (startIndex - 3 >= 0) {
            const newIndex = startIndex - 3;
            setStartIndex(newIndex);
            setActiveTab(FEATURES[newIndex].id);
        }
    };

    return (
        <Section id="feature-details" className="bg-background-light dark:bg-background-dark relative pb-16 pt-12 sm:pb-24 sm:pt-18">
            <Container size="5xl" className="mx-auto px-4 xs:px-6 lg:px-8">
                
                {/* Square Tabber Navigation with Pagination */}
                <motion.div 
                    initial={{ opacity: 0, y: -20, filter: "blur(8px)" }}
                    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-center justify-between gap-2 sm:gap-4 mb-8 sm:mb-12"
                >
                    <button 
                        onClick={handlePrev} 
                        disabled={startIndex === 0}
                        aria-label="Previous tabs"
                        className="flex items-center justify-center w-9 h-9 xs:w-10 xs:h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl cursor-pointer bg-foreground-light dark:bg-foreground-dark text-body-light dark:text-body-dark disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-xl shrink-0"
                    >
                        <ChevronLeft className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6" />
                    </button>

                    <div className="bg-foreground-light dark:bg-foreground-dark rounded-lg sm:rounded-xl border border-white/5 shadow-xl p-1 sm:p-2 flex relative w-full items-center justify-center flex-1 overflow-hidden">
                        <div className="grid grid-cols-3 w-full gap-1 sm:gap-2">
                            {visibleTabs.map((feature) => (
                                <button
                                    key={feature.id}
                                    onClick={() => setActiveTab(feature.id)}
                                    className={`relative flex items-center justify-center gap-1.5 xs:gap-2 sm:gap-3 px-1.5 xs:px-2.5 sm:px-4 lg:px-6 py-2 xs:py-3 lg:py-4 cursor-pointer transition-colors rounded-md sm:rounded-lg w-full hover:bg-primary/10 ${
                                        activeTab === feature.id
                                            ? 'text-body-light-shade1 dark:text-body-dark-shade1'
                                            : 'text-muted-light-shade1 dark:text-muted-dark-shade1'
                                    }`}
                                >
                                    <div className="flex items-center justify-center w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 rounded-full border border-current opacity-70 text-[11px] xs:text-xs sm:text-sm font-medium shrink-0">
                                        {feature.number}
                                    </div>
                                    <span className="font-semibold text-[11px] xs:text-xs sm:text-sm lg:text-[15px] truncate">{feature.label}</span>
                                    {activeTab === feature.id && (
                                        <div className="absolute bottom-0 left-1 xs:left-2 sm:left-4 right-1 xs:right-2 sm:right-4 h-0.75 bg-primary rounded-t-md" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button 
                        onClick={handleNext} 
                        disabled={startIndex + 3 >= FEATURES.length}
                        aria-label="Next tabs"
                        className="flex items-center justify-center w-9 h-9 xs:w-10 xs:h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl cursor-pointer bg-foreground-light dark:bg-foreground-dark text-body-light dark:text-body-dark disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-xl shrink-0"
                    >
                        <ChevronRight className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6" />
                    </button>
                </motion.div>

                {/* Tab Content Area */}
                <div className="relative rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden shadow-xl mx-0 sm:mx-4 lg:mx-16">
                    {/* Background Dot Pattern Effect */}
                    <Background 
                        variant={BackgroundVariant.DOT_PATTERN} 
                        wrapperClassName="absolute inset-0" 
                        className="text-primary/40 dark:text-primary/40 mask-[radial-gradient(ellipse_at_center,white_0%,transparent_100%)]"
                    />
                        <motion.div 
                            key={activeTab}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            exit="exit"
                            className="relative z-10 p-4 xs:p-6 sm:p-8 lg:p-12 flex flex-col gap-10 xs:gap-14 lg:gap-24"
                        >
                            {/* Top Section */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-18 items-center">
                                <motion.div 
                                    variants={{
                                        hidden: { opacity: 0, x: -90 },
                                        visible: { opacity: 1, x: 0, transition: { duration: 2.4, ease: [0.16, 1, 0.3, 1] } },
                                        exit: { opacity: 0, x: -30, transition: { duration: 0.6 } }
                                    }}
                                    className="flex flex-col items-center lg:items-start text-center lg:text-left gap-4 sm:gap-6"
                                >
                                <Typography variant={TypographyVariant.H3} align={TypographyAlign.CENTER} className="text-xl xs:text-2xl sm:text-3xl font-bold text-foreground-dark-shade3 dark:text-foreground-light-shade3 text-center lg:text-left">
                                    {activeFeature.title1}
                                </Typography>
                                <Typography variant={TypographyVariant.P} align={TypographyAlign.CENTER} className="text-xs xs:text-sm sm:text-base text-muted-light-shade1 dark:text-muted-dark-shade1 leading-relaxed text-center lg:text-left">
                                    {activeFeature.desc1}
                                </Typography>
                                <Typography variant={TypographyVariant.P} align={TypographyAlign.CENTER} className="text-xs xs:text-sm sm:text-base text-muted-light-shade1 dark:text-muted-dark-shade1 leading-relaxed text-center lg:text-left">
                                    {activeFeature.desc2}
                                </Typography>
                                </motion.div>
                                <motion.div 
                                    variants={{
                                        hidden: { opacity: 0, x: 90 },
                                        visible: { opacity: 1, x: 0, transition: { duration: 2.4, ease: [0.16, 1, 0.3, 1], delay: 0.1 } },
                                        exit: { opacity: 0, x: 30, transition: { duration: 0.6 } }
                                    }}
                                    className="relative flex justify-center items-center h-48 xs:h-60 sm:h-72 md:h-80 lg:h-87.5 w-full rounded-xl sm:rounded-2xl bg-muted-light/5 dark:bg-muted-dark/20 p-3 xs:p-4 sm:p-6 mask-[linear-gradient(to_bottom,white_60%,transparent_100%)]"
                                >
                                {isDark ? (
                                    <Image src={algozenithDark} alt={`${activeFeature.label} visual representation`} className="w-full h-full object-contain" />
                                ) : (
                                    <Image src={algozenithLight} alt={`${activeFeature.label} visual representation`} className="w-full h-full object-contain" />
                                )}
                                </motion.div>
                            </div>

                            {/* Bottom Section */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-18 items-center">
                                <motion.div 
                                    variants={{
                                        hidden: { opacity: 0, x: -90 },
                                        visible: { opacity: 1, x: 0, transition: { duration: 2.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 } },
                                        exit: { opacity: 0, x: -30, transition: { duration: 0.6 } }
                                    }}
                                    className="relative flex justify-center items-center h-48 xs:h-60 sm:h-72 md:h-80 lg:h-87.5 w-full rounded-xl sm:rounded-2xl bg-muted-light/5 dark:bg-muted-dark/20 p-3 xs:p-4 sm:p-6 order-2 lg:order-1 mask-[linear-gradient(to_bottom,white_60%,transparent_100%)]"
                                >
                                {isDark ? (
                                    <Image src={codeflowDark} alt="Interactive feature demonstration" className="w-full h-full object-contain" />
                                ) : (
                                    <Image src={codeflowLight} alt="Interactive feature demonstration" className="w-full h-full object-contain" />
                                )}
                                </motion.div>
                                <motion.div 
                                    variants={{
                                        hidden: { opacity: 0, x: 90 },
                                        visible: { opacity: 1, x: 0, transition: { duration: 2.4, ease: [0.16, 1, 0.3, 1], delay: 0.3 } },
                                        exit: { opacity: 0, x: 30, transition: { duration: 0.6 } }
                                    }}
                                    className="flex flex-col items-center lg:items-start text-center lg:text-left gap-4 sm:gap-6 order-1 lg:order-2"
                                >
                                    <Typography variant={TypographyVariant.H3} align={TypographyAlign.CENTER} className="text-xl xs:text-2xl sm:text-3xl font-bold text-foreground-dark-shade3 dark:text-foreground-light-shade3 text-center lg:text-left">
                                        {activeFeature.title2}
                                    </Typography>
                                    <Typography variant={TypographyVariant.P} align={TypographyAlign.CENTER} className="text-xs xs:text-sm sm:text-base text-muted-light-shade1 dark:text-muted-dark-shade1 leading-relaxed text-center lg:text-left">
                                        {activeFeature.desc3}
                                    </Typography>
                                    
                                    <div className="flex flex-col gap-3 sm:gap-4 mt-2 w-full">
                                        {activeFeature.highlights.map((highlight, index) => (
                                            <div key={index} className="flex gap-3 sm:gap-4 items-start text-left">
                                                <div className="flex items-center justify-center w-9 h-9 xs:w-10 xs:h-10 sm:w-12 sm:h-12 rounded-full border border-muted-light/20 dark:border-muted-dark/30 bg-muted-light/5 dark:bg-muted-dark/10 font-bold text-sm sm:text-lg text-foreground-dark-shade3 dark:text-foreground-light-shade3 shrink-0">
                                                    0{index + 1}
                                                </div>
                                                <div className="flex flex-col gap-0.5 sm:gap-1 text-left">
                                                    <Typography variant={TypographyVariant.H6} className="text-sm sm:text-base font-semibold text-foreground-dark-shade3 dark:text-foreground-light-shade3 m-0 p-0 text-left">
                                                        {highlight.title}
                                                    </Typography>
                                                    <Typography variant={TypographyVariant.P} className="text-xs sm:text-sm text-muted-light-shade1 dark:text-muted-dark-shade1 m-0 p-0 leading-normal text-left">
                                                        {highlight.desc}
                                                    </Typography>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                </div>
            </Container>
        </Section>
    );
};
