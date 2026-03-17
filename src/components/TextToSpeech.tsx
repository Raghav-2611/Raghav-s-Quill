'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface TextToSpeechProps {
  text: string
  title?: string
}

// bar heights (px) — gives an organic waveform silhouette
const BAR_HEIGHTS = [
  10, 18, 28, 22, 34, 26, 38, 30, 42, 36, 44, 38, 40, 34, 46, 40, 44,
  36, 38, 30, 42, 34, 28, 22, 18, 14, 20, 16, 24, 18, 26, 20, 22, 16, 12,
]

export default function TextToSpeech({ text, title }: TextToSpeechProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [supported, setSupported] = useState(false)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    setSupported(typeof window !== 'undefined' && 'speechSynthesis' in window)
  }, [])

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  const speak = useCallback(() => {
    if (!supported) return

    if (isPaused) {
      window.speechSynthesis.resume()
      setIsPlaying(true)
      setIsPaused(false)
      return
    }

    window.speechSynthesis.cancel()

    const fullText = title ? `${title}. ${text}` : text
    const utterance = new SpeechSynthesisUtterance(fullText)
    // Slower rate and slightly lower pitch help electronic voices sound softer and more natural
    utterance.rate = 0.85
    utterance.pitch = 0.95
    utterance.volume = 1.0

    const voices = window.speechSynthesis.getVoices()
    
    // Prioritize high-quality, soft female voices available on Apple/Windows devices
    const preferredVoices = [
      'Samantha', // macOS/iOS high quality female
      'Victoria', // macOS/iOS soft voice
      'Moira',    // macOS/iOS Irish (often very pleasant/soft)
      'Tessa',    // macOS/iOS South African (often clear)
      'Google US English', // Chrome standard
      'Microsoft Zira'    // Windows standard female
    ]

    const preferred = voices.find(v => 
      preferredVoices.some(pv => v.name.includes(pv)) && v.lang.startsWith('en')
    )
    
    // If we didn't find our specific list, try to find any female English voice
    if (preferred) {
      utterance.voice = preferred
    } else {
      const fallbackFemale = voices.find(v => 
        v.lang.startsWith('en') && (v.name.toLowerCase().includes('female') || v.name.includes('Samantha') || v.name.includes('Karen'))
      )
      if (fallbackFemale) utterance.voice = fallbackFemale
    }

    utterance.onstart = () => { setIsPlaying(true); setIsPaused(false) }
    utterance.onend = () => { setIsPlaying(false); setIsPaused(false) }
    utterance.onerror = () => { setIsPlaying(false); setIsPaused(false) }

    utteranceRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }, [supported, isPaused, text, title])

  const pause = () => {
    if (!supported) return
    window.speechSynthesis.pause()
    setIsPlaying(false)
    setIsPaused(true)
  }

  const stop = () => {
    if (!supported) return
    window.speechSynthesis.cancel()
    setIsPlaying(false)
    setIsPaused(false)
  }

  if (!supported) return null

  const handlePlayPause = () => (isPlaying ? pause() : speak())

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.9rem',
        marginBottom: '2.5rem',
        padding: '0.65rem 1.2rem 0.65rem 0.65rem',
        borderRadius: '100px',
        background: '#fff',
        border: '1.5px solid var(--border)',
        boxShadow: isPlaying
          ? '0 4px 24px rgba(139,94,60,0.18)'
          : '0 2px 10px rgba(0,0,0,0.06)',
        transition: 'box-shadow 0.3s ease',
        maxWidth: '100%',
      }}
    >
      {/* ── Circular play / pause button ── */}
      <button
        onClick={handlePlayPause}
        title={isPlaying ? 'Pause' : isPaused ? 'Resume' : 'Listen'}
        style={{
          flexShrink: 0,
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          border: 'none',
          background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-light) 100%)',
          color: '#fff',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 3px 12px rgba(139,94,60,0.40)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)'
          e.currentTarget.style.boxShadow = '0 5px 18px rgba(139,94,60,0.55)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.boxShadow = '0 3px 12px rgba(139,94,60,0.40)'
        }}
      >
        {isPlaying ? (
          /* Pause icon */
          <svg width="12" height="14" viewBox="0 0 12 14" fill="currentColor">
            <rect x="0" y="0" width="4" height="14" rx="1.5" />
            <rect x="8" y="0" width="4" height="14" rx="1.5" />
          </svg>
        ) : (
          /* Play triangle */
          <svg width="13" height="15" viewBox="0 0 13 15" fill="currentColor" style={{ marginLeft: '2px' }}>
            <path d="M1.5 1.5L11.5 7.5L1.5 13.5V1.5Z" />
          </svg>
        )}
      </button>

      {/* ── Waveform bars ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '3px',
          overflow: 'hidden',
        }}
      >
        {BAR_HEIGHTS.map((h, i) => {
          // bars fade out toward the right to mimic "unplayed" audio
          const fadeFactor = i / BAR_HEIGHTS.length // 0 → 1
          const opacity = isPlaying
            ? 1                          // all vibrant while playing
            : 1 - fadeFactor * 0.75      // idle: right side fades
          const animated = isPlaying
          const delay = (i % 6) * 0.12  // stagger so bars don't all move together

          return (
            <span
              key={i}
              style={{
                display: 'block',
                width: '3.5px',
                height: `${h}px`,
                borderRadius: '3px',
                background: 'var(--accent)',
                opacity,
                flexShrink: 0,
                transformOrigin: 'center',
                animation: animated
                  ? `waveBar 0.7s ease-in-out ${delay}s infinite alternate`
                  : 'none',
                transition: 'opacity 0.4s ease',
              }}
            />
          )
        })}
      </div>

      {/* ── Stop button (only when active) ── */}
      {(isPlaying || isPaused) && (
        <button
          onClick={stop}
          title="Stop"
          style={{
            flexShrink: 0,
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            border: '1.5px solid var(--border)',
            background: 'transparent',
            color: 'var(--ink-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#fee2e2'
            e.currentTarget.style.borderColor = '#f87171'
            e.currentTarget.style.color = '#ef4444'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.borderColor = 'var(--border)'
            e.currentTarget.style.color = 'var(--ink-muted)'
          }}
        >
          <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
            <rect width="8" height="8" rx="1.5" />
          </svg>
        </button>
      )}
    </div>
  )
}
