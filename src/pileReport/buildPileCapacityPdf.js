import { jsPDF } from 'jspdf';

const PAGE_BOTTOM = 287;
const MARGIN = 14;
const LINE = 5.2;
const PAGE_W = 210;
const CONTENT_W = PAGE_W - MARGIN * 2;

function fmt(v) {
  if (v === null || v === undefined || v === '') return '—';
  if (typeof v === 'number' && Number.isFinite(v)) return String(v);
  return String(v);
}

function fmtN(v, dp = 3) {
  const n = typeof v === 'number' ? v : parseFloat(v);
  if (!Number.isFinite(n)) return '—';
  return n.toFixed(dp);
}

function safeNum(v, fallback = 0) {
  const n = typeof v === 'number' ? v : parseFloat(v);
  return Number.isFinite(n) ? n : fallback;
}

function ensureSpace(doc, y, needed = 12) {
  if (y + needed > PAGE_BOTTOM) {
    doc.addPage();
    return MARGIN;
  }
  return y;
}

function addHeading(doc, y, text) {
  let yy = ensureSpace(doc, y, 10);
  doc.setFont(undefined, 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(text, MARGIN, yy);
  doc.setFont(undefined, 'normal');
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  return yy + LINE + 1;
}

function addSubheading(doc, y, text) {
  let yy = ensureSpace(doc, y, 8);
  doc.setFont(undefined, 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.text(text, MARGIN, yy);
  doc.setFont(undefined, 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(30, 41, 59);
  return yy + LINE;
}

function addLines(doc, y, lines) {
  let yy = y;
  doc.setFontSize(9.5);
  for (let i = 0; i < lines.length; i += 1) {
    yy = ensureSpace(doc, yy, LINE + 2);
    const wrapped = doc.splitTextToSize(lines[i], CONTENT_W);
    for (let j = 0; j < wrapped.length; j += 1) {
      yy = ensureSpace(doc, yy, LINE + 1);
      doc.text(wrapped[j], MARGIN, yy);
      yy += LINE;
    }
  }
  return yy + 2;
}

function addKeyValue(doc, y, rows) {
  let yy = y;
  const keyW = 62;
  const valX = MARGIN + keyW + 4;
  const valW = CONTENT_W - keyW - 4;
  doc.setFontSize(9.5);
  rows.forEach(([k, v]) => {
    const key = String(k);
    const val = String(v);
    const valLines = doc.splitTextToSize(val, valW);
    const needed = Math.max(1, valLines.length) * LINE + 2;
    yy = ensureSpace(doc, yy, needed);
    doc.setFont(undefined, 'bold');
    doc.text(`${key}:`, MARGIN, yy);
    doc.setFont(undefined, 'normal');
    for (let j = 0; j < valLines.length; j += 1) {
      doc.text(valLines[j], valX, yy + j * LINE);
    }
    yy += Math.max(1, valLines.length) * LINE;
  });
  return yy + 2;
}

function hr(doc, y) {
  let yy = ensureSpace(doc, y, 6);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.6);
  doc.line(MARGIN, yy, MARGIN + CONTENT_W, yy);
  return yy + 4;
}

export function buildPileCapacityPdf({
  pile,
  layers,
  maxOverburden,
  totalDepth,
  overburdenAtDepth,
  profilePngDataUrl = null,
}) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  let y = MARGIN;

  doc.setFontSize(16);
  doc.setTextColor(30, 27, 75);
  doc.text('Pile foundation capacity report', MARGIN, y);
  y += 9;

  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105);
  const generated = new Date().toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
  doc.text(`Generated: ${generated}`, MARGIN, y);
  y += LINE + 4;

  doc.setTextColor(30, 41, 59);
  y = addHeading(doc, y, 'Pile and critical depth');
  const capT = pile.capThickness !== '' && pile.capThickness != null ? pile.capThickness : '—';
  y = addKeyValue(doc, y, [
    ['Pile diameter D (m)', fmt(pile.diameter)],
    ['Pile length L (m)', fmt(pile.length)],
    ['Pile cap thickness (m)', fmt(capT)],
    ['Critical depth factor', fmt(pile.factor)],
    ['Critical depth (m)', fmt(pile.criticalDepth)],
  ]);

  y = addHeading(doc, y, 'Design snapshot');
  y = addKeyValue(doc, y, [
    ['Total soil depth (m)', fmt(totalDepth)],
    ['Overburden at depth Pd(total) (kN/m^2)', fmt(overburdenAtDepth)],
    ['Max overburden Pd_max (kN/m^2)', maxOverburden > 0 ? fmt(maxOverburden) : '—'],
  ]);

  const D = parseFloat(pile.diameter) || 0;
  const ApN = D > 0 ? (Math.PI * D * D) / 4 : 0;
  const Ap = D > 0 ? ApN.toFixed(4) : '—';

  if (profilePngDataUrl) {
    y = addHeading(doc, y, 'Pile in soil profile (illustration)');
    try {
      const imgW = CONTENT_W;
      const imgH = imgW * 0.72;
      y = ensureSpace(doc, y, imgH + 8);
      doc.addImage(profilePngDataUrl, 'PNG', MARGIN, y, imgW, imgH);
      y += imgH + 6;
    } catch {
      y = addLines(doc, y, ['(Profile image could not be embedded.)']);
    }
  }

  y = addHeading(doc, y, 'Layer-by-layer calculations');
  y = addLines(doc, y, [
    'Notes:',
    '- Text is kept in plain ASCII for reliable PDF rendering.',
    '- Overburden uses effective unit weight gamma_eff = max(0, gamma - 10) as used in the app.',
    '- Skin friction is cumulative up to the selected layer (as in the UI).',
  ]);
  y = hr(doc, y);

  for (let i = 0; i < layers.length; i += 1) {
    const l = layers[i];
    // thickness exists in report; numeric t not needed beyond display right now
    const gamma = safeNum(l.unitWeight, 0);
    const gammaEff = Math.max(0, gamma - 10);
    const phiDeg = safeNum(l.phi, NaN);
    const deltaRadN = Number.isFinite(phiDeg) ? (phiDeg * Math.PI) / 180 : NaN;

    y = addHeading(doc, y, `Layer ${i + 1} (summary)`);
    y = addKeyValue(doc, y, [
      ['Soil type', fmt(l.soil)],
      ['Thickness t (m)', fmt(l.thickness)],
      ['Unit weight gamma (kN/m^3)', fmt(l.unitWeight)],
      ['Effective unit weight gamma_eff (kN/m^3)', fmtN(gammaEff, 3)],
      ['Friction angle phi (deg)', fmt(l.phi)],
      ['Cohesion C (kN/m^2)', fmt(l.cohesion)],
    ]);

    y = addSubheading(doc, y, 'Derived parameters (from app)');
    y = addKeyValue(doc, y, [
      ['Nq', fmt(l.Nq)],
      ['Ngamma', fmt(l.Ng)],
      ['Ki', fmt(l.Ki)],
      ['alpha', fmt(l.alpha)],
      ['Asi (m^2)', fmt(l.Asi)],
      ['Pd at layer base (kN/m^2)', fmt(l.Pd)],
      ['Pdi at mid-layer (kN/m^2)', fmt(l.Pdi)],
    ]);

    y = addSubheading(doc, y, 'End bearing (if calculated)');
    if (l.endBearing != null) {
      const Cp = safeNum(l.cohesion, 0);
      const Pd = safeNum(l.Pd, 0);
      const Ng = safeNum(l.Ng, 0);
      const Nq = safeNum(l.Nq, 0);
      const Nc = 9;
      const qb = (0.5 * D * gamma * Ng) + (Pd * Nq) + (Nc * Cp);
      const Qb = ApN * qb;
      const QbShown = safeNum(l.endBearing, Qb);
      const rec = (QbShown / 2.5).toFixed(2);
      y = addLines(doc, y, [
        'Formula used in app:',
        'Qb = Ap * [ (0.5 * D * gamma * Ngamma) + (Pd * Nq) + (Nc * C) ]',
        `Ap = pi/4 * D^2 = ${Ap} m^2`,
        `qb = (0.5*${fmtN(D, 3)}*${fmtN(gamma, 3)}*${fmtN(Ng, 3)}) + (${fmtN(Pd, 3)}*${fmtN(Nq, 3)}) + (${Nc}*${fmtN(Cp, 3)})`,
        `qb = ${fmtN(qb, 3)} kN/m^2`,
        `Qb = Ap * qb = ${fmtN(QbShown, 3)} kN`,
        `Recommended = Qb / 2.5 = ${rec} kN`,
      ]);
    } else {
      y = addLines(doc, y, ['Not computed yet. In the UI, click "End bearing" on this layer to store the result.']);
    }

    y = addSubheading(doc, y, 'Skin friction (if calculated)');
    if (l.skinFriction != null) {
      const Ki_i = safeNum(l.Ki, 1);
      const Pdi_i = safeNum(l.Pdi, 0);
      const alpha_i = safeNum(l.alpha, 0);
      const Ci_i = safeNum(l.cohesion, 0);
      const Asi_i = safeNum(l.Asi, 0);
      const tanDelta = Number.isFinite(deltaRadN) ? Math.tan(deltaRadN) : 0;
      const unitFs = (Ki_i * Pdi_i * tanDelta) + (alpha_i * Ci_i);
      const part = unitFs * Asi_i;

      const stored = safeNum(l.skinFriction, part);
      const rec = (stored / 2.5).toFixed(2);
      y = addLines(doc, y, [
        'Formula used in app (cumulative to this layer):',
        'Fs = sum_j[ Ki_j * Pdi_j * tan(delta_j) * Asi_j + alpha_j * C_j * Asi_j ]',
        `For this layer: delta = phi (deg) converted to rad; delta = ${Number.isFinite(deltaRadN) ? fmtN(deltaRadN, 4) : '—'} rad; tan(delta) = ${fmtN(tanDelta, 4)}`,
        `Unit shear term = Ki*Pdi*tan(delta) + alpha*C = ${fmtN(Ki_i, 3)}*${fmtN(Pdi_i, 3)}*${fmtN(tanDelta, 4)} + ${fmtN(alpha_i, 3)}*${fmtN(Ci_i, 3)}`,
        `Unit shear term = ${fmtN(unitFs, 3)} kN/m^2`,
        `Contribution (this layer only) = unit shear term * Asi = ${fmtN(unitFs, 3)} * ${fmtN(Asi_i, 4)} = ${fmtN(part, 3)} kN`,
        `Stored cumulative Fs (to this layer) = ${fmtN(stored, 3)} kN`,
        `Recommended = Fs / 2.5 = ${rec} kN`,
      ]);
    } else {
      y = addLines(doc, y, ['Not computed yet. In the UI, click "Skin friction" on this layer to store the cumulative result.']);
    }

    y = hr(doc, y);
  }

  doc.save(`pile-capacity-report-${new Date().toISOString().slice(0, 10)}.pdf`);
}
