import "./Tasks.css";
import Modal from "react-modal";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
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
    calculateProgress,
    getProgressColor,
    getStatusColor,
    getPriorityColor,
    showPriorityDropdown,
    setShowPriorityDropdown,
    showDropdown,
    setShowDropdown,
    showDatepicker,
    setShowDatepicker,
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
                            <div className="table-container">
                              <table className="tasks-table">
                                <Droppable
                                  droppableId={`columns-${group.name}`}
                                  direction="horizontal"
                                  type="column"
                                >
                                  {(provided) => (
                                    <thead>
                                      <tr
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                      >
                                        {/* ✅ Checkbox تحديد الكل */}
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
                                        {/* ✅ الأعمدة القابلة للسحب */}
                                        {columns
                                          .filter((col) => col.visible)
                                          .map((col, index) => (
                                            <Draggable
                                              key={`column-${group.name}-${col.id}`}
                                              draggableId={`column-${group.name}-${col.id}`}
                                              index={index}
                                            >
                                              {(provided) => (
                                                <th
                                                  ref={provided.innerRef}
                                                  {...provided.draggableProps}
                                                  {...provided.dragHandleProps}
                                                  style={{
                                                    width: col.width,
                                                    cursor: "grab",
                                                  }}
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
                                              )}
                                            </Draggable>
                                          ))}
                                        {provided.placeholder}
                                        {/* ✅ زر "إضافة عمود" */}
                                        <th
                                          onClick={showHiddenColumnsMenu}
                                          className="add_column"
                                        >
                                          +
                                        </th>
                                      </tr>
                                    </thead>
                                  )}
                                </Droppable>

                                <Droppable droppableId={group.name} type="task">
                                  {(provided) => (
                                    <tbody
                                      ref={provided.innerRef}
                                      {...provided.droppableProps}
                                    >
                                      {group.tasks.map((task, index) => (
                                        <Draggable
                                          key={`task-${group.name}-${task.id}`}
                                          draggableId={`task-${group.name}-${task.id}`}
                                          index={index}
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
                                                    style={{
                                                      width: col.width,
                                                      backgroundColor:
                                                        col.id === "status"
                                                          ? getStatusColor(
                                                              task.status
                                                            )
                                                          : col.id ===
                                                            "priority"
                                                          ? getPriorityColor(
                                                              task.priority
                                                            )
                                                          : "inherit",
                                                    }}
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
                                                      <div
                                                        className="date-wrapper"
                                                        onClick={(e) => {
                                                          e.stopPropagation();
                                                          setShowDatepicker(
                                                            (prev) =>
                                                              prev ===
                                                              `${task.id}-${col.id}`
                                                                ? null
                                                                : `${task.id}-${col.id}`
                                                          );
                                                        }}
                                                      >
                                                        <span className="date-text">
                                                          {task[col.id]}
                                                        </span>
                                                        {showDatepicker ===
                                                          `${task.id}-${col.id}` && (
                                                          <div className="calendar-popup">
                                                            <Calendar
                                                              onChange={(
                                                                date
                                                              ) => {
                                                                const localDate =
                                                                  new Date(
                                                                    date.getTime() -
                                                                      date.getTimezoneOffset() *
                                                                        60000
                                                                  )
                                                                    .toISOString()
                                                                    .split(
                                                                      "T"
                                                                    )[0];

                                                                updateTaskField(
                                                                  task.id,
                                                                  col.id,
                                                                  localDate
                                                                );
                                                                setShowDatepicker(
                                                                  null
                                                                ); // إغلاق التقويم بعد اختيار التاريخ
                                                              }}
                                                              value={
                                                                task[col.id]
                                                                  ? new Date(
                                                                      task[
                                                                        col.id
                                                                      ]
                                                                    )
                                                                  : new Date()
                                                              }
                                                            />
                                                          </div>
                                                        )}
                                                      </div>
                                                    ) : col.id ===
                                                      "priority" ? (
                                                      // ✅ قائمة منسدلة (Dropdown) لـ Priority
                                                      <div
                                                        className="status_priority_wrapper"
                                                        style={{
                                                          backgroundColor:
                                                            getPriorityColor(
                                                              task.priority
                                                            ),
                                                        }}
                                                      >
                                                        <span
                                                          onClick={(e) => {
                                                            e.stopPropagation();
                                                            setShowPriorityDropdown(
                                                              task.id
                                                            );
                                                          }}
                                                          className="status_priority_badge"
                                                        >
                                                          {task.priority}
                                                        </span>
                                                        {showPriorityDropdown ===
                                                          task.id && (
                                                          <div className="status_priority_dropdown">
                                                            {[
                                                              "Critical",
                                                              "High",
                                                              "Medium",
                                                              "Low",
                                                              "Best Effort",
                                                              "Missing",
                                                            ].map(
                                                              (priority) => (
                                                                <div
                                                                  key={priority}
                                                                  onClick={() => {
                                                                    updateTaskField(
                                                                      task.id,
                                                                      "priority",
                                                                      priority
                                                                    );
                                                                    setShowPriorityDropdown(
                                                                      null
                                                                    );
                                                                  }}
                                                                  className="status_priority_option"
                                                                  style={{
                                                                    backgroundColor:
                                                                      getPriorityColor(
                                                                        priority
                                                                      ),
                                                                  }}
                                                                >
                                                                  {priority}
                                                                </div>
                                                              )
                                                            )}
                                                          </div>
                                                        )}
                                                      </div>
                                                    ) : col.id === "status" ? (
                                                      // ✅ قائمة منسدلة (Dropdown)
                                                      <div className="status_priority_wrapper">
                                                        <span
                                                          onClick={(e) => {
                                                            e.stopPropagation();
                                                            setShowDropdown(
                                                              task.id
                                                            );
                                                          }}
                                                          className="status_priority_badge"
                                                        >
                                                          {task.status}
                                                        </span>
                                                        {showDropdown ===
                                                          task.id && (
                                                          <div className="status_priority_dropdown">
                                                            {[
                                                              "Ready to start",
                                                              "Waiting for review",
                                                              "In Progress",
                                                              "Pending Deploy",
                                                              "Done",
                                                              "Stuck",
                                                            ].map((status) => (
                                                              <div
                                                                key={status}
                                                                onClick={() => {
                                                                  updateTaskField(
                                                                    task.id,
                                                                    "status",
                                                                    status
                                                                  );
                                                                  setShowDropdown(
                                                                    null
                                                                  );
                                                                }}
                                                                className="status_priority_option"
                                                                style={{
                                                                  backgroundColor:
                                                                    getStatusColor(
                                                                      status
                                                                    ),
                                                                }}
                                                              >
                                                                {status}
                                                              </div>
                                                            ))}
                                                          </div>
                                                        )}
                                                      </div>
                                                    ) : col.id ===
                                                      "progress" ? (
                                                      // ✅ شريط تقدم (Range) من 0% إلى 100%
                                                      <div className="progress-container">
                                                        <div
                                                          className="progress-bar"
                                                          style={{
                                                            width: `${calculateProgress(
                                                              task.updated,
                                                              task.date
                                                            )}%`,
                                                            backgroundColor:
                                                              getProgressColor(
                                                                calculateProgress(
                                                                  task.updated,
                                                                  task.date
                                                                )
                                                              ),
                                                          }}
                                                        >
                                                          {Math.round(
                                                            calculateProgress(
                                                              task.updated,
                                                              task.date
                                                            )
                                                          )}
                                                          %
                                                        </div>
                                                      </div>
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
                                                        style={{
                                                          textAlign: "center",
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
                                  )}
                                </Droppable>
                              </table>
                            </div>
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
