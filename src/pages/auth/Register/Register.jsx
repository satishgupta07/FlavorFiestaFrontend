import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../../services/auth";
import { useForm } from "react-hook-form";
import { login } from "../../../store/authSlice";
import { notify } from "../../../services/toast";

const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const create = async (data) => {
    setError("");
    setIsLoading(true);
    try {
      const response = await authService.createAccount(data);
      // Bug fix: destructure both user AND access_token so the JWT is stored
      const { user, access_token } = response.data.data;
      if (user) {
        notify("Account created successfully!");
        dispatch(login({ userData: user, jwtToken: access_token }));
        navigate("/");
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Branding */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Create an account</h1>
          <p className="mt-2 text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-orange-500 hover:text-orange-600">
              Sign in
            </Link>
          </p>
        </div>

        <div className="bg-white shadow-sm border border-gray-200 rounded-2xl px-8 py-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(create)} noValidate>
            {/* Name */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="name">
                Full name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Jane Doe"
                className={`w-full px-4 py-2.5 border rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition ${
                  errors.name ? "border-red-400 bg-red-50" : "border-gray-300"
                }`}
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="reg-email">
                Email address
              </label>
              <input
                id="reg-email"
                type="email"
                placeholder="you@example.com"
                className={`w-full px-4 py-2.5 border rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition ${
                  errors.email ? "border-red-400 bg-red-50" : "border-gray-300"
                }`}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                    message: "Enter a valid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="reg-password">
                Password
              </label>
              <input
                id="reg-password"
                type="password"
                placeholder="At least 3 characters"
                className={`w-full px-4 py-2.5 border rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition ${
                  errors.password ? "border-red-400 bg-red-50" : "border-gray-300"
                }`}
                {...register("password", {
                  required: "Password is required",
                  pattern: {
                    value: /^[a-zA-Z0-9]{3,30}$/,
                    message: "3–30 alphanumeric characters",
                  },
                })}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
            >
              {isLoading ? "Creating account…" : "Create account"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Register;
