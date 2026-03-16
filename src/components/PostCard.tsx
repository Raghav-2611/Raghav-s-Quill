"use client"

import Link from "next/link"
import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useLocalLikes } from "@/hooks/useLocalLikes"

interface Post {
  id: string
  title: string
  content: string
  type: string
  created_at?: string
  likes?: number
}

export default function PostCard({ post }: { post: Post }) {
  const [likes, setLikes] = useState(post.likes || 0)
  const [isLiking, setIsLiking] = useState(false)

  const { toggleLike, hasLiked, isLoaded } = useLocalLikes()
  const isLikedByMe = isLoaded ? hasLiked(post.id) : false

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault() // prevent navigating to post page
    if (!isLoaded || isLiking) return // Wait for load or currently adding/removing a like

    setIsLiking(true)

    const willLike = !isLikedByMe

    // Optimistic update
    setLikes((prev) => willLike ? prev + 1 : Math.max(0, prev - 1))
    toggleLike(post.id)

    // Send RPC call to increment or decrement likes
    const rpcName = willLike ? 'increment_likes' : 'decrement_likes'
    const { error } = await supabase.rpc(rpcName, { post_id: post.id })

    if (error) {
      console.error(`Failed to ${willLike ? 'like' : 'unlike'} post`, error)
      setLikes((prev) => willLike ? prev - 1 : prev + 1) // Revert on error
      toggleLike(post.id) // Revert local state
    }

    setIsLiking(false)
  }

  const preview = post.content
    ? post.content.replace(/\n/g, " ").slice(0, 600)
    : "No preview available"

  const isPoem = post.type === "poem"

  return (
    <Link href={`/post/${post.id}`}>
      <div className="post-card">
        {/* Accent top bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "3px",
            height: "100%",
            background: isPoem
              ? "linear-gradient(180deg, var(--accent), var(--accent-light))"
              : "linear-gradient(180deg, #5e7a8b, #8baab8)",
            borderRadius: "3px 0 0 3px",
          }}
        />

        {/* Type badge */}
        <div style={{ marginBottom: "0.75rem" }}>
          <span
            style={{
              display: "inline-block",
              fontSize: "0.7rem",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "0.2rem 0.6rem",
              borderRadius: "100px",
              background: isPoem ? "var(--accent-pale)" : "#eef2f5",
              color: isPoem ? "var(--accent)" : "#5e7a8b",
            }}
          >
            {post.type}
          </span>
        </div>

        {/* Main Content Area */}
        <div style={{ flex: 1, position: "relative", marginBottom: "1rem" }}>
          {/* Title */}
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.3rem",
              fontWeight: 600,
              color: "var(--ink)",
              marginBottom: "0.6rem",
              lineHeight: 1.3,
            }}
          >
            {post.title}
          </h2>

          {/* Preview Container with Fade Effect */}
          <div style={{ position: "relative", overflow: "hidden", maxHeight: "300px" }}>
            <p
              style={{
                fontSize: "0.9rem",
                color: "var(--ink-muted)",
                lineHeight: 1.6,
                fontStyle: isPoem ? "italic" : "normal",
                margin: 0,
              }}
            >
              {preview}
              {post.content && post.content.length > 600 ? "…" : ""}
            </p>

            {/* The Fade Overlay - Starts after ~4 lines (~95px) */}
            <div
              style={{
                position: "absolute",
                top: "95px",
                left: 0,
                right: 0,
                bottom: 0,
                background: "linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1) 85%)",
                pointerEvents: "none"
              }}
            />
          </div>
        </div>

        {/* Read more hint & Likes */}
        <div
          style={{
            marginTop: "1.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p
            className="read-more-hint"
            style={{
              fontSize: "0.8rem",
              color: "var(--accent-light)",
              fontWeight: 500,
              margin: 0,
            }}
          >
            Read more →
          </p>

          <div
            onClick={handleLike}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              color: isLikedByMe ? "#e74c3c" : "var(--ink-muted)",
              cursor: isLikedByMe ? "default" : "pointer",
              transition: "transform 0.2s, color 0.2s",
              background: "rgba(0,0,0,0.02)",
              padding: "0.25rem 0.6rem",
              borderRadius: "100px",
            }}
            onMouseEnter={(e) => {
              if (isLikedByMe) return
              e.currentTarget.style.transform = "scale(1.1)"
              e.currentTarget.style.color = "#e74c3c"
            }}
            onMouseLeave={(e) => {
              if (isLikedByMe) return
              e.currentTarget.style.transform = "scale(1)"
              e.currentTarget.style.color = "var(--ink-muted)"
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill={isLikedByMe ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>{likes}</span>
          </div>
        </div>
      </div>

    </Link>
  )
}