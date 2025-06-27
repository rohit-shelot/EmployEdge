const express = require('express')
const router = express.Router()
const userController = require('../Controllers/AuthControllers.js')
const { loginSchema,registerSchema } = require('../Middlewares/ensureFields.js')
const verifyToken = require("../Middlewares/authMiddleware.js");


router.post('/login',loginSchema,userController.login)
router.post('/logout',userController.logout)
router.post('/signup',registerSchema,userController.register)
const verifyUser = (req, res) => {
  res.status(200).json({ success: true, user: req.user });
};
router.get("/verify", verifyToken, verifyUser);



module.exports = router;
