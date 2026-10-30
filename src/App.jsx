import { useState, useCallback } from 'react';
import Navbar from './components/Navbar';
import CustomCursor from './components/CustomCursor';
import StarfieldCanvas from './components/StarfieldCanvas';
import HeroSection from './components/HeroSection';
import FloatingWindowManager from './components/FloatingWindowManager';
import ChronoStratum from './components/ChronoStratum';
import MatrixChaosSection from './components/MatrixChaosSection';
import GuestbookSection from './components/GuestbookSection';
import GlitchFinaleSection from './components/GlitchFinaleSection';
import Footer from './components/Footer';

export default function App() {
  const [isGlitching, setIsGlitching] = useState(false);
  const [isWarping, setIsWarping] = useState(false);

  // Trigger full-screen visual glitch shockwave
  const triggerGlitchEffect = useCallback(() => {
    setIsGlitching(true);
    setIsWarping(true);

    setTimeout(() => {
      setIsGlitching(false);
    }, 1800);

    setTimeout(() => {
      setIsWarping(false);
    }, 2800);
  }, []);

  const openDialupWindow = useCallback(() => {
    const dialupEl = document.getElementById('windows');
    if (dialupEl) {
      dialupEl.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <div
      className={`app-root ${isGlitching ? 'glitch-active' : ''}`}
      style={{
        position: 'relative',
        minHeight: '100vh',
        backgroundColor: 'var(--bg-dark)',
        color: 'var(--text-primary)',
        overflowX: 'hidden',
      }}
    >
      {/* Precision Trailing Cyber Cursor */}
      <CustomCursor />

      {/* Moving Parallax Starfield & Cyber Dust Canvas */}
      <StarfieldCanvas isWarping={isWarping} />

      {/* Retro CRT Scanlines Texture Overlay */}
      <div className="scanlines-overlay" aria-hidden="true" />

      {/* Fullscreen Glitch Flash Filter when Triggered */}
      {isGlitching && (
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9995,
            pointerEvents: 'none',
            background:
              'radial-gradient(circle, rgba(255, 0, 127, 0.3) 0%, rgba(0, 240, 255, 0.25) 50%, rgba(57, 255, 20, 0.2) 100%)',
            mixBlendMode: 'color-dodge',
            animation: 'flashPulse 0.12s infinite alternate',
          }}
        />
      )}

      {/* Top Retro-Futuristic Status Bar */}
      <Navbar onGlitchTrigger={triggerGlitchEffect} />

      {/* 01. Hero Experience */}
      <main>
        <HeroSection
          onGlitchTrigger={triggerGlitchEffect}
          onOpenDialup={openDialupWindow}
        />

        {/* 02. Interactive Floating Retro Windows Desktop */}
        <FloatingWindowManager />

        {/* 03. Scroll-Triggered Cyber Archaeology Stratum */}
        <ChronoStratum />

        {/* 04. The Chaotic Digital Universe & Entropy Engine */}
        <MatrixChaosSection />

        {/* 05. Digital Guestbook & Time Capsule */}
        <GuestbookSection />

        {/* 06. Grand Finale System Overload / Glitch Trigger */}
        <GlitchFinaleSection onGlitchTrigger={triggerGlitchEffect} />
      </main>

      {/* 07. Retro Webring & Netscape Footer */}
      <Footer />

      <style>{`
        @keyframes flashPulse {
          0% { opacity: 0.3; }
          100% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
