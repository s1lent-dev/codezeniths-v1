'use client';

import React, { useState } from 'react';
import { useSignupForm } from './useSignupForm';
import { Eye, EyeOff, Check, CheckCircle2, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardContent, CardVariant } from '@codezeniths/modules';
import { SignupVerificationDialog } from './signup-verification-dialog';
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
    Switch,
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectGroup,
    SelectItem
} from '@codezeniths/components';
import { PhoneInput } from '@codezeniths/modules';
import Link from 'next/link';
import Image from 'next/image';
import GoogleIcon from '@/assets/shared/google.svg';
import GithubIcon from '@/assets/shared/github.svg';
import { Turnstile } from '@marsidev/react-turnstile';

export const SignupForm = () => {
    const {
        form,
        passwordStrength,
        onSubmit,
        onError,
        handleGoogleOAuth,
        handleGithubOAuth,
        watchedValues,
        isSubmitting,
        isCheckingUsername,
        isCheckingEmail,
        isCheckingPhone,
        usernameCheck,
        emailCheck,
        phoneCheck,
        showVerificationDialog,
        setShowVerificationDialog,
        turnstileToken,
        setTurnstileToken,
        turnstileRef,
        router
    } = useSignupForm();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const [verificationMethod, setVerificationMethod] = useState<'email' | 'sms'>('email');

    const { register, formState } = form;
    const errors = formState.errors as any;

    const { isSubmitted } = formState;
    const hasUsernameError = errors.username && (watchedValues.username?.length > 0 || isSubmitted);
    const hasEmailError = errors.email && (watchedValues.email?.length > 0 || isSubmitted);
    const hasPhoneError = errors.phone && ((watchedValues.phone?.length ?? 0) > 0 || isSubmitted);
    const hasPasswordError = errors.password && (watchedValues.password?.length > 0 || isSubmitted);
    const hasConfirmPasswordError = errors.confirmPassword && (watchedValues.confirmPassword?.length > 0 || isSubmitted);

    const renderPasswordStrength = () => {
        if (!isPasswordFocused || !watchedValues.password || watchedValues.password.length === 0 || passwordStrength.status === 'none') return null;

        const { status, reqs } = passwordStrength;

        // Progress bar segments
        const activeSegments = status === 'weak' ? 1 : status === 'fair' ? 2 : status === 'good' ? 3 : 4;
        const activeColor = status === 'weak' ? 'bg-red-500' : status === 'fair' ? 'bg-yellow-500' : status === 'good' ? 'bg-blue-500' : 'bg-green-500';

        const requirements = [
            { id: 'length', text: 'At least 8 characters', met: reqs.length },
            { id: 'casing', text: 'Uppercase & Lowercase', met: reqs.casing },
            { id: 'number', text: 'Includes a number', met: reqs.number },
            { id: 'symbol', text: 'Includes a symbol', met: reqs.symbol },
        ];

        const statusMap = {
            weak: { text: 'Weak', emoji: '😖' },
            fair: { text: 'Fair', emoji: '😐' },
            good: { text: 'Good', emoji: '😉' },
            strong: { text: 'Awesome!', emoji: '😎' }
        };

        const currentStatus = statusMap[status];

        return (
            <Container direction="col" size="none" padded={false} centered={false} className="mt-4 space-y-4">
                <div className="flex items-center justify-between w-full">
                    <Typography variant={TypographyVariant.CAPTION} className="text-muted-light dark:text-muted-dark">
                        Password Strength
                    </Typography>
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-secondary/30 dark:bg-secondary/20">
                        <span className="text-sm">{currentStatus.emoji}</span>
                        <Typography variant={TypographyVariant.CAPTION} className="font-medium text-body-light dark:text-body-dark">
                            {currentStatus.text}
                        </Typography>
                    </div>
                </div>

                <div className="flex w-full gap-1.5">
                    {[0, 1, 2, 3].map((index) => (
                        <div key={index} className="h-1.5 flex-1 bg-secondary/50 rounded-full overflow-hidden relative">
                            <div className={`absolute top-0 left-0 h-full w-full transition-all duration-500 ease-out ${index < activeSegments ? activeColor : '-translate-x-full'}`} />
                        </div>
                    ))}
                </div>

                <div className="flex flex-col gap-2 mt-2">
                    {requirements.map((req) => (
                        <div key={req.id} className="flex items-center gap-2">
                            <div className={`flex shrink-0 items-center justify-center w-4 h-4 rounded-full transition-colors duration-300 ${req.met ? 'bg-primary text-white' : 'border border-muted-light dark:border-muted-dark text-transparent'}`}>
                                <Check size={10} className={`transition-opacity duration-300 ${req.met ? 'opacity-100' : 'opacity-0'}`} />
                            </div>
                            <Typography variant={TypographyVariant.CAPTION} className={`transition-colors duration-300 ${req.met ? 'text-body-light dark:text-body-dark font-medium' : 'text-muted-light dark:text-muted-dark'}`}>
                                {req.text}
                            </Typography>
                        </div>
                    ))}
                </div>
            </Container>
        );
    };

    const inputClassName = "border-0 border-b border-muted-light/25 dark:border-muted-dark/25 focus:border-primary dark:focus:border-primary transition-colors rounded-none !px-0 bg-transparent dark:bg-transparent shadow-none focus-visible:ring-0 h-11 xs:h-12 sm:h-14 placeholder:text-muted-light dark:placeholder:text-muted-dark text-sm xs:text-base sm:text-lg";

    return (
        <Card variant={CardVariant.FLAT} className="w-full max-w-5xl p-4.5 xs:p-6 sm:p-10 md:p-14 lg:p-16 border border-secondary rounded-xs bg-foreground-light dark:bg-foreground-dark mx-auto shadow-none">
            <CardHeader className="flex-col items-center justify-center mb-6 sm:mb-10 md:mb-12 p-0 border-none shrink-0 w-full">
                <Typography
                    variant={TypographyVariant.H3}
                    className="font-bold text-2xl xs:text-3xl sm:text-4xl lg:text-5xl text-body-light dark:text-body-dark mb-2 text-center"
                >
                    Create An Account
                </Typography>
            </CardHeader>
            <CardContent className="p-0 w-full flex flex-col gap-6">
                <form onSubmit={form.handleSubmit(onSubmit, onError)} className="w-full flex flex-col gap-6 sm:gap-8 md:gap-10">
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
                                <Image src={GithubIcon} alt="Github" width={22} height={22} className="opacity-90 " />
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
                                Or, register with your email
                            </Typography>
                        </div>
                    </Container>

                    <Grid cols={1} className="md:grid-cols-2" gap="lg">
                        <GridItem colSpan={1}>
                            <Container direction="col" size="none" padded={false} centered={false} className="space-y-2">
                                <Container direction="col" size="none" padded={false} centered={false} className="relative">
                                    <Input
                                        placeholder="Username"
                                        {...register('username', {
                                            onChange: (e) => {
                                                // Convert to lowercase on the fly before RHF processes it
                                                e.target.value = e.target.value.toLowerCase();
                                            }
                                        })}
                                        className={`${inputClassName} pr-10 ${hasUsernameError ? 'border-destructive' : ''}`}
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                                        {isCheckingUsername ? (
                                            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                        ) : (watchedValues.username && watchedValues.username.length > 0 && usernameCheck?.available && !hasUsernameError) ? (
                                            <CheckCircle2 size={20} className="text-green-500 animate-in zoom-in duration-300" />
                                        ) : null}
                                    </div>
                                </Container>
                                {watchedValues.username && watchedValues.username.length > 0 && usernameCheck?.available && !hasUsernameError && (
                                    <Typography variant={TypographyVariant.CAPTION} className="text-success dark:text-success">
                                        Available
                                    </Typography>
                                )}
                                {isCheckingUsername && <Typography variant={TypographyVariant.CAPTION} className='text-warning dark:text-warning'>checking...</Typography>}
                                {hasUsernameError && (
                                    <div className="flex flex-col gap-2 pt-1">
                                        <Typography variant={TypographyVariant.CAPTION} className="text-destructive-shade2 dark:text-destructive">
                                            {errors.username.message as string}
                                        </Typography>
                                        
                                        {usernameCheck && usernameCheck.suggestions && usernameCheck.suggestions.length > 0 && (
                                            <div className="flex flex-col gap-1.5 mt-2 transition-all">
                                                <Typography variant={TypographyVariant.CAPTION} className="text-muted-light dark:text-muted-dark font-medium">
                                                    Available suggestions:
                                                </Typography>
                                                <div className="flex flex-wrap gap-2">
                                                    {usernameCheck.suggestions.slice(0, 5).map((suggestion: string) => (
                                                        <button
                                                            key={suggestion}
                                                            type="button"
                                                            onClick={() => {
                                                                form.setValue('username', suggestion, { shouldValidate: true });
                                                            }}
                                                            className="text-xs px-2.5 py-1 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors border border-primary/20"
                                                        >
                                                            {suggestion}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </Container>
                        </GridItem>

                        <GridItem colSpan={1}>
                            <Container direction="col" size="none" padded={false} centered={false} className="space-y-2">
                                <Container direction="col" size="none" padded={false} centered={false} className="relative">
                                    <Input
                                        placeholder="Email address"
                                        type="email"
                                        {...register('email')}
                                        className={`${inputClassName} pr-10 ${hasEmailError ? 'border-destructive' : ''}`}
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                                        {isCheckingEmail ? (
                                            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                        ) : (watchedValues.email && watchedValues.email.length > 0 && emailCheck?.available && !hasEmailError) ? (
                                            <CheckCircle2 size={20} className="text-green-500 animate-in zoom-in duration-300" />
                                        ) : null}
                                    </div>
                                </Container>
                                {watchedValues.email && watchedValues.email.length > 0 && emailCheck?.available && !hasEmailError && (
                                    <Typography variant={TypographyVariant.CAPTION} className="text-success dark:text-success">
                                        Available
                                    </Typography>
                                )}
                                {isCheckingEmail && <Typography variant={TypographyVariant.CAPTION} className='text-warning dark:text-warning'>checking...</Typography>}
                                {hasEmailError && (
                                    <Typography variant={TypographyVariant.CAPTION} className="text-destructive-shade2 dark:text-destructive">
                                        {errors.email.message as string}
                                    </Typography>
                                )}
                            </Container>
                        </GridItem>
                    </Grid>

                    <div className="relative group w-full pt-1">
                        <PhoneInput 
                            countryCode={watchedValues.countryCode}
                            onCountryCodeChange={(val) => form.setValue('countryCode', val, { shouldValidate: true })}
                            value={watchedValues.phone}
                            onChange={(e) => {
                                const raw = e.target.value.replace(/[^\d\s-]/g, '');
                                form.setValue('phone', raw, { shouldValidate: true });
                            }}
                            placeholder="Phone Number (Optional)"
                            inputClassName={hasPhoneError ? '!border-destructive' : ''}
                        />
                        {watchedValues.phone && watchedValues.phone.length > 0 && phoneCheck?.available && !hasPhoneError && (
                            <Typography variant={TypographyVariant.CAPTION} className="text-success dark:text-success">
                                Available
                            </Typography>
                        )}
                        {isCheckingPhone && <Typography variant={TypographyVariant.CAPTION} className='text-warning dark:text-warning pt-1 absolute right-3 top-1/2 -translate-y-1/2'>checking...</Typography>}
                        {!isCheckingPhone && watchedValues.phone && watchedValues.phone.length > 0 && phoneCheck?.available && !hasPhoneError && (
                            <CheckCircle2 size={20} className="text-green-500 animate-in zoom-in duration-300 absolute right-3 top-1/2 -translate-y-1/2" />
                        )}
                        {hasPhoneError && (
                            <Typography variant={TypographyVariant.CAPTION} className="text-destructive-shade2 dark:text-destructive pt-1">
                                {errors.phone?.message as string}
                            </Typography>
                        )}
                        <div className="absolute left-0 -top-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 text-foreground-dark dark:text-foreground-light text-xs px-3 py-2 rounded-md shadow-lg z-10 whitespace-normal sm:whitespace-nowrap w-max max-w-full">
                            It's optional, but if you want to verify with a phone number in the future, you must add it here.
                        </div>
                    </div>

                    <Grid cols={1} className="md:grid-cols-2" gap="lg">
                        <GridItem colSpan={1}>
                            <Container direction="col" size="none" padded={false} centered={false} className="space-y-2">
                                <Container direction="col" size="none" padded={false} centered={false} className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password"
                                        {...register('password', {
                                            onBlur: () => setIsPasswordFocused(false)
                                        })}
                                        onFocus={() => setIsPasswordFocused(true)}
                                        className={`${inputClassName} pr-16 ${hasPasswordError ? 'border-destructive' : ''}`}
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                        {passwordStrength.status === 'strong' && (
                                            <CheckCircle2 size={20} className="text-green-500 animate-in zoom-in duration-300" />
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="text-muted-light dark:text-muted-dark hover:text-body-light dark:hover:text-body-dark transition-colors cursor-pointer"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </Container>
                                {renderPasswordStrength()}
                                {hasPasswordError && (
                                    <Typography variant={TypographyVariant.CAPTION} className="text-red-500 dark:text-red-400">
                                        {errors.password.message as string}
                                    </Typography>
                                )}
                            </Container>
                        </GridItem>

                        <GridItem colSpan={1}>
                            <Container direction="col" size="none" padded={false} centered={false} className="space-y-2">
                                <Container direction="col" size="none" padded={false} centered={false} className="relative">
                                    <Input
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm password"
                                        {...register('confirmPassword')}
                                        className={`${inputClassName} pr-12 ${hasConfirmPasswordError ? 'border-destructive' : ''}`}
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                        {watchedValues.confirmPassword && watchedValues.confirmPassword.length > 0 && watchedValues.confirmPassword === watchedValues.password && !hasConfirmPasswordError && (
                                            <CheckCircle2 size={20} className="text-green-500 animate-in zoom-in duration-300" />
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="text-muted-light dark:text-muted-dark hover:text-body-light dark:hover:text-body-dark transition-colors cursor-pointer"
                                        >
                                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </Container>
                                {hasConfirmPasswordError && (
                                    <Typography variant={TypographyVariant.CAPTION} className="text-red-500 dark:text-red-400">
                                        {errors.confirmPassword.message as string}
                                    </Typography>
                                )}
                            </Container>
                        </GridItem>
                    </Grid>

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

                    <div className="flex justify-center pt-2 sm:pt-4">
                        <Button
                            type="submit"
                            variant={ButtonVariant.SECONDARY}
                            effect={ButtonEffect.SHIMMER}
                            isLoading={isSubmitting}
                            disabled={!turnstileToken}
                            className="w-1/2 sm:w-auto min-w-36 xs:min-w-40 sm:min-w-44 px-4 xs:px-6 sm:px-12 h-11 xs:h-12 sm:h-14 text-sm xs:text-base text-foreground-dark dark:text-foreground-light-shade3 shadow-md mx-auto"
                        >
                            {isSubmitting ? 'Creating...' : 'Create Account'}
                            {!isSubmitting && <ArrowRight className="ml-2 text-surface-light-shade3" size={18} />}
                        </Button>
                    </div>
                    <Separator className="w-full mt-4 sm:mt-6 bg-secondary-shade2/25 dark:bg-secondary/25" />

                    <Container direction="row" align="center" justify="end" size="none" padded={false} centered={false} className="w-full mt-2 text-center sm:text-right">
                        <Typography variant={TypographyVariant.P} className="text-xs xs:text-sm text-muted-light dark:text-muted-dark w-full sm:w-auto">
                            Already have an account?{' '}
                            <Link href="/sign-in" className="text-heading-light dark:text-heading-dark font-medium hover:underline">
                                Login
                            </Link>
                        </Typography>
                    </Container>
                </form>
            </CardContent>

            <SignupVerificationDialog 
                open={showVerificationDialog} 
                onOpenChange={setShowVerificationDialog} 
            />
        </Card>
    );
};
