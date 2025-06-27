import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const navigate = useNavigate();

  const [signupinfo, setsignupinfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setsignupinfo({ ...signupinfo, [name]: value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, password } = signupinfo;
    if (!name || !email || !password) {
      return toast.error("All fields are required");
    }

    try {
      setLoading(true);
      const url = "http://localhost:1000/api/auth/signup";
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupinfo),
      });
      const result = await response.json();
      setLoading(false);

      if (response.ok) {
        toast.success(result.message||'Account Created Successfully');
        navigate("/login");
        setTimeout(() => {
        }, 1000);
      } else {
        toast.error(result.message || "Signup failed");
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.message || "An error occurred during signup");
    }
  };

  return (
    <>
    <ToastContainer/>
    <div className="min-h-screen bg-gradient-to-br from-blue-300 to-blue-700 flex items-center justify-center">
      <div className="w-[350px]  bg-white rounded-xl p-8 shadow-xl">
                <h1 className="text-center text-2xl text-blue-700 uppercase font-poppins font-bold mb-2">
          EmployEdge
        </h1>
        <h1 className="text-center text-2xl uppercase font-bold text-gray-800 mb-6">
          Sign Up
        </h1>
        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          {/* Name */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-700">Name</label>
            <TextField
              name="name"
              label="Enter Name"
              variant="outlined"
              size="small"
              onChange={handleChange}
              value={signupinfo.name}
              required
              fullWidth
              />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-700">Email</label>
            <TextField
              name="email"
              label="Enter Email"
              type="email"
              autoComplete="email"
              variant="outlined"
              size="small"
              onChange={handleChange}
              value={signupinfo.email}
              required
              fullWidth
              />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-700">Password</label>
            <TextField
              name="password"
              label="Enter Password"
              type="password"
              autoComplete="current-password"
              variant="outlined"
              size="small"
              onChange={handleChange}
              value={signupinfo.password}
              required
              fullWidth
              />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded transition-colors duration-300 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
              >
            {loading ? "Submitting..." : "Submit"}
          </button>

          {/* Already have account */}
          <p className="text-sm text-center  text-gray-700">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-blue-600 hover:underline cursor-pointer"
              >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
              </>
  );
};

export default Signup;
