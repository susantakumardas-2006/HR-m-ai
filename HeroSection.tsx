import React, { Suspense } from "react";
import LoginBox from "./LoginBox";
const Spline = React.lazy(() => import("@splinetool/react-spline"));
export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-end bg-hero-bg overflow-hidden"
    >
      {/* Spline 3D Background */}
      <div className="absolute inset-0">
        <Suspense
          fallback={<div className="absolute inset-0 bg-hero-bg" />}
        >
          <Spline
            scene="https://prod.spline.design/Slk6b8kz3LRlKiyk/scene.splinecode"
            className="w-full h-full"
          />
        </Suspense>
      </div>
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/30 z-[1] pointer-events-none" />
      {/* Content container */}
      <div className="relative z-10 pointer-events-none w-full px-6 md:px-10 pb-10 md:pb-16 pt-32">
        <div className="flex flex-col lg:flex-row items-end lg:items-end justify-between gap-10 w-full max-w-7xl mx-auto">
          {/* Left text content */}
          <div className="max-w-2xl">
            {/* Heading */}
            <h1
              className="opacity-0 animate-fade-up text-[clamp(3rem,8vw,6rem)] font-bold leading-[1.05] tracking-[-0.05em] text-foreground mb-2 md:mb-4 uppercase"
              style={{ animationDelay: "0.2s" }}
            >
              SENTINEL<span className="text-primary"> AI</span>
            </h1>
            {/* Subheading */}
            <p
              className="opacity-0 animate-fade-up text-foreground/80 text-[clamp(1.125rem,2.5vw,1.875rem)] font-light mb-3 md:mb-6"
              style={{ animationDelay: "0.4s" }}
            >
              We implement life correctly.
            </p>
            {/* Description */}
            <p
              className="opacity-0 animate-fade-up text-muted-foreground text-[clamp(0.875rem,1.5vw,1.25rem)] font-light mb-4 md:mb-8"
              style={{ animationDelay: "0.55s" }}
            >
              Work with team. Build with team.
            </p>
            {/* CTA buttons */}
            <div
              className="opacity-0 animate-fade-up flex flex-wrap gap-3 font-bold"
              style={{ animationDelay: "0.7s" }}
            >
              <button className="pointer-events-auto bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.97] transition-all h-11 rounded-lg px-8 text-sm font-bold uppercase tracking-widest">
                Get Started
              </button>
              <button className="pointer-events-auto border border-foreground/20 text-foreground hover:bg-foreground/10 active:scale-[0.97] transition-all h-11 rounded-lg px-8 text-sm font-bold uppercase tracking-widest">
                Learn More
              </button>
            </div>
          </div>
          {/* Right login box */}
          <div
            className="opacity-0 animate-fade-up"
            style={{ animationDelay: "0.5s" }}
          >
            <LoginBox />
          </div>
        </div>
      </div>
    </section>
  );
}
