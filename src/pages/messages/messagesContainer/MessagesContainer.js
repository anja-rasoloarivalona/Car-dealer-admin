import React, { Component, Fragment } from 'react';
import './MessagesContainer.css';
import openSocket from 'socket.io-client';
import {timeStampGenerator} from '../../../utilities/timeStampGenerator';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions'
import MessagesList from './MessagesContainerList'



class MessagesContainer extends Component {

    state = {
        messages: null,
        messageInput: '',
        userId: ''
    }



    componentWillUnmount() {
        this._ismounted = false;
     }
    
    
    componentDidMount(){
        
        this._ismounted = true;
        
        this.setState({
            messages: this.props.messages, 
            userId: this.props.userId
        });

        this.scrollToBottom();

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
                        let lastposition = resData.messages.messages.length - 1
                        this.addMessages(resData.messages.messages[lastposition])    
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
        this.scrollToBottom();

        if(prevProps.userId !== this.props.userId){    
            this.setState({messages: this.props.messages, userId: this.props.userId});
        }
    }
    

    messageChangeHandler = (e) => {
        this.setState({ messageInput: e.target.value})
    }


    handleKeyDown = (e) => {
       // e.target.style.height = 'inherit';
       //   e.target.style.height = `${e.target.scrollHeight}px`; 
       // In case you have a limitation
        e.target.style.height = `${Math.min(e.target.scrollHeight, '60')}px`
      }

    keypress = e => {
        if(e.key === 'Enter'){
            e.preventDefault();
            this.sendMessageHandler()   
        }
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
        }))
    }

    scrollToBottom() {
        this.messagesEnd.scrollIntoView({ behavior: 'smooth' });
      }


    render() {
        const {displayDetails, messages} = this.state;
        return (
            <Fragment>

                <div className="messagesContainer__body">

                    {messages && <MessagesList messages={messages} displayDetails={displayDetails}/>}

                        
                    <div ref={el => { this.messagesEnd = el; }}></div>
                </div>
                
                <div className="messagesSender"> 
                    <div className="messagesSender__cta">

                    </div>
                    <textarea className="messagesSender__textarea"
                                value={this.state.messageInput}
                                onChange={(e) => this.messageChangeHandler(e)}
                                rows = {1}
                                placeholder='message'
                                onKeyDown={this.handleKeyDown}
                                onKeyPress={this.keypress}>
                                
                    </textarea>
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
