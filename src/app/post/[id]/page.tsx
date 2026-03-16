import { supabase } from "@/lib/supabase"
import Navbar from "@/components/NavBar"
import Link from "next/link"
import { notFound } from "next/navigation"
import PostContent from "@/components/PostContent"
import TextToSpeech from "@/components/TextToSpeech"

export const revalidate = 0

export default async function Post({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !data) {
    notFound()
  }

  const isPoem = data.type === "poem"

  return (
    <div>
      <Navbar />

      <article style={{ maxWidth: "700px", margin: "0 auto", padding: "3rem 2rem 6rem" }}>

        {/* Back link */}
        <Link
          href={isPoem ? "/poems" : "/stories"}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            fontSize: "0.85rem",
            color: "var(--ink-muted)",
            fontFamily: "Inter, sans-serif",
            marginBottom: "2rem",
            transition: "color 0.2s",
          }}
        >
          ← Back to {isPoem ? "Poems" : "Stories"}
        </Link>

        {/* Type badge */}
        <div style={{ marginBottom: "1rem" }}>
          <span
            style={{
              display: "inline-block",
              fontSize: "0.7rem",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "0.25rem 0.75rem",
              borderRadius: "100px",
              background: isPoem ? "var(--accent-pale)" : "#eef2f5",
              color: isPoem ? "var(--accent)" : "#5e7a8b",
            }}
          >
            {data.type}
          </span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(2rem, 5vw, 3rem)",
            fontWeight: 700,
            color: "var(--ink)",
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
            marginBottom: "1rem",
          }}
        >
          {data.title}
        </h1>

        {/* Date if available */}
        {data.created_at && (
          <p
            style={{
              fontSize: "0.85rem",
              color: "var(--ink-muted)",
              marginBottom: "2.5rem",
              fontFamily: "Inter, sans-serif",
            }}
          >
            {new Date(data.created_at).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        )}

        {/* Decorative rule */}
        <div
          style={{
            width: "60px",
            height: "3px",
            background: "linear-gradient(90deg, var(--accent), var(--accent-light))",
            borderRadius: "2px",
            marginBottom: "2.5rem",
          }}
        />

        {/* Listen button */}
        <TextToSpeech text={data.content} title={data.title} />

        {/* Content */}
        <PostContent content={data.content} isPoem={isPoem} />

      </article>
    </div>
  )
}