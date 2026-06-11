import React from 'react';

interface FooterProps {
  zDepth: number;
  xPos?: number;
}

export default function Footer({ zDepth, xPos = 0 }: FooterProps) {
  return (
    <div
      className="footer-wall"
      style={{
        transform: `translate3d(${xPos}px, 0, ${zDepth}px)`
      }}
      data-x={xPos}
      data-z={zDepth}
    >
      <div className="footer-content-panel">
        <h2 className="footer-title">Contact &amp; Purchase</h2>
        
        <div className="footer-grid">
          <div className="footer-item">
            <h3>Inquiries</h3>
            <p>
              Interested in acquiring any piece?<br />
              Contact the artist directly at:<br />
              <a href="mailto:sadhnamehta_2008@hotmail.com">sadhnamehta_2008@hotmail.com</a>
            </p>
          </div>
          
          <div className="footer-item">
            <h3>Studio</h3>
            <p>
              COMING SOON
            </p>
          </div>
          
          <div className="footer-item">
            <h3>Location</h3>
            <p>
              COMING SOON
            </p>
          </div>
        </div>

        <p className="footer-copyright">
          &copy; {new Date().getFullYear()} Sadhna Mehta. All Rights Reserved.
        </p>
      </div>
    </div>
  );
}
