import { useState, useEffect } from "react";
import {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
  getPermissionsByRole,
  assignPermission,
} from "../api";
import RoleModal from "../components/RoleModal";
import ConfirmationModal from "../components/ConfirmModal";
import Layout from "../components/Layout";
import { FaPlus } from "react-icons/fa";
import toast from "react-hot-toast";
import NProgress from "nprogress";
import { setPermissions } from "../store/slices/authSlices";
import { useDispatch } from "react-redux";

export default function RoleDashboard() {
  const [roles, setRoles] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      NProgress.start();
      const { data } = await getRoles();
      setRoles(data.data);
    } catch (err) {
      console.error(err);
      setRoles([]);
    } finally {
      NProgress.done();
    }
  };

  const handleCreate = () => {
    setSelectedRole(null);
    setModalOpen(true);
  };

  const handleEdit = async (role) => {
    try {
      NProgress.start();
      const { data } = await getPermissionsByRole(role.id);
      setSelectedRole({ ...role, permissions: data.data });
      setModalOpen(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch role permissions.");
    } finally {
      NProgress.done();
    }
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      NProgress.start();
      await deleteRole(deleteId);
      toast.success("Role deleted successfully!");
      setConfirmOpen(false);
      fetchRoles();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete role.");
    } finally {
      NProgress.done();
    }
  };

  const handleSubmit = async ({ role, permissions }) => {
    try {
      NProgress.start();
      let roleId;
      if (selectedRole) {
        await updateRole(selectedRole.id, role);
        roleId = selectedRole.id;
        toast.success("Role updated successfully!");
      } else {
        const { data } = await createRole(role);
        roleId = data.data.id;
        toast.success("Role created successfully!");
      }

      await assignPermission(roleId, permissions);
      const permissionsRes = await getPermissionsByRole(roleId);
      const permission = permissionsRes.data.data.map(p => p.permission.name) || [];
      if (permission) {
        dispatch(setPermissions(permission));
      }

      fetchRoles();
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Operation failed. Please try again.");
    } finally {
      NProgress.done();
    }
  };

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Top button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 bg-sky-600 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-full font-semibold shadow hover:bg-sky-700"
          >
            <FaPlus />
            <span className="hidden sm:inline">Create Role</span>
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <div className="min-w-full overflow-hidden rounded-xl shadow-md border border-slate-200 bg-white">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold uppercase text-slate-600">
                    Role
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-center text-xs sm:text-sm font-semibold uppercase text-slate-600">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {roles.map((role) => (
                  <tr
                    key={role.id}
                    className="hover:bg-slate-50 transition-colors duration-150"
                  >
                    <td className="px-4 sm:px-6 py-3 text-lg font-medium text-slate-800">
                      {role.name}
                    </td>
                    <td className="px-4 sm:px-6 py-3 flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-3">
                      <button
                        onClick={() => handleEdit(role)}
                        className="bg-emerald-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium hover:bg-emerald-600 transition-colors duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(role.id)}
                        className="bg-rose-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium hover:bg-rose-600 transition-colors duration-200"
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
        <RoleModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
          role={selectedRole}
        />
        <ConfirmationModal
          isOpen={confirmOpen}
          message="Are you sure you want to delete this role?"
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmOpen(false)}
        />
      </div>
    </Layout>
  );
}
