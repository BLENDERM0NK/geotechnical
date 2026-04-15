import React, { useId } from 'react';

const DEFAULT_D_M = 0.6;
const PX_PER_M = 32;
const MIN_PROFILE_H = 96;
const MAX_PROFILE_H = 268;
const SOIL_COL_W = 112;
const LABEL_X = 122;
const MARGIN_BOTTOM = 26;
const PAD_SIDE = 8;

const CAP_PX_PER_M = 26;
const MIN_CAP_H = 18;
const MAX_CAP_H = 54;
const TOP_PAD = 14;
const GAP_CAP_TO_SOIL = 5;

function soilFill(soilName) {
  if (!soilName) return 'rgba(186, 190, 198, 0.72)';
  const s = soilName.toLowerCase();
  if (s.includes('clay')) {
    if (s.includes('high')) return 'rgba(105, 110, 118, 0.82)';
    if (s.includes('medium')) return 'rgba(130, 135, 142, 0.8)';
    return 'rgba(152, 158, 165, 0.78)';
  }
  if (s.includes('sand')) {
    if (s.includes('poorly')) return 'rgba(235, 215, 145, 0.88)';
    if (s.includes('well')) return 'rgba(224, 198, 118, 0.88)';
    if (s.includes('silty')) return 'rgba(218, 192, 128, 0.86)';
    return 'rgba(228, 205, 130, 0.85)';
  }
  return 'rgba(175, 170, 160, 0.75)';
}

function soilStroke(soilName) {
  if (!soilName) return 'rgba(100, 100, 108, 0.55)';
  const s = soilName.toLowerCase();
  if (s.includes('clay')) return 'rgba(55, 60, 68, 0.65)';
  if (s.includes('sand')) return 'rgba(160, 130, 60, 0.7)';
  return 'rgba(90, 85, 78, 0.6)';
}

function shortSoilLabel(name) {
  if (!name) return '—';
  const m = name.match(/\(([^)]+)\)\s*$/);
  if (m) return m[1];
  return name.length > 24 ? `${name.slice(0, 22)}…` : name;
}

/**
 * Stratified soil profile with pile cap on top and semi-transparent pile through soil.
 * @param {Array<{ thickness: string, soil: string }>} profileLayers
 * @param {number} diameterM — pile diameter (m)
 * @param {number} [capThicknessM] — cap thickness (m); optional, scales cap block height
 */
