import React from 'react';
import './Loader.css';

const Loader = () => {
    return (
        <div className="loader-container">
            <div className="custom-loader">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
            <p className="loader-text">Loading Employee Details...</p>
        </div>
    );
};

export default Loader;
