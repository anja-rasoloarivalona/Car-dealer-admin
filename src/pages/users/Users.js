import React, { Component } from 'react';
import './Users.css';
import IconSvg from '../../utilities/svg/svg';
import openSocket from 'socket.io-client';
import Spinner from '../../components/spinner/Spinner';
import DropDownList from '../../components/dropDownList/DropDownList';



 class Users extends Component {

    state = {
        users: [],
        searchedUser: '', 
        scrollPos: 0,
        searchedUserResults: [],
        searchedUserNoResults: false,
        searchingUser: false,
        query: {
            status: 'all'
        },
        displaySelector: false,


        dpvalue: 'all',
        showList: false
    }

    componentWillMount(){
        this.timer = null
    }

    componentWillUnmount(){
        this.timer = null
    }

    componentDidMount(){
        this.fetchUsersdata();
        const socket = openSocket('http://localhost:8000');
        socket.on('userLoggedIn', data => {
            let userLoggedInId = data._id;

            let userLoggedIn = this.state.users.find( user => user._id === userLoggedInId);

            userLoggedIn.active = true;
            userLoggedIn.connection = [data.connection[data.connection.length - 1]];
            const newUserStates = this.state.users.filter(i => i._id !== userLoggedInId);
            let newData = [];
            if(newUserStates.length === 0){
                newData = [userLoggedIn];
                this.setState({ users: newData})
            } else {
                newData = [userLoggedIn, ...newUserStates]
                this.setState({ users: newData})
            }
        })
        socket.on('userLoggedOut', data => {
            let userLoggedInId = data._id;
            let userLoggedInIndex = this.state.users.findIndex( i => i._id === userLoggedInId)
            let userLoggedIn = this.state.users.find( i => i._id === userLoggedInId);

            userLoggedIn.active = false;
            userLoggedIn.connection = [data.connection[data.connection.length - 1]];
            let newUsersData = [...this.state.users];
            newUsersData[userLoggedInIndex] = userLoggedIn;
            this.setState({ users: newUsersData})
        })        
    }

    fetchUsersdata = () => {
        let url = "http://localhost:8000/admin/users";
        let method = "POST";
        fetch(url, {
            headers: {
                "Content-Type": "application/json"
            },
            method: method,
            body: JSON.stringify({ status: this.state.query.status})
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

    searchUserHandler = value => {
        clearTimeout(this.timer);
        this.setState({searchedUser: value, searchedUserNoResults: false });
        this.timer = setTimeout( () => this.fetchSearchedUsers(), 1000) 
    }

    fetchSearchedUsers = () => {
        let url = 'http://localhost:8000/user/search-user';
        let method = 'POST'

        if(this.state.searchedUser !== ''){
            this.setState({ searchingUser: true})
            fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify( { search : this.state.searchedUser})
            })
            .then( res => {
                if(res.status === 422){
                    throw new Error (
                        "Make sure the email isn't used yet"
                    )
                }
    
                if(res.status !== 200 && res.status !== 201){
                    throw new Error ( ' Creating a user failed')
                }
                return res.json()
            })
            .then(resData => {
                let results = resData.users;
                if(results.length > 0){
                    this.setState({searchedUserResults:  resData.users, searchingUser: false })
                } else {
                    this.setState({searchedUserResults:  resData.users, searchingUser: false, searchedUserNoResults: true })
                }
                
                console.log('useeers', resData.users)
            })
            .catch(err => {
                console.log(err)
            })
            } else {
                this.setState({ searchedUserResults: [], searchedUserNoResults: false})
            }
    }

    queryHandler = value => {
        this.setState(prevState => ({
            ...prevState,
            query: {
                ...prevState.query,
                status: value
            }
        }), () => this.fetchUsersdata())
    }

    toggleDisplaySelector = () => {
        this.setState( prevState => ({
            ...prevState,
            displaySelector: !prevState.displaySelector
        }))
    }


    render() {
        const {users, searchedUser, scrollPos, searchedUserResults, searchedUserNoResults, searchingUser, query, displaySelector } = this.state;
        let inputIcon = <IconSvg icon="search"/>
        if(searchingUser){
            inputIcon = <Spinner />
        }
        return (
            <section className="users">
                <div className="users__search">
                    <div className="users__search__inputContainer">
                        <input className="users__search__input" 
                                    type='text'
                                    value={searchedUser}
                                    placeholder='Name Filter'
                                    onChange={e => this.searchUserHandler(e.target.value)}
                        />
                        {inputIcon}
                    </div>
                    <DropDownList 
                        value={query.status}
                        list = {['all', 'active', 'away']}
                        selectItemHandler = {this.queryHandler}
                    />                   
                                                          
                     {!searchedUserNoResults && searchedUserResults.length > 0 && (
                        <ul className="users__search__results">
                            {searchedUserResults.map(user => (
                                <li className="users__search__results__item">
                                    <div className="users__search__results__item__avatar">
                                        {user.firstName.slice(0, 1)}{user.lastName.slice(0, 1)}
                                    </div>
                                    <div className="users__search__results__item__name">
                                        {user.firstName} {user.lastName}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}

                    {searchedUserNoResults && (
                        <ul className="users__search__results">                       
                                <li className="users__search__results__item users__search__results__item--noResult">
                                    No user found
                                </li>
                        </ul>
                    )}             
                </div>
                <table className="users__table">
                    <thead className={ `users__table__header 
                                        ${ scrollPos > 90 ? 'fixed' : ''}`
                            }>
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
                        {users.map( user => (
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
                                        {user.phoneNumber ? user.phoneNumber : 'N.D.'}
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
                                            user.active === true ?  user.connection[0].start : 
                                            
                                            user.connection[0] ? user.connection[0].end : 'N.D.'
                                        }
                                    </div>                                   
                                </td>
                                <td className="users__table__data__icon users__table__data__icon--file">
                                    <IconSvg icon="file"
                                            onClick={() => this.props.history.push(`/user/${user._id}`)}/>
                                </td>
                                <td className="users__table__data__icon users__table__data__icon--message">
                                    <IconSvg icon="email"/>
                                </td>
                        </tr>
                        ))}                    
                    </tbody>
                </table>
            </section>
        )
    }
}

export default Users;
