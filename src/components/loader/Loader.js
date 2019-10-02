import React from 'react';
import './Loader.css';
import { connect } from 'react-redux'

const loader = props => {
    return (
        <div className={`loader-container ${props.showFullNavbar === true ? '': 'expand'}
                        ${props.fullView ? 'full': ''}`}>
            <div className="loader">
                <div className="loader__bar"></div>
                <div className="loader__bar"></div>
                <div className="loader__bar"></div>
                <div className="loader__bar"></div>
                <div className="loader__bar"></div>
                <div className="loader__ball"></div>
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        showFullNavbar: state.nav.showFullNavbar
    }
}

export default connect(mapStateToProps)(loader);
