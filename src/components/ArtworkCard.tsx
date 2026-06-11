import React from 'react';
import { Artwork } from '../data/artworks';

interface ArtworkCardProps {
  artwork: Artwork;
  onClick: (artwork: Artwork) => void;
  isBlurred: boolean;
  isSelected: boolean;
  isZoomable?: boolean;
}

export default function ArtworkCard({ artwork, onClick, isBlurred, isSelected, isZoomable }: ArtworkCardProps) {
  const { x, y, z } = artwork.position;
  
  // Symmetrical alignment detection depending on the corridor section direction
  const getIsLeftWall = () => {
    if (artwork.section === 'portraits') {
      return x < 0;
    } else if (artwork.section === 'landscapes') {
      return z > -3800; // Walking left: Left wall is at Z = -3420
    } else {
      return x < -3800; // Walking deep: Left wall is at X = -4180
    }
  };
  const isLeftWall = getIsLeftWall();

  // Generate an autumn gradient based on the artwork section
  const getGradient = () => {
    switch (artwork.section) {
      case 'portraits':
        return 'linear-gradient(135deg, #AD2004 0%, #8D4908 100%)'; // Tabasco red to Korma brown
      case 'landscapes':
        return 'linear-gradient(135deg, #EBB73D 0%, #9D8B1B 100%)'; // Tulip gold to Reef olive
      case 'abstracts':
        return 'linear-gradient(135deg, #65AF1A 0%, #8D4908 100%)'; // Christi green to Korma brown
      default:
        return 'linear-gradient(135deg, #8D4908 0%, #1e110b 100%)';
    }
  };

  const cardStyle: React.CSSProperties = {
    transform: `translate3d(${x}px, ${y}px, ${z}px) rotateY(${artwork.rotationY}deg)`,
    pointerEvents: isBlurred ? 'none' : 'auto',
    opacity: isBlurred ? 0.2 : (isSelected && isZoomable ? 0 : 1),
    filter: isBlurred ? 'blur(5px)' : 'none',
    transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
  };

  return (
    <div
      className={`artwork-3d-card ${isLeftWall ? 'artwork-left' : 'artwork-right'} ${isSelected ? 'selected' : ''}`}
      style={cardStyle}
      onClick={() => onClick(artwork)}
      data-x={x}
      data-z={z}
    >
      <div className="artwork-fade-in">
        <div className="artwork-spotlight" />
        <div className="artwork-frame">
          <div 
            className="artwork-canvas"
            style={artwork.imageUrl ? { backgroundImage: `url(${artwork.imageUrl})` } : {}}
          >
            {!artwork.imageUrl && (
              <div 
                className="artwork-placeholder" 
                style={{ background: getGradient() }}
              >
                <span className="placeholder-cat">{artwork.section}</span>
                <span className="placeholder-title">{artwork.title}</span>
                <span className="placeholder-price">₹{artwork.price.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Ornate wall label below the painting */}
        <div className="artwork-wall-label">
          {artwork.title} ({artwork.year})
          <span>₹{artwork.price}</span>
        </div>
      </div>
    </div>
  );
}
