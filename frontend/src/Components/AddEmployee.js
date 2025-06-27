import React, { useEffect, useState, useRef } from 'react';
import { notify, getImageUrl } from '../utils';
import { CreateEmployee, UpdateEmployeeById } from '../api';

const AddEmployee = ({ showModal, setShowModal, fetchEmployees, employeeObj }) => {
    const [employee, setEmployee] = useState({
        name: '',
        email: '',
        phone: '',
        department: '',
        salary: '',
        profileImage: null
    });
    const [updateMode, setUpdateMode] = useState(false);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState(null);
    const formRef = useRef(null);

    useEffect(() => {
        if (employeeObj) {
            setEmployee(employeeObj);
            setPreview(employeeObj.profileImage || null);
            setUpdateMode(true);
        } else {
            resetState();
        }
    }, [employeeObj]);

    useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployee({ ...employee, [name]: value });
        setError(null);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.size > 5 * 1024 * 1024) { 
            setError('File size should be less than 5MB');
            return;
        }
        if (file && !file.type.startsWith('image/')) {
            setError('Please upload an image file');
            return;
        }
        setEmployee({ ...employee, profileImage: file });
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    const resetState = () => {
        setEmployee({
            name: '',
            email: '',
            phone: '',
            department: '',
            salary: '',
            profileImage: null,
        });
        setPreview(null);
        setUpdateMode(false);
        setLoading(false);
        setError(null);
        if (formRef.current) {
            formRef.current.reset();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); 
        try {
            const res = updateMode
                ? await UpdateEmployeeById(employee, employee._id)
                : await CreateEmployee(employee);

            notify(res.message, res.success ? 'success' : 'error');
            if (res.success) {
                fetchEmployees();
                setShowModal(false);
                resetState();
            } else {
                setLoading(false); 
            }
        } catch (err) {
            console.error(err);
            notify('An unexpected error occurred', 'error');
            setLoading(false);
        }
    };

    const handleClose = () => {
        setShowModal(false);
        resetState();
    };

    return (
        <>
            {showModal && (
                <div
                    className="modal-backdrop show"
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                />
            )}

            <div
                className={`modal fade ${showModal ? 'show d-block' : ''}`}
                tabIndex="-1"
                role="dialog"
                style={{ backdropFilter: 'blur(4px)' }}
            >
                <div className="modal-dialog modal-xl modal-dialog-centered">
                    <div
                        className="modal-content border-0 rounded-4 shadow-lg position-relative"
                        style={{
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(10px)',
                        }}
                    >
                        {loading && (
                            <div className="position-absolute top-0 start-0 w-100 h-100 bg-white bg-opacity-75 d-flex justify-content-center align-items-center z-3 rounded-4 loader-blur">
                                <div className="spinner"></div>
                            </div>
                        )}

                        <div className="modal-header border-0 pb-0">
                            <h4 className="modal-title text-primary fw-bold">
                                {updateMode ? 'Update Employee' : 'Add New Employee'}
                            </h4>
                            <button
                                type="button"
                                className="btn-close"
                                aria-label="Close"
                                onClick={handleClose}
                                disabled={loading}
                            />
                        </div>

                        <div className="modal-body">
                            <form onSubmit={handleSubmit}>
                                <div className="row g-4">
                                    <div className="col-md-4 text-center">
                                        <div className="border rounded-4 p-3 h-100 d-flex flex-column justify-content-between bg-light">
                                            <img
                                                src={
                                                    preview ||
                                                    getImageUrl(employeeObj?.profileImage)
                                                }
                                                alt="Preview"
                                                className="img-fluid rounded mb-3 shadow"
                                                style={{ height: '200px', objectFit: 'contain' }}
                                                onError={(e) => {
                                                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgNTBDMTEwLjU2OSA1MCAxMTkgNTguNDMxNSAxMTkgNjlDMTE5IDc5LjU2ODUgMTEwLjU2OSA4OCAxMDAgODhDODkuNDMxNSA4OCA4MCA3OS41Njg1IDgwIDY5QzgwIDU4LjQzMTUgODkuNDMxNSA1MCAxMDAgNTBaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0yNi42NjY3IDEzMy4zMzNDMjYuNjY2NyAxMjguOTQ5IDMwLjI4MTcgMTI1LjMzMyAzNC42NjY3IDEyNS4zMzNIMTY1LjMzM0MxNjkuNzE4IDEyNS4zMzMgMTczLjMzMyAxMjguOTQ5IDE3My4zMzMgMTMzLjMzM0MxNzMuMzMzIDEzNy43MTggMTY5LjcxOCAxNDEuMzMzIDE2NS4zMzMgMTQxLjMzM0gzNC42NjY3QzMwLjI4MTcgMTQxLjMzMyAyNi42NjY3IDEzNy43MTggMjYuNjY2NyAxMzMuMzMzWiIgZmlsbD0iIzlCOUJBMCIvPgo8dGV4dCB4PSIxMDAiIHk9IjE3MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNjY2NjY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5BZGQgUGhvdG88L3RleHQ+Cjwvc3ZnPgo=';
                                                }}
                                            />
                                            <input
                                                type="file"
                                                className="form-control"
                                                onChange={handleFileChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-8">
                                        <div className="row g-3">
                                            {[ 
                                                { label: 'Name', type: 'text', name: 'name' },
                                                { label: 'Email', type: 'email', name: 'email' },
                                                { label: 'Phone', type: 'text', name: 'phone' },
                                                { label: 'Department', type: 'text', name: 'department' },
                                                { label: 'Salary', type: 'number', name: 'salary' }
                                            ].map(({ label, type, name }) => (
                                                <div className="col-md-6" key={name}>
                                                    <label className="form-label fw-semibold">{label}</label>
                                                    <input
                                                        type={type}
                                                        name={name}
                                                        value={employee[name]}
                                                        onChange={handleChange}
                                                        className="form-control form-control-lg rounded-pill shadow-sm"
                                                        required
                                                        disabled={loading}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 d-flex justify-content-end gap-2">
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary px-4 rounded-pill"
                                        onClick={handleClose}
                                        disabled={loading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary px-5 rounded-pill fw-semibold"
                                        disabled={loading}
                                    >
                                        {updateMode ? 'Update' : 'Save'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .spinner {
                    width: 64px;
                    height: 64px;
                    border: 8px solid rgba(0, 123, 255, 0.2);
                    border-top-color: #007bff;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    to {
                        transform: rotate(360deg);
                    }
                }

                .loader-blur {
                    backdrop-filter: blur(8px);
                }
            `}</style>
        </>
    );
};

export default AddEmployee;
