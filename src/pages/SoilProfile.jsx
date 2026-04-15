import React, { useMemo, useRef, useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import {
  Page,
  Canvas,
  Header,
  Title,
  Subtitle,
  FormCard,
  LayerGrid,
  Label,
  Input,
  Select,
  ButtonRow,
  PrimaryButton,
  SecondaryButton,
  LayerList,
  LayerChip,
  CanvasPanel,
  CanvasHeader,
  CanvasWrapper,
  Legend,
  LegendItem,
  ErrorBanner,
} from './SoilProfile.styles';

const soilOptions = [
  'Clay (soft)',
  'Clay (stiff)',
  'Silty clay',
  'Silt',
  'Sand (fine)',
  'Sand (medium)',
  'Sand (coarse)',
  'Gravel',
  'Peat',
  'Rock / Weathered rock',
];

const palette = ['#F4A259', '#5B8A72', '#6A8CAF', '#D95D39', '#A44A3F', '#386641', '#E09F7D', '#8C6D31', '#3D5A80', '#F9844A'];

const shadeColor = (hex, percent) => {
  if (!hex?.startsWith('#')) return hex;
  const num = parseInt(hex.slice(1), 16);
  const r = num >> 16;
  const g = (num >> 8) & 0xff;
  const b = num & 0xff;
  const t = percent < 0 ? 0 : 255;
  const p = Math.abs(percent);
  const R = Math.round((t - r) * p) + r;
  const G = Math.round((t - g) * p) + g;
  const B = Math.round((t - b) * p) + b;
  return `#${((1 << 24) | (R << 16) | (G << 8) | B).toString(16).slice(1)}`;
};

function SoilProfile() {
  const [layers, setLayers] = useState([{ fromDepth: '', toDepth: '', type: '' }]);
  const [profileLayers, setProfileLayers] = useState([]);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const canvasRef = useRef(null);
  const colorMapRef = useRef(new Map());

  const colorLookup = useMemo(() => {
    // Rebuild map based on profile layers to keep consistent order
    const map = new Map();
    let paletteIndex = 0;
    profileLayers.forEach((layer) => {
      if (!map.has(layer.type)) {
        map.set(layer.type, palette[paletteIndex % palette.length]);
        paletteIndex += 1;
      }
    });
    colorMapRef.current = map;
    return map;
  }, [profileLayers]);

  const handleLayerChange = (index, field, value) => {
    setLayers((prev) => {
      const updated = [...prev];
      if (field === 'fromDepth' && index > 0) {
        return prev; // prevent manual edits on locked fromDepth
      }
      if (field === 'toDepth') {
        const newTo = value;
        updated[index] = { ...updated[index], toDepth: newTo };
        if (updated[index + 1]) {
          updated[index + 1] = { ...updated[index + 1], fromDepth: newTo };
        }
      } else {
        updated[index] = { ...updated[index], [field]: value };
      }
      return updated;
    });
  };

  const addLayer = () => {
    setLayers((prev) => {
      const last = prev[prev.length - 1];
      const nextFrom = last?.toDepth || '';
      return [...prev, { fromDepth: nextFrom, toDepth: '', type: '' }];
    });
  };

  const removeLayer = (index) => {
    setLayers((prev) => prev.filter((_, i) => i !== index));
  };

  const resetLayers = () => {
    setLayers([{ fromDepth: '', toDepth: '', type: '' }]);
    setProfileLayers([]);
    setError('');
    setPreviewUrl('');
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const validateLayers = () => {
    if (!layers.length) {
      setError('Add at least one layer.');
      return false;
    }
    for (let i = 0; i < layers.length; i++) {
      const { fromDepth, toDepth, type } = layers[i];
      if (fromDepth === '' || toDepth === '' || type === '') {
        setError('Fill depth and soil type for every layer.');
        return false;
      }
      const from = parseFloat(fromDepth);
      const to = parseFloat(toDepth);
      if (Number.isNaN(from) || Number.isNaN(to) || from < 0 || to <= from) {
        setError('Depth values must be numeric (To depth > From depth).');
        return false;
      }
      if (i > 0) {
        const prevTo = parseFloat(layers[i - 1].toDepth);
        if (Math.abs(from - prevTo) > 1e-6) {
          setError('Each layer must start exactly where the previous one ended.');
          return false;
        }
      }
    }
    return true;
  };

  const handleCreateProfile = () => {
    if (!validateLayers()) return;

    const parsed = layers
      .map((layer) => ({
        fromDepth: parseFloat(layer.fromDepth),
        toDepth: parseFloat(layer.toDepth),
        thickness: parseFloat(layer.toDepth) - parseFloat(layer.fromDepth),
        type: layer.type,
      }))
      .sort((a, b) => a.fromDepth - b.fromDepth);

    setProfileLayers(parsed);
    setError('');
  };

  const drawProfile = () => {
    const canvas = canvasRef.current;
    if (!canvas || !profileLayers.length) return;
    const width = 480;
    const height = 520;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, width, height);

    const padding = { top: 30, bottom: 50, left: 120, right: 100 };
    const columnWidth = 220;
    const centerX = padding.left + columnWidth / 2;
    const columnTop = padding.top;
    const columnBottom = height - padding.bottom;
    const maxDepth = profileLayers.reduce((max, layer) => Math.max(max, layer.toDepth), 0);
    const scale = (columnBottom - columnTop) / (maxDepth || 1);
    const rx = columnWidth / 2;
    const ry = rx * 0.35;

    // depth axis
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding.left - 40, columnTop);
    ctx.lineTo(padding.left - 40, columnBottom);
    ctx.stroke();
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '12px "Segoe UI", sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    const ticks = 6;
    for (let i = 0; i <= ticks; i++) {
      const depth = (maxDepth / ticks) * i;
      const y = columnTop + depth * scale;
      ctx.fillText(`${depth.toFixed(1)} m`, padding.left - 48, y);
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.beginPath();
      ctx.moveTo(padding.left - 35, y);
      ctx.lineTo(padding.left + columnWidth + 25, y);
      ctx.stroke();
    }

    // draw solid cylinder layers
    profileLayers.forEach((layer, idx) => {
      const color = colorLookup.get(layer.type) || '#94a3b8';
      const topY = columnTop + layer.fromDepth * scale;
      const bottomY = columnTop + layer.toDepth * scale;

      // top cap only for very first layer
      if (idx === 0) {
        ctx.beginPath();
        ctx.ellipse(centerX, topY, rx, ry, 0, 0, Math.PI * 2);
        ctx.fillStyle = shadeColor(color, 0.12);
        ctx.strokeStyle = shadeColor(color, -0.35);
        ctx.lineWidth = 1.5;
        ctx.fill();
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.moveTo(centerX - rx, topY);
      ctx.lineTo(centerX - rx, bottomY);
      ctx.ellipse(centerX, bottomY, rx, ry, 0, Math.PI, 0, false);
      ctx.lineTo(centerX + rx, topY);
      ctx.ellipse(centerX, topY, rx, ry, 0, 0, Math.PI, false);
      ctx.closePath();
      ctx.fillStyle = shadeColor(color, 0);
      ctx.strokeStyle = shadeColor(color, -0.35);
      ctx.lineWidth = 1.5;
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 13px "Segoe UI", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(layer.type, centerX, (topY + bottomY) / 2);

      // separation line to suggest layer boundary
      ctx.beginPath();
      ctx.ellipse(centerX, bottomY, rx, ry, 0, 0, Math.PI * 2);
      ctx.strokeStyle = shadeColor(color, -0.25);
      ctx.lineWidth = 0.6;
      ctx.stroke();

      // bottom cap only on last layer
      if (idx === profileLayers.length - 1) {
        ctx.beginPath();
        ctx.ellipse(centerX, bottomY, rx, ry, 0, 0, Math.PI * 2);
        ctx.fillStyle = shadeColor(color, -0.12);
        ctx.strokeStyle = shadeColor(color, -0.35);
        ctx.lineWidth = 1.5;
        ctx.fill();
        ctx.stroke();
      }
    });
  };

  useEffect(() => {
    drawProfile();
    const canvas = canvasRef.current;
    if (canvas && profileLayers.length) {
      setPreviewUrl(canvas.toDataURL('image/png'));
    } else {
      setPreviewUrl('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileLayers]);

  const handleDownload = () => {
    if (!previewUrl) return;
    const link = document.createElement('a');
    link.download = 'soil-profile.png';
    link.href = previewUrl;
    link.click();
  };

  return (
    <>
      <Navbar />
      <Page>
        <Canvas>
          <Header>
            <Title>Soil Profile Builder</Title>
            <Subtitle>
              Capture layer depths and soil types, then render a colour-coded profile you can download for reports or presentations.
            </Subtitle>
          </Header>

          <FormCard>
            <h3>Layer inputs</h3>
            {layers.map((layer, idx) => (
          <LayerGrid key={`layer-${idx}`}>
                <Label>
                  From depth (m)
                  <Input
                    type="number"
                    min="0"
                    step="0.1"
                    value={layer.fromDepth}
                    onChange={(e) => handleLayerChange(idx, 'fromDepth', e.target.value)}
                    disabled={idx > 0}
                  />
                </Label>
                <Label>
                  To depth (m)
                  <Input type="number" min="0" step="0.1" value={layer.toDepth} onChange={(e) => handleLayerChange(idx, 'toDepth', e.target.value)} />
                </Label>
                <Label>
                  Soil type
                  <Select value={layer.type} onChange={(e) => handleLayerChange(idx, 'type', e.target.value)}>
                    <option value="">Select soil</option>
                    {soilOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Select>
                </Label>
                {layers.length > 1 && (
                  <Label>
                    Actions
                    <SecondaryButton type="button" onClick={() => removeLayer(idx)}>
                      Remove
                    </SecondaryButton>
                  </Label>
                )}
              </LayerGrid>
            ))}

            {error && <ErrorBanner>{error}</ErrorBanner>}

            <ButtonRow>
              <PrimaryButton type="button" onClick={addLayer}>
                + Add layer
              </PrimaryButton>
              <PrimaryButton type="button" onClick={handleCreateProfile}>
                Create profile
              </PrimaryButton>
              <SecondaryButton type="button" onClick={resetLayers}>
                Reset
              </SecondaryButton>
            </ButtonRow>
          </FormCard>

          {profileLayers.length > 0 && (
            <>
              <LayerList>
                {profileLayers.map((layer, idx) => (
                  <LayerChip key={`chip-${idx}`}>
                    <strong>{layer.type}</strong>
                    <span>
                      {layer.fromDepth} m → {layer.toDepth} m ({layer.thickness.toFixed(2)} m)
                    </span>
                  </LayerChip>
                ))}
              </LayerList>

              <CanvasPanel>
                <CanvasHeader>
                  <div>
                    <h2>Profile visualisation</h2>
                    <p style={{ margin: 0, color: 'rgba(226,232,240,0.7)' }}>Colour-coded cross-section scaled to maximum depth.</p>
                  </div>
                  <ButtonRow>
                    <SecondaryButton type="button" onClick={handleDownload}>
                      Download image
                    </SecondaryButton>
                  </ButtonRow>
                </CanvasHeader>
                <CanvasWrapper>
                  <canvas ref={canvasRef} style={{ width: '100%', maxWidth: '480px', borderRadius: '16px' }} />
                </CanvasWrapper>
                {previewUrl && (
                  <div style={{ marginTop: '1rem' }}>
                    <p style={{ margin: '0 0 0.5rem', fontSize: '0.95rem', color: 'rgba(226,232,240,0.7)' }}>Snapshot preview</p>
                    <img
                      src={previewUrl}
                      alt="Soil profile preview"
                      style={{ width: '100%', maxWidth: '480px', borderRadius: '16px', border: '1px solid rgba(148,163,184,0.35)' }}
                    />
                  </div>
                )}
                <Legend>
                  {Array.from(colorLookup.entries()).map(([type, color]) => (
                    <LegendItem key={type} color={color}>
                      {type}
                    </LegendItem>
                  ))}
                </Legend>
              </CanvasPanel>
            </>
          )}
        </Canvas>
      </Page>
    </>
  );
}

export default SoilProfile;

