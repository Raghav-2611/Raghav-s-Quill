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
    e.preventDefault()
    if (!isLoaded || isLiking) return

    setIsLiking(true)
    const willLike = !isLikedByMe

    setLikes((prev) => willLike ? prev + 1 : Math.max(0, prev - 1))
    toggleLike(post.id)

    const rpcName = willLike ? 'increment_likes' : 'decrement_likes'
    const { error } = await supabase.rpc(rpcName, { post_id: post.id })

    if (error) {
      console.error(`Failed to ${willLike ? 'like' : 'unlike'} post`, error)
      setLikes((prev) => willLike ? prev - 1 : prev + 1)
      toggleLike(post.id)
    }

    setIsLiking(false)
  }

  const preview = post.content
    ? post.content.replace(/\n/g, " ").slice(0, 600)
    : "No preview available"

  const isPoem = post.type === "poem"

  return (
    <Link href={`/post/${post.id}`}>
      <div className="group relative flex flex-col min-h-[400px] md:min-h-[450px] bg-white border border-[var(--border)] rounded-2xl p-6 md:p-8 cursor-pointer transition-all duration-300 shadow-sm hover:-translate-y-1 hover:shadow-xl hover:border-[var(--accent-light)] overflow-hidden">
        {/* Accent sidebar */}
        <div
          className={`absolute top-0 left-0 w-1 h-full rounded-l-2xl ${isPoem
              ? "bg-linear-to-b from-[var(--accent)] to-[var(--accent-light)]"
              : "bg-linear-to-b from-[#5e7a8b] to-[#8baab8]"
            }`}
        />

        {/* Type badge */}
        <div className="mb-4">
          <span
            className={`inline-block text-[10px] md:text-[11px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full ${isPoem
                ? "bg-[var(--accent-pale)] text-[var(--accent)]"
                : "bg-slate-100 text-slate-500"
              }`}
          >
            {post.type}
          </span>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 relative mb-6">
          <h2 className="font-serif text-xl md:text-2xl font-semibold text-[var(--ink)] mb-3 leading-tight">
            {post.title}
          </h2>

          <div className="relative overflow-hidden max-h-[250px] md:max-h-[300px]">
            <p className={`text-sm md:text-base text-[var(--ink-muted)] leading-relaxed ${isPoem ? "italic" : "normal"}`}>
              {preview}
              {post.content && post.content.length > 600 ? "…" : ""}
            </p>

            {/* Fade Overlay */}
            <div className="absolute top-24 inset-x-0 bottom-0 bg-linear-to-b from-transparent to-white/90 pointer-events-none" />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto flex justify-between items-center">
          <p className="text-xs md:text-sm text-[var(--accent-light)] font-medium">
            Read more →
          </p>

          <div
            onClick={handleLike}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/5 transition-all duration-200 group/like ${isLikedByMe ? "text-red-500" : "text-[var(--ink-muted)] hover:scale-105 hover:text-red-500"
              }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill={isLikedByMe ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              className="transition-colors"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span className="text-xs md:text-sm font-semibold">{likes}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}