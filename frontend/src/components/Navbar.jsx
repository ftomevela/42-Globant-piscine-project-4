import React from 'react';
import '../assets/Navbar.css'; // si tienes un archivo CSS para este componente

function Navbar() {
    return (
        <nav className="navbar">
            <ul className="navbar-menu">
                <li><a href="/">Home</a></li>
                <li><a href="/report">Report</a></li>
            </ul>
        </nav>
    );
}

export default Navbar;
