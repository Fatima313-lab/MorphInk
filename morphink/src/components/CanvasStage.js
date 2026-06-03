import React from 'react';

export default function CanvasStage({
  baseRef,
  effectRef,
  drawRef,
  layers,
  startDrawing,
  drawStroke,
  stopDrawing,
  wrapperRef,
  canvasWidth,
  canvasHeight,
}) {
  return (
    <section className="canvas-stage" ref={wrapperRef} style={{ '--canvas-width': `${canvasWidth}px`, '--canvas-height': `${canvasHeight}px` }}>
      <canvas
        ref={baseRef}
        className="studio-canvas"
        style={{ width: `${canvasWidth}px`, height: `${canvasHeight}px`, opacity: layers.find((l) => l.id === 'base').opacity, display: layers.find((l) => l.id === 'base').visible ? 'block' : 'none' }}
      />
      <canvas
        ref={effectRef}
        className="studio-canvas"
        style={{ width: `${canvasWidth}px`, height: `${canvasHeight}px`, opacity: layers.find((l) => l.id === 'effect').opacity, display: layers.find((l) => l.id === 'effect').visible ? 'block' : 'none' }}
      />
      <canvas
        ref={drawRef}
        className="studio-canvas"
        style={{ width: `${canvasWidth}px`, height: `${canvasHeight}px`, opacity: layers.find((l) => l.id === 'draw').opacity, display: layers.find((l) => l.id === 'draw').visible ? 'block' : 'none' }}
        onMouseDown={startDrawing}
        onMouseMove={drawStroke}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={(e) => {
          const touch = e.touches[0];
          startDrawing({ clientX: touch.clientX, clientY: touch.clientY });
        }}
        onTouchMove={(e) => {
          const touch = e.touches[0];
          drawStroke({ clientX: touch.clientX, clientY: touch.clientY });
        }}
        onTouchEnd={stopDrawing}
      />
    </section>
  );
}
