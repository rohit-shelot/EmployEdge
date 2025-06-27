import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DeleteEmployeeById } from '../api';
import { notify } from '../utils';

function EmployeeTable({
  employees,
  pagination = { currentPage: 1, totalPages: 1 },
  fetchEmployees,
  handleUpdateEmployee
}) {
  employees = Array.isArray(employees) ? employees : [];

  const headers = ['Name', 'Email', 'Phone', 'Department', 'Actions'];
  const { currentPage = 1, totalPages = 1 } = pagination;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePagination = async (page) => {
    try {
      setError(null);
      if (page >= 1 && page <= totalPages) {
        await fetchEmployees('', page, 5);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch employees');
      notify('Failed to fetch employees', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) handlePagination(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) handlePagination(currentPage - 1);
  };

  const handleDeleteEmployee = async (id) => {
    try {
      setError(null);
      const { success, message } = await DeleteEmployeeById(id);
      if (success) {
        notify(message, 'success');
        await fetchEmployees();
      } else {
        setError(message);
        notify(message, 'error');
      }
    } catch (err) {
      setError(err.message || 'Failed to delete employee');
      notify('Failed to delete employee', 'error');
    } finally {
      setLoading(false);
    }
  };

  const TableRow = ({ employee }) => (
    <tr key={employee._id}>
      <td>
<Link
  to={`/employees/${employee._id}`}
  className="text-blue-700 text-decoration-none hover:!underline hover:cursor-pointer"
>
          {employee.name}
        </Link>
      </td>
      <td>{employee.email}</td>
      <td>{employee.phone}</td>
      <td>{employee.department}</td>
      <td>
        <button
          className="btn btn-sm btn-outline-primary me-2"
          onClick={() => handleUpdateEmployee(employee)}
          disabled={loading}
        >
          Edit
        </button>
        <button
          className="btn btn-sm btn-outline-danger"
          onClick={() => handleDeleteEmployee(employee._id)}
          disabled={loading}
        >
          Delete
        </button>
      </td>
    </tr>
  );

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead>
          <tr>
            {headers.map((header, i) => (
              <th key={i}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {employees.length > 0 ? (
            employees.map((emp) => <TableRow key={emp._id} employee={emp} />)
          ) : (
            <tr>
              <td colSpan={headers.length} className="text-center">
                No employees found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <nav className="mt-3">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={handlePreviousPage} disabled={loading}>
                Previous
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => handlePagination(page)}
                  disabled={loading}
                >
                  {page}
                </button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={handleNextPage} disabled={loading}>
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}

export default EmployeeTable;
