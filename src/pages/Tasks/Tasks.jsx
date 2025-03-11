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
    columns,
    updateTaskField,
    hiddenColumns,
    hideColumn,
    restoreColumn,
    startResizing,
    handleColumnContextMenu,
    showHiddenColumnsMenu,
  } = useContext(TasksContext);

  return (
    <div className="container">
      <div className="tasks">
        <div className="tasks-container">
          <div className="tasks-header">
            <button
              className="add_task"
              onClick={() => groups.length > 0 && addTask(groups[0].name)}
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
                            <Droppable droppableId={group.name} type="task">
                              {(provided) => (
                                <div className="table-container">
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
                                              group.tasks.length > 0 &&
                                              group.tasks.every((task) =>
                                                selectedTasks.has(task.id)
                                              )
                                            }
                                            onChange={() =>
                                              toggleSelectAll(group.name)
                                            }
                                          />
                                        </th>
                                        {columns
                                          .filter((col) => col.visible)
                                          .map((col, colIndex) => (
                                            <th
                                              key={colIndex}
                                              style={{ width: col.width }}
                                              onContextMenu={(e) =>
                                                handleColumnContextMenu(
                                                  e,
                                                  col.id
                                                )
                                              }
                                            >
                                              {col.name}
                                              <div
                                                className="resizer"
                                                onMouseDown={(e) =>
                                                  startResizing(e, col.id)
                                                }
                                              />
                                            </th>
                                          ))}
                                        {/* ✅ زر "إضافة عمود" */}
                                          <th
                                            onClick={showHiddenColumnsMenu}
                                            className="add_column"
                                          >
                                            +
                                          </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {group.tasks.map((task, taskIndex) => (
                                        <Draggable
                                          key={`task-${task.id}`}
                                          draggableId={`task-${task.id}`}
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
                                                selectedTasks.has(task.id)
                                                  ? "selected_row"
                                                  : ""
                                              }
                                            >
                                              {/* ✅ Checkbox لتحديد المهمة */}
                                              <td>
                                                <input
                                                  type="checkbox"
                                                  checked={selectedTasks.has(
                                                    task.id
                                                  )}
                                                  onChange={() =>
                                                    handleTaskSelection(
                                                      task.id,
                                                      group.name
                                                    )
                                                  }
                                                />
                                              </td>
                                              {/* ✅ تخصيص نوع الإدخال لكل عمود */}
                                              {columns
                                                .filter(
                                                  (col, index, self) =>
                                                    index ===
                                                      self.findIndex(
                                                        (c) => c.id === col.id
                                                      ) && col.visible
                                                )
                                                .map((col, colIndex) => (
                                                  <td
                                                    key={colIndex}
                                                    style={{ width: col.width }}
                                                  >
                                                    {col.id === "task" ||
                                                    col.id === "notes" ||
                                                    col.id === "dependent" ? (
                                                      // ✅ إدخال نصي عادي
                                                      <input
                                                        className="custom_text"
                                                        type="text"
                                                        value={
                                                          task[col.id] || ""
                                                        }
                                                        placeholder={
                                                          col.id === "notes"
                                                            ? "Add notes..."
                                                            : "Enter dependency..."
                                                        }
                                                        onChange={(e) =>
                                                          updateTaskField(
                                                            task.id,
                                                            col.id,
                                                            e.target.value
                                                          )
                                                        }
                                                      />
                                                    ) : col.id === "date" ||
                                                      col.id === "timeline" ||
                                                      col.id === "updated" ? (
                                                      // ✅ إدخال تاريخ (Date)
                                                      <input
                                                        type="date"
                                                        value={
                                                          task[col.id] || ""
                                                        }
                                                        onChange={(e) =>
                                                          updateTaskField(
                                                            task.id,
                                                            col.id,
                                                            e.target.value
                                                          )
                                                        }
                                                      />
                                                    ) : col.id ===
                                                      "priority" ? (
                                                      // ✅ قائمة منسدلة (Dropdown) لـ Priority
                                                      <select
                                                        className="custom_select"
                                                        value={task[col.id]}
                                                        onChange={(e) =>
                                                          updateTaskField(
                                                            task.id,
                                                            col.id,
                                                            e.target.value
                                                          )
                                                        }
                                                      >
                                                        <option value="High">
                                                          High
                                                        </option>
                                                        <option value="Medium">
                                                          Medium
                                                        </option>
                                                        <option value="Low">
                                                          Low
                                                        </option>
                                                      </select>
                                                    ) : col.id === "status" ? (
                                                      // ✅ قائمة منسدلة (Dropdown)
                                                      <select
                                                        className="custom_select"
                                                        value={task[col.id]}
                                                        onChange={(e) =>
                                                          updateTaskField(
                                                            task.id,
                                                            col.id,
                                                            e.target.value
                                                          )
                                                        }
                                                      >
                                                        <option value="To Do">
                                                          To Do
                                                        </option>
                                                        <option value="Doing">
                                                          Doing
                                                        </option>
                                                        <option value="Done">
                                                          Done
                                                        </option>
                                                      </select>
                                                    ) : col.id ===
                                                      "progress" ? (
                                                      // ✅ شريط تقدم (Range) من 0% إلى 100%
                                                      <input
                                                        type="range"
                                                        min="0"
                                                        max="100"
                                                        value={
                                                          parseInt(
                                                            task[col.id]
                                                          ) || 0
                                                        }
                                                        onChange={(e) =>
                                                          updateTaskField(
                                                            task.id,
                                                            col.id,
                                                            `${e.target.value}%`
                                                          )
                                                        }
                                                      />
                                                    ) : col.id === "budget" ? (
                                                      // ✅ إدخال مبلغ مالي بالدولار
                                                      <input
                                                        type="text"
                                                        value={task[col.id]}
                                                        onChange={(e) => {
                                                          const formattedValue = `$${e.target.value.replace(
                                                            /[^0-9]/g,
                                                            ""
                                                          )}`;
                                                          updateTaskField(
                                                            task.id,
                                                            col.id,
                                                            formattedValue
                                                          );
                                                        }}
                                                      />
                                                    ) : col.id === "files" ? (
                                                      // ✅ إدخال ملف أو صورة
                                                      <input
                                                        type="file"
                                                        onChange={(e) =>
                                                          updateTaskField(
                                                            task.id,
                                                            col.id,
                                                            e.target.files[0]
                                                              ?.name || ""
                                                          )
                                                        }
                                                      />
                                                    ) : col.id === "rating" ? (
                                                      // ✅ تقييم بالنجوم (Select)
                                                      <select
                                                        className="custom_select custom_select_rate"
                                                        value={task[col.id]}
                                                        onChange={(e) =>
                                                          updateTaskField(
                                                            task.id,
                                                            col.id,
                                                            e.target.value
                                                          )
                                                        }
                                                      >
                                                        <option value="0⭐">
                                                          0 ⭐
                                                        </option>
                                                        <option value="1⭐">
                                                          1 ⭐
                                                        </option>
                                                        <option value="2⭐">
                                                          2 ⭐
                                                        </option>
                                                        <option value="3⭐">
                                                          3 ⭐
                                                        </option>
                                                        <option value="4⭐">
                                                          4 ⭐
                                                        </option>
                                                        <option value="5⭐">
                                                          5 ⭐
                                                        </option>
                                                      </select>
                                                    ) : (
                                                      // ✅ إدخال افتراضي لأي عمود آخر
                                                      <input
                                                        type="text"
                                                        value={
                                                          task[col.id] || ""
                                                        }
                                                        onChange={(e) =>
                                                          updateTaskField(
                                                            task.id,
                                                            col.id,
                                                            e.target.value
                                                          )
                                                        }
                                                      />
                                                    )}
                                                  </td>
                                                ))}
                                            </tr>
                                          )}
                                        </Draggable>
                                      ))}
                                      {provided.placeholder}
                                    </tbody>
                                  </table>
                                </div>
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

          <div id="column-context-menu" className="hide_context_menu">
            <ul>
              <li onClick={hideColumn}>Hidden Column</li>
            </ul>
          </div>

          <div id="hidden-columns-menu" className="hide_context_menu">
            <ul>
              {hiddenColumns.map((colId) => (
                <li key={colId} onClick={() => restoreColumn(colId)}>
                  {columns.find((col) => col.id === colId)?.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
