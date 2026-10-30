import { useState, useRef } from 'react';
import {
  playClickSound,
  playHoverSound,
  playSuccessChime,
  playSynthNote,
  playDialupSimulation,
} from '../utils/audio';

// Predefined window definitions
const INITIAL_WINDOWS = {
  dialup: {
    id: 'dialup',
    title: 'DIALUP.SYS // 56K MODEM',
    color: 'var(--neon-cyan)',
    isOpen: true,
    isMinimized: false,
    x: 40,
    y: 30,
    zIndex: 10,
  },
  paint: {
    id: 'paint',
    title: 'RETRO_PAINT.EXE [NEON 16x16]',
    color: 'var(--neon-lime)',
    isOpen: true,
    isMinimized: false,
    x: 440,
    y: 70,
    zIndex: 9,
  },
  memes: {
    id: 'memes',
    title: 'MEME_VAULT.ROM // 1996 RELICS',
    color: 'var(--neon-orange)',
    isOpen: true,
    isMinimized: false,
    x: 90,
    y: 440,
    zIndex: 8,
  },
  synth: {
    id: 'synth',
    title: 'CYBER_SYNTH.WAV // 8-BIT AUDIO',
    color: 'var(--neon-pink)',
    isOpen: false,
    isMinimized: false,
    x: 520,
    y: 380,
    zIndex: 7,
  },
};

