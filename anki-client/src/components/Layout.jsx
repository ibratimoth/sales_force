// src/components/Layout.js
import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaUsers,
  FaCog,
  FaUserCircle,
  FaUserShield,
  FaBars,
  FaTimes,
  FaMapMarkerAlt, // Agents icon
  FaChartPie, // Manager Dashboard icon
} from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlices";
import { can } from "../utils/permissions";

export default function Layout({ children }) {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // mobile sidebar
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const { user, permissions } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleSignOut = () => {
    dispatch(logout());
    setIsProfileDropdownOpen(false);
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleProfileDropdown = () =>
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const navLinkClass = ({ isActive }) =>
    `flex items-center w-full px-4 py-3 rounded-lg text-lg font-medium transition-colors duration-200 ${
      isActive
        ? "bg-slate-700 text-white"
        : "hover:bg-slate-700 text-slate-300"
    }`;

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex md:flex-col w-64 bg-slate-900 text-slate-200 p-4 shadow-xl">
        <div className="text-3xl font-extrabold text-white p-4">{user?.role_name}</div>
        <nav className="flex-1 space-y-2 py-6">
          {can(permissions, "view_users") && (
            <NavLink to="/users" className={navLinkClass}>
              <FaUsers className="mr-3 text-sky-400" /> Users
            </NavLink>
          )}

          {can(permissions, "view_departments") && (
            <NavLink to="/departments" className={navLinkClass}>
              <FaCog className="mr-3 text-sky-400" /> Departments
            </NavLink>
          )}

          {can(permissions, "view_roles") && (
            <NavLink to="/roles" className={navLinkClass}>
              <FaUserShield className="mr-3 text-sky-400" /> Roles
            </NavLink>
          )}

          {can(permissions, "view_roles") && (
            <NavLink to="/manager" className={navLinkClass}>
              <FaChartPie className="mr-3 text-sky-400" /> Manager
            </NavLink>
          )}

          {can(permissions, "view_tasks") && (
            <NavLink to="/agents" className={navLinkClass}>
              <FaMapMarkerAlt className="mr-3 text-sky-400" /> Agents
            </NavLink>
          )}
        </nav>
        <div className="mt-auto border-t border-slate-700 pt-4">
          <div className="flex items-center text-slate-400">
            <FaUser className="mr-3 text-xl" />
            <span>{user?.role_name}</span>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity md:hidden ${
          isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={toggleSidebar}
      ></div>

      {/* Sidebar - Mobile */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-200 p-4 transform transition-transform md:hidden ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="text-3xl font-extrabold text-white">Admin.</div>
          <button onClick={toggleSidebar} className="text-white text-2xl">
            <FaTimes />
          </button>
        </div>
        <nav className="flex flex-col space-y-2">
          {can(permissions, "view_users") && (
            <NavLink
              to="/users"
              className={navLinkClass}
              onClick={toggleSidebar}
            >
              <FaUsers className="mr-3 text-sky-400" /> Users
            </NavLink>
          )}

          {can(permissions, "view_departments") && (
            <NavLink
              to="/departments"
              className={navLinkClass}
              onClick={toggleSidebar}
            >
              <FaCog className="mr-3 text-sky-400" /> Departments
            </NavLink>
          )}

          {can(permissions, "view_roles") && (
            <NavLink
              to="/roles"
              className={navLinkClass}
              onClick={toggleSidebar}
            >
              <FaUserShield className="mr-3 text-sky-400" /> Roles
            </NavLink>
          )}

          {can(permissions, "view_roles") && (
            <NavLink
              to="/manager"
              className={navLinkClass}
              onClick={toggleSidebar}
            >
              <FaChartPie className="mr-3 text-sky-400" /> Manager 
            </NavLink>
          )}

          {can(permissions, "view_tasks") && (
            <NavLink
              to="/agents"
              className={navLinkClass}
              onClick={toggleSidebar}
            >
              <FaMapMarkerAlt className="mr-3 text-sky-400" /> Agents
            </NavLink>
          )}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col md:ml-0">
        {/* Header */}
        <header className="flex justify-between items-center p-4 sm:p-6 bg-white shadow-md">
          <div className="flex items-center gap-4">
            {/* Mobile hamburger */}
            <button
              className="md:hidden text-slate-800 text-2xl"
              onClick={toggleSidebar}
            >
              <FaBars />
            </button>
            <h1 className="text-3xl font-extrabold text-slate-900">
              Dashboard
            </h1>
          </div>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleProfileDropdown}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-800"
            >
              <FaUserCircle className="text-4xl" />
            </button>

            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-10">
                <div className="px-4 py-2 text-sm text-slate-800 border-b border-slate-200">
                  <span>{user?.name || "Admin"}</span>
                  <p className="font-semibold">
                    {user?.email || "admin@example.com"}
                  </p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-slate-100"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6">{children}</main>

        {/* Footer */}
        <footer className="bg-white text-center py-4 border-t border-slate-200 text-slate-500 text-sm">
          © {new Date().getFullYear()} Admin Dashboard. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
