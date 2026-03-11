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
    <div className="min-h-screen bg-[var(--cream)]">
      <Navbar />

      <main className="container-custom py-12 md:py-16">
        {/* Page header */}
        <div className="mb-10 md:mb-12">
          <span className="inline-block text-[10px] md:text-[11px] font-semibold tracking-widest uppercase px-3 py-1 rounded-full bg-[var(--accent-pale)] text-[var(--accent)] mb-4">
            Poetry
          </span>

          <h1 className="font-serif text-3xl md:text-5xl font-bold text-[var(--ink)] tracking-tight leading-tight">
            Poems
          </h1>
          <p className="text-sm md:text-base text-[var(--ink-muted)] mt-3">
            {poems.length} {poems.length === 1 ? "poem" : "poems"} written
          </p>
        </div>

        {/* Post list */}
        {error ? (
          <div className="p-8 bg-red-50 border border-red-200 rounded-2xl text-red-600">
            Could not load poems. Please check your Supabase configuration.
          </div>
        ) : poems.length === 0 ? (
          <div className="text-center py-24 px-6 text-[var(--ink-muted)]">
            <p className="font-serif text-2xl mb-2">No poems yet.</p>
            <p className="text-sm">Check back soon for new writings.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8">
            {poems.map((post: { id: string; title: string; content: string; type: string; created_at?: string }) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}