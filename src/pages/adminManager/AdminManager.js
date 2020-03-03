import React, { Component } from 'react'
import AddAdmin from '../../pages/auth/signup/Signup';
import './AdminManager.css'

class AdminManager extends Component {

    state= {
        loading: false,
        error: false
    }

    setLoadingToTrue = () => {
        this.setState({ loading: true})
    }

    setLoadingToFalse = () => {
        this.setState( { loading: false})
    }


    render() {
        return (
            <section className="admin-manager">            
                <AddAdmin setLoadingToTrue={this.setLoadingToTrue}
                            setLoadingToFalse = {this.setLoadingToFalse}
                            // setErrors={this.setErrors}
                            // resetErrors={this.resetErrors}
                />

          </section>
        )
    }
}

export default  AdminManager
