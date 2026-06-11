import React, { useState } from 'react';
import { Artwork } from '../data/artworks';

interface DetailViewProps {
  artwork: Artwork | null;
  onClose: () => void;
}

export default function DetailView({ artwork, onClose }: DetailViewProps) {
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isZoomed, setIsZoomed] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!artwork) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const handleMouseEnter = () => {
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
  };

  const handleInquiry = () => {
    if (!artwork) return;
    const subject = `Inquiry: ${artwork.title}`;
    const body = `Hello,\n\nI am interested in acquiring "${artwork.title}" (${artwork.medium}, ${artwork.dimensions}, listed at ₹${artwork.price.toLocaleString()}).\n\nPlease provide more details about the acquisition process.\n\nBest regards,\n[Your Name]`;
    window.location.href = `mailto:sadhnamehta_2008@hotmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const getGradient = (section: string) => {
    switch (section) {
      case 'portraits':
        return 'linear-gradient(135deg, #AD2004 0%, #8D4908 100%)';
      case 'landscapes':
        return 'linear-gradient(135deg, #EBB73D 0%, #9D8B1B 100%)';
      case 'abstracts':
        return 'linear-gradient(135deg, #65AF1A 0%, #8D4908 100%)';
      default:
        return 'linear-gradient(135deg, #8D4908 0%, #1e110b 100%)';
    }
  };

  return (
    <div className={`detail-overlay ${artwork ? 'active' : ''}`} onClick={onClose}>
      <div 
        className="detail-zoom-portrait-wrapper"
        onClick={(e) => e.stopPropagation()}
        style={{ display: artwork ? 'flex' : 'none' }}
      >
        {artwork && (
          <>
            <div className="detail-zoom-frame">
              {artwork.imageUrl ? (
                <div 
                  className="detail-zoom-canvas-container"
                  onMouseMove={handleMouseMove}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  style={{
                    width: 'calc(100% - 24px)',
                    height: 'calc(100% - 24px)',
                    position: 'absolute',
                    left: '12px',
                    top: '12px',
                    overflow: 'hidden',
                    background: '#fdfaf6',
                  }}
                >
                  <img 
                    src={artwork.imageUrl} 
                    alt={artwork.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transform: isZoomed ? 'scale(2.5)' : 'scale(1)',
                      transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                      transition: isZoomed ? 'none' : 'transform 0.2s ease',
                      cursor: 'zoom-in',
                    }}
                  />
                </div>
              ) : (
                <div 
                  className="artwork-placeholder" 
                  style={{ 
                    background: getGradient(artwork.section),
                    width: 'calc(100% - 24px)',
                    height: 'calc(100% - 24px)',
                    position: 'absolute',
                    left: '12px',
                    top: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontFamily: 'serif',
                    padding: '20px',
                    textAlign: 'center',
                    boxSizing: 'border-box'
                  }}
                >
                  <span style={{ fontSize: '0.8rem', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px' }}>{artwork.section}</span>
                  <span style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '10px' }}>{artwork.title}</span>
                  <span style={{ fontSize: '1rem', opacity: 0.9 }}>₹{artwork.price.toLocaleString()}</span>
                </div>
              )}
            </div>
            <div className="detail-zoom-label">
              {artwork.title} ({artwork.year})
              <span>₹{artwork.price.toLocaleString()}</span>
            </div>
          </>
        )}
      </div>

      <div className="detail-container" onClick={(e) => e.stopPropagation()}>
        {artwork && (
          <>
            <button className="detail-close-btn" onClick={onClose} aria-label="Close details">
              &times;
            </button>
            
            <div className="detail-section-tag">{artwork.section}</div>
            <h2 className="detail-title">{artwork.title}</h2>
            
            <div className="detail-specs">
              <div className="detail-spec-item">
                <strong>Artist:</strong> {artwork.artist}
              </div>
              <div className="detail-spec-item">
                <strong>Year:</strong> {artwork.year}
              </div>
              <div className="detail-spec-item">
                <strong>Medium:</strong> {artwork.medium}
              </div>
              <div className="detail-spec-item">
                <strong>Dimensions:</strong> {artwork.dimensions}
              </div>
            </div>
            
            <p className="detail-desc">{artwork.description}</p>
            
            <div className="detail-price-box">
              <span className="detail-price-label">Listed Price</span>
              <span className="detail-price">₹{artwork.price.toLocaleString()}</span>
            </div>
            
            <button className="detail-inquire-btn" onClick={handleInquiry}>
              Inquire About Acquisition
            </button>
          </>
        )}
      </div>
    </div>
  );
}