export default function PileCylinderVisual({ profileLayers, diameterM, capThicknessM }) {
  const clipId = useId().replace(/:/g, '');
  const capGradId = `${clipId}-cap`;

  const entries = (profileLayers || []).map((layer, i) => {
    const t = parseFloat(layer.thickness);
    return {
      index: i,
      thicknessM: Number.isFinite(t) ? t : 0,
      soil: layer.soil || '',
    };
  });

  const totalM = entries.reduce((s, e) => s + e.thicknessM, 0);
  const Dm = Number(diameterM);
  const D = Number.isFinite(Dm) && Dm > 0 ? Dm : DEFAULT_D_M;

  if (totalM <= 0) return null;

  const capM = Number(capThicknessM);
  const hasCapDim = Number.isFinite(capM) && capM > 0;
  const capH = hasCapDim
    ? Math.min(MAX_CAP_H, Math.max(MIN_CAP_H, capM * CAP_PX_PER_M))
    : 24;

  const ySoilTop = TOP_PAD + capH + GAP_CAP_TO_SOIL;
  const yCapTop = ySoilTop - capH;

  const profileH = Math.min(MAX_PROFILE_H, Math.max(MIN_PROFILE_H, totalM * PX_PER_M));
  const vbW = SOIL_COL_W + 108 + PAD_SIDE;
  const vbH = ySoilTop + profileH + MARGIN_BOTTOM;

  const scale = profileH / totalM;
  let y = ySoilTop;
  const layerBoxes = [];

  entries.forEach((e) => {
    const h = Math.max(2, e.thicknessM * scale);
    layerBoxes.push({
      ...e,
      y,
      h,
      yMid: y + h / 2,
    });
    y += h;
  });

  const pileTop = ySoilTop;
  const pileBot = ySoilTop + profileH;
  const cx = SOIL_COL_W / 2 + 4;
  const pileW = Math.min(40, Math.max(16, D * 52));
  const capW = Math.min(58, Math.max(pileW * 1.52, pileW + 20));

  return (
    <div
      style={{
        flex: '0 0 auto',
        width: 'min(280px, 100%)',
        padding: '0.55rem',
        borderRadius: '20px',
        background: 'linear-gradient(165deg, #f8fafc 0%, #e8edf3 100%)',
        border: '1px solid rgba(148, 163, 184, 0.55)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9)',
      }}
    >
      <p
        style={{
          margin: '0 0 0.4rem',
          fontSize: '0.72rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          color: '#475569',
          textAlign: 'center',
        }}
      >
        Pile in soil profile
      </p>
      <svg
        width="100%"
        height="auto"
        viewBox={`0 0 ${vbW} ${vbH}`}
        style={{ display: 'block', maxHeight: 360 }}
        aria-hidden
      >
        <defs>
          <clipPath id={clipId}>
            <rect x={PAD_SIDE} y={ySoilTop} width={SOIL_COL_W - PAD_SIDE} height={profileH} rx={4} />
          </clipPath>
          <linearGradient id={capGradId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#d1d9e0" />
            <stop offset="45%" stopColor="#aeb8c2" />
            <stop offset="100%" stopColor="#8f9aa8" />
          </linearGradient>
        </defs>

        <text
          x={cx}
          y={Math.max(11, yCapTop - 2)}
          textAnchor="middle"
          fill="#1e293b"
          fontSize="9"
          fontWeight="800"
        >
          {hasCapDim ? `Pile cap · ${capM.toFixed(2)} m` : 'Pile cap'}
        </text>

        {/* Pile cap (concrete block) */}
        <rect
          x={cx - capW / 2}
          y={yCapTop}
          width={capW}
          height={capH}
          rx={4}
          fill={`url(#${capGradId})`}
          stroke="#334155"
          strokeWidth={1.5}
        />
        <line
          x1={cx - capW / 2 + 3}
          y1={yCapTop + 5}
          x2={cx + capW / 2 - 3}
          y2={yCapTop + 5}
          stroke="rgba(255,255,255,0.45)"
          strokeWidth={1}
        />

        {/* Ground / fill surface */}
        <line
          x1={PAD_SIDE}
          y1={ySoilTop}
          x2={SOIL_COL_W - 2}
          y2={ySoilTop}
          stroke="#4338ca"
          strokeWidth={2}
          strokeDasharray="5 4"
        />
        <text
          x={SOIL_COL_W / 2 + 2}
          y={ySoilTop - 3}
          textAnchor="middle"
          fill="#4338ca"
          fontSize="9"
          fontWeight="700"
        >
          Ground
        </text>

        <g clipPath={`url(#${clipId})`}>
          {layerBoxes.map((box) => (
            <rect
              key={`soil-${box.index}`}
              x={PAD_SIDE}
              y={box.y}
              width={SOIL_COL_W - PAD_SIDE}
              height={box.h}
              fill={soilFill(box.soil)}
              stroke={soilStroke(box.soil)}
              strokeWidth={1}
            />
          ))}
        </g>

        {layerBoxes.slice(0, -1).map((box) => (
          <line
            key={`bnd-${box.index}`}
            x1={PAD_SIDE}
            y1={box.y + box.h}
            x2={SOIL_COL_W - 2}
            y2={box.y + box.h}
            stroke="#0f172a"
            strokeWidth={1.25}
            strokeOpacity={0.45}
          />
        ))}

        <rect
          x={cx - pileW / 2}
          y={pileTop}
          width={pileW}
          height={pileBot - pileTop}
          fill="rgba(226, 232, 240, 0.38)"
          stroke="#334155"
          strokeWidth={1.4}
          rx={2}
        />
        <line
          x1={cx - pileW / 2}
          y1={pileTop + 4}
          x2={cx + pileW / 2}
          y2={pileTop + 4}
          stroke="rgba(51, 65, 85, 0.5)"
          strokeWidth={1}
        />

        {/* Shaft through cap (below label zone, connects to soil column) */}
        <rect
          x={cx - pileW / 2}
          y={yCapTop + capH * 0.62}
          width={pileW}
          height={Math.max(0, ySoilTop - (yCapTop + capH * 0.62))}
          fill="rgba(203, 213, 225, 0.62)"
          stroke="#475569"
          strokeWidth={1}
          rx={1}
        />

        {layerBoxes.map((box) => (
          <g key={`lbl-${box.index}`}>
            <text
              x={LABEL_X}
              y={box.yMid - 4}
              fill="#0f172a"
              fontSize="10"
              fontWeight="800"
            >
              {`L${box.index + 1}: ${box.thicknessM.toFixed(2)} m`}
            </text>
            <text
              x={LABEL_X}
              y={box.yMid + 9}
              fill="#334155"
              fontSize="9"
              fontWeight="600"
            >
              {shortSoilLabel(box.soil)}
            </text>
          </g>
        ))}

        <text
          x={vbW / 2}
          y={vbH - 6}
          textAnchor="middle"
          fill="#0f172a"
          fontSize="10"
          fontWeight="700"
        >
          {`Σ depth = ${totalM.toFixed(2)} m · Ø ${D.toFixed(2)} m`}
        </text>
      </svg>
    </div>
  );
}
