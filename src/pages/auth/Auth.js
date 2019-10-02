import React, { Component , Fragment} from 'react'
import './Auth.css';

import Login from './login/Login';
import Signup from './signup/Signup';


import Loader from '../../components/loader/Loader';


class Auth extends Component {

    state= {
        requestedForm: 'signup',
        loading: false,
        error: false
    }




    setRequestedForm = requested => {
        this.setState({ requestedForm: requested})
    }

    setLoadingToTrue = () => {
        this.setState({ loading: true})
    }

    setLoadingToFalse = () => {
        this.setState( { loading: false})
    }

    setErrors = () => {
        this.setState({ error: true})
    }

    resetErrors = () => {
        this.setState({ error: false})
    }





    render() {
        return (
            <Fragment>
                {
                    this.state.loading === true && <Loader />
                }
            <section className="auth">
                  
                  <div className="auth__container">

                        {
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
                        }

                      


                      {
                          this.state.requestedForm === 'signup' && (
                          <Signup setLoadingToTrue={this.setLoadingToTrue}
                                  setLoadingToFalse = {this.setLoadingToFalse}
                                  setErrors={this.setErrors}
                                  resetErrors={this.resetErrors}
                                  requestLoginForm={() => this.setRequestedForm('login')}/>
                          )
                      }

                      {
                          this.state.requestedForm === 'login' && (
                              <Login setLoadingToTrue={this.setLoadingToTrue}
                                        setLoadingToFalse = {this.setLoadingToFalse}
                                        setErrors={this.setErrors}
                                        resetErrors={this.resetErrors}/>
                          )
                      }
                      
                      
                  </div>
          </section>
            </Fragment>
            
        )
    }
}



export default Auth;
