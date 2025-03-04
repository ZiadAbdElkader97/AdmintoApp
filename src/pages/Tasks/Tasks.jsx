import "./Tasks.css";
import { useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  FaPlus,
  FaSearch,
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa";

export default function Tasks() {
  const inputRef = useRef(null);
  const historyRef = useRef([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [selectedTasks, setSelectedTasks] = useState(new Set());
  const [contextMenu, setContextMenu] = useState(null);

  const [groups, setGroups] = useState(() => {
    const savedGroups = localStorage.getItem("taskGroups");
    return savedGroups
      ? JSON.parse(savedGroups)
      : [
          {
            name: "Group One",
            tasks: [
              {
                id: 1,
                name: "Task 1",
                status: "Not Started",
                dueDate: "",
                owner: "",
              },
              {
                id: 2,
                name: "Task 2",
                status: "Done",
                dueDate: "Jan 22",
                owner: "",
              },
            ],
            columns: [
              "Select",
              "Task",
              "Status",
              "Progress",
              "Due Date",
              "Priority",
              "Notes",
              "Budget",
              "Files",
              "Timeline",
              "Last updated",
              "Dependent On",
              "Rating",
            ],
          },
          {
            name: "Group Two",
            tasks: [
              {
                id: 1,
                name: "Task 1",
                status: "Not Started",
                dueDate: "",
                owner: "",
              },
              {
                id: 2,
                name: "Task 2",
                status: "Done",
                dueDate: "Jan 22",
                owner: "",
              },
            ],
            columns: [
              "Select",
              "Task",
              "Status",
              "Progress",
              "Due Date",
              "Priority",
              "Notes",
              "Budget",
              "Files",
              "Timeline",
              "Last updated",
              "Dependent On",
              "Rating",
            ],
          },
          {
            name: "Group Three",
            tasks: [
              {
                id: 1,
                name: "Task 1",
                status: "Not Started",
                dueDate: "",
                owner: "",
              },
              {
                id: 2,
                name: "Task 2",
                status: "Done",
                dueDate: "Jan 22",
                owner: "",
              },
            ],
            columns: [
              "Select",
              "Task",
              "Status",
              "Progress",
              "Due Date",
              "Priority",
              "Notes",
              "Budget",
              "Files",
              "Timeline",
              "Last updated",
              "Dependent On",
              "Rating",
            ],
          },
        ];
  });

  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : {};
  });

  const [expandedGroups, setExpandedGroups] = useState(() => {
    return groups.reduce((acc, group) => {
      acc[group.name] = true; // جميع المجموعات مفتوحة افتراضيًا
      return acc;
    }, {});
  });

  useEffect(() => {
    localStorage.setItem("taskGroups", JSON.stringify(groups));
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [groups, tasks]);

  historyRef.current.push({
    groups: JSON.parse(JSON.stringify(groups)),
    tasks: JSON.parse(JSON.stringify(tasks)),
  });

  const handleTaskSelection = (taskId, groupName, isRightClick = false) => {
    setSelectedTasks((prev) => {
      const updated = new Set();

      const uniqueTaskId = `${groupName}-${taskId}`;

      if (isRightClick) {
        // عند الضغط كليك يمين، يجب تحديد هذه المهمة فقط
        updated.add(uniqueTaskId);
      } else {
        // عند الضغط كليك يسار، نضيف أو نزيل التحديد
        if (prev.has(uniqueTaskId)) {
          prev.delete(uniqueTaskId);
        } else {
          prev.add(uniqueTaskId);
        }
      }

      return updated;
    });
  };

  const toggleSelectAll = (groupName) => {
    setSelectedTasks((prev) => {
      const updated = new Set(prev);
      const groupTasks =
        groups
          .find((group) => group.name === groupName)
          ?.tasks.map((task) => `${groupName}-${task.id}`) || [];

      const allSelected = groupTasks.every((id) => updated.has(id));

      if (allSelected) {
        groupTasks.forEach((id) => updated.delete(id)); // إزالة التحديد
      } else {
        groupTasks.forEach((id) => updated.add(id)); // تحديد جميع المهام
      }

      return updated;
    });
  };

  const addTask = (groupName) => {
    const newTask = {
      id: Date.now(),
      group: groupName,
      data: {},
    };

    setTasks((prevTasks) => ({
      ...prevTasks,
      [newTask.id]: newTask,
    }));

    setGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.name === groupName
          ? { ...group, tasks: [...group.tasks, newTask] }
          : group
      )
    );
  };

  const deleteTask = (taskId) => {
    setGroups((prevGroups) => {
      // حفظ النسخة الحالية قبل حذف المهمة
      historyRef.current.push({
        groups: JSON.parse(JSON.stringify(prevGroups)),
        tasks: JSON.parse(JSON.stringify(tasks)),
      });

      return prevGroups.map((group) => ({
        ...group,
        tasks: group.tasks.filter((task) => task.id !== taskId),
      }));
    });

    setTasks((prevTasks) => {
      const updatedTasks = { ...prevTasks };
      delete updatedTasks[taskId]; // حذف المهمة من كائن المهام
      return updatedTasks;
    });

    setContextMenu(null); // إخفاء القائمة بعد الحذف
  };

  const deleteGroup = (groupName) => {
    setGroups((prevGroups) => {
      // حفظ النسخة الحالية قبل حذف المجموعة
      historyRef.current.push({
        groups: JSON.parse(JSON.stringify(prevGroups)),
        tasks: JSON.parse(JSON.stringify(tasks)),
      });

      return prevGroups.filter((group) => group.name !== groupName);
    });

    setContextMenu(null); // إخفاء القائمة بعد الحذف
  };

  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleUndo = (event) => {
      if (event.ctrlKey && event.key === "z") {
        event.preventDefault(); // منع السلوك الافتراضي للمتصفح

        if (historyRef.current.length > 0) {
          const lastState = historyRef.current.pop(); // استرجاع آخر نسخة مخزنة
          setGroups(lastState.groups);
          setTasks(lastState.tasks);
        }
      }
    };

    document.addEventListener("keydown", handleUndo);
    return () => {
      document.removeEventListener("keydown", handleUndo);
    };
  }, []);

  const addGroup = () => {
    const groupName = prompt("Enter group name:");
    if (!groupName) return; // إذا لم يتم إدخال اسم، لا تقم بإنشاء المجموعة

    const newGroup = {
      name: groupName,
      tasks: [],
      columns: [
        "Select",
        "Task",
        "Status",
        "Progress",
        "Due Date",
        "Priority",
        "Notes",
        "Budget",
        "Files",
        "Timeline",
        "Last updated",
        "Dependent On",
        "Rating",
      ],
    };

    setGroups((prevGroups) => [...prevGroups, newGroup]);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination, type } = result;

    if (type === "group") {
      // إعادة ترتيب المجموعات عند سحبها
      const newGroups = [...groups];
      const [movedGroup] = newGroups.splice(source.index, 1);
      newGroups.splice(destination.index, 0, movedGroup);
      setGroups(newGroups);
    } else if (type === "task") {
      setGroups((prevGroups) => {
        let movedTask = null;
        let taskColumns = [];

        const updatedGroups = prevGroups.map((group) => {
          if (group.name === source.droppableId) {
            // إزالة المهمة من المجموعة الأصلية
            const filteredTasks = [...group.tasks];
            movedTask = filteredTasks.splice(source.index, 1)[0];
            taskColumns = group.columns; // حفظ ترتيب الأعمدة
            return { ...group, tasks: filteredTasks };
          }
          return group;
        });

        if (!movedTask) return prevGroups; // التأكد من وجود المهمة

        return updatedGroups.map((group) => {
          if (group.name === destination.droppableId) {
            // إضافة المهمة إلى الموضع المحدد
            const updatedTasks = [...group.tasks];
            updatedTasks.splice(destination.index, 0, movedTask);

            // الاحتفاظ بترتيب الأعمدة كما هو
            return { ...group, tasks: updatedTasks, columns: taskColumns };
          }
          return group;
        });
      });
    }
  };

  const updateGroupName = (groupIndex, newName) => {
    setGroups((prevGroups) => {
      const updatedGroups = [...prevGroups];
      updatedGroups[groupIndex].name = newName;
      return updatedGroups;
    });
  };

  const toggleGroup = (groupName) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

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
            <Droppable droppableId="all-groups" type="group">
              {(provided) => (
                <div
                  className="groups_container"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {groups.map((group, index) => (
                    <Draggable
                      key={group.name}
                      draggableId={group.name}
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
                            {...provided.dragHandleProps}
                            onContextMenu={(e) => {
                              e.preventDefault();
                              setContextMenu({
                                x: e.pageX,
                                y: e.pageY,
                                type: "group",
                                groupName: group.name,
                              });
                            }}
                          >
                            {/* زر التوسيع/التصغير */}
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
                              onMouseDown={(e) => e.stopPropagation()} // تعطيل السحب أثناء الكتابة
                            />
                          </div>

                          {expandedGroups[group.name] && (
                            <Droppable droppableId={group.name} type="task">
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
                                            groups
                                              .find(
                                                (group) =>
                                                  group.name === group.name
                                              )
                                              ?.tasks.every((task) =>
                                                selectedTasks.has(
                                                  `${group.name}-${task.id}`
                                                )
                                              ) &&
                                            groups.find(
                                              (group) =>
                                                group.name === group.name
                                            )?.tasks.length > 0
                                          }
                                          onChange={() =>
                                            toggleSelectAll(group.name)
                                          }
                                        />
                                      </th>
                                      {group.columns
                                        .slice(1)
                                        .map((col, colIndex) => (
                                          <th key={colIndex}>{col}</th>
                                        ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {group.tasks.map((task, taskIndex) => (
                                      <Draggable
                                        key={String(task.id)}
                                        draggableId={String(task.id)}
                                        index={taskIndex}
                                      >
                                        {(provided) => (
                                          <tr
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            onContextMenu={(e) => {
                                              e.preventDefault(); // منع القائمة الافتراضية للمتصفح
                                              handleTaskSelection(
                                                task.id,
                                                group.name,
                                                true
                                              ); // كليك يمين
                                              setContextMenu({
                                                x: e.pageX,
                                                y: e.pageY,
                                                type: "task",
                                                taskId: task.id,
                                                groupName: group.name,
                                              });
                                            }}
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
                                                value={task.name}
                                                onChange={(e) => {
                                                  setGroups((prevGroups) =>
                                                    prevGroups.map((g) =>
                                                      g.name === group.name
                                                        ? {
                                                            ...g,
                                                            tasks: g.tasks.map(
                                                              (t) =>
                                                                t.id === task.id
                                                                  ? {
                                                                      ...t,
                                                                      name: e
                                                                        .target
                                                                        .value,
                                                                    }
                                                                  : t
                                                            ),
                                                          }
                                                        : g
                                                    )
                                                  );
                                                }}
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
              style={{ top: contextMenu.y, left: contextMenu.x }}
            >
              {contextMenu.type === "task" ? (
                <button
                  onClick={() =>
                    deleteTask(contextMenu.taskId, contextMenu.groupName)
                  }
                >
                  Delete Task
                </button>
              ) : (
                <button onClick={() => deleteGroup(contextMenu.groupName)}>
                  Delete Group
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
