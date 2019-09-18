import React from 'react';
import './Navtop.css';
import IconSvg from '../../../utilities/svg/svg';

const navtop = () => {
    return (
        <div className="navtop">
            <div className="navtop__logo">
                WOTO ADMIN
            </div>
            <div className="navtop__contact">
                <div className="navtop__contact__detail">
                    <IconSvg icon="phone" />
                    <div>+1 438 896 2026</div>
                </div>
                <div className="navtop__contact__detail">
                    <IconSvg icon="email" />
                    <div>wotto@gmail.com</div>
                </div>
            </div>
            <div className="navtop__socialMedia">
                <IconSvg icon="facebook"/>
                <IconSvg icon="instagram"/>
                <IconSvg icon="twitter"/>
            </div>
        </div>
    )
}

export default navtop; 
