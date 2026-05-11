import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

import { useLoginMutation } from "../../services/authAPI";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/slices/authSlice";
const LoginForm = () => {
  const [role, setRole] = useState("admin");
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useLoginMutation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const dispatch = useDispatch();
 
const navigate = useNavigate();
const onSubmit = async (data) => {
  try {
    const res = await login({
      email: data.email,
      password: data.password,
      role: role,
    }).unwrap();

    console.log(res);

    // ✅ success check (already handled by backend)
    if (res.success) {
      toast.success(res.message || "Login successful 🚀");

      // ✅ Redux store update
      dispatch(
        setCredentials({
          user: res.data.user,
          token: res.data.token,
        })
      );

      // ✅ persist auth
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("userId", res.data.user.id);
      // ✅ role-based redirect (clean switch)
      const userRole = res.data.user.role;

      switch (userRole) {
        case "admin":
          navigate("/dashboard");
          break;

        case "teacher":
          navigate("/teacher");
          break;

        default:
          navigate("/");
      }
    } else {
      toast.error(res.message || "Login failed");
    }
  } catch (err) {
    toast.error(err?.data?.message || "Invalid credentials");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-50 to-white p-6">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* LEFT SIDE */}
        <div className="hidden lg:flex flex-col justify-center space-y-6">
          <h1 className="text-4xl font-bold text-blue-700">Attendance AI</h1>

          <p className="text-gray-600 text-lg">
            Streamline your institution with automated identity verification.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border bg-white shadow-sm">
              <p className="text-blue-600 text-2xl font-bold">99.8%</p>
              <p className="text-xs text-gray-500">AI Accuracy</p>
            </div>

            <div className="p-4 rounded-xl border bg-white shadow-sm">
              <p className="text-blue-600 text-2xl font-bold">2.4s</p>
              <p className="text-xs text-gray-500">Check-in Time</p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <Card className="p-6 w-full shadow-lg">
          <h2 className="text-2xl font-bold mb-1">Welcome back</h2>
          <p className="text-sm text-gray-500 mb-6">
            Enter your credentials to access dashboard
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* ROLE */}
            <div>
              <Label>Login As</Label>
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setRole("admin")}
                  className={`flex-1 py-2 rounded-md border ${
                    role === "admin" ? "bg-blue-600 text-white" : "bg-white"
                  }`}
                >
                  Admin
                </button>

                <button
                  type="button"
                  onClick={() => setRole("teacher")}
                  className={`flex-1 py-2 rounded-md border ${
                    role === "teacher" ? "bg-blue-600 text-white" : "bg-white"
                  }`}
                >
                  Teacher
                </button>
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="admin@attendance.ai"
                {...register("email", {
                  required: "Email is required",
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <Label>Password</Label>

              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password", {
                    required: "Password is required",
                  })}
                  className="pr-10"
                />

                {/* Toggle Button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                >
                  {showPassword ? (
                    /* Eye Off Icon */
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 012.243-3.592M6.228 6.228A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.056 10.056 0 01-4.132 5.411M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3l18 18"
                      />
                    </svg>
                  ) : (
                    /* Eye Icon */
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7
            -1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* REMEMBER */}
            {/* <div className="flex items-center gap-2">
              <input type="checkbox" />
              <span className="text-sm text-gray-500">
                Remember this device
              </span>
            </div> */}

            {/* BUTTON */}
            <Button className="w-full" disabled={isSubmitting}>
              Sign In →
            </Button>
          </form>

          {/* <p className="text-center text-sm text-gray-500 mt-4">
            New institution?{" "}
            <span className="text-blue-600 cursor-pointer">
              Contact sales
            </span>
          </p> */}
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;
