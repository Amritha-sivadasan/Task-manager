import { Home, CheckSquare, Square, Menu, X } from "lucide-react"; // Import Menu and X icons
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const path = useLocation();

  return (
    <div className="flex ">
      <button
        className="md:hidden absolute p-1   focus:outline-none flex"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      <aside
        className={`w-64  border shadow-sm  h-screen p-4 md:block ${
          isOpen ? "block" : "hidden"
        }`}
      >
        <nav>
          <ul className="space-y-2">
            <li>
              <Link
                to="/"
                className={`flex items-center space-x-2 p-2 rounded hover:bg-purple-200 ${
                  path.pathname == "/" && "bg-purple-200"
                }`}
                onClick={() => setIsOpen(!isOpen)}
              >
                <Home size={20} />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to="/my-task"
                className={`flex items-center space-x-2 p-2 rounded hover:bg-purple-200 ${
                  path.pathname == "/my-task" && "bg-purple-200"
                }`}
                onClick={() => setIsOpen(!isOpen)}
              >
                <Square size={20} />
                <span>My Tasks</span>
              </Link>
            </li>
            <li>
              <Link
                to="/complete-task"
                className={`flex items-center space-x-2 p-2 rounded hover:bg-gray-200 ${
                  path.pathname == "/complete-task" && "bg-purple-200"
                }`}
                onClick={() => setIsOpen(!isOpen)}
              >
                <CheckSquare size={20} />
                <span>Completed Tasks</span>
              </Link>
            </li>
          
          </ul>
        </nav>
      </aside>
    </div>
  );
};

export default Sidebar;
