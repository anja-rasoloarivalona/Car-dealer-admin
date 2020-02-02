import React, { Component } from 'react';
import './MessagesUserInfos.css';
import IconSvg from '../../../utilities/svg/svg';

 class MessagesUserInfos extends Component {

    state = {
        userPhone: '',
        headerEditingMode: false
    }

    componentDidMount(){
        this.setState({ userPhone: this.props.user.phoneNumber}, () => console.log(this.state))
    }

    toggleEditPhoneNumber = () => {
        if(!this.state.headerEditingMode){
            this.setState({ headerEditingMode: !this.state.headerEditingMode})
        }
        
    }

    editPhoneNumber = value => {
        this.setState({ userPhone: value})
    }


    render() {
        const { headerEditingMode} = this.state
        let user = this.props.user;
        return (
            <div className="messagesUserInfos">
                <header className="messagesUserInfos__header">
                    <div className="messagesUserInfos__header__name">{user.firstName} {user.lastName}</div>
                    <div className={`messagesUserInfos__header__status ${user.status ? 'active' : 'away'}`}>
                        {user.status ? 'active' : 'away'}
                    </div>
                </header>

                <div className="messagesuserInfos__contact">
                    <div className="messagesUserInfo__contact__group">
                        <IconSvg icon="email"/>
                        <span>{user.email}</span>
                    </div>
                    <div className="messagesUserInfo__contact__group">
                        <IconSvg icon="phone"/>
                        <div className={`messagesUserInfo__contact__group__value ${headerEditingMode ? 'edit':'' }`}
                            onClick={() => this.toggleEditPhoneNumber()}>
                            <div className="messagesUserInfo__contact__group__value--value">{user.phone ? user.phone : 'N.D.'}</div>
                            <input className="messagesUserInfo__contact__group__value--input"
                                   type='email'
                                   value={this.state.userPhone}
                                   onChange={e => this.editPhoneNumber(e.target.value)}/>
                        </div>
                        
                    </div>
                </div>

                
            </div>
        )
    }
}

export default MessagesUserInfos
