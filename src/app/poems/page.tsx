import { supabase } from "@/lib/supabase"
import PostCard from "@/components/PostCard"
import Navbar from "@/components/NavBar"

export const metadata = {
  title: "Poems — Raghav's Quill",
  description: "Browse original poems crafted with introspection and emotion.",
}

export const revalidate = 0

export default async function Poems() {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("type", "poem")
    .order("created_at", { ascending: false })

  const poems = data ?? []

  return (
    <div>
      <Navbar />

      <div style={{ maxWidth: "1024px", margin: "0 auto", padding: "3rem 2rem" }}>

        {/* Page header */}
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
            Poetry
          </span>

          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "2.5rem",
              fontWeight: 700,
              color: "var(--ink)",
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
            }}
          >
            Poems
          </h1>
          <p style={{ color: "var(--ink-muted)", marginTop: "0.5rem", fontSize: "0.95rem" }}>
            {poems.length} {poems.length === 1 ? "poem" : "poems"} written
          </p>
        </div>

        {/* Post list */}
        {error ? (
          <div
            style={{
              padding: "2rem",
              background: "#fff0f0",
              borderRadius: "12px",
              color: "#c0392b",
              border: "1px solid #f5c6cb",
            }}
          >
            Could not load poems. Please check your Supabase configuration.
          </div>
        ) : poems.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "5rem 2rem",
              color: "var(--ink-muted)",
            }}
          >
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", marginBottom: "0.5rem" }}>
              No poems yet.
            </p>
            <p style={{ fontSize: "0.9rem" }}>Check back soon for new writings.</p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1.5rem"
          }}>
            {poems.map((post: { id: string; title: string; content: string; type: string; created_at?: string }) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}

      </div>
    </div>
  )
}