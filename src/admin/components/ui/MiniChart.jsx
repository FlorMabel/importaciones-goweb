import React from 'react';

/**
 * Pequeño gráfico SVG custom — sparkline o bar chart
 * Sin dependencias externas
 */

export function Sparkline({ data = [], width = 120, height = 40, color = '#c9a34f', fill = true }) {
  if (data.length < 2) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);

  const points = data.map((v, i) => ({
    x: i * stepX,
    y: height - ((v - min) / range) * (height - 4) - 2,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`;

  return (
    <svg width={width} height={height} className="overflow-visible">
      {fill && (
        <path d={areaPath} fill={`${color}15`} />
      )}
      <path d={linePath} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Dot on last point */}
      <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="3" fill={color} />
    </svg>
  );
}

export function BarChart({ data = [], width = 200, height = 80, color = '#c9a34f', labels = [] }) {
  if (data.length === 0) return null;

  const max = Math.max(...data) || 1;
  const barWidth = Math.min(24, (width / data.length) * 0.6);
  const gap = (width - barWidth * data.length) / (data.length + 1);

  return (
    <svg width={width} height={height + (labels.length ? 20 : 0)} className="overflow-visible">
      {data.map((v, i) => {
        const barH = (v / max) * height;
        const x = gap + i * (barWidth + gap);
        const y = height - barH;
        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={barH}
              rx={4}
              fill={i === data.length - 1 ? color : `${color}40`}
              className="transition-all duration-300"
            />
            {labels[i] && (
              <text
                x={x + barWidth / 2}
                y={height + 14}
                textAnchor="middle"
                className="fill-text-muted text-[10px] font-display"
              >
                {labels[i]}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export default function MiniChart({ type = 'sparkline', ...props }) {
  if (type === 'bar') return <BarChart {...props} />;
  return <Sparkline {...props} />;
}
