import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import DatePicker CSS
import { Plus, X, Search } from "lucide-react";
import { useAppSelector } from "../../hooks/hook";
import socket from "../../socket/socket";
import { getTask } from "../../service/api/taskApi";
import toast from "react-hot-toast";

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
  useEffect(() => {
    if (!user) {
      return;
    }
    const fetchAllTask = async () => {
      const response = await getTask();

      if (response.success) {
        setTasks(response.data);
      }
    };
    fetchAllTask();
  }, [user]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState<Omit<ITask, "_id">>({
    title: "",
    description: "",
    status: "pending",
    dueDate: new Date(),
    userId: user?._id,
  });
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

    return () => {
      socket.off("taskAdded");
    };
  }, [user?._id]);

  const handleAddTask = () => {
    if ((newTask.title.trim() == "", newTask.description.trim() == "")) {
      toast.error("Please Fill The Fields");
      return;
    }

    if (newTask.title.trim() !== "" && newTask.description.trim() !== "") {
      socket.emit("addnewTask", newTask);
    }
  };
  const handleStatus = (id: string, status: ITask["status"]) => {
    socket.emit("updateStatus", id, status);
    setTasks((prev) => prev.map((t) => (t._id == id ? { ...t, status } : t)));
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setNewTask({ ...newTask, dueDate: date });
    }
  };
  return (
    <div className="min-h-screen ">
      <div className="container mx-auto p-8">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between bg-purple-200 p-6">
            <h1 className="text-3xl font-bold text-gray-600">Task Manager</h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search tasks..."
                  className="pl-10 pr-4 py-2 rounded-full bg-purple-100 text-purple-800 placeholder-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <Search
                  className="absolute left-3 top-2.5 text-purple-700"
                  size={18}
                />
              </div>
              <button
                className="bg-white text-purple-500 font-bold py-2 px-4 rounded-full inline-flex items-center transition duration-300 ease-in-out transform hover:scale-105 hover:bg-purple-50"
                onClick={() => setIsModalOpen(true)}
              >
                <Plus className="mr-2" size={20} />
                Add Task
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
              <div className="overflow-x-auto">
                {" "}
                {/* Add horizontal scrolling */}
                <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                  <thead className="bg-purple-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">
                        Due Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {tasks &&
                      tasks.map((task, index) => (
                        <tr
                          key={task._id}
                          className=" transition duration-150 ease-in-out"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {task.title}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {task.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <select
                              className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-150 ease-in-out"
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
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(task.dueDate).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>{" "}
              {/* End horizontal scrolling container */}
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl w-[800px] shadow-2xl">
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

            <div className="grid grid-cols-2 gap-6">
              <div>
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
                  className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 h-32"
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                />

                <button
                  className="bg-gradient-to-r from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600 text-white font-bold py-3 px-4 rounded-lg w-full transition duration-300 ease-in-out transform hover:scale-105"
                  onClick={handleAddTask}
                >
                  Add Task
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date
                </label>
                <DatePicker
                  selected={newTask.dueDate}
                  onChange={(date) => handleDateChange(date)}
                  inline
                  calendarClassName="custom-datepicker "
                  className="w-full border border-gray-300 rounded-lg shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTask;
