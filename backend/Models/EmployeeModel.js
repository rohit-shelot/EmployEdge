const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmployeeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    profileImage: {
        type: String
    },
    salary: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    updatedAt: {
        type: Date,
        default: new Date()
    }
});

const getUserEmployeeModel = (userId) => {
  const modelName = `employees_${userId}`;
  return mongoose.models[modelName] || mongoose.model(modelName, EmployeeSchema);
};

const EmployeeModel = mongoose.model('empmodels', EmployeeSchema);
module.exports = {EmployeeModel,getUserEmployeeModel};


