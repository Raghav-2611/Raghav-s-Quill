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
    <div className="min-h-screen bg-[var(--cream)]">
      <Navbar />

      <main>
        {/* Hero */}
        <section className="max-w-3xl mx-auto px-6 pt-16 pb-12 md:pt-24 md:pb-16 text-center animate-fade-up">
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-[var(--ink)] leading-[1.1] tracking-tight mb-6">
            Reed of Thoughts
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-[var(--ink-muted)] max-w-md mx-auto mb-10 leading-relaxed font-light">
            Brewing Words like how I imagine them
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/poems">
              <button className="px-8 py-3 rounded-full bg-linear-to-br from-[var(--accent)] to-[var(--accent-light)] text-white font-semibold text-sm tracking-wide shadow-lg shadow-[var(--shadow)] hover:opacity-90 transition-opacity active:scale-95">
                Read Poems
              </button>
            </Link>
            <Link href="/stories">
              <button className="px-8 py-3 rounded-full border-2 border-[var(--accent-light)] text-[var(--accent)] font-semibold text-sm tracking-wide hover:bg-[var(--accent-pale)] transition-colors active:scale-95">
                Read Stories
              </button>
            </Link>
          </div>
        </section>

        {/* Divider */}
        <div className="max-w-[800px] mx-auto px-8 flex items-center gap-4 opacity-50">
          <div className="flex-1 h-px bg-[var(--border)]" />
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-light)]" />
          <div className="flex-1 h-px bg-[var(--border)]" />
        </div>

        {/* Recent Posts */}
        {recentPosts && recentPosts.length > 0 && (
          <section className="container-custom py-12 md:py-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-2xl md:text-3xl font-semibold text-[var(--ink)]">
                Recent Posts
              </h2>
              <Link href="/poems" className="text-sm font-medium text-[var(--accent)] hover:underline">
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8">
              {recentPosts.map((post: { id: string; title: string; content: string; type: string; created_at?: string }) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}