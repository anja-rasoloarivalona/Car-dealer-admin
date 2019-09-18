import React from 'react';
import './Navbar.css'

const navbar = () => {
    return (
        
            <nav className="navbarContainer">
                <ul className="navbar__list">
                    <li className="navbar__list__item">Inventaire</li>
                    <li className="navbar__list__item">Publicité</li>
                    <li className="navbar__list__item">Statistiques</li>
                    <li className="navbar__list__item">Commandes</li>
                </ul>
            </nav>
        
    )
}

export default navbar;