export default function FloatingWindowManager() {
  const [windows, setWindows] = useState(INITIAL_WINDOWS);
  const [topZ, setTopZ] = useState(20);
  const [activeWindowId, setActiveWindowId] = useState('dialup');
  const desktopRef = useRef(null);

  // Dragging state
  const dragState = useRef({
    isDragging: false,
    windowId: null,
    startX: 0,
    startY: 0,
    initialWinX: 0,
    initialWinY: 0,
  });

  const bringToFront = (id) => {
    setTopZ((prev) => {
      const nextZ = prev + 1;
      setWindows((w) => ({
        ...w,
        [id]: { ...w[id], zIndex: nextZ, isMinimized: false },
      }));
      setActiveWindowId(id);
      return nextZ;
    });
  };

  const toggleWindow = (id) => {
    playClickSound();
    setWindows((w) => {
      const win = w[id];
      if (win.isOpen && !win.isMinimized) {
        return { ...w, [id]: { ...win, isMinimized: true } };
      }
      return {
        ...w,
        [id]: { ...win, isOpen: true, isMinimized: false, zIndex: topZ + 1 },
      };
    });
    setTopZ((z) => z + 1);
    setActiveWindowId(id);
  };

  const closeWindow = (id, e) => {
    e.stopPropagation();
    playClickSound();
    setWindows((w) => ({
      ...w,
      [id]: { ...w[id], isOpen: false },
    }));
  };

  const minimizeWindow = (id, e) => {
    e.stopPropagation();
    playClickSound();
    setWindows((w) => ({
      ...w,
      [id]: { ...w[id], isMinimized: true },
    }));
  };

  // Mouse Drag handlers
  const handleMouseDown = (id, e) => {
    bringToFront(id);
    dragState.current = {
      isDragging: true,
      windowId: id,
      startX: e.clientX,
      startY: e.clientY,
      initialWinX: windows[id].x,
      initialWinY: windows[id].y,
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!dragState.current.isDragging) return;
    const { windowId, startX, startY, initialWinX, initialWinY } = dragState.current;
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    setWindows((w) => ({
      ...w,
      [windowId]: {
        ...w[windowId],
        x: Math.max(0, initialWinX + deltaX),
        y: Math.max(0, initialWinY + deltaY),
      },
    }));
  };

  const handleMouseUp = () => {
    dragState.current.isDragging = false;
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };

  // ================= WINDOW 1: DIALUP.SYS =================
  const [dialStatus, setDialStatus] = useState('IDLE: WAITING FOR DIAL-IN');
  const [dialProgress, setDialProgress] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const dialAbortRef = useRef(null);

  const handleStartDial = () => {
    playClickSound();
    if (isConnected) {
      // Disconnect
      setIsConnected(false);
      setDialProgress(0);
      setDialStatus('DISCONNECTED.');
      return;
    }

    setDialStatus('INITIALIZING USROBOTICS 56K MODEM...');
    setDialProgress(10);

    dialAbortRef.current = playDialupSimulation(
      (statusText, progressPercent) => {
        setDialStatus(statusText);
        setDialProgress(progressPercent);
      },
      () => {
        setIsConnected(true);
      }
    );
  };

  // ================= WINDOW 2: RETRO_PAINT.EXE =================
  const GRID_SIZE = 14;
  const [pixels, setPixels] = useState(() => Array(GRID_SIZE * GRID_SIZE).fill('#0d0f17'));
  const [selectedColor, setSelectedColor] = useState('var(--neon-lime)');
  const [isDrawing, setIsDrawing] = useState(false);

  const colors = [
    '#39ff14', // Lime
    '#00f0ff', // Cyan
    '#ff5500', // Orange
    '#ff007f', // Pink
    '#ffffff', // White
    '#0d0f17', // Dark / Eraser
  ];

  const paintPixel = (idx) => {
    playHoverSound();
    setPixels((prev) => {
      const next = [...prev];
      next[idx] = selectedColor;
      return next;
    });
  };

  const glitchArt = () => {
    playClickSound();
    setPixels((prev) =>
      prev.map((col) =>
        Math.random() > 0.6 ? colors[Math.floor(Math.random() * colors.length)] : col
      )
    );
  };

  const clearCanvas = () => {
    playClickSound();
    setPixels(Array(GRID_SIZE * GRID_SIZE).fill('#0d0f17'));
  };

  // ================= WINDOW 3: MEME_VAULT.ROM =================
  const [clippyIndex, setClippyIndex] = useState(0);
  const [visitorCount, setVisitorCount] = useState(48291);
  const [babyDancing, setBabyDancing] = useState(true);

  const clippyQuotes = [
    '“It looks like you are traversing cyberspace. Would you like help avoiding 404 errors?”',
    '“Did you know? In 1996, the entire internet could fit on a 2GB hard drive.”',
    '“Pro-tip: Adding more blink tags increases web surfing speed by approximately 0%.”',
    '“Alert: Your modem baud rate is operating at peak nostalgic capacity!”',
    '“Remember to bookmark your favorite Geocities pages before Y2K arrives!”',
  ];

  const nextClippy = () => {
    playClickSound();
    setClippyIndex((prev) => (prev + 1) % clippyQuotes.length);
  };

  const bumpCounter = () => {
    playSuccessChime();
    setVisitorCount((c) => c + 1);
  };

  // ================= WINDOW 4: CYBER_SYNTH.WAV =================
  const [activePad, setActivePad] = useState(null);

  const triggerPad = (padIdx, freq, wave) => {
    setActivePad(padIdx);
    playSynthNote(freq, wave);
    setTimeout(() => setActivePad(null), 200);
  };

  return (
    <section
      id="windows"
      style={{
        position: 'relative',
        minHeight: '850px',
        padding: '70px 20px 40px',
        zIndex: 2,
        overflow: 'hidden',
      }}
    >
      <div className="container">
        <div className="section-header">
          <div className="cyber-badge cyber-badge-lime">
            <span>●</span> INTERACTIVE OS RUNTIME
          </div>
          <h2 className="section-title">THE RETRO WORKSTATION</h2>
          <p className="section-subtitle">
            Fully functional retro windows with procedural audio, dial-up modem synthesis,
            live 8-bit neon pixel canvas, and internet archaeology artifacts. Drag any window to reposition!
          </p>
        </div>

        {/* Desktop Container */}
        <div
          ref={desktopRef}
          style={{
            position: 'relative',
            width: '100%',
            height: '660px',
            background: 'rgba(8, 10, 16, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            boxShadow: 'inset 0 0 40px rgba(0, 0, 0, 0.8), 0 20px 40px rgba(0, 0, 0, 0.5)',
            overflow: 'hidden',
          }}
          className="desktop-surface"
        >
          {/* Subtle Desktop Cyber Grid */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage:
                'radial-gradient(circle, rgba(255, 255, 255, 0.06) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
              pointerEvents: 'none',
            }}
          />

          {/* ================= WINDOW 1: DIALUP.SYS ================= */}
          {windows.dialup.isOpen && !windows.dialup.isMinimized && (
            <div
              className={`retro-window ${activeWindowId === 'dialup' ? 'active-window' : ''}`}
              style={{
                position: 'absolute',
                left: `${windows.dialup.x}px`,
                top: `${windows.dialup.y}px`,
                width: '380px',
                zIndex: windows.dialup.zIndex,
              }}
              onClick={() => bringToFront('dialup')}
            >
              <div
                className="retro-window-header"
                onMouseDown={(e) => handleMouseDown('dialup', e)}
              >
                <div className="window-dots">
                  <span className="window-dot close" onClick={(e) => closeWindow('dialup', e)} />
                  <span className="window-dot minimize" onClick={(e) => minimizeWindow('dialup', e)} />
                  <span className="window-dot maximize" />
                </div>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.74rem',
                    color: windows.dialup.color,
                    letterSpacing: '0.04em',
                    fontWeight: 700,
                  }}
                >
                  {windows.dialup.title}
                </span>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>COM1:33.6K</span>
              </div>

              <div style={{ padding: '16px', fontFamily: 'var(--font-mono)' }}>
                {/* Modem Status Display */}
                <div
                  style={{
                    background: '#040508',
                    border: '1px solid rgba(0, 240, 255, 0.25)',
                    padding: '12px',
                    borderRadius: '6px',
                    marginBottom: '14px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.68rem',
                      color: 'var(--text-muted)',
                      marginBottom: '4px',
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>DEVICE: USRobotics Courier V.Everything</span>
                    <span style={{ color: isConnected ? 'var(--neon-lime)' : 'var(--neon-orange)' }}>
                      {isConnected ? 'ONLINE' : 'STANDBY'}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: '0.8rem',
                      color: isConnected ? 'var(--neon-lime)' : 'var(--neon-cyan)',
                      lineHeight: 1.4,
                      minHeight: '2.8em',
                    }}
                  >
                    {dialStatus}
                  </div>

                  {/* Progress Bar */}
                  <div
                    style={{
                      width: '100%',
                      height: '6px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      borderRadius: '3px',
                      marginTop: '8px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${dialProgress}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, var(--neon-cyan), var(--neon-lime))',
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </div>
                </div>

                {/* Dial Controls */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={handleStartDial}
                    onMouseEnter={playHoverSound}
                    data-cursor={isConnected ? 'HANGUP' : 'DIAL'}
                    className={`cyber-btn ${isConnected ? 'cyber-btn-pink' : 'cyber-btn-cyan'}`}
                    style={{ flex: 1, padding: '10px 12px', fontSize: '0.8rem' }}
                  >
                    {isConnected ? 'DISCONNECT MODEM' : 'DIAL CYBERNET (AUDIO)'}
                  </button>
                </div>

                {/* Telemetry info */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '6px',
                    marginTop: '12px',
                    textAlign: 'center',
                    fontSize: '0.68rem',
                  }}
                >
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '6px', borderRadius: '4px' }}>
                    <div style={{ color: 'var(--text-muted)' }}>BAUD</div>
                    <div style={{ color: '#fff', fontWeight: 'bold' }}>{isConnected ? '56,600' : '0'}</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '6px', borderRadius: '4px' }}>
                    <div style={{ color: 'var(--text-muted)' }}>PACKETS</div>
                    <div style={{ color: 'var(--neon-lime)', fontWeight: 'bold' }}>
                      {isConnected ? '1,429 RX' : '0'}
                    </div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '6px', borderRadius: '4px' }}>
                    <div style={{ color: 'var(--text-muted)' }}>CARRIER</div>
                    <div style={{ color: 'var(--neon-cyan)', fontWeight: 'bold' }}>
                      {isConnected ? 'V.90 OK' : 'NO CARRIER'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= WINDOW 2: RETRO_PAINT.EXE ================= */}
          {windows.paint.isOpen && !windows.paint.isMinimized && (
            <div
              className={`retro-window ${activeWindowId === 'paint' ? 'active-window' : ''}`}
              style={{
                position: 'absolute',
                left: `${windows.paint.x}px`,
                top: `${windows.paint.y}px`,
                width: '390px',
                zIndex: windows.paint.zIndex,
              }}
              onClick={() => bringToFront('paint')}
            >
              <div
                className="retro-window-header"
                onMouseDown={(e) => handleMouseDown('paint', e)}
              >
                <div className="window-dots">
                  <span className="window-dot close" onClick={(e) => closeWindow('paint', e)} />
                  <span className="window-dot minimize" onClick={(e) => minimizeWindow('paint', e)} />
                  <span className="window-dot maximize" />
                </div>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.74rem',
                    color: windows.paint.color,
                    letterSpacing: '0.04em',
                    fontWeight: 700,
                  }}
                >
                  {windows.paint.title}
                </span>
                <span style={{ fontSize: '0.65rem', color: 'var(--neon-lime)' }}>14x14px</span>
              </div>

              <div style={{ padding: '14px' }}>
                {/* Color Palette Picker */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '10px',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                    PALETTE:
                  </span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {colors.map((c, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setSelectedColor(c);
                          playHoverSound();
                        }}
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '3px',
                          backgroundColor: c,
                          border: selectedColor === c ? '2px solid #fff' : '1px solid rgba(255,255,255,0.2)',
                          boxShadow: selectedColor === c ? `0 0 8px ${c}` : 'none',
                          cursor: 'pointer',
                        }}
                        title={c}
                      />
                    ))}
                  </div>
                </div>

                {/* Pixel Drawing Grid */}
                <div
                  onMouseDown={() => setIsDrawing(true)}
                  onMouseUp={() => setIsDrawing(false)}
                  onMouseLeave={() => setIsDrawing(false)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                    gap: '1px',
                    background: '#040508',
                    padding: '3px',
                    border: '1px solid rgba(57, 255, 20, 0.3)',
                    borderRadius: '4px',
                    cursor: 'crosshair',
                    userSelect: 'none',
                  }}
                >
                  {pixels.map((color, idx) => (
                    <div
                      key={idx}
                      onMouseDown={() => paintPixel(idx)}
                      onMouseEnter={() => {
                        if (isDrawing) paintPixel(idx);
                      }}
                      style={{
                        width: '100%',
                        aspectRatio: '1 / 1',
                        backgroundColor: color,
                        borderRadius: '1px',
                        transition: 'background-color 0.05s ease',
                      }}
                    />
                  ))}
                </div>

                {/* Paint Actions */}
                <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
                  <button
                    onClick={glitchArt}
                    onMouseEnter={playHoverSound}
                    data-cursor="GLITCH"
                    className="cyber-btn cyber-btn-outline"
                    style={{ flex: 1, padding: '6px 8px', fontSize: '0.72rem' }}
                  >
                    GLITCH PIXELS
                  </button>
                  <button
                    onClick={clearCanvas}
                    onMouseEnter={playHoverSound}
                    data-cursor="CLEAR"
                    className="cyber-btn cyber-btn-outline"
                    style={{ flex: 1, padding: '6px 8px', fontSize: '0.72rem' }}
                  >
                    CLEAR
                  </button>
                  <button
                    onClick={() => {
                      playSuccessChime();
                      alert('Pixel masterpiece cached in cyber memory!');
                    }}
                    onMouseEnter={playHoverSound}
                    className="cyber-btn cyber-btn-lime"
                    style={{ flex: 1, padding: '6px 8px', fontSize: '0.72rem' }}
                  >
                    SAVE
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= WINDOW 3: MEME_VAULT.ROM ================= */}
          {windows.memes.isOpen && !windows.memes.isMinimized && (
            <div
              className={`retro-window ${activeWindowId === 'memes' ? 'active-window' : ''}`}
              style={{
                position: 'absolute',
                left: `${windows.memes.x}px`,
                top: `${windows.memes.y}px`,
                width: '400px',
                zIndex: windows.memes.zIndex,
              }}
              onClick={() => bringToFront('memes')}
            >
              <div
                className="retro-window-header"
                onMouseDown={(e) => handleMouseDown('memes', e)}
              >
                <div className="window-dots">
                  <span className="window-dot close" onClick={(e) => closeWindow('memes', e)} />
                  <span className="window-dot minimize" onClick={(e) => minimizeWindow('memes', e)} />
                  <span className="window-dot maximize" />
                </div>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.74rem',
                    color: windows.memes.color,
                    letterSpacing: '0.04em',
                    fontWeight: 700,
                  }}
                >
                  {windows.memes.title}
                </span>
                <span style={{ fontSize: '0.65rem', color: 'var(--neon-orange)' }}>RELIC_DB</span>
              </div>

              <div style={{ padding: '14px', fontFamily: 'var(--font-mono)' }}>
                {/* Interactive Clippy Assistant */}
                <div
                  style={{
                    background: 'rgba(255, 85, 0, 0.08)',
                    border: '1px solid rgba(255, 85, 0, 0.3)',
                    borderRadius: '6px',
                    padding: '10px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '12px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '1.8rem',
                      filter: 'drop-shadow(0 0 8px rgba(255, 85, 0, 0.5))',
                      cursor: 'pointer',
                      userSelect: 'none',
                    }}
                    onClick={nextClippy}
                    title="Click Clippy for wisdom"
                  >
                    📎
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.68rem', color: 'var(--neon-orange)', fontWeight: 'bold' }}>
                      CLIPPY_AI_v1.0 (CLICK FOR ADVICE):
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#e8edf8', marginTop: '2px', lineHeight: 1.35 }}>
                      {clippyQuotes[clippyIndex]}
                    </div>
                  </div>
                </div>

                {/* Retro Relics Display Grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px',
                  }}
                >
                  {/* Relic 1: Under Construction Hazard Tape */}
                  <div
                    style={{
                      background: '#040508',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '6px',
                      padding: '8px',
                      textAlign: 'center',
                    }}
                  >
                    <div
                      style={{
                        height: '14px',
                        background:
                          'repeating-linear-gradient(45deg, #ffaa00, #ffaa00 10px, #000 10px, #000 20px)',
                        borderRadius: '2px',
                        marginBottom: '6px',
                      }}
                    />
                    <div style={{ fontSize: '0.68rem', color: '#ffaa00', fontWeight: 'bold' }}>
                      UNDER CONSTRUCTION
                    </div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>BEST VIEWED IN NETSCAPE</div>
                  </div>

                  {/* Relic 2: Animated Dancing Baby */}
                  <div
                    onClick={() => {
                      playHoverSound();
                      setBabyDancing(!babyDancing);
                    }}
                    style={{
                      background: '#040508',
                      border: '1px solid rgba(0, 240, 255, 0.2)',
                      borderRadius: '6px',
                      padding: '8px',
                      textAlign: 'center',
                      cursor: 'pointer',
                    }}
                    title="Click to toggle dance"
                  >
                    <div
                      style={{
                        fontSize: '1.4rem',
                        animation: babyDancing ? 'babyWiggle 0.6s infinite alternate' : 'none',
                        display: 'inline-block',
                      }}
                    >
                      👶
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--neon-cyan)', fontWeight: 'bold' }}>
                      3D DANCING BABY 1996
                    </div>
                    <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>[CLICK TO SHAKE]</div>
                  </div>
                </div>

                {/* Geocities Visitor Counter */}
                <div
                  style={{
                    marginTop: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: '#05060a',
                    border: '1px dashed rgba(255, 255, 255, 0.15)',
                    padding: '8px 12px',
                    borderRadius: '4px',
                  }}
                >
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>VISITOR ODOMETER:</span>
                  <div
                    onClick={bumpCounter}
                    data-cursor="BUMP"
                    style={{
                      fontFamily: 'var(--font-pixel)',
                      fontSize: '0.8rem',
                      color: 'var(--neon-lime)',
                      background: '#000',
                      padding: '4px 8px',
                      borderRadius: '3px',
                      border: '1px solid var(--neon-lime)',
                      cursor: 'pointer',
                      letterSpacing: '2px',
                    }}
                    title="Click to bump the counter"
                  >
                    #{String(visitorCount).padStart(7, '0')}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= WINDOW 4: CYBER_SYNTH.WAV ================= */}
          {windows.synth.isOpen && !windows.synth.isMinimized && (
            <div
              className={`retro-window ${activeWindowId === 'synth' ? 'active-window' : ''}`}
              style={{
                position: 'absolute',
                left: `${windows.synth.x}px`,
                top: `${windows.synth.y}px`,
                width: '360px',
                zIndex: windows.synth.zIndex,
              }}
              onClick={() => bringToFront('synth')}
            >
              <div
                className="retro-window-header"
                onMouseDown={(e) => handleMouseDown('synth', e)}
              >
                <div className="window-dots">
                  <span className="window-dot close" onClick={(e) => closeWindow('synth', e)} />
                  <span className="window-dot minimize" onClick={(e) => minimizeWindow('synth', e)} />
                  <span className="window-dot maximize" />
                </div>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.74rem',
                    color: windows.synth.color,
                    letterSpacing: '0.04em',
                    fontWeight: 700,
                  }}
                >
                  {windows.synth.title}
                </span>
                <span style={{ fontSize: '0.65rem', color: 'var(--neon-pink)' }}>SYNTH_V1</span>
              </div>

              <div style={{ padding: '16px' }}>
                <div
                  style={{
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-secondary)',
                    marginBottom: '12px',
                  }}
                >
                  TRIGGER REAL-TIME WEB AUDIO TONES:
                </div>

                {/* 4 Interactive Drum/Synth Pads */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button
                    onClick={() => triggerPad(0, 110, 'sine')}
                    data-cursor="PLAY"
                    style={{
                      padding: '16px 12px',
                      background: activePad === 0 ? 'var(--neon-cyan)' : 'rgba(0, 240, 255, 0.1)',
                      border: '1px solid var(--neon-cyan)',
                      color: activePad === 0 ? '#000' : 'var(--neon-cyan)',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      transition: 'all 0.1s ease',
                    }}
                  >
                    SUB BASS [110Hz]
                  </button>

                  <button
                    onClick={() => triggerPad(1, 523.25, 'sawtooth')}
                    data-cursor="PLAY"
                    style={{
                      padding: '16px 12px',
                      background: activePad === 1 ? 'var(--neon-lime)' : 'rgba(57, 255, 20, 0.1)',
                      border: '1px solid var(--neon-lime)',
                      color: activePad === 1 ? '#000' : 'var(--neon-lime)',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      transition: 'all 0.1s ease',
                    }}
                  >
                    NEON ARP [523Hz]
                  </button>

                  <button
                    onClick={() => triggerPad(2, 880, 'square')}
                    data-cursor="PLAY"
                    style={{
                      padding: '16px 12px',
                      background: activePad === 2 ? 'var(--neon-pink)' : 'rgba(255, 0, 127, 0.1)',
                      border: '1px solid var(--neon-pink)',
                      color: activePad === 2 ? '#fff' : 'var(--neon-pink)',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      transition: 'all 0.1s ease',
                    }}
                  >
                    8BIT CHIP [880Hz]
                  </button>

                  <button
                    onClick={() => triggerPad(3, 1400, 'triangle')}
                    data-cursor="PLAY"
                    style={{
                      padding: '16px 12px',
                      background: activePad === 3 ? 'var(--neon-orange)' : 'rgba(255, 85, 0, 0.1)',
                      border: '1px solid var(--neon-orange)',
                      color: activePad === 3 ? '#000' : 'var(--neon-orange)',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      transition: 'all 0.1s ease',
                    }}
                  >
                    LASER PING [1.4kHz]
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Desktop Taskbar / Dock at Bottom */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '42px',
              background: 'rgba(10, 12, 18, 0.95)',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              padding: '0 12px',
              gap: '8px',
              zIndex: 99,
            }}
          >
            {/* Start Button */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                background: 'linear-gradient(135deg, var(--neon-cyan), var(--neon-lime))',
                borderRadius: '3px',
                color: '#000',
                fontFamily: 'var(--font-tech)',
                fontWeight: 800,
                fontSize: '0.75rem',
                userSelect: 'none',
              }}
            >
              <span>EXE</span>
              <span>START</span>
            </div>

            <div style={{ width: '1px', height: '22px', background: 'rgba(255,255,255,0.1)' }} />

            {/* Taskbar App Tabs */}
            {Object.values(windows).map((win) => (
              <button
                key={win.id}
                onClick={() => toggleWindow(win.id)}
                onMouseEnter={playHoverSound}
                data-cursor="WINDOW"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  background:
                    win.isOpen && !win.isMinimized
                      ? 'rgba(255, 255, 255, 0.12)'
                      : 'rgba(255, 255, 255, 0.03)',
                  border: `1px solid ${
                    win.isOpen && !win.isMinimized ? win.color : 'rgba(255, 255, 255, 0.08)'
                  }`,
                  borderRadius: '3px',
                  color: win.isOpen && !win.isMinimized ? win.color : 'var(--text-muted)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: win.isOpen && !win.isMinimized ? win.color : 'var(--text-muted)',
                  }}
                />
                {win.id.toUpperCase()}
              </button>
            ))}

            <div style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              WIN_MGR // ACTIVE
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes babyWiggle {
          0% { transform: rotate(-15deg) scale(1); }
          100% { transform: rotate(15deg) scale(1.1); }
        }
        @media (max-width: 768px) {
          .desktop-surface {
            height: 780px !important;
          }
        }
      `}</style>
    </section>
  );
}
