'use client';
import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { Carousel, CarouselContent, CarouselItem } from '../index';
import { CarouselEffect } from '../core/types';

const meta = {
  title: 'Modules/Feedback/Carousel/Effects',
  component: Carousel,
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

const Slide = ({ index }: { index: number }) => (
  <div className="flex h-64 w-full items-center justify-center rounded-xl border bg-card text-card-foreground shadow-sm bg-muted/20">
    <span className="text-4xl font-semibold">Slide {index + 1}</span>
  </div>
);


export const FadeEffectStory: Story = {
  render: () => (
    <div className="w-full max-w-md mx-auto bg-muted/10 border border-muted rounded-2xl p-16 flex items-center justify-center">
      <Carousel effect={CarouselEffect.FADE} options={{ loop: true }}>
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index} className="basis-full transform-gpu">
              <div className="w-full h-48 bg-background border border-muted rounded-xl flex items-center justify-center text-4xl font-semibold shadow-sm overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  src={`https://picsum.photos/600/350?v=${index}`}
                  alt={`Slide ${index + 1}`}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  ),
};

export const ScaleEffectStory: Story = {
  render: () => (
    <Carousel 
      effect={CarouselEffect.SCALE} 
      options={{ loop: true, align: 'center' }}
      className="w-full max-w-xl mx-auto"
    >
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index} className="basis-[55%] transform-gpu">
            <div 
              className="flex items-center justify-center rounded-[1.8rem] border-[0.2rem] border-muted shadow-sm bg-muted/20 select-none backface-hidden"
              style={{ height: '19rem' }}
            >
              <span className="text-[4rem] font-semibold">{index + 1}</span>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  ),
};

export const OpacityEffectStory: Story = {
  render: () => (
    <Carousel 
      effect={CarouselEffect.OPACITY} 
      options={{ loop: true }}
      className="w-full max-w-xl mx-auto"
    >
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index} className="basis-[70%] transform-gpu">
            <div className="h-[19rem] rounded-[1.8rem] overflow-hidden will-change-opacity">
              <img
                className="block h-full w-full object-cover"
                src={`https://picsum.photos/600/350?v=${index}`}
                alt={`Slide ${index + 1}`}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  ),
};

export const ParallaxEffectStory: Story = {
  render: () => (
    <Carousel 
      effect={CarouselEffect.PARALLAX} 
      options={{ loop: true, dragFree: true }}
      className="w-full max-w-xl mx-auto"
    >
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index} className="basis-[80%] transform-gpu">
            <div className="h-[19rem] rounded-[1.8rem] overflow-hidden">
              <div 
                data-parallax-layer
                className="relative h-full w-full flex justify-center"
              >
                <img
                  className="max-w-none flex-[0_0_calc(115%+2rem)] object-cover"
                  src={`https://picsum.photos/600/350?v=${index}`}
                  alt={`Slide ${index + 1}`}
                />
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  ),
};

