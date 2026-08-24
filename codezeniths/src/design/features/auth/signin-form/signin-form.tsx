'use client';

import React, { useState } from 'react';
import { useSigninForm } from './useSigninForm';
import { Eye, EyeOff, ArrowRight, Mail, Key } from 'lucide-react';
import { Card, CardHeader, CardContent, CardVariant } from '@codezeniths/modules';
import {
    Button,
    Input,
    Typography,
    TypographyVariant,
    ButtonVariant,
    ButtonSize,
    Grid,
    GridItem,
    Container,
    Separator,
    ButtonEffect,
    Switch
} from '@codezeniths/components';
import Link from 'next/link';
import Image from 'next/image';
import GoogleIcon from '@/assets/shared/google.svg';
import GithubIcon from '@/assets/shared/github.svg';
import { Turnstile } from '@marsidev/react-turnstile';

export const SigninForm = () => {
    const {
        form,
        onSubmit,
        onError,
        handleGoogleOAuth,
        handleGithubOAuth,
        onMagicLinkSubmit,
        isSendingMagicLink,
        loginMethod,
        setLoginMethod,
        isCheckingEmail,
        emailCheck,
        debouncedIdentifier,
        turnstileToken,
        setTurnstileToken,
        turnstileRef
    } = useSigninForm();

    const [showPassword, setShowPassword] = useState(false);

    const { register, formState } = form;
    const errors = formState.errors as any;
    const { isSubmitted, isSubmitting } = formState;
    const watchedValues = form.watch();

    const hasIdentifierError = errors.identifier && ((watchedValues.identifier?.length ?? 0) > 0 || isSubmitted);
    const hasPasswordError = errors.password && ((watchedValues.password?.length ?? 0) > 0 || isSubmitted);

    const inputClassName = "border-0 border-b border-muted-light/25 dark:border-muted-dark/25 focus:border-primary dark:focus:border-primary transition-colors rounded-none !px-0 bg-transparent dark:bg-transparent shadow-none focus-visible:ring-0 h-11 xs:h-12 sm:h-14 placeholder:text-muted-light dark:placeholder:text-muted-dark text-sm xs:text-base sm:text-lg";

    return (
        <Card variant={CardVariant.FLAT} className="relative w-full max-w-5xl p-4.5 xs:p-6 sm:p-10 md:p-14 lg:p-16 border border-secondary rounded-xs bg-foreground-light dark:bg-foreground-dark mx-auto shadow-none">
            <CardHeader className="flex-col items-center justify-center mb-6 sm:mb-10 md:mb-12 p-0 border-none shrink-0 w-full">
                <Typography
                    variant={TypographyVariant.H3}
                    className="font-bold text-2xl xs:text-3xl sm:text-4xl lg:text-5xl text-body-light dark:text-body-dark mb-2 text-center"
                >
                    Login to Your Account
                </Typography>
            </CardHeader>
            <CardContent className="p-0 w-full flex flex-col gap-6">
                <form
                    onSubmit={loginMethod === 'credentials' ? form.handleSubmit(onSubmit, onError) : form.handleSubmit(onMagicLinkSubmit, onError)}
                    className="w-full flex flex-col gap-6 sm:gap-8 md:gap-10"
                >
                    <Grid cols={1} className="sm:grid-cols-2" gap="md">
                        <GridItem colSpan={1}>
                            <Button
                                type="button"
                                variant={ButtonVariant.OUTLINE}
                                size={ButtonSize.LG}
                                onClick={handleGoogleOAuth}
                                className="w-full h-11 xs:h-12 sm:h-14 text-sm xs:text-base sm:text-lg gap-3 sm:gap-4 bg-primary/5 dark:bg-primary/5 hover:bg-primary/15 dark:hover:bg-primary/10 border-primary/20 hover:border-primary/40 text-body-light dark:text-body-dark transition-all duration-300 flex items-center justify-center shadow-sm hover:shadow-primary/10"
                            >
                                <Image src={GoogleIcon} alt="Google" width={22} height={22} className="opacity-90" />
                                Google
                            </Button>
                        </GridItem>
                        <GridItem colSpan={1}>
                            <Button
                                type="button"
                                variant={ButtonVariant.OUTLINE}
                                size={ButtonSize.LG}
                                onClick={handleGithubOAuth}
                                className="w-full h-11 xs:h-12 sm:h-14 text-sm xs:text-base sm:text-lg gap-3 sm:gap-4 bg-primary/5 dark:bg-primary/5 hover:bg-primary/15 dark:hover:bg-primary/10 border-primary/20 hover:border-primary/40 text-body-light dark:text-body-dark transition-all duration-300 flex items-center justify-center shadow-sm hover:shadow-primary/10"
                            >
                                <Image src={GithubIcon} alt="Github" width={22} height={22} className="opacity-90" />
                                Github
                            </Button>
                        </GridItem>
                    </Grid>

                    <Container direction="col" size="none" padded={false} centered={false} className="relative py-2">
                        <div className="absolute inset-0 flex items-center">
                            <Separator className="w-full bg-secondary-shade2/25 dark:bg-secondary-shade2/25" />
                        </div>
                        <div className="relative flex justify-center">
                            <Typography variant={TypographyVariant.SPAN} className="bg-foreground-light dark:bg-foreground-dark px-3 xs:px-4 text-muted-light-shade3 dark:text-muted-dark-shade3 font-normal text-[0.7rem] xs:text-xs tracking-wider text-center">
                                {loginMethod === 'credentials' ? "Or, continue with your email or username" : "Or, continue with Magic Link"}
                            </Typography>
                        </div>
                    </Container>

                    {loginMethod === 'credentials' ? (
                        <Grid cols={1} className="md:grid-cols-2" gap="lg">
                            <GridItem colSpan={1}>
                                <Container direction="col" size="none" padded={false} centered={false} className="space-y-2">
                                    <Input
                                        placeholder="Username or Email"
                                        {...register('identifier')}
                                        className={`${inputClassName} ${hasIdentifierError ? 'border-destructive' : ''}`}
                                    />
                                    {hasIdentifierError && (
                                        <Typography variant={TypographyVariant.CAPTION} className="text-destructive-shade2 dark:text-destructive">
                                            {errors.identifier.message as string}
                                        </Typography>
                                    )}
                                </Container>
                            </GridItem>

                            <GridItem colSpan={1}>
                                <Container direction="col" size="none" padded={false} centered={false} className="space-y-2">
                                    <Container direction="col" size="none" padded={false} centered={false} className="relative">
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Password"
                                            {...register('password')}
                                            className={`${inputClassName} pr-12 ${hasPasswordError ? 'border-destructive' : ''}`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-light dark:text-muted-dark hover:text-body-light dark:hover:text-body-dark transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </Container>
                                    {hasPasswordError && (
                                        <Typography variant={TypographyVariant.CAPTION} className="text-red-500 dark:text-red-400">
                                            {errors.password.message as string}
                                        </Typography>
                                    )}
                                </Container>
                            </GridItem>
                        </Grid>
                    ) : (
                        <div className="flex flex-col items-center gap-6 w-full pt-2">
                            <Container direction="col" size="none" padded={false} centered={false} className="space-y-2 w-full">
                                <Container direction="col" size="none" padded={false} centered={false} className="relative">
                                    <Input
                                        placeholder="Email address"
                                        type="email"
                                        {...register('identifier')}
                                        className={`${inputClassName} pr-10 ${hasIdentifierError ? 'border-destructive' : ''}`}
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                                        {isCheckingEmail ? (
                                            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                        ) : (watchedValues.identifier && watchedValues.identifier.includes('@') && emailCheck?.available === false && !hasIdentifierError) ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 animate-in zoom-in duration-300"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="m9 11 3 3L22 4" /></svg>
                                        ) : null}
                                    </div>
                                </Container>

                                {watchedValues.identifier && watchedValues.identifier.includes('@') && emailCheck?.available === false && !hasIdentifierError && (
                                    <Typography variant={TypographyVariant.CAPTION} className="text-success dark:text-success">
                                        Verified
                                    </Typography>
                                )}
                                {isCheckingEmail && <Typography variant={TypographyVariant.CAPTION} className='text-warning dark:text-warning'>checking...</Typography>}
                                {hasIdentifierError && (
                                    <Typography variant={TypographyVariant.CAPTION} className="text-destructive-shade2 dark:text-destructive">
                                        {errors.identifier.message as string}
                                    </Typography>
                                )}
                            </Container>
                        </div>
                    )}

                    <div className="flex justify-center my-2 max-w-full overflow-hidden scale-[0.80] xs:scale-[0.88] sm:scale-100 origin-center">
                        <Turnstile
                            ref={turnstileRef}
                            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                            onSuccess={(token) => setTurnstileToken(token)}
                            onError={() => setTurnstileToken(null)}
                            onExpire={() => setTurnstileToken(null)}
                            options={{ size: 'normal', theme: 'auto' }}
                        />
                    </div>

                    <div className="relative flex flex-col-reverse sm:flex-row items-center justify-center w-full gap-4 sm:gap-0 pt-2 sm:pt-4">
                        <div className="sm:absolute sm:left-0 flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-start">
                            <Switch
                                size="lg"
                                checked={loginMethod === 'magic-link'}
                                onCheckedChange={(checked) => {
                                    setLoginMethod(checked ? 'magic-link' : 'credentials');
                                    form.clearErrors();
                                }}
                                className='cursor-pointer'
                            />
                            <Typography variant={TypographyVariant.SPAN} className="text-xs xs:text-sm font-medium text-muted-light dark:text-muted-dark">
                                {loginMethod === 'magic-link' ? 'Password' : 'Magic Link'}
                            </Typography>
                        </div>

                        {loginMethod === 'credentials' ? (
                            <Button
                                type="submit"
                                variant={ButtonVariant.SECONDARY}
                                effect={ButtonEffect.SHIMMER}
                                isLoading={isSubmitting}
                                disabled={!turnstileToken}
                                className="w-1/2 sm:w-auto min-w-36 xs:min-w-40 sm:min-w-44 px-4 xs:px-6 sm:px-12 h-11 xs:h-12 sm:h-14 text-sm xs:text-base text-foreground-dark dark:text-foreground-light-shade3 shadow-md mx-auto"
                            >
                                {isSubmitting ? 'Signing in...' : 'Sign In'}
                                {!isSubmitting && <ArrowRight className="ml-2 text-surface-light-shade3" size={18} />}
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                variant={ButtonVariant.SECONDARY}
                                effect={ButtonEffect.SHIMMER}
                                isLoading={isSendingMagicLink}
                                disabled={!turnstileToken}
                                className="w-1/2 sm:w-auto min-w-36 xs:min-w-40 sm:min-w-44 h-11 xs:h-12 sm:h-14 px-4 xs:px-6 sm:px-12 text-sm xs:text-base text-foreground-dark dark:text-foreground-light-shade3 shadow-md mx-auto"
                            >
                                {!isSendingMagicLink && <Mail className="mr-2 text-surface-light-shade3" size={18} />}
                                {isSendingMagicLink ? 'Sending...' : 'Send Magic Link'}
                            </Button>
                        )}
                    </div>
                    <Separator className="w-full mt-4 sm:mt-6 bg-secondary-shade2/25 dark:bg-secondary/25" />

                    <Container direction="row" align="center" justify="between" size="none" padded={false} centered={false} className="w-full mt-2 flex-col sm:flex-row gap-2.5 sm:gap-4 text-center sm:text-left">
                        <Link href="/forgot-password" className="text-xs xs:text-sm text-heading-light dark:text-heading-dark font-medium hover:underline">
                            Forgot password?
                        </Link>

                        <Typography variant={TypographyVariant.P} className="text-xs xs:text-sm text-muted-light dark:text-muted-dark">
                            Don't have an account?{' '}
                            <Link href="/sign-up" className="text-heading-light dark:text-heading-dark font-medium hover:underline">
                                register
                            </Link>
                        </Typography>
                    </Container>
                </form>
            </CardContent>
        </Card>
    );
};
