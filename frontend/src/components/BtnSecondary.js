import React from 'react'

const BtnSecondary = ({ children, className = '', ...props }) => {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 text-slate-700 bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-300 text-sm font-medium px-3.5 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400/20 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  )
}

export default BtnSecondary
