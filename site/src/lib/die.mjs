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

/** The bus traces the README's chapter order as one serpentine ring. */
export const BUS = [
  ['MKT', 'VIS'], ['VIS', 'WEB'], ['WEB', 'MEM'], ['MEM', 'UI'],
  ['UI', 'INF'], ['INF', 'APP'], ['APP', 'SKL'], ['SKL', 'TLS'],
  ['TLS', 'TUI'], ['TUI', 'LRN'], ['LRN', 'MKT'],
];

export const KEEP_OUT = { x: 636, y: 344, w: 324, h: 156 };

/** Corner fiducials — the marks that make a drawing read as a die, not a chart. */
export const FIDUCIALS = [
  [16, 16, 1, 1], [DIE_W - 16, 16, -1, 1], [16, DIE_H - 16, 1, -1], [DIE_W - 16, DIE_H - 16, -1, -1],
];

const center = (id) => {
  const b = LAYOUT[id];
  return [b.x + b.w / 2, b.y + b.h / 2];
};

/** Orthogonal elbow route between two block centres, with a via at the bend. */
export function route(from, to) {
  const [x1, y1] = center(from);
  const [x2, y2] = center(to);
  const mx = (x1 + x2) / 2;
  return {
    d: `M${x1},${y1} L${mx},${y1} L${mx},${y2} L${x2},${y2}`,
    vias: [[mx, y1], [mx, y2]],
  };
}

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