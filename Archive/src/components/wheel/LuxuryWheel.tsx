import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { Prize, SpinResult } from '../../types';
import { type ClassValue, clsx } from "clsx";
import { cn } from '/lib/utils.ts'

interface Props {
  prizes: Prize[];
  onSpinEnd: (result: SpinResult) => void;
  disabled?: boolean;
  style?: {
    borderColor: string;
    stopperColor: string;
    centerColor: string;
    glassEffect: boolean;
  };
}

export const LuxuryWheel: React.FC<Props> = ({
  prizes,
  onSpinEnd,
  disabled,
  style = {
    borderColor: '#FFD700',
    stopperColor: '#FF0000',
    centerColor: '#FFD700',
    glassEffect: true,
  },
}) => {
  const wheelRef = useRef<SVGSVGElement>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const getRandomPrize = () => {
    const random = Math.random();
    let sum = 0;
    for (const prize of prizes) {
      sum += prize.probability;
      if (random <= sum) return prize;
    }
    return prizes[prizes.length - 1];
  };

  const spin = () => {
    if (isSpinning || disabled) return;

    setIsSpinning(true);
    const prize = getRandomPrize();
    const prizeIndex = prizes.findIndex((p) => p.id === prize.id);
    const baseRotation = 1440; // 4 full rotations
    const sliceAngle = 360 / prizes.length;
    const targetRotation = baseRotation + (prizeIndex * sliceAngle);

    gsap.to(wheelRef.current, {
      rotation: targetRotation,
      duration: 5,
      ease: "elastic.out(1, 0.3)",
      onComplete: () => {
        setIsSpinning(false);
        onSpinEnd({ prize, rotation: targetRotation });
      }
    });
  };

  const renderSlices = () => {
    const sliceAngle = 360 / prizes.length;
    const radius = 150;
    const center = 200;

    return prizes.map((prize, i) => {
      const angle = (i * sliceAngle * Math.PI) / 180;
      const nextAngle = ((i + 1) * sliceAngle * Math.PI) / 180;
      
      const x1 = center + radius * Math.cos(angle);
      const y1 = center + radius * Math.sin(angle);
      const x2 = center + radius * Math.cos(nextAngle);
      const y2 = center + radius * Math.sin(nextAngle);

      const path = `M${center},${center} L${x1},${y1} A${radius},${radius} 0 0,1 ${x2},${y2} Z`;

      return (
        <g key={prize.id}>
          <defs>
            <linearGradient
              id={`gradient-${prize.id}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                style={{ stopColor: prize.color, stopOpacity: 0.8 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: prize.color, stopOpacity: 1 }}
              />
            </linearGradient>
            {style.glassEffect && (
              <filter id={`glass-${prize.id}`}>
                <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
                <feOffset in="blur" dx="1" dy="1" result="offsetBlur" />
                <feSpecularLighting
                  in="blur"
                  surfaceScale="5"
                  specularConstant=".75"
                  specularExponent="20"
                  lightingColor="#FFFFFF"
                  result="specOut"
                >
                  <fePointLight x="-5000" y="-10000" z="20000" />
                </feSpecularLighting>
                <feComposite
                  in="specOut"
                  in2="SourceAlpha"
                  operator="in"
                  result="specOut"
                />
                <feComposite
                  in="SourceGraphic"
                  in2="specOut"
                  operator="arithmetic"
                  k1="0"
                  k2="1"
                  k3="1"
                  k4="0"
                  result="litPaint"
                />
              </filter>
            )}
          </defs>
          <path
            d={path}
            fill={`url(#gradient-${prize.id})`}
            stroke={style.borderColor}
            strokeWidth="2"
            filter={style.glassEffect ? `url(#glass-${prize.id})` : undefined}
            className={cn(
              "transition-all duration-300",
              prize.glowColor && "filter drop-shadow-lg"
            )}
          />
          <text
            x={center + (radius * 0.65) * Math.cos(angle + sliceAngle / 2 * Math.PI / 180)}
            y={center + (radius * 0.65) * Math.sin(angle + sliceAngle / 2 * Math.PI / 180)}
            fill="white"
            fontSize="16"
            fontWeight="bold"
            textAnchor="middle"
            dominantBaseline="middle"
            transform={`rotate(${(i * sliceAngle) + (sliceAngle / 2)}, ${center + (radius * 0.65) * Math.cos(angle + sliceAngle / 2 * Math.PI / 180)}, ${center + (radius * 0.65) * Math.sin(angle + sliceAngle / 2 * Math.PI / 180)})`}
            className="text-shadow"
          >
            {prize.text}
          </text>
          {prize.image && (
            <image
              href={prize.image}
              x={center + (radius * 0.3) * Math.cos(angle + sliceAngle / 2 * Math.PI / 180) - 15}
              y={center + (radius * 0.3) * Math.sin(angle + sliceAngle / 2 * Math.PI / 180) - 15}
              width="30"
              height="30"
              transform={`rotate(${(i * sliceAngle) + (sliceAngle / 2)}, ${center + (radius * 0.3) * Math.cos(angle + sliceAngle / 2 * Math.PI / 180)}, ${center + (radius * 0.3) * Math.sin(angle + sliceAngle / 2 * Math.PI / 180)})`}
            />
          )}
        </g>
      );
    });
  };

  return (
    <div className="relative">
      <svg
        ref={wheelRef}
        viewBox="0 0 400 400"
        className="w-full max-w-md mx-auto filter drop-shadow-xl"
      >
        {/* Outer ring */}
        <circle
          cx="200"
          cy="200"
          r="155"
          fill="none"
          stroke={style.borderColor}
          strokeWidth="10"
          className="opacity-80"
        />
        
        {/* Wheel sections */}
        {renderSlices()}
        
        {/* Center decoration */}
        <circle
          cx="200"
          cy="200"
          r="20"
          fill={style.centerColor}
          className="filter drop-shadow-lg"
        />
      </svg>

      {/* Stopper */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-8 h-12"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
      >
        <div
          className="w-0 h-0 border-l-[16px] border-l-transparent border-t-[24px] border-r-[16px] border-r-transparent mx-auto"
          style={{ borderTopColor: style.stopperColor }}
        />
      </div>

      {/* Spin button */}
      <button
        onClick={spin}
        disabled={isSpinning || disabled}
        className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
          "w-20 h-20 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600",
          "shadow-lg transform hover:scale-105 transition-all",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "border-4 border-yellow-300",
          "flex items-center justify-center",
          "font-bold text-white text-lg"
        )}
      >
        SPIN
      </button>
    </div>
  );
};