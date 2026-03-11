"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import Navbar from "@/components/NavBar"

type Status = "idle" | "loading" | "success" | "error"

const ADMIN_PASSWORD = "admin123" // ← change this to your desired password

export default function Admin() {
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [type, setType] = useState("poem")
    const [status, setStatus] = useState<Status>("idle")
    const [posts, setPosts] = useState<any[]>([])
    const [editingId, setEditingId] = useState<string | null>(null)

    // ── Password gate ──────────────────────────────────────────
    const [passwordInput, setPasswordInput] = useState("")
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [passwordError, setPasswordError] = useState(false)

    useEffect(() => {
        if (isAuthenticated) {
            fetchPosts()
        }
    }, [isAuthenticated])

    const fetchPosts = async () => {
        const { data, error } = await supabase
            .from("posts")
            .select("*")
            .order("created_at", { ascending: false })
        if (data && !error) {
            setPosts(data)
        }
    }

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (passwordInput === ADMIN_PASSWORD) {
            setIsAuthenticated(true)
            setPasswordError(false)
        } else {
            setPasswordError(true)
            setPasswordInput("")
        }
    }
    // ──────────────────────────────────────────────────────────

    const savePost = async () => {
        if (!title.trim() || !content.trim()) {
            alert("Please fill in both title and content.")
            return
        }

        setStatus("loading")
        let error;

        if (editingId) {
            const { error: updateError } = await supabase.rpc("update_post", {
                post_id: editingId,
                p_title: title.trim(),
                p_content: content.trim(),
                p_type: type
            })
            error = updateError
        } else {
            const { error: insertError } = await supabase
                .from("posts")
                .insert({ title: title.trim(), content: content.trim(), type })
            error = insertError
        }

        if (error) {
            console.error("Supabase Error Details:", error)
            alert(`Failed to save: ${error.message || JSON.stringify(error)}`)
            setStatus("error")
        } else {
            setStatus("success")
            resetForm()
            fetchPosts()
            setTimeout(() => setStatus("idle"), 3000)
        }
    }

    const resetForm = () => {
        setTitle("")
        setContent("")
        setType("poem")
        setEditingId(null)
    }

    const handleEdit = (post: any) => {
        setEditingId(post.id)
        setTitle(post.title)
        setContent(post.content)
        setType(post.type)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this post?")) return

        const { error } = await supabase.rpc("delete_post", { post_id: id })
        if (error) {
            alert("Failed to delete post: " + error.message)
        } else {
            fetchPosts()
            if (editingId === id) {
                resetForm()
            }
        }
    }

    // ── Lock screen ────────────────────────────────────────────
    if (!isAuthenticated) {
        return (
            <div>
                <Navbar />
                <div
                    style={{
                        minHeight: "80vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "2rem",
                    }}
                >
                    <div
                        style={{
                            background: "#fff",
                            border: "1px solid var(--border)",
                            borderRadius: "24px",
                            padding: "3rem 2.5rem",
                            boxShadow: "0 8px 40px var(--shadow)",
                            width: "100%",
                            maxWidth: "400px",
                            textAlign: "center",
                        }}
                    >
                        {/* Lock icon */}
                        <div
                            style={{
                                width: "60px",
                                height: "60px",
                                borderRadius: "50%",
                                background: "var(--accent-pale)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto 1.5rem",
                                fontSize: "1.6rem",
                            }}
                        >
                            🔒
                        </div>

                        <h1
                            style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: "1.8rem",
                                fontWeight: 700,
                                color: "var(--ink)",
                                marginBottom: "0.4rem",
                                letterSpacing: "-0.02em",
                            }}
                        >
                            Admin Access
                        </h1>
                        <p
                            style={{
                                color: "var(--ink-muted)",
                                fontSize: "0.88rem",
                                marginBottom: "2rem",
                                fontFamily: "Inter, sans-serif",
                            }}
                        >
                            Enter the password to continue.
                        </p>

                        <form onSubmit={handlePasswordSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            <input
                                type="password"
                                value={passwordInput}
                                onChange={(e) => {
                                    setPasswordInput(e.target.value)
                                    setPasswordError(false)
                                }}
                                placeholder="Password"
                                autoFocus
                                style={{
                                    width: "100%",
                                    padding: "0.85rem 1rem",
                                    border: `1.5px solid ${passwordError ? "#e74c3c" : "var(--border)"}`,
                                    borderRadius: "10px",
                                    fontSize: "1rem",
                                    fontFamily: "Inter, sans-serif",
                                    color: "var(--ink)",
                                    background: "var(--cream)",
                                    outline: "none",
                                    transition: "border-color 0.2s",
                                    boxSizing: "border-box",
                                }}
                                onFocus={(e) => {
                                    if (!passwordError) e.currentTarget.style.borderColor = "var(--accent-light)"
                                }}
                                onBlur={(e) => {
                                    if (!passwordError) e.currentTarget.style.borderColor = "var(--border)"
                                }}
                            />

                            {passwordError && (
                                <p
                                    style={{
                                        color: "#c0392b",
                                        fontSize: "0.85rem",
                                        fontFamily: "Inter, sans-serif",
                                        fontWeight: 500,
                                    }}
                                >
                                    Incorrect password. Please try again.
                                </p>
                            )}

                            <button
                                type="submit"
                                style={{
                                    background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-light) 100%)",
                                    color: "#fff",
                                    border: "none",
                                    padding: "0.9rem 2rem",
                                    borderRadius: "100px",
                                    fontSize: "0.95rem",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    fontFamily: "Inter, sans-serif",
                                    letterSpacing: "0.02em",
                                    transition: "opacity 0.2s",
                                }}
                            >
                                Unlock
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
    // ──────────────────────────────────────────────────────────

    return (
        <div>
            <Navbar />

            <div style={{ maxWidth: "700px", margin: "0 auto", padding: "3rem 2rem" }}>

                {/* Header */}
                <div style={{ marginBottom: "2.5rem" }}>
                    <span
                        style={{
                            display: "inline-block",
                            fontSize: "0.7rem",
                            fontWeight: 600,
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            color: "var(--accent)",
                            background: "var(--accent-pale)",
                            padding: "0.25rem 0.75rem",
                            borderRadius: "100px",
                            marginBottom: "0.75rem",
                        }}
                    >
                        Admin
                    </span>
                    <h1
                        style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "2.5rem",
                            fontWeight: 700,
                            color: "var(--ink)",
                            letterSpacing: "-0.02em",
                        }}
                    >
                        Write Something New
                    </h1>
                    <p style={{ color: "var(--ink-muted)", marginTop: "0.4rem", fontSize: "0.9rem" }}>
                        Publish a poem or story directly to the site.
                    </p>
                </div>

                {/* Card */}
                <div
                    style={{
                        background: "#fff",
                        border: "1px solid var(--border)",
                        borderRadius: "20px",
                        padding: "2rem",
                        boxShadow: "0 4px 24px var(--shadow)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "1.25rem",
                    }}
                >
                    {/* Type selector */}
                    <div style={{ display: "flex", gap: "0.75rem" }}>
                        {["poem", "story"].map((t) => (
                            <button
                                key={t}
                                onClick={() => setType(t)}
                                style={{
                                    padding: "0.5rem 1.25rem",
                                    borderRadius: "100px",
                                    border: "2px solid",
                                    borderColor: type === t ? "var(--accent)" : "var(--border)",
                                    background: type === t ? "var(--accent-pale)" : "transparent",
                                    color: type === t ? "var(--accent)" : "var(--ink-muted)",
                                    fontWeight: 600,
                                    fontSize: "0.85rem",
                                    textTransform: "capitalize" as const,
                                    cursor: "pointer",
                                    fontFamily: "Inter, sans-serif",
                                    letterSpacing: "0.02em",
                                    transition: "all 0.2s",
                                }}
                            >
                                {t}
                            </button>
                        ))}
                    </div>

                    {/* Title */}
                    <div>
                        <label
                            style={{
                                display: "block",
                                fontSize: "0.8rem",
                                fontWeight: 600,
                                color: "var(--ink-muted)",
                                letterSpacing: "0.05em",
                                textTransform: "uppercase",
                                marginBottom: "0.4rem",
                                fontFamily: "Inter, sans-serif",
                            }}
                        >
                            Title
                        </label>
                        <input
                            value={title}
                            placeholder={type === "poem" ? "e.g. Rain on Empty Roads" : "e.g. The Last Letter"}
                            onChange={(e) => setTitle(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "0.85rem 1rem",
                                border: "1.5px solid var(--border)",
                                borderRadius: "10px",
                                fontSize: "1rem",
                                fontFamily: "'Playfair Display', serif",
                                color: "var(--ink)",
                                background: "var(--cream)",
                                outline: "none",
                                transition: "border-color 0.2s",
                            }}
                            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent-light)")}
                            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <label
                            style={{
                                display: "block",
                                fontSize: "0.8rem",
                                fontWeight: 600,
                                color: "var(--ink-muted)",
                                letterSpacing: "0.05em",
                                textTransform: "uppercase",
                                marginBottom: "0.4rem",
                                fontFamily: "Inter, sans-serif",
                            }}
                        >
                            Content
                        </label>
                        <textarea
                            value={content}
                            placeholder="Write here…"
                            onChange={(e) => setContent(e.target.value)}
                            rows={12}
                            style={{
                                width: "100%",
                                padding: "0.85rem 1rem",
                                border: "1.5px solid var(--border)",
                                borderRadius: "10px",
                                fontSize: "1rem",
                                lineHeight: 1.8,
                                fontFamily: type === "poem" ? "'Playfair Display', serif" : "Inter, sans-serif",
                                color: "var(--ink)",
                                background: "var(--cream)",
                                resize: "vertical",
                                outline: "none",
                                transition: "border-color 0.2s",
                            }}
                            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent-light)")}
                            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                        />
                    </div>

                    {/* Status messages */}
                    {status === "success" && (
                        <div
                            style={{
                                padding: "0.9rem 1.2rem",
                                background: "#f0faf5",
                                border: "1px solid #a3d9b8",
                                borderRadius: "10px",
                                color: "#1d6e42",
                                fontSize: "0.9rem",
                                fontFamily: "Inter, sans-serif",
                            }}
                        >
                            ✓ Post published successfully!
                        </div>
                    )}
                    {status === "error" && (
                        <div
                            style={{
                                padding: "0.9rem 1.2rem",
                                background: "#fff0f0",
                                border: "1px solid #f5c6cb",
                                borderRadius: "10px",
                                color: "#c0392b",
                                fontSize: "0.9rem",
                                fontFamily: "Inter, sans-serif",
                            }}
                        >
                            ✗ Failed to publish. Check your Supabase connection.
                        </div>
                    )}

                    {/* Submit */}
                    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                        <button
                            onClick={savePost}
                            disabled={status === "loading"}
                            style={{
                                background:
                                    status === "loading"
                                        ? "var(--border)"
                                        : "linear-gradient(135deg, var(--accent) 0%, var(--accent-light) 100%)",
                                color: status === "loading" ? "var(--ink-muted)" : "#fff",
                                border: "none",
                                padding: "0.9rem 2rem",
                                borderRadius: "100px",
                                fontSize: "0.95rem",
                                fontWeight: 600,
                                cursor: status === "loading" ? "not-allowed" : "pointer",
                                fontFamily: "Inter, sans-serif",
                                letterSpacing: "0.02em",
                                transition: "opacity 0.2s",
                            }}
                        >
                            {status === "loading" ? "Saving…" : editingId ? "Update Post" : "Publish"}
                        </button>

                        {editingId && (
                            <button
                                onClick={resetForm}
                                style={{
                                    background: "transparent",
                                    color: "var(--ink-muted)",
                                    border: "1px solid var(--border)",
                                    padding: "0.9rem 1.5rem",
                                    borderRadius: "100px",
                                    fontSize: "0.95rem",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    fontFamily: "Inter, sans-serif",
                                }}
                            >
                                Cancel Edit
                            </button>
                        )}
                    </div>
                </div>

                {/* Manage Posts Section */}
                <div style={{ marginTop: "4rem" }}>
                    <div style={{ marginBottom: "1.5rem" }}>
                        <h2
                            style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: "1.8rem",
                                fontWeight: 700,
                                color: "var(--ink)",
                            }}
                        >
                            Manage Posts
                        </h2>
                        <p style={{ color: "var(--ink-muted)", fontSize: "0.9rem" }}>
                            Edit or delete your existing poems and stories.
                        </p>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {posts.length === 0 ? (
                            <p style={{ color: "var(--ink-muted)", fontSize: "0.95rem", fontFamily: "Inter, sans-serif" }}>
                                No posts found.
                            </p>
                        ) : (
                            posts.map((post) => (
                                <div
                                    key={post.id}
                                    style={{
                                        background: "#fff",
                                        border: "1px solid var(--border)",
                                        borderRadius: "12px",
                                        padding: "1.25rem 1.5rem",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        gap: "1rem",
                                    }}
                                >
                                    <div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem" }}>
                                            <span
                                                style={{
                                                    fontSize: "0.65rem",
                                                    fontWeight: 600,
                                                    letterSpacing: "0.1em",
                                                    textTransform: "uppercase",
                                                    padding: "0.15rem 0.5rem",
                                                    borderRadius: "100px",
                                                    background: post.type === "poem" ? "var(--accent-pale)" : "#eef2f5",
                                                    color: post.type === "poem" ? "var(--accent)" : "#5e7a8b",
                                                }}
                                            >
                                                {post.type}
                                            </span>
                                            <h3
                                                style={{
                                                    fontFamily: "'Playfair Display', serif",
                                                    fontSize: "1.1rem",
                                                    fontWeight: 600,
                                                    color: "var(--ink)",
                                                    margin: 0,
                                                }}
                                            >
                                                {post.title}
                                            </h3>
                                        </div>
                                        <p
                                            style={{
                                                fontSize: "0.85rem",
                                                color: "var(--ink-muted)",
                                                margin: 0,
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                maxWidth: "350px",
                                            }}
                                        >
                                            {post.content.replace(/\n/g, " ")}
                                        </p>
                                    </div>

                                    <div style={{ display: "flex", gap: "0.5rem" }}>
                                        <button
                                            onClick={() => handleEdit(post)}
                                            style={{
                                                padding: "0.5rem 1rem",
                                                fontSize: "0.85rem",
                                                fontWeight: 600,
                                                color: "var(--ink)",
                                                background: "var(--cream)",
                                                border: "1px solid var(--border)",
                                                borderRadius: "8px",
                                                cursor: "pointer",
                                            }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(post.id)}
                                            style={{
                                                padding: "0.5rem 1rem",
                                                fontSize: "0.85rem",
                                                fontWeight: 600,
                                                color: "#e74c3c",
                                                background: "#fdf3f2",
                                                border: "1px solid #fadbd8",
                                                borderRadius: "8px",
                                                cursor: "pointer",
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>
        </div>
    )
}