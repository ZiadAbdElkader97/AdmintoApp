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

  const [showDropdown, setShowDropdown] = useState(null);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(null);
  const [showDatepicker, setShowDatepicker] = useState({});
  const [popupFile, setPopupFile] = useState(null);
  const [columnContextMenu, setColumnContextMenu] = useState(null);
  const [editingColumn, setEditingColumn] = useState(null);
  const [editingColumnValue, setEditingColumnValue] = useState("");
  const [editingGroup, setEditingGroup] = useState(null);
  const [showHiddenColumns, setShowHiddenColumns] = useState({});

  const [groupToDelete, setGroupToDelete] = useState(null);
  const [showGroupDeletePopup, setShowGroupDeletePopup] = useState(false);
  const [showGroupDeletedMessage, setShowGroupDeletedMessage] = useState(false);

  const initialColumns = [
    { id: "task", name: "Task", visible: true, width: "200px" },
    { id: "status", name: "Status", visible: true, width: "100px" },
    { id: "progress", name: "Progress", visible: true, width: "150px" },
    { id: "date", name: "Due Date", visible: true, width: "160px" },
    { id: "priority", name: "Priority", visible: true, width: "130px" },
    { id: "notes", name: "Notes", visible: true, width: "180px" },
    { id: "budget", name: "Budget", visible: true, width: "130px" },
    { id: "files", name: "Files", visible: true, width: "140px" },
    { id: "timeline", name: "Timeline", visible: true, width: "160px" },
    { id: "updated", name: "Last updated", visible: true, width: "160px" },
    { id: "dependent", name: "Dependent On", visible: true, width: "180px" },
    { id: "rating", name: "Rating", visible: true, width: "120px" },
    { id: "add_column", name: "Add Column", visible: true, width: "50px" },
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
      columns: JSON.parse(JSON.stringify(initialColumns)), // نسخة مستقلة
    },
    {
      name: "Group Two",
      tasks: [],
      columns: JSON.parse(JSON.stringify(initialColumns)), // نسخة مستقلة
    },
    {
      name: "Group Three",
      tasks: [],
      columns: JSON.parse(JSON.stringify(initialColumns)), // نسخة مستقلة
    },
  ];

  const [groups, setGroups] = useState(() => {
    const storedGroups = JSON.parse(localStorage.getItem("taskGroups")) || [];

    if (Array.isArray(storedGroups) && storedGroups.length > 0) {
      return storedGroups.map((group, index) => ({
        ...group,
        id: group.id || `group-${Date.now()}-${index}`, // ✅ تأكد من أن كل مجموعة لها ID فريد
        columns: group.columns
          ? group.columns
          : JSON.parse(JSON.stringify(initialColumns)), // ✅ تأكد أن كل مجموعة لديها أعمدة
      }));
    } else {
      const defaultGroups = [
        {
          id: `group-${Date.now()}-1`,
          name: "Group One",
          tasks: initialTasks.map((task) => ({
            ...task,
            id: `group1-${task.id}`,
          })),
          columns: JSON.parse(JSON.stringify(initialColumns)),
        },
        {
          id: `group-${Date.now()}-2`,
          name: "Group Two",
          tasks: initialTasks.map((task) => ({
            ...task,
            id: `group2-${task.id}`,
          })),
          columns: JSON.parse(JSON.stringify(initialColumns)),
        },
        {
          id: `group-${Date.now()}-3`,
          name: "Group Three",
          tasks: initialTasks.map((task) => ({
            ...task,
            id: `group3-${task.id}`,
          })),
          columns: JSON.parse(JSON.stringify(initialColumns)),
        },
      ];

      localStorage.setItem("taskGroups", JSON.stringify(defaultGroups));
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
    const storedTasks = JSON.parse(localStorage.getItem("tasks_data")) || [];

    if (Array.isArray(storedTasks) && storedTasks.length > 0) {
      return storedTasks.map((task) => ({
        ...task,
        files: Array.isArray(task.files) ? task.files : [], // ✅ تأكد أن `files` مصفوفة
      }));
    } else {
      const initializedTasks = initialTasks.map((task) => ({
        ...task,
        files: [],
      }));

      localStorage.setItem("tasks_data", JSON.stringify(initializedTasks)); // ✅ حفظ البيانات المعدلة
      return initializedTasks;
    }
  });

  useEffect(() => {
    localStorage.setItem("tasks_columns", JSON.stringify(columns));
  }, [columns]);

  useEffect(() => {
    localStorage.setItem("tasks_data", JSON.stringify(tasks));
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

  const handleTaskSelection = (taskId, isRightClick = false) => {
    setSelectedTasks((prevSelected) => {
      const updatedSelection = new Set(prevSelected);

      if (isRightClick) {
        // عند الضغط بزر الفأرة الأيمن، لا يتم إلغاء تحديد كل المهام، فقط تبديل المهمة المحددة
        if (updatedSelection.has(taskId)) {
          updatedSelection.delete(taskId);
        } else {
          updatedSelection.add(taskId);
        }
      } else {
        // عند الضغط العادي، يتم إعادة تعيين التحديد ليشمل فقط هذه المهمة
        if (updatedSelection.size === 1 && updatedSelection.has(taskId)) {
          updatedSelection.clear();
        } else {
          updatedSelection.clear();
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
        allTaskIds.forEach((taskId) => updatedSelection.delete(taskId));
      } else {
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

  const deleteTask = (taskId) => {
    let tasksToRemove = [];

    if (taskId) {
      // ✅ حذف مهمة واحدة فقط عند استخدام القائمة السياقية
      tasksToRemove = [taskId];
    } else if (selectedTasks.size > 0) {
      // ✅ حذف جميع المهام المحددة عند استخدام `selection-toolbar`
      tasksToRemove = Array.from(selectedTasks);
    } else {
      return;
    }

    setTaskToDelete(tasksToRemove);
    setShowDeletePopup(true);
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
    if (!taskToDelete || taskToDelete.length === 0) return;

    let deletedTasks = [];

    setGroups((prevGroups) =>
      prevGroups.map((group) => {
        const remainingTasks = group.tasks.filter((task) => {
          if (taskToDelete.includes(task.id)) {
            deletedTasks.push({ ...task });
            return false; // ✅ حذف المهام المتطابقة
          }
          return true;
        });

        return { ...group, tasks: remainingTasks };
      })
    );

    // ✅ إضافة المهام إلى سلة المهملات
    setDeletedItems((prev) => [
      ...prev,
      ...deletedTasks.map((task) => ({
        type: "Task",
        data: { ...task, deletedAt: Date.now() },
      })),
    ]);

    setSelectedTasks(new Set()); // ✅ مسح التحديد بعد الحذف
    setTaskToDelete([]);
    setShowDeletePopup(false);
    showDeleteNotification("Task"); // ✅ عرض الإشعار
  };

  const deleteGroup = (groupId) => {
    const group = groups.find((g) => g.id === groupId);
    if (!group) return;

    setGroupToDelete({ groupId, group }); // ✅ حفظ ID المجموعة المطلوب حذفها
    setShowGroupDeletePopup(true);
  };

  const confirmDeleteGroup = () => {
    if (!groupToDelete) return;

    const groupIndex = groups.findIndex((g) => g.id === groupToDelete.groupId);
    if (groupIndex === -1) return;

    // ✅ حفظ المجموعة كاملةً بكل بياناتها
    const groupToRestore = groups.find(
      (group) => group.id === groupToDelete.groupId
    );
    if (!groupToRestore) return;

    setDeletedItems((prev) => [
      ...prev,
      {
        type: "Group",
        data: { ...groupToDelete, id: groupToDelete.id },
      }, // ✅ تأكد أن `id` موجود
    ]);

    setGroups((prevGroups) =>
      prevGroups.filter((g) => g.id !== groupToDelete.groupId)
    );

    setShowGroupDeletePopup(false);
    showDeleteNotification("Group");
  };

  const undoDeleteLast = () => {
    if (!deletedItems || deletedItems.length === 0) return; // ✅ تحقق من وجود عناصر محذوفة

    const lastDeleted = deletedItems[deletedItems.length - 1]; // ✅ احصل على آخر عنصر محذوف
    if (!lastDeleted || !lastDeleted.data) return;

    setDeletedItems((prev) => prev.slice(0, -1)); // ✅ إزالة العنصر من قائمة المحذوفات

    setGroups((prevGroups) => {
      return prevGroups.map((group) => {
        if (!group || !Array.isArray(group.tasks)) return group;

        // ✅ التحقق مما إذا كانت هذه هي المجموعة الأصلية للمهمة
        if (group.id === lastDeleted.data.previousGroupId) {
          const updatedTasks = [...group.tasks];

          // ✅ إعادة المهمة إلى موقعها الأصلي
          const insertIndex =
            lastDeleted.data.originalIndex ?? updatedTasks.length;
          updatedTasks.splice(insertIndex, 0, lastDeleted.data);

          return { ...group, tasks: updatedTasks };
        }

        return group;
      });
    });

    setShowDeletedMessage(false); // ✅ إغلاق إشعار الحذف
  };

  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const addGroup = () => {
    const groupName = prompt("Enter group name:");
    if (!groupName) return; // إذا لم يتم إدخال اسم، لا تضف المجموعة

    const newGroup = {
      name: groupName,
      tasks: initialTasks.map((task) => ({
        ...task,
        id: `${groupName}-${task.id}`, // ✅ التأكد من أن كل مهمة لها معرف فريد
      })),
      columns: JSON.parse(JSON.stringify(initialColumns)), // ✅ نسخ الأعمدة الافتراضية
    };

    setGroups((prevGroups) => [...prevGroups, newGroup]);

    // ✅ جعل المجموعة الجديدة مفتوحة تلقائيًا
    setExpandedGroups((prev) => ({
      ...prev,
      [groupName]: true,
    }));
  };

  // سحب وإفلات المجموعات والمهام

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination, type } = result;

    setGroups((prevGroups) => {
      const updatedGroups = [...prevGroups];

      const moveItem = (sourceArray, destinationArray, fromIndex, toIndex) => {
        const [movedItem] = sourceArray.splice(fromIndex, 1);
        if (movedItem) destinationArray.splice(toIndex, 0, movedItem);
      };

      if (type === "group") {
        moveItem(updatedGroups, updatedGroups, source.index, destination.index);
        return updatedGroups;
      }

      const sourceGroup = updatedGroups.find(
        (g) => g.id === source.droppableId
      );
      const destinationGroup = updatedGroups.find(
        (g) => g.id === destination.droppableId
      );

      if (!sourceGroup || !destinationGroup) return updatedGroups;

      if (type === "column") {
        const sourceColumns = [...sourceGroup.columns];
        const destinationColumns =
          sourceGroup === destinationGroup
            ? sourceColumns
            : [...destinationGroup.columns];

        moveItem(
          sourceColumns,
          destinationColumns,
          source.index,
          destination.index
        );

        return updatedGroups.map((group) =>
          group.id === sourceGroup.id
            ? { ...group, columns: sourceColumns }
            : group.id === destinationGroup.id
            ? { ...group, columns: destinationColumns }
            : group
        );
      }

      if (type === "task") {
        const sourceTasks = [...sourceGroup.tasks];
        const destinationTasks =
          sourceGroup === destinationGroup
            ? sourceTasks
            : [...destinationGroup.tasks];

        moveItem(
          sourceTasks,
          destinationTasks,
          source.index,
          destination.index
        );

        sourceGroup.tasks = sourceTasks;
        if (sourceGroup !== destinationGroup)
          destinationGroup.tasks = destinationTasks;
      }

      return updatedGroups;
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

  const duplicateGroup = (groupId) => {
    setGroups((prevGroups) => {
      const originalIndex = prevGroups.findIndex((g) => g.id === groupId);
      if (originalIndex === -1) {
        return prevGroups;
      }

      const originalGroup = prevGroups[originalIndex];

      const newGroup = {
        ...originalGroup,
        id: `group-${Date.now()}-${Math.random()}`, // معرف فريد
        name: `${originalGroup.name}`,
        tasks: originalGroup.tasks.map((task) => ({
          ...task,
          id: `task-${Date.now()}-${Math.random()}`,
        })),
        columns: JSON.parse(JSON.stringify(originalGroup.columns)),
      };

      const updatedGroups = [...prevGroups];
      updatedGroups.splice(originalIndex + 1, 0, newGroup);

      return updatedGroups;
    });
  };

  const archiveTask = (taskId, groupName) => {
    setGroups((prevGroups) => {
      const updatedGroups = prevGroups.map((group) =>
        group.name === groupName
          ? {
              ...group,
              tasks: group.tasks.filter((t) => t.id !== taskId),
            }
          : group
      );

      const task = prevGroups
        .find((g) => g.name === groupName)
        ?.tasks.find((t) => t.id === taskId);
      if (task) {
        setTasks((prevTasks) => ({
          ...prevTasks,
          trash: [
            ...(prevTasks.trash || []),
            { ...task, deletedAt: Date.now() },
          ],
        }));
      }
      return updatedGroups;
    });
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
              duplicateTask(contextMenu.taskId, contextMenu.groupId)
            }
          >
            <i className="context-icon">
              <IoDuplicate />
            </i>{" "}
            Duplicate Task
          </li>
          <li
            className="context-menu-item"
            onClick={() => archiveTask(contextMenu.taskId, contextMenu.groupId)}
          >
            <i className="context-icon">
              <FaArchive />
            </i>{" "}
            Archive Task
          </li>
          <li
            className="context-menu-item delete"
            onClick={() => deleteTask(contextMenu.taskId, contextMenu.groupId)}
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
            onClick={() => duplicateGroup(contextMenu.groupId)}
          >
            <i className="context-icon">
              <IoDuplicate />
            </i>{" "}
            Duplicate Group
          </li>
          <li
            className="context-menu-item"
            onClick={() => archiveGroup(contextMenu.groupId)}
          >
            <i className="context-icon">
              <FaArchive />
            </i>{" "}
            Archive Group
          </li>
          <li
            className="context-menu-item delete"
            onClick={() => deleteGroup(contextMenu.groupId)}
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

  const handleContextMenu = (event, type, taskId = null, groupId = null) => {
    event.preventDefault();
    event.stopPropagation(); // ✅ منع القائمة من الاختفاء فورًا

    // ✅ إذا كان هناك مهام محددة، احتفظ بها عند الضغط كليك يمين
    setSelectedTasks((prevSelected) => {
      const updatedSelection = new Set(prevSelected);

      if (type === "task" && taskId) {
        updatedSelection.add(taskId); // ✅ لا تقم بمسح التحديد، فقط أضف المهمة الجديدة إذا لم تكن محددة
      }

      return updatedSelection;
    });

    setContextMenu({
      x: event.pageX,
      y: event.pageY,
      type,
      taskId,
      groupId,
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

  const startResizing = (event, columnId) => {
    event.preventDefault();
    event.stopPropagation();

    const startX = event.clientX;

    setColumns((prevColumns) => {
      const columnIndex = prevColumns.findIndex((col) => col.id === columnId);
      if (columnIndex === -1) return prevColumns;

      let initialWidth = parseInt(prevColumns[columnIndex]?.width, 10);
      if (isNaN(initialWidth) || !initialWidth) initialWidth = 100;

      document.body.style.cursor = "col-resize";

      const handleMouseMove = (moveEvent) => {
        const deltaX = moveEvent.clientX - startX;
        const newWidth = Math.max(50, initialWidth + deltaX);

        console.log(`📏 Resizing column ${columnId}: ${newWidth}px`);

        setColumns((prevCols) => {
          const updatedColumns = [...prevCols];
          updatedColumns[columnIndex] = {
            ...updatedColumns[columnIndex],
            width: `${newWidth}px`,
          };
          return updatedColumns;
        });
      };

      const handleMouseUp = () => {
        console.log(`✅ Resize finished for column: ${columnId}`);
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
        document.body.style.cursor = "default";
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);

      return prevColumns;
    });
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
      !event.target.closest(
        ".status-wrapper, .priority-wrapper, .date-wrapper, .column-options, .add-column-btn, .hidden-columns-menu"
      )
    ) {
      setShowDropdown(null);
      setShowPriorityDropdown(null);
      setShowDatepicker(null);
      setColumnContextMenu(null);
      setShowHiddenColumns(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleFileChange = (event, taskId) => {
    const files = Array.from(event.target.files);

    if (files.length > 0) {
      const newFiles = files.map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
      }));

      setTasks((prevTasks) => {
        const updatedTasks = prevTasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                files: [...(task.files || []), ...newFiles],
              }
            : task
        );

        // ✅ حفظ البيانات في localStorage بعد التحديث
        localStorage.setItem("tasks_data", JSON.stringify(updatedTasks));

        return [...updatedTasks];
      });
    }
  };

  const removeFile = (taskId, field, index) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          const updatedFiles = [...(task[field] || [])];
          updatedFiles.splice(index, 1);
          return {
            ...task,
            [field]: updatedFiles,
          };
        }
        return task;
      })
    );
  };

  const hideColumn = (groupId, columnId) => {
    setGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              columns: group.columns.map((col) =>
                col.id === columnId ? { ...col, hidden: true } : col
              ),
            }
          : group
      )
    );

    // ✅ تأكد أن القائمة لا تتأثر عند الإخفاء
    setShowHiddenColumns((prev) => ({
      ...prev,
      [groupId]: prev[groupId] || false, // يحافظ على حالة الجروب الحالي فقط
    }));

    setColumnContextMenu(null);
  };

  const toggleColumnVisibility = (groupId, columnId) => {
    setGroups((prevGroups) =>
      prevGroups.map((group) => {
        if (group.id !== groupId) return group;

        // ✅ إظهار العمود في الجروب المطلوب فقط
        const updatedColumns = group.columns.map((col) =>
          col.id === columnId ? { ...col, hidden: false } : col
        );

        return { ...group, columns: updatedColumns };
      })
    );

    // ✅ إغلاق القائمة لهذا الجروب فقط
    setShowHiddenColumns((prev) => ({
      ...prev,
      [groupId]: false,
    }));
  };

  const updateColumnName = (groupName, columnId, newName) => {
    setGroups((prevGroups) => {
      const updatedGroups = prevGroups.map((group) => {
        if (group.name === groupName) {
          const updatedColumns = group.columns.map((col) =>
            col.id === columnId ? { ...col, name: newName } : col
          );

          return { ...group, columns: updatedColumns };
        }
        return group;
      });

      console.log("Updated Groups:", updatedGroups); // ✅ تأكد أن الاسم يتغير في الحالة
      localStorage.setItem("taskGroups", JSON.stringify(updatedGroups)); // ✅ تحديث `localStorage`

      return [...updatedGroups]; // ✅ إرجاع نسخة جديدة لإجبار `React` على إعادة التحديث
    });
  };

  const clearSelection = () => {
    setSelectedTasks(new Set()); // إعادة تعيين التحديد
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
        popupFile,
        setPopupFile,
        handleFileChange,
        removeFile,
        hideColumn,
        columnContextMenu,
        setColumnContextMenu,
        updateColumnName,
        editingColumn,
        setEditingColumn,
        editingColumnValue,
        setEditingColumnValue,
        editingGroup,
        setEditingGroup,
        showHiddenColumns,
        setShowHiddenColumns,
        toggleColumnVisibility,
        clearSelection,
        archiveTask,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}
