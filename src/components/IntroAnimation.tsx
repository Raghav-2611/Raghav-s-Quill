'use client'

import { useEffect, useState } from 'react'

export default function IntroAnimation() {
    const [visible, setVisible] = useState(false)
    const [phase, setPhase] = useState<'draw' | 'hold' | 'fadeout' | 'done'>('draw')

    useEffect(() => {
        // Only show if not already seen in this session
        if (typeof window !== 'undefined' && sessionStorage.getItem('raghavsQuillIntroSeen')) {
            return
        }
        setVisible(true)

        // Phase timeline:
        // 0–2600ms → draw animation (CSS handles the stroke)
        // 2600–3200ms → hold (show the completed signature)
        // 3200–4000ms → fade out overlay
        // 4000ms+ → unmount
        const holdTimer = setTimeout(() => setPhase('hold'), 2600)
        const fadeTimer = setTimeout(() => setPhase('fadeout'), 3200)
        const doneTimer = setTimeout(() => {
            setPhase('done')
            setVisible(false)
            sessionStorage.setItem('raghavsQuillIntroSeen', '1')
        }, 4100)

        return () => {
            clearTimeout(holdTimer)
            clearTimeout(fadeTimer)
            clearTimeout(doneTimer)
        }
    }, [])

    if (!visible || phase === 'done') return null

    return (
        <div
            className={`intro-overlay ${phase === 'fadeout' ? 'intro-overlay--out' : ''}`}
            aria-hidden="true"
        >
            <div className="intro-content">
                {/* Quill feather icon drawn in SVG */}
                <svg
                    className="quill-icon"
                    viewBox="0 0 60 80"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        className="quill-path"
                        d="M50 5 C55 10, 58 20, 50 30 C44 38, 30 45, 20 55 C14 62, 10 70, 12 75 C8 72, 8 65, 12 58 C18 48, 30 40, 40 30 C48 22, 52 14, 50 5Z"
                        stroke="#8b5e3c"
                        strokeWidth="1.2"
                        fill="none"
                    />
                    <path
                        className="quill-nib"
                        d="M12 75 L8 80 M12 75 C10 73, 9 70, 10 68"
                        stroke="#8b5e3c"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                    />
                    <path
                        className="quill-vein"
                        d="M50 5 C40 15, 25 35, 12 75"
                        stroke="#c4956a"
                        strokeWidth="0.6"
                        strokeDasharray="1 2"
                        opacity="0.7"
                    />
                </svg>

                {/* Main signature text as SVG */}
                <svg
                    className="signature-svg"
                    viewBox="0 0 700 140"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-label="Raghav's Quill"
                >
                    <defs>
                        <style>{`
              @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');
            `}</style>
                    </defs>
                    <text
                        x="50%"
                        y="100"
                        textAnchor="middle"
                        fontFamily="'Great Vibes', cursive"
                        fontSize="90"
                        fill="none"
                        stroke="#8b5e3c"
                        strokeWidth="1.5"
                        className="signature-text"
                    >
                        Raghav&apos;s Quill
                    </text>
                </svg>

                {/* Underline flourish */}
                <svg
                    className="flourish-svg"
                    viewBox="0 0 400 30"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        className="flourish-path"
                        d="M20 15 C80 5, 140 25, 200 15 C260 5, 320 22, 380 12"
                        stroke="#c4956a"
                        strokeWidth="1.2"
                        fill="none"
                        strokeLinecap="round"
                    />
                </svg>
            </div>
        </div>
    )
}
