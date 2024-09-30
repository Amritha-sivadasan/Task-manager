import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";
import { alldetails } from "../../service/api/taskApi";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement
);

const Dashboard = () => {
  const [totalTasks, setTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [completionRate, setcompletionRate] = useState(0);
  const [category, setTasksByCategory] = useState({});
  const [status, setStatus] = useState({});

  useEffect(() => {
    const fetchAll = async () => {
      const response = await alldetails();
      console.log("response whole data", response);
      setTasks(response.totalTasks);
      setCompletedTasks(response.completedTasks);
      setcompletionRate(response.completionRate);
      setTasksByCategory(response.tasksByCategory);
      setStatus(response.taskCompletionStatus);
    };
    fetchAll();
  }, []);

  const tasksByCategory = {
    labels: ["Work", "Study", "Health", "Personal", "Uncategorized"],
    datasets: [
      {
        label: "Number of Tasks",
        data: Object.values(category || {}),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const taskCompletionStatus = {
    labels: ["Completed", "In Progress", "Not Started"],
    datasets: [
      {
        data: Object.values(status),
        backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384"],
      },
    ],
  };

  const taskCreationOverTime = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Tasks Created",
        data: [20, 40, 30, 50],
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Task Manager Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Tasks</h3>
          <p className="text-2xl font-bold">{totalTasks}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Completed Tasks</h3>
          <p className="text-2xl font-bold">{completedTasks}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Completion Rate</h3>
          <p className="text-2xl font-bold">{completionRate}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-4 rounded-lg shadow w-4/6">
          <h3 className="text-lg font-semibold mb-4">Task Completion Status</h3>
          <Pie data={taskCompletionStatus} options={{ responsive: true }} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Tasks by Category</h3>
          <Bar data={tasksByCategory} options={{ responsive: true }} />
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">
            Task Creation Over Time
          </h3>
          <Line data={taskCreationOverTime} options={{ responsive: true }} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
