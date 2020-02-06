import React, { Component } from 'react';
import './MessagesUserInfos.css';
import IconSvg from '../../../utilities/svg/svg';
import {timeStampGenerator} from '../../../utilities/timeStampGenerator';
import Button from '../../../components/button/Button';
import { connect } from 'react-redux';
import openSocket from 'socket.io-client';

 class MessagesUserInfos extends Component {

    state = {  
        currentNotes: null,

        editingNote: false,

        newNote: {
            title: '',
            text: ''
        },
        userPhone: '',
        editUserPhone: false,

        userStatus: null,
    }

    componentDidMount(){
        let user = this.props.user;
        user.notes.forEach(note => {
            note.show = false
        })

        let userPhone = '';

        if(user.phoneNumber && user.phoneNumber !== ''){
            userPhone = user.phoneNumber
        }
        this.setState({ currentNotes: user.notes, userStatus: user.active, userPhone: userPhone})

        const socket = openSocket('http://localhost:8000');

        socket.on('userLoggedIn', data => {
            let userLoggedInId = data._id;
            if(userLoggedInId === user._id){
                this.setState({ userStatus: true})
            }
        })
        socket.on('userLoggedOut', data => {
            let userLoggedOutId = data._id;
            if(userLoggedOutId === user._id){
                this.setState({ userStatus: false})
            }
        })  
    }

    componentDidUpdate(prevProps){
        if(prevProps.user._id !== this.props.user._id){
            let user = this.props.user;
            user.notes.forEach(note => {
                note.show = false
            })
            this.setState({ currentNotes: user.notes, userStatus: user.active, userPhone: user.phoneNumber, editUserPhone: false})
        }
    }

    editPhoneNumberStateHandler = state => {
        this.setState({ editUserPhone: state})      
    }

    editPhoneNumber = value => {
        this.setState({ userPhone: value})
    }

    saveUserPhoneNumberHandler = () => {
        let userId = this.props.user._id;
        let url = "http://localhost:8000/user/edit-phone/" + userId;
        let method = "PUT";
        fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ phoneNumber: this.state.userPhone})
        })
        .then( res => {
            if(res.status !== 200)
            throw new Error('Failed to fetch messages')

            return res.json()
        })
        .then(resData => {
                this.setState({
                    userPhone: resData.userPhone,
                    editUserPhone: false,

                })
        })
        .catch( err => {
            console.log(err)
        }) 
    }

    editNewNoteHandler = (input, value) => {
        this.setState( prevState => ({
            ...prevState,
            newNote: {
                ...prevState.newNote,
                [input]: value
            }
        }))
    }

    toggleAddingNewNoteHandler = () => {
        const {editingNote} = this.state;
        if(!editingNote){
            this.setState({ editingNote: true})
        } else {
            let newNote = {
                title: '',
                text: ''
            }
            this.setState({ editingNote: false, newNote: newNote})
        }
    }

    updateCurrentNote = (noteId, title, text) => {
        let note = {
            title,
            text,
            noteId
        }
        this.setState({ newNote: note, editingNote: true})
    }

    deleteNoteHandler = noteId => {
        let url = "http://localhost:8000/user/delete-note/" + noteId;
        let userId = this.props.user._id;
        let method = 'DELETE';

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: userId})
        })
        .then(res =>  {
            if(res.status !== 200 && res.status !== 201){
                throw new Error('Could not delete supplier')
            }
            return res.json()
        })
        .then( resData => {
            if(resData.message === 'Note deleted'){          
                let newNotes = this.state.currentNotes.filter(note => note._id !== noteId);
                this.setState({ currentNotes: newNotes})
            }
        })
        .catch( err => {
            console.log(err)
        })
    }

    submitNewNoteHandler = e => {
        e.preventDefault();
        const {newNote} = this.state

        let noteId = newNote.noteId;

        let url, method, body;

        if(noteId){
            url = "http://localhost:8000/user/edit-note/" + this.props.user._id;
            method ='PUT';
            body = JSON.stringify({
                title: newNote.title,
                text: newNote.text,
                noteId: noteId
            })
        } else {
            url = "http://localhost:8000/user/add-note/" + this.props.user._id;
            method = "POST";
            body = JSON.stringify({
                title: newNote.title,
                text: newNote.text,
                timeStamp: timeStampGenerator(),
                creator: this.props.adminName
          })
        }

        fetch(url, {
            method: method,
            headers: {
                      "Content-Type": "application/json"
            },
            body: body
            })
            .then( res => {
                  if(res.status !== 200)
                  throw new Error('Failed to fetch messages')
      
                  return res.json()
            })
            .then(resData => {
               let newNote = {
                    title: '',
                    text: ''
                }
                this.setState({ currentNotes: resData.newNoteList, editingNote: false, newNote: newNote})
            })
            .catch( err => {
                  console.log(err)
            })
          
    }

    toggleShowNoteHandler = noteId => {
        const {currentNotes} = this.state;
        currentNotes.forEach(note => {
            if(note._id === noteId){
                note.show = !note.show
            }
        })
        this.setState({ currentNotes})
    }


    render() {
        const { currentNotes, editUserPhone,  editingNote, newNote, userStatus, userPhone  } = this.state
        const { user } = this.props;
        return (
            <div className="messagesUserInfos">
                <header className="messagesUserInfos__header">
                    <div className="messagesUserInfos__header__name">{user.firstName} {user.lastName}</div>
                    <div className={`messagesUserInfos__header__status ${userStatus ? 'active' : 'away'}`}>
                        {userStatus ? 'active' : 'away'}
                    </div>
                </header>

                <div className="messagesuserInfos__contact">
                    <div className="messagesUserInfo__contact__group">
                        <IconSvg icon="email"/>
                        <span>{user.email}</span>
                    </div>
                  
                    <div className="messagesUserInfo__contact__group messagesUserInfo__contact__group--editable">               
                        <IconSvg icon="phone"/>
                        <div className={`messagesUserInfo__contact__group__value ${editUserPhone ? 'edit':'' }`}
                            onClick={() => this.editPhoneNumberStateHandler(true)}>
                            <div className="messagesUserInfo__contact__group__value--value">{userPhone && userPhone !== '' ? userPhone : 'N.D.'}</div>
                            <input className="messagesUserInfo__contact__group__value--input"
                                   value={userPhone !== undefined ? userPhone: ''}
                                   onChange={e => this.editPhoneNumber(e.target.value)}/>
                        </div>                      
                    </div>

                    <div className={`messagesUserInfo__contact__cta
                                    ${editUserPhone ? 'show': ''}`}>
                        <Button color="primary"
                                onClick={this.saveUserPhoneNumberHandler}>
                            Save
                        </Button>
                        <Button color="primary"
                                onClick={() => this.editPhoneNumberStateHandler(false)}>
                            Cancel
                        </Button>
                    </div>
                </div>

                <section className="messagesUserInfos__notes"> 

                    <div className="messagesUserInfos__notes__title">
                        <span>Notes</span>
                        <div className="messagesUserInfos__notes__title__icon">
                            <IconSvg icon="add"
                                     onClick={this.toggleAddingNewNoteHandler}
                            />
                        </div>
                        
                    </div>

                    {editingNote && (
                        <form className="messagesUserInfos__notes__form"
                          onSubmit={e => this.submitNewNoteHandler(e)}>
                        <div className="messagesUserInfos__notes__form__title">New note</div>
                        <input className="messagesUserInfos__notes__form__input"
                               value={newNote.title}
                               placeholder='Title' 
                               onChange={e => this.editNewNoteHandler('title', e.target.value)}       
                        />
                        <textarea className="messagesUserInfos__notes__form__textarea"
                               value={newNote.text}
                               placeholder='Details...'  
                               onChange={e => this.editNewNoteHandler('text', e.target.value)}
                        />
                        
                        <div className="messagesUserInfos__notes__form__cta">
                                <Button color="primary" type="submit">
                                    Add
                                </Button>
                                <Button color="primary"
                                        onClick={this.toggleAddingNewNoteHandler}>
                                    Cancel
                                </Button>
                        </div>
                    </form>
                    )}
                    

                    {currentNotes && !editingNote && (
                        <ul className="messagesUserInfos__notes__list">
                            {currentNotes.map( note => (
                                <li key={note._id} className={`messagesUserInfos__notes__list__item
                                                            ${note.show ? 'show' : ''}`}>
                                    <div className={`messagesUserInfos__notes__list__item__title`}
                                         onClick={() => this.toggleShowNoteHandler(note._id)}>
                                        <span>{note.title}</span>

                                        <div className="messagesUserInfos__notes__list__item__title__cta">
                                            <IconSvg icon="pencil"
                                                     onClick={() => this.updateCurrentNote(note._id, note.title, note.text)}/>
                                            <IconSvg icon="bin" 
                                                    onClick={() => this.deleteNoteHandler(note._id)}/>
                                        </div>

                                    </div>
                                    <p className="messagesUserInfos__notes__list__item__text">
                                        {note.text}
                                    </p>
                                </li>
                            ))}
                            
                        </ul>
                    )}
                    
                </section>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        adminName: state.auth.adminName
    }
}

export default connect(mapStateToProps)(MessagesUserInfos)
