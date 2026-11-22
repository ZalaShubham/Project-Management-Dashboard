import React, { useState } from "react";
import AppLayout from "./components/AppLayout";
import { Routes, Route } from "react-router-dom";
import Task from "./components/Task";
import AddProjectModal from "./components/AddProjectModal";
import { Toaster } from "react-hot-toast";

function App() {
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);

  return (
    <AppLayout>
      <Toaster
        position="top-right"
        gutter={8}
        toastOptions={{
          style: {
            borderRadius: '8px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
            padding: '10px 14px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            border: '1px solid #e2e8f0',
            color: '#1e293b',
          },
          success: {
            iconTheme: { primary: '#0f172a', secondary: '#ffffff' },
          },
        }}
      />
      <Routes>
        <Route path="/:projectId" element={<Task />} />
        <Route
          path="/"
          element={
            <div className="flex flex-col items-center justify-center w-full h-full text-center px-6 py-12">
              <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 mb-4 shadow-xs">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25A2.25 2.25 0 018.25 10.5H6A2.25 2.25 0 013.75 8.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-slate-800 mb-1">
                Select a project
              </h2>
              <p className="text-slate-500 text-xs max-w-sm leading-relaxed mb-6">
                Choose a project from the sidebar to view and manage its tasks, or create a new project to start organizing.
              </p>
              <button
                onClick={() => setIsNewProjectModalOpen(true)}
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors shadow-xs"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Create Project
              </button>
              <AddProjectModal
                isModalOpen={isNewProjectModalOpen}
                closeModal={() => setIsNewProjectModalOpen(false)}
              />
            </div>
          }
        />
      </Routes>
    </AppLayout>
  );
}

export default App;
