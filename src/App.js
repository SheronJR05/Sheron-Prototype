import './App.css';
import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────────────────────
   GRADIENT — soft warm amber (muted, not neon)
   Inspired by your image: dusty gold → soft cream
   Used ONLY on: big headings, primary CTA, stat numbers
───────────────────────────────────────────────────────────── */
const GRAD = "linear-gradient(135deg, #C8903A 0%, #E8C06A 50%, #F0D49A 100%)";
const gradText = {
  background: GRAD,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  display: "inline-block",
};

/* ─────────────────────────────────────────────────────────────
   THEMES
   DARK  — pure near-black bg, NO yellow tint anywhere
   LIGHT — clean white bg, near-black text
───────────────────────────────────────────────────────────── */
const DARK = {
  bg:          "#090909",       // pure near-black, no hue
  bgSecondary: "#101010",
  bgTertiary:  "#181818",
  surface:     "#141414",
  surface2:    "#1C1C1C",
  border:      "rgba(200,144,58,0.14)",
  borderStrong:"rgba(200,144,58,0.28)",
  text:        "#F2EDE6",       // soft warm cream-white
  text2:       "#C8BFB0",
  text3:       "#8A7D6A",
  text4:       "#4A4035",
  accent:      "#C8903A",       // muted gold — accent only, not background
  accentHover: "#D9A050",
  accentSoft:  "rgba(200,144,58,0.10)",
  shadowSm:    "0 1px 6px rgba(0,0,0,0.55)",
  shadowMd:    "0 4px 20px rgba(0,0,0,0.65)",
  shadowLg:    "0 14px 50px rgba(0,0,0,0.80)",
  navBg:       "rgba(9,9,9,0.94)",
};
const LIGHT = {
  bg:          "#FAFAFA",
  bgSecondary: "#F2F2F0",
  bgTertiary:  "#E6E2DA",
  surface:     "#FFFFFF",
  surface2:    "#F5F3EE",
  border:      "rgba(150,100,30,0.13)",
  borderStrong:"rgba(150,100,30,0.26)",
  text:        "#0F0E0B",       // near black
  text2:       "#2A2520",
  text3:       "#6A5C48",
  text4:       "#A89880",
  accent:      "#A07030",       // darker gold for light bg readability
  accentHover: "#C8903A",
  accentSoft:  "rgba(160,112,48,0.09)",
  shadowSm:    "0 1px 4px rgba(0,0,0,0.08)",
  shadowMd:    "0 4px 18px rgba(0,0,0,0.11)",
  shadowLg:    "0 14px 48px rgba(0,0,0,0.15)",
  navBg:       "rgba(250,250,250,0.93)",
};

/* ─────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────── */
const CERTS = [
  { id:1, badge:"Achievement", name:"Best Coordinator — Zenithon", issuer:"Technical Event & Hackathon", date:"2024", desc:"Awarded for leadership, execution excellence, and strategic event coordination. Recognized for managing operations, team alignment, and delivering a high-impact technical event.", highlight:true },
  { id:2, badge:"Certification", name:"Certified Penetration Tester", issuer:"Cybertronium", date:"November 2025", desc:"Focused on vulnerability assessment, network security, penetration testing methodologies, and ethical hacking practices." },
  { id:3, badge:"Certification", name:"Web Application Development", issuer:"Robowaves", date:"February 2025", desc:"Covered full-stack fundamentals, responsive UI development, and deployment practices." },
  { id:4, badge:"Certification", name:"Mobile App Development (UI/UX)", issuer:"Retech Solutions", date:"December 2024", desc:"Specialized in mobile interface design principles, user flow architecture, and usability optimization." },
  { id:5, badge:"Certification", name:"Aptis ESOL International Certificate", issuer:"British Council", date:"August 2024", desc:"Demonstrated advanced English communication proficiency across reading, writing, listening, and speaking." },
  { id:6, badge:"Publication", name:'"Gamify to Multiply" — Creative Collaborator', issuer:"Author: John Robert", date:"2024", desc:"Contributed as a creative collaborator, supporting conceptual development and interactive design perspectives." },
];
const NAV_ITEMS = ["about","skills","projects","achievements","experience","contact"];

/* ─────────────────────────────────────────────────────────────
   FLOATING PARTICLE BACKGROUND (dust/snow effect)
───────────────────────────────────────────────────────────── */
function ParticleCanvas({ dark }) {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);
  const ptRef     = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const N = Math.min(Math.floor(window.innerWidth / 7), 130);
    ptRef.current = Array.from({ length: N }, () => ({
      x:  Math.random() * window.innerWidth,
      y:  Math.random() * window.innerHeight,
      r:  Math.random() * 1.5 + 0.2,
      vx: (Math.random() - 0.5) * 0.22,
      vy: -(Math.random() * 0.28 + 0.08),
      o:  Math.random() * 0.55 + 0.08,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ptRef.current.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.y < -4) { p.y = canvas.height + 4; p.x = Math.random() * canvas.width; }
        if (p.x < -4) p.x = canvas.width + 4;
        if (p.x > canvas.width + 4) p.x = -4;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = dark
          ? `rgba(200,144,58,${p.o * 0.40})`
          : `rgba(160,112,48,${p.o * 0.25})`;
        ctx.fill();
      });
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener("resize", resize); };
  }, [dark]);

  return <canvas ref={canvasRef} style={{ position:"fixed",top:0,left:0,zIndex:0,pointerEvents:"none",width:"100%",height:"100%" }} />;
}

/* ─────────────────────────────────────────────────────────────
   CUSTOM CURSOR — golden fading trail (canvas-based)
   Old dot+circle approach is commented out below.
───────────────────────────────────────────────────────────── */
function CustomCursor() {
  const dotRef    = useRef(null);
  const ringRef   = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const onMove = e => {
      const x = e.clientX, y = e.clientY;
      if (dotRef.current)  { dotRef.current.style.left  = x + "px"; dotRef.current.style.top  = y + "px"; }
      if (ringRef.current) { ringRef.current.style.left = x + "px"; ringRef.current.style.top = y + "px"; }
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <>
      <div ref={dotRef}  style={{ position:"fixed",zIndex:9999,pointerEvents:"none",width:7,height:7,
        borderRadius:"50%",background:GRAD,transform:"translate(-50%,-50%)",left:"-300px",top:"-300px" }} />
      <div ref={ringRef} style={{ position:"fixed",zIndex:9998,pointerEvents:"none",width:30,height:30,
        borderRadius:"50%",border:"1.5px solid #C8903A",opacity:0.40,
        transform:"translate(-50%,-50%) scale(1)",transition:"left .08s ease,top .08s ease",left:"-300px",top:"-300px" }} />
    </>
  );
}

/* ── COMMENTED OUT: golden fading trail (canvas) cursor ──────────
function CustomCursorTrail() {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);
  const trail     = useRef([]);
  const mouse     = useRef({ x: -300, y: -300 });

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const onMove = e => { mouse.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", onMove);

    const TRAIL = 32;   // trail length
    const HEAD  = 6;    // head dot radius

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // push new position
      trail.current.push({ x: mouse.current.x, y: mouse.current.y });
      if (trail.current.length > TRAIL) trail.current.shift();

      trail.current.forEach((pt, i) => {
        const frac  = (i + 1) / trail.current.length; // 0..1, tail→head
        const r     = HEAD * frac;
        const alpha = frac * 0.80;

        const grd = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, r * 1.6);
        grd.addColorStop(0,   `rgba(245,218,140,${alpha})`);
        grd.addColorStop(0.5, `rgba(200,144,58,${alpha * 0.6})`);
        grd.addColorStop(1,   `rgba(200,100,20,0)`);

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, r * 1.6, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      });

      rafRef.current = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas ref={canvasRef}
      style={{ position:"fixed",top:0,left:0,zIndex:9999,pointerEvents:"none",
               width:"100%",height:"100%" }}
    />
  );
}
────────────────────────────────────────────────────────── */

