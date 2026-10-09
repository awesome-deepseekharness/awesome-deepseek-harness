/**
 * Floorplan geometry for the die drawing.
 *
 * The blocks are deliberately NOT on a uniform grid — the compositional law of
 * this world is asymmetry, so block sizes and gutters follow the weight of each
 * category rather than a column system. The keep-out region is real emptiness
 * that carries a label; it is not an unfilled gap.
 */

export const DIE_W = 980;
export const DIE_H = 520;

export const LAYOUT = {
  MKT: { x: 34, y: 40, w: 190, h: 116 },
  VIS: { x: 248, y: 30, w: 148, h: 96 },
  WEB: { x: 420, y: 44, w: 168, h: 104 },
  MEM: { x: 610, y: 32, w: 142, h: 94 },
  UI: { x: 776, y: 50, w: 178, h: 110 },
  TUI: { x: 214, y: 372, w: 170, h: 108 },
  TLS: { x: 214, y: 196, w: 232, h: 138 },
  SKL: { x: 470, y: 206, w: 142, h: 98 },
  APP: { x: 634, y: 192, w: 182, h: 118 },
  INF: { x: 838, y: 206, w: 132, h: 90 },
  LRN: { x: 28, y: 376, w: 166, h: 104 },
};

/**
 * The bus traces the README's chapter order as one serpentine ring.
 *
 * Routes are authored polylines, not centre-to-centre links: a centre-to-centre
 * elbow starts inside the block it leaves, so the trace would cut straight
 * through that block's pads and label. Every leg here runs in a real gutter —
 * between blocks, or in the perimeter channels at x≈20 (left) and y≈20 (top).
 */
export const BUS = [
  // 01 MKT → 02 VIS — the gutter between them
  { from: 'MKT', to: 'VIS', pts: [[224, 98], [236, 98], [236, 78], [248, 78]] },
  // 02 VIS → 03 WEB
  { from: 'VIS', to: 'WEB', pts: [[396, 78], [408, 78], [408, 96], [420, 96]] },
  // 03 WEB → 04 MEM
  { from: 'WEB', to: 'MEM', pts: [[588, 96], [599, 96], [599, 79], [610, 79]] },
  // 04 MEM → 05 UI
  { from: 'MEM', to: 'UI', pts: [[752, 79], [764, 79], [764, 105], [776, 105]] },
  // 05 UI → 06 INF — down through the channel between the two rows
  { from: 'UI', to: 'INF', pts: [[865, 160], [865, 174], [904, 174], [904, 206]] },
  // 06 INF → 07 APP
  { from: 'INF', to: 'APP', pts: [[838, 251], [816, 251]] },
  // 07 APP → 08 SKL
  { from: 'APP', to: 'SKL', pts: [[634, 251], [623, 251], [623, 255], [612, 255]] },
  // 08 SKL → 09 TLS
  { from: 'SKL', to: 'TLS', pts: [[470, 255], [458, 255], [458, 265], [446, 265]] },
  // 09 TLS → 10 TUI — down through the channel above the third row
  { from: 'TLS', to: 'TUI', pts: [[330, 334], [330, 352], [299, 352], [299, 372]] },
  // 10 TUI → 11 LRN
  { from: 'TUI', to: 'LRN', pts: [[214, 426], [194, 428]] },
  // 11 LRN → 01 MKT — closes the ring up the left margin and over the top
  { from: 'LRN', to: 'MKT', pts: [[28, 428], [20, 428], [20, 20], [129, 20], [129, 40]] },
];

export const KEEP_OUT = { x: 636, y: 344, w: 324, h: 156 };

/** Corner fiducials — the marks that make a drawing read as a die, not a chart. */
export const FIDUCIALS = [
  [12, 12, 1, 1], [DIE_W - 12, 12, -1, 1], [12, DIE_H - 12, 1, -1], [DIE_W - 12, DIE_H - 12, -1, -1],
];

const center = (id) => {
  const b = LAYOUT[id];
  return [b.x + b.w / 2, b.y + b.h / 2];
};

/** A via sits at every interior bend, the way a real routed net is drawn. */
export function route(leg) {
  return {
    d: 'M' + leg.pts.map(([x, y]) => `${x},${y}`).join(' L'),
    vias: leg.pts.slice(1, -1),
  };
}

export { center };

/**
 * Bond pads, one per catalogued project, laid out as a real pad array inside the
 * block. The count is the item count — the drawing never invents or rounds.
 */
export function padArray(id, count) {
  const b = LAYOUT[id];
  const inset = 12;
  const innerW = b.w - inset * 2;
  const cols = Math.min(count, 10);
  const rows = Math.ceil(count / cols);
  const gap = 4;
  const pw = (innerW - gap * (cols - 1)) / cols;
  const top = b.y + b.h - inset - (rows * 6 + (rows - 1) * gap);
  const ph = Math.max(3, Math.min(7, (b.h * 0.3 - (rows - 1) * gap) / rows));
  const pads = [];
  for (let i = 0; i < count; i++) {
    const r = Math.floor(i / cols);
    const c = i % cols;
    pads.push({
      x: b.x + inset + c * (pw + gap),
      y: top + r * (ph + gap),
      w: pw,
      h: ph,
    });
  }
  return pads;
}