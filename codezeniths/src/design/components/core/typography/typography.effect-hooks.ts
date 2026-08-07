'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useInView } from 'motion/react';
import type { Variants } from 'motion/react';
import type {
    AnimationType,
    AnimationVariant,
    AnimateEffectProps,
    AuroraEffectProps,
    GradientEffectProps,
    MorphingEffectProps,
    ShinyEffectProps,
    TypingEffectProps,
} from './typography.types';

// ==================== AURORA EFFECT ====================
export function useAuroraEffect(props: AuroraEffectProps) {
    const {
        colors = ['var(--aurora-c1)', 'var(--aurora-c2)', 'var(--aurora-c3)', 'var(--aurora-c4)'],
        speed = 1,
    } = props;

    const style = useMemo(() => {
        return {
            backgroundImage: `linear-gradient(135deg, ${colors.join(', ')}, ${colors[0]})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animationDuration: `${10 / speed}s`,
        } as React.CSSProperties;
    }, [colors, speed]);

    return { style };
}

// ==================== SHINY EFFECT ====================
export function useShinyEffect(props: ShinyEffectProps) {
    const { shimmerWidth = 100 } = props;

    const style = useMemo(() => {
        return {
            '--shiny-width': `${shimmerWidth}px`,
        } as React.CSSProperties;
    }, [shimmerWidth]);

    return { style };
}

// ==================== GRADIENT EFFECT ====================
export function useGradientEffect(props: GradientEffectProps) {
    const {
        speed = 1,
        colorFrom = 'var(--gradient-from-default)',
        colorTo = 'var(--gradient-to-default)',
    } = props;

    const style = useMemo(() => {
        return {
            '--bg-size': `${speed * 300}%`,
            '--color-from': colorFrom,
            '--color-to': colorTo,
        } as React.CSSProperties;
    }, [speed, colorFrom, colorTo]);

    return { style };
}

// ==================== MORPHING EFFECT ====================
const morphTime = 1.5;
const cooldownTime = 0.5;

export function useMorphingEffect(props: MorphingEffectProps) {
    const { texts } = props;
    const textIndexRef = useRef(0);
    const morphRef = useRef(0);
    const cooldownRef = useRef(0);
    const timeRef = useRef(new Date());
    const text1Ref = useRef<HTMLSpanElement>(null);
    const text2Ref = useRef<HTMLSpanElement>(null);

    const setStyles = useCallback(
        (fraction: number) => {
            const [current1, current2] = [text1Ref.current, text2Ref.current];
            if (!current1 || !current2) {return;}

            current2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
            current2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

            const invertedFraction = 1 - fraction;
            current1.style.filter = `blur(${Math.min(8 / invertedFraction - 8, 100)}px)`;
            current1.style.opacity = `${Math.pow(invertedFraction, 0.4) * 100}%`;

            current1.textContent = texts[textIndexRef.current % texts.length] || '';
            current2.textContent = texts[(textIndexRef.current + 1) % texts.length] || '';
        },
        [texts],
    );

    const doMorph = useCallback(() => {
        morphRef.current -= cooldownRef.current;
        cooldownRef.current = 0;

        let fraction = morphRef.current / morphTime;
        if (fraction > 1) {
            cooldownRef.current = cooldownTime;
            fraction = 1;
        }

        setStyles(fraction);

        if (fraction === 1) {
            textIndexRef.current++;
        }
    }, [setStyles]);

    const doCooldown = useCallback(() => {
        morphRef.current = 0;
        const [current1, current2] = [text1Ref.current, text2Ref.current];
        if (current1 && current2) {
            current2.style.filter = 'none';
            current2.style.opacity = '100%';
            current1.style.filter = 'none';
            current1.style.opacity = '0%';
        }
    }, []);

    useEffect(() => {
        if (!texts || texts.length === 0) return;

        let animationFrameId: number;
        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            const newTime = new Date();
            const dt = (newTime.getTime() - timeRef.current.getTime()) / 1000;
            timeRef.current = newTime;

            cooldownRef.current -= dt;

            if (cooldownRef.current <= 0) {doMorph();}
            else {doCooldown();}
        };

        animate();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [doMorph, doCooldown, texts]);

    return { text1Ref, text2Ref };
}

// ==================== TYPING EFFECT ====================
export function useTypingEffect(props: TypingEffectProps & { initialText?: string }) {
    const {
        words,
        initialText = '',
        typeSpeed = 100,
        deleteSpeed = 50,
        delay = 0,
        pauseDelay = 1000,
        loop = false,
        showCursor = true,
        blinkCursor = true,
        cursorStyle = 'line',
    } = props;

    const [displayedText, setDisplayedText] = useState<string>('');
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [currentCharIndex, setCurrentCharIndex] = useState(0);
    const [phase, setPhase] = useState<'typing' | 'pause' | 'deleting'>('typing');
    const elementRef = useRef<HTMLElement | null>(null);
    const isInView = useInView(elementRef as React.RefObject<Element>, { amount: 0.3, once: true });

    const wordsToAnimate = useMemo(() => words || (initialText ? [initialText] : []), [words, initialText]);
    const hasMultipleWords = wordsToAnimate.length > 1;

    useEffect(() => {
        if (!isInView || wordsToAnimate.length === 0) {return;}

        const timeoutDelay =
            delay > 0 && displayedText === ''
                ? delay
                : phase === 'typing'
                    ? typeSpeed
                    : phase === 'deleting'
                        ? deleteSpeed
                        : pauseDelay;

        const timeout = setTimeout(() => {
            const currentWord = wordsToAnimate[currentWordIndex] || '';
            const graphemes = Array.from(currentWord);

            switch (phase) {
                case 'typing':
                    if (currentCharIndex < graphemes.length) {
                        setDisplayedText(graphemes.slice(0, currentCharIndex + 1).join(''));
                        setCurrentCharIndex(currentCharIndex + 1);
                    } else {
                        if (hasMultipleWords || loop) {
                            const isLastWord = currentWordIndex === wordsToAnimate.length - 1;
                            if (!isLastWord || loop) {
                                setPhase('pause');
                            }
                        }
                    }
                    break;

                case 'pause':
                    setPhase('deleting');
                    break;

                case 'deleting':
                    if (currentCharIndex > 0) {
                        setDisplayedText(graphemes.slice(0, currentCharIndex - 1).join(''));
                        setCurrentCharIndex(currentCharIndex - 1);
                    } else {
                        const nextIndex = (currentWordIndex + 1) % wordsToAnimate.length;
                        setCurrentWordIndex(nextIndex);
                        setPhase('typing');
                    }
                    break;

                default:
                    break;
            }
        }, timeoutDelay);

        return () => clearTimeout(timeout);
    }, [isInView, phase, currentCharIndex, currentWordIndex, displayedText, wordsToAnimate, hasMultipleWords, loop, typeSpeed, deleteSpeed, pauseDelay, delay]);

    const currentWordGraphemes = useMemo(() => Array.from(wordsToAnimate[currentWordIndex] || ''), [wordsToAnimate, currentWordIndex]);
    const isComplete = !loop && currentWordIndex === wordsToAnimate.length - 1 && currentCharIndex >= currentWordGraphemes.length && phase !== 'deleting';

    const shouldShowCursor = showCursor && !isComplete && (hasMultipleWords || loop || currentCharIndex < currentWordGraphemes.length);

    const getCursorChar = useCallback(() => {
        switch (cursorStyle) {
            case 'block':
                return '▌';
            case 'underscore':
                return '_';
            case 'line':
            default:
                return '|';
        }
    }, [cursorStyle]);

    return {
        displayedText,
        shouldShowCursor,
        getCursorChar,
        elementRef,
        blinkCursor,
    };
}

// ==================== ANIMATE EFFECT ====================
export const staggerTimings: Record<AnimationType, number> = {
    text: 0.06,
    word: 0.05,
    character: 0.03,
    line: 0.06,
};

const defaultContainerVariants: Variants = {
    hidden: { opacity: 1 },
    show: {
        opacity: 1,
        transition: {
            delayChildren: 0,
            staggerChildren: 0.05,
        },
    },
    exit: {
        opacity: 0,
        transition: {
            staggerChildren: 0.05,
            staggerDirection: -1,
        },
    },
};

const defaultItemAnimationVariants: Record<AnimationVariant, { container: Variants; item: Variants }> = {
    fadeIn: {
        container: defaultContainerVariants,
        item: {
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
            exit: { opacity: 0, y: 20, transition: { duration: 0.3 } },
        },
    },
    blurIn: {
        container: defaultContainerVariants,
        item: {
            hidden: { opacity: 0, filter: 'blur(10px)' },
            show: { opacity: 1, filter: 'blur(0px)', transition: { duration: 0.3 } },
            exit: { opacity: 0, filter: 'blur(10px)', transition: { duration: 0.3 } },
        },
    },
    blurInUp: {
        container: defaultContainerVariants,
        item: {
            hidden: { opacity: 0, filter: 'blur(10px)', y: 20 },
            show: {
                opacity: 1,
                filter: 'blur(0px)',
                y: 0,
                transition: { y: { duration: 0.3 }, opacity: { duration: 0.4 }, filter: { duration: 0.3 } },
            },
            exit: {
                opacity: 0,
                filter: 'blur(10px)',
                y: 20,
                transition: { y: { duration: 0.3 }, opacity: { duration: 0.4 }, filter: { duration: 0.3 } },
            },
        },
    },
    blurInDown: {
        container: defaultContainerVariants,
        item: {
            hidden: { opacity: 0, filter: 'blur(10px)', y: -20 },
            show: {
                opacity: 1,
                filter: 'blur(0px)',
                y: 0,
                transition: { y: { duration: 0.3 }, opacity: { duration: 0.4 }, filter: { duration: 0.3 } },
            },
        },
    },
    slideUp: {
        container: defaultContainerVariants,
        item: {
            hidden: { y: 20, opacity: 0 },
            show: { y: 0, opacity: 1, transition: { duration: 0.3 } },
            exit: { y: -20, opacity: 0, transition: { duration: 0.3 } },
        },
    },
    slideDown: {
        container: defaultContainerVariants,
        item: {
            hidden: { y: -20, opacity: 0 },
            show: { y: 0, opacity: 1, transition: { duration: 0.3 } },
            exit: { y: 20, opacity: 0, transition: { duration: 0.3 } },
        },
    },
    slideLeft: {
        container: defaultContainerVariants,
        item: {
            hidden: { x: 20, opacity: 0 },
            show: { x: 0, opacity: 1, transition: { duration: 0.3 } },
            exit: { x: -20, opacity: 0, transition: { duration: 0.3 } },
        },
    },
    slideRight: {
        container: defaultContainerVariants,
        item: {
            hidden: { x: -20, opacity: 0 },
            show: { x: 0, opacity: 1, transition: { duration: 0.3 } },
            exit: { x: 20, opacity: 0, transition: { duration: 0.3 } },
        },
    },
    scaleUp: {
        container: defaultContainerVariants,
        item: {
            hidden: { scale: 0.5, opacity: 0 },
            show: {
                scale: 1,
                opacity: 1,
                transition: { duration: 0.3, scale: { type: 'spring', damping: 15, stiffness: 300 } },
            },
            exit: { scale: 0.5, opacity: 0, transition: { duration: 0.3 } },
        },
    },
    scaleDown: {
        container: defaultContainerVariants,
        item: {
            hidden: { scale: 1.5, opacity: 0 },
            show: {
                scale: 1,
                opacity: 1,
                transition: { duration: 0.3, scale: { type: 'spring', damping: 15, stiffness: 300 } },
            },
            exit: { scale: 1.5, opacity: 0, transition: { duration: 0.3 } },
        },
    },
};

export function useAnimateEffect(props: AnimateEffectProps & { text: string }) {
    const {
        text,
        delay = 0,
        duration = 0.3,
        by = 'word',
        animation = 'fadeIn',
        startOnView = true,
        once = false,
    } = props;

    const segments = useMemo(() => {
        switch (by) {
            case 'word':
                return text.split(/(\s+)/);
            case 'character':
                return text.split('');
            case 'line':
                return text.split('\n');
            case 'text':
            default:
                return [text];
        }
    }, [text, by]);

    const finalVariants = useMemo(() => {
        const selected = defaultItemAnimationVariants[animation] || defaultItemAnimationVariants.fadeIn;
        return {
            container: {
                ...selected.container,
                show: {
                    ...selected.container.show,
                    transition: {
                        delayChildren: delay,
                        staggerChildren: duration / segments.length,
                    },
                },
                exit: {
                    ...selected.container.exit,
                    transition: {
                        staggerChildren: duration / segments.length,
                        staggerDirection: -1,
                    },
                },
            },
            item: selected.item,
        };
    }, [animation, delay, duration, segments.length]);

    return {
        segments,
        finalVariants,
        by,
        startOnView,
        once,
    };
}
