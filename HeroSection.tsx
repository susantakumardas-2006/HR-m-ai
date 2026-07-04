import React, { useState } from "react";
import LoginBox from "./LoginBox";
import SignUpBox from "./SignUpBox";

export default function HeroSection() {
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-end bg-hero-bg overflow-hidden"
    >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Glowing animated aurora orbs */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[600px] opacity-60">
            <div className="absolute top-0 -left-4 w-96 h-96 bg-primary/40 rounded-full mix-blend-screen filter blur-[100px] opacity-70 animate-blob" />
            <div className="absolute top-0 -right-4 w-96 h-96 bg-blue-500/40 rounded-full mix-blend-screen filter blur-[100px] opacity-70 animate-blob" style={{ animationDelay: "2s" }} />
            <div className="absolute -bottom-8 left-20 w-96 h-96 bg-violet-500/40 rounded-full mix-blend-screen filter blur-[100px] opacity-70 animate-blob" style={{ animationDelay: "4s" }} />
            <div className="absolute bottom-10 right-20 w-[40rem] h-[40rem] bg-indigo-500/20 rounded-full mix-blend-screen filter blur-[120px] opacity-50 animate-spin-slow" />
          </div>
          {/* Noise texture overlay for premium feel */}
          <div 
            className="absolute inset-0 opacity-[0.015]" 
            style={{ 
              backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")'
            }} 
          />
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
              <button
                onClick={() => setShowSignUp(true)}
                className="pointer-events-auto bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.97] transition-all h-11 rounded-lg px-8 text-sm font-bold uppercase tracking-widest"
              >
                Get Started
              </button>
              <button className="pointer-events-auto border border-foreground/20 text-foreground hover:bg-foreground/10 active:scale-[0.97] transition-all h-11 rounded-lg px-8 text-sm font-bold uppercase tracking-widest">
                Learn More
              </button>
            </div>
          </div>
          {/* Right auth box */}
          <div
            className="opacity-0 animate-fade-up will-change-transform pointer-events-auto"
            style={{ animationDelay: "0.5s" }}
          >
            <div className="relative">
              {showSignUp ? (
                <div className="animate-fade-up">
                  <SignUpBox onSwitch={() => setShowSignUp(false)} />
                </div>
              ) : (
                <div className="animate-fade-up">
                  <LoginBox onSwitch={() => setShowSignUp(true)} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
