import React, { Component } from 'react';
import './Users.css';
import IconSvg from '../../utilities/svg/svg';

 class Users extends Component {
    render() {
        return (
            <section className="users">
                <table className="users__table">
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
                </table>

            </section>
        )
    }
}

export default Users;
