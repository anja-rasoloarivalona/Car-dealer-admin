import React from 'react';
import Button from '../../components/button/Button';
import Input from '../../components/formInput/FormInput';
import Title from '../../components/title/Title'

const SuppliersForm = props => {

    let addSupplierForm = props.addSupplierForm,
        responsiblesForm = props.responsiblesForm

    return (
        <form className="suppliers__form"
                      onSubmit={e => props.addSupplierHandler(e, addSupplierForm, responsiblesForm)}>
                    <Title title=" Add supplier">
                        <div className="suppliers__addButton"
                              onClick={() => props.supplierCurrentViewHandler('suppliersList')}>
                            List
                        </div>
                    </Title>                  
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
                                onChange={props.addSupplierFormChangeHandler}
                                formType='addSupplierForm'
                            />
                        ))
                    }



                    <div className="suppliers__form__add-responsible">
                        <h2 className="suppliers__form__add-responsible__title">Responsible</h2>
                        <div className="suppliers__form__add-responsible__cta"
                             onClick={props.addResponsibleHandler}>+</div>
                    </div>

                    {

                        Object.keys(responsiblesForm).length > 0 && Object.keys(responsiblesForm).map( (responsible, index) => {   
                  

                       return (
                           <div className="suppliers__form__responsible"
                                key={index}>
                                <h3 className="suppliers__form__responsible__rank">{responsible}</h3>
                                {
                                    Object.keys(responsiblesForm[responsible]).map((input, index) => (
                                        <Input 
                                            className="suppliers__form__responsible__input"
                                            label={input}
                                            key={index}
                                            id={responsible}
                                            placeholder={input}
                                            control = 'input'
                                            type={responsiblesForm[responsible][input].type}
                                            value={responsiblesForm[responsible][input].value}
                                            onChange={props.responsibleInputHandler.bind(this, input)}
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
                            {props.editingMode ? 'Update' : 'Add'}
                        </Button>
                    </div>
                </form>
    )
}

export default SuppliersForm
