import React, { Component } from 'react';
import './Users.css';
import IconSvg from '../../utilities/svg/svg';
import openSocket from 'socket.io-client';

 class Users extends Component {

    state = {
        users: []
    }

    componentDidMount(){

       let url = "http://localhost:8000/admin/users";
       let method = "GET";

       fetch(url, {
           headers: {
               "Content-Type": "application/json"
           },
           method: method
       })
       .then(res => {
            if (res.status !== 200) {
            throw new Error("Failed to fetch users");
            }
            return res.json(); //extract the body
        })
        .then(resData => {

            this.setState({ users: resData.users},
            () => console.log('initial state', this.state.users))
        })
        .catch(err => {
            console.log(err);
        });

        const socket = openSocket('http://localhost:8000');

        socket.on('userLoggedIn', data => {
            let userLoggedInId = data._id;

            const userLoggedIn = this.state.users.filter( i => i._id === userLoggedInId)[0];

            userLoggedIn.active = true;

            userLoggedIn.connection = [data.connection[data.connection.length - 1]];

            const newUserStates = this.state.users.filter(i => i._id !== userLoggedInId);
            let newData = [];

            if(newUserStates.length === 0){
                newData = [userLoggedIn];
                this.setState({ users: newData} , () => console.log('state', this.state.users))
            } else {
                newData = [userLoggedIn, ...newUserStates]
                this.setState({ users: newData}, () => console.log('state', this.state.users))
            }
        })

        socket.on('userLoggedOut', data => {

            console.log('logged out happening')
            let userLoggedInId = data._id;


            let userLoggedInIndex = this.state.users.findIndex( i => i._id === userLoggedInId)

            const userLoggedIn = this.state.users.filter( i => i._id === userLoggedInId)[0];

            userLoggedIn.active = false;

            userLoggedIn.connection = [data.connection[data.connection.length - 1]];

            let newUsersData = [...this.state.users];
            newUsersData[userLoggedInIndex] = userLoggedIn;


            this.setState({ users: newUsersData})
        })






    }


    render() {

        const {users} = this.state;

        return (
            <section className="users">
                <table className="users__table">
                    <thead>
                        <tr>
                            <th>&nbsp;</th>
                            <th>Identity</th>
                            <th>Email</th>
                            <th>Tél</th>
                            <th>Status</th>
                            <th>Connection</th>
                            <th>Fiche</th>
                            <th>Open conversation</th>
                        </tr>
                    </thead>
                    <tbody>

                        {
                            users.map( user => (

                          <tr className="users__table__data"
                              key={user._id}>
                                <td className="users__table__data__avatar">
                                    <div>
                                        {user.firstName.slice(0, 1)}{user.lastName.slice(0, 1)}
                                    </div>
                        
                                </td>
                                <td className="users__table__data__name">
                                    {user.firstName} {user.lastName}
                                </td>
                                <td className="users__table__data__info">
                                    <div>
                                        {user.email}
                                    </div>
                                    
                                </td>
                                <td className="users__table__data__info">
                                    <div>
                                        +1 438 896 2026
                                    </div>
                                </td>
                                <td className="users__table__data__status">

                            
                                    <div className={`users__table__data__status__icon 
                                        ${user.active === true ? 'active': ''}`}>
                                       {user.active === true ? 'active': 'away'}
                                    </div>
                                </td>
                                <td className="users__table__data__info">
                                    <div>
                                        {
                                            user.active === true ?  user.connection[0].start : user.connection[0].end
                                        }
                                    </div>
                                    
                                </td>
                                <td className="users__table__data__icon users__table__data__icon--file">
                                    <IconSvg icon="file"/>
                                </td>
                                <td className="users__table__data__icon users__table__data__icon--message">
                                    <IconSvg icon="email"/>
                                </td>
                        </tr>
                            ))
                        }
                        
                    </tbody>
                </table>

            </section>
        )
    }
}

export default Users;
