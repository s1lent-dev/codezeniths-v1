import Planet from './planet';
import { Main, Typography, TypographyVariant, TypographyWeight, TypographyEffect } from '@codezeniths/components';
import { ReturnHomeButton } from './return-home-button';

export const NotFoundSection = () => {
    return (
        <Main className="relative h-dvh w-full overflow-hidden bg-background-light dark:bg-background-dark">            
                
                {/* Manual Simple Spotlight Effect for Testing */}
                <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden flex items-start justify-center">
                    <div className="w-200 h-150 bg-primary/30 blur-[120px] rounded-full -mt-50" />
                </div>

                {/* Content Wrapper */}
                <div className="relative z-10 flex flex-col items-center justify-between h-full w-full isolate transform-gpu pt-8 pb-12 md:pb-16">
                    
                    {/* 404 3D Component */}
                    <div className="flex-1 w-full max-w-3xl flex items-center justify-center min-h-0 relative">
                        <Planet />
                    </div>

                    {/* Text and Button Wrapper */}
                    <div className="flex flex-col items-center shrink-0 px-4 text-center z-10 space-y-6 md:space-y-8">
                        
                        {/* Subtexts */}
                        <div className="flex flex-col gap-4 items-center space-y-3 pointer-events-none">
                            <Typography 
                                variant={TypographyVariant.H1} 
                                weight={TypographyWeight.BOLD}
                                effect={TypographyEffect.AURORA}
                                colors={['#6A7CFF', '#7aa2f7', '#bb9af7', '#73daca']} 
                                speed={1.1} 
                                className="opacity-75"
                            >
                                Oops! Looks like You're Lost.
                            </Typography>
                            <Typography variant={TypographyVariant.P} className="max-w-md text-center text-muted-dark-shade1">
                                The link you followed may be broken, or the page may have been removed. Let's get you back to familiar territory.
                            </Typography>
                        </div>

                        {/* Return Home Button with shimmer */}
                        <div>
                            <ReturnHomeButton />
                        </div>

                    </div>
                </div>
        </Main>
    );
};
