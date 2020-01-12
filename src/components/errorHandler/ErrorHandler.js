import React, { Component } from 'react'
import './ErrorHandler.css'
import * as actions from '../../store/actions';
import { connect } from 'react-redux'
import IconSvg from '../../utilities/svg/svg';
import Button from '../button/Button'

class ErrorHandler extends Component {

    componentDidMount(){
      setTimeout(this.closeErrorHandler, 8000);
     
    }

    closeErrorHandler = () => {
        this.props.setError(null)
    }
    render() {
        let errorHandler = null;
        if(this.props.errors){
            errorHandler = (
                <div className='error'> 
                    <div className="error__header">
                        <span>Something went wrong</span>
                        <IconSvg icon="error" />
                    </div>        
                    {this.props.errors && this.props.errors.map( (error, index) => (
                    <div key={index}
                         className="error__text">
                        {error}
                    </div>
                ))}

                <div className="error__cta">
                    <Button color='primary'
                            onClick={() => this.closeErrorHandler()}>
                        OK
                    </Button>
                </div>
               
            </div>
            )
        }
        return errorHandler; 
    }
}

const mapStateToProps = state => {
    return {
        errors: state.error.errors
    }
}

const mapDispatchToProps = dispacth => {
    return {
        setError: (data) => dispacth(actions.setError(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ErrorHandler)
