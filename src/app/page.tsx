'use client';

import React, { useEffect, useRef, useState } from 'react';
import { preload } from 'react-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ArtworkCard from '../components/ArtworkCard';
import DetailView from '../components/DetailView';
import { artworksList, sectionDepths, Artwork } from '../data/artworks';

type SectionType = 'entrance' | 'portraits' | 'landscapes' | 'abstracts' | 'contact';
type FocusStateType = 'none' | 'look' | 'detail';

// Camera transform solver for turning corridor layout
const getCameraTransform = (S: number) => {
  let x = 0;
  let z = 0;
  let rotY = 0;

  if (S <= 3800) {
    // Segment 1 (Portraits): move straight along Z
    x = 0;
    z = -S;
    rotY = 0;
  } else if (S <= 4800) {
    // Corner 1: Rotate 90 degrees left (heading shifts from 0 to 90)
    const t = (S - 3800) / 1000;
    x = 0;
    z = -3800;
    rotY = t * 90;
  } else if (S <= 8600) {
    // Segment 2 (Landscapes): move left along negative X
    const dist = S - 4800;
    x = -dist;
    z = -3800;
    rotY = 90;
  } else if (S <= 9600) {
    // Corner 2: Rotate 90 degrees right (heading shifts back from 90 to 0)
    const t = (S - 8600) / 1000;
    x = -3800;
    z = -3800;
    rotY = 90 - (t * 90);
  } else {
    // Segment 3 (Abstracts + Exit): move straight along Z
    const dist = S - 9600;
    x = -3800;
    z = -3800 - dist;
    rotY = 0;
  }
  return { x, z, rotY };
};

