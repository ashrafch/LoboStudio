"use client";

/**
 * Adapted from Kokonut UI Topo Background v1.1.0 by @dorianbaffier (MIT).
 * https://kokonutui.com/docs/backgrounds/topo-background
 */
import { type ReactNode, useEffect, useRef } from "react";
import { useReducedPreference } from "../motion/settings";
import styles from "./topo-background.module.css";

const CELL = 12;
const TERRAIN_SCALE = 340;
const INDEX_EVERY = 5;
const HILL_HEIGHT = 0.2;
const HILL_SPREAD = 100;
const HILL_FOLLOW = 9;
const HILL_RISE = 7;
const FRAME_INTERVAL = 1000 / 30;

/** Seeded 3D gradient noise (Ken Perlin's improved noise), about -1 to 1. */
function createNoise(seed: number) {
  const p = Array.from({ length: 256 }, (_, i) => i);
  let state = seed >>> 0 || 1;
  const random = () => {
    state = (state * 1_664_525 + 1_013_904_223) >>> 0;
    return state / 4_294_967_296;
  };
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  const perm = new Uint8Array(512);
  for (let i = 0; i < 512; i++) {
    perm[i] = p[i & 255];
  }
  const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const grad = (hash: number, x: number, y: number, z: number) => {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    let v = z;
    if (h < 4) {
      v = y;
    } else if (h === 12 || h === 14) {
      v = x;
    }
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  };

  return (x: number, y: number, z: number) => {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const Z = Math.floor(z) & 255;
    const fx = x - Math.floor(x);
    const fy = y - Math.floor(y);
    const fz = z - Math.floor(z);
    const u = fade(fx);
    const v = fade(fy);
    const w = fade(fz);
    const A = perm[X] + Y;
    const AA = perm[A] + Z;
    const AB = perm[A + 1] + Z;
    const B = perm[X + 1] + Y;
    const BA = perm[B] + Z;
    const BB = perm[B + 1] + Z;
    return lerp(
      lerp(
        lerp(grad(perm[AA], fx, fy, fz), grad(perm[BA], fx - 1, fy, fz), u),
        lerp(
          grad(perm[AB], fx, fy - 1, fz),
          grad(perm[BB], fx - 1, fy - 1, fz),
          u,
        ),
        v,
      ),
      lerp(
        lerp(
          grad(perm[AA + 1], fx, fy, fz - 1),
          grad(perm[BA + 1], fx - 1, fy, fz - 1),
          u,
        ),
        lerp(
          grad(perm[AB + 1], fx, fy - 1, fz - 1),
          grad(perm[BB + 1], fx - 1, fy - 1, fz - 1),
          u,
        ),
        v,
      ),
      w,
    );
  };
}

/**
 * The segment a contour draws through one grid cell, given which corners
 * are above the level (bits: top-left 8, top-right 4, bottom-right 2,
 * bottom-left 1) and where it crosses each edge.
 */
function cellSegments(
  path: Path2D,
  index: number,
  box: { x0: number; y0: number; x1: number; y1: number },
  cross: { top: number; right: number; bottom: number; left: number },
) {
  const { x0, y0, x1, y1 } = box;
  const { top, right, bottom, left } = cross;
  const line = (ax: number, ay: number, bx: number, by: number) => {
    path.moveTo(ax, ay);
    path.lineTo(bx, by);
  };
  switch (index) {
    case 1:
    case 14:
      line(x0, left, bottom, y1);
      break;
    case 2:
    case 13:
      line(bottom, y1, x1, right);
      break;
    case 3:
    case 12:
      line(x0, left, x1, right);
      break;
    case 4:
    case 11:
      line(top, y0, x1, right);
      break;
    case 6:
    case 9:
      line(top, y0, bottom, y1);
      break;
    case 7:
    case 8:
      line(x0, left, top, y0);
      break;
    // The two saddles: opposite corners are high, so the level crosses
    // the cell twice.
    case 5:
      line(x0, left, top, y0);
      line(bottom, y1, x1, right);
      break;
    case 10:
      line(top, y0, x1, right);
      line(x0, left, bottom, y1);
      break;
    default:
      break;
  }
}

/** Every contour level that passes through one cell, usually none or one. */
function traceCell(
  field: Float32Array,
  cols: number,
  i: number,
  j: number,
  interval: number,
  paths: { minor: Path2D; major: Path2D },
) {
  const a = field[j * cols + i];
  const b = field[j * cols + i + 1];
  const c = field[(j + 1) * cols + i + 1];
  const d = field[(j + 1) * cols + i];
  const x0 = i * CELL;
  const y0 = j * CELL;
  const first = Math.ceil(Math.min(a, b, c, d) / interval);
  const last = Math.floor(Math.max(a, b, c, d) / interval);
  if (first > last) {
    return;
  }
  const box = { x0, y0, x1: x0 + CELL, y1: y0 + CELL };
  for (let level = first; level <= last; level++) {
    const t = level * interval;
    const index =
      (a > t ? 8 : 0) | (b > t ? 4 : 0) | (c > t ? 2 : 0) | (d > t ? 1 : 0);
    if (index === 0 || index === 15) {
      continue;
    }
    const isIndex = level % INDEX_EVERY === 0;
    cellSegments(isIndex ? paths.major : paths.minor, index, box, {
      top: x0 + CELL * ((t - a) / (b - a)),
      right: y0 + CELL * ((t - b) / (c - b)),
      bottom: x0 + CELL * ((t - d) / (c - d)),
      left: y0 + CELL * ((t - a) / (d - a)),
    });
  }
}

