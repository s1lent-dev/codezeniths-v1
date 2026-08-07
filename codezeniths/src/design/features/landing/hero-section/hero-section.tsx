"use client";

import React from "react";
import Image from "next/image";
import {
  Container,
  Grid,
  Typography,
  TypographyVariant,
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
    <section className="relative px-16 pt-32 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
      {/* Light Rays Background Effect */}
      <Background variant={BackgroundVariant.LIGHT_RAYS} count={7} speed={14} color="rgba(106, 124, 255, 0.2)" blur={36} />
      
      <Container size="7xl" className="mx-auto px-16 lg:px-20 relative z-10">
        <Grid className="grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
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
            className="flex flex-col gap-6 lg:pr-8"
          >
            <motion.div 
              variants={{ 
                hidden: { opacity: 0, x: -40, filter: "blur(8px)" }, 
                visible: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } } 
              }} 
              className="flex items-center gap-2"
            >
              🚀
              <Typography
                variant={TypographyVariant.P}
                effect={TypographyEffect.GRADIENT}
                colorFrom="#6A7CFF"
                colorTo="#a289fa"
                speed={1}
                className="text-sm lg:text-base tracking-wider"
              >
                Reach your zenith
              </Typography>
            </motion.div>

            <motion.div 
              variants={{ 
                hidden: { opacity: 0, x: -40, filter: "blur(8px)" }, 
                visible: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } } 
              }} 
              className="flex flex-col gap-4"
            >
              <Typography
                variant={TypographyVariant.H2}
                className="font-extrabold font-serif leading-tight text-foreground-dark-shade3 dark:text-foreground-light-shade3"
              >
                Where every coder finds their peak. Unified, unstoppable, always
                at your zenith.
              </Typography>

              <Typography
                variant={TypographyVariant.P}
                className="text-[1rem] text-muted-light-shade1 dark:text-muted-dark-shade1 max-w-lg mt-0 leading-relaxed"
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
              className="mt-4"
            >
              <Button
                size={ButtonSize.LG}
                variant={ButtonVariant.DEFAULT}
                effect={ButtonEffect.INTERACTIVE_HOVER}
                className="bg-background-light-shade2 dark:bg-background-dark-shade2"
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
            className="relative w-full h-75 sm:h-110 lg:h-110 flex justify-center items-center mt-12"
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
