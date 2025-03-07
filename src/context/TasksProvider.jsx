/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { TasksContext } from "./TasksContext";
import { FaArchive } from "react-icons/fa";
import { IoDuplicate } from "react-icons/io5";
import { RiDeleteBinFill } from "react-icons/ri";

export default function TasksProvider({ children }) {
  const inputRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [selectedTasks, setSelectedTasks] = useState(new Set());
  const [contextMenu, setContextMenu] = useState(null);

  const [taskToDelete, setTaskToDelete] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deletedItemType, setDeletedItemType] = useState(null);
  const [showDeletedMessage, setShowDeletedMessage] = useState(false);

  const [deletedItems, setDeletedItems] = useState([]);

  const [groupToDelete, setGroupToDelete] = useState(null);
  const [showGroupDeletePopup, setShowGroupDeletePopup] = useState(false);
  const [showGroupDeletedMessage, setShowGroupDeletedMessage] = useState(false);

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
    if (groups.length > 0) {
      localStorage.setItem("taskGroups", JSON.stringify(groups));
    }
  }, [groups]);

  useEffect(() => {
    if (tasks && Object.keys(tasks).length > 0) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks]);

  const handleTaskSelection = (taskId, groupName, isRightClick = false) => {
    setSelectedTasks((prev) => {
      const updated = new Set(prev);
      const uniqueTaskId = `${groupName}-${taskId}`;

      if (isRightClick) {
        // عند الضغط كليك يمين، يتم تحديد هذه المهمة فقط
        updated.clear();
        updated.add(uniqueTaskId);
      } else {
        // عند الضغط كليك يسار، يتم التبديل بين التحديد والإلغاء
        if (updated.has(uniqueTaskId)) {
          updated.delete(uniqueTaskId);
        } else {
          updated.add(uniqueTaskId);
        }
      }

      return new Set(updated); // إرجاع نسخة جديدة لضمان التحديث
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

  const deleteTask = (taskId, groupName) => {
    setTaskToDelete({ taskId, groupName }); // ✅ حفظ المهمة المطلوب حذفها
    setShowDeletePopup(true); // ✅ فتح نافذة التأكيد أولًا
  };

  const showDeleteNotification = (type) => {
    setDeletedItemType(type);
    setShowDeletedMessage(true);

    setTimeout(() => {
      setShowDeletedMessage(false);
      setDeletedItemType(null);
    }, 10000);
  };

  const confirmDeleteTask = () => {
    if (!taskToDelete) return;

    const group = groups.find((g) => g.name === taskToDelete.groupName);
    if (!group) return;

    const taskIndex = group.tasks.findIndex(
      (t) => t.id === taskToDelete.taskId
    );
    if (taskIndex === -1) return;

    const taskToRestore = group.tasks[taskIndex];

    setDeletedItems((prev) => [
      ...prev,
      {
        type: "Task",
        data: {
          ...taskToDelete,
          task: { ...taskToRestore, id: taskToRestore.id || Date.now() },
          index: taskIndex,
        },
      }, // ✅ ضمان وجود ID
    ]);

    setGroups((prevGroups) =>
      prevGroups.map((g) =>
        g.name === taskToDelete.groupName
          ? { ...g, tasks: g.tasks.filter((t) => t.id !== taskToDelete.taskId) }
          : g
      )
    );

    setShowDeletePopup(false);
    showDeleteNotification("Task");
  };
  const deleteGroup = (groupName) => {
    const group = groups.find((g) => g.name === groupName);
    if (!group) return;
    setGroupToDelete({ groupName, group });
    setShowGroupDeletePopup(true);
  };

  const confirmDeleteGroup = () => {
    if (!groupToDelete) return;

    const groupIndex = groups.findIndex(
      (g) => g.name === groupToDelete.groupName
    );
    if (groupIndex === -1) return;

    // ✅ حفظ المجموعة كاملةً بكل بياناتها
    const groupToRestore = groups.find(
      (group) => group.name === groupToDelete.groupName
    );
    if (!groupToRestore) return;

    setDeletedItems((prev) => [
      ...prev,
      {
        type: "Group",
        data: { ...groupToDelete, id: groupToDelete.id || Date.now() },
      }, // ✅ تأكد أن `id` موجود
    ]);

    setGroups((prevGroups) =>
      prevGroups.filter((g) => g.name !== groupToDelete.groupName)
    );

    setShowGroupDeletePopup(false);
    showDeleteNotification("Group");
  };

  const undoDeleteLast = () => {
    if (!deletedItems || deletedItems.length === 0) return; // ✅ تحقق من أن هناك عناصر محذوفة

    const lastDeleted = deletedItems[deletedItems.length - 1];
    setDeletedItems((prev) => prev.slice(0, -1));

    if (!lastDeleted || !lastDeleted.data) return;

    if (lastDeleted.type === "Task") {
      setGroups((prevGroups) =>
        prevGroups.map((group) => {
          if (!group || !Array.isArray(group.tasks)) return group;

          return group.name === lastDeleted.data.groupName
            ? {
                ...group,
                tasks: [
                  ...group.tasks.slice(0, lastDeleted.data.index),
                  {
                    ...lastDeleted.data.task,
                    id: lastDeleted.data.task.id || Date.now(),
                  }, // ✅ تأكد من أن `task.id` موجود
                  ...group.tasks.slice(lastDeleted.data.index),
                ],
              }
            : group;
        })
      );
    } else if (lastDeleted.type === "Group") {
      setGroups((prevGroups) => {
        if (!Array.isArray(prevGroups)) return [];

        const index = lastDeleted.data.index ?? prevGroups.length;

        return [
          ...prevGroups.slice(0, index),
          {
            ...lastDeleted.data, // ✅ استرجاع جميع بيانات المجموعة
            // name: lastDeleted.data.name
            //   ? lastDeleted.data.name
            //   : lastDeleted.data.groupName
            //   ? lastDeleted.data.groupName
            //   : `Restored Group ${Date.now()}`,
            tasks: Array.isArray(lastDeleted.data.tasks)
              ? lastDeleted.data.tasks
              : [], // ✅ التأكد من أن `tasks` ليست `undefined`
            columns: Array.isArray(lastDeleted.data.columns)
              ? lastDeleted.data.columns
              : [], // ✅ التأكد من استرجاع `columns`
          },
          ...prevGroups.slice(index),
        ];
      });
    }

    setShowDeletedMessage(false);
  };

  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
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
    console.log("Drag End Result:", result);

    if (!result.destination) return; // ✅ منع الأخطاء إذا لم يكن هناك إسقاط صحيح

    const { source, destination } = result;

    setGroups((prevGroups) => {
      const newGroups = [...prevGroups];

      // ✅ إصلاح `droppableId` لضمان العثور على المجموعة الصحيحة
      const sourceGroupName = source.droppableId.replace("group-", "");
      const destinationGroupName = destination.droppableId.replace(
        "group-",
        ""
      );

      const sourceGroup = newGroups.find((g) => g.name === sourceGroupName);
      const destinationGroup = newGroups.find(
        (g) => g.name === destinationGroupName
      );

      if (!sourceGroup || !destinationGroup) return prevGroups; // ✅ منع الأخطاء

      const [movedTask] = sourceGroup.tasks.splice(source.index, 1);

      destinationGroup.tasks.splice(destination.index, 0, movedTask);

      return newGroups;
    });
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

  const duplicateTask = (taskId, groupName) => {
    setGroups((prevGroups) =>
      prevGroups.map((group) => {
        if (group.name === groupName) {
          const taskIndex = group.tasks.findIndex((t) => t.id === taskId);
          if (taskIndex === -1) return group;

          const originalTask = group.tasks[taskIndex];
          const newTask = { ...originalTask, id: Date.now() }; // إنشاء نسخة جديدة بنفس البيانات

          const updatedTasks = [...group.tasks];
          updatedTasks.splice(taskIndex + 1, 0, newTask); // إدراجها بعد الأصل مباشرةً

          return { ...group, tasks: updatedTasks };
        }
        return group;
      })
    );
  };

  const duplicateGroup = (groupName) => {
    setGroups((prevGroups) => {
      const originalIndex = prevGroups.findIndex((g) => g.name === groupName);
      if (originalIndex === -1) return prevGroups;

      const originalGroup = prevGroups[originalIndex];

      // ✅ البحث عن أعلى رقم موجود في التسمية الحالية
      const existingNumbers = prevGroups
        .map((g) => {
          const match = g.name.match(/^(.+?) (\d+)$/); // ✅ البحث عن اسم به رقم
          return match ? { name: match[1], number: Number(match[2]) } : null;
        })
        .filter(Boolean)
        .filter((g) => g.name === groupName) // ✅ تصفية الأسماء المطابقة فقط
        .map((g) => g.number);

      const nextNumber =
        existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;
      const newGroupName = `${groupName} ${nextNumber}`;

      const newGroup = {
        ...originalGroup,
        name: newGroupName,
        id: Date.now(),
        tasks: originalGroup.tasks.map((task) => ({
          ...task,
          id: Date.now() + Math.random(), // ✅ تعيين ID جديد لكل مهمة
        })),
        columns: [...originalGroup.columns], // ✅ نسخ جميع الأعمدة أيضًا
      };

      const updatedGroups = [...prevGroups];
      updatedGroups.splice(originalIndex + 1, 0, newGroup); // ✅ إدراج في نفس الموضع

      return updatedGroups;
    });
  };

  const archiveTask = (taskId, groupName) => {
    setGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.name === groupName
          ? {
              ...group,
              tasks: group.tasks.filter((t) => t.id !== taskId),
            }
          : group
      )
    );

    const task = groups
      .find((g) => g.name === groupName)
      ?.tasks.find((t) => t.id === taskId);
    if (task) {
      setTasks((prevTasks) => ({
        ...prevTasks,
        trash: [...(prevTasks.trash || []), { ...task, deletedAt: Date.now() }],
      }));
    }
  };

  const archiveGroup = (groupName) => {
    setGroups((prevGroups) => prevGroups.filter((g) => g.name !== groupName));
    const group = groups.find((g) => g.name === groupName);
    if (group) {
      setTasks((prevTasks) => ({
        ...prevTasks,
        trash: [
          ...(prevTasks.trash || []),
          { ...group, deletedAt: Date.now() },
        ],
      }));
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTasks((prevTasks) => ({
        ...prevTasks,
        trash: (prevTasks.trash || []).filter(
          (item) => Date.now() - item.deletedAt < 30 * 24 * 60 * 60 * 1000
        ),
      }));
    }, 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const contextMenuOptions = contextMenu ? (
    <ul className="context-menu-list">
      {contextMenu.type === "task" ? (
        <>
          <li
            className="context-menu-item"
            onClick={() =>
              duplicateTask(contextMenu.taskId, contextMenu.groupName)
            }
          >
            <i className="context-icon">
              <IoDuplicate />
            </i>{" "}
            Duplicate Task
          </li>
          <li
            className="context-menu-item"
            onClick={() =>
              archiveTask(contextMenu.taskId, contextMenu.groupName)
            }
          >
            <i className="context-icon">
              <FaArchive />
            </i>{" "}
            Archive Task
          </li>
          <li
            className="context-menu-item delete"
            onClick={() =>
              deleteTask(contextMenu.taskId, contextMenu.groupName)
            }
          >
            <i className="context-icon">
              <RiDeleteBinFill />
            </i>{" "}
            Delete Task
          </li>
        </>
      ) : (
        <>
          <li
            className="context-menu-item"
            onClick={() => duplicateGroup(contextMenu.groupName)}
          >
            <i className="context-icon">
              <IoDuplicate />
            </i>{" "}
            Duplicate Group
          </li>
          <li
            className="context-menu-item"
            onClick={() => archiveGroup(contextMenu.groupName)}
          >
            <i className="context-icon">
              <FaArchive />
            </i>{" "}
            Archive Group
          </li>
          <li
            className="context-menu-item delete"
            onClick={() => deleteGroup(contextMenu.groupName)}
          >
            <i className="context-icon">
              <RiDeleteBinFill />
            </i>{" "}
            Delete Group
          </li>
        </>
      )}
    </ul>
  ) : null;

  const handleContextMenu = (event, type, taskId = null, groupName = null) => {
    event.preventDefault();

    if (type === "task") {
      handleTaskSelection(taskId, groupName, true);
    }

    setContextMenu({
      x: event.pageX,
      y: event.pageY,
      type,
      taskId,
      groupName,
    });
  };

  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleTaskNameChange = (e, taskId, groupName) => {
    const newName = e.target.value;

    setGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.name === groupName
          ? {
              ...group,
              tasks: group.tasks.map((task) =>
                task.id === taskId ? { ...task, name: newName } : task
              ),
            }
          : group
      )
    );
  };

  return (
    <TasksContext.Provider
      value={{
        inputRef,
        searchTerm,
        setSearchTerm,
        modalIsOpen,
        setModalIsOpen,
        selectedTasks,
        contextMenu,
        setContextMenu,
        groups,
        setGroups,
        showDeletePopup,
        setShowDeletePopup,
        showDeletedMessage,
        deletedItemType,
        setShowDeletedMessage,
        showGroupDeletePopup,
        setShowGroupDeletePopup,
        showGroupDeletedMessage,
        setShowGroupDeletedMessage,
        expandedGroups,
        handleTaskSelection,
        toggleSelectAll,
        addTask,
        deleteTask,
        confirmDeleteTask,
        undoDeleteLast,
        deleteGroup,
        confirmDeleteGroup,
        addGroup,
        handleDragEnd,
        updateGroupName,
        toggleGroup,
        duplicateTask,
        duplicateGroup,
        contextMenuOptions,
        handleContextMenu,
        handleTaskNameChange,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}
