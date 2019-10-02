import React, { Component  } from 'react';
import Input from '../../../components/formInput/FormInput';
import Button from '../../../components/button/Button';
import './Signup.css';
import { validator } from '../../../utilities/validators';
import ErrorHandler from '../../../components/errorHandler/ErrorHandler';

class Signup extends Component {

    state = {
        signupForm: {
            firstName: {
                value: '',
                errorLabel: 'A firstname'
            },
            lastName: {
                value: '',
                errorLabel: 'A lastname'
            },

            userEmail: {
                value: '',
                errorLabel: 'An email'
            },

            userPassword:{
                value: '',
                errorLabel: 'A password'
            },

            confirm_password: {
                value: '',
                errorLabel: 'A confirmation password'
            }
        },
        error: null

        
    }

    componentWillMount(){
        console.log(this.state)
    }

    


    inputChangeHandler = (input, value) => {
        this.setState( prevState => {
            const updatedForm = {
                ...prevState.signupForm,
                [input]: {
                    ...prevState.signupForm[input],
                    value: value
                }
            }

            return {
                signupForm: updatedForm
            }
        })
    }

    submitHandler = (e, signupFormData) => {
        
        e.preventDefault();

        this.props.setLoadingToTrue()


        const errors = validator(
            signupFormData.userEmail,
            signupFormData.userPassword,
            signupFormData.confirm_password,
            signupFormData.firstName,
            signupFormData.lastName
        )

        if(errors.length > 0){
            this.setState({ error: errors })
            this.props.setLoadingToFalse()
            this.props.setErrors()
            return 
        }

        const formData = new FormData();


        formData.append('firstName', signupFormData.firstName.value);
        formData.append('lastName', signupFormData.lastName.value);
        formData.append('email', signupFormData.userEmail.value);
        formData.append('password', signupFormData.userPassword.value)

        fetch('http://localhost:8000/auth/signup', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(Object.fromEntries(formData))
        })
        .then( res => {
            if(res.status === 422){
                throw new Error (
                    "Make sure the email isn't used yet"
                )
            }

            if(res.status !== 200 && res.status !== 201){
                throw new Error ( ' Creating a user failed')
            }

            return res.json()
        })
        .then(resData => {
            this.props.setLoadingToFalse()
            this.props.requestLoginForm()
        })
        .catch( err => {
            let error = []
            error.push(err.message)
            this.props.setLoadingToFalse()
            this.props.setErrors()
            this.setState({ error: error})
        })

    }

    closeErrorHandler = () => {
        this.setState({ error: null});
        this.props.resetErrors()
    }

    

    render() {

        let form;

        if(this.state.error ) {
            form = <ErrorHandler error = {this.state.error}
                    onCloseError={this.closeErrorHandler}/>
        } else {
            form = (
            
            <form className= 'auth__form auth__form--signup'
                    onSubmit={e => this.submitHandler(e, this.state.signupForm)} 
                    autoComplete="off"
                    noValidate>       
            <ul className="auth__input__list">

                    <Input type='text'
                            control='input'
                        id='firstName'
                        value={this.state.signupForm['firstName'].value}
                        label='prénom'
                        onChange={this.inputChangeHandler}
                        placeholder='prénom'
                        border
                        required={true}/>
                    
                    <Input  type='text'
                            control='input'
                            label='nom'
                            id='lastName'
                            value={this.state.signupForm['lastName'].value}
                            onChange={this.inputChangeHandler}
                            placeholder='nom'
                            border
                            required={true}/>


                        <Input  type='email'
                            control='input'
                            label='email'
                            id='userEmail'
                            value={this.state.signupForm['userEmail'].value}
                            onChange={this.inputChangeHandler}
                            placeholder='email'
                            border
                            required={true}/>

                    <Input  type='password'
                            control='input'
                            label='mot de passe'
                            id='userPassword'
                            value={this.state.signupForm['userPassword'].value}
                            onChange={this.inputChangeHandler}
                            placeholder='mot de passe'
                            border
                            autoComplete = 'new-password'
                            required={true}/>
                    <Input 
                        id='confirm_password'
                        label='confirmer mot de passe'
                        placeholder='confirmer mot de passe'
                        type='password'
                        control='input' 
                        required={true}
                        border
                        value={this.state.signupForm['confirm_password'].value}
                        onChange={this.inputChangeHandler}
                    />
            </ul>

            <div className='signup__options'>
                <div className="signup__options--1">
                    Déjà un compte ?
                </div>
            </div>

            <div className="auth__button">
                <Button color='primary' type='submit'>
                    Sign up
                </Button>
            </div>
            
        </form>


            )
        }


        return form
            
    }
}

export default Signup;
