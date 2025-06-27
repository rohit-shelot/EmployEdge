import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { GetEmployeeDetailsById } from '../api';
import { getImageUrl } from '../utils';
import Loader from './Loader'; 

const EmployeeDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchEmployeeDetails = async () => {
        try {
            const data = await GetEmployeeDetailsById(id);
            if (data?.success && data?.emp) {
                setEmployee(data.emp);
            } else {
                setEmployee(null);
            }
        } catch (err) {
            console.error('Error fetching employee:', err);
            setEmployee(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployeeDetails();
    }, [id]);

    if (loading) {
        return <Loader />;
    }

    if (!employee) {
        return (
            <div className="text-center mt-5">
                <h3>Employee not found</h3>
                <button className="btn btn-outline-primary mt-3" onClick={() => navigate('/employees')}>
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="mx-auto" style={{ maxWidth: '900px' }}>
                <div className="card shadow rounded-4 overflow-hidden">
                    <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                        <h4 className="mb-0">Employee Details</h4>
                        <button
                            className="btn btn-outline-light btn-sm"
                            onClick={() => navigate('/employees')}
                        >
                            ← Back
                        </button>
                    </div>
                    <div className="card-body p-4">
                        <div className="row g-4 align-items-start">
                            <div className="col-md-4 text-center">
                                <img
                                    src={getImageUrl(employee.profileImage)}
                                    alt={employee.name}
                                    className="img-fluid rounded shadow-sm"
                                    style={{ maxHeight: '250px', objectFit: 'cover' }}
                                    onError={(e) => {
                                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik03NSA0MEM4My4yODQzIDQwIDkwIDQ2LjcxNTcgOTAgNTVDOTAgNjMuMjg0MyA4My4yODQzIDcwIDc1IDcwQzY2LjcxNTcgNzAgNjAgNjMuMjg0MyA2MCA1NUM2MCA0Ni43MTU3IDY2LjcxNTcgNDAgNzUgNDBaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0yMCAxMTBDMjAgMTA1LjU4MiAyMy41ODE3IDEwMiAyOCAxMDJIMTIyQzEyNi40MTggMTAyIDEzMCAxMDUuNTgyIDEzMCAxMTBDMTMwIDExNC40MTggMTI2LjQxOCAxMTggMTIyIDExOEgyOEMyMy41ODE3IDExOCAyMCAxMTQuNDE4IDIwIDExMFoiIGZpbGw9IiM5QjlCQTAiLz4KPHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+Cjx0ZXh0IHg9Ijc1IiB5PSIxMzAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzY2NjY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Tm8gSW1hZ2U8L3RleHQ+Cjwvc3ZnPgo=';
                                    }}
                                />
                            </div>
                            <div className="col-md-8">
                                <h3 className="fw-semibold text-primary">{employee.name}</h3>
                                <p className="mb-1"><strong>Email:</strong> {employee.email}</p>
                                <p className="mb-1"><strong>Phone:</strong> {employee.phone}</p>
                                <p className="mb-1"><strong>Department:</strong> {employee.department}</p>
                                <p className="mb-1"><strong>Salary:</strong> ₹ {employee.salary}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDetails;
