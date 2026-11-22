import React, { Fragment, memo, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import BtnPrimary from './BtnPrimary'
import BtnSecondary from './BtnSecondary'
import axios from 'axios'
import toast from 'react-hot-toast'

const AddProjectModal = ({ isModalOpen, closeModal, edit = false, id = null }) => {
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (edit && isModalOpen && id) {
      axios.get(`http://localhost:9000/project/${id}`)
        .then((res) => {
          setTitle(res.data[0]?.title || '')
          setDesc(res.data[0]?.description || '')
        })
        .catch(() => toast.error('Unable to load project details'))
    } else if (!isModalOpen) {
      setTitle('')
      setDesc('')
    }
  }, [edit, id, isModalOpen])

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (!edit) {
      axios.post('http://localhost:9000/project/', { title: title.trim(), description: desc.trim() })
        .then((res) => {
          closeModal()
          document.dispatchEvent(new CustomEvent('projectUpdate', { detail: { ...res.data } }))
          toast.success('Project created')
          setTitle('')
          setDesc('')
        })
        .catch((error) => {
          if (error.response?.status === 422) {
            toast.error(error.response.data?.details?.[0]?.message || 'Please check project details')
          } else {
            toast.error('Failed to create project')
          }
        })
        .finally(() => setIsSubmitting(false))
    } else {
      axios.put(`http://localhost:9000/project/${id}`, { title: title.trim(), description: desc.trim() })
        .then((res) => {
          closeModal()
          document.dispatchEvent(new CustomEvent('projectUpdate', { detail: { ...res.data } }))
          toast.success('Project updated')
          setTitle('')
          setDesc('')
        })
        .catch((error) => {
          if (error.response?.status === 422) {
            toast.error(error.response.data?.details?.[0]?.message || 'Please check project details')
          } else {
            toast.error('Failed to update project')
          }
        })
        .finally(() => setIsSubmitting(false))
    }
  }

  return (
    <Transition appear show={isModalOpen} as={Fragment}>
      <Dialog as="div" open={isModalOpen} onClose={() => closeModal()} className="relative z-50">
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

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-150"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-100"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="bg-white rounded-xl shadow-modal border border-slate-200 w-full max-w-lg overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <Dialog.Title as="h2" className="text-base font-semibold text-slate-900">
                    {edit ? 'Edit Project' : 'Create Project'}
                  </Dialog.Title>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {edit ? 'Update project settings and details.' : 'Create a new project workspace to organize your tasks.'}
                  </p>
                </div>
                <button
                  onClick={() => closeModal()}
                  className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 w-8 h-8 rounded-lg flex items-center justify-center transition-colors focus:outline-none"
                  aria-label="Close dialog"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="title" className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                      Project Name <span className="text-red-500">*</span>
                    </label>
                  </div>
                  <input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    type="text"
                    className="w-full border border-slate-300 rounded-lg text-sm py-2 px-3 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none transition-all placeholder:text-slate-400 bg-white"
                    placeholder="e.g. Website Redesign"
                    required
                    autoFocus
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="description" className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                      Description
                    </label>
                    <span className="text-xs text-slate-400 font-normal bg-slate-100 px-2 py-0.5 rounded-full">
                      Optional
                    </span>
                  </div>
                  <textarea
                    id="description"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg text-sm py-2 px-3 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none transition-all placeholder:text-slate-400 bg-white resize-none"
                    rows="4"
                    placeholder="Brief summary or scope of this project (optional)..."
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
                  <BtnSecondary type="button" onClick={() => closeModal()}>
                    Cancel
                  </BtnSecondary>
                  <BtnPrimary type="submit" disabled={isSubmitting || !title.trim()}>
                    {isSubmitting ? 'Saving...' : edit ? 'Save Changes' : 'Create Project'}
                  </BtnPrimary>
                </div>
              </form>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}

export default memo(AddProjectModal)
