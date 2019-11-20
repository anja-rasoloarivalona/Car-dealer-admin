import React, { Component } from 'react';
import './Suppliers.css';
import Loader from '../../components/loader/Loader';
import SuppliersList from './SuppliersList';
import SuppliersForm from './SuppliersForm'

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

        responsiblesForm: {},

        suppliers: null,
        loading: true,

        currentView: 'suppliersList',

        editingMode: false,
        currentSupplierBeingEditedId: null
    }

    componentDidMount(){
        this.fetchSuppliers()
    }

    fetchSuppliers = () => {
        let url = 'http://localhost:8000/suppliers';  

        fetch(url, {
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(res => {
            if(res.status !== 200 && res.status !== 201){
                throw new Error('Could not fetch suppliers')
            }

            return res.json()
        })
        .then(resData => {

            let suppliers = resData.suppliers;

            suppliers.forEach(supplier => {
                supplier.currentView = 'contacts'
            })

            this.setState({suppliers: suppliers, loading: false }, () => console.log(this.state))
      
        })
        .catch( err => {
            console.log(err)
        })
    }

    addSupplierHandler = (e, addSupplierForm, responsiblesForm) => {
        e.preventDefault();

        const {editingMode, currentSupplierBeingEditedId, suppliers} = this.state;

        let url = 'http://localhost:8000/suppliers/add-supplier';
        let method = 'POST';
        let body = {
                name: addSupplierForm.name.value,
                email: addSupplierForm.email.value,
                phoneNumber: addSupplierForm.phoneNumber.value,
                address: addSupplierForm.address.value,
                responsibles: responsiblesForm
        }

        if(editingMode){
            method = 'PUT';
            url = 'http://localhost:8000/suppliers/edit-supplier';
            body = {...body, _id: currentSupplierBeingEditedId}
        }

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
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

            let newSuppliersList = [];

            if(editingMode){
              let editedSupplierIndex = suppliers.findIndex(supplier => supplier._id === resData.supplier._id);
              newSuppliersList = [...suppliers];
              newSuppliersList[editedSupplierIndex] = resData.supplier

            } else {       
                if(suppliers !== null){
                     newSuppliersList = [
                        ...suppliers,
                        resData.supplier
                    ]
                } else {
                    newSuppliersList = [resData.supplier]
                }
            }

            this.setState({ suppliers: newSuppliersList, currentView: 'suppliersList' }, () => this.resetFormHandler())

        })
        .catch( err => {
            console.log(err)
        })
    }



    addSupplierFormChangeHandler = (input, value) => {
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

    supplierNavigationHandler = (id, requestedView) => {
        let suppliers = this.state.suppliers;

        suppliers.forEach(supplier => {
            if(supplier._id === id){
                supplier.currentView = requestedView
            }
        })

        this.setState({ suppliers})
    }

    resetFormHandler = () => {

        console.log('reseting form')

      let  addSupplierForm = {
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
        };

        let responsiblesForm = {};

        this.setState({ 
            addSupplierForm : addSupplierForm, 
            responsiblesForm : responsiblesForm, 
            editingMode: false, 
            currentView: 'suppliersList',
            currentSupplierBeingEditedId: null})
    }


    supplierCurrentViewHandler = view => {
        if(view === 'suppliersList' && this.state.editingMode === true){
            this.resetFormHandler()
        } else {
            this.setState({ currentView: view})
        }
    }

    editSupplierHandler = supplier => {

        let addSupplierForm = {
            name: {
                value: supplier.name
            },

            email: {
                value: supplier.email,
                type: 'email'
            },

            phoneNumber: {
                value: supplier.phoneNumber
            },

            address: {
                value: supplier.address
            },
        }

        let responsibles = supplier.responsibles;

        let responsiblesForm = {}

        responsibles.map( (responsible, index) => {

            let newResponsible = `0${index+1}-Responsible`

            responsiblesForm = {
                ...responsiblesForm,
                [newResponsible]: {
                    name: {
                        value: responsible.name,
                        type: 'text'
                    },
                    email: {
                        value: responsible.email,
                        type: 'email'
                    },
                    phoneNumber: {
                        value: responsible.phoneNumber,
                        type: 'text'
                    },
                    title: {
                        value: responsible.title,
                        type: 'text'
                    }
                }

            }
        })

        this.setState({
            addSupplierForm: addSupplierForm,
            responsiblesForm: responsiblesForm,
            currentView: 'suppliersForm',
            editingMode: true,
            currentSupplierBeingEditedId: supplier._id
        })

      

    }

    render() {

        const {addSupplierForm, responsiblesForm, suppliers, loading, currentView, editingMode} = this.state;

        let suppliersList = <Loader />
        if(!loading){
            suppliersList = <SuppliersList suppliers={suppliers}
                                           supplierNavigationHandler={this.supplierNavigationHandler}
                                           supplierCurrentViewHandler={this.supplierCurrentViewHandler} 
                                           
                                           editSupplierHandler={this.editSupplierHandler}/>
        }

        let suppliersForm =  <SuppliersForm addSupplierForm ={addSupplierForm}
                                            responsiblesForm = {responsiblesForm}
                                            addSupplierHandler={this.addSupplierHandler}
                                            editingMode={editingMode}

                                            addResponsibleHandler={this.addResponsibleHandler}                       
                                            addSupplierFormChangeHandler={this.addSupplierFormChangeHandler}
                                            responsibleInputHandler={this.responsibleInputHandler}

                                            supplierCurrentViewHandler={this.supplierCurrentViewHandler}/>

        return (
            <div className="suppliers">

                {currentView === 'suppliersList' && suppliersList}

                {currentView === 'suppliersForm' && suppliersForm}               
                
            </div>
        )
    }
}


export default Suppliers;