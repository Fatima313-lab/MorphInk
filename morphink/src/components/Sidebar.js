import React from 'react';

export default function Sidebar({
  user,
  authMode,
  setAuthMode,
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  handleAuthSubmit,
  handleLogout,
  tool,
  setTool,
  brushSize,
  setBrushSize,
  brushColor,
  setBrushColor,
  lineThreshold,
  setLineThreshold,
  canvasWidth,
  setCanvasWidth,
  canvasHeight,
  setCanvasHeight,
  initCanvasState,
  handleUndo,
  handleRedo,
  saveGalleryItem,
  layers,
  toggleLayer,
  updateOpacity,
}) {
  return (
    <aside className="app-sidebar">
      <div className="brand-panel">
        <div className="brand-mark">M</div>
        <div>
          <h1>MorphInk</h1>
          <p>AI Sketch to Art Studio</p>
        </div>
      </div>

      <section className="panel block">
        <h2>Account</h2>
        {user ? (
          <div className="account-card">
            <strong>{user.name}</strong>
            <span>{user.email}</span>
            <button className="ghost" onClick={handleLogout}>
              Log out
            </button>
          </div>
        ) : (
          <form className="auth-form" onSubmit={handleAuthSubmit}>
            <div className="auth-toggle">
              <button type="button" className={authMode === 'login' ? 'active' : ''} onClick={() => setAuthMode('login')}>
                Login
              </button>
              <button type="button" className={authMode === 'register' ? 'active' : ''} onClick={() => setAuthMode('register')}>
                Register
              </button>
            </div>
            {authMode === 'register' && (
              <label>
                Name
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" />
              </label>
            )}
            <label>
              Email
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" />
            </label>
            <label>
              Password
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" />
            </label>
            <button type="submit">{authMode === 'login' ? 'Sign In' : 'Create Account'}</button>
          </form>
        )}
      </section>

      <section className="panel block">
        <h2>Tools</h2>
        <div className="tools-grid">
          {[
            {
              id: 'pencil',
              label: 'Pencil',
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              ),
            },
            {
              id: 'brush',
              label: 'Brush',
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 16c-1.5 1.5-2 3.5-2 4h10c0-.5-.5-2.5-2-4" />
                  <path d="M7 16L3 12l5-5 4 4 5-5 3 3-5 5" />
                  <path d="M15 5l4 4" />
                </svg>
              ),
            },
            {
              id: 'marker',
              label: 'Marker',
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 16l7-7 3 3-7 7H6v-3z" />
                  <path d="M13 7l4 4" />
                </svg>
              ),
            },
            {
              id: 'spray',
              label: 'Spray',
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 16h14" />
                  <path d="M8 13l1-2" />
                  <path d="M10 12l2-3" />
                  <path d="M14 12l2-2" />
                  <path d="M16 14l1-2" />
                  <path d="M12 18v2" />
                </svg>
              ),
            },
            {
              id: 'shape',
              label: 'Shape',
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="5" width="6" height="6" />
                  <circle cx="16" cy="8" r="3" />
                  <path d="M7 17l4-4 6 6" />
                </svg>
              ),
            },
            {
              id: 'line',
              label: 'Line',
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 19L19 5" />
                </svg>
              ),
            },
            {
              id: 'rectangle',
              label: 'Rect',
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="6" y="6" width="12" height="12" />
                </svg>
              ),
            },
            {
              id: 'sticker',
              label: 'Sticker',
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2c4.97 0 9 4.03 9 9s-4.03 9-9 9-9-4.03-9-9 4.03-9 9-9z" />
                  <path d="M9 9l6 6" />
                  <path d="M15 9l-6 6" />
                </svg>
              ),
            },
            {
              id: 'eraser',
              label: 'Eraser',
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 16l4-4-6-6-4 4 6 6z" />
                  <path d="M7 17L3 13l4-4 4 4-4 4z" />
                  <path d="M7 13l6 6" />
                </svg>
              ),
            },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              className={`tool-button ${tool === item.id ? 'active' : ''}`}
              onClick={() => setTool(item.id)}
              aria-label={item.label}
            >
              <span className="tool-icon">{item.icon}</span>
              <span className="tool-name">{item.label}</span>
            </button>
          ))}
        </div>
        <label>
          Size
          <input type="range" min="2" max="40" value={brushSize} onChange={(e) => setBrushSize(Number(e.target.value))} />
        </label>
        <label>
          Color
          <input type="color" value={brushColor} onChange={(e) => setBrushColor(e.target.value)} />
        </label>
        <label>
          Canvas Width
          <input type="number" min="800" max="2400" value={canvasWidth} onChange={(e) => setCanvasWidth(Number(e.target.value) || 800)} />
        </label>
        <label>
          Canvas Height
          <input type="number" min="600" max="1800" value={canvasHeight} onChange={(e) => setCanvasHeight(Number(e.target.value) || 600)} />
        </label>
        <label>
          Line Art Threshold
          <input type="range" min="60" max="200" value={lineThreshold} onChange={(e) => setLineThreshold(Number(e.target.value))} />
        </label>
      </section>

      <section className="panel block">
        <h2>Actions</h2>
        <button onClick={initCanvasState}>Clear Drawing</button>
        <button onClick={handleUndo}>Undo</button>
        <button onClick={handleRedo}>Redo</button>
        <button onClick={saveGalleryItem}>Save to Gallery</button>
      </section>

      <section className="panel block">
        <h2>Layer Control</h2>
        {layers.map((layer) => (
          <div className="layer-row" key={layer.id}>
            <label>
              <input type="checkbox" checked={layer.visible} onChange={() => toggleLayer(layer.id)} />
              {layer.name}
            </label>
            <input type="range" min="0" max="1" step="0.05" value={layer.opacity} onChange={(e) => updateOpacity(layer.id, e.target.value)} />
          </div>
        ))}
      </section>
    </aside>
  );
}
