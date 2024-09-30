import { Routes, Route, Outlet } from "react-router-dom";
import Login from "./components/authetication/Login";
import Signup from "./components/authetication/Signup";
import OTPPage from "./components/authetication/Otp";
import { Toaster } from "react-hot-toast";
import PrivateRoute from "./route/PrivateRoute";

import Header from "./components/common/Header";
import Sidebar from "./components/common/Sidebar";
import Dashboard from "./components/dashboard/DashBoard";
import MyTask from "./components/dashboard/MyTasks";
import CompletedTasks from "./components/dashboard/CompletedTask";

function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/otp-page" element={<OTPPage />} />

        <Route element={<PrivateRoute />}>
          <Route
            element={
              <div className="flex flex-col h-screen">
                <Header />
                <div className="flex md:flex-row lg:flex-row flex-col overflow-hidden ">
                  <Sidebar />
                  <main className="flex-1 overflow-y-auto mt-6">
                    <Outlet />
                  </main>
                </div>
              </div>
            }
          >
            <Route path="/" element={<Dashboard />} />
            <Route path="/my-task" element={<MyTask />} />
            <Route path="/complete-task" element={<CompletedTasks />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
