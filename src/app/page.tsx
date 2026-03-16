import Navbar from "@/components/NavBar"
import { supabase } from "@/lib/supabase"
import PostCard from "@/components/PostCard"
import Link from "next/link"

export const revalidate = 0

export default async function Home() {
  const { data: recentPosts } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(4)

  return (
    <div>
      <Navbar />

      {/* Hero */}
      <section
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "6rem 2rem 4rem",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(2.5rem, 6vw, 4rem)",
            fontWeight: 700,
            color: "var(--ink)",
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            marginBottom: "1.5rem",
          }}
        >
          Reed of Thoughts
          <br />
        </h1>

        <p
          style={{
            fontSize: "1.1rem",
            color: "var(--ink-muted)",
            maxWidth: "480px",
            margin: "0 auto 2.5rem",
            lineHeight: 1.7,
          }}
        >
          Brewing Words like how I imagine them
        </p>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/poems" className="btn-hero">
              Read Poems
          </Link>
          <Link href="/stories" className="btn-hero">
              Read Stories
          </Link>
        </div>
      </section>

      {/* Divider */}
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "0 2rem",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
        <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
      </div>

      {/* Recent Posts */}
      {recentPosts && recentPosts.length > 0 && (
        <section
          style={{
            maxWidth: "1024px",
            margin: "3rem auto 0",
            padding: "0 2rem",
          }}
        >
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.6rem",
              fontWeight: 600,
              color: "var(--ink)",
              marginBottom: "1.5rem",
            }}
          >
            Recent Posts
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1.5rem"
          }}>
            {recentPosts.map((post: { id: string; title: string; content: string; type: string; created_at?: string }) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}