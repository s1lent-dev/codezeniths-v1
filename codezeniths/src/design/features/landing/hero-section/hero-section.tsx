"use client";

import React from "react";
import Image from "next/image";
import {
  Container,
  Grid,
  Typography,
  TypographyVariant,
  TypographyAlign,
  Button,
  ButtonSize,
  ButtonVariant,
  ButtonEffect,
  Background,
  BackgroundVariant,
  TypographyEffect,
} from "@codezeniths/components";
import phoneScene from "@/assets/landing/hero/phone-scene.svg";
import { motion } from "motion/react";

export const HeroSection = () => {
  return (
    <section className="relative px-4 xs:px-6 sm:px-10 lg:px-16 pt-24 xs:pt-28 lg:pt-32 pb-12 xs:pb-16 lg:pb-24 overflow-hidden">
      {/* Light Rays Background Effect */}
      <Background variant={BackgroundVariant.LIGHT_RAYS} count={7} speed={14} color="rgba(106, 124, 255, 0.2)" blur={36} />
      
      <Container size="7xl" className="mx-auto px-0 sm:px-4 lg:px-8 relative z-10">
        <Grid className="grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-8 items-center">
          {/* Left Content */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.15, delayChildren: 0.1 }
              }
            }}
            className="flex flex-col items-center text-center lg:items-start lg:text-left gap-6 lg:pr-8"
          >
            <motion.div 
              variants={{ 
                hidden: { opacity: 0, x: -40, filter: "blur(8px)" }, 
                visible: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } } 
              }} 
              className="flex items-center justify-center lg:justify-start gap-2 w-full"
            >
              <span>🚀</span>
              <Typography
                variant={TypographyVariant.P}
                effect={TypographyEffect.GRADIENT}
                colorFrom="#6A7CFF"
                colorTo="#a289fa"
                speed={1}
                className="text-xs xs:text-sm lg:text-base tracking-wider font-medium"
              >
                Reach your zenith
              </Typography>
            </motion.div>

            <motion.div 
              variants={{ 
                hidden: { opacity: 0, x: -40, filter: "blur(8px)" }, 
                visible: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } } 
              }} 
              className="flex flex-col items-center lg:items-start gap-4 w-full"
            >
              <Typography
                variant={TypographyVariant.H2}
                align={TypographyAlign.CENTER}
                className="font-extrabold font-serif text-2xl xs:text-3xl sm:text-4xl lg:text-5xl leading-tight lg:text-left text-foreground-dark-shade3 dark:text-foreground-light-shade3"
              >
                Where every coder finds their peak. Unified, unstoppable, always
                at your zenith.
              </Typography>

              <Typography
                variant={TypographyVariant.P}
                align={TypographyAlign.CENTER}
                className="text-xs xs:text-sm sm:text-base text-muted-light-shade1 dark:text-muted-dark-shade1 max-w-lg mt-0 leading-relaxed lg:text-left mx-auto lg:mx-0"
              >
                CodeZeniths is the all-in-one CS platform to solve DSA, compete,
                build, and prep for interviews. Learn, visualize, and connect
                with coders — all the way to your peak.
              </Typography>
            </motion.div>

            <motion.div 
              variants={{ 
                hidden: { opacity: 0, x: -40, filter: "blur(8px)" }, 
                visible: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } } 
              }} 
              className="mt-2 xs:mt-4 w-full xs:w-auto flex justify-center lg:justify-start"
            >
              <Button
                size={ButtonSize.LG}
                variant={ButtonVariant.DEFAULT}
                effect={ButtonEffect.INTERACTIVE_HOVER}
                className="w-full xs:w-auto rounded-full bg-background-light-shade2 dark:bg-background-dark-shade2"
              >
                Getting started
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Content */}
          <motion.div 
            initial={{ opacity: 0, x: 60, scale: 0.95, rotate: -2, filter: "blur(12px)" }}
            animate={{ opacity: 1, x: 0, scale: 1, rotate: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="relative w-full h-64 xs:h-80 sm:h-96 lg:h-110 flex justify-center items-center mt-6"
          >
            <Image
              src={phoneScene}
              alt="CodeZeniths Platform"
              fill
              className="object-contain"
              priority
            />
          </motion.div>
        </Grid>
      </Container>
    </section>
  );
};
