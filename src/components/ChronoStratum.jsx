import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { playHoverSound, playSuccessChime } from '../utils/audio';

gsap.registerPlugin(ScrollTrigger);

const ERAS = [
  {
    year: '1991',
    name: 'THE HYPERTEXT GENESIS',
    sub: 'Tim Berners-Lee & The CERN NeXT Station',
    badge: 'V0.1 ALPHANET',
    color: 'var(--neon-lime)',
    accentClass: 'cyber-badge-lime',
    desc: 'The birth of the World Wide Web. Pure text, raw markup, and the radical dream that human knowledge could be interconnected through hyperlinks without gatekeepers.',
    stats: { hosts: '617,000', speed: '14.4 kbps', protocol: 'HTTP/0.9' },
    artifact: 'RAW_HTML_TREE',
    quote: '“The Web does not just connect machines, it connects people.” — Sir Tim Berners-Lee',
  },
  {
    year: '1998',
    name: 'THE WILD CYBER WEST',
    sub: 'Geocities, Webrings & Dial-up Static',
    badge: '56K GOLDEN AGE',
    color: 'var(--neon-cyan)',
    accentClass: 'cyber-badge-cyan',
    desc: 'Blinking text, animated flame GIFs, cyber guestbooks, MIDI background music, and homemade digital shrines. Cyberspace was a vibrant, decentralized neighborhood of personal discovery.',
    stats: { hosts: '36,730,000', speed: '56.6 kbps', protocol: 'HTML 4.0 / CGI' },
    artifact: 'GEOCITIES_SHRINE',
    quote: '“You’ve got mail! Please sign my guestbook before leaving my digital cyber-home.”',
  },
  {
    year: '2008',
    name: 'THE ALGORITHMIC MIRROR',
    sub: 'Walled Gardens & The Mobile Singularity',
    badge: 'FEED_MATRIX',
    color: 'var(--neon-orange)',
    accentClass: 'cyber-badge-orange',
    desc: 'The migration from open exploratory websites into centralized corporate feeds. Infinite scrolls, notification dopamine loops, responsive mobile screens, and the quantization of human attention.',
    stats: { hosts: '570,000,000', speed: '10 Mbps LTE', protocol: 'Web 2.0 / REST' },
    artifact: 'DOPAMINE_FEED',
    quote: '“If you are not paying for the product, you are the product in the data auction.”',
  },
  {
    year: '2026+',
    name: 'THE SYNTHETIC CONSCIOUSNESS',
    sub: 'Autonomous Agents & The Living Hypervoid',
    badge: 'SINGULARITY_V3',
    color: 'var(--neon-pink)',
    accentClass: 'cyber-badge-pink',
    desc: 'The emergence of self-synthesizing interfaces, autonomous AI agents conducting millions of parallel transactions, and real-time interactive cyberspace experiences powered by code and neural models.',
    stats: { hosts: '∞ NODES', speed: 'Sub-millisecond Optical', protocol: 'NEURAL_RPC' },
    artifact: 'SYNTHETIC_CORE',
    quote: '“The boundary between client and cloud, human and prompt, has collapsed into pure light.”',
  },
];

