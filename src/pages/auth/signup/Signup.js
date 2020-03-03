import React, { Component  } from 'react';
import Input from '../../../components/formInput/FormInput';
import Button from '../../../components/button/Button';
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

            email: {
                value: '',
                errorLabel: 'An email'
            },

            password:{
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

    submitHandler = (e ) => {

        const {signupForm} = this.state
        
        e.preventDefault();

        this.props.setLoadingToTrue()

        let data  = {
            email: signupForm.email,
            firstName: signupForm.firstName,
            lastName: signupForm.lastName,
            password: signupForm.password,
            confirm_password: signupForm.confirm_password
        }
        const errors = validator(data)

        if(errors.length > 0){
            this.setState({ error: errors })
            this.props.setLoadingToFalse()
            this.props.setErrors()
            return 
        }

        const formData = new FormData();


        formData.append('firstName', signupForm.firstName.value);
        formData.append('lastName', signupForm.lastName.value);
        formData.append('email', signupForm.email.value);
        formData.append('password', signupForm.password.value)

        fetch('https://africauto.herokuapp.com/admin/signup', {
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
                    onSubmit={e => this.submitHandler(e)} 
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
                            id='email'
                            value={this.state.signupForm['email'].value}
                            onChange={this.inputChangeHandler}
                            placeholder='email'
                            border
                            autoComplete="nope"
                        
                            required={true}/>

                    <Input  type='password'
                            control='input'
                            label='mot de passe'
                            id='password'
                            value={this.state.signupForm['password'].value}
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
                        autoComplete = 'new-password'
                        value={this.state.signupForm['confirm_password'].value}
                        onChange={this.inputChangeHandler}
                    />
            </ul>

            <div className="auth__button">
                <Button color='primary' type='submit'>
                    Add Admin
                </Button>
            </div>
            
        </form>


            )
        }


        return form
            
    }
}

export default Signup;
