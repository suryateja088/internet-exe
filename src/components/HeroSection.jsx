import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { playClickSound, playHoverSound, playSuccessChime } from '../utils/audio';

function getIsoTime() {
  return new Date().toISOString();
}

export default function HeroSection({ onGlitchTrigger, onOpenDialup }) {
  const heroRef = useRef(null);
  const portalRef = useRef(null);
  const titleRef = useRef(null);
  const terminalRef = useRef(null);
  const badgeRef = useRef(null);
  const ctaRef = useRef(null);

  // Terminal state
  const [terminalHistory, setTerminalHistory] = useState([
    { type: 'sys', text: 'INIT: BIOS_REV_1996 // MEMORY CHECK 640K OK' },
    { type: 'sys', text: 'CONNECTING TO ARPANET -> NSFNET -> THE HYPERVOID...' },
    { type: 'success', text: 'STATUS: CYBERSPACE LINK ESTABLISHED [56,600 BAUD]' },
    { type: 'info', text: 'SYSTEM READY. Type a directive or click quick commands below.' }
  ]);
  const [inputVal, setInputVal] = useState('');
  const terminalBodyRef = useRef(null);

  // Staggered GSAP entrance animation on mount
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        badgeRef.current,
        { opacity: 0, y: -20, filter: 'blur(10px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, delay: 0.2 }
      )
      .fromTo(
        titleRef.current,
        { opacity: 0, scale: 0.88, filter: 'blur(16px)' },
        { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.1, ease: 'expo.out' },
        '-=0.5'
      )
      .fromTo(
        portalRef.current,
        { opacity: 0, scale: 0.6, rotation: -45 },
        { opacity: 1, scale: 1, rotation: 0, duration: 1.2, ease: 'elastic.out(1, 0.75)' },
        '-=0.8'
      )
      .fromTo(
        terminalRef.current,
        { opacity: 0, y: 35, filter: 'blur(8px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9 },
        '-=0.6'
      )
      .fromTo(
        ctaRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7 },
        '-=0.5'
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Mouse tilt effect on the Interactive Glowing Orb/Portal
  useEffect(() => {
    const portal = portalRef.current;
    if (!portal) return;

    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;
    let animId;

    const handleMouseMove = (e) => {
      const rect = portal.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) / (window.innerWidth / 2);
      const deltaY = (e.clientY - centerY) / (window.innerHeight / 2);

      targetRotX = -deltaY * 22; // In degrees
      targetRotY = deltaX * 22;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const loop = () => {
      currentRotX += (targetRotX - currentRotX) * 0.08;
      currentRotY += (targetRotY - currentRotY) * 0.08;

      if (portal) {
        portal.style.transform = `perspective(800px) rotateX(${currentRotX}deg) rotateY(${currentRotY}deg)`;
      }
      animId = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Auto-scroll terminal log
  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [terminalHistory]);

  const executeCommand = (rawCmd) => {
    const cmd = rawCmd.trim().toLowerCase();
    playClickSound();

    const timestamp = getIsoTime();
    const newHistory = [...terminalHistory, { type: 'user', text: `> ${rawCmd}` }];

    switch (cmd) {
      case 'help':
        newHistory.push({
          type: 'info',
          text: 'AVAILABLE DIRECTIVES:\n- dial: Initialize 56k dial-up connection\n- glitch: Trigger hyper-drive glitch shockwave\n- matrix: Jump to Chaotic Digital Matrix\n- stats: Telemetry and cyberspace diagnostics\n- reboot: Hard reset interface\n- clear: Clear terminal buffer\n- date: Cyberspace time continuum'
        });
        break;
      case 'dial':
        newHistory.push({ type: 'success', text: 'OPENING DIALUP.SYS AUDIO TRANSCEIVER...' });
        if (onOpenDialup) onOpenDialup();
        break;
      case 'glitch':
        newHistory.push({ type: 'warn', text: 'INITIATING SYSTEM WARP SHOCKWAVE!' });
        if (onGlitchTrigger) onGlitchTrigger();
        break;
      case 'matrix':
        newHistory.push({ type: 'info', text: 'WARPING TO THE CHAOS VOID...' });
        document.getElementById('matrix-chaos')?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'stats':
        newHistory.push({
          type: 'info',
          text: `SYS_DIAG:\n- VIEWPORT: ${window.innerWidth}x${window.innerHeight}px\n- PROTOCOL: HTTPS/2 + WebAudio + GSAP\n- FRAME_RATE: 60 FPS\n- STATUS: NOMINAL (ZERO CRITICAL FAULTS)`
        });
        break;
      case 'clear':
        setTerminalHistory([{ type: 'sys', text: 'TERMINAL BUFFER PURGED.' }]);
        setInputVal('');
        return;
      case 'reboot':
        newHistory.push({ type: 'warn', text: 'REBOOTING SYSTEM...' });
        playSuccessChime();
        if (onGlitchTrigger) onGlitchTrigger();
        break;
      case 'date':
        newHistory.push({ type: 'info', text: `LOCAL MATRIX TIME: ${timestamp}` });
        break;
      default:
        newHistory.push({
          type: 'error',
          text: `COMMAND NOT RECOGNIZED: "${cmd}". Type "help" for a list of valid directives.`
        });
    }

    setTerminalHistory(newHistory);
    setInputVal('');
  };

  const handleInputSubmit = (e) => {
    e.preventDefault();
    if (inputVal.trim()) {
      executeCommand(inputVal);
    }
  };

  // Disruption burst on portal click
  const handlePortalClick = () => {
    playSuccessChime();
    gsap.fromTo(
      portalRef.current,
      { scale: 0.9, filter: 'brightness(2.2) hue-rotate(180deg)' },
      { scale: 1, filter: 'brightness(1) hue-rotate(0deg)', duration: 0.8, ease: 'elastic.out(1, 0.4)' }
    );
  };

  const scrollToWindows = () => {
    playClickSound();
    document.getElementById('windows')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      ref={heroRef}
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '100px 20px 60px',
        overflow: 'hidden',
        zIndex: 1,
      }}
    >
      {/* Background Cyber Grid Floor */}
      <div className="cyber-grid-plane" aria-hidden="true" />

      {/* Hero Badge */}
      <div ref={badgeRef} style={{ marginBottom: '20px' }}>
        <div className="cyber-badge cyber-badge-cyan">
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: 'var(--neon-cyan)',
              boxShadow: '0 0 8px var(--neon-cyan)',
            }}
          />
          INTERNET ARCHAEOLOGY EXPEDITION // 1991 — 2026+
        </div>
      </div>

      {/* Oversized "INTERNET.EXE" Kinetic Typography */}
      <div
        ref={titleRef}
        style={{
          position: 'relative',
          textAlign: 'center',
          marginBottom: '28px',
          userSelect: 'none',
        }}
      >
        <h1
          className="glitch-text"
          data-text="INTERNET.EXE"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(3.2rem, 11vw, 8.5rem)',
            fontWeight: 900,
            lineHeight: 0.92,
            letterSpacing: '-0.04em',
            textTransform: 'uppercase',
            margin: 0,
            background: 'linear-gradient(180deg, #ffffff 30%, #a4b3d6 75%, var(--neon-cyan) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 35px rgba(0, 240, 255, 0.35))',
          }}
        >
          INTERNET.EXE
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-tech)',
            fontSize: 'clamp(1rem, 2.2vw, 1.4rem)',
            color: 'var(--text-secondary)',
            marginTop: '16px',
            maxWidth: '680px',
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: 1.5,
          }}
        >
          A retro-futuristic interactive voyage through three decades of cyberspace,
          from 56k dial-up static to autonomous digital dreamscapes.
        </p>
      </div>

      {/* Main Interactive Stage: Portal + Terminal */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(280px, 420px) minmax(320px, 580px)',
          gap: '36px',
          alignItems: 'center',
          width: '100%',
          maxWidth: '1060px',
          marginBottom: '40px',
        }}
        className="hero-grid"
      >
        {/* Interactive Glowing 3D Portal / Orb */}
        <div
          ref={portalRef}
          onClick={handlePortalClick}
          onMouseEnter={playHoverSound}
          data-cursor="PORTAL"
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '380px',
            aspectRatio: '1 / 1',
            margin: '0 auto',
            cursor: 'pointer',
            transition: 'transform 0.1s ease-out',
            transformStyle: 'preserve-3d',
          }}
          title="Click to disrupt cyber portal"
        >
          {/* Outer Pulsing Glow */}
          <div
            style={{
              position: 'absolute',
              inset: '-15%',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0, 240, 255, 0.25) 0%, rgba(57, 255, 20, 0.15) 40%, transparent 70%)',
              filter: 'blur(30px)',
              pointerEvents: 'none',
              animation: 'portalPulse 3s ease-in-out infinite alternate',
            }}
          />

          {/* Layered SVG Orbit Rings */}
          <svg
            viewBox="0 0 300 300"
            style={{
              width: '100%',
              height: '100%',
              filter: 'drop-shadow(0 0 20px rgba(0, 240, 255, 0.45))',
            }}
          >
            {/* Outer dotted orbit */}
            <circle
              cx="150"
              cy="150"
              r="135"
              fill="none"
              stroke="var(--neon-cyan)"
              strokeWidth="1.5"
              strokeDasharray="6 8"
              opacity="0.6"
              style={{ animation: 'spinClockwise 25s linear infinite', transformOrigin: 'center' }}
            />

            {/* Middle counter-rotating segment */}
            <circle
              cx="150"
              cy="150"
              r="110"
              fill="none"
              stroke="var(--neon-lime)"
              strokeWidth="2"
              strokeDasharray="40 25 10 25"
              opacity="0.75"
              style={{ animation: 'spinCounter 18s linear infinite', transformOrigin: 'center' }}
            />

            {/* Inner neon pink ring */}
            <circle
              cx="150"
              cy="150"
              r="85"
              fill="none"
              stroke="var(--neon-pink)"
              strokeWidth="1.5"
              strokeDasharray="20 15 5 15"
              opacity="0.8"
              style={{ animation: 'spinClockwise 12s linear infinite', transformOrigin: 'center' }}
            />

            {/* Center Plasma Core */}
            <defs>
              <radialGradient id="portalCoreGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="25%" stopColor="#00f0ff" />
                <stop offset="65%" stopColor="#ff007f" />
                <stop offset="100%" stopColor="#0b0c14" stopOpacity="0.9" />
              </radialGradient>
              <radialGradient id="portalGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#39ff14" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
              </radialGradient>
            </defs>

            <circle cx="150" cy="150" r="60" fill="url(#portalCoreGrad)" />
            <circle cx="150" cy="150" r="45" fill="url(#portalGlow)" style={{ mixBlendMode: 'screen' }} />

            {/* Cyber Coordinates Crosshair */}
            <line x1="150" y1="20" x2="150" y2="40" stroke="#00f0ff" strokeWidth="2" />
            <line x1="150" y1="260" x2="150" y2="280" stroke="#00f0ff" strokeWidth="2" />
            <line x1="20" y1="150" x2="40" y2="150" stroke="#00f0ff" strokeWidth="2" />
            <line x1="260" y1="150" x2="280" y2="150" stroke="#00f0ff" strokeWidth="2" />

            {/* Digital Glyphs */}
            <text x="150" y="154" fill="#ffffff" fontFamily="monospace" fontSize="11" fontWeight="bold" textAnchor="middle">
              PORTAL_ONLINE
            </text>
          </svg>

          {/* Interactive Hint */}
          <div
            style={{
              position: 'absolute',
              bottom: '-28px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              color: 'var(--neon-cyan)',
              whiteSpace: 'nowrap',
              letterSpacing: '0.06em',
            }}
          >
            [ CLICK TO HARMONIZE ]
          </div>
        </div>

        {/* Animated Cyber Terminal */}
        <div
          ref={terminalRef}
          className="retro-window"
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '380px',
            backgroundColor: 'rgba(9, 11, 18, 0.92)',
          }}
        >
          {/* Window Header */}
          <div className="retro-window-header">
            <div className="window-dots">
              <span className="window-dot close" />
              <span className="window-dot minimize" />
              <span className="window-dot maximize" />
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--neon-lime)',
                letterSpacing: '0.05em',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="4 17 10 11 4 5" />
                <line x1="12" y1="19" x2="20" y2="19" />
              </svg>
              TERMINAL_SESSION // TTY_01
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
              ANSI-80
            </div>
          </div>

          {/* Terminal Output Log */}
          <div
            ref={terminalBodyRef}
            style={{
              flex: 1,
              padding: '16px',
              overflowY: 'auto',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.82rem',
              lineHeight: 1.6,
              color: '#d0daf0',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            {terminalHistory.map((item, idx) => {
              let color = '#d0daf0';
              if (item.type === 'sys') color = 'var(--text-muted)';
              if (item.type === 'success') color = 'var(--neon-lime)';
              if (item.type === 'warn') color = 'var(--neon-orange)';
              if (item.type === 'error') color = 'var(--neon-pink)';
              if (item.type === 'user') color = 'var(--neon-cyan)';

              return (
                <div key={idx} style={{ color, whiteSpace: 'pre-wrap' }}>
                  {item.text}
                </div>
              );
            })}
          </div>

          {/* Quick Command Chips */}
          <div
            style={{
              padding: '8px 14px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
              borderTop: '1px solid rgba(255, 255, 255, 0.05)',
              background: 'rgba(0, 0, 0, 0.2)',
            }}
          >
            {['help', 'dial', 'glitch', 'matrix', 'stats', 'clear'].map((cmd) => (
              <button
                key={cmd}
                onClick={() => executeCommand(cmd)}
                onMouseEnter={playHoverSound}
                data-cursor="RUN"
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'var(--neon-cyan)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  padding: '3px 8px',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                ${cmd}
              </button>
            ))}
          </div>

          {/* Interactive Command Input Form */}
          <form
            onSubmit={handleInputSubmit}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '10px 14px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              background: 'rgba(0, 0, 0, 0.4)',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                color: 'var(--neon-lime)',
                marginRight: '8px',
                fontWeight: 700,
              }}
            >
              guest@internet.exe:~$
            </span>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="type a command (e.g. 'help', 'dial')..."
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.82rem',
                outline: 'none',
              }}
            />
            <span className="terminal-cursor" />
          </form>
        </div>
      </div>

      {/* Hero Action Buttons */}
      <div
        ref={ctaRef}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '10px',
        }}
      >
        <button
          onClick={scrollToWindows}
          onMouseEnter={playHoverSound}
          data-cursor="DESKTOP"
          className="cyber-btn cyber-btn-lime"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
          <span>LAUNCH DESKTOP WINDOWS</span>
        </button>

        <button
          onClick={() => {
            playClickSound();
            document.getElementById('chronology')?.scrollIntoView({ behavior: 'smooth' });
          }}
          onMouseEnter={playHoverSound}
          data-cursor="VOYAGE"
          className="cyber-btn cyber-btn-outline"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span>DESCEND THE STRATUM</span>
        </button>
      </div>

      {/* Animations style */}
      <style>{`
        @keyframes spinClockwise {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes spinCounter {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }
        @keyframes portalPulse {
          0% { transform: scale(0.92); opacity: 0.6; }
          100% { transform: scale(1.08); opacity: 1; }
        }
        @media (max-width: 860px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
