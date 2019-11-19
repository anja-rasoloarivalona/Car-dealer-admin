import React, { Component } from 'react';
import './Suppliers.css';
import Input from '../../components/formInput/FormInput';
import Button from '../../components/button/Button';


class Suppliers extends Component {

    state = {
        addSupplierForm: {
            name: {
                value: ''
            },

            email: {
                value: '',
                type: 'email'
            },

            phoneNumber: {
                value: ''
            },

            address: {
                value: ''
            }
        },

        responsiblesForm: {}
    }


    inputChangeHandler = (input, value) => {
            this.setState(prevState => {
                const updatedForm = {
                    ...prevState.addSupplierForm,
                    [input]:{
                        ...prevState.addSupplierForm[input],
                        value: value
                    }
                }
                return {
                    addSupplierForm: updatedForm
                }
            })   
    }

    responsibleInputHandler = (input, responsible, value) => {

        this.setState(prevState => {
            const updatedForm = {
                ...prevState.responsiblesForm,
                [responsible]: {
                    ...prevState.responsiblesForm[responsible],
                    [input] : {
                        ...prevState.responsiblesForm[responsible][input],
                        value: value
                    }
                    
                }
            }
            return {
                responsiblesForm: updatedForm
            }
        }, () => console.log('test', this.state))
    }

    addSupplierHandler = (e, addSupplierForm, responsiblesForm) => {
        e.preventDefault();

        let url = 'http://localhost:8000/suppliers/add-supplier';
        let method = 'POST';

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: addSupplierForm.name.value,
                email: addSupplierForm.email.value,
                phoneNumber: addSupplierForm.phoneNumber.value,
                address: addSupplierForm.address.value,
                responsibles: responsiblesForm
            })
        })
        .then( res => {
            if(res.status === 422){
                throw new Error('Add supplier failed')
            }         

            if(res.status !== 200 && res.status !== 201){
                throw new Error('Could not add supplier')
            }

            return res.json()
        })
        .then( resData => {
            console.log('adding supplier resData',resData)
        })
        .catch( err => {
            console.log(err)
        })
    }

    addResponsibleHandler = () => {
        let currentResponsibles = this.state.responsiblesForm;
        let numberOfCurrentResponsibles = Object.keys(currentResponsibles).length;

        let newResponsible = `0${numberOfCurrentResponsibles+1}-Responsible`

         currentResponsibles = {
            ...currentResponsibles,
            [newResponsible] : {
                name: {
                    value: '',
                    type: 'text'
                },
                email: {
                    value: '',
                    type: 'email'
                },
                phoneNumber: {
                    value: '',
                    type: 'text'
                },
                title: {
                    value: '',
                    type: 'text'
                }
            }
        }

        this.setState({ responsiblesForm: currentResponsibles})
       
    }

    render() {

        const {addSupplierForm, responsiblesForm} = this.state;

        return (
            <div className="suppliers">
                
                <form className="suppliers__form"
                      onSubmit={e => this.addSupplierHandler(e, addSupplierForm, responsiblesForm)}>
                    <h1 className="app__primary__title">Add supplier</h1>
                    {
                        Object.keys(addSupplierForm).map(input =>(
                            <Input 
                                className="add-product__input"
                                label={input}
                                key={input}
                                id={input}
                                placeholder={input}
                                control = 'input'
                                type={addSupplierForm[input].type}
                                value={addSupplierForm[input].value}
                                onChange={this.inputChangeHandler}
                                formType='addSupplierForm'
                            />
                        ))
                    }



                    <div className="suppliers__form__add-responsible">
                        <h2 className="suppliers__form__add-responsible__title">Responsible</h2>
                        <div className="suppliers__form__add-responsible__cta"
                             onClick={this.addResponsibleHandler}>+</div>
                    </div>

                    {

                        Object.keys(responsiblesForm).length > 0 && Object.keys(responsiblesForm).map(responsible => {   
                            
                       return (
                           <div className="suppliers__form__responsible">
                                <h3 className="suppliers__form__responsible__rank">{responsible}</h3>
                                {
                                    Object.keys(responsiblesForm[responsible]).map(input => (
                                        <Input 
                                            className="suppliers__form__responsible__input"
                                            label={input}
                                            key={input}
                                            id={responsible}
                                            placeholder={input}
                                            control = 'input'
                                            type={responsiblesForm[responsible][input].type}
                                            value={responsiblesForm[responsible][input].value}
                                            onChange={this.responsibleInputHandler.bind(this, input)}
                                            formType='responsiblesForm'
                                        />
                                    ))
                                }
                           </div>
                            )
                        })   
                        
                        
                    }

                    <div className="suppliers__form__cta">
                        <Button color="primary" type='submit'>
                            Add
                        </Button>
                    </div>
                </form>
            </div>
        )
    }
}


export default Suppliers;