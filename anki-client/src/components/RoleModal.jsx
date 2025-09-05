import { useState, useEffect, Fragment } from "react";
import { getAllPermissions } from "../api";
import { Dialog, Transition } from "@headlessui/react";

export default function RoleModal({ isOpen, onClose, onSubmit, role }) {
    const [name, setName] = useState("");
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [permissionsByGroup, setPermissionsByGroup] = useState({});

    useEffect(() => {
        if (role) {
            setName(role.name || "");
            setSelectedPermissions(role.permissions?.map((p) => p.permission_id) || []);
        } else {
            setName("");
            setSelectedPermissions([]);
        }
    }, [role]);

    useEffect(() => {
        fetchPermissions();
    }, []);

    const fetchPermissions = async () => {
        try {
            const { data } = await getAllPermissions();
            const grouped = data.data.reduce((acc, perm) => {
                if (!acc[perm.group]) acc[perm.group] = [];
                acc[perm.group].push(perm);
                return acc;
            }, {});
            setPermissionsByGroup(grouped);
        } catch (err) {
            console.error("Failed to fetch permissions:", err);
        }
    };

    const togglePermission = (id) => {
        setSelectedPermissions((prev) =>
            prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
        );
    };

    const handleSubmit = () => {
        onSubmit({
            role: { name },
            permissions: selectedPermissions,
        });
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

                {/* Modal content */}
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
                            className="bg-white rounded-xl shadow-xl p-6 max-w-2xl w-full"
                            onClick={(e) => e.stopPropagation()} // Stop clicks from closing modal
                        >
                            <Dialog.Title className="text-lg font-bold">
                                {role ? "Edit Role" : "Create Role"}
                            </Dialog.Title>

                            {/* Role Name */}
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-slate-700">Role Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500"
                                />
                            </div>

                            {/* Permissions grouped */}
                            <div className="mt-6 max-h-64 overflow-y-auto">
                                {Object.keys(permissionsByGroup).map((groupName) => (
                                    <div key={groupName} className="mb-4">
                                        <h3 className="text-slate-600 font-semibold mb-2">{groupName}</h3>
                                        <div className="grid grid-cols-2 gap-2">
                                            {permissionsByGroup[groupName].map((perm) => (
                                                <label key={perm.id} className="flex items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedPermissions.includes(perm.id)}
                                                        onChange={() => togglePermission(perm.id)}
                                                    />
                                                    <span>{perm.label || perm.name}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Buttons */}
                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 bg-slate-200 rounded-lg hover:bg-slate-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
                                >
                                    Save
                                </button>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
}
