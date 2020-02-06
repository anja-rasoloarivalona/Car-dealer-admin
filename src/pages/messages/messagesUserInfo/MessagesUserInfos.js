import React, { Component } from 'react';
import './MessagesUserInfos.css';
import IconSvg from '../../../utilities/svg/svg';
import {timeStampGenerator} from '../../../utilities/timeStampGenerator';
import Button from '../../../components/button/Button';
import { connect } from 'react-redux'

 class MessagesUserInfos extends Component {

    state = {  
        currentNotes: null,

        editingNote: false,

        newNote: {
            title: '',
            text: ''
        },

        userPhone: '',

        headerEditingMode: false,
    }

    componentDidMount(){
        let user = this.props.user;
        user.notes.forEach(note => {
            note.show = false
        })
        this.setState({ currentNotes: user.notes})
    }

    componentDidUpdate(prevProps){
        if(prevProps.user._id !== this.props.user._id){
            let user = this.props.user;
            user.notes.forEach(note => {
                note.show = false
            })
            this.setState({ currentNotes: user.notes}, () => console.log('infos', this.state.currentNotes))
        }
    }

    toggleEditPhoneNumber = () => {
        if(!this.state.headerEditingMode){
            this.setState({ headerEditingMode: !this.state.headerEditingMode})
        }
        
    }

    editPhoneNumber = value => {
        this.setState({ userPhone: value})
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
        this.setState(prevState => ({
            ...prevState,
            editingNote: !prevState.editingNote
        }))
    }

    updateCurrentNote = (noteId, title, text) => {
        let note = {
            title,
            text,
            noteId
        }
        this.setState({ newNote: note, editingNote: true})
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
                  this.setState({ currentNotes: resData.newNoteList, editingNote: false})
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
        const { currentNotes, headerEditingMode, editingNote, newNote,  } = this.state
        const { user } = this.props;
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
                            <div className="messagesUserInfo__contact__group__value--value">{user.phoneNumber ? user.phoneNumber : 'N.D.'}</div>
                            <input className="messagesUserInfo__contact__group__value--input"
                                   value={this.state.userPhone}
                                   onChange={e => this.editPhoneNumber(e.target.value)}/>
                        </div>
                        
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
                               placeholder='title' 
                               onChange={e => this.editNewNoteHandler('title', e.target.value)}       
                        />
                        <textarea className="messagesUserInfos__notes__form__textarea"
                               value={newNote.text}
                               placeholder='text'  
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
                                <li key={note._id} className="messagesUserInfos__notes__list__item">

                                    <div className="messagesUserInfos__notes__list__item__title"
                                         onClick={() => this.toggleShowNoteHandler(note._id)}>
                                        <span>{note.title}</span>

                                        <div className={`messagesUserInfos__notes__list__item__title__cta
                                                        ${note.show ? 'show' : ''}` }>
                                            <IconSvg icon="pencil"
                                                     onClick={() => this.updateCurrentNote(note._id, note.title, note.text)}/>
                                            <IconSvg icon="bin" />
                                        </div>

                                    </div>
                                    <p className={`messagesUserInfos__notes__list__item__text
                                                ${note.show ? 'show' : ''}`}>
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
