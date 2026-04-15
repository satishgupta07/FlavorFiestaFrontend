import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { updateProfile } from "../../../services/user";
import { updateUserData } from "../../../store/authSlice";
import { notify } from "../../../services/toast";
import Loader from "../../../components/Loader";

function Profile() {
  const user     = useSelector((state) => state.auth.userData);
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      name:            user?.name  || "",
      email:           user?.email || "",
      currentPassword: "",
      newPassword:     "",
    },
  });

  const onSubmit = async (data) => {
    const payload = {};
    if (data.name  !== user?.name)  payload.name  = data.name;
    if (data.email !== user?.email) payload.email = data.email;
    if (showPasswordFields && data.newPassword) {
      payload.currentPassword = data.currentPassword;
      payload.newPassword     = data.newPassword;
    }

    if (Object.keys(payload).length === 0) {
      notify("No changes to save");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await updateProfile(payload);
      const updated = res.data.data;
      // Reflect name/email changes in the Redux store so Navbar updates immediately
      dispatch(updateUserData(updated));
      notify("Profile updated successfully!");
      reset({ name: updated.name, email: updated.email, currentPassword: "", newPassword: "" });
      setShowPasswordFields(false);
    } catch (err) {
      notify(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-8">My Profile</h1>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          {/* Avatar banner */}
          <div className="bg-orange-500 h-20 flex items-end px-6 pb-0">
            <div className="w-16 h-16 rounded-full bg-white border-4 border-white shadow flex items-center justify-center translate-y-8">
              <span className="text-2xl font-bold text-orange-500">
                {user?.name?.[0]?.toUpperCase() || "?"}
              </span>
            </div>
          </div>

          <div className="px-6 pt-12 pb-6">
            <p className="text-sm text-gray-400 uppercase tracking-wider mb-6">
              {user?.role === "admin" ? "Administrator" : "Customer"}
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="profile-name">
                  Full name
                </label>
                <input
                  id="profile-name"
                  type="text"
                  className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent ${
                    errors.name ? "border-red-400" : "border-gray-300"
                  }`}
                  {...register("name", { required: "Name is required", minLength: { value: 3, message: "Min 3 characters" } })}
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="profile-email">
                  Email address
                </label>
                <input
                  id="profile-email"
                  type="email"
                  className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent ${
                    errors.email ? "border-red-400" : "border-gray-300"
                  }`}
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
              </div>

              {/* Change password toggle */}
              <button
                type="button"
                onClick={() => setShowPasswordFields((v) => !v)}
                className="text-sm text-orange-500 hover:text-orange-600 font-medium"
              >
                {showPasswordFields ? "− Hide password change" : "+ Change password"}
              </button>

              {showPasswordFields && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="cur-pass">
                      Current password
                    </label>
                    <input
                      id="cur-pass"
                      type="password"
                      className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent ${
                        errors.currentPassword ? "border-red-400" : "border-gray-300"
                      }`}
                      {...register("currentPassword", {
                        required: showPasswordFields ? "Current password is required" : false,
                      })}
                    />
                    {errors.currentPassword && (
                      <p className="mt-1 text-xs text-red-500">{errors.currentPassword.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="new-pass">
                      New password
                    </label>
                    <input
                      id="new-pass"
                      type="password"
                      className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent ${
                        errors.newPassword ? "border-red-400" : "border-gray-300"
                      }`}
                      {...register("newPassword", {
                        required:  showPasswordFields ? "New password is required" : false,
                        minLength: { value: 3, message: "Min 3 characters" },
                        maxLength: { value: 30, message: "Max 30 characters" },
                        pattern:   { value: /^[a-zA-Z0-9]+$/, message: "Letters and numbers only" },
                      })}
                    />
                    {errors.newPassword && (
                      <p className="mt-1 text-xs text-red-500">{errors.newPassword.message}</p>
                    )}
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={isSubmitting || (!isDirty && !showPasswordFields)}
                className="w-full inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl transition focus:outline-none focus:ring-2 focus:ring-orange-400 mt-2"
              >
                {isSubmitting && <Loader inline />}
                {isSubmitting ? "Saving…" : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Profile;
