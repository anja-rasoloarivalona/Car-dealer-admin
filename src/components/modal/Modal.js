import React from 'react';
import './Modal.css';
import Button from '../button/Button';

const modal = props => 
    (
        <section className='modal'>
            <header className="modal__header">
                <h1>{props.title}</h1>
            </header>
            <div className="modal__body">{props.children}</div>
            <div className="modal__cta">
                <Button onClick={props.onCloseModal}
                        color='primary'>
                    OK
                </Button>
            </div>
        </section>
    )


export default modal