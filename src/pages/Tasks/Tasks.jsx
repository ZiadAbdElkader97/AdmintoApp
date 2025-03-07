import "./Tasks.css";
import Modal from "react-modal";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  FaPlus,
  FaSearch,
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { useContext } from "react";
import { TasksContext } from "../../context/TasksContext";

export default function Tasks() {
  const {
    inputRef,
    searchTerm,
    setSearchTerm,
    modalIsOpen,
    setModalIsOpen,
    selectedTasks,
    contextMenu,
    groups,
    setGroups,
    showDeletePopup,
    setShowDeletePopup,
    showDeletedMessage,
    setShowDeletedMessage,
    showGroupDeletePopup,
    setShowGroupDeletePopup,
    showGroupDeletedMessage,
    setShowGroupDeletedMessage,
    expandedGroups,
    handleTaskSelection,
    toggleSelectAll,
    addTask,
    confirmDeleteTask,
    undoDeleteLast,
    deletedItemType,
    confirmDeleteGroup,
    undoDeleteGroup,
    addGroup,
    handleDragEnd,
    updateGroupName,
    toggleGroup,
    contextMenuOptions,
    handleContextMenu,
    handleTaskNameChange,
  } = useContext(TasksContext);

  return (
    <div className="container">
      <div className="tasks">
        <div className="tasks-container">
          <div className="tasks-header">
            <button
              className="add_task"
              onClick={() => addTask(groups[0].name)}
            >
              <i>
                <FaPlus />
              </i>
              <p>New Task</p>
            </button>
            <div className="search_icon" onClick={() => setModalIsOpen(true)}>
              <FaSearch />
            </div>
          </div>

          <Modal
            isOpen={modalIsOpen}
            onRequestClose={() => setModalIsOpen(false)}
            className="modal"
          >
            <h2>Search Tasks</h2>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={() => setModalIsOpen(false)}>Close</button>
          </Modal>

          <DragDropContext onDragEnd={handleDragEnd}>
            {/* Droppable الرئيسي للمجموعات */}
            <Droppable droppableId="all-groups" type="group">
              {(provided) => (
                <div
                  className="groups_container"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {groups.map((group, index) => (
                    <Draggable
                      key={`group-${group.name}`}
                      draggableId={`group-${group.name}`}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="group"
                        >
                          <div
                            className="group-header"
                            {...provided.dragHandleProps} // ✅ يسمح بسحب المجموعة
                            onContextMenu={(e) =>
                              handleContextMenu(e, "group", null, group.name)
                            }
                          >
                            <i
                              className="toggle_btn"
                              onClick={() => toggleGroup(group.name)}
                            >
                              {expandedGroups[group.name] ? (
                                <FaChevronDown />
                              ) : (
                                <FaChevronRight />
                              )}
                            </i>

                            <input
                              type="text"
                              defaultValue={group.name}
                              ref={inputRef}
                              className="group-name-input"
                              onBlur={(e) =>
                                updateGroupName(index, e.target.value)
                              }
                              onMouseDown={(e) => e.stopPropagation()}
                            />
                          </div>

                          {/* Droppable للمهام داخل كل مجموعة */}
                          {expandedGroups[group.name] && (
                            <Droppable
                              droppableId={`group-${group.name}`}
                              type="task"
                            >
                              {(provided) => (
                                <table
                                  className="tasks-table"
                                  ref={provided.innerRef}
                                  {...provided.droppableProps}
                                >
                                  <thead>
                                    <tr>
                                      <th>
                                        <input
                                          type="checkbox"
                                          checked={
                                            group.tasks?.length > 0 &&
                                            group.tasks.every((task) =>
                                              selectedTasks.has(
                                                `${group.name}-${task.id}`
                                              )
                                            )
                                          }
                                          onChange={() =>
                                            toggleSelectAll(group.name)
                                          }
                                        />
                                      </th>
                                      {Array.isArray(group.columns) ? (
                                        group.columns
                                          .slice(1)
                                          .map((col, colIndex) => (
                                            <th key={colIndex}>{col}</th>
                                          ))
                                      ) : (
                                        <th>No Columns</th>
                                      )}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {group.tasks.map((task, taskIndex) => (
                                      <Draggable
                                      key={`task-${String(task.id)}-${taskIndex}`}
                                      draggableId={`task-${String(task.id)}`}
                                        index={taskIndex}
                                      >
                                        {(provided) => (
                                          <tr
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            onContextMenu={(e) =>
                                              handleContextMenu(
                                                e,
                                                "task",
                                                task.id,
                                                group.name
                                              )
                                            }
                                            className={
                                              selectedTasks.has(
                                                `${group.name}-${task.id}`
                                              )
                                                ? "selected_row"
                                                : ""
                                            }
                                          >
                                            <td>
                                              <input
                                                type="checkbox"
                                                checked={selectedTasks.has(
                                                  `${group.name}-${task.id}`
                                                )}
                                                onChange={() =>
                                                  handleTaskSelection(
                                                    task.id,
                                                    group.name
                                                  )
                                                }
                                              />
                                            </td>
                                            <td>
                                              <input
                                                type="text"
                                                value={task.name ?? ""}
                                                onChange={(e) =>
                                                  handleTaskNameChange(
                                                    e,
                                                    task.id
                                                  )
                                                }
                                              />
                                            </td>
                                            {group.columns
                                              .slice(2)
                                              .map((col, colIndex) => (
                                                <td key={colIndex}>
                                                  <input
                                                    type="text"
                                                    value={
                                                      task.data?.[col] || ""
                                                    }
                                                    onChange={(e) => {
                                                      setGroups(
                                                        (prevGroups) => {
                                                          return prevGroups.map(
                                                            (g) =>
                                                              g.name ===
                                                              group.name
                                                                ? {
                                                                    ...g,
                                                                    tasks:
                                                                      g.tasks.map(
                                                                        (t) =>
                                                                          t.id ===
                                                                          task.id
                                                                            ? {
                                                                                ...t,
                                                                                data: {
                                                                                  ...t.data,
                                                                                  [col]:
                                                                                    e
                                                                                      .target
                                                                                      .value,
                                                                                },
                                                                              }
                                                                            : t
                                                                      ),
                                                                  }
                                                                : g
                                                          );
                                                        }
                                                      );
                                                    }}
                                                  />
                                                </td>
                                              ))}
                                          </tr>
                                        )}
                                      </Draggable>
                                    ))}
                                    {provided.placeholder}
                                  </tbody>
                                </table>
                              )}
                            </Droppable>
                          )}

                          <button
                            className="add_task"
                            onClick={() => addTask(group.name)}
                          >
                            Add Task
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}

                  <button className="add_group" onClick={addGroup}>
                    <FaPlus /> Add Group
                  </button>
                </div>
              )}
            </Droppable>
          </DragDropContext>

          {contextMenu && (
            <div
              className="context-menu"
              style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
            >
              {contextMenuOptions}
            </div>
          )}

          {/* Popup تأكيد الحذف */}
          {showDeletePopup && (
            <div className="popup-overlay">
              <div className="popup delete-popup">
                <h3>Delete this task?</h3>
                <p className="delete-popup-p">
                  We will keep it in your trash for 30 days, and then
                  permanently delete it.
                </p>
                <div className="delete-button popup-buttons">
                  <button
                    className="cancel-btn"
                    onClick={() => setShowDeletePopup(false)}
                  >
                    Cancel
                  </button>
                  <button className="delete-btn" onClick={confirmDeleteTask}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* إشعار الحذف مع Undo */}
          {showDeletedMessage && (
            <div className="popup success-popup">
              <p>
                {deletedItemType === "Task"
                  ? "We successfully deleted the Task"
                  : "We successfully deleted the Group"}
              </p>
              <div className="success-btn popup-buttons">
                <button className="undo-btn" onClick={undoDeleteLast}>
                  Undo
                </button>
                <button
                  className="close-btn"
                  onClick={() => setShowDeletedMessage(null)}
                >
                  <i>
                    <IoMdClose />
                  </i>
                </button>
              </div>
            </div>
          )}

          {/* Popup تأكيد حذف المجموعة */}
          {showGroupDeletePopup && (
            <div className="popup-overlay">
              <div className="popup delete-popup">
                <h3>Delete this group?</h3>
                <p className="delete-popup-p">
                  We will keep it in your trash for 30 days, and then
                  permanently delete it.
                </p>
                <div className="delete-button popup-buttons">
                  <button
                    className="cancel-btn"
                    onClick={() => setShowGroupDeletePopup(false)}
                  >
                    Cancel
                  </button>
                  <button className="delete-btn" onClick={confirmDeleteGroup}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* إشعار حذف المجموعة مع تأثير ناعم */}
          {showGroupDeletedMessage && (
            <div
              className={`popup success-popup ${
                showGroupDeletedMessage ? "show" : ""
              }`}
            >
              <p>We successfully deleted the Group</p>
              <div className="popup-buttons">
                <button className="undo-btn" onClick={undoDeleteGroup}>
                  Undo
                </button>
                <button
                  className="close-btn"
                  onClick={() => setShowGroupDeletedMessage(false)}
                >
                  <i>
                    <IoMdClose />
                  </i>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
