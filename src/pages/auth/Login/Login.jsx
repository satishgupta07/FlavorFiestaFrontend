import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../../services/auth";
import { useForm } from "react-hook-form";
import { login } from "../../../store/authSlice";
import { notify } from "../../../services/toast";
import { getCart } from "../../../services/cart";
import { addItemToCart } from "../../../store/cartSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const loginForm = async (data) => {
    setError("");
    setIsLoading(true);
    try {
      const response = await authService.login(data);
      const { user, access_token } = response.data.data;

      if (user) {
        dispatch(login({ userData: user, jwtToken: access_token }));

        // Pre-load cart so Navbar badge is accurate immediately after login
        try {
          const cart = await getCart();
          dispatch(
            addItemToCart({
              itemCount: cart.data.data.items.length,
              items: cart.data.data.items,
            })
          );
        } catch {
          // Non-critical: cart badge will update on next cart page visit
        }

        notify("Welcome back!");
        navigate("/");
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Branding */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Welcome back</h1>
          <p className="mt-2 text-sm text-gray-500">
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold text-orange-500 hover:text-orange-600">
              Sign up
            </Link>
          </p>
        </div>

        <div className="bg-white shadow-sm border border-gray-200 rounded-2xl px-8 py-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(loginForm)} noValidate>
            {/* Email */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
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
              <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Your password"
                className={`w-full px-4 py-2.5 border rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition ${
                  errors.password ? "border-red-400 bg-red-50" : "border-gray-300"
                }`}
                {...register("password", { required: "Password is required" })}
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
              {isLoading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
