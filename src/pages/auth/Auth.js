import React, { Component } from 'react'
import './Auth.css';

import Login from './login/Login';
import Signup from './signup/Signup';


import Loader from '../../components/loader/Loader';


class Auth extends Component {

    state= {
        // requestedForm: 'signup',
        loading: false,
        error: false
    }


    // setRequestedForm = requested => {
    //     this.setState({ requestedForm: requested})
    // }

    setLoadingToTrue = () => {
        this.setState({ loading: true})
    }

    setLoadingToFalse = () => {
        this.setState( { loading: false})
    }

    render() {
        return (
            <section className="auth">            
                  <div className="auth__container">
                    <div className="auth__controller">
                        <div className={`auth__controller__button `}>
                            Login
                        </div>
                    </div>
                  <Login setLoadingToTrue={this.setLoadingToTrue}
                         setLoadingToFalse = {this.setLoadingToFalse}
                    />
                        {/* {
                            this.state.error === false && (
                            <div className="auth__controller">
                                <div className={`auth__controller__button 
                                                ${this.state.requestedForm === 'signup' ? 'active' : ''}`} 
                                    onClick={() => this.setRequestedForm('signup')}>
                                    Signup
                                </div>
                                <div className={`auth__controller__button 
                                                ${this.state.requestedForm === 'login' ? 'active' : ''}`}
                                    onClick={() => this.setRequestedForm('login')}>
                                    Login
                                </div>
                            </div>
                            )
                        } */}

                   

                      {/* {
                          this.state.requestedForm === 'signup' && (
                          <Signup setLoadingToTrue={this.setLoadingToTrue}
                                  setLoadingToFalse = {this.setLoadingToFalse}
                                  setErrors={this.setErrors}
                                  resetErrors={this.resetErrors}
                                  requestLoginForm={() => this.setRequestedForm('login')}/>
                          )
                      } */}        
                  </div>
          </section>
        )
    }
}



export default Auth;
