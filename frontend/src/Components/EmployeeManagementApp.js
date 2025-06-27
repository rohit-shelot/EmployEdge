import React, { useState, useEffect } from "react";
import { GetAllEmployees } from "../api";
import EmployeeTable from "./EmployeeTable";
import AddEmployee from "./AddEmployee";
import { ToastContainer } from "react-toastify";
import { notify } from "../utils";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EmployeeManagementApp = () => {
  const [showModal, setShowModal] = useState(false);
  const [employeeObj, setEmployeeObj] = useState(null);
  const [employeesData, setEmployeesData] = useState({
    employees: [],
    pagination: {
      currentPage: 1,
      pageSize: 5,
      totalEmployees: 0,
      totalPages: 0,
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); 

  const fetchEmployees = async (search = "", page = 1, limit = 5) => {
    setLoading(true);
    setError(null);
    try {
      const data = await GetAllEmployees(search, page, limit);
      console.log("Fetched Employee Data:", data); 

      if (data?.success && data?.employees) {
        setEmployeesData({
          employees: data.employees,
          pagination: {
            currentPage: data.currentPage || 1,
            pageSize: limit,
            totalEmployees: data.totalEmployees || 0,
            totalPages: data.totalPages || 1,
          },
        });
      } else {
        setEmployeesData({
          employees: [],
          pagination: {
            currentPage: 1,
            pageSize: 5,
            totalEmployees: 0,
            totalPages: 1,
          },
        });
      }
    } catch (err) {
      setError(err.message);
      notify("Error fetching employees", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchWithTimeout = async () => {
      try {
        await fetchEmployees();
      } catch (err) {
        console.error("Initial fetch error:", err);
      }
    };
    fetchWithTimeout();
  }, []);

  const handleSearch = (e) => {
    fetchEmployees(e.target.value);
  };

  const handleUpdateEmployee = (emp) => {
    setEmployeeObj(emp);
    setShowModal(true);
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:1000/api/auth/logout",
        {},
        { withCredentials: true },
    );
    setTimeout(()=>{

        navigate("/login");
    },1000)
    notify("Logout Succesful", "success");
    localStorage.removeItem('LoggedInUser')
    localStorage.removeItem('token')
    } catch (error) {
      console.error("Logout failed", error);
      notify("Logout failed", "error");
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column align-items-center justify-content-start bg-primary py-4 px-3">
      <div className="container" style={{ maxWidth: "900px" }}>
        <div className="bg-white shadow rounded-4 p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold text-primary m-0">
              Employee Management System
            </h2>
            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-primary px-4 py-2 rounded-pill"
                onClick={() => {
                  setEmployeeObj(null);
                  setShowModal(true);
                }}
              >
                + Add Employee
              </button>
              <button
                onClick={handleLogout}
                className="bg-danger text-white px-4 py-2 rounded-pill border-0"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="mb-4">
            <input
              type="text"
              className="form-control form-control-lg rounded-pill shadow-sm"
              placeholder="Search employees by name or email..."
              onChange={handleSearch}
            />
          </div>

          <EmployeeTable
            employees={employeesData.employees}
            pagination={employeesData.pagination}
            fetchEmployees={fetchEmployees}
            handleUpdateEmployee={handleUpdateEmployee}
          />

          <AddEmployee
            fetchEmployees={fetchEmployees}
            showModal={showModal}
            setShowModal={setShowModal}
            employeeObj={employeeObj}
          />
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
    </div>
  );
};

export default EmployeeManagementApp;
