import React, { Component, Fragment } from 'react';
import './MessagesContainer.css';
import openSocket from 'socket.io-client';
import {timeStampGenerator} from '../../../utilities/timeStampGenerator';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions'
import MessagesList from './MessagesContainerList'
import AutoSizeTextArea from '../../../components/autosizeTextArea/AutosizeTextArea';
import IconSvg from '../../../utilities/svg/svg';

class MessagesContainer extends Component {

    state = {
        messages: null,
        messageInput: '',
        userId: '',
        showInfo: false,
        showUserInfos: true
    }

    componentWillUnmount() {
        this._ismounted = false;
     }
    
    
    componentDidMount(){    
        this._ismounted = true;  
        this.setState({
            messages: this.props.messages, 
            userId: this.props.userId
        }, () => this.scrollToBottom() );
      
        const socket = openSocket('http://localhost:8000');

        socket.on('userSentMessage', data => {   
            this.props.playNotificationSound()
            if(data.messageData.userId === this.state.userId && this._ismounted === true){
                let url = "http://localhost:8000/messages/admin-update/" + this.state.userId;
                let method = "POST";
                let timeStamp = timeStampGenerator();

                    fetch(url, {
                        method: method,
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            adminName: this.props.adminName,
                            timeStamp: timeStamp
                        })
                    })
                    .then( res => {
                        if(res.status !== 200)
                        throw new Error('Failed to fetch messages')

                        return res.json()
                    })
                    .then(resData => {
                        let lastposition = resData.user.messages.length - 1
                        this.addMessages(resData.user.messages[lastposition])    
                    })
                    .catch( err => {
                        console.log(err)
                    })

            } else {
                
                let userId = data.messageData.userId;
                let url = "http://localhost:8000/stats/add-notification/" + userId;
                let method = 'POST';

                fetch(url, {
                    method: method,
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                .then( res => {
                    if(res.status !== 200 && res.status !== 201)
                    throw new Error('Failed to add notification')
                    return res.json()
                })
                .then(resData => {
                    this.props.addANotification(resData.notification)
                })
                .catch(err => {
                    console.log(err)
                })

            }
        })
        socket.on('userReadNewMessages', data => {
            if(data._id === this.state.userId){           
                this.setState({ messages: data.messages})
            }
        })
    }

    componentDidUpdate(prevProps){   
        if(prevProps.userId !== this.props.userId){        
            this.setState({messages: this.props.messages, userId: this.props.userId}, () => this.scrollToBottom());
        } 
    }

    toggleShowInfo = () => {
        this.setState(prevState => ({
            ...prevState,
            showInfo: !prevState.showInfo
        }))
    }

    toggleShowUserInfos = () => {
        this.setState(prevState => ({
            ...prevState,
            showUserInfos: !prevState.showUserInfos
        }))
        this.props.toggleShowUserInfos()
    }
    
    messageChangeHandler = value => {
        this.setState({ messageInput: value})
    }


    sendMessageHandler = () => {
        let timeStamp = timeStampGenerator();

        let url = "https://africauto.herokuapp.com/messages/admin/" + this.props.userId; 

      //  let url = "http://localhost:8000/messages/admin/" + this.props.userId;
        let method = "POST";

        fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                from: this.props.adminName,
                message: this.state.messageInput,
                timeStamp: timeStamp
            })
        })
        .then( res => {
            return res.json()

        })
        .then( resData => {
            this.addMessages(resData.data);
            this.setState({ messageInput: ''});
            this.props.updateNavbar(resData.data);

        })
        .catch( err => {
            console.log(err)
        })
    }

    addMessages = message => {
        this.setState(prevState => ({
            messages: [...prevState.messages, message]
        }), () => this.scrollToBottom())
    }

    scrollToBottom() {
        this.messagesEnd.scrollIntoView({ behavior: 'smooth' });
      }


    render() {
        const {displayDetails, messages, showInfo, showUserInfos} = this.state;

        let messagesList;

        if(messages && messages.length > 0){
            messagesList = (
                <MessagesList messages={messages} displayDetails={displayDetails} showInfo={showInfo}/>
            ) 
        } else {
            messagesList = (
                <div className="messagesContainer__body__start">Start conversation</div>
            )
        }
        return (
            <Fragment>

                <div className="messagesContainer__body">
                    {messagesList}
                    <div ref={el => { this.messagesEnd = el; }}></div>
                </div>
                
                <div className="messagesSender"> 
                    <div className="messagesSender__cta">

                        <div className={`messageSender__cta__iconContainer ${showUserInfos ? 'active': ''}`}
                             onClick={this.toggleShowUserInfos}>
                            <IconSvg icon="file"/>
                        </div>

                        <div className={`messageSender__cta__iconContainer ${showInfo ? 'active': ''}`}
                             onClick={this.toggleShowInfo}>
                                <IconSvg icon="eye"/>
                        </div>
                        <div className="messageSender__cta__iconContainer">
                        <IconSvg icon="user"/>
                        </div>
                        
                       
                        
                    </div>

                    <AutoSizeTextArea 
                        value={this.state.messageInput}
                        placeholder='message'
                        onChange={this.messageChangeHandler}
                        className= "messagesSender__textarea"
                    />

                    <IconSvg icon='send'
                            onClick={this.sendMessageHandler}
                            customClass='messagesSender__sender-btn'
                    />

                </div>
                
                    
            </Fragment>
        )
    }
} 


const mapStateToPros = state => {
    return {
        adminName: state.auth.adminName
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addANotification : (data) => dispatch(actions.addANotification(data)),
    }
}

export default connect(mapStateToPros, mapDispatchToProps)(MessagesContainer);
