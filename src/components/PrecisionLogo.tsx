import { useState, useEffect } from 'react'

export default function PrecisionLogo({ size = 20, className = "" }: { size?: number; className?: string }) {
    const [isHovered, setIsHovered] = useState(false)
    const [pathD, setPathD] = useState("M -20,50 Q -10,40 0,50 Q 8,58 15,50 Q 25,35 35,50 Q 42,65 50,50 Q 58,42 65,50 Q 75,65 85,50 Q 92,30 100,50 Q 110,60 120,50")

    useEffect(() => {
        const generateRandomPath = () => {
            const range = (min: number, max: number) => Math.random() * (max - min) + min;
            // High-energy stochastic range hits top/bottom frequently
            return `M -20,50 Q -10,${range(0, 100)} 0,50 Q 8,${range(0, 40)} 15,50 Q 25,${range(60, 100)} 35,50 Q 42,${range(0, 100)} 50,50 Q 58,${range(0, 30)} 65,50 Q 75,${range(70, 100)} 85,50 Q 92,${range(0, 100)} 100,50 Q 110,${range(10, 90)} 120,50`;
        };

        const interval = setInterval(() => {
            setPathD(generateRandomPath());
        }, 2200);

        return () => clearInterval(interval);
    }, []);

    return (
        <div
            className={`relative flex items-center justify-center ${className}`}
            style={{ width: size, height: size }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <style>
                {`
                    .optic-transition {
                        transition: all 1.2s cubic-bezier(0.16, 1, 0.3, 1);
                    }

                    .path-morph {
                        transition: d 4s cubic-bezier(0.4, 0, 0.2, 1);
                    }
                `}
            </style>

            {/* Container for minimal breathing animation */}
            <div className="relative w-full h-full flex items-center justify-center opacity-80">
                <svg
                    width={size}
                    height={size}
                    viewBox="0 0 100 100"
                    className="overflow-visible"
                >
                    <defs />

                    {/* --- THE MINIMALIST WAVELENGTH --- */}
                    <g style={{ transform: 'scale(1.2)', transformOrigin: '50px 50px' }}>
                        <path
                            d={pathD}
                            fill="none"
                            stroke="#EF4444"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                            opacity="0.4"
                            className="path-morph"
                        />
                    </g>

                    {/* --- THE MINIMALIST CROSSHAIR --- */}
                    <g style={{ transformOrigin: '50px 50px', transform: 'scale(1.2)' }}>
                        <g opacity="0.3">
                            <line x1="50" y1="12" x2="50" y2="18" stroke="#3B82F6" strokeWidth="0.8" />
                            <line x1="50" y1="82" x2="50" y2="88" stroke="#3B82F6" strokeWidth="0.8" />
                            <line x1="12" y1="50" x2="18" y2="50" stroke="#3B82F6" strokeWidth="0.8" />
                            <line x1="82" y1="50" x2="88" y2="50" stroke="#3B82F6" strokeWidth="0.8" />
                        </g>
                    </g>

                    <g
                        className="optic-transition"
                        style={{
                            transform: isHovered ? 'scale(1.05)' : 'scale(1.2)',
                            transformOrigin: '50px 50px'
                        }}
                    >
                        {/* Simplified Vertical marks */}
                        <line x1="50" y1="35" x2="50" y2="42" stroke="#3B82F6" strokeWidth="0.8" opacity="0.4" />
                        <line x1="50" y1="58" x2="50" y2="65" stroke="#3B82F6" strokeWidth="0.8" opacity="0.4" />
                        {/* Simplified Horizontal marks */}
                        <line x1="35" y1="50" x2="42" y2="50" stroke="#3B82F6" strokeWidth="0.8" opacity="0.4" />
                        <line x1="58" y1="50" x2="65" y2="50" stroke="#3B82F6" strokeWidth="0.8" opacity="0.4" />

                        {/* Central dot */}
                        <circle cx="50" cy="50" r="0.8" fill="#3B82F6" opacity="0.6" />
                    </g>
                </svg>
            </div>
        </div>
    )
}
