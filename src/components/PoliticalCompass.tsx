import React, { useEffect, useMemo, useRef } from "react";

export type CompassPoint = {
  economic: number; // -10 (left) to +10 (right)
  social: number; // -10 (libertarian) to +10 (authoritarian)
  date: string | Date; // ISO string or Date
};

export type PoliticalCompassProps = {
  points: CompassPoint[];
  width?: number; // outer svg width
  height?: number; // outer svg height
  className?: string;
  showGrid?: boolean;
};

const DEFAULT_WIDTH = 640;
const DEFAULT_HEIGHT = 640;

function parseDate(value: string | Date): Date {
  return value instanceof Date ? value : new Date(value);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function getSortedPoints(points: CompassPoint[]): CompassPoint[] {
  return [...points].sort((a, b) => +parseDate(a.date) - +parseDate(b.date));
}

function useScales(width: number, height: number) {
  // Scale everything proportionally to requested width/height
  const scale = Math.min(width / DEFAULT_WIDTH, height / DEFAULT_HEIGHT);

  const baseMargin = { top: 56, right: 56, bottom: 64, left: 72 };
  const minMargin = 12;
  const margin = {
    top: Math.max(minMargin, Math.round(baseMargin.top * scale)),
    right: Math.max(minMargin, Math.round(baseMargin.right * scale)),
    bottom: Math.max(minMargin, Math.round(baseMargin.bottom * scale)),
    left: Math.max(minMargin, Math.round(baseMargin.left * scale)),
  };

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const centerX = innerWidth / 2;
  const centerY = innerHeight / 2;

  const xFromEconomic = (economic: number): number => {
    const e = clamp(economic, -10, 10);
    return ((e + 10) / 20) * innerWidth; // -10 -> 0, +10 -> innerWidth
  };

  const yFromSocial = (social: number): number => {
    const s = clamp(social, -10, 10);
    // SVG y increases downwards, so invert: -10 (libertarian) -> innerHeight, +10 -> 0
    return ((10 - s) / 20) * innerHeight;
  };

  return {
    margin,
    innerWidth,
    innerHeight,
    centerX,
    centerY,
    xFromEconomic,
    yFromSocial,
    scale,
  };
}

export function PoliticalCompass({
  points,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  className,
  showGrid = true,
}: PoliticalCompassProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const {
    margin,
    innerWidth,
    innerHeight,
    centerX,
    centerY,
    xFromEconomic,
    yFromSocial,
  } = useScales(width, height);

  const ordered = useMemo(() => getSortedPoints(points), [points]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const devicePixelRatio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = Math.floor(width * devicePixelRatio);
    canvas.height = Math.floor(height * devicePixelRatio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const context = canvas.getContext("2d");
    if (!context) return;
    context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

    const labelColor = "#374151";
    const mutedColor = "#6B7280";

    // Derive dynamic sizes based on canvas scale
    const s = Math.min(width / DEFAULT_WIDTH, height / DEFAULT_HEIGHT);
    const clampNumber = (v: number, minV: number, maxV: number) => Math.max(minV, Math.min(maxV, v));
    const gridLineWidth = clampNumber(1 * s, 0.75, 1.25);
    const borderLineWidth = clampNumber(2 * s, 1, 2);
    const axisLineWidth = clampNumber(3 * s, 1, 3);
    const mainLabelFontPx = Math.round(clampNumber(24 * s, 8, 24));
    const smallLabelFontPx = Math.round(clampNumber(14 * s, 8, 14));
    const pointRadius = clampNumber(7 * s, 3, 8);
    const pulseMaxExtra = clampNumber(16 * s, 8, 18);
    const pointStrokeWidth = clampNumber(2 * s, 1, 2);
    const pulseShadowBlur = clampNumber(24 * s, 8, 24);
    const pulseRingWidth = clampNumber(3 * s, 2, 6);
    const arrowHeadLength = clampNumber(10 * s, 6, 10);
    const minorOffset = clampNumber(8 * s, 4, 8);
    const mediumOffset = clampNumber(16 * s, 8, 16);
    const largeOffset = clampNumber(40 * s, 16, 40);

    const toPoint = (p: CompassPoint) => ({
      x: margin.left + xFromEconomic(p.economic),
      y: margin.top + yFromSocial(p.social),
    });

    const pointsOnCanvas = ordered.map(toPoint);

    const gridStep = innerWidth / 20;

    let animationFrameId = 0;

    function drawArrow(x1: number, y1: number, x2: number, y2: number, color: string) {
      const angle = Math.atan2(y2 - y1, x2 - x1);
      const headLength = arrowHeadLength;
      context.strokeStyle = color;
      context.fillStyle = color;
      context.lineWidth = clampNumber(1.5 * s, 1, 1.5);
      context.beginPath();
      context.moveTo(x1, y1);
      context.lineTo(x2, y2);
      context.stroke();
      context.beginPath();
      context.moveTo(x2, y2);
      context.lineTo(x2 - headLength * Math.cos(angle - Math.PI / 6), y2 - headLength * Math.sin(angle - Math.PI / 6));
      context.lineTo(x2 - headLength * Math.cos(angle + Math.PI / 6), y2 - headLength * Math.sin(angle + Math.PI / 6));
      context.closePath();
      context.fill();
    }

    function drawFrame(timestamp: number) {
      context.clearRect(0, 0, width, height);

      // Quadrants
      context.fillStyle = "#fecaca";
      context.fillRect(margin.left, margin.top, centerX, centerY);
      context.fillStyle = "#bae6fd";
      context.fillRect(margin.left + centerX, margin.top, centerX, centerY);
      context.fillStyle = "#bbf7d0";
      context.fillRect(margin.left, margin.top + centerY, centerX, centerY);
      context.fillStyle = "#e9d5ff";
      context.fillRect(margin.left + centerX, margin.top + centerY, centerX, centerY);

      // Grid
      if (showGrid) {
        context.strokeStyle = "rgba(255,255,255,0.35)";
        context.lineWidth = gridLineWidth;
        for (let i = 1; i < 20; i++) {
          const pos = margin.left + i * gridStep;
          context.beginPath();
          context.moveTo(pos, margin.top);
          context.lineTo(pos, margin.top + innerHeight);
          context.stroke();
        }
        for (let i = 1; i < 20; i++) {
          const pos = margin.top + i * gridStep;
          context.beginPath();
          context.moveTo(margin.left, pos);
          context.lineTo(margin.left + innerWidth, pos);
          context.stroke();
        }
      }

      // Axes and border
      context.strokeStyle = "#111827";
      context.lineWidth = borderLineWidth;
      context.strokeRect(margin.left, margin.top, innerWidth, innerHeight);
      context.lineWidth = axisLineWidth;
      context.beginPath();
      context.moveTo(margin.left + centerX, margin.top);
      context.lineTo(margin.left + centerX, margin.top + innerHeight);
      context.stroke();
      context.beginPath();
      context.moveTo(margin.left, margin.top + centerY);
      context.lineTo(margin.left + innerWidth, margin.top + centerY);
      context.stroke();

      // Labels
      context.fillStyle = labelColor;
      context.font = `600 ${mainLabelFontPx}px ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial`;
      context.textAlign = "center";
      // Top label inside, hugging the top edge
      context.textBaseline = "top";
      context.fillText("Authoritarian", margin.left + innerWidth / 2, margin.top + Math.round(4 * s));
      // Bottom label inside, hugging the bottom edge
      context.textBaseline = "bottom";
      context.fillText("Libertarian", margin.left + innerWidth / 2, margin.top + innerHeight - Math.round(4 * s));
      // Left/Right inside the plot, near ends of the midline
      context.textBaseline = "alphabetic";
      context.textAlign = "left";
      context.fillText("Left", margin.left + minorOffset, margin.top + centerY - minorOffset);
      context.textAlign = "right";
      context.fillText("Right", margin.left + innerWidth - minorOffset, margin.top + centerY - minorOffset);

      // Scale indicators (top-centered horizontal double-arrow for social scale)
      const socialArrowX = margin.left + innerWidth/2 + minorOffset + 2
      const socialArrowTop = margin.top + Math.round(70 * s)
      const socialArrowBot = margin.top + centerY - Math.round(70 * s);

      drawArrow(socialArrowX, socialArrowTop, socialArrowX, socialArrowBot, mutedColor);
      drawArrow(socialArrowX, socialArrowBot, socialArrowX, socialArrowTop, mutedColor);
      context.fillStyle = mutedColor;
      context.font = `italic ${smallLabelFontPx}px ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial`;
      context.textAlign = "center";
      // Rotate "social scale" label by 90 degrees
      context.save();
      context.translate(socialArrowX + Math.round(4 * s), (socialArrowTop + socialArrowBot)/2);
      context.rotate(Math.PI / 2);
      context.fillText("social scale", 0, 0);
      context.restore();

      // Economic scale centered on the left half, along the midline, double-arrow
      const econArrowLeft = margin.left + Math.round(70 * s);
      const econArrowRight = margin.left + centerX - Math.round(70 * s);
      const econY = margin.top + centerY + Math.round(10 * s);
      drawArrow(econArrowLeft, econY, econArrowRight, econY, mutedColor);
      drawArrow(econArrowRight, econY, econArrowLeft, econY, mutedColor);
      context.fillStyle = mutedColor;
      context.fillText("economic scale", (econArrowLeft + econArrowRight) / 2, econY + Math.round(20 * s));

      // History line
      if (pointsOnCanvas.length >= 2) {
        context.strokeStyle = "#6B7280";
        context.lineWidth = 2.5;
        context.globalAlpha = 0.75;
        context.beginPath();
        for (let i = 0; i < pointsOnCanvas.length; i++) {
          const { x, y } = pointsOnCanvas[i];
          if (i === 0) context.moveTo(x, y); else context.lineTo(x, y);
        }
        context.stroke();
        context.globalAlpha = 1;
      }

      // Points + labels
      context.fillStyle = labelColor;
      context.font = `${smallLabelFontPx}px ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial`;
      ordered.forEach((p, idx) => {
        const { x, y } = pointsOnCanvas[idx];
        const isLatest = idx === ordered.length - 1;
        const year = parseDate(p.date).getFullYear().toString();

        if (isLatest) {
          // Ping animation
          const cycleMs = 1200;
          const t = (timestamp % cycleMs) / cycleMs; // 0..1
          const pulseRadius = pointRadius + t * pulseMaxExtra;
          const pulseAlpha = 0.8 * (1 - t);

          context.beginPath();
          context.arc(x, y, pulseRadius, 0, Math.PI * 2);
          context.fillStyle = `rgba(253, 224, 71, ${pulseAlpha.toFixed(3)})`;
          context.fill();

          // Outer ring to accentuate the pulse
          context.beginPath();
          context.arc(x, y, pulseRadius + pulseRingWidth * 0.5, 0, Math.PI * 2);
          context.lineWidth = pulseRingWidth;
          context.strokeStyle = `rgba(250, 204, 21, ${(0.5 * (1 - t)).toFixed(3)})`;
          context.stroke();

          context.beginPath();
          context.save();
          context.shadowColor = "rgba(234, 179, 8, 0.9)";
          context.shadowBlur = pulseShadowBlur;
          context.arc(x, y, pointRadius, 0, Math.PI * 2);
          context.fillStyle = "#fde047";
          context.fill();
          context.restore();
          context.lineWidth = pointStrokeWidth;
          context.strokeStyle = "#f59e0b";
          context.stroke();

          context.fillStyle = labelColor;
          context.fillText(year, x + Math.round(10 * s), y - Math.round(10 * s));
        } else {
          context.beginPath();
          context.arc(x, y, pointRadius, 0, Math.PI * 2);
          context.fillStyle = "#6B7280";
          context.globalAlpha = 0.9;
          context.fill();
          context.globalAlpha = 1;
          context.fillStyle = labelColor;
          context.fillText(year, x + Math.round(10 * s), y - Math.round(10 * s));
        }
      });

      animationFrameId = requestAnimationFrame(drawFrame);
    }

    animationFrameId = requestAnimationFrame(drawFrame);
    return () => cancelAnimationFrame(animationFrameId);
  }, [ordered, width, height, margin.left, margin.top, innerWidth, innerHeight, centerX, centerY, xFromEconomic, yFromSocial, showGrid]);

  return (
    <canvas ref={canvasRef} className={className} aria-label="Political compass chart" role="img" />
  );
}

export default PoliticalCompass;


