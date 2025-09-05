import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import NProgress from "nprogress";
import { login, getPermissionsByRole } from "../api";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/slices/authSlices";

export default function SigninSection() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    NProgress.start();

    try {
      const res = await login(form);
      const userData = res.data.data;
      console.log(userData.id);

      const permissionsRes = await getPermissionsByRole(userData.role_id);
      const permissions = permissionsRes.data.data.map(p => p.permission.name) || [];
      const role_name_set = new Set(permissionsRes.data.data.map(p => p.role.name));
      const role_name = [...role_name_set][0];
      console.log(role_name)
      dispatch(
        loginSuccess({
          user: {
            id: userData.id,
            name: userData.first_name,
            email: userData.email,
            role: userData.role_id,
            role_name: role_name
          },
          roleId: userData.role_id,
          permissions,
        })
      );

      toast.success("Signed in successfully!");

      if (role_name === "agent") {
        navigate("/agents");
      } else {
        navigate("/users");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Invalid email or password."
      );
    } finally {
      setLoading(false);
      NProgress.done();
    }
  }

  const EyeIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-5 h-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.575 3.01 9.963 7.172.08.38-.031.758-.266 1.034a1.012 1.012 0 0 1-1.392.35L12 12.5l-8.305 8.305a1.012 1.012 0 0 1-.35-1.392c.224-.276.602-.387.982-.265l4.305-4.305"
      />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

  const EyeSlashIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-5 h-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.988 5.485A1.017 1.017 0 0 0 2.455 6.471l1.533 1.533A8.825 8.825 0 0 0 12 12c.795 0 1.579-.115 2.32-.331m-2.147-2.147a3 3 0 1 1 4.243 4.243m-2.146-2.146L19.54 18.04A9.522 9.522 0 0 1 20 19.5c.036.19.066.381.093.571-1.304 4.07-5.242 7.08-9.963 7.08-4.721 0-8.659-3.01-9.963-7.08a1.012 1.012 0 0 1-.266-1.034c.034-.148.077-.294.126-.438l4.305-4.305"
      />
    </svg>
  );

  return (
    <div className="relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white">
      {/* Background gradient blob 1 */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>

      <div className="flex w-full max-w-sm flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
            alt="Your Company"
            className="mx-auto h-10 w-auto rounded-lg"
          />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  className="block w-full rounded-md border-0 bg-white/5 px-3 py-1.5 text-base text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:shadow-none sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Password
                </label>
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2 relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md border-0 bg-white/5 pr-10 pl-3 py-1.5 text-base text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:shadow-none sm:text-sm/6"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 focus:outline-none text-gray-400 hover:text-gray-500"
                >
                  {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`flex w-full justify-center rounded-md px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm
                  ${loading
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-500"}`}
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-500">
            Not a member?{" "}
            <a
              href="#"
              className="font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Start a 14 day free trial
            </a>
          </p>
        </div>
      </div>

      {/* Background gradient blob 2 */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
      >
        <div
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
    </div>
  );
}
