import React, { Component } from 'react';
import './Users.css';
import IconSvg from '../../utilities/svg/svg';

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
            this.setState({ users: resData.users})
        })
        .catch(err => {
            console.log(err);
        });
    }


    render() {
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
                            <th>Last connection</th>
                            <th>Fiche</th>
                            <th>Open conversation</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="users__table__data">
                            <td className="users__table__data__avatar">
                                <div>
                                    AR
                                </div>
                    
                            </td>
                            <td className="users__table__data__name">
                                Anja Rasoloarivalona
                            </td>
                            <td className="users__table__data__info">
                                <div>
                                    rasoloanja@gmail.com
                                </div>
                                
                            </td>
                            <td className="users__table__data__info">
                                <div>
                                    +1 438 896 2026
                                </div>
                            </td>
                            <td className="users__table__data__status">
                                <div>
                                    Active
                                </div>
                            </td>
                            <td className="users__table__data__info">
                                <div>
                                    12-10-2019 &nbsp; 21:54:15
                                </div>
                                
                            </td>
                            <td className="users__table__data__icon users__table__data__icon--file">
                                <IconSvg icon="file"/>
                            </td>
                            <td className="users__table__data__icon users__table__data__icon--message">
                                <IconSvg icon="email"/>
                            </td>
                        </tr>
                    </tbody>
                </table>

            </section>
        )
    }
}

export default Users;
