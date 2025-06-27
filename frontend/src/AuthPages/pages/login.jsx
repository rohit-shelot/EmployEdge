import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();

  const [logininfo, setlogininfo] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setlogininfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = logininfo;

    if (!email || !password) {
      return toast.error("All Fields Required");
    }

    try {
      const response = await fetch("http://localhost:1000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(logininfo),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        localStorage.setItem("token", result.logintoken);
        localStorage.setItem("LoggedInUser", result.name);

        setIsAuthenticated(true);

        toast.success(result.message || "Login successful");

        navigate("/employees");
      } else {
        toast.error(result.message || "Login failed");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred during login");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 to-blue-700 flex items-center justify-center">
      <div className="w-[350px] bg-white rounded-xl p-8">
        <h1 className="text-center text-2xl text-blue-700 uppercase font-poppins font-bold mb-6">
          EmployEdge
        </h1>
        <h1 className="text-center text-2xl uppercase font-poppins font-bold mb-6">
          Login
        </h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <label className="text-[18px] font-medium">Email</label>
            <TextField
              name="email"
              label="Enter Email"
              variant="outlined"
              type="email"
              autoComplete="email"
              onChange={handleChange}
              value={logininfo.email}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[18px] font-medium ">Password</label>
            <TextField
              name="password"
              label="Enter Password"
              type="password"
              autoComplete="current-password"
              variant="outlined"
              onChange={handleChange}
              value={logininfo.password}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2  px-6 rounded transition-colors duration-300"
          >
            Submit
          </button>
          <h3 className="text-sm text-center">
            Don't have an Account?{" "}
            <span
              className="text-blue-600 hover:underline hover:cursor-pointer"
              onClick={() => {
                navigate("/signup");
              }}
            >
              Sign Up
            </span>
          </h3>
        </form>
      </div>
    </div>
  );
};

export default Login;
