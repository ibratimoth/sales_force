import { useState, useEffect, Fragment } from "react";
import { getDepartments, getRoles } from "../api";
import { Dialog, Transition } from "@headlessui/react";

export default function UserModal({ isOpen, onClose, onSubmit, user }) {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    dep_id: "",
    role_id: ""
  });
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    if (user) {
      setForm({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        password: "",
        dep_id: user.dep_id || "",
        role_id: user.role_id || ""
      });
    } else {
      setForm({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        dep_id: "",
        role_id: ""
      });
    }
  }, [user]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const { data } = await getDepartments();
        setDepartments(data.data);
      } catch (err) {
        console.error("Error loading departments", err);
      }
    };

    const fetchRoles = async () => {
      try {
        const { data } = await getRoles();
        setRoles(data.data);
      } catch (err) {
        console.error("Error loading Roles", err);
      }
    };
    fetchDepartments();
    fetchRoles();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      {/* Disable backdrop click by ignoring onClose on Dialog */}
      <Dialog as="div" className="relative z-50" onClose={() => {}}>
        {/* Overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        {/* Modal panel */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel
              className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative"
              onClick={(e) => e.stopPropagation()} // Stop clicks from closing modal
            >
              <Dialog.Title className="text-xl font-semibold mb-4">
                {user ? "Edit User" : "Create User"}
              </Dialog.Title>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  name="first_name"
                  value={form.first_name}
                  onChange={handleChange}
                  placeholder="First Name"
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  name="last_name"
                  value={form.last_name}
                  onChange={handleChange}
                  placeholder="Last Name"
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  name="dep_id"
                  value={form.dep_id}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Department</option>
                  {departments.map((dep) => (
                    <option key={dep.id} value={dep.id}>
                      {dep.name}
                    </option>
                  ))}
                </select>
                <select
                  name="role_id"
                  value={form.role_id}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Roles</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>

                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Save
                  </button>
                </div>
              </form>

              <button
                onClick={onClose}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