/**
 * Marching squares: for each cell, find where each contour level crosses
 * its edges and join those points. Index contours go into their own path
 * so each group is stroked once.
 */
function traceContours(
  field: Float32Array,
  cols: number,
  rows: number,
  interval: number,
  minor: Path2D,
  major: Path2D,
) {
  const paths = { minor, major };
  for (let j = 0; j < rows - 1; j++) {
    for (let i = 0; i < cols - 1; i++) {
      traceCell(field, cols, i, j, interval, paths);
    }
  }
}

interface Hill {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  amount: number;
  on: boolean;
}

/** Ease the hill towards the cursor and up or down. True while it moves. */
function stepHill(hill: Hill, dt: number) {
  const follow = 1 - Math.exp(-HILL_FOLLOW * dt);
  hill.x += (hill.targetX - hill.x) * follow;
  hill.y += (hill.targetY - hill.y) * follow;
  const goal = hill.on ? 1 : 0;
  hill.amount += (goal - hill.amount) * (1 - Math.exp(-HILL_RISE * dt));
  return (
    Math.abs(hill.targetX - hill.x) > 0.5 ||
    Math.abs(hill.targetY - hill.y) > 0.5 ||
    Math.abs(goal - hill.amount) > 0.002
  );
}

export function TopoBackground({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedPreference();

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!root || !canvas || !ctx) return;

    const noise = createNoise(26);
    const hill: Hill = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      amount: 0,
      on: false,
    };
    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let base = new Float32Array(0);
    let field = new Float32Array(0);
    let color = "";
    let raf = 0;
    let lastPaint = 0;
    let onScreen = false;
    let needsResize = true;

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(width / CELL) + 1;
      rows = Math.ceil(height / CELL) + 1;
      color = getComputedStyle(canvas).color;
      base = new Float32Array(cols * rows);
      field = new Float32Array(cols * rows);

      for (let j = 0; j < rows; j++) {
        const y = (j * CELL) / TERRAIN_SCALE;
        for (let i = 0; i < cols; i++) {
          const x = (i * CELL) / TERRAIN_SCALE + 0.85;
          base[j * cols + i] =
            noise(x, y, 0.3) * 0.8 +
            noise(x * 2.3 + 17.1, y * 2.3 + 4.7, 0.42) * 0.2;
        }
      }
      needsResize = false;
    };

    const paint = () => {
      field.set(base);
      const spread = 2 * HILL_SPREAD ** 2;
      if (hill.amount > 0.001) {
        for (let j = 0; j < rows; j++) {
          for (let i = 0; i < cols; i++) {
            const distance =
              (i * CELL - hill.x) ** 2 + (j * CELL - hill.y) ** 2;
            field[j * cols + i] +=
              HILL_HEIGHT * hill.amount * Math.exp(-distance / spread);
          }
        }
      }
      const minor = new Path2D();
      const major = new Path2D();
      traceContours(field, cols, rows, 0.045, minor, major);
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = color;
      ctx.lineCap = "round";
      ctx.globalAlpha = 0.27;
      ctx.lineWidth = 0.8;
      ctx.stroke(minor);
      ctx.globalAlpha = 0.5;
      ctx.lineWidth = 1.1;
      ctx.stroke(major);
    };

    const isVisible = () => onScreen && !document.hidden;

    function frame(now: number) {
      raf = 0;
      if (!isVisible()) return;
      const elapsed = now - lastPaint;
      if (lastPaint && elapsed < FRAME_INTERVAL - 1) {
        raf = requestAnimationFrame(frame);
        return;
      }
      const moving = stepHill(
        hill,
        lastPaint ? Math.min(elapsed / 1000, 0.07) : 0.033,
      );
      lastPaint = now;
      paint();
      if (moving) raf = requestAnimationFrame(frame);
    }

    const start = () => {
      if (!raf && !reduced && isVisible()) {
        lastPaint = 0;
        raf = requestAnimationFrame(frame);
      }
    };

    const refresh = () => {
      if (!isVisible()) {
        cancelAnimationFrame(raf);
        raf = 0;
        hill.on = false;
        hill.amount = 0;
        return;
      }
      if (needsResize) resize();
      paint();
    };

    const intersection = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      refresh();
    });
    const observer = new ResizeObserver(() => {
      needsResize = true;
      refresh();
    });
    intersection.observe(root);
    observer.observe(root);
    document.addEventListener("visibilitychange", refresh);

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const rect = root.getBoundingClientRect();
      hill.targetX = event.clientX - rect.left;
      hill.targetY = event.clientY - rect.top;
      if (!hill.on) {
        hill.x = hill.targetX;
        hill.y = hill.targetY;
        hill.on = true;
      }
      start();
    };
    const onLeave = () => {
      hill.on = false;
      start();
    };

    if (!reduced) {
      root.addEventListener("pointermove", onMove, { passive: true });
      root.addEventListener("pointerleave", onLeave);
    }

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      intersection.disconnect();
      document.removeEventListener("visibilitychange", refresh);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
    };
  }, [reduced]);

  return (
    <div
      className={styles.topo}
      data-topo-background
      data-motion={reduced ? "still" : "interactive"}
      ref={rootRef}
    >
      <canvas className={styles.canvas} aria-hidden="true" ref={canvasRef} />
      <div className={styles.content}>{children}</div>
    </div>
  );
}
