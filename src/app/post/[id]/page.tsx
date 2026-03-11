import { supabase } from "@/lib/supabase"
import Navbar from "@/components/NavBar"
import Link from "next/link"
import { notFound } from "next/navigation"

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
    <div className="min-h-screen bg-[var(--cream)]">
      <Navbar />

      <article className="max-w-2xl mx-auto px-6 py-12 md:py-20">
        {/* Back link */}
        <Link
          href={isPoem ? "/poems" : "/stories"}
          className="inline-flex items-center gap-2 text-sm text-[var(--ink-muted)] hover:text-[var(--accent)] transition-colors mb-12 group"
        >
          <span className="transition-transform group-hover:-translate-x-1">←</span>
          Back to {isPoem ? "Poems" : "Stories"}
        </Link>

        {/* Type badge */}
        <div className="mb-6">
          <span
            className={`inline-block text-[10px] md:text-[11px] font-semibold tracking-widest uppercase px-3 py-1 rounded-full ${isPoem
                ? "bg-[var(--accent-pale)] text-[var(--accent)]"
                : "bg-slate-100 text-slate-500"
              }`}
          >
            {data.type}
          </span>
        </div>

        {/* Title */}
        <h1 className="font-serif text-3xl md:text-5xl font-bold text-[var(--ink)] leading-tight tracking-tight mb-4">
          {data.title}
        </h1>

        {/* Date if available */}
        {data.created_at && (
          <p className="text-sm text-[var(--ink-muted)] mb-10">
            {new Date(data.created_at).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        )}

        {/* Decorative rule */}
        <div className="w-16 h-1 bg-linear-to-r from-[var(--accent)] to-[var(--accent-light)] rounded-full mb-12" />

        {/* Content */}
        <div
          className={`text-[var(--ink-light)] whitespace-pre-line ${isPoem
              ? "font-serif text-lg md:text-xl leading-[2] tracking-wide"
              : "font-sans text-base md:text-lg leading-relaxed"
            }`}
        >
          {data.content}
        </div>
      </article>
    </div>
  )
}