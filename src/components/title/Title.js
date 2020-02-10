import React from 'react'
import './Title.css'

const Title = props => {
    return (
        <div className="app__titleContainer">
            <h1 className="app__title app__title--primary">
                {props.title}
            </h1>
            {props.children}
        </div>
    )
}

export default Title
