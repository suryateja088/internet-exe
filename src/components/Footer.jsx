import { playClickSound, playHoverSound } from '../utils/audio';

export default function Footer() {
  const scrollToTop = () => {
    playClickSound();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      style={{
        position: 'relative',
        zIndex: 2,
        backgroundColor: '#050609',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '50px 20px 30px',
        textAlign: 'center',
        fontFamily: 'var(--font-mono)',
      }}
    >
      <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
        {/* Retro Webring Box */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '14px',
            padding: '8px 18px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(0, 240, 255, 0.3)',
            borderRadius: '4px',
            fontSize: '0.74rem',
            color: 'var(--text-secondary)',
          }}
        >
          <button
            onClick={() => {
              playClickSound();
              alert('Warping to previous site in Cyberspace Webring!');
            }}
            onMouseEnter={playHoverSound}
            data-cursor="RING"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--neon-cyan)',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: 'inherit',
            }}
          >
            &lt;&lt; [PREV]
          </button>

          <span style={{ color: '#fff', fontWeight: 'bold' }}>
            [ CYBERSPACE WEBRING MEMBER #042 ]
          </span>

          <button
            onClick={() => {
              playClickSound();
              alert('Warping to next site in Cyberspace Webring!');
            }}
            onMouseEnter={playHoverSound}
            data-cursor="RING"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--neon-cyan)',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: 'inherit',
            }}
          >
            [NEXT] &gt;&gt;
          </button>
        </div>

        {/* Retro Badges */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <div
            style={{
              padding: '4px 8px',
              background: '#0a0d14',
              border: '1px solid #ffaa00',
              borderRadius: '2px',
              fontSize: '0.65rem',
              color: '#ffaa00',
              fontWeight: 'bold',
            }}
          >
            NETSCAPE 3.0 READY
          </div>
          <div
            style={{
              padding: '4px 8px',
              background: '#0a0d14',
              border: '1px solid var(--neon-lime)',
              borderRadius: '2px',
              fontSize: '0.65rem',
              color: 'var(--neon-lime)',
              fontWeight: 'bold',
            }}
          >
            W3C HTML 4.01 STRICT
          </div>
          <div
            style={{
              padding: '4px 8px',
              background: '#0a0d14',
              border: '1px solid var(--neon-cyan)',
              borderRadius: '2px',
              fontSize: '0.65rem',
              color: 'var(--neon-cyan)',
              fontWeight: 'bold',
            }}
          >
            NO COOKIES COLLECTED
          </div>
          <div
            style={{
              padding: '4px 8px',
              background: '#0a0d14',
              border: '1px solid var(--neon-pink)',
              borderRadius: '2px',
              fontSize: '0.65rem',
              color: 'var(--neon-pink)',
              fontWeight: 'bold',
            }}
          >
            REACT + GSAP + WEBAUDIO
          </div>
        </div>

        {/* Brand Note & Back to Top */}
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
          <div>INTERNET.EXE — An Experimental Digital Art Expedition</div>
          <div style={{ marginTop: '4px', fontSize: '0.72rem' }}>
            Built with pure CSS, custom vector graphics, and Web Audio API synthesis.
          </div>
        </div>

        <button
          onClick={scrollToTop}
          onMouseEnter={playHoverSound}
          data-cursor="TOP"
          className="cyber-btn cyber-btn-outline"
          style={{ padding: '8px 18px', fontSize: '0.75rem', marginTop: '6px' }}
        >
          ▲ RETURN TO STRATOSPHERE [TOP]
        </button>
      </div>
    </footer>
  );
}
