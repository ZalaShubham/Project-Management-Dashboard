import React from 'react'

const Navbar = () => {
  return (
    <header className="bg-white border-b border-slate-200 h-14 flex items-center justify-between px-5 z-20 sticky top-0">
      {/* Brand & Workspace */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-xs">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M9 3v18" />
            <path d="M15 9h6" />
            <path d="M15 15h6" />
          </svg>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-900 text-sm tracking-tight">TaskFlow</span>
          <span className="text-slate-300">/</span>
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Workspace</span>
        </div>
      </div>

      {/* Center Search / Status hint */}
      <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 bg-slate-50 border border-slate-200/80 rounded-lg px-3 py-1.5 w-64 justify-between">
        <span className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="8" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
          </svg>
          Quick search...
        </span>
        <kbd className="font-mono text-[10px] bg-white border border-slate-200 rounded px-1.5 py-0.5 text-slate-500">⌘K</kbd>
      </div>

    </header>
  )
}

export default Navbar