export default function Home() {
  preload('/assets/door_single.png', { as: 'image' });
  preload('/assets/wall.png', { as: 'image' });
  preload('/assets/portrait-1.jpeg', { as: 'image' });
  preload('/assets/portrait-2.jpeg', { as: 'image' });
  preload('/assets/portrait-3.jpeg', { as: 'image' });
  preload('/assets/portrait-4.jpeg', { as: 'image' });
  preload('/assets/portrait-5.jpeg', { as: 'image' });
  preload('/assets/portrait-6.jpeg', { as: 'image' });
  preload('/assets/portrait-7.jpeg', { as: 'image' });

  const [currentSection, setCurrentSection] = useState<SectionType>('entrance');
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [focusState, setFocusState] = useState<FocusStateType>('none');
  const [signboardSwinging, setSignboardSwinging] = useState(false);
  
  // Cinematic states
  const [runwayHeight, setRunwayHeight] = useState<string>('15000px');

  // Refs for smooth scroll interpolation
  const targetScrollZ = useRef(0);
  const currentScrollZ = useRef(0);
  const animationFrameId = useRef<number | null>(null);
  const scrollAnimFrameId = useRef<number | null>(null);

  const sceneRef = useRef<HTMLDivElement | null>(null);
  const leftDoorRef = useRef<HTMLDivElement | null>(null);
  const rightDoorRef = useRef<HTMLDivElement | null>(null);
  
  // Refs for closing doors at the end of the museum
  const exitLeftDoorRef = useRef<HTMLDivElement | null>(null);
  const exitRightDoorRef = useRef<HTMLDivElement | null>(null);

  // Refs for transition lockout state
  const isTransitioningRef = useRef(false);
  const isNavigatingRef = useRef(false);

  // Performance refs
  const cullablesRef = useRef<HTMLElement[]>([]);
  const isLoopRunning = useRef(false);
  const needsRequeryRef = useRef(true);

  needsRequeryRef.current = true;

  // S extends to 13450, stopping the camera at Z = -7650 (150px before footer wall at Z = -7800)
  const maxDepth = 13450; 

  useEffect(() => {
    setRunwayHeight(`${maxDepth + window.innerHeight}px`);
  }, []);

  useEffect(() => {
    const updateScene = () => {
      if (needsRequeryRef.current && sceneRef.current) {
        const els = sceneRef.current.querySelectorAll('.artwork-3d-card, .section-marker-3d, .door-frame, .exit-door-frame, .footer-wall, .brick-wall-panel, .entrance-banner');
        cullablesRef.current = Array.from(els) as HTMLElement[];
        needsRequeryRef.current = false;
      }

      let diff = targetScrollZ.current - currentScrollZ.current;
      if (isNaN(diff)) {
        diff = 0;
      }

      // Settle the scroll position and pause loop when the difference is tiny
      if (Math.abs(diff) < 0.05 && focusState === 'none') {
        currentScrollZ.current = targetScrollZ.current;
        isLoopRunning.current = false;
        animationFrameId.current = null;
      } else {
        currentScrollZ.current += diff * 0.08;
        if (isNaN(currentScrollZ.current)) {
          currentScrollZ.current = 0;
        }
        animationFrameId.current = requestAnimationFrame(updateScene);
      }

      const lerpedZ = isNaN(currentScrollZ.current) ? 0 : currentScrollZ.current;
      const S = lerpedZ;

      // Solve camera world position and rotation
      const { x: camX, z: camZ, rotY: camRotY } = getCameraTransform(S);

      // Determine active section based on Z-depth
      let activeSec: SectionType = 'entrance';

      if (S >= sectionDepths.contact - 400) {
        activeSec = 'contact';
      } else if (S >= 9600 - 400) {
        activeSec = 'abstracts';
      } else if (S >= 4800 - 400) {
        activeSec = 'landscapes';
      } else if (S >= 400) {
        activeSec = 'portraits';
      }
      setCurrentSection(activeSec);

      // DOM-based performance culling using turning coordinate math:
      cullablesRef.current.forEach((el) => {
        if (focusState !== 'none') {
          if (el.style.visibility !== 'visible') {
            el.style.visibility = 'visible';
          }
          return;
        }

        const elX = parseFloat(el.getAttribute('data-x') || '0');
        const elZ = parseFloat(el.getAttribute('data-z') || '0');
        const dx = elX - camX;
        const dz = elZ - camZ;

        // Project coordinate into camera's local forward plane
        const rad = (camRotY * Math.PI) / 180;
        const localZ = dx * Math.sin(rad) + dz * Math.cos(rad);
        const dist = Math.sqrt(dx * dx + dz * dz);

        // Hide if behind the camera or too far away
        if (localZ > 850 || dist > 3800) {
          if (el.style.visibility !== 'hidden') {
            el.style.visibility = 'hidden';
          }
        } else {
          if (el.style.visibility !== 'visible') {
            el.style.visibility = 'visible';
          }
          
          if (el.classList.contains('section-marker-3d')) {
            const opacity = Math.min(1, Math.max(0, (2500 - dist) / 1300));
            el.style.opacity = opacity.toString();
          }
        }
      });

      // Update Transformations of Scene if not panned (using negated camera rotation)
      if (focusState === 'none' && sceneRef.current && !isTransitioningRef.current) {
        sceneRef.current.style.transform = `rotateY(${-camRotY}deg) translate3d(${-camX}px, 0, ${-camZ}px)`;
        sceneRef.current.style.transition = 'none';
      }

      // Update Door animations
      if (sceneRef.current) {
        const doorOpenProgress = Math.min(1, Math.max(0, S / 300));
        const angle = doorOpenProgress * 90;
        sceneRef.current.style.setProperty('--entrance-open-progress', doorOpenProgress.toString());

        if (leftDoorRef.current && rightDoorRef.current) {
          leftDoorRef.current.style.transform = `rotateY(-${angle}deg)`;
          rightDoorRef.current.style.transform = `rotateY(${angle}deg)`;
        }

        // Exit doors open near the end of Segment 3 (starts opening as camera gets close)
        const exitDoorOpenProgress = Math.min(1, Math.max(0, (S - 12000) / 600));
        const exitAngle = exitDoorOpenProgress * 90;
        sceneRef.current.style.setProperty('--exit-open-progress', exitDoorOpenProgress.toString());

        if (exitLeftDoorRef.current && exitRightDoorRef.current) {
          exitLeftDoorRef.current.style.transform = `rotateY(-${exitAngle}deg)`;
          exitRightDoorRef.current.style.transform = `rotateY(${exitAngle}deg)`;
        }
      }
    };

    const startAnimationLoop = () => {
      if (!isLoopRunning.current) {
        isLoopRunning.current = true;
        animationFrameId.current = requestAnimationFrame(updateScene);
      }
    };

    const handleScroll = () => {
      if (focusState === 'detail') return;

      if (focusState === 'look') {
        setFocusState('none');
        setSelectedArtwork(null);
        return;
      }

      const scrollTop = window.scrollY || 0;
      const docHeight = document.documentElement.scrollHeight || document.body.scrollHeight || 0;
      const winHeight = window.innerHeight || 0;
      const maxScroll = docHeight - winHeight;
      const progress = maxScroll > 0 ? scrollTop / maxScroll : 0;

      const nextTargetZ = progress * maxDepth;
      targetScrollZ.current = isNaN(nextTargetZ) ? 0 : nextTargetZ;

      startAnimationLoop();
    };

    startAnimationLoop();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      isLoopRunning.current = false;
    };
  }, [focusState]);

  // Two-Step Camera Focus Logic
  useEffect(() => {
    if (sceneRef.current && selectedArtwork) {
      const { x, z } = selectedArtwork.position;
      const ry = selectedArtwork.rotationY;

      sceneRef.current.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';

      const viewDistance = 220;
      const targetRotY = ry + 180;

      const rad = (ry * Math.PI) / 180;
      const targetCamX = x + viewDistance * Math.sin(rad);
      const targetCamZ = z + viewDistance * Math.cos(rad);

      if (focusState === 'look') {
        sceneRef.current.style.transform = `rotateY(${-targetRotY}deg) translate3d(${-targetCamX}px, 0, ${-targetCamZ}px)`;
      } else if (focusState === 'detail') {
        // Shift camera 120px to the right locally
        const rotRad = (-targetRotY * Math.PI) / 180;
        const dx = 120 * Math.cos(rotRad);
        const dz = -120 * Math.sin(rotRad);
        
        const finalCamX = targetCamX + dx;
        const finalCamZ = targetCamZ + dz;

        sceneRef.current.style.transform = `rotateY(${-targetRotY}deg) translate3d(${-finalCamX}px, 0, ${-finalCamZ}px)`;
      }
    } else if (sceneRef.current && focusState === 'none') {
      const { x: camX, z: camZ, rotY: camRotY } = getCameraTransform(currentScrollZ.current);
      if (isNavigatingRef.current) {
        isNavigatingRef.current = false;
        sceneRef.current.style.transition = 'none';
        sceneRef.current.style.transform = `rotateY(${-camRotY}deg) translate3d(${-camX}px, 0, ${-camZ}px)`;
      } else {
        isTransitioningRef.current = true;
        sceneRef.current.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        sceneRef.current.style.transform = `rotateY(${-camRotY}deg) translate3d(${-camX}px, 0, ${-camZ}px)`;
        
        const timer = setTimeout(() => {
          isTransitioningRef.current = false;
        }, 600);
        return () => clearTimeout(timer);
      }
    }
  }, [focusState, selectedArtwork]);

  // Lock document scroll when zoomed in
  useEffect(() => {
    if (focusState !== 'none') {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [focusState]);

  // Quintic Easing Navigation
  const handleNavigate = (section: SectionType) => {
    if (focusState !== 'none') {
      isNavigatingRef.current = true;
      setFocusState('none');
      setSelectedArtwork(null);
    }

    const targetS = sectionDepths[section];
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const targetY = (targetS / maxDepth) * maxScroll;

    const startY = window.scrollY;
    const difference = targetY - startY;
    const duration = 1500;
    let startTime: number | null = null;

    const scrollStep = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      const ease = progress < 0.5 
        ? 16 * progress * progress * progress * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 5) / 2;

      window.scrollTo(0, startY + difference * ease);

      if (progress < 1) {
        scrollAnimFrameId.current = requestAnimationFrame(scrollStep);
      }
    };

    if (scrollAnimFrameId.current) cancelAnimationFrame(scrollAnimFrameId.current);
    scrollAnimFrameId.current = requestAnimationFrame(scrollStep);
  };

  const handleCardClick = (artwork: Artwork) => {
    if (!selectedArtwork || selectedArtwork.id !== artwork.id) {
      setSelectedArtwork(artwork);
      setFocusState('detail'); // Single-click goes straight to detail view Spec Sheet
    } else {
      setFocusState('none');
      setSelectedArtwork(null);
    }
  };

  const handleCloseDetail = () => {
    setFocusState('none');
    setSelectedArtwork(null);
  };

  const triggerSignboardSwing = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (signboardSwinging) return;
    setSignboardSwinging(true);
    setTimeout(() => {
      setSignboardSwinging(false);
    }, 1800);
  };

  return (
    <>
      {/* Translucent Navbar */}
      <Navbar 
        currentSection={currentSection} 
        onNavigate={handleNavigate} 
      />

      {/* Main 3D Viewport */}
      <div className="viewport-container">
        <div 
          ref={sceneRef} 
          className="scene-3d"
        >
          {/* Entrance Double Doors (Z = -200px) */}
          <div className="door-frame entrance-door-frame" data-x="0" data-z="-200">
            <div ref={leftDoorRef} className="door-left">
              <div className="signboard-container">
                <div className="signboard-nail" />
                <svg width="60" height="24" style={{ display: 'block', pointerEvents: 'none' }}>
                  <line x1="10" y1="24" x2="30" y2="4" stroke="#633215" strokeWidth="2" />
                  <line x1="50" y1="24" x2="30" y2="4" stroke="#633215" strokeWidth="2" />
                </svg>
                <div className={`signboard-wood ${signboardSwinging ? 'swinging' : ''}`} onClick={triggerSignboardSwing}>
                  <div className="signboard-text">Scroll To Enter</div>
                </div>
              </div>
              <div className="door-knob" />
            </div>
            <div ref={rightDoorRef} className="door-right">
              <div className="door-knob" />
            </div>
          </div>

          {/* Corridor elements */}
          <div className="corridor">
            {/* Corridor Segment 1 Floor & Ceiling (Z-axis corridor) */}
            <div className="floor-grid segment-1-floor" style={{ width: '800px', height: '4200px', left: '0', top: '0', position: 'absolute', transform: 'translate3d(0px, 300px, 0px) rotateX(90deg)', transformOrigin: 'top center' }} />
            <div className="ceiling-grid segment-1-ceiling" style={{ width: '800px', height: '4200px', left: '0', top: '0', position: 'absolute', transform: 'translate3d(0px, -300px, -4200px) rotateX(-90deg)', transformOrigin: 'top center' }} />

            {/* Corridor Segment 2 Floor & Ceiling (X-axis corridor turning left) */}
            <div className="floor-grid segment-2-floor" style={{ width: '3800px', height: '800px', left: '0', top: '0', position: 'absolute', transform: 'translate3d(-3800px, 300px, -3400px) rotateX(90deg)', transformOrigin: 'top left', backgroundSize: '20px 20px' }} />
            <div className="ceiling-grid segment-2-ceiling" style={{ width: '3800px', height: '800px', left: '0', top: '0', position: 'absolute', transform: 'translate3d(-3800px, -300px, -4200px) rotateX(-90deg)', transformOrigin: 'top left', backgroundSize: '100px 100px' }} />

            {/* Corridor Segment 3 Floor & Ceiling (Z-axis corridor turning right) */}
            <div className="floor-grid segment-3-floor" style={{ width: '800px', height: '4200px', left: '0', top: '0', position: 'absolute', transform: 'translate3d(-3800px, 300px, -3800px) rotateX(90deg)', transformOrigin: 'top center' }} />
            <div className="ceiling-grid segment-3-ceiling" style={{ width: '800px', height: '4200px', left: '0', top: '0', position: 'absolute', transform: 'translate3d(-3800px, -300px, -8000px) rotateX(-90deg)', transformOrigin: 'top center' }} />

            {/* Guide Rails (Light Strips) for Segment 1 */}
            <div className="light-strip-left" style={{ width: '2px', height: '4200px', left: '0', top: '0', position: 'absolute', transform: 'translate3d(-400px, 300px, 0) rotateX(90deg)', transformOrigin: 'top left' }} />
            <div className="light-strip-right" style={{ width: '2px', height: '4200px', left: '0', top: '0', position: 'absolute', transform: 'translate3d(400px, 300px, 0) rotateX(90deg)', transformOrigin: 'top left' }} />
            
            {/* Guide Rails (Light Strips) for Segment 2 */}
            <div className="light-strip-left" style={{ width: '3800px', height: '2px', left: '0', top: '0', position: 'absolute', transform: 'translate3d(-3800px, 300px, -3400px) rotateX(90deg)', transformOrigin: 'top left' }} />
            <div className="light-strip-right" style={{ width: '3800px', height: '2px', left: '0', top: '0', position: 'absolute', transform: 'translate3d(-3800px, 300px, -4200px) rotateX(90deg)', transformOrigin: 'top left' }} />
            
            {/* Guide Rails (Light Strips) for Segment 3 */}
            <div className="light-strip-left" style={{ width: '2px', height: '4200px', left: '0', top: '0', position: 'absolute', transform: 'translate3d(-4200px, 300px, -3800px) rotateX(90deg)', transformOrigin: 'top left' }} />
            <div className="light-strip-right" style={{ width: '2px', height: '4200px', left: '0', top: '0', position: 'absolute', transform: 'translate3d(-3400px, 300px, -3800px) rotateX(90deg)', transformOrigin: 'top left' }} />

            {/* Brick flanking walls around the door frame (Z = -200px) */}
            <div className="brick-wall-panel brick-wall-left" data-x="0" data-z="-200" />
            <div className="brick-wall-panel brick-wall-right" data-x="0" data-z="-200" />

            {/* Welcome banner behind the doors */}
            <div className="entrance-banner" data-x="0" data-z="-210">
              <h1>Sadhna Mehta</h1>
              <p>A Painted Journey</p>
            </div>

            {/* Exit Double Doors at the end of the museum hallway (Segment 3, Z = -7400px, X = -3800px) */}
            <div className="exit-door-frame" data-x="-3800" data-z="-7400" style={{ transform: 'translate3d(-3800px, 0, -7400px)' }}>
              <div ref={exitLeftDoorRef} className="exit-door-left">
                <div className="door-knob" />
              </div>
              <div ref={exitRightDoorRef} className="exit-door-right">
                <div className="door-knob" />
              </div>
            </div>

            {/* Portraits Section Title Board hanging from ceiling (Segment 1) */}
            <div className="section-marker-3d" style={{ transform: 'translate3d(0, -135px, -900px)' }} data-x="0" data-z="-900">
              <h2 className="section-marker-title">Portraits</h2>
              <p className="section-marker-subtitle">Depth &amp; Reflection</p>
            </div>

            {/* Landscapes Section Title Board hanging from ceiling (Segment 2) */}
            <div className="section-marker-3d" style={{ transform: 'translate3d(-1000px, -135px, -3800px) rotateY(90deg)' }} data-x="-1000" data-z="-3800">
              <h2 className="section-marker-title">Landscapes</h2>
              <p className="section-marker-subtitle">Scenic &amp; Vast</p>
            </div>

            {/* Abstracts Section Title Board hanging from ceiling (Segment 3) */}
            <div className="section-marker-3d" style={{ transform: 'translate3d(-3800px, -135px, -4400px)' }} data-x="-3800" data-z="-4400">
              <h2 className="section-marker-title">Abstracts</h2>
              <p className="section-marker-subtitle">Form &amp; Color</p>
            </div>

            {/* 3D Artwork Cards */}
            {artworksList.map((artwork) => (
              <ArtworkCard
                key={artwork.id}
                artwork={artwork}
                onClick={handleCardClick}
                isBlurred={selectedArtwork !== null && selectedArtwork.id !== artwork.id}
                isSelected={selectedArtwork !== null && selectedArtwork.id === artwork.id}
                isZoomable={focusState === 'detail' && selectedArtwork !== null && selectedArtwork.id === artwork.id}
              />
            ))}

            {/* Footer Contact Wall at the very end of Segment 3 (Z = -7800px) */}
            <Footer zDepth={-7800} xPos={-3800} />
          </div>
        </div>
      </div>

      {/* Scroll Runway to generate page height */}
      <div className="scroll-runway" style={{ height: runwayHeight }} />

      {/* Interactive Closeup Side panel */}
      <DetailView artwork={focusState === 'detail' ? selectedArtwork : null} onClose={handleCloseDetail} />
    </>
  );
}
