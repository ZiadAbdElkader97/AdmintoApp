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
  FaEyeSlash,
  FaArchive,
} from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { BsThreeDots } from "react-icons/bs";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { IoDuplicate } from "react-icons/io5";
import { RiDeleteBinFill } from "react-icons/ri";
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
    updateTaskField,
    startResizing,
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
    setPopupFile,
    handleFileChange,
    removeFile,
    hideColumn,
    columnContextMenu,
    setColumnContextMenu,
    editingColumn,
    setEditingColumn,
    updateColumnName,
    editingColumnValue,
    setEditingColumnValue,
    editingGroup,
    setEditingGroup,
    showHiddenColumns,
    setShowHiddenColumns,
    toggleColumnVisibility,
    clearSelection,
    duplicateTask,
    archiveTask,
    deleteTask,
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
                      key={group.id}
                      draggableId={group.id}
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
                              handleContextMenu(e, "group", null, group.id)
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
                                  droppableId={`columns-${group.id}`}
                                  direction="horizontal"
                                  type="column"
                                >
                                  {(provided) => (
                                    <thead
                                      ref={provided.innerRef}
                                      {...provided.droppableProps}
                                    >
                                      <tr>
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
                                        {group.columns
                                          .filter((col) => !col.hidden)
                                          .map((col, index) => (
                                            <Draggable
                                              draggableId={`column-${group.id}-${col.id}`}
                                              key={`column-${group.id}-${col.id}`}
                                              index={index}
                                            >
                                              {(provided) => (
                                                <th
                                                  key={col.id}
                                                  className={
                                                    col.hidden ? "hidden" : ""
                                                  }
                                                  ref={provided.innerRef}
                                                  {...provided.draggableProps}
                                                  {...provided.dragHandleProps}
                                                  style={{
                                                    width: col.width,
                                                    minWidth: "50px",
                                                    position: "relative",
                                                    cursor: "grab",
                                                  }}
                                                >
                                                  <div className="col_header">
                                                    {editingColumn ===
                                                    `${group.id}-${col.id}` ? (
                                                      <input
                                                        ref={inputRef}
                                                        type="text"
                                                        className="column-edit-input"
                                                        value={
                                                          editingColumnValue
                                                        }
                                                        autoFocus
                                                        onFocus={(e) =>
                                                          e.target.select()
                                                        }
                                                        onChange={(e) =>
                                                          setEditingColumnValue(
                                                            e.target.value
                                                          )
                                                        }
                                                        onBlur={() => {
                                                          if (
                                                            editingColumnValue.trim() !==
                                                            ""
                                                          ) {
                                                            updateColumnName(
                                                              editingColumn.replace(
                                                                /^.*-/,
                                                                ""
                                                              ),
                                                              editingColumnValue
                                                            );
                                                          }
                                                          setEditingColumn(
                                                            null
                                                          );
                                                          setColumnContextMenu(
                                                            null
                                                          );
                                                        }}
                                                        onKeyDown={(e) => {
                                                          if (
                                                            e.key === "Enter"
                                                          ) {
                                                            e.preventDefault();
                                                            if (
                                                              editingColumnValue.trim() !==
                                                                "" &&
                                                              editingGroup
                                                            ) {
                                                              updateColumnName(
                                                                editingGroup,
                                                                editingColumn.replace(
                                                                  /^.*-/,
                                                                  ""
                                                                ),
                                                                editingColumnValue
                                                              );
                                                            }
                                                            setEditingColumn(
                                                              null
                                                            );
                                                            setEditingGroup(
                                                              null
                                                            );
                                                            setColumnContextMenu(
                                                              null
                                                            );
                                                          }
                                                        }}
                                                      />
                                                    ) : (
                                                      <p className="col_name">
                                                        {col.id ===
                                                        "add_column" ? (
                                                          <button
                                                            className="add-column-btn"
                                                            onClick={(e) => {
                                                              e.stopPropagation();
                                                              setShowHiddenColumns(
                                                                (prev) => ({
                                                                  ...prev,
                                                                  [group.id]:
                                                                    !prev[
                                                                      group.id
                                                                    ], // ✅ يفتح/يغلق القائمة فقط لهذا الجروب
                                                                })
                                                              );
                                                            }}
                                                          >
                                                            +
                                                          </button>
                                                        ) : (
                                                          col.name
                                                        )}
                                                      </p>
                                                    )}

                                                    {col.id !==
                                                      "add_column" && (
                                                      <i
                                                        className="column-menu-btn"
                                                        onClick={(e) => {
                                                          e.stopPropagation();
                                                          setColumnContextMenu(
                                                            columnContextMenu ===
                                                              `${group.id}-${col.id}`
                                                              ? null
                                                              : `${group.id}-${col.id}`
                                                          );
                                                        }}
                                                      >
                                                        <BsThreeDots />
                                                      </i>
                                                    )}
                                                  </div>

                                                  {/* إظهار قائمة الخيارات عند الضغط على الأيقونة */}
                                                  {columnContextMenu ===
                                                    `${group.id}-${col.id}` && (
                                                    <ul className="column-options">
                                                      <li
                                                        onClick={() =>
                                                          hideColumn(
                                                            group.id,
                                                            col.id
                                                          )
                                                        }
                                                      >
                                                        <i>
                                                          <FaEyeSlash />
                                                        </i>
                                                        <p>Hide Column</p>
                                                      </li>
                                                      <li
                                                        onClick={() => {
                                                          setEditingGroup(
                                                            group.name
                                                          );
                                                          setEditingColumn(
                                                            `${group.id}-${col.id}`
                                                          );
                                                          setEditingColumnValue(
                                                            col.name
                                                          );
                                                          setTimeout(
                                                            () =>
                                                              inputRef.current?.select(),
                                                            0
                                                          );
                                                        }}
                                                      >
                                                        <i>
                                                          <MdDriveFileRenameOutline />
                                                        </i>
                                                        <p>Rename</p>
                                                      </li>
                                                    </ul>
                                                  )}
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
                                      </tr>
                                    </thead>
                                  )}
                                </Droppable>

                                <Droppable droppableId={group.id} type="task">
                                  {(provided) => (
                                    <tbody
                                      ref={provided.innerRef}
                                      {...provided.droppableProps}
                                    >
                                      {group.tasks.map((task, index) => (
                                        <Draggable
                                          draggableId={`task-${group.id}-${task.id}`}
                                          key={task.id}
                                          index={index}
                                        >
                                          {(provided) => (
                                            <tr
                                              key={task.id}
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
                                              {group.columns
                                                .filter((col) => !col.hidden)
                                                .map((col) => (
                                                  <td
                                                    key={col.id}
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
                                                      <div className="file-upload-wrapper">
                                                        <div className="file-preview-container">
                                                          {Array.isArray(
                                                            task.files
                                                          ) &&
                                                            task.files.length >
                                                              0 &&
                                                            task.files.map(
                                                              (file, index) => (
                                                                <div
                                                                  key={index}
                                                                  className="file-preview"
                                                                >
                                                                  {file.url &&
                                                                  (file.name.endsWith(
                                                                    ".jpg"
                                                                  ) ||
                                                                    file.name.endsWith(
                                                                      ".png"
                                                                    ) ||
                                                                    file.name.endsWith(
                                                                      ".jpeg"
                                                                    )) ? (
                                                                    <img
                                                                      src={
                                                                        file.url
                                                                      }
                                                                      alt={
                                                                        file.name
                                                                      }
                                                                      className="uploaded-thumbnail"
                                                                      onClick={() =>
                                                                        setPopupFile(
                                                                          file.url
                                                                        )
                                                                      }
                                                                    />
                                                                  ) : (
                                                                    <span
                                                                      className="uploaded-file-name"
                                                                      onClick={() =>
                                                                        setPopupFile(
                                                                          file.url
                                                                        )
                                                                      }
                                                                    >
                                                                      📄{" "}
                                                                      {
                                                                        file.name
                                                                      }
                                                                    </span>
                                                                  )}

                                                                  <button
                                                                    className="delete-btn2"
                                                                    onClick={() =>
                                                                      removeFile(
                                                                        task.id,
                                                                        "files",
                                                                        index
                                                                      )
                                                                    }
                                                                  >
                                                                    ❌
                                                                  </button>
                                                                </div>
                                                              )
                                                            )}

                                                          <div
                                                            className="file-upload-button"
                                                            onClick={() => {
                                                              if (task?.id) {
                                                                document
                                                                  .getElementById(
                                                                    `fileInput-${task.id}`
                                                                  )
                                                                  .click();
                                                              }
                                                            }}
                                                          >
                                                            ➕
                                                          </div>
                                                        </div>

                                                        <input
                                                          id={`fileInput-${task.id}`}
                                                          type="file"
                                                          style={{
                                                            display: "none",
                                                          }}
                                                          accept="image/*, .pdf, .doc, .docx"
                                                          multiple
                                                          onChange={(event) =>
                                                            handleFileChange(
                                                              event,
                                                              task.id
                                                            )
                                                          }
                                                        />
                                                      </div>
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
                                                    ) : col.id ===
                                                      "add_column" ? (
                                                      <span className="disabled-cell"></span>
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

                          {showHiddenColumns[group.id] && (
                            <div className="hidden-columns-menu">
                              <button
                                className="close_hidden_btn"
                                onClick={() => setShowHiddenColumns(false)}
                              >
                                <IoMdClose />
                              </button>

                              <ul>
                                {groups
                                  .flatMap((group) =>
                                    group.columns
                                      .filter((col) => col.hidden)
                                      .map((col) => ({
                                        ...col,
                                        groupId: group.id,
                                      }))
                                  ) // ✅ جلب جميع الأعمدة المخفية عبر جميع المجموعات
                                  .map((col) => (
                                    <li
                                      key={col.id}
                                      onClick={() => {
                                        toggleColumnVisibility(
                                          col.groupId,
                                          col.id
                                        );
                                        setShowHiddenColumns(false); // ✅ إغلاق القائمة بعد اختيار العمود
                                      }}
                                    >
                                      {col.name}
                                    </li>
                                  ))}
                              </ul>
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

          {selectedTasks.size > 0 && (
            <div className="selection-toolbar">
              <div className="toolbar-left">
                <div className="selected-count">
                  <span>{selectedTasks.size}</span>
                  <p>Task selected</p>
                </div>
              </div>
              <div className="toolbar-actions">
                <div
                  className="toolbar-button"
                  onClick={() => {
                    if (selectedTasks.size === 0) return;
                    Array.from(selectedTasks).forEach((task) =>
                      duplicateTask(task.id, task.groupName)
                    );
                  }}
                >
                  <i>
                    <IoDuplicate />
                  </i>
                  <p>Duplicate</p>
                </div>
                <div
                  className="toolbar-button"
                  onClick={() => {
                    if (selectedTasks.size === 0) return;
                    Array.from(selectedTasks).forEach((task) =>
                      archiveTask(task.id, task.groupName)
                    );
                  }}
                >
                  <i>
                    <FaArchive />
                  </i>
                  <p>Archive</p>
                </div>
                <div
                  className="toolbar-button"
                  onClick={() => {
                    if (selectedTasks.size === 0) return;
                    deleteTask();
                  }}
                >
                  <i>
                    <RiDeleteBinFill />
                  </i>
                  <p>Delete</p>
                </div>
              </div>
              <div className="toolbar-close" onClick={clearSelection}>
                <i>
                  <IoMdClose />
                </i>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
