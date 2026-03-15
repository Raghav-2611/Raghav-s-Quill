import type { Metadata } from "next"
import "./globals.css"
import IntroAnimation from "@/components/IntroAnimation"

export const metadata: Metadata = {
  title: "Raghav's Quill - Feed of Thoughts",
  description: "Brewing Words like how I imagine them",
  keywords: ["poems", "stories", "creative writing", "poetry"],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <IntroAnimation />
        <main className="min-h-screen">
          {children}
        </main>
        <footer
          style={{
            borderTop: "1px solid var(--border)",
            padding: "2rem",
            textAlign: "center",
            color: "var(--ink-muted)",
            fontSize: "0.85rem",
            fontFamily: "Inter, sans-serif",
            marginTop: "5rem",
          }}
        >
          © {new Date().getFullYear()} Raghav's Quill · All rights reserved
        </footer>
      </body>
    </html>
  )
}
