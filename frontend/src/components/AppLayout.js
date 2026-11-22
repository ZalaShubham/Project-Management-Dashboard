import React from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

const AppLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      <div className="flex flex-1" style={{ height: 'calc(100vh - 56px)' }}>
        <div className="w-60 flex-shrink-0">
          <Sidebar />
        </div>
        <main className="flex-1 overflow-auto bg-slate-50">
          <div className="h-full flex">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default AppLayout