/* ─────────────────────────────────────────────────────────────
   HOOKS
───────────────────────────────────────────────────────────── */
function useScrollSpy() {
  const [active, setActive] = useState("");
  useEffect(() => {
    const h = () => {
      const y = window.scrollY + 90;
      for (const id of [...NAV_ITEMS].reverse()) {
        const el = document.getElementById(id);
        if (el && y >= el.offsetTop) { setActive(id); return; }
      }
      setActive("");
    };
    window.addEventListener("scroll", h, { passive:true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  return active;
}

function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(entries =>
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("revealed"); io.unobserve(e.target); } }),
      { threshold: 0.08 }
    );
    document.querySelectorAll(".reveal").forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ─────────────────────────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────────────────────────── */
const GlobalStyles = ({ t }) => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500&family=DM+Mono:wght@300;400&display=swap');

    *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
    html, body, #root { width:100%; min-width:0; }
    html { scroll-behavior:smooth; font-size:16px; }
    body {
      font-family:'Inter','Helvetica Neue',sans-serif;
      background:${t.bg}; color:${t.text};
      -webkit-font-smoothing:antialiased;
      overflow-x:hidden;
      transition:background .4s, color .4s;
      cursor:none;
    }
    @media (pointer:coarse) { body,a,button { cursor:auto !important; } }
    a { text-decoration:none; color:inherit; cursor:none; }
    button { cursor:none; }
    img { display:block; max-width:100%; }

    .reveal { opacity:0; transform:translateY(24px); transition:opacity .7s ease, transform .7s ease; }
    .reveal.d1 { transition-delay:.12s; }
    .reveal.d2 { transition-delay:.24s; }
    .reveal.d3 { transition-delay:.36s; }
    .reveal.revealed { opacity:1; transform:translateY(0); }

    ::-webkit-scrollbar { width:4px; }
    ::-webkit-scrollbar-track { background:${t.bg}; }
    ::-webkit-scrollbar-thumb { background:${t.bgTertiary}; border-radius:2px; }

    /* MODAL */
    .modal-overlay { position:fixed;inset:0;z-index:500;background:rgba(0,0,0,0.78);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeIn .2s ease; }
    .modal-box { background:${t.surface};border:1px solid ${t.border};border-radius:20px;box-shadow:${t.shadowLg};width:100%;max-width:520px;overflow:hidden;animation:slideUp .25s ease; }
    .modal-img { width:100%;height:175px;background:linear-gradient(135deg,${t.bgTertiary},${t.bgSecondary});display:flex;align-items:center;justify-content:center;position:relative; }
    .modal-img-corner { position:absolute;width:34px;height:34px;border-color:#C8903A;border-style:solid; }
    .modal-body { padding:24px 26px 28px; }
    .modal-close { position:absolute;top:12px;right:12px;width:30px;height:30px;border-radius:50%;background:${t.bgTertiary};border:none;font-size:.9rem;color:${t.text3};display:flex;align-items:center;justify-content:center;transition:background .2s,color .2s;cursor:none; }
    .modal-close:hover { background:#C8903A;color:#fff; }

    /* MOBILE NAV */
    .mobile-menu { display:none;position:fixed;top:52px;left:0;right:0;background:${t.navBg};backdrop-filter:blur(20px);border-bottom:1px solid ${t.border};padding:10px 20px 16px;z-index:199;flex-direction:column; }
    .mobile-menu.open { display:flex; }
    .mobile-menu a { font-size:.88rem;color:${t.text3};padding:11px 0;border-bottom:1px solid ${t.border};transition:color .2s;text-transform:capitalize;display:block; }
    .mobile-menu-footer { padding-top:12px;display:flex;align-items:center;gap:10px; }

    /* TOGGLE */
    .toggle-track { width:38px;height:22px;border-radius:11px;background:${t.bgTertiary};position:relative;cursor:none;border:1px solid ${t.border};flex-shrink:0;transition:background .3s; }
    .toggle-track.on { background:#C8903A;border-color:#C8903A; }
    .toggle-thumb { position:absolute;top:3px;left:3px;width:14px;height:14px;border-radius:50%;background:#fff;transition:transform .25s ease;box-shadow:0 1px 3px rgba(0,0,0,.25); }
    .toggle-track.on .toggle-thumb { transform:translateX(16px); }

    /* PHOTO */
    .photo-frame { border-radius:20px;overflow:hidden;position:relative;border:1px solid ${t.border};box-shadow:${t.shadowLg};background:${t.bgSecondary};flex-shrink:0; }
    .photo-frame img { width:100%;height:100%;object-fit:cover;object-position:top center; }
    .photo-placeholder { width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px; }

    /* RESPONSIVE */
    @media (max-width:768px) {
      .hero-grid       { grid-template-columns:1fr !important; text-align:center; }
      .hero-photo-col  { display:flex;flex-direction:column;align-items:center;justify-content:center;order:-1;margin-bottom:22px; }
      .mobile-hero-label { display:flex !important; }
      .hero-desktop-title { display:none !important; }
      .photo-frame     { width:185px !important;height:235px !important; }
      .hero-btns       { justify-content:center !important; }
      .hero-stats      { justify-content:center !important;flex-wrap:wrap;gap:14px !important; }
      .hero-stats > div{ border-right:none !important;padding-right:0 !important;margin-right:0 !important;min-width:60px; }
      .about-grid      { grid-template-columns:1fr !important; }
      .skills-grid     { grid-template-columns:1fr !important; }
      .proj-card-inner { grid-template-columns:1fr !important; }
      .certs-grid      { grid-template-columns:1fr !important; }
      .exp-grid        { grid-template-columns:1fr !important; }
      .contact-grid    { grid-template-columns:1fr !important; }
      .nav-links-desktop { display:none !important; }
      .hamburger-btn   { display:flex !important; }
      .section         { padding:70px 20px 50px !important; }
      .section-wide    { padding:50px 20px !important; }
      .hero-section    { padding:110px 20px 72px 20px !important; }
      .hero-name       { font-size:clamp(2.1rem,9vw,3rem) !important; }
    }
    @media (max-width:480px) {
      .photo-frame { width:150px !important;height:190px !important; }
    }

    @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
    @keyframes slideUp { from{opacity:0;transform:translateY(16px) scale(.97)} to{opacity:1;transform:none} }
    @keyframes fadeUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
    @keyframes spin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  `}</style>
);

/* ─────────────────────────────────────────────────────────────
   SMALL COMPONENTS
───────────────────────────────────────────────────────────── */
const Toggle = ({ dark, onToggle }) => (
  <button onClick={onToggle} className={`toggle-track${dark?" on":""}`} aria-label="Toggle theme">
    <div className="toggle-thumb" />
  </button>
);

const Badge = ({ label, highlight, t }) => (
  <span style={{
    display:"inline-block",fontSize:".6rem",fontWeight:600,letterSpacing:".07em",
    padding:"3px 10px",borderRadius:980,
    background: highlight ? "rgba(200,144,58,0.12)" : t.surface2,
    color: highlight ? "#C8903A" : t.text3,
    textTransform:"uppercase",marginBottom:10,fontFamily:"'DM Mono',monospace",
    border: highlight ? "1px solid rgba(200,144,58,0.25)" : `1px solid ${t.border}`,
  }}>{label}</span>
);

const Divider = ({ t }) => (
  <div style={{ height:1, background:`linear-gradient(90deg,transparent,${t.border},transparent)`, maxWidth:1400, margin:"0 auto" }} />
);

const SLabel = ({ children, t }) => (
  <div style={{ fontFamily:"'DM Mono',monospace",fontSize:".63rem",letterSpacing:".1em",color:t.accent,textTransform:"uppercase",marginBottom:10 }}>{children}</div>
);

/* BIG HEADING — Space Grotesk + gradient text */
const STitle = ({ children }) => (
  <h2 style={{ fontFamily:"'Space Grotesk',sans-serif",fontSize:"clamp(1.8rem,4vw,2.8rem)",fontWeight:700,letterSpacing:"-.03em",marginBottom:36,lineHeight:1.1,...gradText }}>
    {children}
  </h2>
);

/* ─────────────────────────────────────────────────────────────
   RESUME BUTTON with download feedback
───────────────────────────────────────────────────────────── */
const ResumeBtn = ({ t }) => {
  const [downloaded, setDownloaded] = useState(false);
  return (
    <a
      href="/resume.pdf"
      download="JR_Sheron_Resume.pdf"
      onClick={() => { setDownloaded(true); setTimeout(()=>setDownloaded(false), 3500); }}
      style={{
        fontFamily:"'Space Grotesk',sans-serif",fontSize:".82rem",fontWeight:500,
        padding:"11px 26px",borderRadius:980,
        border:`1.5px solid ${downloaded ? "#5CB85C" : t.accent}`,
        color: downloaded ? "#5CB85C" : t.accent,
        background: downloaded ? "rgba(92,184,92,0.10)" : "transparent",
        display:"inline-flex",alignItems:"center",gap:7,
        transition:"all .3s",
      }}
      onMouseEnter={e=>{ if(!downloaded){ e.currentTarget.style.background=t.accentSoft; e.currentTarget.style.transform="translateY(-2px)"; }}}
      onMouseLeave={e=>{ e.currentTarget.style.background=downloaded?"rgba(92,184,92,0.10)":"transparent"; e.currentTarget.style.transform="translateY(0)"; }}
    >
      {downloaded ? (
        <><svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{flexShrink:0}}><path d="M2 7l3.5 3.5L12 3.5" stroke="#5CB85C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> Downloaded</>
      ) : "↓ Resume"}
    </a>
  );
};

/* ─────────────────────────────────────────────────────────────
   SEND BUTTON with submission feedback
───────────────────────────────────────────────────────────── */
const SendBtn = ({ t }) => {
  const [sent, setSent] = useState(false);
  return (
    <button
      type="submit"
      onClick={() => {}}
      id="send-btn-inner"
      style={{
        alignSelf:"flex-start",fontFamily:"'Space Grotesk',sans-serif",
        fontSize:".82rem",fontWeight:600,padding:"12px 28px",
        borderRadius:980,border:"none",
        background: sent ? "#5CB85C" : GRAD,
        color:"#1A1200",
        boxShadow: sent ? "0 2px 16px rgba(92,184,92,0.30)" : "0 2px 16px rgba(200,144,58,0.28)",
        transition:"all .3s",
      }}
      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";}}
      onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";}}
    >
      {sent ? (
        <span style={{display:"flex",alignItems:"center",gap:7}}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7l3.5 3.5L12 3.5" stroke="#1A1200" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Sent
        </span>
      ) : "Send Message"}
    </button>
  );
};

/* ─────────────────────────────────────────────────────────────
   MODAL — level 1: info card  |  level 2: full image view
───────────────────────────────────────────────────────────── */
const Modal = ({ cert, onClose, t }) => {
  const [imgView, setImgView] = useState(false);

  useEffect(() => {
    const h = e => { if (e.key==="Escape") { if(imgView) setImgView(false); else onClose(); } };
    document.addEventListener("keydown",h);
    return () => document.removeEventListener("keydown",h);
  },[onClose, imgView]);

  /* FULL IMAGE VIEW */
  if (imgView) return (
    <div className="modal-overlay" onClick={e=>{if(e.target===e.currentTarget) setImgView(false);}}>
      <div style={{position:"relative",width:"100%",maxWidth:780,animation:"slideUp .25s ease"}}>
        {/* Back arrow */}
        <button onClick={()=>setImgView(false)} style={{
          position:"absolute",top:-44,left:0,
          display:"flex",alignItems:"center",gap:8,
          background:"none",border:"none",color:"#F2EDE6",
          fontFamily:"'Space Grotesk',sans-serif",fontSize:".84rem",fontWeight:500,
          cursor:"none",opacity:.85,transition:"opacity .2s",
        }}
        onMouseEnter={e=>e.currentTarget.style.opacity="1"}
        onMouseLeave={e=>e.currentTarget.style.opacity=".85"}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12 4L6 10L12 16" stroke="#F2EDE6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to details
        </button>
        {/* Full image area */}
        <div style={{
          width:"100%",minHeight:420,borderRadius:16,overflow:"hidden",
          background:`linear-gradient(135deg,${t.bgTertiary},${t.bgSecondary})`,
          border:`1px solid ${t.border}`,
          display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16,
          padding:40,
        }}>
          <div style={{fontSize:"4rem",opacity:.3}}>{cert.badge==="Publication"?"📖":"🎓"}</div>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:".65rem",letterSpacing:".1em",color:t.text4,textTransform:"uppercase",textAlign:"center"}}>
            Certificate image goes here<br/>
            <span style={{fontSize:".58rem",marginTop:6,display:"block",opacity:.6}}>Replace with: cert.image src</span>
          </div>
        </div>
      </div>
    </div>
  );

  /* INFO VIEW (level 1) */
  return (
    <div className="modal-overlay" onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div className="modal-box" style={{position:"relative"}}>
        {/* Clickable image area → goes to full image */}
        <div className="modal-img" onClick={()=>setImgView(true)} style={{cursor:"none",position:"relative"}}>
          {[{t:13,l:13,bw:"2px 0 0 2px",br:"4px 0 0 0"},{t:13,r:13,bw:"2px 2px 0 0",br:"0 4px 0 0"},{b:13,l:13,bw:"0 0 2px 2px",br:"0 0 0 4px"},{b:13,r:13,bw:"0 2px 2px 0",br:"0 0 4px 0"}].map((c,i)=>(
            <div key={i} className="modal-img-corner" style={{top:c.t,left:c.l,bottom:c.b,right:c.r,borderWidth:c.bw,borderRadius:c.br}}/>
          ))}
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:"2rem",marginBottom:8,opacity:.28}}>{cert.badge==="Publication"?"📖":"🎓"}</div>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:".63rem",letterSpacing:".08em",color:t.text4,textTransform:"uppercase"}}>Click to view full image</div>
          </div>
          {/* Expand hint */}
          <div style={{position:"absolute",bottom:10,right:12,fontSize:".6rem",color:t.text4,fontFamily:"'DM Mono',monospace",letterSpacing:".05em",display:"flex",alignItems:"center",gap:5}}>
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M7 1h3v3M4 10H1V7M10 1L6 5M1 10l4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
            expand
          </div>
        </div>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-body">
          <Badge label={cert.badge} highlight={cert.highlight} t={t}/>
          <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:"1.08rem",fontWeight:600,color:t.text,marginBottom:6,lineHeight:1.3}}>{cert.name}</div>
          <div style={{fontSize:".75rem",color:t.accent,fontWeight:500,marginBottom:4}}>{cert.issuer}</div>
          <div style={{fontSize:".69rem",color:t.text4,marginBottom:14,fontFamily:"'DM Mono',monospace"}}>{cert.date}</div>
          <div style={{fontSize:".87rem",color:t.text3,lineHeight:1.8,fontWeight:300}}>{cert.desc}</div>
        </div>
      </div>
    </div>
  );
};

/* CERT CARD */
const CertCard = ({ cert, onClick, t, style={} }) => (
  <div onClick={()=>onClick(cert)} style={{
    padding:"20px 22px",borderRadius:14,cursor:"none",
    background: cert.highlight ? "rgba(200,144,58,0.06)" : t.surface,
    border: `1px solid ${cert.highlight ? "rgba(200,144,58,0.30)" : t.border}`,
    boxShadow:t.shadowSm,transition:"all .22s",...style,
  }}
  onMouseEnter={e=>{e.currentTarget.style.boxShadow=t.shadowMd;e.currentTarget.style.transform="translateY(-3px)";}}
  onMouseLeave={e=>{e.currentTarget.style.boxShadow=t.shadowSm;e.currentTarget.style.transform="translateY(0)";}}>
    <Badge label={cert.badge} highlight={cert.highlight} t={t}/>
    <div style={{fontSize:".9rem",fontWeight:600,color:cert.highlight?t.accent:t.text,marginBottom:4,letterSpacing:"-.01em"}}>{cert.name}</div>
    <div style={{fontSize:".73rem",color:t.text3,fontWeight:500,marginBottom:2}}>{cert.issuer}</div>
    <div style={{fontSize:".66rem",color:t.text4,fontFamily:"'DM Mono',monospace"}}>{cert.date}</div>
    {cert.highlight&&<div style={{fontSize:".82rem",color:t.text3,lineHeight:1.7,fontWeight:300,marginTop:10}}>{cert.desc}</div>}
    <div style={{marginTop:12,fontSize:".69rem",color:t.accent,fontFamily:"'DM Mono',monospace",letterSpacing:".04em"}}>View details →</div>
  </div>
);

/* SKILL ROW */
const SkillRow = ({ name, t }) => (
  <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:10}}>
    <div style={{width:5,height:5,borderRadius:"50%",background:t.accent,flexShrink:0,opacity:.7}}/>
    <span style={{fontSize:".84rem",color:t.text2,fontWeight:400}}>{name}</span>
  </div>
);

/* EXP CARD */
const ExpCard = ({ role, org, dur, desc, isEvent, t }) => (
  <div style={{
    padding:"20px 22px",borderRadius:14,
    background: isEvent ? "rgba(200,144,58,0.06)" : t.surface,
    border:`1px solid ${isEvent?"rgba(200,144,58,0.25)":t.border}`,
    boxShadow:t.shadowSm,transition:"all .22s",
  }}
  onMouseEnter={e=>{e.currentTarget.style.boxShadow=t.shadowMd;e.currentTarget.style.transform="translateY(-2px)";}}
  onMouseLeave={e=>{e.currentTarget.style.boxShadow=t.shadowSm;e.currentTarget.style.transform="translateY(0)";}}>
    <div style={{fontSize:".9rem",fontWeight:600,color:t.text,marginBottom:3}}>{role}</div>
    <div style={{fontSize:".74rem",color:t.accent,fontWeight:500,marginBottom:2}}>{org}</div>
    <div style={{fontSize:".66rem",color:t.text4,marginBottom:8,fontFamily:"'DM Mono',monospace"}}>{dur}</div>
    <div style={{fontSize:".83rem",color:t.text3,lineHeight:1.75,fontWeight:300}}>{desc}</div>
  </div>
);

/* ─────────────────────────────────────────────────────────────
   BACK TO TOP — fixed bottom-right, visible only past hero
───────────────────────────────────────────────────────────── */
function BackToTop({ t }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");
    const onScroll = () => {
      const bottom = hero ? hero.getBoundingClientRect().bottom : 0;
      setShow(bottom < 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      style={{
        position: "fixed", bottom: 28, right: 28, zIndex: 400,
        width: 46, height: 46, borderRadius: "50%",
        background: t.surface,
        border: `1.5px solid ${t.borderStrong}`,
        boxShadow: t.shadowMd,
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "none",
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0) scale(1)" : "translateY(12px) scale(0.8)",
        pointerEvents: show ? "auto" : "none",
        transition: "opacity .3s ease, transform .3s ease, background .2s, box-shadow .2s",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = GRAD;
        e.currentTarget.style.boxShadow = "0 6px 28px rgba(200,144,58,0.45)";
        e.currentTarget.style.borderColor = "transparent";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = t.surface;
        e.currentTarget.style.boxShadow = t.shadowMd;
        e.currentTarget.style.borderColor = t.borderStrong;
      }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 12.5V3.5M3.5 8L8 3.5L12.5 8"
          stroke={t.accent} strokeWidth="1.8"
          strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────
   EMAILJS CONFIG — replace with your actual IDs from emailjs.com
───────────────────────────────────────────────────────────── */
const EMAILJS_SERVICE_ID  = "YOUR_SERVICE_ID";   // e.g. "service_abc123"
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";  // e.g. "template_xyz789"
const EMAILJS_PUBLIC_KEY  = "YOUR_PUBLIC_KEY";   // e.g. "user_AbCdEfGhIj"

/* ─────────────────────────────────────────────────────────────
   CONTACT FORM — EmailJS integration
───────────────────────────────────────────────────────────── */
const ContactForm = ({ t }) => {
  const [status,  setStatus]  = useState("idle"); // idle | sending | sent | error
  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [message, setMessage] = useState("");
  const [err,     setErr]     = useState(false);

  const allFilled = name.trim() !== "" && email.trim() !== "" && message.trim() !== "";
  const sending   = status === "sending";
  const sent      = status === "sent";
  const hasError  = status === "error";

  const handleSubmit = async e => {
    e.preventDefault();
    if (!allFilled) { setErr(true); setTimeout(() => setErr(false), 3000); return; }

    setStatus("sending");

    try {
      // Dynamically load EmailJS SDK
      if (!window.emailjs) {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
        window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
      }

      await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        from_name:  name.trim(),
        from_email: email.trim(),
        message:    message.trim(),
        to_email:   "sheronuzi99@gmail.com",
      });

      setStatus("sent");
      setTimeout(() => {
        setStatus("idle");
        setName(""); setEmail(""); setMessage("");
      }, 5000);

    } catch (e) {
      console.error("EmailJS error:", e);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  const inputStyle = (val) => ({
    width:"100%", background:t.bgSecondary,
    border:`1px solid ${val.trim() ? t.accent+"55" : t.border}`,
    borderRadius:10, color:t.text,
    padding:"11px 14px", fontFamily:"inherit",
    fontSize:".87rem", fontWeight:300,
    outline:"none", transition:"border-color .2s, box-shadow .2s",
    opacity: sending ? 0.5 : 1,
  });

  return (
    <div className="reveal d1" style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:18,padding:"28px 26px",boxShadow:t.shadowSm}}>
      <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:".88rem",fontWeight:600,color:t.text,marginBottom:18,letterSpacing:"-.01em"}}>Send a message</div>

      {/* ── SUCCESS BANNER ── */}
      {sent && (
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"14px 16px",borderRadius:12,background:"rgba(74,154,90,0.10)",border:"1px solid rgba(74,154,90,0.28)",marginBottom:14,animation:"fadeUp .3s ease"}}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{flexShrink:0}}>
            <circle cx="9" cy="9" r="8.5" stroke="#4A9A5A" strokeWidth="1.2"/>
            <path d="M5 9l2.8 2.8L13 6" stroke="#4A9A5A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div>
            <div style={{fontSize:".8rem",fontWeight:600,color:"#4A9A5A",marginBottom:1}}>Message sent!</div>
            <div style={{fontSize:".73rem",color:"#4A9A5A",opacity:.85}}>Delivered to sheronuzi99@gmail.com</div>
          </div>
        </div>
      )}

      {/* ── ERROR BANNER ── */}
      {hasError && (
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",borderRadius:12,background:"rgba(192,96,74,0.09)",border:"1px solid rgba(192,96,74,0.25)",marginBottom:14,animation:"fadeUp .3s ease"}}>
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{flexShrink:0}}>
            <circle cx="7.5" cy="7.5" r="7" stroke="#C0604A" strokeWidth="1.2"/>
            <path d="M7.5 4.5v3.5M7.5 10v.5" stroke="#C0604A" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <div style={{fontSize:".78rem",color:"#C0604A"}}>Something went wrong. Please try again or email directly.</div>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{display:"flex",flexDirection:"column",gap:14}}>

        <div>
          <label style={{fontSize:".7rem",fontWeight:500,color:t.text3,display:"block",marginBottom:5}}>Name</label>
          <input type="text" placeholder="Your name" value={name} onChange={e=>setName(e.target.value)} disabled={sending}
            style={inputStyle(name)}
            onFocus={e=>{e.target.style.borderColor=t.accent;e.target.style.boxShadow=`0 0 0 3px ${t.accentSoft}`;}}
            onBlur={e=>{e.target.style.borderColor=name.trim()?t.accent+"55":t.border;e.target.style.boxShadow="none";}}/>
        </div>

        <div>
          <label style={{fontSize:".7rem",fontWeight:500,color:t.text3,display:"block",marginBottom:5}}>Email</label>
          <input type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} disabled={sending}
            style={inputStyle(email)}
            onFocus={e=>{e.target.style.borderColor=t.accent;e.target.style.boxShadow=`0 0 0 3px ${t.accentSoft}`;}}
            onBlur={e=>{e.target.style.borderColor=email.trim()?t.accent+"55":t.border;e.target.style.boxShadow="none";}}/>
        </div>

        <div>
          <label style={{fontSize:".7rem",fontWeight:500,color:t.text3,display:"block",marginBottom:5}}>Message</label>
          <textarea placeholder="Tell me about your project..." rows={4} value={message} onChange={e=>setMessage(e.target.value)} disabled={sending}
            style={{...inputStyle(message),resize:"none"}}
            onFocus={e=>{e.target.style.borderColor=t.accent;e.target.style.boxShadow=`0 0 0 3px ${t.accentSoft}`;}}
            onBlur={e=>{e.target.style.borderColor=message.trim()?t.accent+"55":t.border;e.target.style.boxShadow="none";}}/>
        </div>

        {/* Field error nudge */}
        {err && (
          <div style={{fontSize:".75rem",color:"#C0604A",display:"flex",alignItems:"center",gap:6,animation:"fadeUp .25s ease"}}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <circle cx="6.5" cy="6.5" r="6" stroke="#C0604A" strokeWidth="1.2"/>
              <path d="M6.5 4v3M6.5 9v.5" stroke="#C0604A" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
            Please fill in all fields before sending.
          </div>
        )}

        <button type="submit" disabled={sending} style={{
          alignSelf:"flex-start", fontFamily:"'Space Grotesk',sans-serif",
          fontSize:".82rem", fontWeight:600, padding:"12px 28px",
          borderRadius:980, border:"none",
          background: sent ? "#4A9A5A" : allFilled ? GRAD : t.surface2,
          color: sent ? "#fff" : allFilled ? "#1A1200" : t.text4,
          boxShadow: sent ? "0 2px 16px rgba(74,154,90,0.30)"
                   : allFilled ? "0 2px 16px rgba(200,144,58,0.28)"
                   : "none",
          transition:"all .3s", display:"flex", alignItems:"center", gap:8,
          cursor: sending ? "wait" : "none",
          opacity: sending ? 0.75 : 1,
        }}
        onMouseEnter={e=>{if(allFilled && !sending && !sent) e.currentTarget.style.transform="translateY(-2px)";}}
        onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";}}>
          {sending ? (
            <>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{animation:"spin .9s linear infinite"}}>
                <circle cx="7" cy="7" r="5.5" stroke="#1A1200" strokeWidth="1.8" strokeDasharray="20 14" strokeLinecap="round"/>
              </svg>
              Sending…
            </>
          ) : sent ? (
            <>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7l3.5 3.5L12 3.5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Sent!
            </>
          ) : allFilled ? "Send Message" : "Fill in all fields"}
        </button>
      </form>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   MAIN APP
───────────────────────────────────────────────────────────── */
export default function Portfolio() {
  const [dark,     setDark]     = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [modal,    setModal]    = useState(null);
  const t      = dark ? DARK : LIGHT;
  const active = useScrollSpy();
  useReveal();

  useEffect(() => {
    const saved = localStorage.getItem("jrs-theme");
    if (saved) setDark(saved === "dark");
    else setDark(true);
  }, []);

  const toggleTheme = () => setDark(d => {
    localStorage.setItem("jrs-theme", !d ? "dark" : "light");
    return !d;
  });

  const scrollTo = id => { document.getElementById(id)?.scrollIntoView({ behavior:"smooth" }); setMenuOpen(false); };

  const S = {
    section:     { padding:"100px 48px 72px", width:"100%" },
    sectionWide: { padding:"72px 48px",       width:"100%" },
  };

  return (
    <>
      <GlobalStyles t={t} />
      <CustomCursor />
      <ParticleCanvas dark={dark} />

      {/* content sits above canvas */}
      <div style={{ position:"relative", zIndex:1, width:"100vw", minWidth:0, boxSizing:"border-box" }}>

      {/* ── NAV ─────────────────────────────────────────────── */}
      <nav style={{
        position:"fixed",top:0,left:0,right:0,zIndex:200,height:52,
        display:"flex",alignItems:"center",justifyContent:"space-between",
        padding:"0 48px",
        background:t.navBg,borderBottom:`1px solid ${t.border}`,
        backdropFilter:"saturate(180%) blur(20px)",
        WebkitBackdropFilter:"saturate(180%) blur(20px)",
        transition:"background .4s,border-color .4s",
      }}>
        <button onClick={()=>window.scrollTo({top:0,behavior:"smooth"})} style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:".95rem",fontWeight:700,letterSpacing:"-.02em",background:"none",border:"none",padding:0,...gradText}}>
          J.R. Sheron
        </button>

        <div className="nav-links-desktop" style={{display:"flex",gap:24,position:"absolute",left:"50%",transform:"translateX(-50%)"}}>
          {NAV_ITEMS.map(id=>(
            <button key={id} onClick={()=>scrollTo(id)} style={{
              background:"none",border:"none",
              fontSize:".74rem",fontWeight:500,textTransform:"capitalize",
              color: active===id ? t.text : t.text3,
              fontFamily:"'Inter',sans-serif",
              transition:"color .2s",padding:"4px 0",
              borderBottom: active===id ? `1.5px solid ${t.accent}` : "1.5px solid transparent",
            }}>{id}</button>
          ))}
        </div>

        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <span style={{fontSize:".63rem",color:t.text4,fontFamily:"'DM Mono',monospace"}}>{dark?"Dark":"Light"}</span>
          <Toggle dark={dark} onToggle={toggleTheme} />
          <button className="hamburger-btn" onClick={()=>setMenuOpen(o=>!o)}
            style={{display:"none",flexDirection:"column",gap:4,background:"none",border:"none",padding:4}}>
            {[0,1,2].map(i=><span key={i} style={{display:"block",width:18,height:1.5,background:t.text3,borderRadius:1}}/>)}
          </button>
        </div>
      </nav>

      {/* mobile menu */}
      <div className={`mobile-menu${menuOpen?" open":""}`} style={{background:t.navBg,borderBottom:`1px solid ${t.border}`}}>
        {NAV_ITEMS.map(id=>(
          <a key={id} href={`#${id}`} onClick={()=>{scrollTo(id);setMenuOpen(false);}} style={{color:active===id?t.accent:t.text3}}>{id}</a>
        ))}
        <div className="mobile-menu-footer">
          <span style={{fontSize:".65rem",color:t.text4,fontFamily:"'DM Mono',monospace"}}>Theme</span>
          <Toggle dark={dark} onToggle={toggleTheme}/>
        </div>
      </div>

      {/* ── HERO ────────────────────────────────────────────── */}
      <section id="hero" style={{minHeight:"100vh",display:"flex",alignItems:"center",padding:"110px 48px 72px 120px",width:"100%"}}>
        <div className="hero-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"clamp(40px,5vw,80px)",alignItems:"center",width:"100%"}}>

          <div>
            <div className="hero-desktop-title">
              <div style={{fontFamily:"'DM Mono',monospace",fontSize:".63rem",letterSpacing:".1em",color:t.accent,textTransform:"uppercase",marginBottom:16,opacity:0,animation:"fadeUp .7s .1s ease both"}}>
                Portfolio · 2025
              </div>
              {/* BIG NAME — gradient text, Space Grotesk */}
              <h1 className="hero-name" style={{
                fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,
                fontSize:"clamp(2.8rem,6vw,4.6rem)",
                letterSpacing:"-.04em",lineHeight:1.04,marginBottom:14,
                opacity:0,animation:"fadeUp .8s .2s ease both",
                ...gradText,
              }}>J.R. Sheron</h1>
            </div>

            <p style={{fontSize:"1.05rem",fontWeight:400,color:t.text2,letterSpacing:"-.01em",marginBottom:16,opacity:0,animation:"fadeUp .8s .32s ease both"}}>
              UX/UI Designer & Frontend Developer
            </p>
            <p style={{fontSize:".95rem",color:t.text3,lineHeight:1.85,marginBottom:34,fontWeight:300,opacity:0,animation:"fadeUp .8s .42s ease both"}}>
              I build intelligent digital experiences at the intersection of design, AI, and interaction systems — turning complex ideas into intuitive, visually precise journeys.
            </p>

            {/* BUTTONS */}
            <div className="hero-btns" style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:44,opacity:0,animation:"fadeUp .8s .52s ease both"}}>

              {/* View Work — gradient fill */}
              <button onClick={()=>scrollTo("projects")} style={{
                fontFamily:"'Space Grotesk',sans-serif",fontSize:".82rem",fontWeight:600,
                padding:"12px 28px",borderRadius:980,border:"none",
                background:GRAD,color:"#1A1200",
                boxShadow:"0 2px 18px rgba(200,144,58,0.30)",transition:"all .2s",
              }}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 6px 26px rgba(200,144,58,0.45)";}}
              onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 2px 18px rgba(200,144,58,0.30)";}}>
                View Work
              </button>

              {/* Resume — outline, download */}
              <ResumeBtn t={t} />
            </div>

            {/* STATS — gradient numbers */}
            <div className="hero-stats" style={{display:"flex",paddingTop:28,borderTop:`1px solid ${t.border}`,opacity:0,animation:"fadeUp .8s .65s ease both"}}>
              {[["3+","Years designing"],["4","Certifications"],["3","Internships"],["2","Projects"]].map(([n,l],i)=>(
                <div key={i} style={{flex:1,minWidth:68,paddingRight:i<3?20:0,marginRight:i<3?20:0,borderRight:i<3?`1px solid ${t.border}`:"none"}}>
                  <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:"1.8rem",fontWeight:700,lineHeight:1,...gradText}}>{n}</div>
                  <div style={{fontSize:".67rem",color:t.text4,marginTop:5}}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* PHOTO */}
          <div className="hero-photo-col" style={{opacity:0,animation:"fadeUp .9s .28s ease both",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
            {/* mobile-only label above photo */}
            <div className="mobile-hero-label" style={{display:"none",flexDirection:"column",alignItems:"center",marginBottom:22}}>
              <div style={{fontFamily:"'DM Mono',monospace",fontSize:".6rem",letterSpacing:".1em",color:t.accent,textTransform:"uppercase",marginBottom:6}}>Portfolio · 2025</div>
              <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:"clamp(1.6rem,7vw,2.2rem)",fontWeight:700,letterSpacing:"-.03em",...gradText,textAlign:"center"}}>J.R. Sheron</div>
            </div>
            <div className="photo-frame" style={{width:300,height:380}}>
              {/* <img src="your-photo.jpg" alt="J.R. Sheron" /> */}
              <div className="photo-placeholder">
                <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
                  <circle cx="26" cy="19" r="11" fill={t.text4} opacity=".28"/>
                  <path d="M4 50c0-12.15 9.85-22 22-22s22 9.85 22 22" stroke={t.text4} strokeWidth="2" opacity=".18" fill="none"/>
                </svg>
                <span style={{fontSize:".68rem",color:t.text4,textAlign:"center",lineHeight:1.5,fontFamily:"'DM Mono',monospace",marginTop:4}}>Your photo<br/>goes here</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      <Divider t={t}/>

      {/* ── ABOUT ───────────────────────────────────────────── */}
      <section id="about" className="section" style={S.section}>
        <SLabel t={t}>About</SLabel>
        <STitle>Designed to create.</STitle>
        <div className="about-grid" style={{display:"grid",gridTemplateColumns:"1.2fr 1fr",gap:56}}>
          <div className="reveal">
            <p style={{fontSize:".95rem",color:t.text2,lineHeight:1.85,fontWeight:300,marginBottom:16}}>
              With a foundation in HTML, CSS, and JavaScript, I specialize in creating responsive interfaces, immersive AR systems, and AI-assisted animation tools.
            </p>
            <p style={{fontSize:".95rem",color:t.text2,lineHeight:1.85,fontWeight:300,marginBottom:22}}>
              My work focuses on clarity, interaction flow, and visual precision — turning complex systems into intuitive user journeys.
            </p>
            {["UX Systems Thinking","WebAR Interaction","AI-Powered Animation Workflows"].map(x=>(
              <div key={x} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 16px",borderRadius:10,background:t.surface2,border:`1px solid ${t.border}`,fontSize:".82rem",color:t.text2,marginBottom:8,transition:"all .2s"}}
              onMouseEnter={e=>{e.currentTarget.style.background="rgba(200,144,58,0.08)";e.currentTarget.style.color=t.accent;}}
              onMouseLeave={e=>{e.currentTarget.style.background=t.surface2;e.currentTarget.style.color=t.text2;}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:t.accent,flexShrink:0}}/>{x}
              </div>
            ))}
            <div style={{marginTop:18,padding:"14px 18px",borderRadius:12,background:"rgba(200,144,58,0.07)",borderLeft:`3px solid ${t.accent}`,fontStyle:"italic",fontSize:".87rem",color:t.accent,lineHeight:1.6}}>
              "Design isn't decoration. It's engineered experience."
            </div>
          </div>
          <div className="reveal d1">
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:".63rem",letterSpacing:".08em",color:t.accent,textTransform:"uppercase",marginBottom:14}}>Education</div>
            {[
              {deg:"B.Tech — Information Technology",school:"3rd Year · Expected 2027",year:"Undergraduate"},
              {deg:"Class XII — CBSE",school:"Kennedy High – The Global School, Hyderabad",year:"2022 – 2023"},
              {deg:"Class X — CBSE",school:"Kennedy High – The Global School, Hyderabad",year:"2020 – 2021 · 86%"},
            ].map((e,i)=>(
              <div key={i} style={{padding:"14px 18px",borderRadius:12,marginBottom:10,background:t.surface,border:`1px solid ${t.border}`,boxShadow:t.shadowSm,transition:"all .2s"}}
              onMouseEnter={el=>{el.currentTarget.style.boxShadow=t.shadowMd;el.currentTarget.style.transform="translateY(-2px)";}}
              onMouseLeave={el=>{el.currentTarget.style.boxShadow=t.shadowSm;el.currentTarget.style.transform="translateY(0)";}}>
                <div style={{fontSize:".87rem",fontWeight:600,color:t.text,marginBottom:3}}>{e.deg}</div>
                <div style={{fontSize:".74rem",color:t.accent,marginBottom:2}}>{e.school}</div>
                <div style={{fontSize:".67rem",color:t.text4,fontFamily:"'DM Mono',monospace"}}>{e.year}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Divider t={t}/>

      {/* ── SKILLS ──────────────────────────────────────────── */}
      <section id="skills" className="section-wide" style={S.sectionWide}>
        <div>
          <SLabel t={t}>Skills</SLabel>
          <STitle>The full toolkit.</STitle>
          <div className="skills-grid reveal" style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16}}>
            {[
              {label:"Programming & Frontend",items:[["JavaScript"],["Python"],["Java"],["React.js"],["HTML5 & CSS3"]],label2:"AI & Computer Vision",items2:[["Frame Interpolation (FILM)"],["ControlNet"],["OpenCV"]]},
              {label:"Design",items:[["UI/UX Design"],["Wireframing & Prototyping"],["Interaction Design"],["User Flow Architecture"],["Usability Optimization"]],label2:"Soft Skills",items2:[["Systems Thinking"],["Analytical Reasoning"],["Design Articulation"],["Problem Decomposition"]]},
            ].map((g,gi)=>(
              <div key={gi} style={{padding:"24px 22px",borderRadius:16,background:t.surface,border:`1px solid ${t.border}`,boxShadow:t.shadowSm}}>
                <div style={{fontSize:".58rem",fontWeight:600,letterSpacing:".07em",color:t.accent,textTransform:"uppercase",marginBottom:14,paddingBottom:10,borderBottom:`1px solid ${t.border}`,fontFamily:"'DM Mono',monospace"}}>{g.label}</div>
                {g.items.map(([n])=><SkillRow key={n} name={n} t={t}/>)}
                <div style={{fontSize:".58rem",fontWeight:600,letterSpacing:".07em",color:t.text3,textTransform:"uppercase",margin:"16px 0 12px",paddingBottom:8,borderBottom:`1px solid ${t.border}`,fontFamily:"'DM Mono',monospace"}}>{g.label2}</div>
                {g.items2.map(([n])=><SkillRow key={n} name={n} t={t}/>)}
              </div>
            ))}
            <div style={{padding:"24px 22px",borderRadius:16,background:t.surface,border:`1px solid ${t.border}`,boxShadow:t.shadowSm}}>
              <div style={{fontSize:".58rem",fontWeight:600,letterSpacing:".07em",color:t.accent,textTransform:"uppercase",marginBottom:14,paddingBottom:10,borderBottom:`1px solid ${t.border}`,fontFamily:"'DM Mono',monospace"}}>Tools & Platforms</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
                {["Figma","Framer","Spline","WebAR","Blender","Unity","PowerBI","Zappa","Affinity","Dribbble","Medibang","Clip Studio","Eclipse","Roblox Studio"].map(tool=>(
                  <span key={tool} style={{fontSize:".7rem",fontWeight:400,padding:"5px 12px",borderRadius:980,background:t.surface2,border:`1px solid ${t.border}`,color:t.text3,transition:"all .18s"}}
                  onMouseEnter={e=>{e.currentTarget.style.background="rgba(200,144,58,0.09)";e.currentTarget.style.color=t.accent;e.currentTarget.style.borderColor="rgba(200,144,58,0.28)";}}
                  onMouseLeave={e=>{e.currentTarget.style.background=t.surface2;e.currentTarget.style.color=t.text3;e.currentTarget.style.borderColor=t.border;}}>
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Divider t={t}/>

      {/* ── PROJECTS ────────────────────────────────────────── */}
      <section id="projects" className="section" style={S.section}>
        <SLabel t={t}>Projects</SLabel>
        <STitle>Featured work.</STitle>
        {[
          {num:"01",name:"FrameFlow — AI-Powered Animation Inbetweening",desc:"Built a stroke-based line rigging pipeline for generating consistent in-between frames in 2D animation. Applied FILM-based frame interpolation with ControlNet to enable sketch-guided motion consistency.",tags:["Python","FILM","ControlNet","OpenCV"]},
          {num:"02",name:"Music Streaming Platform — Full Stack Spotify Clone",desc:"Developed a full-stack music streaming web app with real-time playback and playlist management. Implemented secure authentication, audio storage, and metadata management via Firebase.",tags:["React.js","Firebase Auth","Realtime DB","Cloud Storage"]},
        ].map((p,i)=>(
          <div key={i} className={`reveal${i>0?" d1":""}`} style={{marginBottom:14}}
          onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";}}
          onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";}}>
            <div className="proj-card-inner" style={{display:"grid",gridTemplateColumns:"1fr",gap:24,alignItems:"start",padding:28,borderRadius:16,background:t.surface,border:`1px solid ${t.border}`,boxShadow:t.shadowSm,transition:"all .25s"}}>
              <div>
                <div style={{fontSize:".6rem",fontWeight:600,letterSpacing:".07em",color:t.text4,textTransform:"uppercase",marginBottom:8,fontFamily:"'DM Mono',monospace"}}>Project {p.num}</div>
                <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:"1.04rem",fontWeight:600,color:t.text,letterSpacing:"-.02em",marginBottom:10,lineHeight:1.3}}>{p.name}</div>
                <div style={{fontSize:".85rem",color:t.text3,lineHeight:1.8,fontWeight:300,marginBottom:16}}>{p.desc}</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                  {p.tags.map(tag=>(
                    <span key={tag} style={{fontSize:".66rem",fontWeight:500,padding:"4px 10px",borderRadius:980,background:"rgba(200,144,58,0.08)",color:t.accent,border:"1px solid rgba(200,144,58,0.20)"}}>{tag}</span>
                  ))}
                </div>
              </div>
              {/* TODO: re-enable once project links are live
              <div style={{width:34,height:34,borderRadius:"50%",background:t.surface2,border:`1px solid ${t.border}`,display:"flex",alignItems:"center",justifyContent:"center",color:t.text3,fontSize:".9rem",flexShrink:0,marginTop:4,transition:"all .2s"}}
              onMouseEnter={e=>{e.currentTarget.style.background=GRAD;e.currentTarget.style.color="#1A1200";e.currentTarget.style.border="none";}}
              onMouseLeave={e=>{e.currentTarget.style.background=t.surface2;e.currentTarget.style.color=t.text3;e.currentTarget.style.border=`1px solid ${t.border}`;}}>→</div>
              */}
            </div>
          </div>
        ))}
      </section>

      <Divider t={t}/>

      {/* ── ACHIEVEMENTS ────────────────────────────────────── */}
      <section id="achievements" className="section" style={S.section}>
        <SLabel t={t}>Recognition</SLabel>
        <STitle>Certs & achievements.</STitle>
        <div className="certs-grid reveal" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          {CERTS.map(cert=>(
            <CertCard key={cert.id} cert={cert} onClick={setModal} t={t} style={cert.highlight?{gridColumn:"1 / -1"}:{}}/>
          ))}
        </div>
      </section>

      <Divider t={t}/>

      {/* ── EXPERIENCE ──────────────────────────────────────── */}
      <section id="experience" className="section" style={S.section}>
        <SLabel t={t}>Experience</SLabel>
        <STitle>Internships & events.</STitle>
        <div className="exp-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:36}}>
          <div>
            <div style={{fontSize:".6rem",fontWeight:600,letterSpacing:".07em",color:t.accent,textTransform:"uppercase",marginBottom:14,fontFamily:"'DM Mono',monospace"}}>Internships</div>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {[
                {role:"Penetration Tester Intern",org:"Cybertronium — Malaysia",dur:"1 Week",desc:"Conducted vulnerability assessments, explored penetration testing tools, and assisted in security analysis workflows."},
                {role:"Web Technology Intern",org:"Test Yantra Software Solutions — Chennai",dur:"30 Days",desc:"Frontend development, responsive UI implementation, and real-world deployment practices. Collaborated on production-level workflows."},
                {role:"UI/UX Design Intern",org:"Retech Solutions — Chennai",dur:"15 Days",desc:"Mobile interface design, user flow structuring, wireframing, and usability improvements for application prototypes."},
              ].map((e,i)=><div key={i} className={`reveal d${i}`}><ExpCard {...e} t={t}/></div>)}
            </div>
          </div>
          <div>
            <div style={{fontSize:".6rem",fontWeight:600,letterSpacing:".07em",color:t.accent,textTransform:"uppercase",marginBottom:14,fontFamily:"'DM Mono',monospace"}}>Events</div>
            <div className="reveal">
              <ExpCard role="Zenithon — Technical Event & Hackathon" org="Best Coordinator Award" dur="Lead Role" desc="Led planning, team coordination, and execution strategy. Managed logistics, participant flow, and overall event operations for seamless high-engagement delivery." isEvent t={t}/>
            </div>
          </div>
        </div>
      </section>

      <Divider t={t}/>

      {/* ── CONTACT ─────────────────────────────────────────── */}
      <section id="contact" className="section" style={S.section}>
        <SLabel t={t}>Contact</SLabel>
        <STitle>Let's talk.</STitle>
        <div className="contact-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:56}}>
          <div className="reveal">
            <p style={{fontSize:".95rem",color:t.text3,lineHeight:1.85,fontWeight:300,marginBottom:26}}>
              Have a project in mind or want to collaborate? I'm always open to interesting conversations about design and technology.
            </p>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {[
                {icon:"✉",label:"Email",val:"sheronuzi99@gmail.com",href:"mailto:sheronuzi99@gmail.com"},
                {icon:"in",label:"LinkedIn",val:"linkedin.com/in/j-r-sheron",href:"https://www.linkedin.com/in/j-r-sheron"},
                {icon:"gh",label:"GitHub",val:"github.com/SheronJR05",href:"https://github.com/SheronJR05"},
                {icon:"◎",label:"Location",val:"Chennai, India",href:null},
              ].map(({icon,label,val,href})=>{
                const inner=(
                  <div style={{display:"flex",alignItems:"center",gap:14,padding:"12px 16px",borderRadius:12,background:t.surface,border:`1px solid ${t.border}`,boxShadow:t.shadowSm,transition:"all .2s",cursor:href?"none":"default"}}
                  onMouseEnter={e=>{if(href){e.currentTarget.style.boxShadow=t.shadowMd;e.currentTarget.style.transform="translateX(4px)";}}}
                  onMouseLeave={e=>{e.currentTarget.style.boxShadow=t.shadowSm;e.currentTarget.style.transform="translateX(0)";}}>
                    <div style={{width:34,height:34,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(200,144,58,0.09)",color:t.accent,fontSize:".76rem",fontWeight:600,flexShrink:0}}>{icon}</div>
                    <div>
                      <div style={{fontSize:".58rem",color:t.text4,textTransform:"uppercase",letterSpacing:".06em",marginBottom:2,fontFamily:"'DM Mono',monospace"}}>{label}</div>
                      <div style={{fontSize:".82rem",color:t.text2,fontWeight:400}}>{val}</div>
                    </div>
                  </div>
                );
                return href
                  ? <a href={href} key={label} target="_blank" rel="noreferrer" style={{display:"block"}}>{inner}</a>
                  : <div key={label}>{inner}</div>;
              })}
            </div>
          </div>
          <ContactForm t={t} />
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{borderTop:`1px solid ${t.border}`,padding:`20px 48px`,display:"flex",justifyContent:"space-between",alignItems:"center",background:t.bgSecondary,transition:"background .4s"}}>
        <span style={{fontSize:".67rem",color:t.text4,fontFamily:"'DM Mono',monospace"}}>© 2025 J.R. Sheron. All rights reserved.</span>
        <span style={{fontSize:".67rem",color:t.text4,fontFamily:"'DM Mono',monospace"}}>Chennai, India</span>
      </footer>

      {modal && <Modal cert={modal} onClose={()=>setModal(null)} t={t}/>}
      <BackToTop t={t} />

      </div>
    </>
  );
}

