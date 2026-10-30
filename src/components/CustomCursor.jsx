import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);
  const [cursorText, setCursorText] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
      return;
    }

    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) setIsVisible(true);

      // Instantly position center dot
      gsap.to(dot, {
        x: mouseX,
        y: mouseY,
        duration: 0.08,
        ease: 'power2.out',
      });
    };

    const render = () => {
      // Smooth interpolation for outer trailing reticle
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      gsap.set(ring, { x: ringX, y: ringY });
      if (label) gsap.set(label, { x: ringX + 16, y: ringY + 16 });

      requestAnimationFrame(render);
    };
    const animId = requestAnimationFrame(render);

    const onMouseEnter = () => setIsVisible(true);
    const onMouseLeave = () => setIsVisible(false);

    // Interactive element detection
    const handleMouseOver = (e) => {
      const target = e.target.closest('button, a, input, [data-cursor], .retro-window-header, .interactive-item');
      if (target) {
        setIsHovered(true);
        const customText = target.getAttribute('data-cursor');
        if (customText) {
          setCursorText(customText);
        } else if (target.tagName === 'BUTTON') {
          setCursorText('EXEC');
        } else if (target.tagName === 'A') {
          setCursorText('LINK');
        } else if (target.classList.contains('retro-window-header')) {
          setCursorText('DRAG');
        } else {
          setCursorText('');
        }
      } else {
        setIsHovered(false);
        setCursorText('');
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseenter', onMouseEnter);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [isVisible]);

  return (
    <>
      {/* Inner Precision Dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '6px',
          height: '6px',
          marginLeft: '-3px',
          marginTop: '-3px',
          backgroundColor: '#00f0ff',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999,
          opacity: isVisible ? 1 : 0,
          boxShadow: '0 0 10px #00f0ff',
          transition: 'transform 0.15s ease, background-color 0.15s ease',
          transform: isHovered ? 'scale(1.8)' : 'scale(1)',
        }}
      />

      {/* Outer Cyber Reticle / Trailing Ring */}
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: isHovered ? '46px' : '28px',
          height: isHovered ? '46px' : '28px',
          marginLeft: isHovered ? '-23px' : '-14px',
          marginTop: isHovered ? '-23px' : '-14px',
          border: isHovered ? '1.5px solid #39ff14' : '1px dashed rgba(0, 240, 255, 0.65)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9998,
          opacity: isVisible ? 1 : 0,
          boxShadow: isHovered ? '0 0 16px rgba(57, 255, 20, 0.4)' : 'none',
          transition: 'width 0.2s cubic-bezier(0.16, 1, 0.3, 1), height 0.2s cubic-bezier(0.16, 1, 0.3, 1), margin 0.2s cubic-bezier(0.16, 1, 0.3, 1), border 0.2s ease, box-shadow 0.2s ease',
        }}
      />

      {/* Dynamic Cursor Tag/Label */}
      {cursorText && (
        <div
          ref={labelRef}
          aria-hidden="true"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            pointerEvents: 'none',
            zIndex: 9999,
            fontFamily: 'var(--font-pixel)',
            fontSize: '8px',
            color: '#39ff14',
            background: 'rgba(7, 8, 13, 0.85)',
            padding: '2px 5px',
            border: '1px solid rgba(57, 255, 20, 0.4)',
            borderRadius: '2px',
            letterSpacing: '0.05em',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.5)',
          }}
        >
          {cursorText}
        </div>
      )}
    </>
  );
}
