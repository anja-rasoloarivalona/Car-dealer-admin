import React from 'react';
import './Navbar.css';

import { NavLink} from 'react-router-dom';

const navbar = () => {
    return (
        
            <nav className="navbarContainer">
                <ul className="navbar__list">
                    <NavLink to="/"  exact className="navbar__list__item" >
                        Inventaire
                    </NavLink>
                    <NavLink to="/publicity" className="navbar__list__item">
                        Publicité
                    </NavLink>
                    <NavLink to="/stats" className="navbar__list__item">
                        Statistiques
                    </NavLink>
                    <NavLink to="/commandes" className="navbar__list__item">
                        Commandes
                    </NavLink>
                </ul>
            </nav>
        
    )
}

export default navbar;
