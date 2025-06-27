const { getUserEmployeeModel } = require("../models/EmployeeModel");

const createEmployee = async (req, res) => {
  try {
    const EmployeeModel = getUserEmployeeModel(req.user.id);
    const data = req.body;
    data.profileImage = req.file ? req.file.path : null;
    
    console.log('File uploaded:', req.file);
    console.log('Image path being stored:', data.profileImage);

    const emp = new EmployeeModel(data);
    await emp.save();

    res.status(201).json({ success: true, message: "Employee created successfully", emp });
  } catch (error) {
    console.error("Create Error:", error.message);
    res.status(500).json({ success: false, message: "Failed to create employee" });
  }
};
const getAllEmployees = async (req, res) => {
  try {
    const EmployeeModel = getUserEmployeeModel(req.user.id);

    const { search = "", page = 1, limit = 5 } = req.query;
    const searchRegex = new RegExp(search, "i");

    const filter = {
      $or: [
        { name: { $regex: searchRegex } },
        { email: { $regex: searchRegex } },
        { phone: { $regex: searchRegex } },
        { department: { $regex: searchRegex } },
      ],
    };

    const totalEmployees = await EmployeeModel.countDocuments(filter);
    const employees = await EmployeeModel.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      totalEmployees,
      currentPage: Number(page),
      totalPages: Math.ceil(totalEmployees / limit),
      employees,
    });
  } catch (error) {
    console.error("Fetch Error:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch employees" });
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const EmployeeModel = getUserEmployeeModel(req.user.id);
    const emp = await EmployeeModel.findById(req.params.id);
    if (!emp) return res.status(404).json({ success: false, message: "Employee not found" });

    res.json({ success: true, emp });
  } catch (error) {
    console.error("GetByID Error:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch employee" });
  }
};

const updateEmployeeById = async (req, res) => {
  try {
    const EmployeeModel = getUserEmployeeModel(req.user.id);
    const updates = req.body;
    if (req.file) {
      updates.profileImage = req.file.path;
      console.log('Update - File uploaded:', req.file);
      console.log('Update - Image path being stored:', updates.profileImage);
    }

    const updated = await EmployeeModel.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Employee not found" });

    res.json({ success: true, message: "Employee updated successfully", updated });
  } catch (error) {
    console.error("Update Error:", error.message);
    res.status(500).json({ success: false, message: "Failed to update employee" });
  }
};

const deleteEmployeeById = async (req, res) => {
  try {
    const EmployeeModel = getUserEmployeeModel(req.user.id);
    const deleted = await EmployeeModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Employee not found" });

    res.json({ success: true, message: "Employee deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error.message);
    res.status(500).json({ success: false, message: "Failed to delete employee" });
  }
};

module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployeeById,
  deleteEmployeeById,
};
