import { useEffect, useRef, useState, useMemo } from 'react';
import { playClickSound, playHoverSound, playSuccessChime } from '../utils/audio';

const RETRO_POPUP_MSGS = [
  { title: 'ERROR 404', text: 'REALITY NOT FOUND IN CYBER CLUSTER 7.', color: 'var(--neon-pink)' },
  { title: 'WARNING 0xDEADBEEF', text: 'BUFFER OVERFLOW: 64KB MEMORY LEAK IN VIDEO RAM.', color: 'var(--neon-orange)' },
  { title: 'COOKIE MONSTER', text: '4,096 TRACKER COOKIES SUCCESSFULLY INGESTED.', color: 'var(--neon-lime)' },
  { title: 'HOT SINGULARITIES', text: 'AUTONOMOUS AI AGENTS IN YOUR PROXIMITY WANT TO PEER-TO-PEER CHAT.', color: 'var(--neon-cyan)' },
  { title: 'SECURITY NOTICE', text: 'YOUR DIALUP CARRIER IS BROADCASTING AT 56,600 CYCLES.', color: 'var(--neon-lime)' },
];

export default function MatrixChaosSection() {
  const canvasRef = useRef(null);
  const [entropy, setEntropy] = useState(45);
  const [glitchFactor, setGlitchFactor] = useState(30);
  const [popups, setPopups] = useState([]);
  const [asciiInput, setAsciiInput] = useState('CYBER');

  // ASCII art dictionary for characters calculated with useMemo
  const asciiOutput = useMemo(() => {
    const letters = {
      C: [' ████ ', '█    ', '█    ', '█    ', ' ████ '],
      Y: ['█   █', ' █ █ ', '  █  ', '  █  ', '  █  '],
      B: ['████ ', '█   █', '████ ', '█   █', '████ '],
      E: ['█████', '█    ', '████ ', '█    ', '█████'],
      R: ['████ ', '█   █', '████ ', '█  █ ', '█   █'],
      N: ['█   █', '██  █', '█ █ █', '█  ██', '█   █'],
      T: ['█████', '  █  ', '  █  ', '  █  ', '  █  '],
      X: ['█   █', ' █ █ ', '  █  ', ' █ █ ', '█   █'],
      O: [' ███ ', '█   █', '█   █', '█   █', ' ███ '],
    };

    const clean = asciiInput.toUpperCase().slice(0, 7);
    const lines = ['', '', '', '', ''];

    for (let char of clean) {
      const art = letters[char] || ['░░░░░', '░   ░', '░░░░░', '░   ░', '░   ░'];
      for (let row = 0; row < 5; row++) {
        lines[row] += art[row] + '  ';
      }
    }
    return lines.join('\n');
  }, [asciiInput]);

  // Matrix Rain Canvas with interactive entropy speed & glitch
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let width = (canvas.width = canvas.parentElement.clientWidth);
    let height = (canvas.height = 420);

    const handleResize = () => {
      if (canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth;
        height = canvas.height = 420;
      }
    };
    window.addEventListener('resize', handleResize);

    const chars = '0123456789ABCDEFｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜINTERNET.EXE';
    const fontSize = 14;
    const columns = Math.floor(width / fontSize);
    const drops = Array(columns).fill(1);

    const render = () => {
      // Fade previous frame
      ctx.fillStyle = 'rgba(7, 8, 13, 0.2)';
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Color based on glitch factor
        const isGlitch = Math.random() < glitchFactor / 100 * 0.15;
        if (isGlitch) {
          ctx.fillStyle = '#ff007f';
          ctx.shadowColor = '#ff007f';
          ctx.shadowBlur = 10;
        } else if (Math.random() > 0.95) {
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = '#00f0ff';
          ctx.shadowBlur = 12;
        } else {
          ctx.fillStyle = '#39ff14';
          ctx.shadowColor = '#39ff14';
          ctx.shadowBlur = 4;
        }

        ctx.fillText(char, x, y);

        // Reset drop to top with randomized delay based on entropy
        if (y > height && Math.random() > 0.975 - (entropy / 100) * 0.04) {
          drops[i] = 0;
        }

        drops[i] += 1 + Math.floor((entropy / 100) * 2);
      }

      ctx.shadowBlur = 0;
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [entropy, glitchFactor]);

  // Spawns interactive retro popups
  const spawnPopup = () => {
    playHoverSound();
    const template = RETRO_POPUP_MSGS[Math.floor(Math.random() * RETRO_POPUP_MSGS.length)];
    const id = Date.now() + Math.random();
    const newPopup = {
      id,
      title: template.title,
      text: template.text,
      color: template.color,
      x: 10 + Math.random() * 60, // percentage
      y: 10 + Math.random() * 50,
    };
    setPopups((prev) => [...prev.slice(-4), newPopup]);
  };

  const closePopup = (id) => {
    playClickSound();
    setPopups((prev) => prev.filter((p) => p.id !== id));
  };

  const flushAllPopups = () => {
    playSuccessChime();
    setPopups([]);
  };

  return (
    <section
      id="matrix-chaos"
      style={{
        position: 'relative',
        padding: '90px 20px 80px',
        zIndex: 2,
        overflow: 'hidden',
      }}
    >
      <div className="container">
        <div className="section-header">
          <div className="cyber-badge cyber-badge-pink">
            <span>▲</span> UNRESTRICTED CYBER STREAM
          </div>
          <h2 className="section-title">THE CHAOS VOID</h2>
          <p className="section-subtitle">
            An interactive playground of digital anomalies, live streaming glyphs,
            runtime entropy sliders, and vintage memory overload dialogues.
          </p>
        </div>

        {/* Matrix Canvas & Interactive Control Surface */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 340px',
            gap: '24px',
            marginBottom: '36px',
          }}
          className="chaos-grid"
        >
          {/* Matrix Stream Canvas Window */}
          <div
            className="retro-window"
            style={{
              position: 'relative',
              overflow: 'hidden',
              minHeight: '460px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div className="retro-window-header">
              <div className="window-dots">
                <span className="window-dot close" />
                <span className="window-dot minimize" />
                <span className="window-dot maximize" />
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.74rem',
                  color: 'var(--neon-lime)',
                  letterSpacing: '0.04em',
                }}
              >
                STREAM_MATRIX_V4.EXE // ENTROPY: {entropy}%
              </span>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>60 FPS BUFFER</span>
            </div>

            <div style={{ position: 'relative', flex: 1, backgroundColor: '#050609' }}>
              <canvas
                ref={canvasRef}
                style={{
                  width: '100%',
                  height: '420px',
                  display: 'block',
                }}
              />

              {/* Floating Error Dialogues overlay */}
              {popups.map((popup) => (
                <div
                  key={popup.id}
                  className="retro-window"
                  style={{
                    position: 'absolute',
                    left: `${popup.x}%`,
                    top: `${popup.y}%`,
                    width: '260px',
                    borderColor: popup.color,
                    boxShadow: `0 10px 30px rgba(0,0,0,0.8), 0 0 15px ${popup.color}44`,
                    zIndex: 50,
                    animation: 'scaleIn 0.2s ease-out',
                  }}
                >
                  <div
                    className="retro-window-header"
                    style={{ height: '28px', padding: '0 8px', background: 'rgba(255,255,255,0.06)' }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.68rem',
                        color: popup.color,
                        fontWeight: 'bold',
                      }}
                    >
                      {popup.title}
                    </span>
                    <button
                      onClick={() => closePopup(popup.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#fff',
                        cursor: 'pointer',
                        fontSize: '11px',
                      }}
                    >
                      ✕
                    </button>
                  </div>
                  <div style={{ padding: '10px 12px', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#fff' }}>
                    {popup.text}
                    <div style={{ marginTop: '8px', textAlign: 'right' }}>
                      <button
                        onClick={() => closePopup(popup.id)}
                        className="cyber-btn cyber-btn-outline"
                        style={{ padding: '3px 8px', fontSize: '0.65rem' }}
                      >
                        DISMISS
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Controls Panel & Simulator */}
          <div
            className="retro-window"
            style={{
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-tech)',
                fontWeight: 700,
                fontSize: '1rem',
                color: 'var(--neon-cyan)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                paddingBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>⚙</span> CHAOS ENGINE CONTROLLER
            </div>

            {/* Slider 1: Data Entropy */}
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  marginBottom: '8px',
                }}
              >
                <span style={{ color: 'var(--text-secondary)' }}>DATA ENTROPY</span>
                <span style={{ color: 'var(--neon-lime)', fontWeight: 'bold' }}>{entropy}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                value={entropy}
                onChange={(e) => setEntropy(Number(e.target.value))}
                style={{
                  width: '100%',
                  accentColor: 'var(--neon-lime)',
                  cursor: 'pointer',
                }}
              />
            </div>

            {/* Slider 2: Glitch Frequency */}
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  marginBottom: '8px',
                }}
              >
                <span style={{ color: 'var(--text-secondary)' }}>GLITCH DISPERSION</span>
                <span style={{ color: 'var(--neon-pink)', fontWeight: 'bold' }}>{glitchFactor}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={glitchFactor}
                onChange={(e) => setGlitchFactor(Number(e.target.value))}
                style={{
                  width: '100%',
                  accentColor: 'var(--neon-pink)',
                  cursor: 'pointer',
                }}
              />
            </div>

            {/* Popup Simulator Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
              <button
                onClick={spawnPopup}
                onMouseEnter={playHoverSound}
                data-cursor="SPAWN"
                className="cyber-btn cyber-btn-orange"
                style={{ padding: '10px', fontSize: '0.78rem' }}
              >
                + SIMULATE CYBER ALERT ({popups.length})
              </button>

              {popups.length > 0 && (
                <button
                  onClick={flushAllPopups}
                  onMouseEnter={playHoverSound}
                  data-cursor="CLEAR"
                  className="cyber-btn cyber-btn-outline"
                  style={{ padding: '8px', fontSize: '0.74rem' }}
                >
                  PURGE ACTIVE ALERTS
                </button>
              )}
            </div>

            {/* ASCII Generator */}
            <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '14px' }}>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  color: 'var(--text-secondary)',
                  marginBottom: '6px',
                }}
              >
                TYPE PHRASE TO ASCII-MORPH:
              </div>
              <input
                type="text"
                value={asciiInput}
                onChange={(e) => setAsciiInput(e.target.value)}
                maxLength={7}
                placeholder="TYPE..."
                style={{
                  width: '100%',
                  padding: '6px 10px',
                  background: 'rgba(0,0,0,0.4)',
                  border: '1px solid rgba(0, 240, 255, 0.3)',
                  borderRadius: '4px',
                  color: 'var(--neon-cyan)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  outline: 'none',
                  textTransform: 'uppercase',
                }}
              />
            </div>
          </div>
        </div>

        {/* ASCII Art Canvas output */}
        <div
          className="retro-window"
          style={{
            padding: '16px 20px',
            backgroundColor: '#040508',
            border: '1px solid rgba(57, 255, 20, 0.25)',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              color: 'var(--neon-lime)',
              marginBottom: '6px',
            }}
          >
            REALTIME_ASCII_STREAM:
          </div>
          <pre
            style={{
              fontFamily: 'monospace',
              fontSize: 'clamp(9px, 1.2vw, 13px)',
              lineHeight: 1.15,
              color: 'var(--neon-lime)',
              textShadow: '0 0 8px rgba(57, 255, 20, 0.5)',
              overflowX: 'auto',
              margin: 0,
            }}
          >
            {asciiOutput}
          </pre>
        </div>
      </div>

      <style>{`
        @keyframes scaleIn {
          0% { transform: scale(0.85); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @media (max-width: 900px) {
          .chaos-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
