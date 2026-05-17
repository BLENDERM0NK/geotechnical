export function svgElementToPngDataUrl(svgElement, scale = 2) {
  return new Promise((resolve, reject) => {
    if (!svgElement || svgElement.tagName?.toLowerCase() !== 'svg') {
      reject(new Error('Expected an SVG element'));
      return;
    }
    const clone = svgElement.cloneNode(true);
    if (!clone.getAttribute('xmlns')) clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    const vb = clone.getAttribute('viewBox');
    if (!vb) {
      reject(new Error('SVG must have a viewBox'));
      return;
    }
    const parts = vb.trim().split(/\s+/).map(Number);
    if (parts.length !== 4 || parts.some((n) => !Number.isFinite(n))) {
      reject(new Error('Invalid viewBox'));
      return;
    }
    const [, , vw, vh] = parts;
    const w = Math.max(1, Math.round(vw * scale));
    const h = Math.max(1, Math.round(vh * scale));
    clone.setAttribute('width', String(vw));
    clone.setAttribute('height', String(vh));
    const blob = new Blob([new XMLSerializer().serializeToString(clone)], {
      type: 'image/svg+xml;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          URL.revokeObjectURL(url);
          reject(new Error('Canvas not supported'));
          return;
        }
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL('image/png'));
      } catch (e) {
        URL.revokeObjectURL(url);
        reject(e);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load SVG for rasterization'));
    };
    img.src = url;
  });
}
