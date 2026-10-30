import { useState, useEffect } from 'react';
import { toggleAudioMute, getAudioMuteState, playClickSound, playHoverSound } from '../utils/audio';

export default function Navbar({ onGlitchTrigger }) {
  const [isMuted, setIsMuted] = useState(() => getAudioMuteState());
  const [ping, setPing] = useState(14);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Random realistic ping jitter
    const interval = setInterval(() => {
      setPing(Math.floor(12 + Math.random() * 8));
    }, 4000);

    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleMuteToggle = () => {
    const muted = toggleAudioMute();
    setIsMuted(muted);
    if (!muted) playClickSound();
  };

  const scrollTo = (id) => {
    playClickSound();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 'var(--header-height)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        background: scrolled ? 'rgba(7, 8, 13, 0.88)' : 'rgba(7, 8, 13, 0.5)',
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${scrolled ? 'rgba(0, 240, 255, 0.25)' : 'rgba(255, 255, 255, 0.06)'}`,
        transition: 'all 0.3s ease',
      }}
    >
      {/* Brand Identity */}
      <div
        onClick={() => scrollTo('hero')}
        onMouseEnter={playHoverSound}
        data-cursor="TOP"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer',
        }}
      >
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '4px',
            background: 'linear-gradient(135deg, var(--neon-cyan), var(--neon-lime))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 12px rgba(0, 240, 255, 0.5)',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5">
            <polyline points="4 17 10 11 4 5" />
            <line x1="12" y1="19" x2="20" y2="19" />
          </svg>
        </div>
        <div>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 900,
              fontSize: '1.15rem',
              letterSpacing: '0.08em',
              background: 'linear-gradient(90deg, #fff, var(--neon-cyan))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            INTERNET<span style={{ color: 'var(--neon-lime)', WebkitTextFillColor: 'var(--neon-lime)' }}>.EXE</span>
          </span>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              color: 'var(--neon-lime)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'var(--neon-lime)',
                display: 'inline-block',
                boxShadow: '0 0 6px var(--neon-lime)',
              }}
            />
            ONLINE // V.90 56K
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
        }}
        className="nav-links-desktop"
      >
        <button
          onClick={() => scrollTo('windows')}
          onMouseEnter={playHoverSound}
          className="nav-link-btn"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.82rem',
            cursor: 'pointer',
            padding: '6px 10px',
            borderRadius: '4px',
            transition: 'color 0.2s ease',
          }}
        >
          [ 01. DESKTOP ]
        </button>

        <button
          onClick={() => scrollTo('chronology')}
          onMouseEnter={playHoverSound}
          className="nav-link-btn"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.82rem',
            cursor: 'pointer',
            padding: '6px 10px',
            borderRadius: '4px',
            transition: 'color 0.2s ease',
          }}
        >
          [ 02. STRATUM ]
        </button>

        <button
          onClick={() => scrollTo('matrix-chaos')}
          onMouseEnter={playHoverSound}
          className="nav-link-btn"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.82rem',
            cursor: 'pointer',
            padding: '6px 10px',
            borderRadius: '4px',
            transition: 'color 0.2s ease',
          }}
        >
          [ 03. CHAOS VOID ]
        </button>

        <button
          onClick={() => scrollTo('guestbook')}
          onMouseEnter={playHoverSound}
          className="nav-link-btn"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.82rem',
            cursor: 'pointer',
            padding: '6px 10px',
            borderRadius: '4px',
            transition: 'color 0.2s ease',
          }}
        >
          [ 04. GUESTBOOK ]
        </button>
      </nav>

      {/* Right Controls: Telemetry, Audio Synthesizer Toggle & Warp Trigger */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Network ping indicator */}
        <div
          className="ping-indicator"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            color: 'var(--text-muted)',
            padding: '4px 8px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '4px',
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12.55a11 11 0 0 1 14.08 0" />
            <path d="M1.42 9a16 16 0 0 1 21.16 0" />
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
            <line x1="12" y1="20" x2="12.01" y2="20" strokeWidth="3" />
          </svg>
          <span>{ping}ms</span>
        </div>

        {/* Procedural Audio Toggle */}
        <button
          onClick={handleMuteToggle}
          onMouseEnter={playHoverSound}
          data-cursor="AUDIO"
          title={isMuted ? 'Unmute Audio Engine' : 'Mute Audio Engine'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 12px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            background: isMuted ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 240, 255, 0.12)',
            border: `1px solid ${isMuted ? 'rgba(255, 255, 255, 0.1)' : 'var(--neon-cyan)'}`,
            color: isMuted ? 'var(--text-muted)' : 'var(--neon-cyan)',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          {/* Animated Waveform indicator */}
          {!isMuted ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px', height: '12px' }}>
              <span className="wave-bar wave-1" />
              <span className="wave-bar wave-2" />
              <span className="wave-bar wave-3" />
            </div>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="1" y1="1" x2="23" y2="23" />
              <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
            </svg>
          )}
          <span>{isMuted ? 'SFX: OFF' : 'SFX: SYNTH'}</span>
        </button>

        {/* Glitch Reboot Button */}
        <button
          onClick={() => {
            playClickSound();
            if (onGlitchTrigger) onGlitchTrigger();
          }}
          onMouseEnter={playHoverSound}
          data-cursor="WARP"
          className="cyber-btn cyber-btn-pink"
          style={{
            padding: '6px 14px',
            fontSize: '0.75rem',
            letterSpacing: '0.08em',
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          <span>GLITCH.EXE</span>
        </button>
      </div>

      <style>{`
        .wave-bar {
          width: 2px;
          height: 100%;
          background: var(--neon-cyan);
          border-radius: 1px;
          animation: waveJump 0.8s ease-in-out infinite alternate;
        }
        .wave-1 { animation-delay: 0s; height: 10px; }
        .wave-2 { animation-delay: 0.25s; height: 14px; }
        .wave-3 { animation-delay: 0.5s; height: 8px; }

        @keyframes waveJump {
          0% { transform: scaleY(0.3); }
          100% { transform: scaleY(1); }
        }

        .nav-link-btn:hover {
          color: var(--neon-lime) !important;
          background: rgba(57, 255, 20, 0.08) !important;
        }

        @media (max-width: 860px) {
          .nav-links-desktop, .ping-indicator {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
