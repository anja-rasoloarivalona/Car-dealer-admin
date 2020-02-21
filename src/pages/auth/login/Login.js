import React, { Component } from 'react';
import Input from '../../../components/formInput/FormInput';
import Button from '../../../components/button/Button';
import './Login.css';
import { validator} from '../../../utilities/validators';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';



 class Login extends Component {

    state= {
        loginForm: {
            email: {
                value: ''
            },

            password:{
                value: ''
            }
        },
    }

    inputChangeHandler = (input, value) => {
        this.setState( prevState => {
            const updatedForm = {
                ...prevState.loginForm,
                [input]: {
                    ...prevState.loginForm[input],
                    value: value
                }
            }

            return {
                loginForm: updatedForm
            }
        })
    }

    loginHandler = (e, loginFormData) => {
        e.preventDefault();
        this.props.setLoadingToTrue();
        this.props.setError(null)

  

      if(loginFormData){
            const errors = validator(loginFormData)
            if(errors.length > 0){
                this.props.setError(errors);
                this.props.setLoadingToFalse()
                return 
            }
        }


        fetch('http://localhost:8000/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: loginFormData.email.value,
                password: loginFormData.password.value
            })
        })
        .then( res => {
            console.log('reeees');

            if(res.status === 422){
                throw new Error('validation failed')
            }
            
            if(res.status === 401){
                throw new Error('Wrong email or password')
            }

            if(res.status !== 200 && res.status !== 201){
                throw new Error('Could not authenticate you')
            }

            return res.json()
        })
        .then( resData => {
                this.props.loginSucceeded(resData);



                localStorage.setItem('woto-admin-token', resData.token);
                localStorage.setItem('woto-admin-adminId', resData.userId);
                localStorage.setItem('woto-admin-adminName', resData.adminName)

                const remainingMilliSeconds =  60 * 60 * 1000 //1hour
                const expiryDate = new Date( new Date().getTime() + remainingMilliSeconds )

                localStorage.setItem('woto-admin-expiryData', expiryDate.toISOString());

                this.props.setLoadingToFalse()

        })
        .catch( err => {
            this.props.setError(err)
            this.props.loginFailed()
            this.props.setLoadingToFalse()
           
        })


    }



    


    render() {     
        return (
            <form className= 'auth__form auth__form--login' 
                   onSubmit={e => this.loginHandler(e, this.state.loginForm)}
                   noValidate
                   autoComplete="off">
                <ul className="auth__input__list">

                            <Input  type='email'
                                control='input'
                                label='email'
                                id='email'
                                value={this.state.loginForm['email'].value}
                                onChange={this.inputChangeHandler}
                                placeholder='email'
                                border
                                required={true}/>

                        <Input  type='password'
                                control='input'
                                label='mot de passe'
                                id='password'
                                value={this.state.loginForm['password'].value}
                                onChange={this.inputChangeHandler}
                                placeholder='mot de passe'
                                border
                                required={true}
                                autoComplete = 'new-password'/>
                </ul>

                {/* <div className='login__options'>
                    <div className="login__options--1" >
                        Mot de passe oublié
                    </div>
                    <div className="login__options--1">
                        Pas encore membre ?
                    </div>
                </div> */}

                <div className="auth__button">
                    <Button color='primary' type='submit'>
                        Login
                    </Button>
                </div>
            
        </form>
         )
    }
}


const mapDispatchToProps = dispatch => {
    return {
        loginSucceeded: (data) => dispatch(actions.loginSucceeded(data)),
        loginFailed: () => dispatch(actions.loginFailed()),
        setError: (data) => dispatch(actions.setError(data))
    }
}

export default connect(null, mapDispatchToProps)(Login);
