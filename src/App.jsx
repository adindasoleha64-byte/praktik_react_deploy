import { useState } from "react";
import "./App.css";

function EyeIcon({ off }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
      {off && <path d="M4 4l16 16" />}
    </svg>
  );
}

// 4 panel timbul di muka pintu
function Panels() {
  return (
    <div className="panels">
      <i /><i /><i /><i />
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [open, setOpen] = useState(false);
  const [err, setErr] = useState("");
  const [shake, setShake] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [knocked, setKnocked] = useState(false); // form baru muncul setelah pintu diketuk
  const [knocking, setKnocking] = useState(false);

  // pintu miring sedikit mengikuti posisi mouse (efek 3D)
  function handleMove(e) {
    const r = e.currentTarget.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
    const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
    setTilt({ x: -dy * 10, y: dx * 14 });
  }

  function handleKnock() {
    if (knocked || knocking) return;
    setKnocking(true);
    setTimeout(() => {
      setKnocking(false);
      setKnocked(true);
    }, 650);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!user || !pass) {
      setErr("Username dan password wajib diisi.");
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }
    setErr("");
    setOpen(true);
  }

  function handleReset() {
    setOpen(false);
    setPass("");
    setShowPw(false);
  }

  return (
    <div
      className={"card" + (shake ? " shake" : "")}
      onMouseMove={handleMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
    >
      <div
        className={"scene" + (open ? " open" : "") + (knocking ? " knock" : "") + (!knocked ? " clickable" : "")}
        onClick={handleKnock}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleKnock()}
        role={!knocked ? "button" : undefined}
        tabIndex={!knocked ? 0 : undefined}
        aria-label={!knocked ? "Ketuk pintu" : undefined}
      >
        <div className="glow" />
        <div className="floor" />

        <div className="stage" style={{ "--rx": `${tilt.x}deg`, "--ry": `${tilt.y}deg` }}>
          <div className="room">
            <span>Selamat datang,<br />{user || "tamu"}</span>
          </div>

          <div className="door">
            <div className="face front">
              <div className="plate">{user || "Tamu"}</div>
              <Panels />
              <b className="hinge h1" /><b className="hinge h2" /><b className="hinge h3" />
              <span className="handle" />
            </div>
            <div className="face back">
              <Panels />
              <span className="handle" />
            </div>
            <div className="edge" />
          </div>
        </div>
      </div>

      <h1>Masuk</h1>
      <p className="sub">{!knocked
          ? "Klik pintunya untuk mengetuk"
          : open
          ? `Selamat datang, ${user}!`
          : "Silakan isi data kamu"}</p>

      {!knocked ? null : open ? (
        <button className="go" onClick={handleReset}>Tutup pintu</button>
      ) : (
        <form className="reveal" onSubmit={handleSubmit}>
          <label htmlFor="user">Username</label>
          <input id="user" value={user} placeholder="Masukkan username" onChange={(e) => setUser(e.target.value)} />

          <label htmlFor="pass">Password</label>
          <div className="pw">
            <input
              id="pass"
              type={showPw ? "text" : "password"}
              value={pass}
              placeholder="Masukkan password"
              onChange={(e) => setPass(e.target.value)}
            />
            <button
              type="button"
              className="tog"
              aria-label="Tampilkan atau sembunyikan password"
              onClick={() => setShowPw(!showPw)}
            >
              <EyeIcon off={!showPw} />
            </button>
          </div>

          <p className="err">{err}</p>
          <button type="submit" className="go">Masuk</button>
        </form>
      )}
    </div>
  );
}