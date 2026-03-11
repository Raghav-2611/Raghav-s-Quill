import { useState, useEffect, useCallback } from "react"

export function useLocalLikes() {
    const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())
    const [isLoaded, setIsLoaded] = useState(false)

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem("poetic_likes")
            if (stored) {
                setLikedPosts(new Set(JSON.parse(stored)))
            }
        } catch (e) {
            console.error("Failed to parse liked posts from localStorage")
        } finally {
            setIsLoaded(true)
        }
    }, [])

    // Save to localStorage when state changes
    const toggleLike = useCallback((postId: string) => {
        setLikedPosts((prev) => {
            const next = new Set(prev)
            if (next.has(postId)) {
                next.delete(postId)
            } else {
                next.add(postId)
            }

            try {
                localStorage.setItem("poetic_likes", JSON.stringify(Array.from(next)))
            } catch (e) {
                console.error("Failed to save liked posts to localStorage")
            }

            return next
        })
    }, [])

    // To prevent hydration mismatch, default to false if not loaded
    const hasLiked = useCallback((postId: string) => {
        if (!isLoaded) return false
        return likedPosts.has(postId)
    }, [likedPosts, isLoaded])

    return { toggleLike, hasLiked, isLoaded }
}
