import React, {Fragment} from 'react';

const MessagesContainerList = props => {

    let messages = props.messages;
    let showInfo = props.showInfo
    let displayedDate = '';

    let chatMessageGap;
    let currentSenderType;


    //Initialize date and store it
    let date = messages[0].timeStamp;
    let shortDate = messages[0].timeStamp.slice(0 , 5);

    currentSenderType = messages[0].senderType;


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

        if( index + 1 < array.length  && array[index + 1].senderType === currentSenderType ){
            chatMessageGap = 'small'
        } else {
            chatMessageGap = 'big'
            if(index + 1 < array.length){
                currentSenderType = array[index + 1].senderType
            }
            
        }


        
        
        return (
            <div key={message._id} className="messagesContainer__body__chatContainer" >

                {displayedDate !== '' && (<div className="messagesContainer__body__chat__convoDate">{displayedDate}</div>)
                }

                <div className={`messagesContainer__body__chat               
                                ${chatMessageGap === 'small' ? 'small-gap': 'big-gap'}`}>
                    <div className={`messagesContainer__body__chat__content 
                                    ${message.senderType === 'user' ? 'user' : 'admin'}` }>
                        {message.message}
                    </div>
                    <div className={`messagesContainer__body__chat__detail
                                    ${showInfo ? 'show':''}
                                    ${message.senderType === 'user' ? 'user' : 'admin'}`}>
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
                </div>
             
                

            </div>
        )
    })

    return messagesList
}

export default MessagesContainerList