export default function ChronoStratum() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const [activeEraIndex, setActiveEraIndex] = useState(0);
  const [geocitiesMode, setGeocitiesMode] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // GSAP ScrollTrigger timeline for cards
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, index) => {
        if (!card) return;

        gsap.fromTo(
          card,
          {
            opacity: 0,
            y: 70,
            scale: 0.94,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 82%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse',
              onEnter: () => setActiveEraIndex(index),
            },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const toggleGeocities = () => {
    playSuccessChime();
    setGeocitiesMode(!geocitiesMode);
  };

  return (
    <section
      id="chronology"
      ref={sectionRef}
      style={{
        position: 'relative',
        padding: '100px 20px 80px',
        zIndex: 2,
        background: 'linear-gradient(180deg, transparent 0%, rgba(13, 15, 23, 0.75) 50%, transparent 100%)',
      }}
    >
      <div className="container">
        {/* Section Title */}
        <div className="section-header">
          <div className="cyber-badge cyber-badge-cyan">
            <span>◆</span> ARCHAEOLOGY OF CYBERSPACE
          </div>
          <h2 className="section-title">THE CHRONO-STRATUM</h2>
          <p className="section-subtitle">
            Scroll down to descend through 35 years of digital evolution. Witness the metamorphosis
            from Tim Berners-Lee’s raw CERN terminal to the synthetic autonomous matrix of tomorrow.
          </p>

          {/* Interactive Era Switcher / 90s Mode Toggle */}
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <button
              onClick={toggleGeocities}
              onMouseEnter={playHoverSound}
              data-cursor="90s"
              className={`cyber-btn ${geocitiesMode ? 'cyber-btn-orange' : 'cyber-btn-outline'}`}
              style={{ fontSize: '0.78rem', padding: '8px 16px' }}
            >
              {geocitiesMode ? 'DISABLE 1998 FLAME THEME' : 'ACTIVATE 1998 GEOCITIES FLAME THEME 🔥'}
            </button>
          </div>
        </div>

        {/* Vertical Timeline Guide Line */}
        <div style={{ position: 'relative', maxWidth: '960px', margin: '0 auto' }}>
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '40px',
              bottom: '40px',
              width: '2px',
              background: 'linear-gradient(180deg, var(--neon-lime), var(--neon-cyan), var(--neon-orange), var(--neon-pink))',
              transform: 'translateX(-50%)',
              opacity: 0.35,
              zIndex: 0,
            }}
            className="timeline-center-line"
          />

          {/* Era Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}>
            {ERAS.map((era, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <div
                  key={era.year}
                  ref={(el) => (cardsRef.current[idx] = el)}
                  className={`retro-window era-card ${geocitiesMode ? 'geocities-flair' : ''}`}
                  style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '820px',
                    margin: isEven ? '0 auto 0 0' : '0 0 0 auto',
                    zIndex: 1,
                    borderColor: activeEraIndex === idx ? era.color : 'rgba(255, 255, 255, 0.08)',
                    boxShadow:
                      activeEraIndex === idx
                        ? `0 20px 45px rgba(0,0,0,0.7), 0 0 25px ${era.color}33`
                        : '0 12px 30px rgba(0,0,0,0.5)',
                    transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
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
                        fontSize: '0.74rem',
                        color: era.color,
                        letterSpacing: '0.06em',
                        fontWeight: 700,
                      }}
                    >
                      STRATUM_LAYER_0{idx + 1} // EPOCH_{era.year}
                    </div>
                    <span className={`cyber-badge ${era.accentClass}`} style={{ fontSize: '0.65rem' }}>
                      {era.badge}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div style={{ padding: '24px' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: '12px',
                        marginBottom: '8px',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'var(--font-pixel)',
                          fontSize: '1.4rem',
                          color: era.color,
                          textShadow: `0 0 12px ${era.color}`,
                        }}
                      >
                        {era.year}
                      </span>
                      <h3
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '1.45rem',
                          margin: 0,
                          letterSpacing: '-0.02em',
                        }}
                      >
                        {era.name}
                      </h3>
                    </div>

                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.8rem',
                        color: 'var(--text-secondary)',
                        marginBottom: '16px',
                      }}
                    >
                      {era.sub}
                    </div>

                    <p
                      style={{
                        fontSize: '0.94rem',
                        lineHeight: 1.6,
                        color: '#dbe2f4',
                        marginBottom: '20px',
                      }}
                    >
                      {era.desc}
                    </p>

                    {/* Era Quote */}
                    <div
                      style={{
                        background: 'rgba(0, 0, 0, 0.35)',
                        borderLeft: `3px solid ${era.color}`,
                        padding: '10px 14px',
                        borderRadius: '0 4px 4px 0',
                        fontStyle: 'italic',
                        fontSize: '0.82rem',
                        color: '#9aa5be',
                        marginBottom: '18px',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {era.quote}
                    </div>

                    {/* Stats HUD Bar */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '8px',
                        padding: '10px 14px',
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        borderRadius: '6px',
                        textAlign: 'center',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.72rem',
                      }}
                    >
                      <div>
                        <div style={{ color: 'var(--text-muted)' }}>ONLINE HOSTS</div>
                        <div style={{ color: '#fff', fontWeight: 'bold', marginTop: '2px' }}>
                          {era.stats.hosts}
                        </div>
                      </div>
                      <div>
                        <div style={{ color: 'var(--text-muted)' }}>NETWORK SPEED</div>
                        <div style={{ color: era.color, fontWeight: 'bold', marginTop: '2px' }}>
                          {era.stats.speed}
                        </div>
                      </div>
                      <div>
                        <div style={{ color: 'var(--text-muted)' }}>DOMINANT PROTOCOL</div>
                        <div style={{ color: '#fff', fontWeight: 'bold', marginTop: '2px' }}>
                          {era.stats.protocol}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        .geocities-flair {
          border: 3px dashed #ffaa00 !important;
          background: linear-gradient(135deg, rgba(20, 10, 0, 0.95), rgba(40, 20, 0, 0.9)) !important;
        }
        @media (max-width: 900px) {
          .timeline-center-line {
            display: none !important;
          }
          .era-card {
            margin: 0 auto !important;
          }
        }
      `}</style>
    </section>
  );
}
