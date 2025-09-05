import { useState, useEffect } from "react";
import { getUsers, createUser, updateUser, deleteUser, getPermissionsByRole } from "../api";
import UserModal from "../components/UserModal";
import ConfirmationModal from "../components/ConfirmModal";
import Layout from "../components/Layout";
import toast from 'react-hot-toast';
import { FaPlus } from "react-icons/fa";
import NProgress from 'nprogress';
import { useDispatch } from "react-redux";
import { updateSuccess } from "../store/slices/authSlices";

export default function Dashboard() {

  const [users, setUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      NProgress.start();
      const { data } = await getUsers();
      setUsers(data.data);
    } catch (err) {
      console.error(err);
      setUsers([]);
    } finally {
      NProgress.done();
    }
  };

  const handleCreate = () => {
    setSelectedUser(null);
    setModalOpen(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      NProgress.start();
      await deleteUser(deleteId);
      toast.success("User deleted successfully!");
      setConfirmOpen(false);
      fetchUsers();
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Failed to delete user";
      toast.error(message);
    } finally {
      NProgress.done();
    }
  };

  const handleSubmit = async (form) => {
    try {
      NProgress.start();
      if (selectedUser) {
        const res = await updateUser(selectedUser.id, form);
        const userData = res.data.data;

        const permissionsRes = await getPermissionsByRole(userData.role_id);
        const permissions = permissionsRes.data.data.map(p => p.permission.name) || [];

        dispatch(
          updateSuccess({
            user: {
              id: userData.id,
              name: userData.first_name,
              email: userData.email,
              role: userData.role_id,
            },
            roleId: userData.role_id,
            permissions,
          })
        );

        toast.success("User updated successfully!");
      } else {
        await createUser(form);
        toast.success("User created successfully!");
      }

      fetchUsers();
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Something went wrong";
      toast.error(message);
    } finally {
      NProgress.done();
    }
  };

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Create User button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 bg-sky-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold shadow hover:bg-sky-700"
          >
            <FaPlus />
            <span className="hidden sm:inline">Create User</span>
          </button>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-slate-200">
            <h2 className="text-slate-500 text-xs sm:text-sm font-semibold uppercase">Total Users</h2>
            <p className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-2">{users.length}</p>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-slate-200">
            <h2 className="text-slate-500 text-xs sm:text-sm font-semibold uppercase">Active Users</h2>
            <p className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-2">{users.length}</p>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-slate-200">
            <h2 className="text-slate-500 text-xs sm:text-sm font-semibold uppercase">Pending Actions</h2>
            <p className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-2">
              {users.filter((u) => !u.email).length}
            </p>
          </div>
        </div>

        {/* Users table */}
        <div className="overflow-x-auto rounded-xl shadow-md border border-slate-200 bg-white">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold uppercase text-slate-600">Name</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold uppercase text-slate-600">Email</th>
                <th className="px-4 sm:px-6 py-3 text-center text-xs sm:text-sm font-semibold uppercase text-slate-600">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="px-4 sm:px-6 py-2 sm:py-4 text-sm sm:text-lg font-medium text-slate-800">{user.first_name}</td>
                  <td className="px-4 sm:px-6 py-2 sm:py-4 text-sm sm:text-slate-500">{user.email}</td>
                  <td className="px-4 sm:px-6 py-2 sm:py-4 flex flex-col sm:flex-row justify-center sm:space-x-2 gap-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className="bg-emerald-500 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg hover:bg-emerald-600 text-xs sm:text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="bg-rose-500 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg hover:bg-rose-600 text-xs sm:text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <UserModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        user={selectedUser}
      />
      <ConfirmationModal
        isOpen={confirmOpen}
        message="Are you sure you want to delete this user?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </Layout>
  );
}
