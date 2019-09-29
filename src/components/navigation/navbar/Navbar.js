import React from 'react'
import './Navbar.css';

import { NavLink} from 'react-router-dom';
import IconSvg from '../../../utilities/svg/svg';
import { NAV_LINKS } from './NavbarList';
import { connect } from 'react-redux';
import  * as actions from '../../../store/actions'



const navbar = props => {
    return (
        <ul className={`navbar__list ${props.showFullNavbar === true ? '': 'small'}`}>

                    {
                        props.showFullNavbar === true && (
                            <IconSvg icon="chevrons-left" customClass="navbar__list__toggle"
                            onClick={props.toggleShowFullNavbar}/>
                        )
                    }

                    {
                        props.showFullNavbar === false && (
                            <IconSvg icon="chevrons-right" customClass="navbar__list__toggle"
                            onClick={props.toggleShowFullNavbar}/>
                        )
                    }
                    

                    <NavLink to="/"  exact className={`navbar__list__item 
                                            ${props.showFullNavbar === true ? '' : 'hide'}`} >
                        <IconSvg icon="inventory"/>
                        <span className="navbar__list__item__text">Inventaire</span>
                    </NavLink>
                    
                    {
                        NAV_LINKS.map( i => (
                            <NavLink key={i.path} to={`/${i.path}`} className={`navbar__list__item 
                                        ${props.showFullNavbar === true ? '' : 'hide'}`} >
                                <IconSvg icon={i.icon}/>
                                <span className="navbar__list__item__text">{i.text}</span>
                            </NavLink>
                        ))
                    }
            </ul>
    )
}

const mapStateToProps = state => {
    return {
        showFullNavbar: state.nav.showFullNavbar
    }
}

const mapDispatchToProps = dispatch => {
    return {
        toggleShowFullNavbar: () => dispatch(actions.toggleShowFullNavbar())
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(navbar)
