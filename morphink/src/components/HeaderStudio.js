import React from 'react';

export default function HeaderStudio({
  message,
  handleFileUpload,
  applyLineArt,
  applyAutoColor,
  exportPng,
  exportSvg,
  user,
  authMode,
  setAuthMode,
  email,
  setEmail,
  password,
  setPassword,
  handleAuthSubmit,
  handleLogout,
}) {
  return (
    <header className="studio-header">


      <div className="export-row">
        <label className="upload-button">
          Upload Sketch
          <input type="file" accept="image/*" onChange={handleFileUpload} />
        </label>
        <button onClick={applyLineArt}>Clean Line Art</button>
        <button onClick={applyAutoColor}>Auto Color</button>
        <button onClick={exportPng}>Export PNG</button>
        <button onClick={exportSvg}>Export SVG</button>
      </div>
    </header>
  );
}
