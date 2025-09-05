import { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

export default function DepartmentModal({ isOpen, onClose, onSubmit, department }) {
  const [form, setForm] = useState({ name: '', label: '' });

  useEffect(() => {
    if (department) setForm(department);
    else setForm({ name: '', label: '' });
  }, [department]);

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
      {/* Disable backdrop click */}
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
              className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative"
              onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it
            >
              <Dialog.Title className="text-xl font-semibold mb-4">
                {department ? 'Edit Department' : 'Create Department'}
              </Dialog.Title>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Name"
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <input
                    name="label"
                    value={form.label}
                    onChange={handleChange}
                    placeholder="Label"
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

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
