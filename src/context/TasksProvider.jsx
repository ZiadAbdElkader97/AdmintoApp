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
  const [hiddenColumns, setHiddenColumns] = useState([]);

  const [showDropdown, setShowDropdown] = useState(null);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(null);
  const [showDatepicker, setShowDatepicker] = useState({});

  const [groupToDelete, setGroupToDelete] = useState(null);
  const [showGroupDeletePopup, setShowGroupDeletePopup] = useState(false);
  const [showGroupDeletedMessage, setShowGroupDeletedMessage] = useState(false);

  const initialColumns = [
    { id: "task", name: "Task", visible: true, width: "180px" },
    { id: "status", name: "Status", visible: true, width: "100px" },
    { id: "progress", name: "Progress", visible: true, width: "150px" },
    { id: "date", name: "Due Date", visible: true, width: "120px" },
    { id: "priority", name: "Priority", visible: true, width: "100px" },
    { id: "notes", name: "Notes", visible: true, width: "180px" },
    { id: "budget", name: "Budget", visible: true, width: "100px" },
    { id: "files", name: "Files", visible: true, width: "140px" },
    { id: "timeline", name: "Timeline", visible: true, width: "120px" },
    { id: "updated", name: "Last updated", visible: true, width: "120px" },
    { id: "dependent", name: "Dependent On", visible: true, width: "130px" },
    { id: "rating", name: "Rating", visible: true, width: "80px" },
    { id: "add_column", name: "Add Column", visible: true, width: "80px" },
  ];

  const initialTasks = [
    {
      id: "1",
      task: "Task One",
      status: "Waiting for review",
      progress: "0%",
      date: "2025-03-15",
      priority: "High",
      notes: "",
      budget: "$1000",
      files: "",
      timeline: "2025-03-01",
      updated: "2025-03-10",
      dependent: "",
      rating: "5⭐",
    },
    {
      id: "2",
      task: "Task Two",
      status: "In Progress",
      progress: "50%",
      date: "2025-03-20",
      priority: "Medium",
      notes: "",
      budget: "$2000",
      files: "",
      timeline: "2025-03-05",
      updated: "2025-03-11",
      dependent: "",
      rating: "4⭐",
    },
    {
      id: "3",
      task: "Task Three",
      status: "Done",
      progress: "100%",
      date: "2025-03-25",
      priority: "Low",
      notes: "",
      budget: "$1500",
      files: "",
      timeline: "2025-03-10",
      updated: "2025-03-12",
      dependent: "",
      rating: "5⭐",
    },
  ];

  const initialGroups = [
    {
      name: "Group One",
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
    },
    {
      name: "Group Two",
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
    },
    {
      name: "Group Three",
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
    },
  ];

  const [groups, setGroups] = useState(() => {
    const storedGroups = JSON.parse(localStorage.getItem("taskGroups"));
    if (
      storedGroups &&
      Array.isArray(storedGroups) &&
      storedGroups.length > 0
    ) {
      return storedGroups;
    } else {
      const defaultGroups = [
        {
          name: "Group One",
          tasks: initialTasks.map((task) => ({
            ...task,
            id: `group1-${task.id}`,
          })),
        },
        {
          name: "Group Two",
          tasks: initialTasks.map((task) => ({
            ...task,
            id: `group2-${task.id}`,
          })),
        },
        {
          name: "Group Three",
          tasks: initialTasks.map((task) => ({
            ...task,
            id: `group3-${task.id}`,
          })),
        },
      ];
      localStorage.setItem("taskGroups", JSON.stringify(defaultGroups)); // ✅ حفظ القيم الافتراضية
      return defaultGroups;
    }
  });

  // تحميل البيانات من LocalStorage أو استخدام القيم الافتراضية
  const [columns, setColumns] = useState(() => {
    const storedColumns = JSON.parse(localStorage.getItem("tasks_columns"));
    return storedColumns && Array.isArray(storedColumns)
      ? storedColumns
      : initialColumns;
  });

  const [tasks, setTasks] = useState(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks_data"));
    if (storedTasks && Array.isArray(storedTasks) && storedTasks.length > 0) {
      return storedTasks; // ✅ تحميل البيانات المحفوظة في `localStorage` إن وجدت
    } else {
      localStorage.setItem("tasks_data", JSON.stringify(initialTasks)); // ✅ تخزين المهام الافتراضية في `localStorage`
      return initialTasks;
    }
  });

  useEffect(() => {
    localStorage.setItem("tasks_columns", JSON.stringify(columns));
  }, [columns]);

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("tasks_data", JSON.stringify(tasks));
    }
  }, [tasks]);

  useEffect(() => {
    if (groups && groups.length > 0) {
      localStorage.setItem("taskGroups", JSON.stringify(groups));
    }
  }, [groups]);

  const [expandedGroups, setExpandedGroups] = useState(() => {
    return initialGroups.reduce((acc, group) => {
      acc[group.name] = true; // جميع المجموعات مفتوحة افتراضيًا
      return acc;
    }, {});
  });

  useEffect(() => {
    if (groups.length > 0) {
      localStorage.setItem("taskGroups", JSON.stringify(groups));
    }
  }, [groups]);

  const handleTaskSelection = (taskId, groupName, isRightClick = false) => {
    setSelectedTasks((prevSelected) => {
      const updatedSelection = new Set(prevSelected);

      if (isRightClick) {
        // ✅ عند الضغط كليك يمين، يتم تحديد هذه المهمة فقط
        updatedSelection.clear();
        updatedSelection.add(taskId);
      } else {
        // ✅ عند الضغط العادي، يتم التبديل بين التحديد والإلغاء
        if (updatedSelection.has(taskId)) {
          updatedSelection.delete(taskId);
        } else {
          updatedSelection.add(taskId);
        }
      }

      return updatedSelection;
    });
  };

  const toggleSelectAll = (groupName) => {
    setSelectedTasks((prevSelected) => {
      const group = groups.find((g) => g.name === groupName);
      if (!group) return prevSelected;

      const allTaskIds = group.tasks.map((task) => task.id);
      const allSelected = allTaskIds.every((taskId) =>
        prevSelected.has(taskId)
      );

      const updatedSelection = new Set(prevSelected);

      if (allSelected) {
        // ✅ إذا كانت كل المهام محددة، قم بإلغاء تحديدها جميعًا
        allTaskIds.forEach((taskId) => updatedSelection.delete(taskId));
      } else {
        // ✅ إذا لم تكن كل المهام محددة، قم بتحديدها جميعًا
        allTaskIds.forEach((taskId) => updatedSelection.add(taskId));
      }

      return updatedSelection;
    });
  };

  const addTask = (groupName) => {
    setGroups((prevGroups) =>
      prevGroups.map((group) => {
        if (group.name === groupName) {
          const lastTask =
            group.tasks.length > 0
              ? group.tasks[group.tasks.length - 1] // ✅ احصل على آخر مهمة
              : initialTasks[0]; // ✅ إذا لم يكن هناك مهام، استخدم أول مهمة من `initialTasks`

          const newTask = {
            ...lastTask,
            id: `task-${Date.now()}`,
            task: "New Task",
            status: "To Do",
            progress: "0%",
            date: new Date().toISOString().split("T")[0],
            priority: lastTask.priority || "Medium",
            notes: lastTask.notes || "",
            budget: "$0",
            files: lastTask.files || "",
            timeline: new Date().toISOString().split("T")[0],
            updated: new Date().toISOString().split("T")[0],
            dependent: lastTask.dependent || "",
            rating: "0⭐",
          };

          return { ...group, tasks: [...group.tasks, newTask] };
        }
        return group;
      })
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
      setTimeout(() => setDeletedItemType(null), 500); // ✅ تأخير تصفير `deletedItemType` بعد إغلاق الإشعار
    }, 10000);
  };

  const confirmDeleteTask = () => {
    if (!taskToDelete) return;

    let deletedTask = null; // ✅ تعريف المتغير خارج `setGroups`
    let taskIndex = -1; // ✅ تعريف `taskIndex` لضمان وجوده

    setGroups((prevGroups) =>
      prevGroups.map((group) => {
        if (group.name === taskToDelete.groupName) {
          taskIndex = group.tasks.findIndex(
            (t) => t.id === taskToDelete.taskId
          );
          if (taskIndex === -1) return group;

          deletedTask = group.tasks[taskIndex]; // ✅ حفظ بيانات المهمة المحذوفة

          return {
            ...group,
            tasks: group.tasks.filter((t) => t.id !== taskToDelete.taskId),
          };
        }
        return group;
      })
    );

    if (deletedTask) {
      setDeletedItems((prev) => [
        ...prev,
        {
          type: "Task",
          data: {
            ...deletedTask, // ✅ حفظ كل بيانات المهمة الفعلية
            groupName: taskToDelete.groupName, // ✅ تأكيد حفظ اسم المجموعة
            index: taskIndex, // ✅ حفظ موقع المهمة في المجموعة
          },
        },
      ]);
    }

    setShowDeletePopup(false);
    showDeleteNotification("Task"); // ✅ عرض الإشعار
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

    const lastDeleted = deletedItems[deletedItems.length - 1]; // ✅ احصل على آخر عنصر محذوف
    setDeletedItems((prev) => prev.slice(0, -1)); // ✅ إزالة العنصر من قائمة المحذوفات

    if (!lastDeleted || !lastDeleted.data) return;

    if (lastDeleted.type === "Task") {
      setGroups((prevGroups) =>
        prevGroups.map((group) => {
          if (!group || !Array.isArray(group.tasks)) return group;

          // ✅ إذا كانت المهمة تخص هذه المجموعة، قم بإرجاعها إلى موقعها الأصلي
          if (group.name === lastDeleted.data.groupName) {
            const updatedTasks = [...group.tasks];

            // ✅ إدراج المهمة في مكانها الأصلي بنفس البيانات الأصلية
            updatedTasks.splice(
              lastDeleted.data.index ?? updatedTasks.length,
              0,
              lastDeleted.data
            );

            return { ...group, tasks: updatedTasks };
          }
          return group;
        })
      );
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

  // سحب وإفلات المجموعات والمهام
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination, type } = result;

    if (type === "column") {
      setColumns((prevColumns) => {
        const updatedColumns = Array.from(prevColumns);
        const [movedColumn] = updatedColumns.splice(source.index, 1);
        updatedColumns.splice(destination.index, 0, movedColumn);
        return updatedColumns;
      });
    } else if (type === "group") {
      setGroups((prevGroups) => {
        const updatedGroups = [...prevGroups];
        const [movedGroup] = updatedGroups.splice(source.index, 1);
        updatedGroups.splice(destination.index, 0, movedGroup);
        return updatedGroups;
      });
    } else if (type === "task") {
      setGroups((prevGroups) => {
        let updatedGroups = [...prevGroups];

        const sourceGroupIndex = updatedGroups.findIndex(
          (g) => g.name === source.droppableId
        );
        const destinationGroupIndex = updatedGroups.findIndex(
          (g) => g.name === destination.droppableId
        );

        if (sourceGroupIndex === -1 || destinationGroupIndex === -1)
          return prevGroups;

        const sourceGroup = { ...updatedGroups[sourceGroupIndex] };
        const destinationGroup = { ...updatedGroups[destinationGroupIndex] };

        const sourceTasks = [...sourceGroup.tasks];
        const destinationTasks = [...destinationGroup.tasks];

        const [movedTask] = sourceTasks.splice(source.index, 1);
        if (!movedTask) return prevGroups;

        if (sourceGroup.name === destinationGroup.name) {
          sourceTasks.splice(destination.index, 0, movedTask);
          sourceGroup.tasks = sourceTasks;
          updatedGroups[sourceGroupIndex] = sourceGroup;
        } else {
          destinationTasks.splice(destination.index, 0, movedTask);
          sourceGroup.tasks = sourceTasks;
          destinationGroup.tasks = destinationTasks;

          updatedGroups[sourceGroupIndex] = sourceGroup;
          updatedGroups[destinationGroupIndex] = destinationGroup;
        }

        return updatedGroups;
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
    event.stopPropagation(); // ✅ منع اختفاء القائمة فورًا

    if (type === "task" && taskId) {
      setSelectedTasks(new Set([taskId])); // ✅ تحديد المهمة فورًا عند الضغط كليك يمين
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

  const updateTaskField = (taskId, field, value) => {
    setGroups((prevGroups) =>
      prevGroups.map((group) => ({
        ...group,
        tasks: group.tasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                [field]: value, // ✅ تحديث العمود الصحيح فقط
              }
            : task
        ),
      }))
    );
  };

  const handleColumnContextMenu = (event, columnId) => {
    event.preventDefault();
    const menu = document.getElementById("column-context-menu");
    menu.style.top = `${event.pageY}px`;
    menu.style.left = `${event.pageX}px`;
    menu.style.display = "block";
    menu.dataset.columnId = columnId;
  };

  const hideColumn = () => {
    const columnId = document.getElementById("column-context-menu").dataset
      .columnId;
    setHiddenColumns((prev) => [...prev, columnId]);
    document.getElementById("column-context-menu").style.display = "none";
  };

  const showHiddenColumnsMenu = (event) => {
    event.preventDefault();
    const menu = document.getElementById("hidden-columns-menu");
    menu.style.top = `${event.pageY}px`;
    menu.style.left = `${event.pageX}px`;
    menu.style.display = "block";
  };

  const restoreColumn = (columnId) => {
    setHiddenColumns((prev) => prev.filter((id) => id !== columnId));
    document.getElementById("hidden-columns-menu").style.display = "none";
  };

  const startResizing = (event, columnId) => {
    event.preventDefault();
    const startX = event.clientX;
    const columnIndex = columns.findIndex((col) => col.id === columnId);
    if (columnIndex === -1) return;

    const initialWidth = parseInt(columns[columnIndex].width, 10);
    let animationFrameId = null; // ✅ استخدام requestAnimationFrame لتحسين الأداء

    const handleMouseMove = (moveEvent) => {
      const newWidth = Math.max(
        50,
        initialWidth + (moveEvent.clientX - startX)
      );

      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }

      animationFrameId = requestAnimationFrame(() => {
        setColumns((prevColumns) =>
          prevColumns.map((col, index) =>
            index === columnIndex ? { ...col, width: `${newWidth}px` } : col
          )
        );
      });
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const calculateProgress = (updated, dueDate) => {
    const updatedDate = new Date(updated);
    const due = new Date(dueDate);
    const today = new Date();

    if (today < updatedDate) return 0;
    if (today >= due) return 100;

    const totalDuration = due - updatedDate;
    const elapsedTime = today - updatedDate;

    return Math.min(100, Math.max(0, (elapsedTime / totalDuration) * 100));
  };

  const getProgressColor = (progress) => {
    const colors = [
      "#ff0000",
      "#ff3300",
      "#ff6600",
      "#ff9900",
      "#ffcc00",
      "#ffff00",
      "#ccff00",
      "#99ff00",
      "#66ff00",
      "#00ff00",
    ];
    const index = Math.floor((progress / 100) * (colors.length - 1));
    return colors[index];
  };

  const getStatusColor = (status) => {
    const statusColors = {
      "Ready to start": "#3498db",
      "Waiting for review": "#9b59b6",
      "In Progress": "#FBBF24",
      "Pending Deploy": "#795548",
      Done: "#22C55E",
      Stuck: "#EF4444",
    };
    return statusColors[status] || "#D1D5DB"; // لون افتراضي
  };

  const getPriorityColor = (priority) => {
    const priorityColors = {
      Critical: "#e74c3c",
      High: "#9b59b6",
      Medium: "#e67e22",
      Low: "#3498db",
      "Best Effort": "#34495e",
      Missing: "#95a5a6",
    };
    return priorityColors[priority] || "#D1D5DB";
  };

  const handleClickOutside = (event) => {
    if (
      !event.target.closest(".status-wrapper, .priority-wrapper, .date-wrapper")
    ) {
      setShowDropdown(null);
      setShowPriorityDropdown(null);
      setShowDatepicker(null);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

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
        tasks,
        setTasks,
        columns,
        setColumns,
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
        
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}
