export function layersCompleteForPdf(layers, pile) {
  if (!layers || layers.length === 0) return false;
  const D = parseFloat(pile?.diameter);
  const L = parseFloat(pile?.length);
  if (!Number.isFinite(D) || D <= 0) return false;
  if (!Number.isFinite(L) || L <= 0) return false;
  return layers.every((layer) => {
    if (!layer?.soil || String(layer.soil).trim() === '') return false;
    const t = parseFloat(layer.thickness);
    if (!Number.isFinite(t) || t <= 0) return false;
    if (!Number.isFinite(parseFloat(layer.unitWeight))) return false;
    if (layer.phi === '' || layer.phi == null) return false;
    if (!Number.isFinite(parseFloat(layer.phi))) return false;
    if (layer.cohesion === '' || layer.cohesion == null) return false;
    if (!Number.isFinite(parseFloat(layer.cohesion))) return false;
    return true;
  });
}
