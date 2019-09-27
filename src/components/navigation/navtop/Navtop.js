import React from 'react';
import './Navtop.css';

import Button from '../../../components/button/Button';

const navtop = () => {
    return (
        <div className="navtop">
            <div className="navtop__logo">
                WOTO ADMIN
            </div>

            <Button color='grey'>
                Logout
            </Button>

        </div>
    )
}

export default navtop; 
