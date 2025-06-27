const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const authRouter = require('./Routes/AuthRoutes');
const EmployeeRoutes = require('./Routes/EmployeeRoutes');
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 1000;
const DB_Connection = require('./Models/db')

app.use(cookieParser());
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());
app.use('/api/employees', EmployeeRoutes);
app.use('/api/auth', authRouter);

app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred'
    });
});

app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

DB_Connection().then(()=>{
    app.listen(PORT, () => {
        console.log(`Server is running on PORT: ${PORT}`);
    });
}).catch((error)=>{
    console.error('Database connection failed:', error);
    process.exit(1);
})