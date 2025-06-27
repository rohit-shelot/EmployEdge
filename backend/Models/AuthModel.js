const mongoose = require("mongoose");
const authSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  employeeCollection: {
    type: String,
    default: function () {
      return `employees_${this._id}`;
    },
  },
});

const authModel = mongoose.model("authModel", authSchema);
module.exports = authModel;
