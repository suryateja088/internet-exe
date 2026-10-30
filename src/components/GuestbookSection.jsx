import { useState, useEffect } from 'react';
import { playHoverSound, playSuccessChime } from '../utils/audio';

const DEFAULT_ENTRIES = [
  {
    id: 1,
    handle: 'neo_1999',
    avatar: '👾',
    message: 'Stumbled upon this webring while cruising through the Hypervoid at 56,600 baud. Cyberspace lives!',
    timestamp: '1998-11-24 02:41 AM',
    badge: 'DIALUP PIONEER',
    color: 'var(--neon-cyan)',
  },
  {
    id: 2,
    handle: 'vapor_ghost',
    avatar: '💾',
    message: 'Hearing the modem handshake gave me genuine goosebumps. Keep the digital flame burning.',
    timestamp: '2001-04-12 11:15 PM',
    badge: 'FLOPPY ARCHIVIST',
    color: 'var(--neon-lime)',
  },
  {
    id: 3,
    handle: 'matrix_surfer',
    avatar: '⚡',
    message: 'Best viewed in 1024x768 with a cup of warm coffee and zero notifications. Pure poetry.',
    timestamp: '2026-10-29 10:42 AM',
    badge: 'SYNTHETIC VOYAGER',
    color: 'var(--neon-pink)',
  },
];

export default function GuestbookSection() {
  const [entries, setEntries] = useState(() => {
    try {
      const saved = localStorage.getItem('internet_exe_guestbook');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_ENTRIES;
  });

  const [handle, setHandle] = useState('');
  const [message, setMessage] = useState('');
  const [avatar, setAvatar] = useState('👾');
  const [submitted, setSubmitted] = useState(false);

  const avatars = ['👾', '💾', '⚡', '🛸', '🔮', '🤖', '🪐', '📼'];

  useEffect(() => {
    try {
      localStorage.setItem('internet_exe_guestbook', JSON.stringify(entries));
    } catch {}
  }, [entries]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!handle.trim() || !message.trim()) return;

    playSuccessChime();

    const newEntry = {
      id: Date.now(),
      handle: handle.trim().toLowerCase(),
      avatar,
      message: message.trim(),
      timestamp: new Date().toLocaleString(),
      badge: 'VERIFIED NETIZEN',
      color: ['var(--neon-cyan)', 'var(--neon-lime)', 'var(--neon-pink)', 'var(--neon-orange)'][
        Math.floor(Math.random() * 4)
      ],
    };

    setEntries([newEntry, ...entries]);
    setHandle('');
    setMessage('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section
      id="guestbook"
      style={{
        position: 'relative',
        padding: '90px 20px 80px',
        zIndex: 2,
      }}
    >
      <div className="container">
        <div className="section-header">
          <div className="cyber-badge cyber-badge-orange">
            <span>★</span> THE IMMORTAL WEB ARCHIVE
          </div>
          <h2 className="section-title">THE DIGITAL GUESTBOOK</h2>
          <p className="section-subtitle">
            Leave your signature on the eternal cyberspace wall. Stored in local time-capsule storage
            alongside early web pioneers and future AI travelers.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(300px, 420px) 1fr',
            gap: '30px',
            maxWidth: '1060px',
            margin: '0 auto',
          }}
          className="guestbook-grid"
        >
          {/* Sign Guestbook Form */}
          <div
            className="retro-window"
            style={{
              padding: '24px',
              backgroundColor: 'rgba(12, 14, 22, 0.92)',
              height: 'fit-content',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-tech)',
                fontWeight: 700,
                fontSize: '1.1rem',
                color: 'var(--neon-orange)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '18px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                paddingBottom: '10px',
              }}
            >
              <span>✍</span> SIGN THE CYBER RECORD
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Handle */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.74rem',
                    color: 'var(--text-secondary)',
                    marginBottom: '6px',
                  }}
                >
                  CYBERNETIC ALIAS / HANDLE:
                </label>
                <input
                  type="text"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="e.g. cyber_voyager"
                  maxLength={24}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(255, 85, 0, 0.4)',
                    borderRadius: '4px',
                    color: '#fff',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.85rem',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Avatar Selector */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.74rem',
                    color: 'var(--text-secondary)',
                    marginBottom: '6px',
                  }}
                >
                  SELECT RETRO AVATAR ICON:
                </label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {avatars.map((av) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => {
                        setAvatar(av);
                        playHoverSound();
                      }}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '4px',
                        background: avatar === av ? 'rgba(255, 85, 0, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                        border: avatar === av ? '2px solid var(--neon-orange)' : '1px solid rgba(255, 255, 255, 0.1)',
                        fontSize: '1.2rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.74rem',
                    color: 'var(--text-secondary)',
                    marginBottom: '6px',
                  }}
                >
                  YOUR TRANSMISSION (MAX 180 CHARS):
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share a nostalgic memory, an ode to cyberspace, or a signal to the future..."
                  maxLength={180}
                  rows={4}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(255, 85, 0, 0.4)',
                    borderRadius: '4px',
                    color: '#fff',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.82rem',
                    lineHeight: 1.5,
                    outline: 'none',
                    resize: 'none',
                  }}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                onMouseEnter={playHoverSound}
                data-cursor="SIGN"
                className="cyber-btn cyber-btn-orange"
                style={{ width: '100%', padding: '12px', fontSize: '0.85rem' }}
              >
                <span>💾</span>
                <span>TRANSMIT SIGNATURE</span>
              </button>

              {submitted && (
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    color: 'var(--neon-lime)',
                    textAlign: 'center',
                    marginTop: '4px',
                  }}
                >
                  ✓ TRANSMISSION EMBEDDED IN CYBER RECORD!
                </div>
              )}
            </form>
          </div>

          {/* Guestbook Wall Entries List */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              maxHeight: '520px',
              overflowY: 'auto',
              paddingRight: '6px',
            }}
          >
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="retro-window"
                style={{
                  padding: '16px 20px',
                  backgroundColor: 'rgba(11, 13, 20, 0.85)',
                  borderColor: 'rgba(255, 255, 255, 0.08)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '8px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.4rem' }}>{entry.avatar}</span>
                    <div>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.86rem',
                          fontWeight: 700,
                          color: entry.color,
                        }}
                      >
                        @{entry.handle}
                      </span>
                      <span
                        style={{
                          marginLeft: '8px',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.62rem',
                          padding: '2px 6px',
                          borderRadius: '3px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          color: 'var(--text-muted)',
                        }}
                      >
                        {entry.badge}
                      </span>
                    </div>
                  </div>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.66rem',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {entry.timestamp}
                  </span>
                </div>

                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.82rem',
                    lineHeight: 1.55,
                    color: '#d5deef',
                    margin: 0,
                  }}
                >
                  “{entry.message}”
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .guestbook-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
