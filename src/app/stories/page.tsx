import { supabase } from "@/lib/supabase"
import PostCard from "@/components/PostCard"
import Navbar from "@/components/NavBar"

export const metadata = {
  title: "Stories — Raghav's Quill",
  description: "Browse original short stories and prose.",
}

export const revalidate = 0

export default async function Stories() {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("type", "story")
    .order("created_at", { ascending: false })

  const stories = data ?? []

  return (
    <div className="min-h-screen bg-[var(--cream)]">
      <Navbar />

      <main className="container-custom py-12 md:py-16">
        {/* Page header */}
        <div className="mb-10 md:mb-12">
          <span className="inline-block text-[10px] md:text-[11px] font-semibold tracking-widest uppercase px-3 py-1 rounded-full bg-slate-100 text-slate-500 mb-4">
            Stories
          </span>

          <h1 className="font-serif text-3xl md:text-5xl font-bold text-[var(--ink)] tracking-tight leading-tight">
            Stories
          </h1>
          <p className="text-sm md:text-base text-[var(--ink-muted)] mt-3">
            {stories.length} {stories.length === 1 ? "story" : "stories"} written
          </p>
        </div>

        {/* Post list */}
        {error ? (
          <div className="p-8 bg-red-50 border border-red-200 rounded-2xl text-red-600">
            Could not load stories. Please check your Supabase configuration.
          </div>
        ) : stories.length === 0 ? (
          <div className="text-center py-24 px-6 text-[var(--ink-muted)]">
            <p className="font-serif text-2xl mb-2">No stories yet.</p>
            <p className="text-sm">Check back soon for new writings.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8">
            {stories.map((post: { id: string; title: string; content: string; type: string; created_at?: string }) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}