export const MonoParallaxEffectStory: Story = {
  render: () => (
    <Carousel 
      effect={CarouselEffect.MONOPARALLAX} 
      options={{ loop: true }}
      className="w-full max-w-2xl mx-auto h-[400px] bg-black text-white relative overflow-hidden"
    >
      <div 
        data-global-parallax="-23%"
        className="absolute left-0 top-0 w-[130%] h-full bg-cover bg-center"
        style={{ backgroundImage: 'url(https://swiperjs.com/demos/images/abstract-1.jpg)' }}
      />
      <CarouselContent className="h-full ml-0">
        {Array.from({ length: 3 }).map((_, index) => (
          <CarouselItem key={index} className="basis-full h-full pl-0 transform-gpu flex flex-col justify-center px-16 box-border">
            <div data-parallax="-300" className="text-[41px] font-light">
              Slide {index + 1}
            </div>
            <div data-parallax="-200" className="text-[21px] mt-2">
              Subtitle
            </div>
            <div data-parallax="-100" className="text-[14px] max-w-[400px] leading-relaxed mt-4">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
                dictum mattis velit, sit amet faucibus felis iaculis nec. Nulla
                laoreet justo vitae porttitor porttitor. Suspendisse in sem justo.
                Integer laoreet magna nec elit suscipit, ac laoreet nibh euismod.
              </p>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  ),
};

export const CoverflowEffectStory: Story = {
  render: () => (
    <div className="w-full max-w-4xl mx-auto bg-muted/10 border border-muted rounded-2xl p-8 flex items-center justify-center overflow-hidden">
      <Carousel 
        effect={CarouselEffect.COVERFLOW} 
        options={{ loop: true, align: 'center' }}
        className="w-full"
      >
        <CarouselContent className="py-12">
          {Array.from({ length: 9 }).map((_, index) => (
            <CarouselItem key={index} className="basis-auto transform-gpu flex justify-center">
              <div className="w-[300px] h-[300px] flex-shrink-0 shadow-xl">
                <img
                  className="block w-full h-full object-cover rounded-xl"
                  src={`https://swiperjs.com/demos/images/abstract-${index + 1}.jpg`}
                  alt={`Slide ${index + 1}`}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  ),
};

export const FlipEffectStory: Story = {
  render: () => (
    <div className="w-full max-w-sm mx-auto bg-muted/10 border border-muted rounded-2xl p-12 flex items-center justify-center">
      <Carousel 
        effect={CarouselEffect.FLIP} 
        options={{ loop: true }}
        className="w-[300px]"
      >
        <CarouselContent>
          {Array.from({ length: 6 }).map((_, index) => (
            <CarouselItem key={index} className="basis-full transform-gpu">
              <div className="w-full h-[300px] shadow-xl">
                <img
                  className="block w-full h-full object-cover rounded-xl"
                  src={`https://swiperjs.com/demos/images/abstract-${index + 1}.jpg`}
                  alt={`Slide ${index + 1}`}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  ),
};

export const CubeEffectStory: Story = {
  render: () => (
    <div className="w-full max-w-md mx-auto bg-muted/10 border border-muted rounded-2xl p-16 flex items-center justify-center">
      <Carousel 
        effect={CarouselEffect.CUBE} 
        options={{ loop: true }}
        className="w-[300px]"
      >
        <CarouselContent>
          {Array.from({ length: 4 }).map((_, index) => (
            <CarouselItem key={index} className="basis-full transform-gpu">
              <div className="w-full h-[300px] shadow-2xl">
                <img
                  className="block w-full h-full object-cover rounded-xl"
                  src={`https://swiperjs.com/demos/images/abstract-${index + 1}.jpg`}
                  alt={`Slide ${index + 1}`}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  ),
};

const CreativeSlideTemplate = ({ index }: { index: number }) => {
  const colors = [
    'rgb(206, 17, 17)', 'rgb(0, 140, 255)', 'rgb(10, 184, 111)', 'rgb(211, 122, 7)',
    'rgb(118, 163, 12)', 'rgb(180, 10, 47)', 'rgb(35, 99, 19)', 'rgb(0, 68, 255)', 'rgb(218, 12, 218)'
  ];
  return (
    <div 
      className="w-full h-[240px] shadow-xl flex items-center justify-center text-white text-2xl font-bold"
      style={{ backgroundColor: colors[index % colors.length] }}
    >
      Slide {index + 1}
    </div>
  );
};

export const CreativeEffect1Story: Story = {
  render: () => (
    <div className="w-full max-w-md mx-auto bg-muted/10 border border-muted rounded-2xl p-16 flex items-center justify-center">
      <Carousel 
        effect={CarouselEffect.CREATIVE} 
        effectOptions={{
          prev: { shadow: true, translate: [0, 0, -400] },
          next: { translate: ['100%', 0, 0] },
        }}
        className="w-[320px]"
      >
        <CarouselContent>
          {Array.from({ length: 9 }).map((_, index) => (
            <CarouselItem key={index} className="basis-full">
              <CreativeSlideTemplate index={index} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  ),
};

export const CreativeEffect2Story: Story = {
  render: () => (
    <div className="w-full max-w-md mx-auto bg-muted/10 border border-muted rounded-2xl p-16 flex items-center justify-center">
      <Carousel 
        effect={CarouselEffect.CREATIVE} 
        effectOptions={{
          prev: { shadow: true, translate: ['-120%', 0, -500] },
          next: { shadow: true, translate: ['120%', 0, -500] },
        }}
        className="w-[320px]"
      >
        <CarouselContent>
          {Array.from({ length: 9 }).map((_, index) => (
            <CarouselItem key={index} className="basis-full">
              <CreativeSlideTemplate index={index} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  ),
};

export const CreativeEffect3Story: Story = {
  render: () => (
    <div className="w-full max-w-md mx-auto bg-muted/10 border border-muted rounded-2xl p-16 flex items-center justify-center">
      <Carousel 
        effect={CarouselEffect.CREATIVE} 
        effectOptions={{
          prev: { shadow: true, translate: ['-20%', 0, -1] },
          next: { translate: ['100%', 0, 0] },
        }}
        className="w-[320px]"
      >
        <CarouselContent>
          {Array.from({ length: 9 }).map((_, index) => (
            <CarouselItem key={index} className="basis-full">
              <CreativeSlideTemplate index={index} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  ),
};

export const CreativeEffect4Story: Story = {
  render: () => (
    <div className="w-full max-w-md mx-auto bg-muted/10 border border-muted rounded-2xl p-16 flex items-center justify-center">
      <Carousel 
        effect={CarouselEffect.CREATIVE} 
        effectOptions={{
          prev: { shadow: true, translate: [0, 0, -800], rotate: [180, 0, 0] },
          next: { shadow: true, translate: [0, 0, -800], rotate: [-180, 0, 0] },
        }}
        className="w-[320px]"
      >
        <CarouselContent>
          {Array.from({ length: 9 }).map((_, index) => (
            <CarouselItem key={index} className="basis-full">
              <CreativeSlideTemplate index={index} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  ),
};

export const CreativeEffect5Story: Story = {
  render: () => (
    <div className="w-full max-w-md mx-auto bg-muted/10 border border-muted rounded-2xl p-16 flex items-center justify-center">
      <Carousel 
        effect={CarouselEffect.CREATIVE} 
        effectOptions={{
          prev: { shadow: true, translate: ['-125%', 0, -800], rotate: [0, 0, -90] },
          next: { shadow: true, translate: ['125%', 0, -800], rotate: [0, 0, 90] },
        }}
        className="w-[320px]"
      >
        <CarouselContent>
          {Array.from({ length: 9 }).map((_, index) => (
            <CarouselItem key={index} className="basis-full">
              <CreativeSlideTemplate index={index} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  ),
};

export const CreativeEffect6Story: Story = {
  render: () => (
    <div className="w-full max-w-md mx-auto bg-muted/10 border border-muted rounded-2xl p-16 flex items-center justify-center">
      <Carousel 
        effect={CarouselEffect.CREATIVE} 
        effectOptions={{
          prev: { shadow: true, origin: 'left center', translate: ['-5%', 0, -200], rotate: [0, 100, 0] },
          next: { origin: 'right center', translate: ['5%', 0, -200], rotate: [0, -100, 0] },
        }}
        className="w-[320px]"
      >
        <CarouselContent>
          {Array.from({ length: 9 }).map((_, index) => (
            <CarouselItem key={index} className="basis-full">
              <CreativeSlideTemplate index={index} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  ),
};

export const WheelEffectStory: Story = {
  render: () => (
    <div className="w-full max-w-4xl mx-auto bg-muted/10 border border-muted rounded-2xl p-16 flex items-center justify-center h-[600px]">
      <Carousel 
        effect={CarouselEffect.WHEEL} 
        options={{ loop: true, dragFree: true }}
        className="w-full max-w-[200px]"
      >
        <CarouselContent className="h-[280px]">
          {[
            'https://i.pinimg.com/736x/9f/09/45/9f0945103fc6158cb16e1828a2665b5c.jpg',
            'https://i.pinimg.com/1200x/6e/4c/39/6e4c394783c731f261f295e7ffd1deed.jpg',
            'https://i.pinimg.com/1200x/1e/0c/1c/1e0c1c9c868bf07b4c27a275fb3087af.jpg',
            'https://i.pinimg.com/736x/30/91/09/3091098a15810ddbbd58d5e007bc7207.jpg',
            'https://i.pinimg.com/736x/07/cf/4a/07cf4a3a6f4144b4c7ac8e2ec5978dc1.jpg',
            'https://i.pinimg.com/736x/5d/bf/f2/5dbff2b4c0fdcb9815e989f0db386f95.jpg',
          ].map((src, index) => (
            <CarouselItem key={index} className="basis-full transform-gpu flex justify-center">
              <div className="w-[180px] h-[240px] rounded-2xl overflow-hidden shadow-lg border border-muted bg-background">
                <img
                  className="w-full h-full object-cover pointer-events-none"
                  src={src}
                  alt={`Card ${index + 1}`}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  ),
};


const MOVIES = [
  { title: "Doctor Strange", desc: "America Chavez and a version of Stephen Strange are chased by a demon...", img: "https://i.pinimg.com/1200x/1e/0c/1c/1e0c1c9c868bf07b4c27a275fb3087af.jpg" },
  { title: "Eternals", desc: "In 5000 BC, ten superpowered Eternals—Ajak, Sersi, Ikaris, Kingo...", img: "https://i.pinimg.com/736x/07/cf/4a/07cf4a3a6f4144b4c7ac8e2ec5978dc1.jpg" },
  { title: "Guardians Of The Galaxy", desc: "A group of intergalactic criminals must pull together to stop a fanatical...", img: "https://i.pinimg.com/1200x/6e/4c/39/6e4c394783c731f261f295e7ffd1deed.jpg" },
  { title: "Thor: Ragnarok", desc: "Imprisoned on the planet Sakaar, Thor must race against time to return to Asgard...", img: "https://i.pinimg.com/736x/9f/09/45/9f0945103fc6158cb16e1828a2665b5c.jpg" },
  { title: "The Suicide Squad", desc: "Supervillains Harley Quinn, Bloodsport, Peacemaker and a collection of nutty cons...", img: "https://i.pinimg.com/736x/5d/bf/f2/5dbff2b4c0fdcb9815e989f0db386f95.jpg" }
];

import { Card, CardWrapperEffect, CardVariant, CardHeader, CardTitle, CardDescription } from '@codezeniths/modules';

export const Interactive3DEffectStory: Story = {
  render: () => (
    <div className="w-full max-w-6xl mx-auto bg-[#1a1c23] border border-muted rounded-2xl p-16 flex items-center justify-center overflow-hidden h-[600px] relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 to-transparent pointer-events-none" />
      <Carousel 
        effect={CarouselEffect.INTERACTIVE3D} 
        options={{ loop: true, align: 'center' }}
        className="w-full z-10"
      >
        <CarouselContent className="h-[400px]">
          {MOVIES.map((movie, index) => (
            <CarouselItem key={index} className="basis-[600px] transform-gpu flex justify-center items-center">
              <div className="interactive-3d-wrapper will-change-transform transform-gpu flex justify-center items-center w-[600px] h-[340px] rounded-3xl">
                <Card 
                  className="w-full h-full bg-black/50 overflow-hidden cursor-pointer rounded-3xl relative border-0"
                  variant={CardVariant.DEFAULT}
                  effectConfig={{
                    wrapperEffect: CardWrapperEffect.INTERACTIVE_3D,
                    wrapperEffectProps: {
                        [CardWrapperEffect.INTERACTIVE_3D]: {
                            maxRotation: 15,
                            glareOpacity: 0.6,
                        },
                    },
                  }}
                >
                  <img
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                    src={movie.img}
                    alt={movie.title}
                    style={{ transform: "translateZ(0)" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-8 z-20 pointer-events-none" style={{ transform: "translateZ(30px)" }}>
                      <CardHeader className="p-0 border-0">
                          <CardTitle className="text-white text-3xl font-bold mb-3 tracking-wide drop-shadow-md">
                              {movie.title}
                          </CardTitle>
                          <CardDescription className="text-gray-200 text-sm line-clamp-3 leading-relaxed drop-shadow">
                              {movie.desc}
                          </CardDescription>
                      </CardHeader>
                  </div>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  ),
};

export const Interactive3DNativeHTMLStory: Story = {
  render: () => (
    <div className="w-full max-w-6xl mx-auto bg-[#111827] border border-gray-800 rounded-2xl p-16 flex items-center justify-center overflow-hidden h-[600px] relative">
      <Carousel 
        effect={CarouselEffect.INTERACTIVE3D} 
        options={{ loop: true, align: 'center' }}
        className="w-full z-10"
      >
        <CarouselContent className="h-[400px]">
          {MOVIES.map((movie, index) => (
            <CarouselItem key={index} className="basis-[600px] transform-gpu flex justify-center items-center">
              <div className="interactive-3d-wrapper will-change-transform transform-gpu flex justify-center items-center w-[600px] h-[340px] rounded-3xl">
                {/* Pure Native HTML Card Container without In-House Card component */}
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-gray-700 hover:border-indigo-500 rounded-3xl p-8 flex flex-col justify-between shadow-2xl transition-[border-color,box-shadow,color,background-color] duration-300 group cursor-pointer"
                  onClick={() => alert(`Card clicked for: ${movie.title}`)}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                        Native Slide #{index + 1}
                      </span>
                      <span className="text-gray-400 text-xs font-mono">
                        ID: {index + 100}
                      </span>
                    </div>

                    <h1 className="text-white text-3xl font-extrabold tracking-tight group-hover:text-indigo-400 transition-colors">
                      {movie.title}
                    </h1>

                    <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
                      {movie.desc}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-700/60">
                    <span className="text-xs text-gray-400">
                      Standard HTML Elements
                    </span>

                    <button
                      type="button"
                      className="px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all cursor-pointer shadow-md hover:scale-105"
                      onClick={(e) => {
                        e.stopPropagation();
                        alert(`Redirecting to: /modules/${movie.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`);
                      }}
                    >
                      Test Redirect Button →
                    </button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  ),
};

export const SpringEffectStory: Story = {
  render: () => (
    <div className="w-full max-w-[1920px] mx-auto bg-[#fdf9e8] p-16 flex items-center justify-center overflow-hidden h-[866px] relative">
      <Carousel 
        effect={CarouselEffect.SPRING} 
        options={{ loop: true, align: 'start' }}
        className="w-full z-10 pl-[60px]"
      >
        <CarouselContent className="h-[400px]">
          {Array.from({ length: 6 }).map((_, index) => (
            <CarouselItem key={index} className="basis-[466px] transform-gpu flex justify-start items-center">
              <div className="w-[406px] h-[400px] rounded-3xl overflow-hidden shadow-md bg-white border border-black/5">
                <img
                  className="w-full h-full object-cover pointer-events-none"
                  src={`https://picsum.photos/600/600?v=${index + 10}`}
                  alt={`Slide ${index + 1}`}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  ),
};
