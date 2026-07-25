"use client";

import { base_url } from "@/components/utils";
import axios from "axios";
import {

  FiEye,
  FiEyeOff,
  FiLock,
  FiLogIn,
  FiMail,
  FiShield,
} from "react-icons/fi";
import React, { useState } from "react";
import { toast } from "react-toastify";



const LoginPage = () => {

 
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
 

  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });

  const handleLoginInput = (event) => {
    const { name, value } = event.target;

    setLoginDetails((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    if (loginLoading) return;

    try {
      setLoginLoading(true);

      const response = await axios.post(
        `${base_url}/profile/login`,
        loginDetails,{
            withCredentials:true
        }
      );

      const data = response.data;

      if (!data.success) {
        toast.error(data.message || "Unable to send OTP");
        return;
      }

    
    

      toast.success(data.message || "OTP sent successfully");
window.location.href = "/";
    
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoginLoading(false);
    }
  };


  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-4 py-10 text-black">
      {/* Background decoration */}
      <div className="pointer-events-none absolute left-[-100px] top-[-100px] h-80 w-80 rounded-full bg-slate-100 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-100px] right-[-100px] h-80 w-80 rounded-full bg-slate-100 blur-3xl" />

      <section className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-200/70 sm:p-9">
        <div className="mb-8 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-black text-white shadow-lg shadow-black/20">
           
              <FiLock className="text-3xl" />
            
          </div>
        </div>

       
          <>
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-black">
                Welcome back
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Enter your account details to continue
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email address
                </label>

                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-500" />

                  <input
                    type="email"
                    name="email"
                    value={loginDetails.email}
                    onChange={handleLoginInput}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white py-3.5 pl-12 pr-4 text-black outline-none transition placeholder:text-slate-400 focus:border-black focus:ring-4 focus:ring-black/5"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Password
                </label>

                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-500" />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={loginDetails.password}
                    onChange={handleLoginInput}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white py-3.5 pl-12 pr-12 text-black outline-none transition placeholder:text-slate-400 focus:border-black focus:ring-4 focus:ring-black/5"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((previous) => !previous)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-slate-500 transition hover:text-black"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-black px-5 py-3.5 font-semibold text-white shadow-lg shadow-black/15 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loginLoading ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Loading...
                  </>
                ) : (
                  <>
                    Continue
                    <FiLogIn />
                  </>
                )}
              </button>
            </form>
          </>
       
      </section>
    </main>
  );
};

export default LoginPage;