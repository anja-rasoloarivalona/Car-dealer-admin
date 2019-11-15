import React, {Fragment} from 'react';

const MessagesContainerList = props => {

    let messages = props.messages;

    let displayedDate = '';

    //Initialize date and store it
    let date = messages[0].timeStamp;
    let shortDate = messages[0].timeStamp.slice(0 , 5);

    let messagesList = messages.map((message, index, array) => {        
        let currentDate = array[index].timeStamp.slice(0 , 5);
       

        if(index === 0){
            //Display the first date
                displayedDate = date

        } else {
            //compare the current date with the previous date
            if(currentDate !== shortDate && index + 1 < array.length){
                 displayedDate = messages[index].timeStamp
                 shortDate = messages[index].timeStamp.slice(0 , 5);
            } else {
                displayedDate = ''
            }
        }   
        return (
            <div key={message._id}>

            {displayedDate !== '' && (<div className="messagesContainer__body__chat__convoDate">{displayedDate}</div>)
            }

            <div className={`messagesContainer__body__chat messagesContainer__body__chat--${message.senderType === 'user' ? 'user' : 'admin'}`}>
                {message.message}
            </div>

            {props.displayDetails && (                                  
                <div className="messagesContainer__body__chat__detail">
                    {
                        message.senderType === 'user' && (
                            <Fragment>
                                <span>{message.timeStamp}</span>
                                <span>Lu par {message.readBy} le {message.readByTimeStamp}</span>
                            </Fragment>    
                    )}
                    {
                        message.senderType === 'admin' && (
                            <Fragment>
                                <span>{message.timeStamp} - {message.from}</span> 
                                {message.read === true && (
                                    <span>   Lu le {message.readByTimeStamp} </span>
                                )}
                                {message.read === false && (
                                    <span>Non lu</span>
                                                                        )}                                                                                                          
                            </Fragment>                                                       
                    )}
                </div>
                )}
            </div>
        )
    })

    return messagesList
}

export default MessagesContainerList
