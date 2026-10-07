import React from 'react';
import { TechnicalRating } from '../types/market';

interface TechnicalGaugeProps {
  rating: TechnicalRating;
  size?: 'sm' | 'md' | 'lg';
  showCounters?: boolean;
}

export const TechnicalGauge: React.FC<TechnicalGaugeProps> = ({
  rating,
  size = 'md',
  showCounters = true,
}) => {
  // Map rating to needle angle (-90 to +90 deg)
  const angleMap: Record<TechnicalRating, number> = {
    'Strong Sell': -72,
    'Sell': -36,
    'Neutral': 0,
    'Buy': 36,
    'Strong Buy': 72,
  };

  const angle = angleMap[rating] || 0;

  // Breakdown simulation based on rating
  const breakdown = {
    'Strong Sell': { osc: { sell: 7, neutral: 3, buy: 1 }, ma: { sell: 13, neutral: 1, buy: 1 } },
    'Sell': { osc: { sell: 5, neutral: 5, buy: 1 }, ma: { sell: 10, neutral: 2, buy: 3 } },
    'Neutral': { osc: { sell: 3, neutral: 6, buy: 2 }, ma: { sell: 7, neutral: 2, buy: 6 } },
    'Buy': { osc: { sell: 1, neutral: 5, buy: 5 }, ma: { sell: 3, neutral: 1, buy: 11 } },
    'Strong Buy': { osc: { sell: 0, neutral: 3, buy: 8 }, ma: { sell: 1, neutral: 0, buy: 14 } },
  }[rating];

  const ratingColor = {
    'Strong Sell': '#f23645',
    'Sell': '#f77c80',
    'Neutral': '#787b86',
    'Buy': '#26a69a',
    'Strong Buy': '#089981',
  }[rating];

  const dimensions = {
    sm: { width: 140, height: 80, radius: 55, needleLen: 42, centerR: 5 },
    md: { width: 220, height: 120, radius: 85, needleLen: 68, centerR: 7 },
    lg: { width: 280, height: 155, radius: 110, needleLen: 88, centerR: 9 },
  }[size];

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: dimensions.width, height: dimensions.height }}>
        <svg
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          className="w-full h-full overflow-visible"
        >
          {/* Arc Background Track */}
          {/* We create 5 segmented colored arc paths */}
          {/* Center is at (width/2, height - 10) */}
          {(() => {
            const cx = dimensions.width / 2;
            const cy = dimensions.height - 10;
            const r = dimensions.radius;
            const strokeW = size === 'sm' ? 8 : 12;

            // Sectors: Strong Sell (-180 to -144), Sell (-144 to -108), Neutral (-108 to -72), Buy (-72 to -36), Strong Buy (-36 to 0) in standard math degrees from 180 to 0
            const sectors = [
              { start: 180, end: 144, color: '#f23645' }, // Strong Sell
              { start: 144, end: 108, color: '#f77c80' }, // Sell
              { start: 108, end: 72, color: '#5d606b' },  // Neutral
              { start: 72, end: 36, color: '#26a69a' },   // Buy
              { start: 36, end: 0, color: '#089981' },    // Strong Buy
            ];

            return (
              <g>
                {sectors.map((sec, i) => {
                  const sRad = (sec.start * Math.PI) / 180;
                  const eRad = (sec.end * Math.PI) / 180;
                  const x1 = cx - r * Math.cos(sRad);
                  const y1 = cy - r * Math.sin(sRad);
                  const x2 = cx - r * Math.cos(eRad);
                  const y2 = cy - r * Math.sin(eRad);

                  return (
                    <path
                      key={i}
                      d={`M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`}
                      fill="none"
                      stroke={sec.color}
                      strokeWidth={strokeW}
                      strokeLinecap="round"
                      className="opacity-90"
                    />
                  );
                })}

                {/* Center Pivot Point */}
                <circle cx={cx} cy={cy} r={dimensions.centerR} fill="#787b86" />

                {/* Rotating Needle */}
                <g transform={`rotate(${angle}, ${cx}, ${cy})`} style={{ transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                  <line
                    x1={cx}
                    y1={cy}
                    x2={cx}
                    y2={cy - dimensions.needleLen}
                    stroke="#ffffff"
                    strokeWidth={size === 'sm' ? 2 : 2.5}
                    strokeLinecap="round"
                  />
                  <circle cx={cx} cy={cy - dimensions.needleLen} r={2.5} fill="#ffffff" />
                </g>
              </g>
            );
          })()}
        </svg>

        {/* Labels underneath arc */}
        <div className="absolute inset-x-0 bottom-0 text-center">
          <div
            className="text-sm font-semibold tracking-wide"
            style={{ color: ratingColor }}
          >
            {rating}
          </div>
        </div>
      </div>

      {showCounters && (
        <div className="w-full mt-4 grid grid-cols-2 gap-3 text-xs border-t border-[#2a2e39] dark:border-[#2a2e39] pt-3">
          <div className="flex flex-col gap-1">
            <span className="text-[#787b86] font-medium text-[11px] uppercase tracking-wider">Oscillators</span>
            <div className="flex items-center gap-1.5 tabular-nums text-[11px]">
              <span className="text-[#f23645] font-semibold">{breakdown.osc.sell} Sell</span>
              <span className="text-[#787b86]">·</span>
              <span className="text-[#9db2ce]">{breakdown.osc.neutral} Neutral</span>
              <span className="text-[#787b86]">·</span>
              <span className="text-[#089981] font-semibold">{breakdown.osc.buy} Buy</span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[#787b86] font-medium text-[11px] uppercase tracking-wider">Moving Averages</span>
            <div className="flex items-center gap-1.5 tabular-nums text-[11px]">
              <span className="text-[#f23645] font-semibold">{breakdown.ma.sell} Sell</span>
              <span className="text-[#787b86]">·</span>
              <span className="text-[#9db2ce]">{breakdown.ma.neutral} Neutral</span>
              <span className="text-[#787b86]">·</span>
              <span className="text-[#089981] font-semibold">{breakdown.ma.buy} Buy</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
