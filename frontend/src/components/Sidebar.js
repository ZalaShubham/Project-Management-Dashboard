import React, { useCallback, useEffect, useState } from 'react'
import AddProjectModal from './AddProjectModal'
import axios from 'axios'
import { Link, useLocation } from 'react-router-dom'

const dotColors = [
  'bg-blue-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-indigo-500',
  'bg-purple-500',
  'bg-rose-500',
]

const Sidebar = () => {
  const [isModalOpen, setModalState] = useState(false)
  const [projects, setProjects] = useState([])
  const location = useLocation()
  const activeProjectId = location.pathname.slice(1)

  const openModal = useCallback(() => setModalState(true), [])
  const closeModal = useCallback(() => setModalState(false), [])

  const fetchProjects = () => {
    axios.get('http://localhost:9000/projects/')
      .then((res) => setProjects(res.data))
      .catch(() => {})
  }

  useEffect(() => {
    fetchProjects()
    const handleUpdate = () => fetchProjects()
    document.addEventListener('projectUpdate', handleUpdate)
    return () => document.removeEventListener('projectUpdate', handleUpdate)
  }, [])

  return (
    <aside className="h-full bg-white border-r border-slate-200 flex flex-col justify-between select-none">
      <div className="flex flex-col flex-1 overflow-hidden py-4">
        {/* Projects header */}
        <div className="px-4 mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Projects</span>
            <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
              {projects.length}
            </span>
          </div>
          <button
            onClick={openModal}
            title="Create new project"
            className="w-6 h-6 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors focus:outline-none"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        </div>

        {/* Project list */}
        <div className="flex-1 overflow-y-auto px-2 space-y-0.5">
          {projects.length === 0 ? (
            <div className="text-center py-8 px-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                </svg>
              </div>
              <p className="text-xs text-slate-500 font-medium">No projects yet</p>
              <p className="text-[11px] text-slate-400 mt-1">Create one to begin tracking tasks.</p>
              <button
                onClick={openModal}
                className="mt-3 text-xs text-slate-800 font-medium underline hover:text-slate-900"
              >
                + Add Project
              </button>
            </div>
          ) : (
            projects.map((project, index) => {
              const isActive = activeProjectId === project._id
              const dotColor = dotColors[index % dotColors.length]
              return (
                <Link key={project._id || index} to={project._id}>
                  <div
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer group ${
                      isActive
                        ? 'bg-slate-100 text-slate-900 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dotColor}`} />
                    <span className="truncate flex-1">{project.title}</span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-800 flex-shrink-0" />
                    )}
                  </div>
                </Link>
              )
            })
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-slate-100">
        <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
          <span>TaskFlow</span>
          <span>v1.0</span>
        </div>
      </div>

      <AddProjectModal isModalOpen={isModalOpen} closeModal={closeModal} />
    </aside>
  )
}

export default Sidebar
