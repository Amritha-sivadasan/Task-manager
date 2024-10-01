import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { logout } from "../../slice/userSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/hook";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    dispatch(logout());

    navigate("/login");

    setIsDropdownOpen(false);
  };

  return (
    <header className="w-full bg-purple-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-bold">Task Mate</h1>
        </div>

        <div className="flex gap-3 ">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-purple-600 font-bold">
            {user?.name ? user.name.charAt(0) : "U"}{" "}
          </div>
          <div className="relative mt-1">
            <button
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <span>{user?.name}</span>
              {isDropdownOpen ? <ChevronUp /> : <ChevronDown size={20} />}
            </button>
            {isDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-48 bg-white rounded-md overflow-hidden shadow-xl z-10 cursor-pointer hover:bg-gray-100"
                onClick={handleLogout}
              >
                <button className="block px-4 py-2 text-sm text-gray-700 ">
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
