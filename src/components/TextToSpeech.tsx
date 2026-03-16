'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface TextToSpeechProps {
  text: string
  title?: string
}

export default function TextToSpeech({ text, title }: TextToSpeechProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [supported, setSupported] = useState(false)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    setSupported(typeof window !== 'undefined' && 'speechSynthesis' in window)
  }, [])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  const speak = useCallback(() => {
    if (!supported) return

    // If we were paused, resume
    if (isPaused) {
      window.speechSynthesis.resume()
      setIsPlaying(true)
      setIsPaused(false)
      return
    }

    // Fresh start
    window.speechSynthesis.cancel()

    const fullText = title ? `${title}. ${text}` : text
    const utterance = new SpeechSynthesisUtterance(fullText)
    utterance.rate = 0.88   // slightly slower, more literary
    utterance.pitch = 1.0
    utterance.volume = 1.0

    // Pick a pleasant voice if available
    const voices = window.speechSynthesis.getVoices()
    const preferred = voices.find(
      (v) =>
        v.lang.startsWith('en') &&
        (v.name.includes('Samantha') ||
          v.name.includes('Karen') ||
          v.name.includes('Daniel') ||
          v.name.includes('Google US English'))
    )
    if (preferred) utterance.voice = preferred

    utterance.onstart = () => {
      setIsPlaying(true)
      setIsPaused(false)
    }
    utterance.onend = () => {
      setIsPlaying(false)
      setIsPaused(false)
    }
    utterance.onerror = () => {
      setIsPlaying(false)
      setIsPaused(false)
    }

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

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.6rem',
        marginBottom: '2.5rem',
        padding: '0.55rem 1.1rem',
        borderRadius: '100px',
        border: '1.5px solid var(--border)',
        background: isPlaying
          ? 'linear-gradient(135deg, var(--accent-pale), #fff)'
          : 'rgba(255,255,255,0.7)',
        backdropFilter: 'blur(6px)',
        transition: 'all 0.3s ease',
        boxShadow: isPlaying
          ? '0 4px 20px rgba(139,94,60,0.15)'
          : '0 2px 8px rgba(0,0,0,0.04)',
      }}
    >
      {/* Animated sound-wave icon when playing */}
      {isPlaying && (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'flex-end',
            gap: '2px',
            height: '14px',
          }}
        >
          {[1, 2, 3, 4].map((i) => (
            <span
              key={i}
              style={{
                display: 'block',
                width: '3px',
                borderRadius: '2px',
                background: 'var(--accent)',
                animation: `soundBar 0.8s ease-in-out ${i * 0.12}s infinite alternate`,
              }}
            />
          ))}
        </span>
      )}

      <span
        style={{
          fontSize: '0.78rem',
          fontWeight: 600,
          fontFamily: 'Inter, sans-serif',
          letterSpacing: '0.03em',
          color: isPlaying ? 'var(--accent)' : 'var(--ink-light)',
          userSelect: 'none',
        }}
      >
        {isPaused ? 'Paused' : isPlaying ? 'Reading…' : 'Listen'}
      </span>

      {/* Play / Resume */}
      {!isPlaying && (
        <button
          onClick={speak}
          title={isPaused ? 'Resume reading' : 'Listen to this post'}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            border: 'none',
            background: 'var(--accent)',
            color: '#fff',
            cursor: 'pointer',
            transition: 'transform 0.2s, box-shadow 0.2s',
            boxShadow: '0 2px 8px rgba(139,94,60,0.35)',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
          }}
        >
          {/* Play triangle */}
          <svg width="12" height="14" viewBox="0 0 12 14" fill="currentColor">
            <path d="M1.5 0.5L11.5 7L1.5 13.5V0.5Z" />
          </svg>
        </button>
      )}

      {/* Pause */}
      {isPlaying && (
        <button
          onClick={pause}
          title="Pause"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            border: 'none',
            background: 'var(--accent)',
            color: '#fff',
            cursor: 'pointer',
            transition: 'transform 0.2s',
            boxShadow: '0 2px 8px rgba(139,94,60,0.35)',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)' }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
        >
          {/* Pause bars */}
          <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor">
            <rect x="0" y="0" width="3.5" height="12" rx="1.5" />
            <rect x="6.5" y="0" width="3.5" height="12" rx="1.5" />
          </svg>
        </button>
      )}

      {/* Stop — only visible when playing or paused */}
      {(isPlaying || isPaused) && (
        <button
          onClick={stop}
          title="Stop"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            border: '1.5px solid var(--border)',
            background: 'transparent',
            color: 'var(--ink-muted)',
            cursor: 'pointer',
            transition: 'all 0.2s',
            flexShrink: 0,
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
          {/* Stop square */}
          <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
            <rect width="8" height="8" rx="1" />
          </svg>
        </button>
      )}
    </div>
  )
}
