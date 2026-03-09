import React from "react";
import TaskCard from "./TaskCard";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";

const KanbanBoard = ({ tasks, onEdit, onDelete }) => {
  const handleDragEnd = (result) => {
    console.log("Drag", result);
  };
  const todoTasks = tasks.filter((task) => task.status === "To Do");
  const inProgressTasks = tasks.filter((task) => task.status === "In Progress");
  const doneTasks = tasks.filter((task) => task.status === "Done");
  const renderTaskCard = (task, index) => (
    <Draggable key={task._id} draggableId={task._id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="mb-3"
        >
          <TaskCard
            key={task._id}
            task={task}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        </div>
      )}
    </Draggable>
  );
  return (
    <DragDropContext
      onDragEnd={handleDragEnd}
      className="p-6 bg-gray-50 min-h-screen"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* --- To Do --- */}
        <div className="bg-gray-100 p-4 rounded-xl">
          <h2 className="text-lg font-bold mb-4 text-gray-700 flex items-center justify-between">
            To Do 📋
            <span className="bg-gray-200 text-gray-600 text-xs py-1 px-2 rounded-full">
              {todoTasks.length}
            </span>
          </h2>
          <div className="flex flex-col">
            <Droppable droppableId="To Do">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="min-h-[200px]"
                >
                  {todoTasks.length > 0 ? (
                    todoTasks.map((task, index) => renderTaskCard(task, index))
                  ) : (
                    <p className="text-sm text-gray-500">No tasks here.</p>
                  )}

                  {/* required by the library to make space when dragging */}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </div>

        {/* --- In Progress --- */}
        <div className="bg-gray-100 p-4 rounded-xl">
          <h2 className="text-lg font-bold mb-4 text-blue-600 flex items-center justify-between">
            In Progress ⏳
            <span className="bg-blue-100 text-blue-600 text-xs py-1 px-2 rounded-full">
              {inProgressTasks.length}
            </span>
          </h2>
          <div className="flex flex-col">
            <Droppable droppableId="In Progress">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="min-h-[200px]"
                >
                  {inProgressTasks.length > 0 ? (
                    inProgressTasks.map((inProgress, idex) =>
                      renderTaskCard(inProgress, idex),
                    )
                  ) : (
                    <p className="text-sm text-gray-500"> no progress task</p>
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </div>

        {/* --- Done --- */}
        <div className="bg-gray-100 p-4 rounded-xl">
          <h2 className="text-lg font-bold mb-4 text-green-600 flex items-center justify-between">
            Done ✅
            <span className="bg-green-100 text-green-600 text-xs py-1 px-2 rounded-full">
              {doneTasks.length}
            </span>
          </h2>
          <div className="flex flex-col">
            <Droppable droppableId="Done">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="min-h-[200px]"
                >
                  {doneTasks.length > 0 ? (
                    doneTasks.map((done, idex) => renderTaskCard(done, idex))
                  ) : (
                    <p className="text-sm text-gray-500">No tasks here.</p>
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </div>
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
