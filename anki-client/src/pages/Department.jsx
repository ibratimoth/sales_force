import { useState, useEffect } from "react";
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../api";
import DepartmentModal from "../components/DepartmentModal";
import ConfirmationModal from "../components/ConfirmModal";
import Layout from "../components/Layout";
import { FaPlus } from "react-icons/fa";
import toast from "react-hot-toast";
import NProgress from "nprogress";

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      NProgress.start();
      const { data } = await getDepartments();
      setDepartments(data.data);
    } catch (err) {
      console.error(err);
      setDepartments([]);
    } finally {
      NProgress.done();
    }
  };

  const handleCreate = () => {
    setSelectedDepartment(null);
    setModalOpen(true);
  };

  const handleEdit = (department) => {
    setSelectedDepartment(department);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      NProgress.start();
      await deleteDepartment(deleteId);
      toast.success("Department deleted successfully!");
      setConfirmOpen(false);
      fetchDepartments();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete department.");
    } finally {
      NProgress.done();
    }
  };

  const handleSubmit = async (form) => {
    try {
      NProgress.start();
      if (selectedDepartment) {
        await updateDepartment(selectedDepartment.id, form);
        toast.success("Department updated successfully!");
      } else {
        await createDepartment(form);
        toast.success("Department created successfully!");
      }
      fetchDepartments();
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

        {/* Create Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 bg-sky-600 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-full font-semibold shadow hover:bg-sky-700"
          >
            <FaPlus />
            <span className="hidden sm:inline">Create Department</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-slate-200">
            <h2 className="text-slate-500 text-xs sm:text-sm font-semibold uppercase">
              Total Departments
            </h2>
            <p className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-2">
              {departments.length}
            </p>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-slate-200">
            <h2 className="text-slate-500 text-xs sm:text-sm font-semibold uppercase">
              Active Departments
            </h2>
            <p className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-2">
              {departments.length}
            </p>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-slate-200">
            <h2 className="text-slate-500 text-xs sm:text-sm font-semibold uppercase">
              Pending Actions
            </h2>
            <p className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-2">
              {departments.filter((d) => !d.name).length}
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <div className="min-w-full overflow-hidden rounded-xl shadow-md border border-slate-200 bg-white">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold uppercase text-slate-600">
                    Department Name
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold uppercase text-slate-600">
                    Department Label
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-center text-xs sm:text-sm font-semibold uppercase text-slate-600">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {departments.map((department) => (
                  <tr
                    key={department.id}
                    className="hover:bg-slate-50 transition-colors duration-150"
                  >
                    <td className="px-4 sm:px-6 py-3 text-lg font-medium text-slate-800">
                      {department.name}
                    </td>
                    <td className="px-4 sm:px-6 py-3 text-slate-500">
                      {department.label}
                    </td>
                    <td className="px-4 sm:px-6 py-3 flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-3">
                      <button
                        onClick={() => handleEdit(department)}
                        className="bg-emerald-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium hover:bg-emerald-600 transition-colors duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(department.id)}
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
        <DepartmentModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
          department={selectedDepartment}
        />
        <ConfirmationModal
          isOpen={confirmOpen}
          message="Are you sure you want to delete this department?"
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmOpen(false)}
        />
      </div>
    </Layout>
  );
}
