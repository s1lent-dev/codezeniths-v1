'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogCancel,
} from '@codezeniths/modules';
import { Button, ButtonVariant, Typography, TypographyVariant } from '@codezeniths/components';
import { RadioGroup, RadioGroupItem } from '@codezeniths/components';
import { Label } from '@codezeniths/components';

interface SignupVerificationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const SignupVerificationDialog: React.FC<SignupVerificationDialogProps> = ({ open, onOpenChange }) => {
    const router = useRouter();
    const { user } = useAuth();
    const hasPhoneNumber = !!(user as any)?.phoneNumber;
    
    const [verificationMethod, setVerificationMethod] = useState<'email' | 'sms'>('email');

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="data-[size=default]:max-w-xl data-[size=default]:sm:max-w-2xl p-4.5 xs:p-6 sm:p-8 gap-4 sm:gap-6 w-[95vw]">
                <AlertDialogHeader className="space-y-1.5 sm:space-y-2 text-left">
                    <AlertDialogTitle className="text-lg xs:text-xl sm:text-2xl font-bold">Account created successfully! 🎉</AlertDialogTitle>
                    <AlertDialogDescription className="text-xs xs:text-sm sm:text-base leading-relaxed">
                        Would you like to verify your account right now, or skip to complete your profile?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                
                {hasPhoneNumber && (
                    <div className="py-2 sm:py-4">
                        <Typography variant={TypographyVariant.SPAN} className="text-xs xs:text-sm font-medium text-muted-light dark:text-muted-dark block mb-2 sm:mb-3">
                            Choose verification channel:
                        </Typography>
                        <RadioGroup 
                            value={verificationMethod} 
                            onValueChange={(val) => setVerificationMethod(val as 'email' | 'sms')}
                            className="flex flex-row items-center gap-4 sm:gap-6 w-full"
                        >
                            <div className="flex items-center gap-2">
                                <RadioGroupItem value="email" id="verify-email" />
                                <Label htmlFor="verify-email" className="cursor-pointer text-xs xs:text-sm font-medium">Email</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <RadioGroupItem value="sms" id="verify-sms" />
                                <Label htmlFor="verify-sms" className="cursor-pointer text-xs xs:text-sm font-medium">SMS</Label>
                            </div>
                        </RadioGroup>
                    </div>
                )}
                
                <AlertDialogFooter className="flex flex-col-reverse sm:flex-row items-center justify-between sm:justify-between gap-3 sm:gap-4 mt-2 border-t-0 p-0 m-0 mb-0 bg-transparent dark:bg-transparent w-full">
                    
                    <AlertDialogCancel 
                        variant={ButtonVariant.GHOST} 
                        onClick={() => router.push('/complete-profile')}
                        className="w-full sm:w-auto text-xs xs:text-sm"
                    >
                        Skip for now
                    </AlertDialogCancel>
                    
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <Button 
                            variant={ButtonVariant.DEFAULT} 
                            onClick={() => {
                                if (hasPhoneNumber) {
                                    router.push(verificationMethod === 'sms' ? '/verify-phone' : '/verify-email');
                                } else {
                                    router.push('/verify-email');
                                }
                            }}
                            className="w-full sm:w-auto whitespace-nowrap shrink-0 text-xs xs:text-sm"
                        >
                            Verify
                            <ArrowRight className="ml-2 text-surface-light-shade3" size={16} />
                        </Button>
                    </div>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
