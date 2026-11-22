import React from 'react'

const BtnPrimary = ({ children, className = '', ...props }) => {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 text-white bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-sm font-medium px-3.5 py-2 rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  )
}

export default BtnPrimary
