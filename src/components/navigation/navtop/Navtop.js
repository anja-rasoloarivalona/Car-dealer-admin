import React, { Component } from 'react'
import './Navtop.css';
import IconSvg from '../../../utilities/svg/svg';
import { connect } from 'react-redux'

class Navtop extends Component {

    state = {
        users: null,
        showUsersList: false,
        loading: true
    }

    componentWillMount(){
        document.addEventListener('mousedown', this.handleClick, false)
    }
    
    componentWillUnmount(){
         document.removeEventListener('mousedown', this.handleClick, false)
    }

    handleClick = e => {         
        if(this.target && this.target.contains(e.target)){
            return
        } else {
            if(this.state.showUsersList){
                this.hideUsersList()
            }
            
        }     
    }


    componentDidMount(){
        this.fetchUsersHandler()
    }

    showUsersListToggler = () => {
        this.setState( prevState => ({
            ...prevState,
            showUsersList: !prevState.showUsersList
        }))
    }

    hideUsersList = () => {
        this.setState({showUsersList: false})
    }

    fetchUsersHandler = () => {
        let url = "https://africauto.herokuapp.com/admin/connected-users";
       fetch(url, {
           headers: {
               "Content-Type": "application/json"
           },
       })
       .then(res => {
            if (res.status !== 200) {
            throw new Error("Failed to fetch users");
            }
            return res.json();
        })
        .then(resData => {
            this.setState({ users: resData.users, loading: false})
        })
        .catch(err => {
            console.log(err);
        });
    }

    render() {
        const {users, showUsersList, loading} = this.state;

        let connectedUsers = ''
        if(users){
            connectedUsers = (
                <div className="nav__top__connected"
                ref={el => this.target = el}>
                    <div className="nav__top__connected__count"
                        onClick={this.showUsersListToggler}>
                            <div className="nav__top__connected__count__icon">
                                <IconSvg icon="users"/>
                                <div className={`nav__top__connected__count__icon__status ${users.length > 0 ? 'green': 'red'}`}></div>
                            </div>
                            {users.length > 0 && (
                                <span>{users.length}</span>
                            )}
                            
                    </div>
                    
                    {users.length > 0 && (
                        <ul className={`nav__top__connected__list ${showUsersList ? 'active': ''}`}>
                            {
                                users.map( (user, i) => (
                                    <li className="nav__top__connected__list__item"
                                    key={i}>
                                        <div className="nav__top__connected__list__item__avatar">
                                            {user.firstName.slice(0, 1)}{user.lastName.slice(0, 1)}
                                        </div>
                                        <div className="nav__top__connected__list__item__name">
                                            {user.firstName} {user.lastName}
                                        </div>
                                    </li>
                                ))
                            }
                        </ul>
                    )}
                    
                </div>
            )
        }

        return (
            <div className="navtop">

                <div className="navtop__logo">
                    WOTO ADMIN
                </div>

                {this.props.auth && this.props.token && this.props.adminId && this.props.adminName && (
                    <div className="navtop__cta">
                        {connectedUsers}
                        <div className="navtop__cta__logout"
                            onClick={this.props.logoutHandler}>
                        Logout
                        </div>
                    </div>
                )}

               
            </div>
        )
    }
}


const mapStateToProps = state => {
    return {
        auth: state.auth.auth,
        token: state.auth.auth,
        adminId: state.auth.adminId,
        adminName: state.auth.adminName, 
    }
  }
  

export default connect(mapStateToProps)(Navtop); 
