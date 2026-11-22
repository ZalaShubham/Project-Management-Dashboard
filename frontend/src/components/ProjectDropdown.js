import React, { useState } from 'react'
import { Popover } from '@headlessui/react'
import axios from 'axios'
import toast from 'react-hot-toast'
import AddProjectModal from './AddProjectModal'

const ProjectDropdown = ({ id, navigate }) => {
  const [isModalOpen, setModalState] = useState(false)

  const handleDelete = async () => {
    try {
      const data = await axios.delete(`http://localhost:9000/project/${id}`)
      if (data.data?.deletedCount > 0) {
        toast.success('Project deleted')
        navigate('/')
        document.dispatchEvent(new CustomEvent('projectUpdate'))
      } else {
        toast.error('Unable to delete project')
      }
    } catch (e) {
      toast.error('Failed to delete project')
    }
  }

  const closeModal = () => setModalState(false)

  return (
    <>
      <Popover className="relative">
        <Popover.Button
          className="w-7 h-7 flex items-center justify-center rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors focus:outline-none"
          aria-label="Project settings"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
          </svg>
        </Popover.Button>

        <Popover.Panel className="absolute z-30 left-0 mt-1">
          <div className="w-40 bg-white rounded-lg border border-slate-200 shadow-dropdown select-none py-1 text-xs">
            <button
              onClick={() => setModalState(true)}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
              </svg>
              Edit project
            </button>
            <div className="my-1 border-t border-slate-100" />
            <button
              onClick={handleDelete}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-red-600 hover:bg-red-50 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
              Delete project
            </button>
          </div>
        </Popover.Panel>
      </Popover>
      <AddProjectModal isModalOpen={isModalOpen} closeModal={closeModal} edit={true} id={id} />
    </>
  )
}

export default ProjectDropdown
