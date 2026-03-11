"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

export default function Navbar() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const links = [
    { href: "/", label: "Home" },
    { href: "/poems", label: "Poems" },
    { href: "/stories", label: "Stories" },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-[rgba(250,248,244,0.85)] backdrop-blur-md border-b border-[var(--border)] px-6 md:px-8">
      <div className="max-w-5xl mx-auto flex items-center justify-between h-[70px]">
        {/* Logo */}
        <Link href="/" className="z-50">
          <span className="font-serif text-2xl font-bold bg-linear-to-br from-[var(--accent)] to-[var(--accent-light)] bg-clip-text text-transparent tracking-tight">
            Raghav's Quill
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex gap-8 items-center">
          {links.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-sans text-sm tracking-wide transition-all duration-200 border-b-2 pb-0.5 ${isActive
                    ? "font-semibold text-[var(--accent)] border-[var(--accent)]"
                    : "font-normal text-[var(--ink-light)] border-transparent hover:text-[var(--accent)]"
                  }`}
              >
                {link.label}
              </Link>
            )
          })}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden z-50 p-2 text-[var(--ink)]"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <div className="w-6 h-5 relative flex flex-col justify-between">
            <span className={`w-full h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? "rotate-45 translate-y-2.5" : ""}`} />
            <span className={`w-full h-0.5 bg-current transition-opacity duration-300 ${isMenuOpen ? "opacity-0" : ""}`} />
            <span className={`w-full h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-2.5" : ""}`} />
          </div>
        </button>

        {/* Mobile Menu Overlay */}
        <div className={`fixed inset-0 bg-[var(--cream)] z-40 flex flex-col items-center justify-center gap-8 transition-transform duration-500 ease-in-out md:hidden ${isMenuOpen ? "translate-y-0" : "-translate-y-full"}`}>
          {links.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`font-serif text-3xl transition-colors ${isActive ? "text-[var(--accent)]" : "text-[var(--ink)]"
                  }`}
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