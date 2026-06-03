import React from 'react';

export default function Gallery({ gallery, loadGalleryItem }) {
  return (
    <section className="gallery-panel">
      <h2>Gallery</h2>
      {gallery.length ? (
        <div className="gallery-grid">
          {gallery.map((item) => (
            <button key={item.id} className="gallery-card" onClick={() => loadGalleryItem(item)}>
              <img src={item.image} alt={item.title} />
              <div>
                <strong>{item.title}</strong>
                <span>{item.author}</span>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <p className="gallery-empty">No saved gallery items yet. Save your first design!</p>
      )}
    </section>
  );
}
