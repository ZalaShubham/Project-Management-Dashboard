import React, { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import axios from 'axios'
import toast from 'react-hot-toast'

const stageStyles = {
  'Requested': {
    badge: 'bg-slate-100 text-slate-700 border-slate-200',
    dot: 'bg-slate-400',
  },
  'To do': {
    badge: 'bg-sky-50 text-sky-700 border-sky-200',
    dot: 'bg-sky-500',
  },
  'In Progress': {
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
  },
  'Done': {
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
  },
}

const TaskModal = ({ isOpen, setIsOpen, id }) => {
  const [taskData, setTaskData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOpen && id?.projectId && id?.id) {
      setIsLoading(true)
      axios.get(`http://localhost:9000/project/${id.projectId}/task/${id.id}`)
        .then((data) => {
          setTaskData(data.data[0]?.task[0] || null)
        })
        .catch(() => toast.error('Unable to load task details'))
        .finally(() => setIsLoading(false))
    } else {
      setTaskData(null)
    }
  }, [isOpen, id])

  const stage = taskData?.stage || 'Requested'
  const style = stageStyles[stage] || stageStyles['Requested']

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-150"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4 md:p-6">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-150"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-100"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="bg-white rounded-xl shadow-modal border border-slate-200 w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-medium text-slate-400">
                    {taskData?.index ? `#${taskData.index}` : 'Task'}
                  </span>
                  <span className="text-slate-200">•</span>
                  <Dialog.Title as="h2" className="text-sm font-semibold text-slate-800">
                    Task Details
                  </Dialog.Title>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 w-8 h-8 rounded-lg flex items-center justify-center transition-colors focus:outline-none"
                  aria-label="Close dialog"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Body */}
              <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
                {/* Main Content */}
                <div className="flex-1 px-6 py-5 overflow-y-auto">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-48 text-slate-400 text-xs">
                      Loading task details...
                    </div>
                  ) : taskData ? (
                    <div className="space-y-5">
                      <div>
                        <h1 className="text-xl font-semibold text-slate-900 leading-snug">
                          {taskData.title}
                        </h1>
                      </div>

                      <div>
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                          Description
                        </h3>
                        {taskData.description && taskData.description.trim() ? (
                          <div className="bg-slate-50/80 rounded-lg p-3.5 border border-slate-200/80">
                            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                              {taskData.description}
                            </p>
                          </div>
                        ) : (
                          <div className="bg-slate-50/50 rounded-lg p-3.5 border border-dashed border-slate-200">
                            <p className="text-xs text-slate-400 italic">No description provided for this task.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-400 py-6 text-center">
                      No task information available.
                    </div>
                  )}
                </div>

                {/* Sidebar Details */}
                <div className="w-full md:w-56 border-t md:border-t-0 md:border-l border-slate-100 py-5 px-5 flex-shrink-0 bg-slate-50/40">
                  <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-3">
                    Properties
                  </h3>
                  <div className="space-y-3.5 text-xs">
                    <div>
                      <span className="text-slate-400 block mb-1">Status</span>
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-md border ${style.badge}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                        {stage}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block mb-1">Task ID</span>
                      <span className="font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        #{taskData?.index || '—'}
                      </span>
                    </div>

                    {taskData?.created_at && (
                      <div>
                        <span className="text-slate-400 block mb-1">Created</span>
                        <span className="text-slate-600 text-[11px]">
                          {new Date(taskData.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}

export default TaskModal
