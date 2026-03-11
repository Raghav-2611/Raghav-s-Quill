"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const pathname = usePathname()

  const links = [
    { href: "/", label: "Home" },
    { href: "/poems", label: "Poems" },
    { href: "/stories", label: "Stories" },
  ]

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(250, 248, 244, 0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)",
        padding: "0 2rem",
      }}
    >
      <div
        style={{
          maxWidth: "1024px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "70px",
        }}
      >
        {/* Logo */}
        <Link href="/">
          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.5rem",
              fontWeight: 700,
              background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-light) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-0.02em",
            }}
          >
            Raghav's Quill
          </span>
        </Link>

        {/* Nav Links */}
        <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
          {links.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "0.9rem",
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? "var(--accent)" : "var(--ink-light)",
                  borderBottom: isActive ? "2px solid var(--accent)" : "2px solid transparent",
                  paddingBottom: "2px",
                  transition: "all 0.2s ease",
                  letterSpacing: "0.01em",
                }}
              >
                {link.label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}