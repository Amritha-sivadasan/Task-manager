import React, { useEffect, useState } from "react";
import { CheckCircle, Calendar, Trash2 } from "lucide-react";
import { completeTask } from "../../service/api/taskApi";
import { ITask } from "./MyTasks";
import socket from "../../socket/socket";
import Swal from 'sweetalert2';

const CompletedTasks = () => {
  const [completedTasks, setCompletedTasks] = useState<ITask[]>([]);

  useEffect(()=>{
    socket.on("connect", () => {
      console.log("Successfully connected to the server!");
    });
    socket.on('taskDeleted',(taskId)=>{
      const updatedTasks = completedTasks.filter((task) => task._id !== taskId);
      setCompletedTasks(updatedTasks);
      console.log('updated task',updatedTasks)
    })

  },[completedTasks])
  useEffect(() => {
    const fetchAllTask = async () => {
      const response = await completeTask();
      console.log("response for complete task", response.data);
      setCompletedTasks(response.data);
    };
    fetchAllTask();
  }, []);

  const handleDeleteTask = (taskId: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {

        socket.emit('deleteTask',taskId)
       
        

        Swal.fire(
          'Deleted!',
          'Your task has been deleted.',
          'success'
        );
      }
    });
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
            Completed Tasks
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-purple-100">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    No.
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Task
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Description
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Due Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  ></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {completedTasks &&
                  completedTasks.map((task, index) => (
                    <tr key={task._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {index + 1}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                          <div className="text-sm font-medium text-gray-900">
                            {task.title}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 ">
                        <div className="cursor-pointer">
                          <div className="truncate max-w-xs">
                            {task.description}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          {task.status}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDeleteTask(task._id)}
                          className="text-red-600 hover:text-red-800 transition duration-150 ease-in-out"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-4 sm:px-6">
          <div className="text-sm">
            <span className="font-medium text-gray-500">
              Total completed tasks: {completedTasks.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompletedTasks;
