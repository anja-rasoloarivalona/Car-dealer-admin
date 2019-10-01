import React, { Component } from 'react';
import './Chat.css';
import Input from '../formInput/FormInput';




 class Chat extends Component {


    state = {
        messages: [
            {
                from: 'Max',
                type: 'user',
                message: 'Bonjour',
                date:  new Date()
            },
            {
                from: 'Mario',
                type: 'admin',
                message: 'Salut Max',
                date:  new Date()
            },

            {
                from: 'Max',
                type: 'user',
                message: 'Ca va Mario',
                date:  new Date()
            },

            {
                from: 'Mario',
                type: 'admin',
                message: 'Oui super, je souhaiterai acheter une voiture, est ce que tu pouuras m aider',
                date:  new Date()
            },

        ],

        messageInput: '',

        showChat: true
    }

    messageChangeHandler = (e) => {
        this.setState({ messageInput: e.target.value})
    }


    handleKeyDown(e) {

        e.target.style.height = 'inherit';
        e.target.style.height = `${e.target.scrollHeight}px`; 
        // In case you have a limitation
        // e.target.style.height = `${Math.min(e.target.scrollHeight, limit)}px`
      }

      keypress = e => {
        if(e.key === 'Enter'){
            e.preventDefault();
            console.log('value', e.target.value);
            this.setState({ messageInput: ''})
        }
      }

      toggleShowChat = () => {
          this.setState( prevState => ({
              showChat: !prevState.showChat
          }))
      }

    render() {
        return (
            <section className={`chat ${this.state.showChat ?'': 'hide'}`}>

                <div className="chat__bar"
                    onClick={this.toggleShowChat}>
                    Messages
                </div>

                <div className={`chat__body 
                                 ${this.state.showChat ? '' : 'hide'}`}> 

                       {
                           this.state.messages.map( message => {

                            if(message.type === 'user'){
                                return (
                                    <div className="user__message__container">
                                        <div></div>
                                        <div className="chat__message chat__message--user">
                                            {message.message}
                                        </div> 
                                    </div>

                                     
                                )
                            }

                            if(message.type === 'admin'){
                                return (
                                    <div>
                                        <div className="chat__message chat__message--admin">
                                            {message.message}
                                        </div>
                                    </div>
                                    

                                )
                            }
                            
                           })
                       } 


                </div>

                <div className={`chat__input 
                                ${this.state.showChat ? '' : 'hide'}`}>

                    <textarea className="textarea"
                            value={this.state.messageInput}
                            onChange={(e) => this.messageChangeHandler(e)}
                            placeholder='message'
                            onKeyDown={this.handleKeyDown}
                            onKeyPress={this.keypress}
                            />
                </div>
            </section>
        )
    }
}

export default Chat;
