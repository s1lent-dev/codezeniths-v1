import Planet from './planet';
import { Main, Typography, TypographyVariant, TypographyWeight, TypographyEffect, TypographyAlign } from '@codezeniths/components';
import { ReturnHomeButton } from './return-home-button';

export const NotFoundSection = () => {
    return (
        <Main className="relative h-dvh w-full overflow-hidden bg-background-light dark:bg-background-dark">            
                
                {/* Manual Simple Spotlight Effect for Testing */}
                <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden flex items-start justify-center">
                    <div className="w-200 h-150 bg-primary/30 blur-[120px] rounded-full -mt-50" />
                </div>

                {/* Content Wrapper */}
                <div className="relative z-10 flex flex-col items-center justify-between h-full w-full isolate transform-gpu pt-6 xs:pt-8 pb-8 xs:pb-12 md:pb-16">
                    
                    {/* 404 3D Component */}
                    <div className="flex-1 w-full max-w-3xl flex items-center justify-center min-h-0 relative">
                        <Planet />
                    </div>

                    {/* Text and Button Wrapper */}
                    <div className="flex flex-col items-center shrink-0 px-4 text-center z-10 space-y-4 sm:space-y-6 md:space-y-8 w-full max-w-3xl mx-auto">
                        
                        {/* Subtexts */}
                        <div className="flex flex-col gap-2.5 xs:gap-3 items-center text-center pointer-events-none w-full">
                            <Typography 
                                variant={TypographyVariant.H1} 
                                weight={TypographyWeight.BOLD}
                                align={TypographyAlign.CENTER}
                                effect={TypographyEffect.AURORA}
                                colors={['#6A7CFF', '#7aa2f7', '#bb9af7', '#73daca']} 
                                speed={1.1} 
                                className="opacity-90 text-center text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight"
                            >
                                Oops! Looks like You're Lost.
                            </Typography>
                            <Typography 
                                variant={TypographyVariant.P} 
                                align={TypographyAlign.CENTER}
                                className="max-w-md text-center text-xs xs:text-sm sm:text-base text-muted-light dark:text-muted-dark leading-relaxed"
                            >
                                The link you followed may be broken, or the page may have been removed. Let's get you back to familiar territory.
                            </Typography>
                        </div>

                        {/* Return Home Button with shimmer */}
                        <div className="flex items-center justify-center">
                            <ReturnHomeButton />
                        </div>

                    </div>
                </div>
        </Main>
    );
};
