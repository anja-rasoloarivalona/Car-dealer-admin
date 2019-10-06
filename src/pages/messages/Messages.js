import React, { Component } from 'react';
import './Messages.css';
import MessagesNavbar from './messagesNavbar/MessagesNavbar';
import MessagesContainer from './messagesContainer/MessagesContainer';
import { connect } from 'react-redux';
import { timeStampGenerator } from '../../utilities/timeStampGenerator';
import * as actions from '../../store/actions';

 class Messages extends Component {


    state = {
        messages: null,    
        requestedMessageUserId: null,
        userMessages: null      
    }

    componentDidMount(){
     let url = "http://localhost:8000/messages";
     let method = "GET";


        fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then( res => {
            if(res.status !== 200)
            throw new Error('Failed to fetch messages')

            return res.json()
        })
        .then(resData => {
            if(resData.messages[0].messages.length !== 0){

                this.setState({ messages: resData.messages,
                    requestedMessageUserId: resData.messages[0]._id},
                    () => this.fetchUserMessages(resData.messages[0]._id))
            } else return
            
        })
        .catch( err => {
            console.log(err)
        })   
        
        
        
    }

    changeConvoHandler = userId => {
        this.fetchUserMessages(userId)
    }

    fetchUserMessages = userId => {
        
      let url = "http://localhost:8000/messages/admin-update/" + userId;
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
            this.setState({ userMessages: resData.messages.messages, requestedMessageUserId: userId},
                () => console.log(this.state.messages))

            this.props.substractANotification(userId)

        })
        .catch( err => {
            console.log(err)
        })
    }

    updateNavbar = data => {
        let userId = data.userId;
        
        let convoToBeUpdated = this.state.messages.filter(i => i._id === userId)[0];

        convoToBeUpdated.messages[0] = data;

       let newMessagesState = this.state.messages.filter(i => i._id !== userId);

       let newData = [convoToBeUpdated, ...newMessagesState];



        this.setState({messages: newData})

    }

 
    
    render() {
        return (
            <section className="messages">
                {
                    this.state.messages && (
                        <MessagesNavbar messages={this.state.messages}
                                        requestedMessageUserId={this.state.requestedMessageUserId} 
                                        onchangeConvoHandler={this.changeConvoHandler}/>
                    )
                }

                {
                    this.state.userMessages && (
                        <MessagesContainer messages={this.state.userMessages}
                                           userId={this.state.requestedMessageUserId}
                                           updateNavbar={this.updateNavbar}/>
                    )        
                }
                
                     
            
                 
        
                  
                       
                
            </section>
        )
    }
   
}

const mapStateToProps = state => {
    return {
        adminName: state.auth.adminName
    }
}

const mapDispatchToProps = dispatch => {
    return {
        substractANotification: userId => dispatch(actions.substractANotification(userId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Messages);
