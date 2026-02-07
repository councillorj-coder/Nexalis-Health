import { useState } from 'react'

export default function NexalisLogo({ size = 56, className = "" }: { size?: number; className?: string }) {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <div
            className={`relative flex items-center justify-center cursor-pointer ${className}`}
            style={{ width: size, height: size }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <style>
                {`
                    /* VISCERAL BREATHING (Inner Loop)
                       Only affects the relative offset after the collision.
                    */
                    @keyframes visceral-breathe-left {
                        0% { transform: translateX(0px); }
                        50% { transform: translateX(2px); } /* Push deeper */
                        100% { transform: translateX(0px); }
                    }
                    @keyframes visceral-breathe-right {
                        0% { transform: translateX(0px); }
                        50% { transform: translateX(-2px); } /* Push deeper */
                        100% { transform: translateX(0px); }
                    }

                    .animate-breathe-left {
                        animation: visceral-breathe-left 6s ease-in-out infinite;
                    }
                    .animate-breathe-right {
                        animation: visceral-breathe-right 6s ease-in-out infinite;
                    }

                    /* 
                       THE TECTONIC TRANSITION (Outer Wrapper)
                       This handles the massive, slow movement from Rift to Contact.
                       NO keyframes here—pure transition for perfect smoothness.
                    */
                    .tectonic-wrapper {
                        transition: transform 6s cubic-bezier(0.5, 0, 0.05, 1);
                    }
                    
                    /* The Child Transition */
                    .star-transition {
                        transition: all 6s cubic-bezier(0.5, 0, 0.05, 1);
                        transform-origin: center;
                    }
                `}
            </style>

            <svg
                width={size}
                height={size}
                viewBox="0 0 100 100"
                className="overflow-visible"
                style={{
                    filter: isHovered ? 'drop-shadow(0 0 20px rgba(255,255,255,0.4))' : 'drop-shadow(0 0 5px rgba(255,255,255,0.1))',
                    transition: 'filter 6s ease-in-out'
                }}
            >
                <defs>
                    <linearGradient id="staticGradA" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#0F172A" /> {/* Deep Midnight */}
                        <stop offset="50%" stopColor="#3B82F6" /> {/* Royal Sapphire */}
                        <stop offset="100%" stopColor="#E0F2FE" /> {/* Diamond Tip */}
                    </linearGradient>
                    <linearGradient id="staticGradB" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#450A0A" /> {/* Deep Burgundy */}
                        <stop offset="50%" stopColor="#E11D48" /> {/* Rich Ruby */}
                        <stop offset="100%" stopColor="#FBBF24" /> {/* Gold Tip */}
                    </linearGradient>
                </defs>

                {/* --- Shard A (Indigo / Male) --- */}
                <g
                    className="tectonic-wrapper"
                    style={{ transform: isHovered ? 'translateX(-27px)' : 'translateX(8px)' }}
                >
                    <g className="animate-breathe-left">
                        <path
                            d="M48 5 L68 50 L48 95 L28 50 Z"
                            fill="url(#staticGradA)"
                            style={{ mixBlendMode: 'normal', transition: 'mix-blend-mode 6s' }}
                        />
                        <path
                            d="M48 5 L68 50 L48 95 L28 50 Z"
                            fill="url(#staticGradA)"
                            style={{ mixBlendMode: 'screen', opacity: 0.6 }}
                        />
                        <path d="M48 5 L68 50 L48 95" stroke="white" strokeWidth="0.5" fill="none" opacity="0.4" />
                    </g>
                </g>

                {/* --- Shard B (Rose / Female) --- */}
                <g
                    className="tectonic-wrapper"
                    style={{ transform: isHovered ? 'translateX(27px)' : 'translateX(-8px)' }}
                >
                    <g className="animate-breathe-right">
                        <path
                            d="M52 5 L72 50 L52 95 L32 50 Z"
                            fill="url(#staticGradB)"
                            style={{ mixBlendMode: 'normal', transition: 'mix-blend-mode 6s' }}
                        />
                        <path
                            d="M52 5 L72 50 L52 95 L32 50 Z"
                            fill="url(#staticGradB)"
                            style={{ mixBlendMode: 'screen', opacity: 0.6 }}
                        />
                        <path d="M52 5 L32 50 L52 95" stroke="white" strokeWidth="0.5" fill="none" opacity="0.4" />
                    </g>
                </g>

                {/* --- The Union Star (Center) --- */}
                <g
                    className="star-transition"
                    style={{
                        transform: isHovered ? 'scale(2.2)' : 'scale(1.6)',
                        opacity: 1
                    }}
                >
                    {/* The Child (Central White Diamond) */}
                    <path
                        d="M50 42 L54 50 L50 58 L46 50 Z"
                        fill="white"
                        style={{ filter: 'drop-shadow(0 0 15px white)' }}
                    />
                </g>
            </svg>
        </div>
    )
}
