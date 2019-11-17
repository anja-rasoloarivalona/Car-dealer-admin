import React, { Component } from 'react'
import './Navtop.css';

class Navtop extends Component {

    state = {
        users: null,
        showUsersList: false
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

    fetchUsersHandler = () => {
        let url = "http://localhost:8000/admin/connected-users";
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
            this.setState({ users: resData.users})
        })
        .catch(err => {
            console.log(err);
        });
    }

    render() {
        const {users, showUsersList} = this.state;

        let connectedUsers = ''
        if(users){
            connectedUsers = (
                <div className="nav__top__connected">
                    <div className="nav__top__connected__count"
                        onClick={this.showUsersListToggler}>connected : {users.length}</div>
                    
                    {users.length > 0 && (
                        <ul className={`nav__top__connected__list 
                                        ${showUsersList ? 'active': ''}`}>
                            {
                                users.map(user => (
                                    <li className="nav__top__connected__list__item">
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

            {connectedUsers}

          {
              /*
              <Button color='grey'>
                Logout
            </Button>
              */
          }  

            </div>
        )
    }
}

export default Navtop; 
