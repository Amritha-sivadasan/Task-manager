import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Plus, X, Search } from "lucide-react";
import { useAppSelector } from "../../hooks/hook";
import socket from "../../socket/socket";
import { getTask, searchItem } from "../../service/api/taskApi";
import toast from "react-hot-toast";
import { MdEdit } from "react-icons/md";
import { FaTrashArrowUp } from "react-icons/fa6";
import Swal from "sweetalert2";

export interface ITask {
  _id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed" | "overdue";
  dueDate: Date;
  userId?: string;
}

const MyTask = () => {
  const { user } = useAppSelector((state) => state.user);
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
  const [newTask, setNewTask] = useState<Omit<ITask, "_id">>({
    title: "",
    description: "",
    status: "pending",
    dueDate: new Date(),
    userId: user?._id,
  });
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetchAllTask = async () => {
      const response = await getTask();
      if (response.success) {
        setTasks(response.data);
      }
    };
    fetchAllTask();
  }, [user]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Successfully connected to the server!");
    });
    socket.on("taskAdded", (addedTask) => {
      setTasks((prev) => [...prev, addedTask]);
      setNewTask({
        title: "",
        description: "",
        status: "pending",
        dueDate: new Date(),
        userId: user?._id,
      });
      setIsModalOpen(false);
    });

    socket.on("taskUpdated", (task) => {
      if (task.status !== "completed") {
        setTasks((prev) => prev.map((t) => (t._id === task._id ? task : t)));
      } else {
        setTasks((prev) => prev.filter((t) => t._id !== task._id));
      }
    });
    socket.on("taskDeleted", (taskId) => {
      const updatedTasks = tasks.filter((task) => task._id !== taskId);
      setTasks(updatedTasks);
      console.log("updated task", updatedTasks);
    });
    // socket.on("searchResult", (result:ITask[]) => {

    //   console.log("result",result)
    //   if (result && Array.isArray(result)) {
    //     setTasks(result);
    //   } else {
    //     console.error("Invalid search result:", result);
    //   }
    // });

    return () => {
      socket.off("taskAdded");
      socket.off("taskUpdated");
      socket.off("taskDeleted");
    };
  }, [tasks, user?._id]);

  const toggleDescription = (taskId: string) => {
    setExpandedTaskId((prevId) => (prevId === taskId ? null : taskId));
  };

  const handleAddTask = () => {
    if (
      newTask.title.trim() === "" ||
      newTask.description.trim() === "" ||
      newTask.dueDate == null
    ) {
      toast.error("Please Fill The Fields");
      return;
    }
    socket.emit("addnewTask", newTask);
  };

  const handleStatus = (id: string, status: ITask["status"]) => {
    socket.emit("updateStatus", id, status);
    if (status !== "completed") {
      setTasks((prev) =>
        prev.map((t) => (t._id === id ? { ...t, status } : t))
      );
    } else {
      setTasks((prev) => prev.filter((t) => t._id !== id));
    }
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setNewTask({ ...newTask, dueDate: date });
    }
  };

  const openEditModal = (task: ITask) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  const handleEditTask = () => {
    if (selectedTask) {
      if (
        selectedTask.title.trim() == "" ||
        selectedTask.description.trim() == "" ||
        selectedTask.dueDate == null
      ) {
        toast.error("Please Fill The Fields");
        return;
      }
      const updatedTask = {
        ...selectedTask,
        title: newTask.title,
        description: newTask.description,
        dueDate: newTask.dueDate,
      };

      socket.emit("updateTask", updatedTask);

      setIsEditModalOpen(false);
      toast.success("Task updated successfully!");
    }
  };

  const handleSearch = async (search: string) => {
    const response = await searchItem(search);
    //  console.log('response',response)
    setTasks(response.data);
  };

  const handleDelete = (taskId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        socket.emit("deleteTask", taskId);

        Swal.fire("Deleted!", "Your task has been deleted.", "success");
      }
    });
  };
  return (
    <div className="min-h-screen ">
      <div className="container mx-auto p-4 lg:p-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center justify-between bg-purple-200 p-4 lg:p-6">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-600 mb-4 lg:mb-0">
              Task Manager
            </h1>
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search tasks..."
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-full bg-purple-100 text-purple-800 placeholder-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <Search
                  className="absolute left-3 top-2.5 text-purple-700"
                  size={18}
                />
              </div>
              <button
                className="w-full sm:w-auto bg-white text-purple-500 font-bold py-2 px-4 rounded-full inline-flex items-center justify-center transition duration-300 ease-in-out transform hover:scale-105 hover:bg-purple-50"
                onClick={() => setIsModalOpen(true)}
              >
                <Plus className="mr-2" size={20} />
                Add Task
              </button>
            </div>
          </div>

          <div className="p-4 lg:p-6 overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg">
              <thead className="bg-purple-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider ">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tasks.map((task, index) => (
                  <tr
                    key={task._id}
                    className="transition duration-150 ease-in-out hover:bg-gray-50"
                  >
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {task.title}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 ">
                      <div
                        className="cursor-pointer"
                        onClick={() => toggleDescription(task._id)}
                      >
                        {expandedTaskId === task._id ? (
                          task.description
                        ) : (
                          <div className="truncate max-w-xs">
                            {task.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium ">
                      <select
                        className="w-32 p-2 border  border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-150 ease-in-out"
                        value={task.status}
                        onChange={(e) =>
                          handleStatus(
                            task._id,
                            e.target.value as ITask["status"]
                          )
                        }
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="overdue">Overdue</option>
                      </select>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(task.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 flex gap-2">
                      <button
                        onClick={() => openEditModal(task)}
                        className="text-purple-600 hover:text-purple-900"
                      >
                        <MdEdit size={20} />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <FaTrashArrowUp
                          size={20}
                          onClick={() => handleDelete(task._id)}
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h2 className="text-2xl font-bold text-purple-600">
                Add New Task
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out"
              >
                <X size={24} />
              </button>
            </div>

            <input
              type="text"
              placeholder="Task Title"
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
            />

            <textarea
              placeholder="Task Description"
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
            />

            <DatePicker
              selected={newTask.dueDate}
              onChange={handleDateChange}
              inline
              minDate={new Date()}
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              dateFormat="dd/MM/yyyy"
            />

            <button
              onClick={handleAddTask}
              className="w-full bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 transition duration-150 ease-in-out"
            >
              Add Task
            </button>
          </div>
        </div>
      )}

      {isEditModalOpen && selectedTask && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Edit Task</h2>
            <input
              type="text"
              placeholder="Title"
              value={selectedTask.title}
              onChange={(e) =>
                setSelectedTask({
                  ...selectedTask,
                  title: e.target.value,
                })
              }
              className="border border-gray-300 p-2 rounded-lg w-full mb-2"
            />
            <textarea
              placeholder="Description"
              value={selectedTask.description}
              onChange={(e) =>
                setSelectedTask({
                  ...selectedTask,
                  description: e.target.value,
                })
              }
              className="border border-gray-300 p-2 rounded-lg w-full mb-2"
            />

            <DatePicker
              selected={selectedTask.dueDate}
              inline
              minDate={new Date()}
              onChange={(date) =>
                setSelectedTask({
                  ...selectedTask,
                  dueDate: date || new Date(),
                })
              }
              className="border border-gray-300 p-2 rounded-lg w-full mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleEditTask}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTask;
