import React, { useState } from "react";
import { CheckCircle, Calendar, Clock, Trash2 } from "lucide-react";

const CompletedTasks = () => {
  const [completedTasks, setCompletedTasks] = useState([
    {
      id: 1,
      title: "Finish project proposal",
      completedDate: "2024-09-25",
      timeTaken: "3 days",
    },
    {
      id: 2,
      title: "Review team performance",
      completedDate: "2024-09-27",
      timeTaken: "2 hours",
    },
    {
      id: 3,
      title: "Update website content",
      completedDate: "2024-09-28",
      timeTaken: "4 hours",
    },
    {
      id: 4,
      title: "Prepare quarterly report",
      completedDate: "2024-09-29",
      timeTaken: "2 days",
    },
  ]);

  const handleDeleteTask = (id: number) => {
    setCompletedTasks(completedTasks.filter((task) => task.id !== id));
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
            Completed Tasks
          </h2>
          <div className="space-y-4">
            {completedTasks.map((task) => (
              <div
                key={task.id}
                className="bg-green-50 rounded-lg p-4 flex items-center justify-between transition duration-300 ease-in-out hover:shadow-md"
              >
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {task.title}
                    </h3>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {task.completedDate}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {task.timeTaken}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="text-red-600 hover:text-red-800 transition duration-150 ease-in-out"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
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
