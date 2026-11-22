import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { v4 as uuid } from "uuid";
import AddTaskModal from "./AddTaskModal";
import BtnPrimary from "./BtnPrimary";
import DropdownMenu from "./DropdownMenu";
import { useParams, useNavigate } from "react-router";
import ProjectDropdown from "./ProjectDropdown";
import axios from "axios";
import toast from "react-hot-toast";
import TaskModal from "./TaskModal";

const stageConfig = {
  "Requested": {
    label: "Requested",
    dot: "bg-slate-400",
    headerBadge: "bg-slate-200/70 text-slate-700",
  },
  "To do": {
    label: "To Do",
    dot: "bg-sky-500",
    headerBadge: "bg-sky-100 text-sky-700",
  },
  "In Progress": {
    label: "In Progress",
    dot: "bg-amber-500",
    headerBadge: "bg-amber-100 text-amber-700",
  },
  "Done": {
    label: "Done",
    dot: "bg-emerald-500",
    headerBadge: "bg-emerald-100 text-emerald-700",
  },
};

function Task() {
  const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) return;
    const { source, destination } = result;
    let data = {};
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: { ...sourceColumn, items: sourceItems },
        [destination.droppableId]: { ...destColumn, items: destItems },
      });
      data = {
        ...columns,
        [source.droppableId]: { ...sourceColumn, items: sourceItems },
        [destination.droppableId]: { ...destColumn, items: destItems },
      };
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: { ...column, items: copiedItems },
      });
      data = {
        ...columns,
        [source.droppableId]: { ...column, items: copiedItems },
      };
    }
    updateTodo(data);
  };

  const [isAddTaskModalOpen, setAddTaskModal] = useState(false);
  const [columns, setColumns] = useState({});
  const [isRenderChange, setRenderChange] = useState(false);
  const [isTaskOpen, setTaskOpen] = useState(false);
  const [taskId, setTaskId] = useState(false);
  const [title, setTitle] = useState("");
  const { projectId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAddTaskModalOpen || isRenderChange) {
      axios
        .get(`http://localhost:9000/project/${projectId}`)
        .then((res) => {
          setTitle(res.data[0]?.title || "");
          const taskList = res.data[0]?.task || [];
          setColumns({
            [uuid()]: {
              name: "Requested",
              items: taskList
                .filter((t) => t.stage === "Requested")
                .sort((a, b) => a.order - b.order),
            },
            [uuid()]: {
              name: "To do",
              items: taskList
                .filter((t) => t.stage === "To do")
                .sort((a, b) => a.order - b.order),
            },
            [uuid()]: {
              name: "In Progress",
              items: taskList
                .filter((t) => t.stage === "In Progress")
                .sort((a, b) => a.order - b.order),
            },
            [uuid()]: {
              name: "Done",
              items: taskList
                .filter((t) => t.stage === "Done")
                .sort((a, b) => a.order - b.order),
            },
          });
          setRenderChange(false);
        })
        .catch(() => toast.error("Unable to load project tasks"));
    }
  }, [projectId, isAddTaskModalOpen, isRenderChange]);

  const updateTodo = (data) => {
    axios
      .put(`http://localhost:9000/project/${projectId}/todo`, data)
      .catch(() => toast.error("Unable to update task order"));
  };

  const handleDelete = (e, targetTaskId) => {
    e.stopPropagation();
    axios
      .delete(`http://localhost:9000/project/${projectId}/task/${targetTaskId}`)
      .then(() => {
        toast.success("Task deleted");
        setRenderChange(true);
      })
      .catch(() => toast.error("Unable to delete task"));
  };

  const handleTaskDetails = (id) => {
    setTaskId({ projectId, id });
    setTaskOpen(true);
  };

  const totalTasks = Object.values(columns).reduce(
    (sum, col) => sum + (col.items ? col.items.length : 0),
    0
  );
  const doneTasks =
    Object.values(columns).find((c) => c.name === "Done")?.items?.length || 0;
  const progress =
    totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <div className="p-6 md:p-8 w-full overflow-auto">
      {/* Board Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
              {title || "Project Tasks"}
            </h1>
            <ProjectDropdown id={projectId} navigate={navigate} />
          </div>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
            <span>{totalTasks} {totalTasks === 1 ? "task" : "tasks"}</span>
            <span className="text-slate-300">•</span>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-20 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-slate-800 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="font-mono text-slate-600">{progress}% completed</span>
            </div>
          </div>
        </div>

        <div>
          <BtnPrimary onClick={() => setAddTaskModal(true)}>
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Task
          </BtnPrimary>
        </div>
      </div>

      {/* Kanban Columns */}
      <DragDropContext
        onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
      >
        <div className="flex gap-4 pb-6 overflow-x-auto min-h-[500px]">
          {Object.entries(columns).map(([columnId, column]) => {
            const cfg = stageConfig[column.name] || stageConfig["Requested"];
            return (
              <div
                className="w-72 flex-shrink-0 flex flex-col bg-slate-100/70 border border-slate-200/70 rounded-xl p-2.5"
                key={columnId}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between px-2 py-1.5 mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                      {cfg.label}
                    </h2>
                  </div>
                  <span
                    className={`text-[11px] font-mono font-medium px-2 py-0.5 rounded-full ${cfg.headerBadge}`}
                  >
                    {column.items.length}
                  </span>
                </div>

                {/* Drop Zone */}
                <Droppable droppableId={columnId} key={columnId}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`flex-1 rounded-lg transition-colors p-1 space-y-2.5 min-h-[420px] ${
                        snapshot.isDraggingOver
                          ? "bg-slate-200/50 ring-2 ring-slate-400/30"
                          : ""
                      }`}
                    >
                      {column.items.length === 0 && !snapshot.isDraggingOver && (
                        <div className="flex flex-col items-center justify-center h-32 border border-dashed border-slate-200 rounded-lg text-slate-400">
                          <p className="text-xs font-normal">No tasks</p>
                        </div>
                      )}

                      {column.items.map((item, index) => (
                        <Draggable
                          key={item._id}
                          draggableId={item._id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{ ...provided.draggableProps.style }}
                              onClick={() => handleTaskDetails(item._id)}
                              className={`group select-none bg-white rounded-lg border border-slate-200 p-3 cursor-pointer card-transition shadow-card ${
                                snapshot.isDragging
                                  ? "shadow-modal ring-2 ring-slate-800 scale-102"
                                  : "hover:border-slate-300 hover:shadow-card-hover"
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <h3 className="text-sm font-medium text-slate-800 leading-snug flex-1">
                                  {item.title}
                                </h3>
                                <div onClick={(e) => e.stopPropagation()}>
                                  <DropdownMenu
                                    taskId={item._id}
                                    handleDelete={handleDelete}
                                    projectId={projectId}
                                    setRenderChange={setRenderChange}
                                  />
                                </div>
                              </div>

                              {item.description && item.description.trim() ? (
                                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                                  {item.description}
                                </p>
                              ) : null}

                              <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
                                <span className="text-[10px] font-mono text-slate-400 bg-slate-50 border border-slate-200/60 px-1.5 py-0.5 rounded">
                                  #{item.index}
                                </span>
                                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      <AddTaskModal
        isAddTaskModalOpen={isAddTaskModalOpen}
        setAddTaskModal={setAddTaskModal}
        projectId={projectId}
      />
      <TaskModal isOpen={isTaskOpen} setIsOpen={setTaskOpen} id={taskId} />
    </div>
  );
}

export default Task;
