import { useEffect, useRef } from "react";

/** 波点参数（与 .dot-grid 底纹口径一致，颜色用当前色域的 hairline） */
const CELL = 26; // 点阵间距 px
const BASE_R = 1; // 常态点半径 px
const LENS_R = 150; // 聚焦半径 px
const MAX_SCALE = 3.2; // 圆心处最大放大倍数

/**
 * 绝对定位覆盖层：以鼠标为中心的「放大镜」波点。
 * 常态只画 1px 细点；鼠标靠近时，半径内的点按距离平滑放大并转为强调色。
 * pointer-events-none，不拦截下方内容交互；触摸设备无 hover 时自动隐藏。
 */
export function DotGridLens({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    let w = 0;
    let h = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    /** 鼠标位置（CSS px），初始放在视口外即「未激活」 */
    let mx = -9999;
    let my = -9999;
    let dotColor = "rgba(0,0,0,0.14)";
    /** 聚焦金色（提亮版 HKUST Gold）及其光晕用的同色透明分量 */
    let lensRGB = "235,206,125";
    let lensColor = "rgb(235,206,125)";
    let raf = 0;

    /** 从计算样式读取发丝线与强调色（oklch），转 sRGB 供 canvas 使用 */
    const readColors = () => {
      const cs = getComputedStyle(parent);
      try {
        const probe = new Path2D();
        probe.arc(0, 0, 1, 0, Math.PI * 2);
        ctx.fillStyle = cs.getPropertyValue("--color-hairline").trim() || dotColor;
        ctx.fill(probe);
        dotColor = ctx.fillStyle as string;
        // 比校徽金更亮一档，保证在暖白纸面上足够醒目
        ctx.fillStyle = "oklch(0.9 0.115 88)";
        ctx.fill(probe);
        const rgb = String(ctx.fillStyle).match(/(\d+),\s*(\d+),\s*(\d+)/);
        if (rgb) {
          lensRGB = `${rgb[1]},${rgb[2]},${rgb[3]}`;
          lensColor = `rgb(${lensRGB})`;
        }
      } catch {
        /* 保留默认值 */
      }
    };

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      w = Math.max(1, Math.round(rect.width));
      h = Math.max(1, Math.round(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      readColors();
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      // 点阵整体内缩一个「最大放大半径」，边缘的点无论怎么放大都完整可见，不会出现残缺波点
      const pad = BASE_R * MAX_SCALE + 1;
      const cols = Math.max(0, Math.floor((w - pad * 2) / CELL)) + 1;
      const rows = Math.max(0, Math.floor((h - pad * 2) / CELL)) + 1;
      for (let c = 0; c < cols; c++) {
        const x = pad + c * CELL;
        for (let r = 0; r < rows; r++) {
          const y = pad + r * CELL;
          const dx = x - mx;
          const dy = y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LENS_R) {
            // 平滑衰减：圆心倍数最高，边缘回到常态
            const t = 1 - dist / LENS_R;
            const ease = t * t * (3 - 2 * t);
            const radius = BASE_R + (BASE_R * MAX_SCALE - BASE_R) * ease;
            if (ease > 0.15) {
              // 外圈柔光：让放大的点像被点亮，而不是生硬变色
              ctx.globalAlpha = 0.14 * ease;
              ctx.fillStyle = `rgb(${lensRGB})`;
              ctx.beginPath();
              ctx.arc(x, y, radius * 2.4, 0, Math.PI * 2);
              ctx.fill();
            }
            ctx.globalAlpha = 0.75 + 0.25 * ease;
            ctx.fillStyle = lensColor;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.globalAlpha = 1;
            ctx.fillStyle = dotColor;
            ctx.beginPath();
            ctx.arc(x, y, BASE_R, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mx = e.clientX - rect.left;
      my = e.clientY - rect.top;
    };
    const onLeave = () => {
      mx = -9999;
      my = -9999;
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(parent);
    window.addEventListener("pointermove", onMove);
    parent.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      parent.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={`dot-lens pointer-events-none absolute inset-0 ${className ?? ""}`}
    />
  );
}
