import React, { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import CanvasStage from './components/CanvasStage';
import HeaderStudio from './components/HeaderStudio';
import Gallery from './components/Gallery';

const defaultAccounts = JSON.parse(localStorage.getItem('morphink-accounts') || '{}');
const defaultUser = JSON.parse(localStorage.getItem('morphink-user') || 'null');

function App() {
  const [accounts, setAccounts] = useState(defaultAccounts);
  const [user, setUser] = useState(defaultUser);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [authMode, setAuthMode] = useState('login');
  const [message, setMessage] = useState('Welcome to MorphInk. Upload a sketch to start.');
  const [tool, setTool] = useState('pencil');
  const [brushSize, setBrushSize] = useState(10);
  const [brushColor, setBrushColor] = useState('#ffffff');
  const [lineThreshold, setLineThreshold] = useState(140);
  const [canvasWidth, setCanvasWidth] = useState(1200);
  const [canvasHeight, setCanvasHeight] = useState(1200);
  const [layers, setLayers] = useState([
    { id: 'base', name: 'Sketch', visible: true, opacity: 1 },
    { id: 'draw', name: 'Drawing', visible: true, opacity: 1 },
    { id: 'effect', name: 'Line/Color', visible: true, opacity: 0.85 },
  ]);
  const [gallery, setGallery] = useState(
    JSON.parse(localStorage.getItem(`morphink-gallery-${defaultUser?.name || 'guest'}`) || '[]'),
  );
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  const baseCanvasRef = useRef(null);
  const drawCanvasRef = useRef(null);
  const effectCanvasRef = useRef(null);
  const wrapperRef = useRef(null);

  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    localStorage.setItem('morphink-accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem('morphink-user', JSON.stringify(user));
    const saved = JSON.parse(localStorage.getItem(`morphink-gallery-${user?.name || 'guest'}`) || '[]');
    setGallery(saved);
  }, [user]);

  useEffect(() => {
    localStorage.setItem(`morphink-gallery-${user?.name || 'guest'}`, JSON.stringify(gallery));
  }, [gallery, user]);

  const initializeCanvas = useCallback(() => {
    const base = baseCanvasRef.current;
    const draw = drawCanvasRef.current;
    const effect = effectCanvasRef.current;
    if (!base || !draw || !effect) return;

    const width = canvasWidth;
    const height = canvasHeight;
    [base, draw, effect].forEach((canvas) => {
      canvas.width = width;
      canvas.height = height;
    });

    const ctx = draw.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.fillStyle = '#000000';
    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'source-over';
  }, [brushColor, brushSize, canvasWidth, canvasHeight]);

  useEffect(() => {
    initializeCanvas();
  }, [initializeCanvas]);

  const updateBrushSettings = useCallback(() => {
    const ctx = drawCanvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, [brushColor, brushSize]);

  useEffect(() => {
    updateBrushSettings();
  }, [updateBrushSettings]);

  const initCanvasState = () => {
    const draw = drawCanvasRef.current;
    if (!draw) return;
    const ctx = draw.getContext('2d');
    ctx.clearRect(0, 0, draw.width, draw.height);
    saveHistory();
  };

  const drawShape = (x, y) => {
    const ctx = drawCanvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.save();
    ctx.fillStyle = brushColor;
    ctx.globalAlpha = 0.32;
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.ellipse(x, y, 42, 24, Math.PI / 6, 0, 2 * Math.PI);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.stroke();
    ctx.restore();
  };

  const drawSticker = (x, y) => {
    const ctx = drawCanvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.save();
    ctx.fillStyle = '#fbbf24';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y - 22);
    ctx.bezierCurveTo(x + 18, y - 40, x + 42, y - 10, x, y + 16);
    ctx.bezierCurveTo(x - 42, y - 10, x - 18, y - 40, x, y - 22);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  };

  const drawLine = (x, y) => {
    const ctx = drawCanvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.save();
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = Math.max(2, brushSize);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 180, y + 80);
    ctx.stroke();
    ctx.restore();
  };

  const drawRectangle = (x, y) => {
    const ctx = drawCanvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.save();
    ctx.fillStyle = `${brushColor}33`;
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = Math.max(3, brushSize / 1.5);
    ctx.beginPath();
    ctx.rect(x, y, 220, 120);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  };

  const setMessageText = (text) => {
    setMessage(text);
    window.setTimeout(() => setMessage(''), 3000);
  };

  const handleLogin = () => {
    if (!email || !password) {
      setMessageText('Enter email and password.');
      return;
    }
    const account = accounts[email?.toLowerCase()];
    if (account?.password === password) {
      setUser({ name: account.name, email: email.toLowerCase() });
      setMessageText(`Logged in as ${account.name}.`);
    } else {
      setMessageText('Invalid login credentials.');
    }
  };

  const handleRegister = () => {
    if (!name || !email || !password) {
      setMessageText('Enter name, email, and password to register.');
      return;
    }
    const key = email.toLowerCase();
    if (accounts[key]) {
      setMessageText('Account already exists. Use login.');
      return;
    }
    const updated = { ...accounts, [key]: { name, email: key, password } };
    setAccounts(updated);
    setUser({ name, email: key });
    setMessageText(`Account created: ${name}.`);
  };

  const handleLogout = () => {
    setUser(null);
    setMessageText('Logged out. Working as guest.');
  };

  const saveHistory = () => {
    const draw = drawCanvasRef.current;
    if (!draw) return;
    const snapshot = draw.toDataURL('image/png');
    setHistory((prev) => [...prev, snapshot].slice(-15));
    setRedoStack([]);
  };

  const restoreHistory = (snapshot) => {
    const draw = drawCanvasRef.current;
    if (!draw) return;
    const ctx = draw.getContext('2d');
    const image = new Image();
    image.onload = () => {
      ctx.clearRect(0, 0, draw.width, draw.height);
      ctx.drawImage(image, 0, 0, draw.width, draw.height);
    };
    image.src = snapshot;
  };

  const handleUndo = () => {
    if (history.length < 2) {
      setMessageText('Nothing to undo.');
      return;
    }
    setHistory((prev) => {
      const newHistory = [...prev];
      const last = newHistory.pop();
      setRedoStack((r) => [last, ...r]);
      const previous = newHistory[newHistory.length - 1];
      restoreHistory(previous);
      return newHistory;
    });
  };

  const handleRedo = () => {
    if (!redoStack.length) {
      setMessageText('Nothing to redo.');
      return;
    }
    const [next, ...rest] = redoStack;
    setRedoStack(rest);
    restoreHistory(next);
    setHistory((prev) => [...prev, next]);
  };

  const getCanvasOffset = (event) => {
    const rect = drawCanvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return { x, y };
  };

  const startDrawing = (event) => {
    if (!drawCanvasRef.current) return;
    const ctx = drawCanvasRef.current.getContext('2d');
    const pos = getCanvasOffset(event);
    if (tool === 'shape') {
      drawShape(pos.x, pos.y);
      saveHistory();
      return;
    }
    if (tool === 'sticker') {
      drawSticker(pos.x, pos.y);
      saveHistory();
      return;
    }
    if (tool === 'line') {
      drawLine(pos.x, pos.y);
      saveHistory();
      return;
    }
    if (tool === 'rectangle') {
      drawRectangle(pos.x, pos.y);
      saveHistory();
      return;
    }
    if (tool === 'brush' || tool === 'pencil' || tool === 'eraser' || tool === 'marker' || tool === 'spray') {
      if (tool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.strokeStyle = 'rgba(0,0,0,1)';
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = brushColor;
      }
      if (tool === 'marker') {
        ctx.globalAlpha = 0.35;
      } else {
        ctx.globalAlpha = 1;
      }
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      setDrawing(true);
      saveHistory();
    }
  };

  const drawStroke = (event) => {
    if (!drawing || !drawCanvasRef.current) return;
    const ctx = drawCanvasRef.current.getContext('2d');
    const pos = getCanvasOffset(event);
    if (tool === 'spray') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = brushColor;
      for (let i = 0; i < 18; i += 1) {
        const offsetX = (Math.random() - 0.5) * brushSize * 1.6;
        const offsetY = (Math.random() - 0.5) * brushSize * 1.6;
        ctx.beginPath();
        ctx.arc(pos.x + offsetX, pos.y + offsetY, Math.max(1, brushSize / 8), 0, Math.PI * 2);
        ctx.fill();
      }
      return;
    }
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!drawing || !drawCanvasRef.current) return;
    const ctx = drawCanvasRef.current.getContext('2d');
    ctx.closePath();
    setDrawing(false);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const base = baseCanvasRef.current;
        if (!base) return;
        const ctx = base.getContext('2d');
        ctx.clearRect(0, 0, base.width, base.height);
        ctx.drawImage(img, 0, 0, base.width, base.height);
        setMessageText('Sketch uploaded. Use Clean Line Art or draw directly.');
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const getCompositeCanvas = () => {
    const width = canvasWidth;
    const height = canvasHeight;
    const output = document.createElement('canvas');
    output.width = width;
    output.height = height;
    const ctx = output.getContext('2d');
    layers.forEach((layer) => {
      if (!layer.visible) return;
      const source =
        layer.id === 'base'
          ? baseCanvasRef.current
          : layer.id === 'draw'
          ? drawCanvasRef.current
          : effectCanvasRef.current;
      if (!source) return;
      ctx.globalAlpha = layer.opacity;
      ctx.drawImage(source, 0, 0, width, height);
    });
    ctx.globalAlpha = 1;
    return output;
  };

  const exportPng = () => {
    const output = getCompositeCanvas();
    const dataUrl = output.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'morphink-art.png';
    link.click();
    setMessageText('PNG export created.');
  };

  const exportSvg = () => {
    const output = getCompositeCanvas();
    const png = output.toDataURL('image/png');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvasWidth}" height="${canvasHeight}"><image href="${png}" width="${canvasWidth}" height="${canvasHeight}"/></svg>`;
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'morphink-art.svg';
    link.click();
    URL.revokeObjectURL(url);
    setMessageText('SVG export created.');
  };

  const applyLineArt = () => {
    const source = baseCanvasRef.current;
    const effect = effectCanvasRef.current;
    if (!source || !effect) return;
    const src = source.getContext('2d');
    const dst = effect.getContext('2d');
    const image = src.getImageData(0, 0, source.width, source.height);
    const data = image.data;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const lum = 0.3 * r + 0.6 * g + 0.1 * b;
      data[i] = data[i + 1] = data[i + 2] = lum;
    }
    dst.putImageData(image, 0, 0);
    const threshold = lineThreshold;
    const edges = dst.getImageData(0, 0, effect.width, effect.height);
    const edg = edges.data;
    for (let i = 0; i < edg.length; i += 4) {
      const value = edg[i];
      const edge = value < threshold ? 255 : 0;
      edg[i] = edg[i + 1] = edg[i + 2] = edge;
      edg[i + 3] = 255;
    }
    dst.putImageData(edges, 0, 0);
    setMessageText('Line art generated. Toggle line/color layer to view.');
  };

  const applyAutoColor = () => {
    const effect = effectCanvasRef.current;
    if (!effect) return;
    const ctx = effect.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, effect.width, effect.height);
    gradient.addColorStop(0, 'rgba(231, 183, 255, 0.28)');
    gradient.addColorStop(0.5, 'rgba(123, 220, 255, 0.2)');
    gradient.addColorStop(1, 'rgba(255, 235, 155, 0.25)');
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, effect.width, effect.height);
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(0, 0, effect.width, effect.height);
    ctx.globalCompositeOperation = 'source-over';
    setMessageText('Auto color brush simulated. Use layers to control the effect.');
  };

  const saveGalleryItem = () => {
    const output = getCompositeCanvas();
    const dataUrl = output.toDataURL('image/png');
    const item = {
      id: Date.now(),
      title: `MorphInk ${new Date().toLocaleString()}`,
      image: dataUrl,
      author: user?.name || 'Guest',
    };
    setGallery((prev) => [item, ...prev].slice(0, 12));
    setMessageText('Saved to gallery.');
  };

  const loadGalleryItem = (item) => {
    const source = baseCanvasRef.current;
    const draw = drawCanvasRef.current;
    if (!source || !draw) return;
    const img = new Image();
    img.onload = () => {
      const baseCtx = source.getContext('2d');
      const drawCtx = draw.getContext('2d');
      baseCtx.clearRect(0, 0, source.width, source.height);
      drawCtx.clearRect(0, 0, draw.width, draw.height);
      baseCtx.drawImage(img, 0, 0, source.width, source.height);
      setMessageText('Gallery item loaded into MorphInk.');
    };
    img.src = item.image;
  };

  const toggleLayer = (id) => {
    setLayers((prev) =>
      prev.map((layer) =>
        layer.id === id ? { ...layer, visible: !layer.visible } : layer,
      ),
    );
  };

  const updateOpacity = (id, value) => {
    setLayers((prev) =>
      prev.map((layer) =>
        layer.id === id ? { ...layer, opacity: Number(value) } : layer,
      ),
    );
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    authMode === 'login' ? handleLogin() : handleRegister();
  };

  return (
    <div className="app-shell">
      <Sidebar
        user={user}
        authMode={authMode}
        setAuthMode={setAuthMode}
        name={name}
        setName={setName}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        handleAuthSubmit={handleAuthSubmit}
        handleLogout={handleLogout}
        tool={tool}
        setTool={setTool}
        brushSize={brushSize}
        setBrushSize={setBrushSize}
        brushColor={brushColor}
        setBrushColor={setBrushColor}
        lineThreshold={lineThreshold}
        setLineThreshold={setLineThreshold}
        canvasWidth={canvasWidth}
        setCanvasWidth={setCanvasWidth}
        canvasHeight={canvasHeight}
        setCanvasHeight={setCanvasHeight}
        initCanvasState={initCanvasState}
        handleUndo={handleUndo}
        handleRedo={handleRedo}
        saveGalleryItem={saveGalleryItem}
        layers={layers}
        toggleLayer={toggleLayer}
        updateOpacity={updateOpacity}
      />

      <main className="app-main">
        <HeaderStudio
          message={message}
          handleFileUpload={handleFileUpload}
          applyLineArt={applyLineArt}
          applyAutoColor={applyAutoColor}
          exportPng={exportPng}
          exportSvg={exportSvg}
          user={user}
          authMode={authMode}
          setAuthMode={setAuthMode}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          handleAuthSubmit={handleAuthSubmit}
          handleLogout={handleLogout}
        />

        <CanvasStage
          baseRef={baseCanvasRef}
          drawRef={drawCanvasRef}
          effectRef={effectCanvasRef}
          layers={layers}
          startDrawing={startDrawing}
          drawStroke={drawStroke}
          stopDrawing={stopDrawing}
          wrapperRef={wrapperRef}
          canvasWidth={canvasWidth}
          canvasHeight={canvasHeight}
        />

        <Gallery gallery={gallery} loadGalleryItem={loadGalleryItem} />
      </main>
    </div>
  );
}

export default App;
