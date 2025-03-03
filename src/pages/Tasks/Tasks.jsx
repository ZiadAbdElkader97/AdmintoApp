import "./Tasks.css";
import { useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  FaPlus,
  FaSearch,
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa";

export default function Tasks() {
  const inputRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [groups, setGroups] = useState(() => {
    const savedGroups = localStorage.getItem("taskGroups");
    return savedGroups
      ? JSON.parse(savedGroups)
      : [
          {
            name: "Ahmed",
            tasks: [],
            columns: [
              "Task",
              "Status",
              "Progress",
              "Due Date",
              "Priority",
              "Notes",
              "Budget",
              "Files",
            ],
          },
          {
            name: "Mohammed",
            tasks: [],
            columns: [
              "Task",
              "Status",
              "Progress",
              "Due Date",
              "Priority",
              "Notes",
              "Budget",
              "Files",
            ],
          },
          {
            name: "Ali",
            tasks: [],
            columns: [
              "Task",
              "Status",
              "Progress",
              "Due Date",
              "Priority",
              "Notes",
              "Budget",
              "Files",
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

  const addTask = (groupName) => {
    setTasks((prevTasks) => ({
      ...prevTasks,
      [Date.now()]: { group: groupName, data: {} },
    }));
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination, type } = result;

    if (type === "group") {
      const newGroups = [...groups];
      const [movedGroup] = newGroups.splice(source.index, 1);
      newGroups.splice(destination.index, 0, movedGroup);
      setGroups(newGroups);
    } else {
      setTasks((prevTasks) => {
        const updatedTasks = { ...prevTasks };
        updatedTasks[result.draggableId].group = destination.droppableId;
        return updatedTasks;
      });
    }
  };

  const updateGroupName = (index, newName) => {
    setGroups((prevGroups) => {
      const updatedGroups = [...prevGroups];
      updatedGroups[index] = { ...updatedGroups[index], name: newName };
      return updatedGroups;
    });
  };

  const toggleGroup = (groupName) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName], // تبديل حالة المجموعة
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
                                      {group.columns.map((col, colIndex) => (
                                        <th key={colIndex}>{col}</th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {group.tasks.map((task, taskIndex) => (
                                      <Draggable
                                        key={task.id}
                                        draggableId={String(task.id)}
                                        index={taskIndex}
                                      >
                                        {(provided) => (
                                          <tr
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                          >
                                            {group.columns.map(
                                              (col, colIndex) => (
                                                <td key={colIndex}>
                                                  <input
                                                    type="text"
                                                    value={task.data[col] || ""}
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
                                              )
                                            )}
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
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    </div>
  );
}
