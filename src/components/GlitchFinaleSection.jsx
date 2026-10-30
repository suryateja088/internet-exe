import { useState, useRef } from 'react';
import gsap from 'gsap';
import { playClickSound, playHoverSound, playWarpGlitchSound, playSuccessChime } from '../utils/audio';

export default function GlitchFinaleSection({ onGlitchTrigger }) {
  const [isOverloading, setIsOverloading] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const buttonRef = useRef(null);

  const handleTriggerOverload = () => {
    if (isOverloading) return;
    setIsOverloading(true);

    // Audio synthesizer pitch riser and bass impact
    playWarpGlitchSound();

    // Trigger parent visual glitch
    if (onGlitchTrigger) onGlitchTrigger();

    // GSAP button shockwave
    gsap.to(buttonRef.current, {
      scale: 1.15,
      filter: 'brightness(3) contrast(2)',
      duration: 0.3,
      yoyo: true,
      repeat: 3,
      onComplete: () => {
        gsap.to(buttonRef.current, { scale: 1, filter: 'brightness(1) contrast(1)', duration: 0.2 });
      },
    });

    // After 2.4s of glitch spectacle, open celebration modal
    setTimeout(() => {
      setIsOverloading(false);
      setShowCelebration(true);
      playSuccessChime();
    }, 2400);
  };

  const restartJourney = () => {
    playClickSound();
    setShowCelebration(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section
      id="singularity"
      style={{
        position: 'relative',
        minHeight: '75vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '100px 20px 80px',
        zIndex: 2,
        overflow: 'hidden',
      }}
    >
      {/* Background Radial Glow */}
      <div
        style={{
          position: 'absolute',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 0, 127, 0.15) 0%, rgba(0, 240, 255, 0.1) 40%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />

      <div className="container" style={{ textAlign: 'center', position: 'relative' }}>
        <div className="cyber-badge cyber-badge-pink" style={{ marginBottom: '18px' }}>
          <span>◆</span> CRITICAL THRESHOLD REACHED
        </div>

        <h2
          className="glitch-text"
          data-text="SYSTEM OVERLOAD"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.4rem, 6vw, 4.5rem)',
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            margin: '0 0 16px',
            background: 'linear-gradient(180deg, #fff 20%, var(--neon-pink) 70%, var(--neon-orange) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          SYSTEM OVERLOAD
        </h2>

        <p
          style={{
            fontFamily: 'var(--font-tech)',
            fontSize: 'clamp(0.95rem, 1.8vw, 1.2rem)',
            color: 'var(--text-secondary)',
            maxWidth: '640px',
            margin: '0 auto 40px',
            lineHeight: 1.6,
          }}
        >
          You have reached the edge of the digital stratum. Ready to destabilize the mainframe
          and release three decades of compressed cyberspace static?
        </p>

        {/* The Giant Overload Button */}
        <div style={{ position: 'relative', display: 'inline-block' }}>
          {/* Pulsing neon rings */}
          <div
            style={{
              position: 'absolute',
              inset: '-18px',
              borderRadius: '8px',
              border: '1.5px dashed var(--neon-pink)',
              opacity: isOverloading ? 1 : 0.45,
              animation: 'spinClockwise 12s linear infinite',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: '-28px',
              borderRadius: '12px',
              border: '1px solid var(--neon-cyan)',
              opacity: isOverloading ? 0.9 : 0.3,
              animation: 'spinCounter 16s linear infinite',
              pointerEvents: 'none',
            }}
          />

          <button
            ref={buttonRef}
            onClick={handleTriggerOverload}
            onMouseEnter={playHoverSound}
            data-cursor="CRITICAL"
            className="cyber-btn cyber-btn-pink"
            disabled={isOverloading}
            style={{
              padding: '22px 48px',
              fontSize: 'clamp(1rem, 2.2vw, 1.3rem)',
              letterSpacing: '0.12em',
              borderRadius: '6px',
              boxShadow: isOverloading
                ? '0 0 50px rgba(255, 0, 127, 0.9), inset 0 0 20px #fff'
                : '0 0 35px rgba(255, 0, 127, 0.5)',
              transform: isOverloading ? 'scale(1.04)' : 'none',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            <span>
              {isOverloading ? 'DECOMPRESSING MAINFRAME...' : '[ INITIATE SYSTEM OVERLOAD ]'}
            </span>
          </button>
        </div>

        {/* Console Readout */}
        <div
          style={{
            marginTop: '32px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.74rem',
            color: isOverloading ? 'var(--neon-pink)' : 'var(--text-muted)',
            letterSpacing: '0.06em',
          }}
        >
          CORE STATUS: {isOverloading ? 'VOLTAGE SPIKE AT 1.21 GW // DUMPING MEMORY HEAP' : 'STANDBY // READY FOR TRIGGER'}
        </div>
      </div>

      {/* Celebration Modal after Glitch */}
      {showCelebration && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            background: 'rgba(5, 6, 10, 0.92)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            animation: 'fadeIn 0.3s ease-out',
          }}
        >
          <div
            className="retro-window"
            style={{
              width: '100%',
              maxWidth: '560px',
              borderColor: 'var(--neon-cyan)',
              boxShadow: '0 0 50px rgba(0, 240, 255, 0.4), 0 30px 80px rgba(0, 0, 0, 0.9)',
              textAlign: 'center',
              animation: 'scaleIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <div className="retro-window-header">
              <div className="window-dots">
                <span className="window-dot close" onClick={() => setShowCelebration(false)} />
                <span className="window-dot minimize" />
                <span className="window-dot maximize" />
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.74rem',
                  color: 'var(--neon-cyan)',
                  letterSpacing: '0.06em',
                  fontWeight: 700,
                }}
              >
                REBOOT_REPORT // SINGULARITY_REACHED
              </span>
              <span style={{ fontSize: '0.65rem', color: 'var(--neon-lime)' }}>100% OK</span>
            </div>

            <div style={{ padding: '32px 24px' }}>
              <div style={{ fontSize: '3.2rem', marginBottom: '12px' }}>⚡</div>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.8rem',
                  margin: '0 0 10px',
                  color: '#fff',
                }}
              >
                SYSTEM REBOOT COMPLETE!
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                  marginBottom: '24px',
                }}
              >
                You have successfully traversed the complete stratum of Internet.exe.
                The cybernetic buffer has been refreshed and your coordinates logged.
              </p>

              {/* Stats Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '10px',
                  marginBottom: '24px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                }}
              >
                <div style={{ background: 'rgba(255,255,255,0.04)', padding: '10px', borderRadius: '4px' }}>
                  <div style={{ color: 'var(--text-muted)' }}>YEARS SURFED</div>
                  <div style={{ color: 'var(--neon-lime)', fontWeight: 'bold', fontSize: '1rem', marginTop: '4px' }}>
                    35 YRS
                  </div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.04)', padding: '10px', borderRadius: '4px' }}>
                  <div style={{ color: 'var(--text-muted)' }}>BAUD RATE</div>
                  <div style={{ color: 'var(--neon-cyan)', fontWeight: 'bold', fontSize: '1rem', marginTop: '4px' }}>
                    56.6K
                  </div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.04)', padding: '10px', borderRadius: '4px' }}>
                  <div style={{ color: 'var(--text-muted)' }}>STATUS</div>
                  <div style={{ color: 'var(--neon-pink)', fontWeight: 'bold', fontSize: '1rem', marginTop: '4px' }}>
                    ASCENDED
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button
                  onClick={restartJourney}
                  onMouseEnter={playHoverSound}
                  data-cursor="TOP"
                  className="cyber-btn cyber-btn-lime"
                  style={{ flex: 1, padding: '12px', fontSize: '0.84rem' }}
                >
                  RETURN TO CYBER-HERO ↑
                </button>
                <button
                  onClick={() => setShowCelebration(false)}
                  onMouseEnter={playHoverSound}
                  className="cyber-btn cyber-btn-outline"
                  style={{ padding: '12px 20px', fontSize: '0.84rem' }}
                >
                  DISMISS
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>
    </section>
  );
}
