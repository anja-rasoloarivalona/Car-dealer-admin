import React from 'react';
import './Navbar.css';

import { NavLink} from 'react-router-dom';
import IconSvg from '../../../utilities/svg/svg';

const navbar = () => {
    return (
           
                <ul className="navbar__list">
                    <NavLink to="/"  exact className="navbar__list__item" >
                        <IconSvg icon="inventory"/>
                        <span>Inventaire</span>
                    </NavLink>
                    <NavLink to="/ajouter" className="navbar__list__item" >
                        <IconSvg icon="pencil"/>
                        <span>Ajouter</span>
                    </NavLink>
                    <NavLink to="/publicity" className="navbar__list__item">
                        <IconSvg icon="pub"/>
                        <span>Publicité</span>
                    </NavLink>
                    <NavLink to="/stats" className="navbar__list__item">
                        <IconSvg icon="stats"/>
                        <span>Statistiques</span>        
                    </NavLink>
                    <NavLink to="/commandes" className="navbar__list__item">
                        <IconSvg icon="command"/>
                        <span>Commandes</span>
                    </NavLink>
                    <NavLink to="/messages" className="navbar__list__item">
                        <IconSvg icon="email"/>
                        <span>Messages</span>
                    </NavLink>
                </ul>
          
        
    )
}

export default navbar;
