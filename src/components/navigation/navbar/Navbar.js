import React, { Component } from 'react'
import './Navbar.css';

import { NavLink} from 'react-router-dom';
import IconSvg from '../../../utilities/svg/svg';
import { NAV_LINKS } from './NavbarList';
import { connect } from 'react-redux';
import  * as actions from '../../../store/actions'



class Navbar extends Component {


    componentDidMount(){
        


        let url = "http://localhost:8000/stats/notifications";
        let mehod = 'GET';

        fetch(url, {
            method: mehod,
            headers : {
                'Content-Type' : 'application/json'
            }
        })
        .then( res => {
            if(res.status !== 200 && res.status !== 201)
            throw new Error('Failed to get notifications')
            return res.json()
        })
        .then( resData => {
            this.props.initNotifications(resData.notifData)
        })
        .catch(err => {
            console.log(err)
        })

    }

    render() {
        return (
            <ul className={`navbar__list ${this.props.showFullNavbar === true ? '': 'small'}`}>

                    {
                        this.props.showFullNavbar === true && (
                            <IconSvg icon="chevrons-left" customClass="navbar__list__toggle"
                            onClick={this.props.toggleShowFullNavbar}/>
                        )
                    }

                    {
                        this.props.showFullNavbar === false && (
                            <IconSvg icon="chevrons-right" customClass="navbar__list__toggle"
                            onClick={this.props.toggleShowFullNavbar}/>
                        )
                    }
                    

                    <NavLink to="/inventory" className={`navbar__list__item 
                                            ${this.props.showFullNavbar === true ? '' : 'hide'}`} >
                        <IconSvg icon="inventory"/>
                        <span className="navbar__list__item__text">Inventaire</span>
                    </NavLink>

                    <NavLink to="/messages"  className={`navbar__list__item 
                                            ${this.props.showFullNavbar === true ? '' : 'hide'}`} >
                        <IconSvg icon="email"/>
                        <span className="navbar__list__item__text">Messages</span>

                       {
                           this.props.notification.length > 0 && (
                            <div className="navbar__list__item__notification">
                                <span>{this.props.notification.length}</span> 
                            </div>
                           )
                       }
                        
                    </NavLink> 


                    
                    {
                        NAV_LINKS.map( i => (
                            <NavLink key={i.path} to={`/${i.path}`} className={`navbar__list__item 
                                        ${this.props.showFullNavbar === true ? '' : 'hide'}`} >
                                <IconSvg icon={i.icon}/>
                                <span className="navbar__list__item__text">{i.text}</span>
                            </NavLink>
                        ))
                    }
            </ul>
        )
    }
}



const mapStateToProps = state => {
    return {
        showFullNavbar: state.nav.showFullNavbar,
        notification: state.nav.notification
    }
}

const mapDispatchToProps = dispatch => {
    return {
        toggleShowFullNavbar: () => dispatch(actions.toggleShowFullNavbar()),
        initNotifications: data => dispatch(actions.initNotifications(data))
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Navbar)
