import React, { useRef, useState } from 'react';
import PileCylinderVisual from './PileCylinderVisual';
import { buildPileCapacityPdf } from '../pileReport/buildPileCapacityPdf';
import { svgElementToPngDataUrl } from '../pileReport/svgToPngDataUrl';

const toolbarStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '0.75rem',
  marginTop: '0.25rem',
};

const captureHostStyle = {
  position: 'fixed',
  left: '-10000px',
  top: 0,
  width: 300,
  pointerEvents: 'none',
  visibility: 'hidden',
};

const pdfButtonBase = {
  padding: '0.65rem 1.35rem',
  background: 'linear-gradient(120deg, #0d9488, #0369a1)',
  color: '#f8fafc',
  border: 'none',
  borderRadius: 999,
  cursor: 'pointer',
  fontSize: '0.95rem',
  fontWeight: 600,
  boxShadow: '0 14px 28px rgba(3, 105, 161, 0.28)',
};

async function captureProfilePngFromHost(hostEl) {
  if (!hostEl) return null;
  const svg = hostEl.querySelector('svg');
  if (!svg) return null;
  return svgElementToPngDataUrl(svg, 2);
}

export default function PileReportExport({
  pile,
  layers,
  maxOverburden,
  totalDepth,
  overburdenAtDepth,
}) {
  const captureRef = useRef(null);
  const [busy, setBusy] = useState(false);

  const handleDownload = async () => {
    setBusy(true);
    try {
      const profilePngDataUrl = await captureProfilePngFromHost(captureRef.current);
      buildPileCapacityPdf({
        pile,
        layers,
        maxOverburden,
        totalDepth,
        overburdenAtDepth,
        profilePngDataUrl,
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      window.alert(
        'Could not create the PDF. If this keeps happening, try another browser or run npm install to ensure jspdf is installed.'
      );
    } finally {
      setBusy(false);
    }
  };

  const diameterM = parseFloat(pile.diameter) || 0;
  const capM = parseFloat(pile.capThickness);
  const capThicknessM = Number.isFinite(capM) ? capM : 0;

  const buttonStyle = {
    ...pdfButtonBase,
    ...(busy ? { opacity: 0.65, cursor: 'wait' } : {}),
  };

  return (
    <>
      <div ref={captureRef} style={captureHostStyle} aria-hidden>
        <PileCylinderVisual
          profileLayers={layers}
          diameterM={diameterM}
          capThicknessM={capThicknessM}
        />
      </div>
      <div style={toolbarStyle}>
        <button type="button" style={buttonStyle} onClick={handleDownload} disabled={busy}>
          {busy ? 'Building PDF…' : 'Download full calculation report (PDF)'}
        </button>
      </div>
    </>
  );
}
